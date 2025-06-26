"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { fetchSensorData } from "@/lib/fetchSensorData";
import AppHeader from "@/components/AppHeader";
import Sidebar from "@/components/Sidebar";
import { getNavItems } from "@/components/navItems";
import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  DownloadIcon,
  TemperatureIcon,
  HumidityIcon,
  LightIntensityIcon,
  MoistureIcon,
} from "@/components/Icon";
import ProtectedRoute from "@/components/ProtectedRoute";

interface SensorDatum {
  timestamp: number;
  temperature: number;
  humidity: number;
  light: number;
  moisture: number;
  timeFormatted?: string;
}

export default function DataHistory() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("Environmental Trends");
  const [selectedPeriod, setSelectedPeriod] = useState("Latest");
  const navItems = getNavItems("/data");

  // State untuk data asli dari backend
  const [data, setData] = useState<SensorDatum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data sensor dari backend
  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const result = await fetchSensorData(user.uid);
      setData(result);
      setError(null);
    } catch (err) {
      setError("Gagal memuat data sensor");
    } finally {
      setLoading(false);
    }
  };

  // Panggil fetchdata di useEffect
  useEffect(() => {
    loadData();
    // (opsional) polling setiap 10 detik:
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, [user]);

  // Chart reusable
  type ChartProps = {
    title: string;
    dataKey: keyof SensorDatum;
    color: string;
    colorClass: string;
    unit: string;
    Icon: React.FC;
  };

  // Padding Y-Axis agar grafik tidak terlalu ketat
  function getYAxisDomain(data: SensorDatum[], key: keyof SensorDatum) {
    const vals = data.map((d) => d[key] as number);
    let min = Math.min(...vals);
    let max = Math.max(...vals);
    if (min === max) {
      min = min - 1;
      max = max + 1;
    } else {
      const padding = (max - min) * 0.05;
      min = min - padding;
      max = max + padding;
    }
    return [min, max];
  }

  const Chart = ({
    title,
    dataKey,
    color,
    colorClass,
    unit,
    Icon,
  }: ChartProps) => (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <Icon />
        <h3 className="text-lg font-medium text-gray-900 ml-3">{title}</h3>
      </div>
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <ResponsiveContainer width="100%" height={260}>
          <ReLineChart data={data}>
            <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
            <XAxis
              dataKey="timeFormatted"
              tick={{ fontSize: 12 }}
              minTickGap={10}
            />
            <YAxis
              unit={unit}
              domain={getYAxisDomain(data, dataKey)}
              tick={{ fontSize: 12 }}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </ReLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const periods = [
    "Latest",
    "Last Hour",
    "6 Hours",
    "1 Day",
    "1 Week",
    "1 Month",
    "3 Months",
    "6 Months",
    "1 Year",
    "Custom",
  ];

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar Global */}
        <Sidebar navItems={navItems} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <AppHeader />

          {/* Data History Content */}
          <main className="flex-1 p-6">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Data History</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab("Environmental Trends")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === "Environmental Trends"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Variabel Lingkungan
                </button>
                <button
                  onClick={() => setActiveTab("Log Aktuator")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === "Log Aktuator"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Log Aktuator
                </button>
              </div>
            </div>

            {/* Export Controls & Period Selector dalam satu baris */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
              <div>
                <span className="text-sm text-gray-600">Select Period:</span>
                <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                  {periods.map((period) => (
                    <button
                      key={period}
                      onClick={() => setSelectedPeriod(period)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedPeriod === period
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <DownloadIcon />
                  <span className="ml-2">Export CSV</span>
                </button>
                <button className="flex items-center px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <DownloadIcon />
                  <span className="ml-2">Export PDF</span>
                </button>
              </div>
            </div>

            {loading && (
              <div className="text-center text-gray-500 py-8">Loading...</div>
            )}
            {error && (
              <div className="text-center text-red-500 py-8">{error}</div>
            )}

            {/* Charts */}
            {activeTab === "Environmental Trends" && !loading && !error && (
              <div className="space-y-8">
                <Chart
                  title="Temperature"
                  dataKey="temperature"
                  color="#ef4444"
                  colorClass="bg-red-500"
                  unit="°C"
                  Icon={TemperatureIcon}
                />
                <Chart
                  title="Air Humidity"
                  dataKey="humidity"
                  color="#3b82f6"
                  colorClass="bg-blue-500"
                  unit="%"
                  Icon={HumidityIcon}
                />
                <Chart
                  title="Light Intensity"
                  dataKey="light"
                  color="#f59e0b"
                  colorClass="bg-yellow-500"
                  unit="lux"
                  Icon={LightIntensityIcon}
                />
                <Chart
                  title="Moisture"
                  dataKey="moisture"
                  color="#10b981"
                  colorClass="bg-green-500"
                  unit="%"
                  Icon={MoistureIcon}
                />
              </div>
            )}

            {activeTab === "Log Aktuator" && (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <p className="text-gray-500">
                  Data Log Aktuator akan terisi secara otomatis saat ada
                  aktivitas pada sistem.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
