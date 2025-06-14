"use client"

import { useState } from "react"

export default function Profile() {
  const [activeTab, setActiveTab] = useState("Personal Information")
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "Admin User",
    email: "admin@example.com",
    phone: "+62 812 3456 7890",
    role: "Administrator",
    department: "Operations",
    joinDate: "2023-01-15",
    language: "Bahasa Indonesia",
    timezone: "UTC+7",
    twoFactorEnabled: true,
    notificationPreferences: {
      email: true,
      push: true,
      sms: false,
    },
  })

  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  })

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

  const EditIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
    </svg>
  )

  const SaveIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  )

  const CancelIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  )

  const KeyIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z"
        clipRule="evenodd"
      />
    </svg>
  )

  const NotificationIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
    </svg>
  )

  const ActivityIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z"
        clipRule="evenodd"
      />
    </svg>
  )

  const handleSaveProfile = () => {
    // In a real app, you would save the profile data to the server here
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    // Reset any changes and exit edit mode
    setIsEditing(false)
  }

  const handleChangePassword = (e) => {
    e.preventDefault()
    // In a real app, you would validate and change the password here
    alert("Password changed successfully!")
    setPassword({ current: "", new: "", confirm: "" })
  }

  // Sample login history data
  const loginHistory = [
    { date: "2023-05-30 10:15:22", device: "Chrome on Windows", ip: "192.168.1.1", status: "Success" },
    { date: "2023-05-28 14:22:05", device: "Safari on iPhone", ip: "192.168.1.2", status: "Success" },
    { date: "2023-05-25 09:10:45", device: "Chrome on Windows", ip: "192.168.1.1", status: "Success" },
    { date: "2023-05-20 18:30:12", device: "Firefox on MacOS", ip: "192.168.1.3", status: "Failed" },
    { date: "2023-05-20 18:29:30", device: "Firefox on MacOS", ip: "192.168.1.3", status: "Failed" },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-16 bg-slate-800 flex flex-col items-center py-4 space-y-6">
        <div className="w-8 h-8 bg-teal-200 rounded-full flex items-center justify-center">
          <img
            src="/img/icon.png"
            alt="Logo Kumbung Sense"
            className="w-4 h-4 rounded-full object-cover"
          />
        </div>
        <nav className="flex flex-col space-y-4">
          <button
            onClick={() => (window.location.href = "/")}
            className="p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            <HomeIcon />
          </button>
          <button
            onClick={() => (window.location.href = "/data-history")}
            className="p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
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
          <button className="p-2 text-white bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
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

        {/* Profile Content */}
        <main className="flex-1 p-6">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Profil Pengguna</h2>
            <div className="flex space-x-2">
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
              <button
                onClick={() => setActiveTab("Security")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "Security" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
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
                  activeTab === "Activity" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Aktivitas
              </button>
            </div>
          </div>

          {/* Personal Information Tab */}
          {activeTab === "Personal Information" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Informasi Pribadi</h3>
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
                      className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <CancelIcon />
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
                      <UserIcon className="w-16 h-16 text-gray-400" />
                    </div>
                    {isEditing && (
                      <button className="text-sm text-blue-600 hover:text-blue-800">Ubah Foto Profil</button>
                    )}
                  </div>

                  {/* Profile Information */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900">{profileData.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900">{profileData.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Telepon</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900">{profileData.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Peran</label>
                      {isEditing ? (
                        <select
                          value={profileData.role}
                          onChange={(e) => setProfileData({ ...profileData, role: e.target.value })}
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">Departemen</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileData.department}
                          onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900">{profileData.department}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Bergabung</label>
                      <p className="text-gray-900">{profileData.joinDate}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bahasa</label>
                      {isEditing ? (
                        <select
                          value={profileData.language}
                          onChange={(e) => setProfileData({ ...profileData, language: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option>Bahasa Indonesia</option>
                          <option>English</option>
                        </select>
                      ) : (
                        <p className="text-gray-900">{profileData.language}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Zona Waktu</label>
                      {isEditing ? (
                        <select
                          value={profileData.timezone}
                          onChange={(e) => setProfileData({ ...profileData, timezone: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option>UTC+7</option>
                          <option>UTC+8</option>
                          <option>UTC+9</option>
                        </select>
                      ) : (
                        <p className="text-gray-900">{profileData.timezone}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "Security" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Keamanan Akun</h3>

              {/* Password Change */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                  <KeyIcon className="mr-2 text-blue-600" />
                  Ubah Kata Sandi
                </h4>
                <form onSubmit={handleChangePassword} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kata Sandi Saat Ini</label>
                    <input
                      type="password"
                      value={password.current}
                      onChange={(e) => setPassword({ ...password, current: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="md:col-span-2 border-t border-gray-200 pt-4"></div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kata Sandi Baru</label>
                    <input
                      type="password"
                      value={password.new}
                      onChange={(e) => setPassword({ ...password, new: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Kata Sandi Baru</label>
                    <input
                      type="password"
                      value={password.confirm}
                      onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Ubah Kata Sandi
                    </button>
                  </div>
                </form>
              </div>

              {/* Two-Factor Authentication */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-md font-medium text-gray-900 flex items-center">
                    <KeyIcon className="mr-2 text-blue-600" />
                    Autentikasi Dua Faktor
                  </h4>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={profileData.twoFactorEnabled}
                      onChange={(e) => setProfileData({ ...profileData, twoFactorEnabled: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-blue-600 font-medium">
                      {profileData.twoFactorEnabled ? "Aktif" : "Nonaktif"}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Autentikasi dua faktor menambahkan lapisan keamanan tambahan ke akun Anda dengan meminta kode
                  verifikasi selain kata sandi Anda.
                </p>
                {profileData.twoFactorEnabled ? (
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Konfigurasi Ulang
                  </button>
                ) : (
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Aktifkan
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "Notifications" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Preferensi Notifikasi</h3>
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <SaveIcon />
                  <span className="ml-2">Simpan Preferensi</span>
                </button>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                  <NotificationIcon className="mr-2 text-blue-600" />
                  Saluran Notifikasi
                </h4>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <div>
                      <h5 className="font-medium text-gray-900">Email</h5>
                      <p className="text-sm text-gray-600">Terima notifikasi melalui email</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={profileData.notificationPreferences.email}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            notificationPreferences: {
                              ...profileData.notificationPreferences,
                              email: e.target.checked,
                            },
                          })
                        }
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-blue-600 font-medium">
                        {profileData.notificationPreferences.email ? "Aktif" : "Nonaktif"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <div>
                      <h5 className="font-medium text-gray-900">Push Notification</h5>
                      <p className="text-sm text-gray-600">Terima notifikasi push di perangkat Anda</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={profileData.notificationPreferences.push}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            notificationPreferences: {
                              ...profileData.notificationPreferences,
                              push: e.target.checked,
                            },
                          })
                        }
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-blue-600 font-medium">
                        {profileData.notificationPreferences.push ? "Aktif" : "Nonaktif"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4">
                    <div>
                      <h5 className="font-medium text-gray-900">SMS</h5>
                      <p className="text-sm text-gray-600">Terima notifikasi melalui SMS</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={profileData.notificationPreferences.sms}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            notificationPreferences: {
                              ...profileData.notificationPreferences,
                              sms: e.target.checked,
                            },
                          })
                        }
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-blue-600 font-medium">
                        {profileData.notificationPreferences.sms ? "Aktif" : "Nonaktif"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === "Activity" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Riwayat Aktivitas</h3>

              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 border-b border-gray-200 font-medium text-gray-700">
                  <div>Tanggal & Waktu</div>
                  <div>Perangkat</div>
                  <div>Alamat IP</div>
                  <div>Status</div>
                </div>
                {loginHistory.map((entry, index) => (
                  <div key={index} className="grid grid-cols-4 gap-4 p-4 border-b border-gray-100 last:border-b-0">
                    <div className="text-gray-900">{entry.date}</div>
                    <div className="text-gray-600">{entry.device}</div>
                    <div className="text-gray-600">{entry.ip}</div>
                    <div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          entry.status === "Success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {entry.status === "Success" ? "Berhasil" : "Gagal"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
