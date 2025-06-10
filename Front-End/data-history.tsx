"use client"

import { useState } from "react"

export default function DataHistory() {
  const [activeTab, setActiveTab] = useState("Environmental Trends")
  const [startDate, setStartDate] = useState("2023-05-01")
  const [endDate, setEndDate] = useState("2023-05-31")

  // Icon Components
  const HomeIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
    </svg>
  )

  const GridIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  )

  const BellIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
    </svg>
  )

  const SettingsIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
        clipRule="evenodd"
      />
    </svg>
  )

  const UserIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
  )

  const LogOutIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
        clipRule="evenodd"
      />
    </svg>
  )

  const CalendarIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
        clipRule="evenodd"
      />
    </svg>
  )

  const DownloadIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  )

  const TagIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
        clipRule="evenodd"
      />
    </svg>
  )

  const MoreIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
    </svg>
  )

  // Simple Chart Component
  const LineChart = ({ title, color, colorClass }) => {
    // Sample data points for demonstration
    const dataPoints1 = [800, 750, 500, 250, 300, 50, 100, 50, 150, 900]
    const dataPoints2 = [850, 300, 250, 400, 550, 750, 500, 750, 850, 950]

    const maxValue = 1000
    const chartWidth = 800
    const chartHeight = 200

    const createPath = (points) => {
      return points
        .map((point, index) => {
          const x = (index / (points.length - 1)) * chartWidth
          const y = chartHeight - (point / maxValue) * chartHeight
          return `${index === 0 ? "M" : "L"} ${x} ${y}`
        })
        .join(" ")
    }

    return (
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className={`w-3 h-3 rounded-full mr-3 ${colorClass}`}></div>
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <svg width="100%" height="250" viewBox={`0 0 ${chartWidth} 250`} className="overflow-visible">
            {/* Grid lines */}
            <defs>
              <pattern id="grid" width="80" height="50" patternUnits="userSpaceOnUse">
                <path d="M 80 0 L 0 0 0 50" fill="none" stroke="#e5e7eb" strokeWidth="1" />
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
                <text key={num} x={index * (chartWidth / 9)} y="230" textAnchor="middle">
                  {num}
                </text>
              ))}
            </g>

            {/* Data lines */}
            <path d={createPath(dataPoints1)} fill="none" stroke="#06b6d4" strokeWidth="2" className="drop-shadow-sm" />
            <path d={createPath(dataPoints2)} fill="none" stroke="#92400e" strokeWidth="2" className="drop-shadow-sm" />

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
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-16 bg-slate-800 flex flex-col items-center py-4 space-y-6">
        <div className="w-8 h-8 bg-teal-200 rounded-full flex items-center justify-center">
          <div className="w-4 h-4 bg-slate-800 rounded-full"></div>
        </div>
        <nav className="flex flex-col space-y-4">
          <button
            onClick={() => (window.location.href = "/")}
            className="p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            <HomeIcon />
          </button>
          <button className="p-2 text-white bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
            <GridIcon />
          </button>
          <button
            onClick={() => (window.location.href = "/alerts")}
            className="p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            <BellIcon />
          </button>
          <button
            onClick={() => (window.location.href = "/settings")}
            className="p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            <SettingsIcon />
          </button>
          <button
            onClick={() => (window.location.href = "/profile")}
            className="p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            <UserIcon />
          </button>
        </nav>
        <div className="flex-1"></div>
        <button
          onClick={() => (window.location.href = "/logout")}
          className="p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
        >
          <LogOutIcon />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-teal-200 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-slate-800 rounded-full"></div>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Kumbung Sense</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span>Offline</span>
                </div>
                <span>Als1</span>
                <span>GT Pengempon</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <TagIcon />
              <span className="ml-2">Tambahkan Tag</span>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreIcon />
            </button>
          </div>
        </header>

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
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                <span className="text-gray-500">to</span>
                <div className="relative">
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
              <LineChart title="Temperature" color="#ef4444" colorClass="bg-red-500" />
              <LineChart title="Air Humidity" color="#3b82f6" colorClass="bg-blue-500" />
              <LineChart title="Light Intensity" color="#f59e0b" colorClass="bg-yellow-500" />
              <LineChart title="Moisture" color="#10b981" colorClass="bg-green-500" />
            </div>
          )}

          {activeTab === "Log Aktuator" && (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <p className="text-gray-500">Actuator log data would be displayed here</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
