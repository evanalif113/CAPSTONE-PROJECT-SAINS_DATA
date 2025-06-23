"use client";

import { useState } from "react";
import AppHeader from "@/components/AppHeader";
import Sidebar from "@/components/Sidebar";
import { getNavItems } from "@/components/navItems";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  EditIcon,
  SaveIcon,
  CancelIcon,
  KeyIcon,
  NotificationIcon,
  UserIcon,
} from "@/components/Icon";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("Personal Information");
  const [isEditing, setIsEditing] = useState(false);
  const { logout, user, loading } = useAuth();

  // Handler untuk logout
  const handleLogout = () => {
    window.location.href = "/logout";
  };

  // Ambil navItems dengan menu aktif
  const navItems = getNavItems("/profile");

  const [profileData, setProfileData] = useState({
    name: "Admin User",
    email: "admin@example.com",
    role: "Administrator",
    joinDate: "2023-01-15",
    notificationPreferences: {
      email: true,
      push: true,
    },
  });

  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleSaveProfile = () => {
    // In a real app, you would save the profile data to the server here
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    // Reset any changes and exit edit mode
    setIsEditing(false);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    // In a real app, you would validate and change the password here
    alert("Password changed successfully!");
    setPassword({ current: "", new: "", confirm: "" });
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar Global */}
        <Sidebar navItems={navItems} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <AppHeader onLogout={handleLogout} />

          {/* Profile Content */}
          <main className="flex-1 p-6">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Profil Pengguna
              </h2>
              <div className="flex space-x-2">
                {/*
              <button
                onClick={() => setActiveTab("Personal Information")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "Personal Information"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Informasi Pribadi
              </button>
              */}
                {/* 
              <button
                onClick={() => setActiveTab("Security")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "Security"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Keamanan
              </button>
              <button
                onClick={() => setActiveTab("Notifications")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "Notifications"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Notifikasi
              </button>
              <button
                onClick={() => setActiveTab("Activity")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "Activity"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Aktivitas
              </button>
              */}
              </div>
            </div>

            {/* Personal Information Tab */}
            {activeTab === "Personal Information" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Informasi Pribadi
                  </h3>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <EditIcon />
                      <span className="ml-2">Edit Profil</span>
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveProfile}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <SaveIcon />
                        <span className="ml-2">Simpan</span>
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <X />
                        <span className="ml-2">Batal</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Profile Picture */}
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                        <UserIcon className="text-gray-400" />
                      </div>
                      {isEditing && (
                        <button className="text-sm text-blue-600 hover:text-blue-800">
                          Ubah Foto Profil
                        </button>
                      )}
                    </div>

                    {/* Profile Information */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nama Lengkap
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={profileData.name}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                name: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        ) : (
                          <p className="text-gray-900">{user?.displayName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        {isEditing ? (
                          <input
                            type="email"
                            value={profileData.email}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                email: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        ) : (
                          <p className="text-gray-900">{user?.email}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Peran
                        </label>
                        {isEditing ? (
                          <select
                            value={profileData.role}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                role: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled
                          >
                            <option>Administrator</option>
                            <option>Operator</option>
                            <option>Viewer</option>
                          </select>
                        ) : (
                          <p className="text-gray-900">{profileData.role}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tanggal Bergabung
                        </label>
                        <p className="text-gray-900">
                          {user?.metadata.creationTime}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 
          // Security Tab
          {activeTab === "Security" && (
            <div>
              ...Keamanan Akun...
            </div>
          )}

          // Notifications Tab
          {activeTab === "Notifications" && (
            <div>
              ...Preferensi Notifikasi...
            </div>
          )}

          // Activity Tab
          {activeTab === "Activity" && (
            <div>
              ...Riwayat Aktivitas...
            </div>
          )}
          */}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
