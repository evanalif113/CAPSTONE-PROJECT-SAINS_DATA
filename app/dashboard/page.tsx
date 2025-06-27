"use client";

import { useState, useEffect, useMemo } from "react"; // KOREKSI: Tambahkan useMemo
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useAuth } from "@/context/AuthContext";
import { 
  fetchSensorData, 
  SensorData 
} from "@/lib/fetchSensorData";
import {
  fetchActuatorData,
  updateActuatorState,
  ActuatorData,
} from "@/lib/fetchActuatorData";
import AppHeader from "@/components/AppHeader";
import Sidebar from "@/components/Sidebar";
import { getNavItems } from "@/components/navItems";
import {
  TemperatureIcon,
  HumidityIcon,
  LightIntensityIcon,
  MoistureIcon,
} from "@/components/Icon";
import { ArrowUp, ArrowDown, Minus } from "lucide-react"; // KOREKSI: Tambahkan ikon Minus
import ProtectedRoute from "@/components/ProtectedRoute";

const navItems = getNavItems("/");
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

type SensorKey = "temperature" | "humidity" | "light" | "moisture";

// Hapus interface SensorDatum karena kita sudah impor SensorData

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [modeAuto, setModeAuto] = useState(true);
  const [actuatorStates, setActuatorStates] = useState<ActuatorData | null>(null);
  const [data, setData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const intervalData = 60;

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

  useEffect(() => {
    if (user) {
      setLoading(true); // Set loading hanya sekali saat user pertama kali ada
      loadActuatorData();
      loadSensorData();
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
  function getYAxisDomain(data: SensorData[], key: SensorKey) {
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
                line: { color, width: 3 },
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

  const handleActuatorToggle = async (pinId: string, checked: boolean) => {
    if (!user || !actuatorStates) return;

    const newState = checked ? 1 : 0;
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
      // 2. Kirim pembaruan ke Firebase
      await updateActuatorState(user.uid, pinId, newState);
    } catch (error) {
      // 3. Jika gagal, kembalikan UI ke state sebelumnya (rollback)
      console.error("Gagal update aktuator, mengembalikan state.");
      setActuatorStates(oldStates);
      // Tampilkan notifikasi error ke pengguna jika perlu
    }
  };

  // ToggleSwitch tetap
  const ToggleSwitch = ({
    checked,
    onChange,
    disabled = false,
  }: {
    checked: boolean;
    onChange: (val: boolean) => void;
    disabled?: boolean;
  }) => (
    <button
      type="button"
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        checked ? "bg-green-600" : "bg-gray-200"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar navItems={navItems} />
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <main className="flex-1 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Terakhir diperbarui{" "}
                  {/* KOREKSI: Gunakan `timeFormatted` yang sudah ada */}
                  {latest ? latest.timeFormatted : ":"}
                </p>
              </div>
            </div>

            {error && <div className="text-red-500">{error}</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* KOREKSI: Gunakan `sensorCards` hasil dari useMemo */}
              {sensorCards.map((sensor, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
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
               <ChartCard title="Suhu Udara" dataKey="temperature" color="#ef4444" Icon={TemperatureIcon} unit="°C" />
               <ChartCard title="Kelembapan Udara" dataKey="humidity" color="#3b82f6" Icon={HumidityIcon} unit="%" />
               <ChartCard title="Intensitas Cahaya" dataKey="light" color="#f59e0b" Icon={LightIntensityIcon} unit="lux" />
               <ChartCard title="Kelembapan Media" dataKey="moisture" color="#10b981" Icon={MoistureIcon} unit="%" />
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
                    <span className="bg-green-500 text-white px-2 py-1 rounded text-sm">
                      Online
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Terakhir data diterima
                    </span>
                    <span className="text-gray-900">
                      {latest
                        ? new Date(latest.timestamp).toLocaleString()
                        : "-"}
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
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { name: "Fan", pin: "16" },
                      { name: "Humidifier", pin: "17" },
                      { name: "Light", pin: "18" },
                    ].map((actuator) => (
                    <div key={actuator.pin} className="flex flex-col items-center">
                      <span className="text-gray-600 mb-2">{actuator.name}</span>
                      <ToggleSwitch
                      // Baca status 'checked' dari state, !!actuatorStates... mengubah 1->true, 0/undefined->false
                      checked={!!actuatorStates?.[actuator.pin]}
                      // Panggil handler dengan pinId yang sesuai saat diubah
                      onChange={(isChecked) =>
                      handleActuatorToggle(actuator.pin, isChecked)
                      }
                      // Tombol non-aktif jika data belum dimuat
                     disabled={!actuatorStates}
                    />
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}