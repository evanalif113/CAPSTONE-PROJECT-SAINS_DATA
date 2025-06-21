"use client";

import { useState } from "react";
import AppHeader from "@/components/AppHeader";
import Sidebar from "@/components/Sidebar";
import { getNavItems } from "@/components/navItems";

const navItems = getNavItems("/device");

// Komponen modal untuk tambah device
interface DeviceModalProps {
  onClose: () => void;
  onSubmit: (device: {
    name: string;
    location: string;
    sensorId: string;
  }) => void;
}

const DeviceModal: React.FC<DeviceModalProps> = ({ onClose, onSubmit }) => {
  const [device, setDevice] = useState({
    name: "",
    location: "",
    sensorId: "",
  });

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
        <h2 className="text-lg font-bold mb-4">Tambah Device</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nama Device
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              value={device.name}
              onChange={(e) => setDevice({ ...device, name: e.target.value })}
              placeholder="Contoh: Sensor Jamur 1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Lokasi
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              value={device.location}
              onChange={(e) =>
                setDevice({ ...device, location: e.target.value })
              }
              placeholder="Contoh: Kumbung A"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Sensor ID
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              value={device.sensorId}
              onChange={(e) =>
                setDevice({ ...device, sensorId: e.target.value })
              }
              placeholder="Contoh: esp32-xyz"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
            type="button"
          >
            Batal
          </button>
          <button
            onClick={() => onSubmit(device)}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            type="button"
            disabled={
              !device.name.trim() ||
              !device.location.trim() ||
              !device.sensorId.trim()
            }
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
};

// Halaman utama device, contoh penggunaan modal
export default function DevicePage() {
  const [showModal, setShowModal] = useState(false);
  const [devices, setDevices] = useState<
    { name: string; location: string; sensorId: string }[]
  >([]);

  const handleAddDevice = (device: {
    name: string;
    location: string;
    sensorId: string;
  }) => {
    setDevices((prev) => [...prev, device]);
    setShowModal(false);
  };

  const handleLogout = () => {
    window.location.href = "/logout";
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar navItems={navItems} />
      <div className="flex-1 flex flex-col">
        <AppHeader onLogout={handleLogout} />
        <main className="flex-1 p-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Daftar Device
              </h1>
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                + Tambah Device
              </button>
            </div>
            <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
              {devices.length === 0 ? (
                <div className="text-gray-500 text-center py-8">
                  Belum ada device.
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 text-left">Nama</th>
                      <th className="py-2 text-left">Lokasi</th>
                      <th className="py-2 text-left">Sensor ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {devices.map((dev, idx) => (
                      <tr key={idx} className="border-b last:border-b-0">
                        <td className="py-2">{dev.name}</td>
                        <td className="py-2">{dev.location}</td>
                        <td className="py-2">{dev.sensorId}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          {showModal && (
            <DeviceModal
              onClose={() => setShowModal(false)}
              onSubmit={handleAddDevice}
            />
          )}
        </main>
      </div>
    </div>
  );
}
