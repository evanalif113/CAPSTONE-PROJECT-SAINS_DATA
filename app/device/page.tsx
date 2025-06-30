"use client";

import { useState, useEffect, useCallback } from "react";
import AppHeader from "@/components/AppHeader";
import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { onValue, ref, off } from "firebase/database"; // 1. Impor 'off' untuk cleanup
import { database } from "@/lib/firebaseConfig";

// 2. Perbaiki nama file impor
import { fetchDevices, addDevice, deleteDevice, Device } from "@/lib/manageDevices"; 
import { ActuatorData, updateActuatorState } from "@/lib/fetchActuatorData";
import { SensorData } from "@/lib/fetchSensorData";

import { Plus, Trash2, Thermometer, Droplet, Sun, Droplets } from "lucide-react";
import ToggleSwitch from "@/components/ToggleSwitch";
import LoadingSpinner from "@/components/LoadingSpinner";

// --- Komponen Modal Sederhana untuk Fungsionalitas Penuh ---
interface DeviceModalProps {
  onClose: () => void;
  onSubmit: (deviceData: Omit<Device, 'id'>) => Promise<void>;
}

const DeviceModal: React.FC<DeviceModalProps> = ({ onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState<'sensor' | 'actuator'>('sensor');

  const handleSubmit = () => {
    onSubmit({ name, location, type });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <h2 className="font-bold text-lg mb-4">Tambah Perangkat Baru</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama Perangkat</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Lokasi</label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tipe Perangkat</label>
            <select value={type} onChange={(e) => setType(e.target.value as any)} className="w-full mt-1 px-3 py-2 border rounded-md">
              <option value="sensor">Sensor</option>
              <option value="actuator">Aktuator</option>
            </select>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-md border">Batal</button>
          <button onClick={handleSubmit} className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">Simpan</button>
        </div>
      </div>
    </div>
  );
};


export default function DevicePage() {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  
  const [devices, setDevices] = useState<Device[]>([]);
  const [latestSensorData, setLatestSensorData] = useState<SensorData | null>(null);
  const [actuatorStates, setActuatorStates] = useState<ActuatorData | null>(null);
  const [loading, setLoading] = useState(true);

  // 3. Satukan semua logika pengambilan data dalam satu useEffect
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    let sensorUnsubscribe: () => void;
    let actuatorUnsubscribe: () => void;

    // Ambil daftar perangkat
    fetchDevices(user.uid)
      .then(setDevices)
      .catch(err => console.error("Gagal memuat list perangkat:", err))
      .finally(() => setLoading(false));

    // Listener real-time untuk data sensor
    const sensorRef = ref(database, `${user.uid}/sensor/data`);
    sensorUnsubscribe = onValue(sensorRef, (snapshot) => {
      if(snapshot.exists()){
        const data = snapshot.val();
        const latestKey = Object.keys(data).sort().pop();
        if(latestKey) setLatestSensorData({ timestamp: Number(latestKey), ...data[latestKey]});
      }
    });

    // Listener real-time untuk data aktuator
    const actuatorRef = ref(database, `${user.uid}/aktuator/data`);
    actuatorUnsubscribe = onValue(actuatorRef, (snapshot) => {
      if(snapshot.exists()) setActuatorStates(snapshot.val());
    });

    // 4. Fungsi Cleanup yang BENAR untuk mematikan listener
    return () => {
      if (sensorUnsubscribe) sensorUnsubscribe();
      if (actuatorUnsubscribe) actuatorUnsubscribe();
    };
  }, [user]);

  // 5. Gunakan useCallback untuk stabilitas fungsi handler
  const handleAddDevice = useCallback(async (deviceData: Omit<Device, 'id'>) => {
    if (!user) return;
    try {
      await addDevice(user.uid, deviceData);
      const updatedDevices = await fetchDevices(user.uid); // Ambil data terbaru
      setDevices(updatedDevices);
      setShowModal(false);
    } catch (error) {
      console.error("Gagal menyimpan perangkat baru", error);
    }
  }, [user]);

  const handleDeleteDevice = useCallback(async (deviceId: string) => {
    if (!user || !window.confirm("Apakah Anda yakin ingin menghapus perangkat ini?")) return;
    try {
      await deleteDevice(user.uid, deviceId);
      const updatedDevices = await fetchDevices(user.uid); // Ambil data terbaru
      setDevices(updatedDevices);
    } catch (error) {
      console.error("Gagal menghapus perangkat", error);
    }
  }, [user]);

  const handleActuatorChange = useCallback((pin: string, newState: boolean) => {
    if (!user) return;
    updateActuatorState(user.uid, pin, newState ? 1 : 0);
  }, [user]);

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
                onClick={() => setShowModal(true)}
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
                {devices.map((device) => (
                  <div key={device.id} className="bg-white rounded-lg shadow border p-6 flex flex-col">
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                           <h2 className="font-bold text-lg text-gray-800">{device.name}</h2>
                           <p className="text-sm text-gray-500">{device.location}</p>
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${device.type === 'sensor' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                           {device.type}
                        </span>
                      </div>
                      
                      {device.type === 'sensor' && latestSensorData && (
                        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                           <div className="flex items-center gap-2"><Thermometer size={16} className="text-red-500"/> Suhu: <span className="font-semibold">{latestSensorData.temperature?.toFixed(1) ?? 'N/A'}°C</span></div>
                           <div className="flex items-center gap-2"><Droplet size={16} className="text-blue-500"/> Lembap: <span className="font-semibold">{latestSensorData.humidity?.toFixed(1) ?? 'N/A'}%</span></div>
                           <div className="flex items-center gap-2"><Sun size={16} className="text-yellow-500"/> Cahaya: <span className="font-semibold">{latestSensorData.light?.toFixed(1) ?? 'N/A'} lux</span></div>
                           <div className="flex items-center gap-2"><Droplets size={16} className="text-teal-500"/> Media: <span className="font-semibold">{latestSensorData.moisture?.toFixed(1) ?? 'N/A'}%</span></div>
                        </div>
                      )}

                      {device.type === 'actuator' && actuatorStates && (
                        <div className="mt-4 space-y-3">
                           <div className="flex justify-between items-center"><span className="font-medium">Kipas (Pin 16)</span><ToggleSwitch checked={!!actuatorStates['16']} onChange={(val) => handleActuatorChange('16', val)} /></div>
                           <div className="flex justify-between items-center"><span className="font-medium">Humidifier (Pin 17)</span><ToggleSwitch checked={!!actuatorStates['17']} onChange={(val) => handleActuatorChange('17', val)} /></div>
                           <div className="flex justify-between items-center"><span className="font-medium">Lampu (Pin 18)</span><ToggleSwitch checked={!!actuatorStates['18']} onChange={(val) => handleActuatorChange('18', val)} /></div>
                           <div className="flex justify-between items-center"><span className="font-medium">Pompa (Pin 19)</span><ToggleSwitch checked={!!actuatorStates['19']} onChange={(val) => handleActuatorChange('19', val)} /></div>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-6 border-t pt-4 flex justify-end">
                       <button onClick={() => handleDeleteDevice(device.id)} className="text-red-500 hover:text-red-700 text-sm p-1">
                          <Trash2 size={16} />
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {showModal && (
              <DeviceModal
                onClose={() => setShowModal(false)}
                onSubmit={handleAddDevice}
              />
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}