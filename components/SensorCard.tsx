// components/SensorCard.tsx
"use client";

import { useState, useEffect } from 'react';
import { onValue, ref } from 'firebase/database';
import { database } from '@/lib/firebaseConfig';
import { Device } from '@/lib/manageDevices';
import { SensorData } from '@/lib/fetchSensorData';

import { Edit, Trash2, Thermometer, Droplet, Sun, Droplets } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface SensorCardProps {
  device: Device;
  userId: string;
  onEdit: () => void;
  onDelete: () => void;
}

const SensorCard: React.FC<SensorCardProps> = ({ device, userId, onEdit, onDelete }) => {
  const [data, setData] = useState<SensorData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listener real-time HANYA untuk data sensor
    const sensorRef = ref(database, `${userId}/sensor/data`);
    const unsubscribe = onValue(sensorRef, (snapshot) => {
      if (snapshot.exists()) {
        const allData = snapshot.val();
        // Ambil data terbaru (sesuai logika Anda sebelumnya)
        const latestKey = Object.keys(allData).sort().pop();
        if (latestKey) {
          setData({ timestamp: Number(latestKey), ...allData[latestKey] });
        }
      }
      setLoading(false);
    });

    // Cleanup listener saat komponen tidak lagi ditampilkan
    return () => unsubscribe();
  }, [userId]);

  return (
    <div className="bg-white rounded-lg shadow border p-6 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="font-bold text-lg text-gray-800">{device.name}</h2>
            <p className="text-sm text-gray-500">{device.location}</p>
          </div>
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800">
            Sensor
          </span>
        </div>
        
        {loading ? <div className="py-8 flex justify-center"><LoadingSpinner size="sm"/></div> : (
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2"><Thermometer size={16} className="text-red-500"/> Suhu: <span className="font-semibold">{data?.temperature?.toFixed(1) ?? 'N/A'}°C</span></div>
            <div className="flex items-center gap-2"><Droplet size={16} className="text-blue-500"/> Lembap: <span className="font-semibold">{data?.humidity?.toFixed(1) ?? 'N/A'}%</span></div>
            <div className="flex items-center gap-2"><Sun size={16} className="text-yellow-500"/> Cahaya: <span className="font-semibold">{data?.light?.toFixed(1) ?? 'N/A'} lux</span></div>
            <div className="flex items-center gap-2"><Droplets size={16} className="text-teal-500"/> Media: <span className="font-semibold">{data?.moisture?.toFixed(1) ?? 'N/A'}%</span></div>
          </div>
        )}
      </div>

      <div className="mt-6 border-t pt-4 flex justify-end gap-2">
        <button onClick={onEdit} className="text-gray-500 hover:text-blue-700 p-1">
          <Edit size={16} />
        </button>
        <button onClick={onDelete} className="text-gray-500 hover:text-red-700 p-1">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default SensorCard;