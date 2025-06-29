"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useAuth } from "@/context/AuthContext";
import { fetchSensorData } from "@/lib/fetchSensorData";
import AppHeader from "@/components/AppHeader";
import Sidebar from "@/components/Sidebar";
import {
  DownloadIcon,
  TemperatureIcon,
  HumidityIcon,
  LightIntensityIcon,
  MoistureIcon,
} from "@/components/Icon";
import ProtectedRoute from "@/components/ProtectedRoute";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface Period {
  label: string;
  valueInMinutes: number;
}

interface SensorDatum {
  timestamp: number;
  temperature: number;
  humidity: number;
  light: number;
  moisture: number;
  timeFormatted?: string;
}

const periods: Period[] = [
  { label: "30 Menit", valueInMinutes: 30 },
  { label: "1 Jam", valueInMinutes: 60 },
  { label: "3 Jam", valueInMinutes: 3 * 60 },
  { label: "6 Jam", valueInMinutes: 6 * 60 },
  { label: "12 Jam", valueInMinutes: 12 * 60 },
  { label: "24 Jam", valueInMinutes: 24 * 60 },
  { label: "3 Hari", valueInMinutes: 3 * 24 * 60 },
  { label: "7 Hari", valueInMinutes: 7 * 24 * 60 },
];

export default function DataHistory() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("Environmental Trends");
  const [selectedPeriod, setSelectedPeriod] = useState<Period>(periods[0]);
  const [data, setData] = useState<SensorDatum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDataForPeriod = async () => {
      if (!user || !selectedPeriod) return;

      setLoading(true);
      try {
        const result = await fetchSensorData(user.uid, selectedPeriod.valueInMinutes);
        setData(result);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat data sensor");
      } finally {
        setLoading(false);
      }
    };

    loadDataForPeriod();
  }, [user, selectedPeriod]);

  useEffect(() => {
    if (!user) return;

    if (selectedPeriod?.label === "30 Menit") {
      const interval = setInterval(async () => {
        try {
          const result = await fetchSensorData(user.uid, selectedPeriod.valueInMinutes);
          setData(result);
        } catch (err) {
          console.error("Gagal melakukan polling data:", err);
        }
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [user, selectedPeriod]);

  function getYAxisDomain(data: SensorDatum[], key: keyof SensorDatum) {
    const vals = data.map((d) => d[key] as number);
    if (vals.length === 0) return [-1, 1];
    let min = Math.min(...vals);
    let max = Math.max(...vals);
    if (min === max) {
        min = min - 1;
        max = max + 1;
    } else {
        const padding = (max - min) * 0.1;
        min = min - padding;
        max = max + padding;
    }
    return [min, max];
  }

  // --- PERBAIKAN ADA DI DALAM KOMPONEN INI ---
  const ChartCard = ({ title, dataKey, color, Icon, unit, chartData }: { title: string; dataKey: keyof SensorDatum; color: string; Icon: React.FC; unit: string; chartData: SensorDatum[] }) => {
    const yDomain = getYAxisDomain(chartData, dataKey);
    
    // Buat salinan array dengan urutan kronologis (terlama -> terbaru) untuk chart
    const chronologicalData = [...chartData].reverse();

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200 flex items-center">
                <Icon />
                <h3 className={`text-sm font-medium ml-2`} style={{ color }}>{title}</h3>
            </div>
            <div className="p-4">
                <Plot
                    data={[{
                        // Gunakan data yang urutannya sudah benar
                        x: chronologicalData.map((d) => d.timeFormatted ? d.timeFormatted : new Date(d.timestamp).toLocaleString("id-ID")),
                        y: chronologicalData.map((d) => d[dataKey] as number),
                        type: "scatter",
                        mode: "lines+markers",
                        marker: { color },
                        line: { color, width: 3 },
                        name: title,
                    }]}
                    layout={{
                        autosize: true,
                        height: 220,
                        margin: { l: 40, r: 10, t: 10, b: 40 },
                        xaxis: { title: "Waktu", tickmode: "auto", nticks: 8, showgrid: true, zeroline: false },
                        yaxis: { title: unit, range: yDomain, showgrid: true, zeroline: false },
                        plot_bgcolor: "transparent",
                        paper_bgcolor: "transparent",
                        font: { size: 12 },
                    }}
                    config={{ responsive: true, displayModeBar: false }}
                    style={{ width: "100%", height: "220px" }}
                    useResizeHandler
                />
            </div>
        </div>
    );
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar/>
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <main className="flex-1 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Data History</h2>
              <div className="flex space-x-2">
                 {/* ... */}
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
              <div>
                <span className="text-sm text-gray-600">Pilih Periode:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {periods.map((period) => (
                    <button
                      key={period.label}
                      onClick={() => setSelectedPeriod(period)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedPeriod?.label === period.label
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {period.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                 {/* ... */}
              </div>
            </div>

            {loading && <div className="text-center text-gray-500 py-8">Memuat data...</div>}
            {error && <div className="text-center text-red-500 py-8">{error}</div>}

            {activeTab === "Environmental Trends" && !loading && !error && (
              <div className="space-y-8">
                <ChartCard title="Suhu Udara" dataKey="temperature" color="#ef4444" Icon={TemperatureIcon} unit="°C" chartData={data} />
                <ChartCard title="Kelembapan Udara" dataKey="humidity" color="#3b82f6" Icon={HumidityIcon} unit="%" chartData={data} />
                <ChartCard title="Intensitas Cahaya" dataKey="light" color="#f59e0b" Icon={LightIntensityIcon} unit="lux" chartData={data} />
                <ChartCard title="Kelembapan Media" dataKey="moisture" color="#10b981" Icon={MoistureIcon} unit="%" chartData={data} />
              </div>
            )}
             {/* ... */}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}