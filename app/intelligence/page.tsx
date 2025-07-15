"use client";

// Impor React untuk tipe data event
import React, { useState, useEffect, useMemo } from "react";
// Impor ikon
import {
  BarChart2,
  TrendingUp,
  TrendingDown,
  FileText,
  Download,
  Calendar,
  Filter,
  AreaChart,
  LineChart,
  PlusCircle,
  X,
  Info,
  Pencil,
  Trash2,
} from "lucide-react";
// Impor komponen UI dan otentikasi
import AppHeader from "@/components/AppHeader";
import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import dynamic from "next/dynamic";
import { useAuth } from "@/context/AuthContext";

// --- Impor Logika dan Tipe Data dari 'lib' ---
import {
  listenToHarvestData,
  addHarvestData,
  updateHarvestData,
  deleteHarvestData,
  Harvest,
  NewHarvestData,
} from "@/lib/fetchHarvestLog";
import { fetchSensorData, SensorDate } from "@/lib/fetchSensorData";

// Load Plotly secara dinamis untuk performa
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

// --- Helper Functions ---
// Fungsi-fungsi ini bisa dipindahkan ke lib/utils.ts jika ingin lebih rapi
function getQualityDistribution(harvestData: Harvest[]) {
  const counts = { A: 0, B: 0, C: 0 };
  harvestData.forEach((h) => {
    if (h.quality === "A") counts.A++;
    else if (h.quality === "B") counts.B++;
    else if (h.quality === "C") counts.C++;
  });
  return counts;
}
function qualityToNumber(q: string) {
  if (q === "A") return 3;
  if (q === "B") return 2;
  if (q === "C") return 1;
  return 0;
}
function getAmountBins(harvestData: Harvest[], binSize = 5) {
  const amounts = harvestData.map((h) => h.amount);
  const max = Math.max(...amounts, 0);
  const bins = [];
  for (let i = 0; i <= max; i += binSize) {
    bins.push({
      range: `${i}-${i + binSize - 1}`,
      count: amounts.filter((a) => a >= i && a < i + binSize).length,
    });
  }
  return bins;
}

// --- Tipe untuk Props Modal ---
// Disesuaikan dengan data yang benar-benar diinput oleh pengguna
type HarvestFormInput = Omit<
  NewHarvestData,
  "avgTemp" | "avgHumidity" | "timestamp"
>;

interface HarvestInputModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: HarvestFormInput) => void;
  initialData?: HarvestFormInput | null;
}

