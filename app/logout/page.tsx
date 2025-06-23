"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Logout() {
  const [countdown, setCountdown] = useState(5);
  const { logout } = useAuth();

  useEffect(() => {
    // Jalankan logout hanya sekali saat komponen mount
    logout?.();

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = "/authentication"; // Redirect ke halaman login
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [logout]);

  const handleLoginRedirect = () => {
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="/img/icon.png"
            alt="Logo Kumbung Sense"
            className="w-16 h-16 rounded-full object-cover"
          />
        </div>
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Berhasil Keluar
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          Anda telah berhasil keluar dari sistem Kumbung Sense. Terima kasih
          telah menggunakan layanan kami.
        </p>

        {/* Countdown */}
        <p className="text-sm text-gray-500 mb-6">
          Anda akan diarahkan ke halaman login dalam {countdown} detik
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleLoginRedirect}
            className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors"
          >
            Masuk Kembali
          </button>

          <button
            onClick={() => (window.location.href = "https://example.com")}
            className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Kembali ke Beranda
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            © 2024 Kumbung Sense. Semua hak dilindungi.
          </p>
        </div>
      </div>
    </div>
  );
}
