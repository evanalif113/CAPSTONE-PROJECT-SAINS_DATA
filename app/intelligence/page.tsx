"use client";

import { useState } from "react";
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
} from "lucide-react";
import AppHeader from "@/components/AppHeader";
import Sidebar from "@/components/Sidebar";
import { getNavItems } from "@/components/navItems";
import ProtectedRoute from "@/components/ProtectedRoute";

const navItems = getNavItems("/intelligence");

// Sample data
const kpiData = [
  { label: "Total Panen", value: 1200, unit: "kg", trend: 5.2, up: true },
  { label: "Suhu Rata-rata", value: 24.5, unit: "°C", trend: -1.1, up: false },
  { label: "Kelembaban Rata-rata", value: 78, unit: "%", trend: 2.4, up: true },
  { label: "Uptime Sistem", value: 99.7, unit: "%", trend: 0.3, up: true },
];

const monthlyProduction = [
  { month: "Jan", panen: 100, kualitas: 90, efisiensi: 80 },
  { month: "Feb", panen: 120, kualitas: 92, efisiensi: 85 },
  { month: "Mar", panen: 130, kualitas: 91, efisiensi: 88 },
  { month: "Apr", panen: 110, kualitas: 89, efisiensi: 82 },
  { month: "Mei", panen: 140, kualitas: 93, efisiensi: 90 },
  { month: "Jun", panen: 125, kualitas: 94, efisiensi: 87 },
];

const insights = [
  "Produksi meningkat 5% dibanding bulan lalu.",
  "Suhu rata-rata stabil dalam rentang optimal.",
  "Efisiensi sistem meningkat setelah maintenance.",
];

// Komponen Modal Input Data Panen
type Harvest = {
  date: string;
  amount: number;
  quality: string;
  note: string;
};

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

export default function IntelligencePage() {
  const [period, setPeriod] = useState("30 Hari");
  const [metric, setMetric] = useState("Semua");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [showHarvestModal, setShowHarvestModal] = useState(false);
  const [harvestData, setHarvestData] = useState<Harvest[]>([]);

  const handleAddHarvest = (data: Harvest) => {
    setHarvestData((prev) => [...prev, data]);
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar/>
        <div className="flex-1 flex flex-col">
          <AppHeader/>
          <main className="flex-1 p-6 space-y-8">
            {/* Header & Input Data Panen Button */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">
                Business Intelligence
              </h1>
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
              {kpiData.map((kpi, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl shadow p-5 flex flex-col items-start border border-gray-100"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg font-semibold">{kpi.label}</span>
                    {kpi.up ? (
                      <TrendingUp className="text-green-500 w-5 h-5" />
                    ) : (
                      <TrendingDown className="text-red-500 w-5 h-5" />
                    )}
                    <span
                      className={`text-xs ${
                        kpi.up ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {kpi.trend > 0 ? "+" : ""}
                      {kpi.trend}%
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">
                    {kpi.value}
                    <span className="text-base font-normal text-gray-500 ml-1">
                      {kpi.unit}
                    </span>
                  </div>
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
                  {/* Placeholder chart, ganti dengan chart library sesuai kebutuhan */}
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
                  {/* Placeholder chart, ganti dengan chart library sesuai kebutuhan */}
                  <span>[Bar Chart Sample]</span>
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
                {insights.map((ins, idx) => (
                  <li key={idx}>{ins}</li>
                ))}
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

            {/* Tabel Data Panen (opsional, tampilkan jika ada data) */}
            {harvestData.length > 0 && (
              <div className="bg-white rounded-lg shadow border border-gray-200 p-4 mt-8">
                <h2 className="text-lg font-semibold mb-4">
                  Riwayat Data Panen
                </h2>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 text-left">Tanggal</th>
                      <th className="py-2 text-left">Jumlah (kg)</th>
                      <th className="py-2 text-left">Kualitas</th>
                      <th className="py-2 text-left">Catatan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {harvestData.map((row, idx) => (
                      <tr key={idx} className="border-b last:border-b-0">
                        <td className="py-2">{row.date}</td>
                        <td className="py-2">{row.amount}</td>
                        <td className="py-2">{row.quality}</td>
                        <td className="py-2">{row.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
