// components/DeviceModal.tsx
import { useState, useEffect } from "react";
import { Device } from "@/lib/manageDevices";

// Perbarui interface props untuk onSubmit
interface DeviceModalProps {
  onClose: () => void;
  // onSubmit sekarang akan selalu mengirim 'id', baik untuk tambah maupun edit
  onSubmit: (deviceData: Omit<Device, 'status'>) => Promise<void>; 
  initialData?: Device | null;
}

const DeviceModal: React.FC<DeviceModalProps> = ({ onClose, onSubmit, initialData }) => {
  // --- STATE BARU ---
  const [serialNumber, setSerialNumber] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState<'sensor' | 'actuator'>('sensor');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isEditMode = !!initialData;

  // --- useEffect DIPERBARUI ---
  // Mengisi semua field saat mode edit
  useEffect(() => {
    if (isEditMode) {
      setSerialNumber(initialData.id); // Isi Nomor Seri
      setName(initialData.name);
      setLocation(initialData.location);
      setType(initialData.type);
    }
  }, [initialData, isEditMode]);

  // --- handleSubmit DISESUAIKAN ---
  const handleSubmit = async () => {
    // Validasi baru: Nomor Seri juga wajib diisi
    if (!serialNumber.trim() || !name || !location) {
      alert("Nomor Seri, Nama, dan Lokasi tidak boleh kosong.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Kirim payload yang konsisten, selalu dengan 'id'
      await onSubmit({ 
        id: serialNumber, 
        name, 
        location, 
        type 
      });
      // Tidak perlu lagi memanggil onClose atau setIsSubmitting di sini,
      // karena parent component akan menutup modal setelah submit berhasil.
    } catch (error) {
      // Jika terjadi error dari backend (misal: Nomor Seri sudah ada), tampilkan pesannya
      alert(`Gagal menyimpan: ${(error as Error).message}`);
      setIsSubmitting(false); // Berhenti loading jika gagal
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 transition-opacity">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl transform transition-all">
        <h2 className="font-bold text-lg mb-4">
          {isEditMode ? 'Edit Perangkat' : 'Tambah Perangkat Baru'}
        </h2>
        <div className="space-y-4">
        
          {/* --- INPUT FIELD BARU: NOMOR SERI --- */}
          <div>
            <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700">Nomor Seri (ID Unik)</label>
            <input 
              id="serialNumber"
              type="text" 
              value={serialNumber} 
              onChange={(e) => setSerialNumber(e.target.value)} 
              className="w-full mt-1 px-3 py-2 border rounded-md disabled:bg-gray-100 disabled:text-gray-500"
              disabled={isEditMode} // Tidak bisa diubah saat edit
              placeholder="Contoh: SN-001-XYZ"
            />
             {isEditMode && <p className="text-xs text-gray-500 mt-1">Nomor Seri tidak dapat diubah.</p>}
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Perangkat</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Lokasi</label>
            <input id="location" type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Tipe Perangkat</label>
            <select 
              id="type"
              value={type} 
              onChange={(e) => setType(e.target.value as any)} 
              className="w-full mt-1 px-3 py-2 border rounded-md disabled:bg-gray-100"
              disabled={isEditMode} // Tipe juga sebaiknya tidak diubah
            >
              <option value="sensor">Sensor</option>
              <option value="actuator">Aktuator</option>
            </select>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} disabled={isSubmitting} className="px-4 py-2 rounded-md border disabled:opacity-50">Batal</button>
          <button onClick={handleSubmit} disabled={isSubmitting} className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400">
            {isSubmitting ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeviceModal;