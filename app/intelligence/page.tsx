"use client";

import { useState, useEffect, useMemo } from "react";
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
import AppHeader from "@/components/AppHeader";
import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import dynamic from "next/dynamic";
import { useAuth } from "@/context/AuthContext";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

// --- Helper & Data ---
type Harvest = {
  date: string;
  amount: number;
  quality: string;
  note: string;
  avgTemp?: number;
  avgHumidity?: number;
};

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

// --- Modal Input Panen ---
function HarvestInputModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Harvest) => void;
}) {
  const [form, setForm] = useState<Harvest>({
    date: "",
    amount: 0,
    quality: "",
    note: "",
  });

  useEffect(() => {
    if (open) setForm({ date: "", amount: 0, quality: "", note: "" });
  }, [open]);

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
    setForm({ date: "", amount: 0, quality: "", note: "" });
    onClose();
  };
  
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          aria-label="Tutup"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
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
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
            >
              <option value="">Pilih Kualitas</option>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="Opsional"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Simpan Data
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- Data Dummy Panen & Sensor untuk Simulasi Analitik ---
// Periode 1: Awal (hasil belum optimal, lingkungan tidak stabil)
// Periode 2: Perbaikan (lingkungan makin stabil, kualitas naik)
// Periode 3: Ideal (lingkungan stabil, hasil optimal)
// Ada beberapa anomali (panen gagal, suhu/kelembapan melonjak)

