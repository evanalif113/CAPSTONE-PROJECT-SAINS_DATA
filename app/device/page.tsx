// pages/devices.tsx atau nama file Anda
"use client";

import { useState, useEffect, useCallback } from "react";
import AppHeader from "@/components/AppHeader";
import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

// BARU: Impor 'updateDevice' dan perbarui impor lainnya
import { fetchDevices, addDevice, deleteDevice, updateDevice, Device } from "@/lib/manageDevices"; 

// Komponen-komponen baru
import SensorCard from "@/components/SensorCard"; // Akan kita buat
import ActuatorCard from "@/components/ActuatorCard"; // Akan kita buat
import DeviceModal from "@/components/DeviceModal"; // Akan kita perbarui

import { Plus } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function DevicePage() {
  const { user } = useAuth();
  
  // State untuk data dan UI
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk modal (tambah/edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);

  // Fungsi untuk memuat ulang daftar perangkat dari server
  const refetchDevices = useCallback(() => {
    if (!user) return;
    setLoading(true);
    fetchDevices(user.uid)
      .then(setDevices)
      .catch(err => console.error("Gagal memuat list perangkat:", err))
      .finally(() => setLoading(false));
  }, [user]);
  
  // useEffect hanya untuk memuat daftar perangkat saat komponen pertama kali dimuat
  useEffect(() => {
    refetchDevices();
  }, [refetchDevices]);
  
  // Handler untuk membuka modal dalam mode 'tambah'
  const handleOpenAddModal = () => {
    setEditingDevice(null);
    setIsModalOpen(true);
  };
  
  // Handler untuk membuka modal dalam mode 'edit'
  const handleOpenEditModal = (device: Device) => {
    setEditingDevice(device);
    setIsModalOpen(true);
  };

  // Handler untuk Aksi (Tambah/Update)
  const handleDeviceSubmit = useCallback(async (deviceData: Omit<Device, 'id' | 'status'>) => {
    if (!user) return;
    try {
      if (editingDevice) {
        // Mode Edit
        await updateDevice(user.uid, editingDevice.id, deviceData);
      } else {
        // Mode Tambah
        await addDevice(user.uid, { ...deviceData, status: 'active' });
      }
      refetchDevices(); // Muat ulang data
      setIsModalOpen(false); // Tutup modal
    } catch (error) {
      console.error("Gagal menyimpan perangkat", error);
    }
  }, [user, editingDevice, refetchDevices]);

  const handleDeleteDevice = useCallback(async (deviceId: string) => {
    if (!user || !window.confirm("Apakah Anda yakin ingin menghapus perangkat ini?")) return;
    try {
      await deleteDevice(user.uid, deviceId);
      refetchDevices(); // Muat ulang data
    } catch (error) {
      console.error("Gagal menghapus perangkat", error);
    }
  }, [user, refetchDevices]);

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <main className="flex-1 p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Manajemen Perangkat</h1>
              <button
                onClick={handleOpenAddModal}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus size={18} /> Tambah Device
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-10"><LoadingSpinner/></div>
            ) : devices.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-lg shadow border">
                <p className="text-gray-500">Belum ada perangkat yang ditambahkan.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {devices.map((device) =>
                  // Logika Tampilan Baru: Gunakan komponen yang sesuai
                  device.type === 'sensor' ? (
                    <SensorCard 
                      key={device.id} 
                      device={device} 
                      userId={user!.uid} 
                      onEdit={() => handleOpenEditModal(device)}
                      onDelete={() => handleDeleteDevice(device.id)} 
                    />
                  ) : (
                    <ActuatorCard 
                      key={device.id} 
                      device={device} 
                      userId={user!.uid} 
                      onEdit={() => handleOpenEditModal(device)}
                      onDelete={() => handleDeleteDevice(device.id)}
                    />
                  )
                )}
              </div>
            )}
            
            {isModalOpen && (
              <DeviceModal
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleDeviceSubmit}
                initialData={editingDevice} // Kirim data untuk mode edit
              />
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}