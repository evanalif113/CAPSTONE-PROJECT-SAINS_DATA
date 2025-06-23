"use client";

import { useState } from "react";
import AppHeader from "@/components/AppHeader";
import Sidebar from "@/components/Sidebar";
import { getNavItems } from "@/components/navItems";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { UserIcon, EditIcon, SaveIcon, X } from "lucide-react"; // Import ikon yang diperlukan
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

  // Ikon-ikon yang dipakai di konten
  const EditIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
    </svg>
  );
  const SaveIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
  const CancelIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );
  const KeyIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z"
        clipRule="evenodd"
      />
    </svg>
  );
  const NotificationIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
    </svg>
  );
  const UserIcon = () => (
    <svg
      className="w-16 h-16 text-gray-400"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
        clipRule="evenodd"
      />
    </svg>
  );

  // Sample login history data
  const loginHistory = [
    {
      date: "2023-05-30 10:15:22",
      device: "Chrome on Windows",
      ip: "192.168.1.1",
      status: "Success",
    },
    {
      date: "2023-05-28 14:22:05",
      device: "Safari on iPhone",
      ip: "192.168.1.2",
      status: "Success",
    },
    {
      date: "2023-05-25 09:10:45",
      device: "Chrome on Windows",
      ip: "192.168.1.1",
      status: "Success",
    },
    {
      date: "2023-05-20 18:30:12",
      device: "Firefox on MacOS",
      ip: "192.168.1.3",
      status: "Failed",
    },
    {
      date: "2023-05-20 18:29:30",
      device: "Firefox on MacOS",
      ip: "192.168.1.3",
      status: "Failed",
    },
  ];

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
