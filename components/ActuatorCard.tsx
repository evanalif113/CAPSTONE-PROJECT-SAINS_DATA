// components/ActuatorCard.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import { onValue, ref } from 'firebase/database';
import { database } from '@/lib/firebaseConfig';
import { Device } from '@/lib/manageDevices';
import { ActuatorData, updateActuatorState } from '@/lib/fetchActuatorData';

import { Edit, Trash2 } from 'lucide-react';
import ToggleSwitch from '@/components/ToggleSwitch';
import LoadingSpinner from '@/components/LoadingSpinner';
import StatusIndicator from '@/components/StatusIndicator';

interface ActuatorCardProps {
  device: Device;
  userId: string;
  onEdit: () => void;
  onDelete: () => void;
}

const ActuatorCard: React.FC<ActuatorCardProps> = ({ device, userId, onEdit, onDelete }) => {
  const [states, setStates] = useState<ActuatorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [modeAuto, setModeAuto] = useState(true); // State untuk mode otomatis

  useEffect(() => {
    setLoading(true);
    // Listener untuk data aktuator
    const actuatorRef = ref(database, `${userId}/aktuator/data`);
    const unsubscribeActuators = onValue(actuatorRef, (snapshot) => {
      if (snapshot.exists()) {
        setStates(snapshot.val());
      }
    });

    // Listener untuk status mode
    const modeRef = ref(database, `${userId}/mode/auto`);
    const unsubscribeMode = onValue(modeRef, (snapshot) => {
      // Default ke true (otomatis) jika tidak ada data
      setModeAuto(snapshot.exists() ? !!snapshot.val() : true);
      setLoading(false); // Set loading false setelah kedua data (atau default) didapat
    });

    // Cleanup listeners
    return () => {
      unsubscribeActuators();
      unsubscribeMode();
    };
  }, [userId]);

  const handleActuatorChange = useCallback((pin: number, newState: boolean) => {
    // Tambahan pengecekan untuk tidak mengirim update jika mode auto
    if (modeAuto) return;
    // Logika dibalik: ON (true) akan mengirim 0, OFF (false) akan mengirim 1
    // Tambahkan 'manual' sebagai mode pemicu
    updateActuatorState(userId, pin, newState ? 0 : 1, 'manual');
  }, [userId, modeAuto]);

  return (
    <div className="bg-white rounded-lg shadow border p-6 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="font-bold text-lg text-gray-800">{device.name}</h2>
            <p className="text-sm text-gray-500">{device.location}</p>
          </div>
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-orange-100 text-orange-800">
            Aktuator
          </span>
        </div>
        
        {loading ? <div className="py-8 flex justify-center"><LoadingSpinner/></div> : (
          <div className="mt-4 space-y-3">
            <div className="flex justify-between items-center"><span className="font-medium">Kipas</span><ToggleSwitch checked={states?.['16'] === 0} onChange={(val) => handleActuatorChange(16, val)} disabled={modeAuto} /></div>
            <div className="flex justify-between items-center"><span className="font-medium">Humidifier</span><ToggleSwitch checked={states?.['17'] === 0} onChange={(val) => handleActuatorChange(17, val)} disabled={modeAuto} /></div>
            <div className="flex justify-between items-center"><span className="font-medium">Lampu</span><ToggleSwitch checked={states?.['18'] === 0} onChange={(val) => handleActuatorChange(18, val)} disabled={modeAuto} /></div>
          </div>
        )}
      </div>

      <div className="mt-6 border-t pt-4 flex justify-between items-center">
        <StatusIndicator status={device.status || 'inactive'} />
        <div className="flex gap-2">
          <button onClick={onEdit} className="text-gray-600 hover:text-blue-700 p-1">
            <Edit size={16} />
          </button>
          <button onClick={onDelete} className="text-gray-600 hover:text-red-700 p-1">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActuatorCard;