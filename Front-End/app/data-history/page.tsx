"use client";

import { useState } from "react";
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
  CalendarIcon,
  DownloadIcon,
  TemperatureIcon,
  HumidityIcon,
  LightIntensityIcon,
  MoistureIcon,
} from "@/components/Icon";

export default function DataHistory() {
  const [activeTab, setActiveTab] = useState("Environmental Trends");
  const [startDate, setStartDate] = useState("2023-05-01");
  const [endDate, setEndDate] = useState("2023-05-31");

  // Handler untuk logout
  const handleLogout = () => {
    window.location.href = "/logout";
  };

  // Ambil navItems dengan menu aktif
  const navItems = getNavItems("/data-history");

  // Data untuk chart (dummy, bisa diganti dengan data asli)
  const chartData = [
    { name: "0", temperature: 24, humidity: 85, light: 450, moisture: 75 },
    { name: "1", temperature: 25, humidity: 80, light: 500, moisture: 70 },
    { name: "2", temperature: 23, humidity: 82, light: 480, moisture: 72 },
    { name: "3", temperature: 22, humidity: 78, light: 470, moisture: 68 },
    { name: "4", temperature: 24, humidity: 81, light: 490, moisture: 74 },
    { name: "5", temperature: 26, humidity: 79, light: 510, moisture: 76 },
    { name: "6", temperature: 25, humidity: 77, light: 520, moisture: 73 },
    { name: "7", temperature: 24, humidity: 80, light: 530, moisture: 75 },
  ];

  // Komponen Chart Reusable
  type ChartProps = {
    title: string;
    dataKey: string;
    color: string;
    colorClass: string;
    unit: string;
  };

  const Chart = ({ title, dataKey, color, colorClass, unit, Icon }: ChartProps & { Icon: React.FC }) => (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <Icon />
        <h3 className="text-lg font-medium text-gray-900 ml-3">{title}</h3>
      </div>
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <ResponsiveContainer width="100%" height={220}>
          <ReLineChart data={chartData}>
            <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis unit={unit} />
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

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Global */}
      <Sidebar navItems={navItems} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <AppHeader onLogout={handleLogout} />

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

          {/* Date Range and Export Controls */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Date Range:</span>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <CalendarIcon />
                  </span>
                </div>
                <span className="text-gray-500">to</span>
                <div className="relative">
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <CalendarIcon />
                  </span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
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

          {/* Charts */}
          {activeTab === "Environmental Trends" && (
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
                Data Log Aktuator akan terisi secara otomatis saat ada aktivitas pada sistem.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
