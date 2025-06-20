"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { signOut } from "firebase/auth";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebaseConfig"; // Menggunakan path yang benar
import AppHeader from "@/components/AppHeader";
import Sidebar from "@/components/Sidebar";
import { getNavItems } from "@/components/navItems";
import {
  HomeIcon,
  GridIcon,
  BellIcon,
  SettingsIcon,
  UserIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  RefreshIcon,
  TemperatureIcon,
  HumidityIcon,
  LightIntensityIcon,
  MoistureIcon,
} from "@/components/Icon";
import { ArrowUp, ArrowDown } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";

const navItems = getNavItems("/");
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

// Tipe union untuk key sensor
type SensorKey = "temperature" | "humidity" | "light" | "moisture";

// Helper untuk membuat data 24 hari terakhir (interval harian)
function generateInitialChartData() {
  const now = new Date();
  const arr = [];
  let temp = 24,
    hum = 85,
    light = 450,
    moist = 75;
  for (let i = 23; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    arr.push({
      name: d.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
      }),
      temperature: temp,
      humidity: hum,
      light: light,
      moisture: moist,
    });
    // Simulasikan perubahan awal
    temp += (Math.random() - 0.5) * 0.5;
    hum += (Math.random() - 0.5) * 0.5;
    light += (Math.random() - 0.5) * 2;
    moist += (Math.random() - 0.5) * 0.5;
  }
  return arr;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [modeAuto, setModeAuto] = useState(true);
  const [fanEnabled, setFanEnabled] = useState(false);
  const [humidifierEnabled, setHumidifierEnabled] = useState(true);
  const [lightEnabled, setLightEnabled] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("1 Month");
  const [chartData, setChartData] = useState(generateInitialChartData());
  const [sensorData, setSensorData] = useState([
    {
      title: "Temperature",
      value: chartData[chartData.length - 1].temperature.toFixed(1),
      unit: "°C",
      status: "Normal",
      trend: "Naik",
    },
    {
      title: "Air Humidity",
      value: chartData[chartData.length - 1].humidity.toFixed(0),
      unit: "%",
      status: "Normal",
      trend: "Naik",
    },
    {
      title: "Light Intensity",
      value: chartData[chartData.length - 1].light.toFixed(0),
      unit: "lux",
      status: "Normal",
      trend: "Naik",
    },
    {
      title: "Medium Moisture",
      value: chartData[chartData.length - 1].moisture.toFixed(0),
      unit: "%",
      status: "Normal",
      trend: "Naik",
    },
  ]);

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

  const ToggleSwitch = ({
    checked,
    onChange,
    disabled = false,
  }: {
    checked: boolean;
    onChange: (val: boolean) => void;
    disabled?: boolean;
  }) => (
    <button
      type="button"
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        checked ? "bg-blue-600" : "bg-gray-200"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );

  // Helper untuk min/max domain YAxis (berdasarkan data dummy, tanpa padding)
  function getYAxisDomain(data: any[], key: SensorKey) {
    const vals = data.map((d) => d[key]);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    return [min, max];
  }

  // Chart Card Component with Icon, menggunakan Plotly
  const ChartCard = ({
    title,
    dataKey,
    color,
    Icon,
    unit,
  }: {
    title: string;
    dataKey: SensorKey;
    color: string;
    Icon: React.FC;
    unit: string;
  }) => {
    const yDomain = getYAxisDomain(chartData, dataKey);
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex items-center">
          <Icon />
          <h3 className={`text-sm font-medium ml-2`} style={{ color }}>
            {title} Trend (24h)
          </h3>
        </div>
        <div className="p-4">
          <Plot
            data={[
              {
                x: chartData.map((d) => d.name),
                y: chartData.map((d) => d[dataKey]),
                type: "scatter",
                mode: "lines+markers",
                marker: { color },
                line: { color, width: 3 },
                name: title,
              },
            ]}
            layout={{
              autosize: true,
              height: 200,
              margin: { l: 40, r: 10, t: 10, b: 40 },
              xaxis: {
                title: "Time",
                tickmode: "auto",
                nticks: 8,
                showgrid: true,
                zeroline: false,
              },
              yaxis: {
                title: unit,
                range: yDomain,
                showgrid: true,
                zeroline: false,
              },
              plot_bgcolor: "#fff",
              paper_bgcolor: "#fff",
              font: { size: 12 },
            }}
            config={{ displayModeBar: false, responsive: true }}
            style={{ width: "100%", height: "200px" }}
            useResizeHandler
          />
        </div>
      </div>
    );
  };

  // Simulasi update data realtime setiap 2 detik (interval harian)
  useEffect(() => {
    const interval = setInterval(() => {
      setChartData((prev) => {
        // Ambil tanggal terakhir dari data sebelumnya
        const lastDate = prev.length
          ? (() => {
              const lastLabel = prev[prev.length - 1].name;
              const d = new Date();
              // Parse label "May 01"
              const [monthStr, dayStr] = lastLabel.split(" ");
              d.setMonth(
                [
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ].indexOf(monthStr)
              );
              d.setDate(Number(dayStr));
              return d;
            })()
          : new Date();
        // Tambah 1 hari dari tanggal terakhir
        const nextDate = new Date(lastDate.getTime() + 24 * 60 * 60 * 1000);
        const name = nextDate.toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
        });
        const last = prev[prev.length - 1];
        // Simulasikan perubahan naik/turun
        const tempDelta = (Math.random() - 0.5) * 2;
        const humDelta = (Math.random() - 0.5) * 2;
        const lightDelta = (Math.random() - 0.5) * 10;
        const moistDelta = (Math.random() - 0.5) * 2;
        const newPoint = {
          name,
          temperature: Math.max(20, Math.min(30, last.temperature + tempDelta)),
          humidity: Math.max(70, Math.min(90, last.humidity + humDelta)),
          light: Math.max(400, Math.min(600, last.light + lightDelta)),
          moisture: Math.max(60, Math.min(80, last.moisture + moistDelta)),
        };
        // Update sensorData tren naik/turun
        setSensorData([
          {
            title: "Temperature",
            value: newPoint.temperature.toFixed(1),
            unit: "°C",
            status: "Normal",
            trend: tempDelta >= 0 ? "Naik" : "Turun",
          },
          {
            title: "Air Humidity",
            value: newPoint.humidity.toFixed(0),
            unit: "%",
            status: "Normal",
            trend: humDelta >= 0 ? "Naik" : "Turun",
          },
          {
            title: "Light Intensity",
            value: newPoint.light.toFixed(0),
            unit: "lux",
            status: "Normal",
            trend: lightDelta >= 0 ? "Naik" : "Turun",
          },
          {
            title: "Medium Moisture",
            value: newPoint.moisture.toFixed(0),
            unit: "%",
            status: "Normal",
            trend: moistDelta >= 0 ? "Naik" : "Turun",
          },
        ]);
        // Pastikan hanya 24 data (24 hari)
        return [...prev.slice(1), newPoint];
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar navItems={navItems} />

        <div className="flex-1 flex flex-col">
          <AppHeader />

          {/* Dashboard Content */}
          <main className="flex-1 p-6 space-y-6">
            {/* Dashboard Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Last updated at 10:10:10
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Mode Auto</span>
                  <ToggleSwitch checked={modeAuto} onChange={setModeAuto} />
                </div>
                <button className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <RefreshIcon />
                  <span className="ml-2">Refresh</span>
                </button>
              </div>
            </div>

            {/* Manual Override Indicator */}
            {modeAuto === false && (
              <div>
                <div className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-semibold shadow inline-block">
                  Manual Override Aktif
                </div>
              </div>
            )}

            {/* Sensor Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {sensorData.map((sensor, index) => (
                <div key={index} className="bg-gray-100 rounded-lg p-4">
                  <div className="mb-3">
                    <h3 className="text-sm font-medium text-gray-600">
                      {sensor.title}
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-baseline space-x-1">
                      <span className="text-3xl font-bold text-gray-900">
                        {sensor.value}
                      </span>
                      <span className="text-sm text-gray-500">
                        {sensor.unit}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <div className="flex items-center space-x-1">
                        <span className="text-gray-500">Status</span>
                        <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">
                          {sensor.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-gray-500">Tren</span>
                        <span className="flex items-center">
                          {sensor.trend.toLowerCase() === "turun" ? (
                            <ArrowDown
                              size={14}
                              className="ml-1"
                              color="#ef4444"
                            />
                          ) : (
                            <ArrowUp
                              size={14}
                              className="ml-1"
                              color="#22c55e"
                            />
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Time Period Selector */}
            <div className="flex flex-wrap gap-2">
              {periods.map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                    selectedPeriod === period
                      ? "bg-slate-800 text-white"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard
                title="Temperature"
                dataKey="temperature"
                color="#ef4444"
                Icon={TemperatureIcon}
                unit="°C"
              />
              <ChartCard
                title="Humidity"
                dataKey="humidity"
                color="#3b82f6"
                Icon={HumidityIcon}
                unit="%"
              />
              <ChartCard
                title="Light Intensity"
                dataKey="light"
                color="#f59e0b"
                Icon={LightIntensityIcon}
                unit="lux"
              />
              <ChartCard
                title="Moisture"
                dataKey="moisture"
                color="#10b981"
                Icon={MoistureIcon}
                unit="%"
              />
            </div>

            {/* System Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  System status
                </h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">System status</span>
                    <span className="bg-green-500 text-white px-2 py-1 rounded text-sm">
                      Online
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Terakhir data diterima
                    </span>
                    <span className="text-gray-900">2 menit yang lalu</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Level Sinyal</span>
                    <span className="text-gray-900">Bagus</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Uptime</span>
                    <span className="text-gray-900">5 hari 32 menit</span>
                  </div>
                  {/* Level Baterai dihapus */}
                </div>
              </div>
            </div>

            {/* Actuator Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Actuator Status
                </h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col items-center">
                    <span className="text-gray-600 mb-2">Fan</span>
                    <ToggleSwitch
                      checked={fanEnabled}
                      onChange={setFanEnabled}
                    />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-gray-600 mb-2">Humidifier</span>
                    <ToggleSwitch
                      checked={humidifierEnabled}
                      onChange={setHumidifierEnabled}
                    />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-gray-600 mb-2">Light</span>
                    <ToggleSwitch
                      checked={lightEnabled}
                      onChange={setLightEnabled}
                    />
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
