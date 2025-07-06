"use client";

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Notification, fetchNotifications, deleteNotification } from '@/lib/fetchNotificationData';
import { Bell, Trash2, X } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await fetchNotifications(user.uid);
      setNotifications(data);
    } catch (error) {
      console.error("Gagal memuat notifikasi:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen, loadNotifications]);

  const handleDelete = async (notificationId: string) => {
    if (!user) return;
    try {
      await deleteNotification(user.uid, notificationId);
      // Setelah berhasil menghapus, muat ulang daftar notifikasi
      loadNotifications();
    } catch (error) {
      console.error("Gagal menghapus notifikasi:", error);
      // Jika gagal, data tidak akan berubah di UI, bisa ditambahkan notifikasi error jika perlu
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-20"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Notifikasi</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <LoadingSpinner />
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              <Bell size={48} className="mx-auto text-gray-300 mb-4" />
              <p>Tidak ada notifikasi baru.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {notifications.map((notif) => (
                <li key={notif.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50">
                  <div className="flex-shrink-0 mt-1">
                    <Bell className="text-blue-500" size={20} />
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm text-gray-700">{notif.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notif.timestamp).toLocaleString('id-ID')}
                    </p>
                  </div>
                  <button 
                    onClick={() => handleDelete(notif.id)}
                    className="flex-shrink-0 text-gray-400 hover:text-red-600 p-1"
                    aria-label="Hapus notifikasi"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;