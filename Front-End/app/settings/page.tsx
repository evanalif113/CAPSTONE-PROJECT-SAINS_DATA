"use client";

import { useState } from "react";
import AppHeader from "@/components/AppHeader";
import Sidebar from "@/components/Sidebar";
import { getNavItems } from "@/components/navItems";
import ProtectedRoute from "@/components/ProtectedRoute";
import { 
  Save, 
  Mail, 
  Bell, 
  User, 
  Plus 
} from "lucide-react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("Thresholds");
  const [thresholds, setThresholds] = useState({
    tempMin: 18,
    tempMax: 32,
    humidityMin: 60,
    humidityMax: 75,
    lightMin: 500,
    lightMax: 2000,
    moistureMin: 35,
    moistureMax: 70,
  });

  const [notifications, setNotifications] = useState({
    emailEnabled: true,
    emailAddress: "user@example.com",
    emailFrequency: "Immediate",
    pushEnabled: true,
    pushTarget: "All devices",
    silentNotifications: false,
  });

  const [systemPrefs, setSystemPrefs] = useState({
    dataRetention: 90,
    timezone: "UTC+7",
    measurementUnit: "Metric (°C, meters)",
    autoUpdates: true,
  });

  // Slider Component
  const Slider = ({ label, value, min, max, unit, onChange }) => (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number.parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>
            {min}
            {unit}
          </span>
          <span className="font-medium text-gray-900">
            {value}
            {unit}
          </span>
          <span>
            {max}
            {unit}
          </span>
        </div>
      </div>
    </div>
  );

  // Sample users data
  const users = [
    {
      id: 1,
      name: "Admin User",
      email: "admin@example.com",
      role: "Administrator",
      lastLogin: "2023-05-30 10:15",
    },
    {
      id: 2,
      name: "Monitoring Staff",
      email: "staff@example.com",
      role: "Viewer",
      lastLogin: "2023-05-29 14:22",
    },
  ];

  // Handler untuk logout
  const handleLogout = () => {
    window.location.href = "/logout";
  };

  // Ambil navItems dengan menu aktif
  const navItems = getNavItems("/settings");

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar Global */}
        <Sidebar navItems={navItems} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <AppHeader onLogout={handleLogout} />

          {/* Settings Content */}
          <main className="flex-1 p-6">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab("Thresholds")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === "Thresholds"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Thresholds
                </button>
                <button
                  onClick={() => setActiveTab("Notification Channels")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === "Notification Channels"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Notification Channels
                </button>
                <button
                  onClick={() => setActiveTab("System Preferences")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === "System Preferences"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  System Preferences
                </button>
                <button
                  onClick={() => setActiveTab("Admin Management")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === "Admin Management"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Admin Management
                </button>
              </div>
            </div>

          {/* Thresholds Tab */}
          {activeTab === "Thresholds" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Global Threshold Configuration
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">
                    Temperature Thresholds
                  </h4>
                  <Slider
                    label="Minimum Temperature (°C)"
                    value={thresholds.tempMin}
                    min={0}
                    max={30}
                    unit="°C"
                    onChange={(value) =>
                      setThresholds({ ...thresholds, tempMin: value })
                    }
                  />
                  <Slider
                    label="Maximum Temperature (°C)"
                    value={thresholds.tempMax}
                    min={20}
                    max={50}
                    unit="°C"
                    onChange={(value) =>
                      setThresholds({ ...thresholds, tempMax: value })
                    }
                  />
                </div>
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">
                    Humidity Thresholds
                  </h4>
                  <Slider
                    label="Minimum Humidity (%)"
                    value={thresholds.humidityMin}
                    min={0}
                    max={100}
                    unit="%"
                    onChange={(value) =>
                      setThresholds({ ...thresholds, humidityMin: value })
                    }
                  />
                  <Slider
                    label="Maximum Humidity (%)"
                    value={thresholds.humidityMax}
                    min={0}
                    max={100}
                    unit="%"
                    onChange={(value) =>
                      setThresholds({ ...thresholds, humidityMax: value })
                    }
                  />
                </div>
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">
                    Light Intensity Thresholds
                  </h4>
                  <Slider
                    label="Minimum Light Intensity (lux)"
                    value={thresholds.lightMin}
                    min={0}
                    max={1000}
                    unit=" lux"
                    onChange={(value) =>
                      setThresholds({ ...thresholds, lightMin: value })
                    }
                  />
                  <Slider
                    label="Maximum Light Intensity (lux)"
                    value={thresholds.lightMax}
                    min={1000}
                    max={5000}
                    unit=" lux"
                    onChange={(value) =>
                      setThresholds({ ...thresholds, lightMax: value })
                    }
                  />
                </div>
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">
                    Medium Moisture Thresholds
                  </h4>
                  <Slider
                    label="Minimum Moisture (%)"
                    value={thresholds.moistureMin}
                    min={0}
                    max={100}
                    unit="%"
                    onChange={(value) =>
                      setThresholds({ ...thresholds, moistureMin: value })
                    }
                  />
                  <Slider
                    label="Maximum Moisture (%)"
                    value={thresholds.moistureMax}
                    min={0}
                    max={100}
                    unit="%"
                    onChange={(value) =>
                      setThresholds({ ...thresholds, moistureMax: value })
                    }
                  />
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <button className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Save />
                  <span className="ml-2">Save Thresholds</span>
                </button>
              </div>
            </div>
          )}

          {/* Notification Channels Tab */}
          {activeTab === "Notification Channels" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Notification Channels
              </h3>
              <div className="space-y-8">
                {/* Email Setup */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="text-blue-600" />
                      <h4 className="text-md font-medium text-gray-900">
                        Email Setup
                      </h4>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={notifications.emailEnabled}
                        onChange={(e) =>
                          setNotifications({
                            ...notifications,
                            emailEnabled: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-blue-600 font-medium">
                        Enabled
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={notifications.emailAddress}
                        onChange={(e) =>
                          setNotifications({
                            ...notifications,
                            emailAddress: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notification Frequency
                      </label>
                      <select
                        value={notifications.emailFrequency}
                        onChange={(e) =>
                          setNotifications({
                            ...notifications,
                            emailFrequency: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option>Immediate</option>
                        <option>Hourly</option>
                        <option>Daily</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Push Notification Setup */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Bell className="text-blue-600" />
                      <h4 className="text-md font-medium text-gray-900">
                        Push Notification Setup
                      </h4>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={notifications.pushEnabled}
                        onChange={(e) =>
                          setNotifications({
                            ...notifications,
                            pushEnabled: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-blue-600 font-medium">
                        Enabled
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Target Device
                      </label>
                      <select
                        value={notifications.pushTarget}
                        onChange={(e) =>
                          setNotifications({
                            ...notifications,
                            pushTarget: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option>All devices</option>
                        <option>Mobile only</option>
                        <option>Desktop only</option>
                      </select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={notifications.silentNotifications}
                        onChange={(e) =>
                          setNotifications({
                            ...notifications,
                            silentNotifications: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <label className="text-sm text-gray-700">
                        Silent notifications
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <button className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Save />
                  <span className="ml-2">Save Notification Settings</span>
                </button>
              </div>
            </div>
          )}

          {/* System Preferences Tab */}
          {activeTab === "System Preferences" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                System Preferences
              </h3>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data Retention Period (days)
                    </label>
                    <input
                      type="number"
                      value={systemPrefs.dataRetention}
                      onChange={(e) =>
                        setSystemPrefs({
                          ...systemPrefs,
                          dataRetention: Number.parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Measurement Unit System
                    </label>
                    <select
                      value={systemPrefs.measurementUnit}
                      onChange={(e) =>
                        setSystemPrefs({
                          ...systemPrefs,
                          measurementUnit: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option>Metric (°C, meters)</option>
                      <option>Imperial (°F, feet)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timezone
                    </label>
                    <select
                      value={systemPrefs.timezone}
                      onChange={(e) =>
                        setSystemPrefs({
                          ...systemPrefs,
                          timezone: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option>UTC+7</option>
                      <option>UTC+8</option>
                      <option>UTC+9</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={systemPrefs.autoUpdates}
                      onChange={(e) =>
                        setSystemPrefs({
                          ...systemPrefs,
                          autoUpdates: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label className="text-sm text-gray-700">
                      Enable automatic system updates
                    </label>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <button className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Save />
                  <span className="ml-2">Save System Preferences</span>
                </button>
              </div>
            </div>
          )}

          {/* Admin Management Tab */}
          {activeTab === "Admin Management" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Admin Management
                </h3>
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus />
                  <span className="ml-2">Add User</span>
                </button>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="grid grid-cols-5 gap-4 p-4 bg-gray-50 border-b border-gray-200 font-medium text-gray-700">
                  <div>Name</div>
                  <div>Email</div>
                  <div>Role</div>
                  <div>Last Login</div>
                  <div>Actions</div>
                </div>
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="grid grid-cols-5 gap-4 p-4 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-500" />
                      </div>
                      <span className="text-gray-900">{user.name}</span>
                    </div>
                    <div className="text-gray-600">{user.email}</div>
                    <div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          user.role === "Administrator"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </div>
                    <div className="text-gray-600">{user.lastLogin}</div>
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  </ProtectedRoute>
  );
}
