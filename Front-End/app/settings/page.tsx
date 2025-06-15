"use client";

import { useState } from "react";
import AppHeader from "../../components/AppHeader";

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

  // Icon Components
  const HomeIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
    </svg>
  );

  const GridIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );

  const BellIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
    </svg>
  );

  const SettingsIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
        clipRule="evenodd"
      />
    </svg>
  );

  const UserIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
        clipRule="evenodd"
      />
    </svg>
  );

  const LogOutIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
        clipRule="evenodd"
      />
    </svg>
  );

  const TagIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
        clipRule="evenodd"
      />
    </svg>
  );

  const MoreIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
    </svg>
  );

  const SaveIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );

  const EmailIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
    </svg>
  );

  const NotificationIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
    </svg>
  );

  const PlusIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
        clipRule="evenodd"
      />
    </svg>
  );

  // Sidebar navigation items
  const navItems = [
    { name: "Beranda", href: "/", icon: HomeIcon },
    { name: "Data History", href: "/data-history", icon: GridIcon },
    { name: "Alerts", href: "/alerts", icon: BellIcon },
    { name: "Settings", href: "/settings", icon: SettingsIcon, active: true },
    { name: "Profile", href: "/profile", icon: UserIcon },
  ];

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

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-20 bg-slate-800 flex flex-col items-center py-4 space-y-6">
        <img
          src="/img/icon.png"
          alt="Logo Kumbung Sense"
          className="w-10 h-10 rounded-full object-cover"
        />
        <nav className="flex flex-col space-y-4">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = item.active;
            return (
              <button
                key={item.name}
                onClick={() => (window.location.href = item.href)}
                className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                  isActive
                    ? "text-white bg-slate-700 hover:bg-slate-600"
                    : "text-gray-400 hover:text-white hover:bg-slate-700"
                }`}
              >
                <Icon />
                <span className="text-xs mt-1">{item.name}</span>
              </button>
            );
          })}
        </nav>
        <div className="flex-1"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header global */}
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
                  <SaveIcon />
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
                      <EmailIcon className="text-blue-600" />
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
                      <NotificationIcon className="text-blue-600" />
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
                  <SaveIcon />
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
                  <SaveIcon />
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
                  <PlusIcon />
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
                        <UserIcon className="w-4 h-4 text-gray-500" />
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
  );
}
