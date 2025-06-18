"use client";

import { useState } from "react";
import AppHeader from "../../components/AppHeader";
import Sidebar from "@/components/Sidebar";
import { getNavItems } from "@/components/navItems";

export default function Alerts() {
  const [activeTab, setActiveTab] = useState("Active Alerts");

  // Handler untuk logout
  const handleLogout = () => {
    window.location.href = "/logout";
  };

  // Ambil navItems dengan menu aktif
  const navItems = getNavItems("/alerts");

  // Ikon-ikon yang dipakai di konten
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
  const BellIcon = ({ className = "" }) => (
    <svg
      className={`w-5 h-5 ${className}`}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
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

  // Tipe untuk iconType
  type IconType = "triangle-red" | "triangle-yellow" | "bell-blue" | string;

  const renderAlertIcon = (iconType: IconType) => {
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

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Global */}
      <Sidebar navItems={navItems} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <AppHeader onLogout={handleLogout} />

        {/* Alerts Content */}
        <main className="flex-1 p-6 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Alarm dan Notifikasi
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
              {/*
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
              */}
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
                  {activeAlerts.length} Active
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

          {/* 
          // Notification Settings Tab
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
          */}
        </main>
      </div>
    </div>
  );
}
