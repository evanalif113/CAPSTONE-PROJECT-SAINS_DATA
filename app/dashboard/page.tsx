"use client";

import { useState, useEffect, useMemo } from "react"; // KOREKSI: Tambahkan useMemo
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useAuth } from "@/context/AuthContext";
import { 
  fetchSensorData, 
  SensorDate 
} from "@/lib/fetchSensorData";
import {
  fetchActuatorData,
  updateActuatorState,
  ActuatorData,
} from "@/lib/fetchActuatorData";
import { fetchMode, updateMode } from "@/lib/fetchModeData";
import AppHeader from "@/components/AppHeader";
import Sidebar from "@/components/Sidebar";
import {
  TemperatureIcon,
  HumidityIcon,
  LightIntensityIcon,
  MoistureIcon,
} from "@/components/Icon";
import  ToggleSwitch from "@/components/ToggleSwitch";
import { ArrowUp, ArrowDown, Minus, HardDrive } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import LoadingSpinner from "@/components/LoadingSpinner";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

type SensorKey = "temperature" | "humidity" | "light" | "moisture";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [modeAuto, setModeAuto] = useState(true);
  const [actuatorStates, setActuatorStates] = useState<ActuatorData | null>(
    null
  );
  const [data, setData] = useState<SensorDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const intervalData = 60;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Selamat Pagi";
    if (hour >= 12 && hour < 15) return "Selamat Siang";
    if (hour >= 15 && hour < 18) return "Selamat Sore";
    return "Selamat Malam";
  };

  const loadSensorData = async () => {
    if (!user) return;
    // Hindari setLoading(true) pada refresh interval agar UI tidak berkedip
    // setLoading akan true hanya pada pemuatan awal
    try {
      const result = await fetchSensorData(user.uid, intervalData);
      setData(result);
      setError(null);
    } catch (err) {
      setError("Gagal memuat data sensor");
    } finally {
      // Pastikan loading menjadi false setelah pemuatan pertama selesai
      if (loading) setLoading(false);
    }
  };

  const loadActuatorData = async () => {
    if (!user) return;
    try {
      const result = await fetchActuatorData(user.uid);
      if (result) {
        setActuatorStates(result);
      }
    } catch (err) {
      // Anda bisa menambahkan state error spesifik untuk aktuator jika perlu
      console.error("Gagal memuat data aktuator:", err);
      setError((prevError) => prevError || "Gagal memuat status aktuator");
    }
  };

  const loadMode = async () => {
    if (!user) return;
    try {
      const isAuto = await fetchMode(user.uid);
      setModeAuto(isAuto);
    } catch (err) {
      console.error("Gagal memuat status mode:", err);
      setError((prevError) => prevError || "Gagal memuat status mode");
    }
  };

  useEffect(() => {
    if (user) {
      setLoading(true); // Set loading hanya sekali saat user pertama kali ada
      loadActuatorData();
      loadSensorData();
      loadMode();
      const interval = setInterval(loadSensorData, 10000); // 10 detik polling
      return () => clearInterval(interval);
    }
  }, [user]);

  // KOREKSI: Ambil data terbaru dari AWAL array, bukan akhir
  // Gunakan useMemo untuk mencegah kalkulasi ulang yang tidak perlu pada setiap render
  const { latest, prev, chartData } = useMemo(() => {
    if (data.length === 0) {
      return { latest: null, prev: null, chartData: [] };
    }
    // Data sudah diurutkan dari terbaru -> terlama oleh fetchSensorData
    const latest = data[0];
    const prev = data.length > 1 ? data[1] : null;

    // Untuk grafik, kita ingin urutan waktu dari kiri ke kanan (terlama -> terbaru)
    // Jadi kita balik lagi array-nya khusus untuk chart.
    const chartData = [...data].reverse();

    return { latest, prev, chartData };
  }, [data]);

  const sensorCards = useMemo(() => {
    if (!latest) return [];

    const createTrend = (current: number, previous: number | null) => {
      if (previous === null) return "-";
      if (current > previous) return "Naik";
      if (current < previous) return "Turun";
      return "-";
    };

    return [
      {
        title: "Suhu Udara",
        value: latest.temperature.toFixed(2),
        unit: "°C",
        status: "Normal", // Logika status bisa dikembangkan di sini
        trend: createTrend(latest.temperature, prev?.temperature ?? null),
      },
      {
        title: "Kelembapan Udara",
        value: latest.humidity.toFixed(2),
        unit: "%",
        status: "Normal",
        trend: createTrend(latest.humidity, prev?.humidity ?? null),
      },
      {
        title: "Intensitas Cahaya",
        value: latest.light.toFixed(2),
        unit: "lux",
        status: "Normal",
        trend: createTrend(latest.light, prev?.light ?? null),
      },
      {
        title: "Kelembapan Media",
        value: latest.moisture.toFixed(1),
        unit: "%",
        status: "Normal",
        trend: createTrend(latest.moisture, prev?.moisture ?? null),
      },
    ];
  }, [latest, prev]);

  // ... (Komponen ChartCard dan ToggleSwitch tetap sama) ...
  // Helper untuk min/max domain YAxis
  function getYAxisDomain(data: SensorDate[], key: SensorKey) {
    const vals = data.map((d) => d[key]);
    if (vals.length === 0) return [0, 1]; // Default jika tidak ada data

    let min = Math.min(...vals);
    let max = Math.max(...vals);

    if (min === max) {
      min -= 1;
      max += 1;
    } else {
      const padding = (max - min) * 0.1;
      min -= padding;
      max += padding;
    }
    return [min, max];
  }

  const isSystemOffline = useMemo(() => {
    if (!latest?.timestamp) {
      // If there's no data or timestamp, we can't determine the status.
      // The main component already handles the "No Data" screen.
      return false;
    }
    const fifteenMinutesInMillis = 15 * 60 * 1000;
    const lastDataTime = latest.timestamp; // Already in milliseconds
    const now = new Date().getTime();

    return now - lastDataTime > fifteenMinutesInMillis;
  }, [latest]);

  // Chart Card Component
  const ChartCard = ({
    title,
    dataKey,
    color,
    Icon,
    unit,
  }: {
    title: string;
    dataKey: SensorKey;
    color: string;
    Icon: React.FC;
    unit: string;
  }) => {
    const yDomain = getYAxisDomain(chartData, dataKey);
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex items-center">
          <Icon />
          <h3 className={`text-sm font-medium ml-2`} style={{ color }}>
            {title}
          </h3>
        </div>
        <div className="p-4">
          <Plot
            data={[
              {
                // KOREKSI: Langsung gunakan `timeFormatted` karena sudah pasti ada.
                x: chartData.map((d) => d.timeFormatted),
                y: chartData.map((d) => d[dataKey]),
                type: "scatter",
                mode: "lines+markers",
                marker: { color },
                line: { color, width: 2.5 },
                name: title,
              },
            ]}
            layout={{
              autosize: true,
              height: 200,
              margin: { l: 40, r: 10, t: 10, b: 40 },
              xaxis: {
                title: "Waktu", // Lebih deskriptif
                tickmode: "auto",
                nticks: 6, // Mengurangi jumlah tick agar tidak terlalu ramai
                showgrid: true,
                zeroline: false,
              },
              yaxis: {
                title: unit,
                range: yDomain,
                showgrid: true,
                zeroline: false,
              },
              plot_bgcolor: "transparent",
              paper_bgcolor: "transparent",
              font: { size: 12 },
            }}
            config={{
              responsive: true,
              displayModeBar: false,
            }}
            style={{ width: "100%", height: "200px" }}
            useResizeHandler
          />
        </div>
      </div>
    );
  };

  const handleActuatorToggle = async (pinId: number, checked: boolean) => {
    if (!user || !actuatorStates) return;

    // UBAH LOGIKA: checked (ON) = 0, unchecked (OFF) = 1
    const newState = checked ? 0 : 1;
    const oldStates = { ...actuatorStates }; // Simpan state lama untuk rollback

    // 1. Pembaruan UI Optimis: Langsung ubah state lokal agar UI responsif
    setActuatorStates((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [pinId]: newState,
      };
    });

    try {
      // 2. Kirim pembaruan ke Firebase dengan mode 'manual'
      await updateActuatorState(user.uid, pinId, newState, 'manual');
    } catch (error) {
      // 3. Jika gagal, kembalikan UI ke state sebelumnya (rollback)
      console.error("Gagal update aktuator, mengembalikan state.");
      setActuatorStates(oldStates);
      // Tampilkan notifikasi error ke pengguna jika perlu
    }
  };

  const handleModeToggle = async (isAuto: boolean) => {
    if (!user) return;
    const oldMode = modeAuto;
    setModeAuto(isAuto); // Optimistic UI update
    try {
      await updateMode(user.uid, isAuto);
    } catch (error) {
      console.error("Gagal update mode, mengembalikan state.");
      setModeAuto(oldMode); // Rollback on failure
    }
  };


  if (loading) {
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

  // Cek jika tidak ada data sama sekali setelah loading selesai
  if (!data.length && !actuatorStates) {
    return (
      <ProtectedRoute>
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <AppHeader />
            <main className="flex-1 p-6 flex flex-col items-center justify-center text-center">
              <HardDrive size={64} className="text-gray-400 dark:text-gray-500 mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Tidak Ada Data Perangkat
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Sepertinya Anda belum menambahkan perangkat. Silakan tambahkan perangkat untuk mulai memonitor.
              </p>
              <Link href="/device" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Tambahkan Perangkat
              </Link>
            </main>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar/>
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <main className="flex-1 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                {getGreeting()}, {user?.displayName || 'Pengguna'}!
              </h1>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mt-1">
                  Data Terakhir Diperbarui{" "}
                  {/* KOREKSI: Gunakan `timeFormatted` yang sudah ada */}
                  {latest ? latest.dateFormatted : ":"}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-medium text-gray-700">Mode</span>
                <div className="flex items-center gap-2">
                  <span className={`font-semibold ${!modeAuto ? 'text-blue-600' : 'text-gray-400'}`}>Manual</span>
                  <ToggleSwitch
                    checked={modeAuto}
                    onChange={handleModeToggle}
                    disabled={!user}
                  />
                  <span className={`font-semibold ${modeAuto ? 'text-blue-600' : 'text-gray-400'}`}>Otomatis</span>
                </div>
              </div>
            </div>

            {error && <div className="text-red-500">{error}</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* KOREKSI: Gunakan `sensorCards` hasil dari useMemo */}
              {sensorCards.map((sensor, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
                >
                  <h3 className="text-sm font-medium text-gray-600 mb-3">
                    {sensor.title}
                  </h3>
                  <div className="flex items-baseline space-x-1 mb-3">
                    <span className="text-3xl font-bold text-gray-900">
                      {sensor.value}
                    </span>
                    <span className="text-sm text-gray-500">{sensor.unit}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-2">
                      Status
                      <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">
                        {sensor.status}
                      </span>
                    </span>
                    <span className="flex items-center gap-1">
                      Tren
                      {/* KOREKSI: Logika untuk menampilkan ikon tren yang benar */}
                      {sensor.trend === "Naik" ? (
                        <ArrowUp size={14} className="text-green-500" />
                      ) : sensor.trend === "Turun" ? (
                        <ArrowDown size={14} className="text-red-500" />
                      ) : (
                        <Minus size={14} className="text-gray-400" />
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {/* ... (Bagian Chart dan Status Sistem & Aktuator tetap sama, hanya saja sumber datanya sudah benar) ... */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard
                title="Suhu Udara"
                dataKey="temperature"
                color="#ef4444"
                Icon={TemperatureIcon}
                unit="°C"
              />
              <ChartCard
                title="Kelembapan Udara"
                dataKey="humidity"
                color="#3b82f6"
                Icon={HumidityIcon}
                unit="%"
              />
              <ChartCard
                title="Intensitas Cahaya"
                dataKey="light"
                color="#f59e0b"
                Icon={LightIntensityIcon}
                unit="lux"
              />
              <ChartCard
                title="Kelembapan Media"
                dataKey="moisture"
                color="#10b981"
                Icon={MoistureIcon}
                unit="%"
              />
            </div>
            {/* System Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Status Sistem
                </h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status Sistem</span>
                    <span
                      className={`px-2 py-1 rounded text-sm text-white ${
                        isSystemOffline ? "bg-red-500" : "bg-green-500"
                      }`}
                    >
                      {isSystemOffline ? "Offline" : "Online"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Terakhir data diterima
                    </span>
                    <span className="text-gray-900">
                      {latest ? latest.timeFormatted : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Level Sinyal</span>
                    <span className="text-gray-900">Bagus</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Uptime</span>
                    <span className="text-gray-900">5 hari 32 menit</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Actuator Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Status Aktuator
                </h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { name: "Kipas", pin: 16 },
                    { name: "Misting", pin: 17 },
                    { name: "Pencahayaan", pin: 18 },
                  ].map((actuator) => (
                    <div
                      key={actuator.pin}
                      className="flex flex-col items-center p-4 rounded-lg bg-gray-50 border"
                    >
                      <span className="text-lg font-medium text-gray-700">
                        {actuator.name}
                      </span>
                      <div className="my-3">
                        {/* Wrapper untuk Toggle */}
                        <ToggleSwitch
                          // UBAH LOGIKA: Toggle 'checked' jika state adalah 0 (ON)
                          checked={actuatorStates?.[actuator.pin] === 0}
                          // Panggil handler dengan pinId yang sesuai saat diubah
                          onChange={(isChecked) =>
                            handleActuatorToggle(actuator.pin, isChecked)
                          }
                          // Tombol non-aktif jika data belum dimuat atau mode otomatis
                          disabled={actuatorStates === null || modeAuto}
                        />
                      </div>
                      <span
                        className={`px-3 py-1 text-sm font-bold rounded-full ${
                          // UBAH LOGIKA: Gaya ON jika state adalah 0
                          actuatorStates?.[actuator.pin] === 0
                            ? "bg-green-100 text-green-800" // Gaya untuk status ON
                            : "bg-gray-200 text-gray-800" // Gaya untuk status OFF
                        }`}
                      >
                        {actuatorStates === null
                          ? "Loading..." // Tampilkan 'Loading...' jika data belum siap
                          // UBAH LOGIKA: Tampilkan ON jika state adalah 0
                          : actuatorStates?.[actuator.pin] === 0
                          ? "ON" // Teks jika status 0
                          : "OFF" // Teks jika status 1
                        }
                      </span>
                      {modeAuto && (
                        <span className="text-xs text-gray-500 mt-2">(Mode Otomatis)</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
