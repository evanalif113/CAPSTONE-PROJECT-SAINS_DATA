// components/DeviceModal.tsx
import { useState, useEffect } from "react";
import { Device } from "@/lib/manageDevices";

interface DeviceModalProps {
  onClose: () => void;
  onSubmit: (deviceData: Omit<Device, 'id' | 'status'>) => Promise<void>;
  initialData?: Device | null; // BARU: Tambahkan prop untuk data awal
}

const DeviceModal: React.FC<DeviceModalProps> = ({ onClose, onSubmit, initialData }) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState<'sensor' | 'actuator'>('sensor');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // BARU: useEffect untuk mengisi form jika dalam mode edit
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setLocation(initialData.location);
      setType(initialData.type);
    }
  }, [initialData]);

  const handleSubmit = async () => {
    if (!name || !location) {
      alert("Nama dan Lokasi tidak boleh kosong.");
      return;
    }
    setIsSubmitting(true);
    await onSubmit({ name, location, type });
    setIsSubmitting(false);
  };

  const isEditMode = !!initialData;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <h2 className="font-bold text-lg mb-4">
          {isEditMode ? 'Edit Perangkat' : 'Tambah Perangkat Baru'}
        </h2>
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
            <select 
              value={type} 
              onChange={(e) => setType(e.target.value as any)} 
              className="w-full mt-1 px-3 py-2 border rounded-md"
              disabled={isEditMode} // Tipe perangkat tidak bisa diubah saat edit
            >
              <option value="sensor">Sensor</option>
              <option value="actuator">Aktuator</option>
            </select>
            {isEditMode && <p className="text-xs text-gray-500 mt-1">Tipe perangkat tidak dapat diubah.</p>}
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} disabled={isSubmitting} className="px-4 py-2 rounded-md border disabled:opacity-50">Batal</button>
          <button onClick={handleSubmit} disabled={isSubmitting} className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300">
            {isSubmitting ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeviceModal;