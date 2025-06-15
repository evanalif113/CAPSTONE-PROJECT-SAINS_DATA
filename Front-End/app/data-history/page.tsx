"use client";

import { useState } from "react";
import AppHeader from "../../components/AppHeader";
import Sidebar from "@/components/Sidebar";
import { getNavItems } from "@/components/navItems";

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

  // Ikon-ikon yang dipakai di konten
  const CalendarIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
        clipRule="evenodd"
      />
    </svg>
  );
  const DownloadIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );

  // Simple Chart Component
  const LineChart = ({ title, color, colorClass }) => {
    // Sample data points for demonstration
    const dataPoints1 = [800, 750, 500, 250, 300, 50, 100, 50, 150, 900];
    const dataPoints2 = [850, 300, 250, 400, 550, 750, 500, 750, 850, 950];

    const maxValue = 1000;
    const chartWidth = 800;
    const chartHeight = 200;

    const createPath = (points) => {
      return points
        .map((point, index) => {
          const x = (index / (points.length - 1)) * chartWidth;
          const y = chartHeight - (point / maxValue) * chartHeight;
          return `${index === 0 ? "M" : "L"} ${x} ${y}`;
        })
        .join(" ");
    };

    return (
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className={`w-3 h-3 rounded-full mr-3 ${colorClass}`}></div>
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <svg
            width="100%"
            height="250"
            viewBox={`0 0 ${chartWidth} 250`}
            className="overflow-visible"
          >
            {/* Grid lines */}
            <defs>
              <pattern
                id="grid"
                width="80"
                height="50"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 80 0 L 0 0 0 50"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height={chartHeight} fill="url(#grid)" />

            {/* Y-axis labels */}
            <g className="text-xs fill-gray-500">
              <text x="-10" y="15">
                1000
              </text>
              <text x="-10" y="65">
                750
              </text>
              <text x="-10" y="115">
                500
              </text>
              <text x="-10" y="165">
                250
              </text>
              <text x="-10" y="210">
                0
              </text>
            </g>

            {/* X-axis labels */}
            <g className="text-xs fill-gray-500">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num, index) => (
                <text
                  key={num}
                  x={index * (chartWidth / 9)}
                  y="230"
                  textAnchor="middle"
                >
                  {num}
                </text>
              ))}
            </g>

            {/* Data lines */}
            <path
              d={createPath(dataPoints1)}
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2"
              className="drop-shadow-sm"
            />
            <path
              d={createPath(dataPoints2)}
              fill="none"
              stroke="#92400e"
              strokeWidth="2"
              className="drop-shadow-sm"
            />

            {/* Data points */}
            {dataPoints1.map((point, index) => (
              <circle
                key={`point1-${index}`}
                cx={(index / (dataPoints1.length - 1)) * chartWidth}
                cy={chartHeight - (point / maxValue) * chartHeight}
                r="3"
                fill="#06b6d4"
                className="drop-shadow-sm"
              />
            ))}
            {dataPoints2.map((point, index) => (
              <circle
                key={`point2-${index}`}
                cx={(index / (dataPoints2.length - 1)) * chartWidth}
                cy={chartHeight - (point / maxValue) * chartHeight}
                r="3"
                fill="#92400e"
                className="drop-shadow-sm"
              />
            ))}
          </svg>
        </div>
      </div>
    );
  };

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
                Environmental Trends
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
              <LineChart
                title="Temperature"
                color="#ef4444"
                colorClass="bg-red-500"
              />
              <LineChart
                title="Air Humidity"
                color="#3b82f6"
                colorClass="bg-blue-500"
              />
              <LineChart
                title="Light Intensity"
                color="#f59e0b"
                colorClass="bg-yellow-500"
              />
              <LineChart
                title="Moisture"
                color="#10b981"
                colorClass="bg-green-500"
              />
            </div>
          )}

          {activeTab === "Log Aktuator" && (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <p className="text-gray-500">
                Actuator log data would be displayed here
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
