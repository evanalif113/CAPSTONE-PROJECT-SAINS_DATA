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
  Harvest,
  NewHarvestData,
} from "@/lib/fetchHarvestLog";
import { fetchSensorData, SensorDate } from "@/lib/fetchSensorData"; // Untuk mengambil data sensor

// Load Plotly secara dinamis untuk performa
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

// --- Helper Functions ---
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
interface HarvestInputModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: Omit<NewHarvestData, "avgTemp" | "avgHumidity">) => void;
}

// --- Komponen Modal (Dengan Tipe yang Benar) ---
function HarvestInputModal({
  open,
  onClose,
  onSubmit,
}: HarvestInputModalProps) {
  const [form, setForm] = useState<
    Omit<NewHarvestData, "avgTemp" | "avgHumidity">
  >({
    date: new Date().toISOString().slice(0, 10),
    amount: 0,
    quality: "A",
    note: "",
  });

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
        <h2 className="text-lg font-bold mb-4">Input Data Panen</h2>
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
              Simpan Data
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
  const [mediaTanamKering, setMediaTanamKering] = useState(100);

  // State untuk data dari Firebase
  const [harvestData, setHarvestData] = useState<Harvest[]>([]);
  const [sensorLog, setSensorLog] = useState<SensorDate[]>([]);

  useEffect(() => {
    const unsubscribeHarvest = listenToHarvestData((data) => {
      setHarvestData(data);
    });

    const getSensorLog = async () => {
      const userIdForSensor = "GQAUD4ySfaNncpiZEkiKYNITWvK2";
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

  const handleAddHarvest = async (
    formData: Omit<NewHarvestData, "avgTemp" | "avgHumidity">
  ) => {
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
    };

    try {
      await addHarvestData(newHarvest);
      console.log("Data panen berhasil ditambahkan!");
    } catch (error) {
      console.error("Gagal menambahkan data panen:", error);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Selamat Pagi";
    if (hour >= 12 && hour < 15) return "Selamat Siang";
    if (hour >= 15 && hour < 18) return "Selamat Sore";
    return "Selamat Malam";
  };

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
      value: avgTemp.toFixed(1),
      unit: "°C",
      up: true,
      color: "bg-yellow-100 text-yellow-800",
      icon: <AreaChart className="w-6 h-6" />,
      tooltip: "Rata-rata suhu lingkungan saat panen.",
    },
    {
      label: "Kelembaban Rata-rata",
      value: avgHumidity.toFixed(1),
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
                onClick={() => setShowHarvestModal(true)}
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
                    {typeof kpi.value === "number"
                      ? Number(kpi.value).toFixed(1)
                      : kpi.value}
                    <span className="text-base font-normal text-gray-500 ml-1">
                      {kpi.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <h2 className="text-xl font-bold mb-4">Analisis Lanjutan</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white rounded-lg p-4 shadow">
                  <h3 className="font-semibold mb-2 text-center">
                    Distribusi Kualitas Panen
                  </h3>
                  <Plot
                    data={[
                      {
                        values: Object.values(
                          getQualityDistribution(harvestData)
                        ),
                        labels: ["A (Sangat Baik)", "B (Baik)", "C (Cukup)"],
                        type: "pie",
                        hole: 0.5,
                        marker: { colors: ["#22c55e", "#facc15", "#f87171"] },
                        textinfo: "percent+label",
                      },
                    ]}
                    layout={{
                      height: 250,
                      margin: { t: 10, b: 10, l: 10, r: 10 },
                      showlegend: false,
                    }}
                    config={{ displayModeBar: false, responsive: true }}
                    style={{ width: "100%", height: "250px" }}
                  />
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Proporsi kualitas panen untuk deteksi dini masalah produksi.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow">
                  <h3 className="font-semibold mb-2 text-center">
                    Korelasi Jumlah vs. Kualitas
                  </h3>
                  <Plot
                    data={[
                      {
                        x: harvestData.map((h) => h.amount),
                        y: harvestData.map((h) => qualityToNumber(h.quality)),
                        mode: "markers",
                        type: "scatter",
                        marker: { color: "#3b82f6", size: 10 },
                        text: harvestData.map(
                          (h) => `Tanggal: ${h.date}<br>Kualitas: ${h.quality}`
                        ),
                      },
                    ]}
                    layout={{
                      height: 250,
                      margin: { t: 10, b: 40, l: 40, r: 10 },
                      xaxis: { title: "Jumlah Panen (kg)" },
                      yaxis: {
                        title: "Kualitas (A=3, B=2, C=1)",
                        tickvals: [1, 2, 3],
                        ticktext: ["C", "B", "A"],
                        range: [0.5, 3.5],
                      },
                    }}
                    config={{ displayModeBar: false, responsive: true }}
                    style={{ width: "100%", height: "250px" }}
                  />
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Apakah panen besar cenderung berkualitas rendah? Optimasi
                    strategi panen.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow">
                  <h3 className="font-semibold mb-2 text-center">
                    Frekuensi Jumlah Panen
                  </h3>
                  <Plot
                    data={[
                      {
                        x: getAmountBins(harvestData).map((bin) => bin.range),
                        y: getAmountBins(harvestData).map((bin) => bin.count),
                        type: "bar",
                        marker: { color: "#6366f1" },
                      },
                    ]}
                    layout={{
                      height: 250,
                      margin: { t: 10, b: 40, l: 40, r: 10 },
                      xaxis: { title: "Rentang Jumlah Panen (kg)" },
                      yaxis: { title: "Frekuensi" },
                    }}
                    config={{ displayModeBar: false, responsive: true }}
                    style={{ width: "100%", height: "250px" }}
                  />
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Pola panen: lebih sering panen kecil atau besar? Cek
                    efisiensi operasional.
                  </p>
                </div>
              </div>
            </div>

            <HarvestInputModal
              open={showHarvestModal}
              onClose={() => setShowHarvestModal(false)}
              onSubmit={handleAddHarvest}
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
                    </tr>
                  </thead>
                  <tbody>
                    {harvestData
                      .sort(
                        (a, b) =>
                          new Date(b.date).getTime() -
                          new Date(a.date).getTime()
                      )
                      .map((row) => (
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
