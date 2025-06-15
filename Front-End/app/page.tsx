"use client";

import { useState } from "react";
import AppHeader from "../components/AppHeader";

import Sidebar from "@/components/Sidebar";
import { getNavItems } from "@/components/navItems";
import {
  HomeIcon,
  GridIcon,
  BellIcon,
  SettingsIcon,
  UserIcon,
  RefreshIcon,
} from "@/components/Icon";

const navItems = getNavItems("/");
//Importing necessary components and icons

export default function Dashboard() {
  const [modeAuto, setModeAuto] = useState(true);
  const [fanEnabled, setFanEnabled] = useState(false);
  const [humidifierEnabled, setHumidifierEnabled] = useState(true);
  const [lightEnabled, setLightEnabled] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("1 Month");

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

  const sensorData = [
    {
      title: "Temperature",
      value: "24.5",
      unit: "°C",
      status: "Normal",
      trend: "Turun",
    },
    {
      title: "Air Humidity",
      value: "85",
      unit: "%",
      status: "Normal",
      trend: "Turun",
    },
    {
      title: "Light Intensity",
      value: "450",
      unit: "lux",
      status: "Normal",
      trend: "Turun",
    },
    {
      title: "Medium Moisture",
      value: "75",
      unit: "%",
      status: "Normal",
      trend: "Turun",
    },
  ];

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
  );

  // Handler untuk logout
  const handleLogout = () => {
    window.location.href = "/logout";
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Global */}
      <Sidebar navItems={navItems} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header global */}
        <AppHeader onLogout={handleLogout} />

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
                    <span className="text-sm text-gray-500">{sensor.unit}</span>
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
                      <span className="text-red-500 text-xs">
                        {sensor.trend}
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
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-medium text-red-500 flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                  Temperature Trend (24h)
                </h3>
              </div>
              <div className="p-4">
                <div className="h-48 bg-gray-50 rounded flex items-center justify-center">
                  <div className="text-gray-400">
                    Chart visualization would go here
                  </div>
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
                  <div className="text-gray-400">
                    Chart visualization would go here
                  </div>
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
              <h3 className="text-lg font-semibold text-gray-900">
                Actuator Status
              </h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Fan</span>
                  <ToggleSwitch checked={fanEnabled} onChange={setFanEnabled} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Humidifier</span>
                  <ToggleSwitch
                    checked={humidifierEnabled}
                    onChange={setHumidifierEnabled}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Light</span>
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
  );
}
