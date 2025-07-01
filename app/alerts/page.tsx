"use client";

import { useState, useEffect, useCallback } from "react";
import AppHeader from "@/components/AppHeader";
import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { TriangleAlert, ClockAlert, Bell, Trash2, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  Notification,
  fetchNotifications,
  addNotification,
  deleteNotification,
  markNotificationAsRead,
} from "@/lib/fetchNotificationData";
import LoadingSpinner from "@/components/LoadingSpinner";
import { cn } from "@/lib/utils";

export default function Alerts() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("Active Alerts");
  const [alerts, setAlerts] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const refetchAlerts = useCallback(() => {
    if (user) {
      setLoading(true);
      fetchNotifications(user.uid)
        .then(setAlerts)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user]);

  useEffect(() => {
    refetchAlerts();
  }, [refetchAlerts]);

  const handleTestNotification = async () => {
    if (!user) return;
    try {
      const message = "Ini adalah notifikasi tes manual.";
      await addNotification(user.uid, message);
      // Perbarui state secara manual untuk UI yang responsif
      setAlerts((prevAlerts) => {
        const newAlert: Notification = {
          id: Date.now().toString(),
          message,
          read: false,
          timestamp: Date.now(),
        };
        return [newAlert, ...prevAlerts];
      });
    } catch (error) {
      console.error("Gagal mengirim notifikasi tes:", error);
      // Anda bisa menambahkan feedback error ke pengguna di sini
    }
  };

  const handleDeleteAlert = async (alertId: string) => {
    if (!user) return;
    try {
      await deleteNotification(user.uid, alertId);
      refetchAlerts();
    } catch (error) {
      console.error("Gagal menghapus notifikasi:", error);
    }
  };

  const handleMarkAsRead = async (alertId: string) => {
    if (!user) return;
    try {
      await markNotificationAsRead(user.uid, alertId);
      refetchAlerts();
    } catch (error) {
      console.error("Gagal menandai notifikasi:", error);
    }
  };

  const renderAlertIcon = (message: string) => {
    const lowerCaseMessage = message.toLowerCase();
    if (lowerCaseMessage.includes("kritikal") || lowerCaseMessage.includes("tinggi")) {
      return <TriangleAlert className="text-red-500" />;
    }
    if (lowerCaseMessage.includes("peringatan") || lowerCaseMessage.includes("di bawah")) {
      return <ClockAlert className="text-yellow-500" />;
    }
    return <Bell className="text-blue-500" />;
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar Global */}
        <Sidebar/>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <AppHeader/>

          {/* Alerts Content */}
          <main className="flex-1 p-6 space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Alarm dan Notifikasi
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={handleTestNotification}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors"
                >
                  Kirim Notifikasi Tes
                </button>
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
                    Notifikasi Aktif
                  </h3>
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                    {alerts.length} Aktif
                  </span>
                </div>
                <div className="space-y-4">
                  {loading ? (
                    <div className="flex justify-center items-center h-40">
                      <LoadingSpinner />
                    </div>
                  ) : alerts.length === 0 ? (
                    <div className="text-center text-gray-500 py-10 bg-white rounded-lg border">
                      <Bell size={48} className="mx-auto text-gray-300 mb-4" />
                      <p>Tidak ada notifikasi aktif.</p>
                    </div>
                  ) : (
                    alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={cn(
                          "bg-white rounded-lg border border-gray-200 p-4 transition-colors",
                          alert.read && "bg-gray-100"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {renderAlertIcon(alert.message)}
                            <div className={cn(alert.read && "text-gray-500")}>
                              <span className="text-gray-900 font-medium">
                                {alert.message}
                              </span>
                              <p className="text-sm text-gray-500">
                                {new Date(alert.timestamp).toLocaleString(
                                  "id-ID"
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {!alert.read && (
                              <button
                                onClick={() => handleMarkAsRead(alert.id)}
                                className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-100 rounded-full"
                                title="Tandai sudah dibaca"
                              >
                                <Check size={16} />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteAlert(alert.id)}
                              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full"
                              title="Hapus notifikasi"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
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
    </ProtectedRoute>
  );
}