export const dummyHarvestData: Harvest[] = [
  // Periode 1 (awal)
  {
    date: "2024-05-01",
    amount: 2.1,
    quality: "C",
    note: "Banyak baglog terkontaminasi",
    avgTemp: 27.2,
    avgHumidity: 88.5,
  },
  {
    date: "2024-05-12",
    amount: 2.5,
    quality: "B",
    note: "Suhu fluktuatif, kelembapan turun malam hari",
    avgTemp: 26.8,
    avgHumidity: 85.2,
  },
  {
    date: "2024-05-23",
    amount: 2.0,
    quality: "C",
    note: "Kipas rusak 2 hari",
    avgTemp: 28.5,
    avgHumidity: 80.0,
  },
  // Periode 2 (perbaikan)
  {
    date: "2024-06-03",
    amount: 3.2,
    quality: "B",
    note: "Mulai perbaiki kontrol kelembapan",
    avgTemp: 26.0,
    avgHumidity: 87.0,
  },
  {
    date: "2024-06-14",
    amount: 3.5,
    quality: "A",
    note: "Lingkungan lebih stabil",
    avgTemp: 25.5,
    avgHumidity: 89.5,
  },
  {
    date: "2024-06-25",
    amount: 3.1,
    quality: "B",
    note: "Kelembapan turun mendadak (anomali)",
    avgTemp: 25.8,
    avgHumidity: 78.0,
  },
  // Periode 3 (ideal)
  {
    date: "2024-07-06",
    amount: 4.0,
    quality: "A",
    note: "Kondisi optimal",
    avgTemp: 25.0,
    avgHumidity: 90.0,
  },
  {
    date: "2024-07-17",
    amount: 4.2,
    quality: "A",
    note: "Kualitas dan kuantitas stabil",
    avgTemp: 24.8,
    avgHumidity: 91.0,
  },
  {
    date: "2024-07-28",
    amount: 3.8,
    quality: "B",
    note: "Sedikit penurunan kelembapan",
    avgTemp: 25.2,
    avgHumidity: 88.0,
  },
  {
    date: "2024-08-10",
    amount: 4.0,
    quality: "A",
    note: "Panen optimal, lingkungan stabil",
    avgTemp: 25.0,
    avgHumidity: 90.5,
  },
  {
    date: "2024-08-24",
    amount: 3.9,
    quality: "A",
    note: "Kualitas tetap baik",
    avgTemp: 24.9,
    avgHumidity: 91.0,
  },
  {
    date: "2024-09-07",
    amount: 3.7,
    quality: "B",
    note: "Kelembapan turun 1 hari",
    avgTemp: 25.3,
    avgHumidity: 87.5,
  },
  {
    date: "2024-09-21",
    amount: 4.1,
    quality: "A",
    note: "Panen meningkat lagi",
    avgTemp: 24.8,
    avgHumidity: 91.2,
  },
  {
    date: "2024-10-05",
    amount: 4.2,
    quality: "A",
    note: "Lingkungan sangat stabil",
    avgTemp: 24.7,
    avgHumidity: 92.0,
  },
  {
    date: "2024-10-19",
    amount: 3.8,
    quality: "B",
    note: "Suhu naik 2 hari (anomali)",
    avgTemp: 25.5,
    avgHumidity: 89.0,
  },
  {
    date: "2024-11-02",
    amount: 4.3,
    quality: "A",
    note: "Panen sangat baik",
    avgTemp: 24.6,
    avgHumidity: 92.5,
  },
  {
    date: "2024-11-16",
    amount: 4.0,
    quality: "B",
    note: "Kelembapan turun sedikit",
    avgTemp: 25.1,
    avgHumidity: 88.5,
  },
  {
    date: "2024-11-30",
    amount: 4.4,
    quality: "A",
    note: "Panen optimal",
    avgTemp: 24.7,
    avgHumidity: 92.8,
  },
  {
    date: "2024-12-14",
    amount: 4.2,
    quality: "A",
    note: "Kualitas dan kuantitas stabil",
    avgTemp: 24.8,
    avgHumidity: 91.9,
  },
  {
    date: "2024-12-28",
    amount: 4.1,
    quality: "B",
    note: "Kelembapan turun mendadak (anomali)",
    avgTemp: 25.2,
    avgHumidity: 86.0,
  },
  {
    date: "2025-01-11",
    amount: 4.3,
    quality: "A",
    note: "Panen awal tahun sangat baik",
    avgTemp: 24.7,
    avgHumidity: 92.2,
  },
  {
    date: "2025-01-25",
    amount: 4.0,
    quality: "B",
    note: "Suhu naik 1 hari (anomali)",
    avgTemp: 25.4,
    avgHumidity: 89.5,
  },
  {
    date: "2025-02-08",
    amount: 4.4,
    quality: "A",
    note: "Lingkungan kembali stabil",
    avgTemp: 24.6,
    avgHumidity: 92.7,
  },
  {
    date: "2025-02-22",
    amount: 4.2,
    quality: "A",
    note: "Kualitas tetap terjaga",
    avgTemp: 24.8,
    avgHumidity: 91.8,
  },
  {
    date: "2025-03-08",
    amount: 4.1,
    quality: "B",
    note: "Kelembapan turun sedikit",
    avgTemp: 25.0,
    avgHumidity: 89.0,
  },
  {
    date: "2025-03-22",
    amount: 4.5,
    quality: "A",
    note: "Panen sangat optimal",
    avgTemp: 24.5,
    avgHumidity: 93.0,
  },
  {
    date: "2025-04-05",
    amount: 4.3,
    quality: "A",
    note: "Lingkungan sangat stabil",
    avgTemp: 24.7,
    avgHumidity: 92.5,
  },
  {
    date: "2025-04-19",
    amount: 4.1,
    quality: "B",
    note: "Suhu naik 2 hari (anomali)",
    avgTemp: 25.6,
    avgHumidity: 89.2,
  },
  {
    date: "2025-05-03",
    amount: 4.4,
    quality: "A",
    note: "Panen sangat baik",
    avgTemp: 24.7,
    avgHumidity: 92.1,
  },
  {
    date: "2025-05-17",
    amount: 4.2,
    quality: "A",
    note: "Lingkungan stabil",
    avgTemp: 24.8,
    avgHumidity: 91.9,
  },
  {
    date: "2025-05-31",
    amount: 4.1,
    quality: "B",
    note: "Kelembapan turun sedikit",
    avgTemp: 25.0,
    avgHumidity: 89.5,
  },
  {
    date: "2025-06-14",
    amount: 4.5,
    quality: "A",
    note: "Panen pertengahan tahun optimal",
    avgTemp: 24.6,
    avgHumidity: 92.7,
  },
];

