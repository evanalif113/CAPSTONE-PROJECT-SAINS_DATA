"use client";

import React from "react";
import { cn } from "@/lib/utils"; // Gunakan utilitas cn untuk kelas dinamis

// Definisikan tipe props untuk komponen ini agar lebih jelas dan aman
interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  disabled = false,
}) => (
  <button
    type="button"
    role="switch" // Tambahkan role untuk aksesibilitas yang lebih baik
    aria-checked={checked}
    disabled={disabled}
    onClick={() => !disabled && onChange(!checked)}
    className={cn(
      "relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
      checked ? "bg-green-600" : "bg-gray-200", // Warna diubah agar lebih kontras
      disabled
        ? "cursor-not-allowed opacity-50"
        : "cursor-pointer"
    )}
  >
    <span className="sr-only">Use setting</span>
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out", // Ukuran disesuaikan
        checked ? "translate-x-5" : "translate-x-0" // Posisi disesuaikan
      )}
    />
  </button>
);

export default ToggleSwitch;