// app/prediction/page.tsx
"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useAuth } from "@/context/AuthContext";
import {
  fetchPredictionData,
  PredictionData,
} from "@/lib/fetchPredictionDataHourly";
import AppHeader from "@/components/AppHeader";
import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Thermometer, Droplets, BrainCircuit } from "lucide-react";

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

// Extend PredictionData to include a timestamp for the chart
interface TimedPredictionData extends PredictionData {
  timestamp: string;
}

export default function PredictionPage() {
  const { user } = useAuth();
  const [predictionHistory, setPredictionHistory] = useState<TimedPredictionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const loadPrediction = async () => {
      try {
        const data = await fetchPredictionData(user.uid);
        if (data) {
          const newPoint: TimedPredictionData = {
            ...data,
            timestamp: new Date().toLocaleTimeString("id-ID"),
          };
          setPredictionHistory((prev) => {
            const newHistory = [...prev, newPoint];
            // Keep the history to a manageable size, e.g., last 20 points
            return newHistory.slice(-20);
          });
        }
        setError(null);
      } catch (err) {
        setError("Gagal memuat data prediksi.");
        console.error(err);
      } finally {
        if (loading) setLoading(false);
      }
    };

    // Fetch immediately and then set an interval
    loadPrediction();
    const interval = setInterval(loadPrediction, 15000); // Fetch every 15 seconds

    return () => clearInterval(interval);
  }, [user, loading]);

  const latestPrediction = predictionHistory[predictionHistory.length - 1];

  const ChartCard = ({
    title,
    dataKey,
    color,
    unit,
    Icon,
  }: {
    title: string;
    dataKey: keyof PredictionData;
    color: string;
    unit: string;
    Icon: React.FC<{ className?: string }>;
  }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
        <Icon className="text-gray-500" />
        <h3 className="text-lg font-semibold ml-3 text-gray-800 dark:text-white">
          {title}
        </h3>
      </div>
      <div className="p-4">
        <Plot
          data={[
            {
              x: predictionHistory.map((d) => d.timestamp),
              y: predictionHistory.map((d) => d[dataKey]),
              type: "scatter",
              mode: "lines+markers",
              marker: { color },
              line: { color, width: 2.5 },
            },
          ]}
          layout={{
            autosize: true,
            height: 250,
            margin: { l: 40, r: 20, t: 20, b: 40 },
            xaxis: {
              title: "Waktu",
              showgrid: false,
            },
            yaxis: {
              title: unit,
              zeroline: false,
            },
            paper_bgcolor: "transparent",
            plot_bgcolor: "transparent",
            font: {
              color: "#6b7280",
            },
          }}
          config={{ responsive: true, displayModeBar: false }}
          style={{ width: "100%", height: "250px" }}
        />
      </div>
    </div>
  );

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

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <main className="flex-1 p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                Prediksi Suhu dan Kelembapan
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Prediksi suhu dan kelembapan untuk 2 jam ke depan berdasarkan AI.
              </p>
            </div>

            {error && <div className="text-red-500 bg-red-100 p-3 rounded-lg">{error}</div>}

            {predictionHistory.length === 0 && !loading ? (
              <div className="text-center text-gray-500 py-10 bg-white rounded-lg border">
                <p>Belum ada data prediksi yang tersedia.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center gap-4">
                    <Thermometer className="w-12 h-12 text-red-500" />
                    <div>
                      <h3 className="text-gray-500 dark:text-gray-400">Prediksi Suhu</h3>
                      <p className="text-3xl font-bold text-gray-800 dark:text-white">
                        {latestPrediction?.temperature.toFixed(2) ?? "-"} °C
                      </p>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center gap-4">
                    <Droplets className="w-12 h-12 text-blue-500" />
                    <div>
                      <h3 className="text-gray-500 dark:text-gray-400">Prediksi Kelembapan</h3>
                      <p className="text-3xl font-bold text-gray-800 dark:text-white">
                        {latestPrediction?.humidity.toFixed(2) ?? "-"} %
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ChartCard
                    title="Grafik Prediksi Suhu"
                    dataKey="temperature"
                    color="#ef4444"
                    unit="°C"
                    Icon={Thermometer}
                  />
                  <ChartCard
                    title="Grafik Prediksi Kelembapan"
                    dataKey="humidity"
                    color="#3b82f6"
                    unit="%"
                    Icon={Droplets}
                  />
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
