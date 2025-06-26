// app/profile/page.tsx (atau di mana pun file ini berada)
"use client";

import { useState, useEffect, FormEvent } from "react";
import AppHeader from "@/components/AppHeader";
import Sidebar from "@/components/Sidebar";
import { getNavItems } from "@/components/navItems";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { EditIcon, SaveIcon, CancelIcon } from "@/components/Icon"; // Asumsi Icon ada


export default function ProfilePage() {
  // 1. PERBAIKAN: Gunakan hooks dan state yang relevan
  const { user, loading, logout } = useAuth();
  const navItems = getNavItems("/profile");

  const [activeTab, setActiveTab] = useState("Personal Information");
  const [isEditing, setIsEditing] = useState(false);

  // State untuk form edit profil
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState(""); // Meskipun tidak ada di UI, ini polanya

  // State untuk form ubah password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State untuk feedback (loading, error, success)
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 2. PERBAIKAN: Isi form dengan data dari Firebase saat komponen dimuat
  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      setPhotoURL(user.photoURL || "");
    }
  }, [user]);

  // 3. PERBAIKAN: Implementasi fungsi simpan profil
  const handleSaveProfile = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await updateProfile(user, { displayName });
      setSuccess("Profil berhasil diperbarui!");
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan profil.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    // Kembalikan data form ke data asli dari user
    if (user) {
      setDisplayName(user.displayName || "");
    }
    setIsEditing(false);
  };

  // 4. PERBAIKAN: Implementasi fungsi ubah password dengan re-autentikasi
  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !user.email) return;
    if (newPassword !== confirmPassword) {
      setError("Password baru dan konfirmasi tidak cocok.");
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );

    try {
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setSuccess("Password berhasil diubah!");
      // Kosongkan form password
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      if (err.code === "auth/wrong-password") {
        setError("Password saat ini yang Anda masukkan salah.");
      } else if (err.code === "auth/weak-password") {
        setError("Password baru terlalu lemah (minimal 6 karakter).");
      } else {
        setError(err.message || "Gagal mengubah password.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar navItems={navItems} />

        <div className="flex-1 flex flex-col">
          {/* 5. PERBAIKAN: Gunakan fungsi `logout` langsung dari context */}
          <AppHeader/>

          <main className="flex-1 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Profil Pengguna
              </h2>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-2 border-b mb-6">
              <button
                onClick={() => setActiveTab("Personal Information")}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "Personal Information"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500"
                }`}
              >
                Informasi Pribadi
              </button>
              <button
                onClick={() => setActiveTab("Security")}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "Security"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500"
                }`}
              >
                Keamanan
              </button>
            </div>

            {/* Konten Tab Informasi Pribadi */}
            {activeTab === "Personal Information" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Detail Profil
                  </h3>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <EditIcon/> <span className="ml-2">Edit</span>
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                      >
                        <SaveIcon />{" "}
                        <span className="ml-2">
                          {isSaving ? "Menyimpan..." : "Simpan"}
                        </span>
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        <CancelIcon size={18} />{" "}
                        <span className="ml-2">Batal</span>
                      </button>
                    </div>
                  )}
                </div>
                <div className="bg-white rounded-lg border p-6">
                  <form
                    onSubmit={handleSaveProfile}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Pengguna
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          className="w-full input-style"
                        />
                      ) : (
                        <p className="text-gray-900">
                          {user?.displayName || "(Belum diatur)"}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <p className="text-gray-900">{user?.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tanggal Bergabung
                      </label>
                      <p className="text-gray-900">
                        {user?.metadata.creationTime
                          ? new Date(
                              user.metadata.creationTime
                            ).toLocaleDateString("id-ID", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : ""}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        UID
                      </label>
                      <p className="text-gray-900">{user?.uid}</p>
                    </div>
                  </form>
                  {error && (
                    <p className="mt-4 text-sm text-red-600">{error}</p>
                  )}
                  {success && isEditing === false && (
                    <p className="mt-4 text-sm text-green-600">{success}</p>
                  )}
                </div>
              </div>
            )}

            {/* Konten Tab Keamanan */}
            {activeTab === "Security" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Ubah Password
                </h3>
                <div className="bg-white rounded-lg border p-6">
                  <form
                    onSubmit={handleChangePassword}
                    className="space-y-4 max-w-md"
                  >
                    <div>
                      <label className="block text-sm font-medium">
                        Password Saat Ini
                      </label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        className="mt-1 block w-full input-style border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">
                        Password Baru
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="mt-1 block w-full input-style border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">
                        Konfirmasi Password Baru
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="mt-1 block w-full input-style border border-gray-300 rounded-lg"
                      />
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    {success && (
                      <p className="text-sm text-green-600">{success}</p>
                    )}
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {isSaving ? "Memproses..." : "Ubah Password"}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