// --- Komponen Modal (Dengan Tipe yang Benar) ---
function HarvestInputModal({
  open,
  onClose,
  onSubmit,
  initialData,
}: HarvestInputModalProps) {
  const [form, setForm] = useState<HarvestFormInput>({
    date: new Date().toISOString().slice(0, 10),
    amount: 0,
    quality: "A",
    note: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({
        date: new Date().toISOString().slice(0, 10),
        amount: 0,
        quality: "A",
        note: "",
      });
    }
  }, [initialData, open]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          type="button"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-bold mb-4">
          {initialData ? "Edit Data Panen" : "Input Data Panen"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Panen
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jumlah Panen (kg)
            </label>
            <input
              type="number"
              name="amount"
              value={form.amount || ""}
              onChange={handleChange}
              min={0}
              step="0.1"
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kualitas
            </label>
            <select
              name="quality"
              value={form.quality}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="A">A (Sangat Baik)</option>
              <option value="B">B (Baik)</option>
              <option value="C">C (Cukup)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catatan
            </label>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Opsional"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg"
            >
              {initialData ? "Simpan Perubahan" : "Simpan Data"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- Komponen Utama ---
export default function IntelligencePage() {
  const { user } = useAuth();
  const [showHarvestModal, setShowHarvestModal] = useState(false);
  const [editingHarvest, setEditingHarvest] = useState<Harvest | null>(null);
  const [mediaTanamKering, setMediaTanamKering] = useState(100);

  // State untuk data dari Firebase
  const [harvestData, setHarvestData] = useState<Harvest[]>([]);
  const [sensorLog, setSensorLog] = useState<SensorDate[]>([]);

  useEffect(() => {
    if (!user) return; // Jangan lakukan apa-apa jika user belum login

    const unsubscribeHarvest = listenToHarvestData(user.uid, (data) => {
      setHarvestData(data);
    });

    const getSensorLog = async () => {
      const userIdForSensor = user.uid; // Gunakan UID user yang login
      if (userIdForSensor) {
        try {
          const data = await fetchSensorData(userIdForSensor, 100);
          setSensorLog(data);
        } catch (error) {
          console.error("Gagal mengambil log sensor:", error);
        }
      }
    };
    getSensorLog();

    return () => {
      unsubscribeHarvest();
    };
  }, [user]);

  const handleAddOrUpdateHarvest = async (formData: HarvestFormInput) => {
    if (!user) {
      console.error("User tidak terautentikasi.");
      return;
    }

    if (editingHarvest) {
      // Mode Edit
      const updatedData: Partial<NewHarvestData> = {
        ...formData,
        // Timestamp tidak diubah saat edit, kecuali diperlukan
      };
      try {
        await updateHarvestData(user.uid, editingHarvest.id, updatedData);
        console.log("Data panen berhasil diperbarui!");
      } catch (error) {
        console.error("Gagal memperbarui data panen:", error);
      }
    } else {
      // Mode Tambah Baru
      const avgTemp =
        sensorLog.length > 0
          ? sensorLog.reduce((sum, log) => sum + log.temperature, 0) /
            sensorLog.length
          : 25;
      const avgHumidity =
        sensorLog.length > 0
          ? sensorLog.reduce((sum, log) => sum + log.humidity, 0) /
            sensorLog.length
          : 90;

      const newHarvest: NewHarvestData = {
        ...formData,
        avgTemp: parseFloat(avgTemp.toFixed(1)),
        avgHumidity: parseFloat(avgHumidity.toFixed(1)),
        timestamp: Date.now(),
      };

      try {
        await addHarvestData(user.uid, newHarvest);
        console.log("Data panen berhasil ditambahkan!");
      } catch (error) {
        console.error("Gagal menambahkan data panen:", error);
      }
    }
    setEditingHarvest(null);
  };

  const handleOpenEditModal = (harvest: Harvest) => {
    setEditingHarvest(harvest);
    setShowHarvestModal(true);
  };

  const handleCloseModal = () => {
    setShowHarvestModal(false);
    setEditingHarvest(null);
  };

  const handleDeleteHarvest = async (id: string) => {
    if (!user) {
      console.error("User tidak terautentikasi.");
      return;
    }
    if (window.confirm("Apakah Anda yakin ingin menghapus data panen ini?")) {
      try {
        await deleteHarvestData(user.uid, id);
        console.log("Data panen berhasil dihapus!");
      } catch (error) {
        console.error("Gagal menghapus data panen:", error);
      }
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Selamat Pagi";
    if (hour >= 12 && hour < 15) return "Selamat Siang";
    if (hour >= 15 && hour < 18) return "Selamat Sore";
    return "Selamat Malam";
  };

  // --- Kalkulasi KPI dan Data Grafik ---
  const totalPanenBasah = useMemo(
    () => harvestData.reduce((sum, h) => sum + h.amount, 0),
    [harvestData]
  );
  const efisiensiBiologis = useMemo(
    () =>
      mediaTanamKering > 0 ? (totalPanenBasah / mediaTanamKering) * 100 : 0,
    [totalPanenBasah, mediaTanamKering]
  );
  const avgTemp = useMemo(
    () =>
      harvestData.length > 0
        ? harvestData.reduce((sum, h) => sum + (h.avgTemp || 0), 0) /
          harvestData.length
        : 0,
    [harvestData]
  );
  const avgHumidity = useMemo(
    () =>
      harvestData.length > 0
        ? harvestData.reduce((sum, h) => sum + (h.avgHumidity || 0), 0) /
          harvestData.length
        : 0,
    [harvestData]
  );

  const cumulativeGrowthData = useMemo(() => {
    let cumulativeAmount = 0;
    return harvestData.map((h) => {
      cumulativeAmount += h.amount;
      return {
        timestamp: h.timestamp,
        cumulativeAmount: cumulativeAmount,
      };
    });
  }, [harvestData]);

  const kpiCards = [
    {
      label: "Efisiensi Biologis",
      value: efisiensiBiologis,
      unit: "%",
      up: efisiensiBiologis >= 100,
      color: "bg-green-100 text-green-800",
      icon: <BarChart2 className="w-6 h-6" />,
      tooltip: "Efisiensi Biologis = (Total Panen / Media Kering) × 100%",
    },
    {
      label: "Total Panen",
      value: totalPanenBasah,
      unit: "kg",
      up: totalPanenBasah > 0,
      color: "bg-blue-100 text-blue-800",
      icon: <FileText className="w-6 h-6" />,
      tooltip: "Akumulasi seluruh panen basah (kg).",
    },
    {
      label: "Suhu Rata-rata",
      value: avgTemp,
      unit: "°C",
      up: true,
      color: "bg-yellow-100 text-yellow-800",
      icon: <AreaChart className="w-6 h-6" />,
      tooltip: "Rata-rata suhu lingkungan saat panen.",
    },
    {
      label: "Kelembaban Rata-rata",
      value: avgHumidity,
      unit: "%",
      up: true,
      color: "bg-cyan-100 text-cyan-800",
      icon: <LineChart className="w-6 h-6" />,
      tooltip: "Rata-rata kelembapan lingkungan saat panen.",
    },
  ];

  function QualityBadge({ quality }: { quality: string }) {
    let color = "bg-gray-200 text-gray-800";
    if (quality === "A") color = "bg-green-200 text-green-800";
    else if (quality === "B") color = "bg-yellow-200 text-yellow-800";
    else if (quality === "C") color = "bg-red-200 text-red-800";
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-bold ${color}`}>
        {quality}
      </span>
    );
  }

  const isEmpty = harvestData.length === 0;

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <main className="flex-1 p-6 space-y-8">
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-gray-800">
                {getGreeting()}, {user?.displayName || "Pengguna"}!
              </h1>
              <p className="text-md text-gray-500">
                Berikut adalah analisis data dari Kumbung Jamur Anda.
              </p>
            </div>

            <div className="mb-4 flex items-center gap-2">
              <label className="text-sm text-gray-700">
                Berat Media Tanam Kering (kg):
              </label>
              <input
                type="number"
                value={mediaTanamKering}
                onChange={(e) => setMediaTanamKering(Number(e.target.value))}
                className="border rounded px-2 py-1 text-sm w-24"
                min={1}
              />
              <span className="text-xs text-gray-400">
                <Info className="inline w-4 h-4 mr-1" />
                Ubah jika batch media tanam baru.
              </span>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
              <button
                onClick={() => {
                  setEditingHarvest(null);
                  setShowHarvestModal(true);
                }}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                Input Data Panen
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {kpiCards.map((kpi, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl shadow p-5 flex flex-col items-start border border-gray-100 relative ${kpi.color}`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    {kpi.icon}
                    <span className="text-lg font-semibold">{kpi.label}</span>
                    <span className="group relative">
                      <Info className="w-4 h-4 text-gray-400 ml-1 cursor-pointer" />
                      <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1 z-10 whitespace-nowrap">
                        {kpi.tooltip}
                      </span>
                    </span>
                    {kpi.up ? (
                      <TrendingUp className="text-green-500 w-5 h-5" />
                    ) : (
                      <TrendingDown className="text-red-500 w-5 h-5" />
                    )}
                  </div>
                  <div className="text-3xl font-bold text-gray-900">
                    {Number(kpi.value).toFixed(1)}
                    <span className="text-base font-normal text-gray-500 ml-1">
                      {kpi.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <h2 className="text-xl font-bold mb-4">Analisis Lanjutan</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg p-4 shadow md:col-span-2">
                  <h3 className="font-semibold mb-2 text-center">
                    Grafik Pertumbuhan Panen Kumulatif
                  </h3>
                  {isEmpty ? (
                    <div className="flex items-center justify-center h-[300px] text-gray-400">
                      Belum ada data
                    </div>
                  ) : (
                    <>
                      <Plot
                        data={[
                          {
                            x: cumulativeGrowthData.map(
                              (d) => new Date(d.timestamp)
                            ),
                            y: cumulativeGrowthData.map(
                              (d) => d.cumulativeAmount
                            ),
                            type: "scatter",
                            mode: "lines+markers",
                            name: "Total Panen (kg)",
                            line: { color: "#8b5cf6" },
                          },
                        ]}
                        layout={{
                          height: 300,
                          margin: { t: 20, b: 50, l: 50, r: 20 },
                          xaxis: { title: "Waktu" },
                          yaxis: { title: "Total Panen (kg)" },
                        }}
                        config={{ displayModeBar: false, responsive: true }}
                        style={{ width: "100%", height: "300px" }}
                      />
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Menunjukkan total produksi dari waktu ke waktu.
                        Kemiringan garis menandakan laju produksi.
                      </p>
                    </>
                  )}
                </div>
                <div className="bg-white rounded-lg p-4 shadow">
                  <h3 className="font-semibold mb-2 text-center">
                    Distribusi Kualitas Panen
                  </h3>
                  {isEmpty ? (
                    <div className="flex items-center justify-center h-[250px] text-gray-400">
                      Belum ada data
                    </div>
                  ) : (
                    <Plot
                      data={[
                        {
                          values: Object.values(
                            getQualityDistribution(harvestData)
                          ),
                          labels: ["A", "B", "C"],
                          type: "pie",
                          hole: 0.5,
                          marker: {
                            colors: ["#22c55e", "#facc15", "#f87171"],
                          },
                        },
                      ]}
                      layout={{
                        height: 250,
                        margin: { t: 10, b: 10, l: 10, r: 10 },
                        showlegend: true,
                      }}
                      config={{ displayModeBar: false, responsive: true }}
                      style={{ width: "100%", height: "250px" }}
                    />
                  )}
                </div>
                <div className="bg-white rounded-lg p-4 shadow">
                  <h3 className="font-semibold mb-2 text-center">
                    Korelasi Jumlah vs. Kualitas
                  </h3>
                  {isEmpty ? (
                    <div className="flex items-center justify-center h-[250px] text-gray-400">
                      Belum ada data
                    </div>
                  ) : (
                    <Plot
                      data={[
                        {
                          x: harvestData.map((h) => h.amount),
                          y: harvestData.map((h) =>
                            qualityToNumber(h.quality)
                          ),
                          mode: "markers",
                          type: "scatter",
                        },
                      ]}
                      layout={{
                        height: 250,
                        margin: { t: 10, b: 40, l: 40, r: 10 },
                        xaxis: { title: "Jumlah (kg)" },
                        yaxis: {
                          title: "Kualitas",
                          tickvals: [1, 2, 3],
                          ticktext: ["C", "B", "A"],
                        },
                      }}
                      config={{ displayModeBar: false, responsive: true }}
                      style={{ width: "100%", height: "250px" }}
                    />
                  )}
                </div>
              </div>
            </div>

            <HarvestInputModal
              open={showHarvestModal}
              onClose={handleCloseModal}
              onSubmit={handleAddOrUpdateHarvest}
              initialData={
                editingHarvest
                  ? {
                      date: editingHarvest.date,
                      amount: editingHarvest.amount,
                      quality: editingHarvest.quality,
                      note: editingHarvest.note,
                    }
                  : null
              }
            />

            <div className="bg-white rounded-lg shadow border border-gray-200 p-4 mt-8 overflow-x-auto">
              <h2 className="text-lg font-semibold mb-4">
                Riwayat Data Panen & Korelasi Lingkungan
              </h2>
              {isEmpty ? (
                <div className="text-gray-400 text-center py-8">
                  Belum ada data panen.
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-white z-10">
                    <tr className="border-b">
                      <th className="py-2 text-left cursor-pointer">Tanggal</th>
                      <th className="py-2 text-left cursor-pointer">
                        Jumlah (kg)
                      </th>
                      <th className="py-2 text-left">Suhu Rata-rata (°C)</th>
                      <th className="py-2 text-left">
                        Kelembapan Rata-rata (%)
                      </th>
                      <th className="py-2 text-left">Kualitas</th>
                      <th className="py-2 text-left">Catatan</th>
                      <th className="py-2 text-left">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {harvestData.map((row) => (
                      <tr
                        key={row.id}
                        className={`border-b last:border-b-0 ${
                          row.quality === "A"
                            ? "bg-green-50"
                            : row.quality === "B"
                            ? "bg-yellow-50"
                            : row.quality === "C"
                            ? "bg-red-50"
                            : ""
                        }`}
                      >
                        <td className="py-2">{row.date}</td>
                        <td className="py-2 font-bold">{row.amount}</td>
                        <td className="py-2">
                          {row.avgTemp !== undefined
                            ? Number(row.avgTemp).toFixed(1)
                            : "-"}
                        </td>
                        <td className="py-2">
                          {row.avgHumidity !== undefined
                            ? Number(row.avgHumidity).toFixed(1)
                            : "-"}
                        </td>
                        <td className="py-2">
                          <QualityBadge quality={row.quality} />
                        </td>
                        <td className="py-2">{row.note}</td>
                        <td className="py-2 flex items-center space-x-2">
                          <button
                            onClick={() => handleOpenEditModal(row)}
                            className="text-blue-600 hover:text-blue-800 p-1"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteHarvest(row.id)}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
