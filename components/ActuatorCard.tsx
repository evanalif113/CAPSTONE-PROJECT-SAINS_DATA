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

interface ActuatorCardProps {
  device: Device;
  userId: string;
  onEdit: () => void;
  onDelete: () => void;
}

const ActuatorCard: React.FC<ActuatorCardProps> = ({ device, userId, onEdit, onDelete }) => {
  const [states, setStates] = useState<ActuatorData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listener real-time HANYA untuk data aktuator
    const actuatorRef = ref(database, `${userId}/aktuator/data`);
    const unsubscribe = onValue(actuatorRef, (snapshot) => {
      if (snapshot.exists()) {
        setStates(snapshot.val());
      }
      setLoading(false);
    });

    // Cleanup listener
    return () => unsubscribe();
  }, [userId]);

  const handleActuatorChange = useCallback((pin: string, newState: boolean) => {
    // Logika dibalik: ON (true) akan mengirim 0, OFF (false) akan mengirim 1
    updateActuatorState(userId, pin, newState ? 0 : 1);
  }, [userId]);

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
            <div className="flex justify-between items-center"><span className="font-medium">Kipas</span><ToggleSwitch checked={!states?.['16']} onChange={(val) => handleActuatorChange('16', val)} /></div>
            <div className="flex justify-between items-center"><span className="font-medium">Humidifier</span><ToggleSwitch checked={!states?.['17']} onChange={(val) => handleActuatorChange('17', val)} /></div>
            <div className="flex justify-between items-center"><span className="font-medium">Lampu</span><ToggleSwitch checked={!states?.['18']} onChange={(val) => handleActuatorChange('18', val)} /></div>
            <div className="flex justify-between items-center"><span className="font-medium">Pompa</span><ToggleSwitch checked={!states?.['19']} onChange={(val) => handleActuatorChange('19', val)} /></div>
          </div>
        )}
      </div>

      <div className="mt-6 border-t pt-4 flex justify-end gap-2">
         <button onClick={onEdit} className="text-gray-600 hover:text-blue-700 p-1">
          <Edit size={16} />
        </button>
        <button onClick={onDelete} className="text-gray-600 hover:text-red-700 p-1">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default ActuatorCard;