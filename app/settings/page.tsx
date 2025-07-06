"use client";

import { useState, useEffect, useCallback } from "react";
import AppHeader from "@/components/AppHeader";
import Sidebar from "@/components/Sidebar";
import { RangeSlider } from "@/components/RangeSlider";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "@/context/AuthContext";
import {
  fetchThresholds,
  updateThresholds,
  ThresholdValue,
} from "@/lib/fetchThresholdData";
import { Save, Mail, Bell, User, Plus } from "lucide-react";

export default function Settings() {
  const { user } = useAuth(); // Dapatkan info pengguna yang sedang login

  const [activeTab, setActiveTab] = useState("Thresholds");
  
  // State untuk data, loading, dan proses penyimpanan
  const [thresholds, setThresholds] = useState<ThresholdValue | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fungsi untuk memuat data thresholds dari Firebase
  const loadThresholds = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchThresholds(user.uid);
      if (data) {
        setThresholds(data);
      } else {
        // Jika tidak ada data di DB, set dengan nilai default
        setThresholds({
          temperatureMin: 20, temperatureMax: 30,
          humidityMin: 70, humidityMax: 90,
          lightMin: 500, lightMax: 2000,
          moistureMin: 65, moistureMax: 70,
        });
      }
    } catch (err) {
      setError("Gagal memuat pengaturan thresholds.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Jalankan fungsi loadThresholds saat komponen dimuat dan user sudah tersedia
  useEffect(() => {
    loadThresholds();
  }, [loadThresholds]);

  // Fungsi untuk menyimpan perubahan ke Firebase
  const handleSaveThresholds = async () => {
    if (!user || !thresholds) return;

    setIsSaving(true);
    setError(null);
    try {
      await updateThresholds(user.uid, thresholds);
      alert("Pengaturan thresholds berhasil disimpan!"); // Ganti dengan notifikasi yang lebih baik
    } catch (err) {
      setError("Gagal menyimpan pengaturan.");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  // Tampilkan loading spinner saat data diambil
  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <AppHeader />
            <main className="flex-1 p-6 flex items-center justify-center">
              <LoadingSpinner />
            </main>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <main className="flex-1 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Pengaturan</h2>
              {/* ... Tombol-tombol Tab ... */}
            </div>

            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            
            {/* Thresholds Tab */}
            {activeTab === "Thresholds" && thresholds && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Konfigurasi Ambang Batas
                </h3>
                <div className="space-y-8">
                  <RangeSlider
                    label="Ambang Batas Suhu"
                    value={[thresholds.temperatureMin, thresholds.temperatureMax]}
                    onChange={([newMin, newMax]) =>
                      setThresholds({ ...thresholds, temperatureMin: newMin, temperatureMax: newMax })
                    }
                    min={25} max={35} unit="°C" colorClassName="bg-red-500"
                  />
                  <RangeSlider
                    label="Ambang Batas Kelembapan"
                    value={[thresholds.humidityMin, thresholds.humidityMax]}
                    onChange={([newMin, newMax]) =>
                      setThresholds({ ...thresholds, humidityMin: newMin, humidityMax: newMax })
                    }
                    min={50} max={100} unit="%" colorClassName="bg-blue-500"
                  />
                  <RangeSlider
                    label="Ambang Batas Cahaya"
                    value={[thresholds.lightMin, thresholds.lightMax]}
                    onChange={([newMin, newMax]) =>
                      setThresholds({ ...thresholds, lightMin: newMin, lightMax: newMax })
                    }
                    min={0} max={5000} step={50} unit="lux" colorClassName="bg-yellow-500"
                  />
                  <RangeSlider
                    label="Ambang Batas Kelembapan Media"
                    value={[thresholds.moistureMin, thresholds.moistureMax]}
                    onChange={([newMin, newMax]) =>
                      setThresholds({ ...thresholds, moistureMin: newMin, moistureMax: newMax })
                    }
                    min={10} max={100} unit="%" colorClassName="bg-emerald-500"
                  />
                </div>
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={handleSaveThresholds}
                    disabled={isSaving}
                    className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                  >
                    <Save size={18} />
                    <span className="ml-2">
                      {isSaving ? "Menyimpan..." : "Save Thresholds"}
                    </span>
                  </button>
                </div>
              </div>
            )}
            {/* ... Kode untuk Tab lainnya ... */}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}