// --- Main Page ---
export default function IntelligencePage() {
  const { user } = useAuth();
  const [period, setPeriod] = useState("30 Hari");
  const [metric, setMetric] = useState("Semua");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [showHarvestModal, setShowHarvestModal] = useState(false);
  const [harvestData, setHarvestData] = useState<Harvest[]>(dummyHarvestData);
  const [mediaTanamKering, setMediaTanamKering] = useState(100);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Selamat Pagi";
    if (hour >= 12 && hour < 15) return "Selamat Siang";
    if (hour >= 15 && hour < 18) return "Selamat Sore";
    return "Selamat Malam";
  };

  const handleAddHarvest = (data: Harvest) => {
    setHarvestData((prev) => [...prev, data]);
  };

  // KPI
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

  // KPI Cards Data
  const kpiCards = [
    {
      label: "Efisiensi Biologis",
      value: efisiensiBiologis,
      unit: "%",
      trend: efisiensiBiologis >= 100 ? 1 : -1,
      up: efisiensiBiologis >= 100,
      description: `Total Panen: ${totalPanenBasah} kg / Media Kering: ${mediaTanamKering} kg`,
      color: "bg-green-100 text-green-800",
      icon: <BarChart2 className="w-6 h-6" />,
      tooltip:
        "Efisiensi Biologis = (Total Panen Basah / Media Tanam Kering) × 100%",
    },
    {
      label: "Total Panen",
      value: totalPanenBasah,
      unit: "kg",
      trend: totalPanenBasah > 0 ? 1 : 0,
      up: totalPanenBasah > 0,
      description: "",
      color: "bg-blue-100 text-blue-800",
      icon: <FileText className="w-6 h-6" />,
      tooltip: "Akumulasi seluruh panen basah (kg).",
    },
    {
      label: "Suhu Rata-rata",
      value: avgTemp.toFixed(1),
      unit: "°C",
      trend: 0,
      up: true,
      description: "",
      color: "bg-yellow-100 text-yellow-800",
      icon: <AreaChart className="w-6 h-6" />,
      tooltip: "Rata-rata suhu lingkungan saat panen.",
    },
    {
      label: "Kelembaban Rata-rata",
      value: avgHumidity.toFixed(1),
      unit: "%",
      trend: 0,
      up: true,
      description: "",
      color: "bg-cyan-100 text-cyan-800",
      icon: <LineChart className="w-6 h-6" />,
      tooltip: "Rata-rata kelembapan lingkungan saat panen.",
    },
  ];

  // Badge warna kualitas
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

  // Empty state
  const isEmpty = harvestData.length === 0;

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <main className="flex-1 p-6 space-y-8">
            {/* Greeting */}
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-gray-800">
                {getGreeting()}, {user?.displayName || 'Pengguna'}!
              </h1>
              <p className="text-md text-gray-500">
                Berikut adalah analisis data dari Kumbung Jamur Anda.
              </p>
            </div>

            {/* Input Berat Media Tanam Kering */}
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

            {/* Input Data Panen Button */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
              <button
                onClick={() => setShowHarvestModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                Input Data Panen
              </button>
            </div>

            {/* KPI Cards */}
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
                  {kpi.description && (
                    <div className="text-xs text-gray-500 mt-1">
                      {kpi.description}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option>24 Jam</option>
                  <option>7 Hari</option>
                  <option>30 Hari</option>
                  <option>1 Tahun</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <select
                  value={metric}
                  onChange={(e) => setMetric(e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option>Semua</option>
                  <option>Panen</option>
                  <option>Kualitas</option>
                  <option>Efisiensi</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Rentang Tanggal:</span>
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, from: e.target.value })
                  }
                  className="border rounded px-2 py-1 text-sm"
                />
                <span className="mx-1 text-gray-400">-</span>
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, to: e.target.value })
                  }
                  className="border rounded px-2 py-1 text-sm"
                />
              </div>
              <button className="flex items-center px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                <Download className="w-4 h-4 mr-1" /> Export PDF
              </button>
              <button className="flex items-center px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm">
                <Download className="w-4 h-4 mr-1" /> Export Excel
              </button>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Line Chart Sample */}
              <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
                <div className="flex items-center mb-4">
                  <AreaChart className="w-5 h-5 text-blue-500 mr-2" />
                  <span className="font-semibold text-gray-800">
                    Tren Suhu & Kelembaban
                  </span>
                </div>
                <div className="h-56 flex items-center justify-center text-gray-400">
                  <span>[Line Chart Sample]</span>
                </div>
              </div>
              {/* Bar Chart Sample */}
              <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
                <div className="flex items-center mb-4">
                  <BarChart2 className="w-5 h-5 text-orange-500 mr-2" />
                  <span className="font-semibold text-gray-800">
                    Analisis Produksi Bulanan
                  </span>
                </div>
                <div className="h-56 flex items-center justify-center text-gray-400">
                  <span>[Bar Chart Sample]</span>
                </div>
              </div>
            </div>

            {/* Analisis Lanjutan */}
            <div className="mt-10">
              <h2 className="text-xl font-bold mb-4">Analisis Lanjutan</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* a. Donut Chart Distribusi Kualitas */}
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
                    Proporsi kualitas panen (A, B, C) untuk deteksi dini masalah
                    produksi.
                  </p>
                </div>

                {/* b. Korelasi Jumlah vs Kualitas (Scatter) */}
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

                {/* c. Histogram Frekuensi Jumlah Panen */}
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

            {/* Key Insights Panel */}
            <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
              <div className="flex items-center mb-4">
                <LineChart className="w-5 h-5 text-green-500 mr-2" />
                <span className="font-semibold text-gray-800">
                  Key Insights
                </span>
              </div>
              <ul className="list-disc ml-6 text-gray-700 space-y-1">
                {isEmpty ? (
                  <li>
                    Belum ada data panen. Silakan input data untuk melihat
                    insight.
                  </li>
                ) : (
                  <>
                    <li>
                      {efisiensiBiologis >= 100
                        ? "Efisiensi Biologis sangat baik."
                        : "Efisiensi Biologis masih perlu ditingkatkan."}
                    </li>
                    <li>
                      Suhu rata-rata panen: {avgTemp.toFixed(1)}°C, kelembapan
                      rata-rata: {avgHumidity.toFixed(1)}%
                    </li>
                    <li>
                      Panen terbanyak:{" "}
                      {harvestData.length > 0
                        ? Math.max(...harvestData.map((h) => h.amount))
                        : 0}{" "}
                      kg
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* Reports Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow p-5 border border-gray-100">
                <div className="flex items-center mb-2">
                  <FileText className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="font-semibold">Monthly Summary</span>
                </div>
                <p className="text-gray-600 text-sm mb-2">
                  Ringkasan performa dan produksi bulanan.
                </p>
                <button className="flex items-center px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                  <Download className="w-4 h-4 mr-1" /> Download PDF
                </button>
              </div>
              <div className="bg-white rounded-xl shadow p-5 border border-gray-100">
                <div className="flex items-center mb-2">
                  <FileText className="w-5 h-5 text-orange-600 mr-2" />
                  <span className="font-semibold">Production Analysis</span>
                </div>
                <p className="text-gray-600 text-sm mb-2">
                  Analisis detail produksi dan kualitas panen.
                </p>
                <button className="flex items-center px-3 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 text-sm">
                  <Download className="w-4 h-4 mr-1" /> Download PDF
                </button>
              </div>
              <div className="bg-white rounded-xl shadow p-5 border border-gray-100">
                <div className="flex items-center mb-2">
                  <FileText className="w-5 h-5 text-green-600 mr-2" />
                  <span className="font-semibold">Environmental Report</span>
                </div>
                <p className="text-gray-600 text-sm mb-2">
                  Laporan kondisi lingkungan dan rekomendasi.
                </p>
                <button className="flex items-center px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm">
                  <Download className="w-4 h-4 mr-1" /> Download PDF
                </button>
              </div>
            </div>

            {/* Modal Input Data Panen */}
            <HarvestInputModal
              open={showHarvestModal}
              onClose={() => setShowHarvestModal(false)}
              onSubmit={handleAddHarvest}
            />

            {/* Tabel Data Panen */}
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
                      .map((row, idx) => (
                        <tr
                          key={idx}
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
