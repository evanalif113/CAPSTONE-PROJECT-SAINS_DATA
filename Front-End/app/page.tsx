"use client"

import { useState } from "react"

export default function Dashboard() {
  const [modeAuto, setModeAuto] = useState(true)
  const [fanEnabled, setFanEnabled] = useState(false)
  const [humidifierEnabled, setHumidifierEnabled] = useState(true)
  const [lightEnabled, setLightEnabled] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState("1 Month")

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
  ]

  const sensorData = [
    { title: "Temperature", value: "24.5", unit: "°C", status: "Normal", trend: "Turun" },
    { title: "Air Humidity", value: "85", unit: "%", status: "Normal", trend: "Turun" },
    { title: "Light Intensity", value: "450", unit: "lux", status: "Normal", trend: "Turun" },
    { title: "Medium Moisture", value: "75", unit: "%", status: "Normal", trend: "Turun" },
  ]

  // Custom Toggle Switch Component
  const ToggleSwitch = ({ checked, onChange, disabled = false }) => (
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
  )

  // Icon Components (simplified SVGs)
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
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 0114 0H3z" clipRule="evenodd" />
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

  const RefreshIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
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

  // Sidebar navigation items
  const navItems = [
    {
      name: "Beranda",
      href: "/",
      icon: HomeIcon,
      active: true,
    },
    {
      name: "Data History",
      href: "/data-history",
      icon: GridIcon,
    },
    {
      name: "Alerts",
      href: "/alerts",
      icon: BellIcon,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: SettingsIcon,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: UserIcon,
    },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-16 bg-slate-800 flex flex-col items-center py-4 space-y-6">
        <div className="w-8 h-8 bg-teal-200 rounded-full flex items-center justify-center">
          <div className="w-4 h-4 bg-slate-800 rounded-full"></div>
        </div>
        <nav className="flex flex-col space-y-4">
          {navItems.map((item, idx) => {
            const Icon = item.icon
            const isActive = idx === 0 // Only first item (Beranda) is active here
            return (
              <button
                key={item.name}
                onClick={() => (window.location.href = item.href)}
                className={`p-2 rounded-lg transition-colors ${
                  isActive
                    ? "text-white bg-slate-700 hover:bg-slate-600"
                    : "text-gray-400 hover:text-white hover:bg-slate-700"
                }`}
              >
                <Icon />
              </button>
            )
          })}
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
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Online</span>
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

        {/* Dashboard Content */}
        <main className="flex-1 p-6 space-y-6">
          {/* Dashboard Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
              <p className="text-sm text-gray-500 mt-1">Last updated at 10:10:10</p>
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
              <button
                onClick={() => (window.location.href = "/data-history")}
                className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
                History
              </button>
            </div>
          </div>

          {/* Sensor Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sensorData.map((sensor, index) => (
              <div key={index} className="bg-gray-100 rounded-lg p-4">
                <div className="mb-3">
                  <h3 className="text-sm font-medium text-gray-600">{sensor.title}</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-bold text-gray-900">{sensor.value}</span>
                    <span className="text-sm text-gray-500">{sensor.unit}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <div className="flex items-center space-x-1">
                      <span className="text-gray-500">Status</span>
                      <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">{sensor.status}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-gray-500">Tren</span>
                      <span className="text-red-500 text-xs">{sensor.trend}</span>
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
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-medium text-red-500 flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                  Temperature Trend (24h)
                </h3>
              </div>
              <div className="p-4">
                <div className="h-48 bg-gray-50 rounded flex items-center justify-center">
                  <div className="text-gray-400">Chart visualization would go here</div>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>Apr 30</span>
                  <span>May 04</span>
                  <span>May 08</span>
                  <span>May 12</span>
                  <span>May 16</span>
                  <span>May 20</span>
                  <span>May 24</span>
                  <span>May 28</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-medium text-blue-500 flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  Humidity Trend (24h)
                </h3>
              </div>
              <div className="p-4">
                <div className="h-48 bg-gray-50 rounded flex items-center justify-center">
                  <div className="text-gray-400">Chart visualization would go here</div>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>Apr 30</span>
                  <span>May 04</span>
                  <span>May 08</span>
                  <span>May 12</span>
                  <span>May 16</span>
                  <span>May 20</span>
                  <span>May 24</span>
                  <span>May 28</span>
                </div>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">System status</h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">System status</span>
                  <span className="bg-green-500 text-white px-2 py-1 rounded text-sm">Online</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Terakhir data diterima</span>
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
                <div className="flex justify-between">
                  <span className="text-gray-600">Level Baterai</span>
                  <span className="text-gray-900">100%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actuator Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Actuator Status</h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Fan</span>
                  <ToggleSwitch checked={fanEnabled} onChange={setFanEnabled} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Humidifier</span>
                  <ToggleSwitch checked={humidifierEnabled} onChange={setHumidifierEnabled} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Light</span>
                  <ToggleSwitch checked={lightEnabled} onChange={setLightEnabled} />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
