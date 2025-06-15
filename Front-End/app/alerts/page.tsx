"use client";

import { useState } from "react";
import AppHeader from "../../components/AppHeader";

export default function Alerts() {
  const [activeTab, setActiveTab] = useState("Active Alerts");

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

  const WarningIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
  );

  const CheckIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );

  const EmailIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
    </svg>
  );

  const NotificationIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
    </svg>
  );

  // Sample data
  const activeAlerts = [
    {
      id: 1,
      type: "critical",
      message: "Temperature exceeds threshold (35°C)",
      time: "15 minutes ago",
      icon: "triangle-red",
    },
    {
      id: 2,
      type: "warning",
      message: "Humidity below optimal range (55%)",
      time: "1 hour ago",
      icon: "triangle-yellow",
    },
    {
      id: 3,
      type: "critical",
      message: "Medium moisture critically low (30%)",
      time: "2 hours ago",
      icon: "triangle-red",
    },
  ];

  const alertHistory = [
    {
      id: 1,
      type: "warning",
      message: "Light intensity below threshold",
      time: "Yesterday, 14:30",
      status: "Resolved",
      icon: "triangle-yellow",
    },
    {
      id: 2,
      type: "critical",
      message: "Fan malfunction detected",
      time: "May 27, 09:15",
      status: "Resolved",
      icon: "triangle-red",
    },
    {
      id: 3,
      type: "warning",
      message: "Humidity above optimal range (80%)",
      time: "May 26, 18:45",
      status: "Resolved",
      icon: "triangle-yellow",
    },
    {
      id: 4,
      type: "info",
      message: "System maintenance completed",
      time: "May 25, 10:00",
      status: "Resolved",
      icon: "bell-blue",
    },
    {
      id: 5,
      type: "critical",
      message: "Power interruption detected",
      time: "May 24, 22:10",
      status: "Resolved",
      icon: "triangle-red",
    },
  ];

  const notificationSettings = [
    { type: "Temperature High", threshold: "> 32°C", email: true, push: true },
    { type: "Temperature Low", threshold: "< 18°C", email: false, push: true },
    { type: "Humidity High", threshold: "> 75%", email: true, push: false },
    { type: "Humidity Low", threshold: "< 60%", email: true, push: true },
    {
      type: "Light Intensity Low",
      threshold: "< 500 lux",
      email: false,
      push: true,
    },
    {
      type: "Medium Moisture Low",
      threshold: "< 35%",
      email: true,
      push: true,
    },
    { type: "Device Fault", threshold: "Any", email: true, push: true },
  ];

  const renderAlertIcon = (iconType) => {
    switch (iconType) {
      case "triangle-red":
        return <WarningIcon className="text-red-500" />;
      case "triangle-yellow":
        return <WarningIcon className="text-yellow-500" />;
      case "bell-blue":
        return <BellIcon className="text-blue-500" />;
      default:
        return <WarningIcon className="text-gray-500" />;
    }
  };

  const navItems = [
    { name: "Beranda", href: "/", icon: HomeIcon },
    { name: "Data History", href: "/data-history", icon: GridIcon },
    { name: "Alerts", href: "/alerts", icon: BellIcon, active: true },
    { name: "Settings", href: "/settings", icon: SettingsIcon },
    { name: "Profile", href: "/profile", icon: UserIcon },
  ];

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
        <AppHeader onLogout={handleLogout} />
        <main className="flex-1 p-6 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {activeTab === "Active Alerts"
                ? "Alarm dan Notifikasi"
                : "Alerts & Notifications"}
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab("Active Alerts")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "Active Alerts"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Active Alerts
              </button>
              <button
                onClick={() => setActiveTab("Alert History")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "Alert History"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Alert History
              </button>
              <button
                onClick={() => setActiveTab("Notification Settings")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "Notification Settings"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Notification Settings
              </button>
            </div>
          </div>

          {/* Active Alerts Tab */}
          {activeTab === "Active Alerts" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Active Alerts
                </h3>
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                  3 Active
                </span>
              </div>
              <div className="space-y-4">
                {activeAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="bg-white rounded-lg border border-gray-200 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {renderAlertIcon(alert.icon)}
                        <span className="text-gray-900 font-medium">
                          {alert.message}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {alert.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Alert History Tab */}
          {activeTab === "Alert History" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Alert History
              </h3>
              <div className="space-y-4">
                {alertHistory.map((alert) => (
                  <div
                    key={alert.id}
                    className="bg-white rounded-lg border border-gray-200 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {renderAlertIcon(alert.icon)}
                        <div>
                          <span className="text-gray-900 font-medium block">
                            {alert.message}
                          </span>
                          <div className="flex items-center space-x-2 mt-1">
                            <CheckIcon className="text-green-500" />
                            <span className="text-green-600 text-sm font-medium">
                              {alert.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {alert.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notification Settings Tab */}
          {activeTab === "Notification Settings" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Notification Settings
              </h3>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 border-b border-gray-200 font-medium text-gray-700">
                  <div>Alert Type</div>
                  <div>Threshold</div>
                  <div>Email</div>
                  <div>Push</div>
                </div>
                {notificationSettings.map((setting, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-4 gap-4 p-4 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="text-gray-900">{setting.type}</div>
                    <div className="text-gray-600">{setting.threshold}</div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={setting.email}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        readOnly
                      />
                      <EmailIcon className="text-gray-400" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={setting.push}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        readOnly
                      />
                      <NotificationIcon className="text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
