"use client";

import React, { useState, useEffect, useRef } from "react";
import { Menu, LogOut, User, Settings } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useUI } from "@/context/UIContext";
import Link from "next/link";

const AppHeader: React.FC = () => {
  const { toggleSidebar } = useUI();
  const { logout, user, loading } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleLogout = async () => {
    console.log("Mencoba untuk logout...");
    await logout();
    console.log("Proses logout selesai.");
    router.push("/authentication"); // Arahkan ke halaman login setelah logout
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {/* Ganti logo lama dengan img logo */}
        <button
          onClick={toggleSidebar}
          className="p-2 text-gray-600 rounded-md hover:bg-gray-100 lg:hidden"
          aria-label="Buka sidebar"
        >
          <Menu />
        </button>
        <img
          src="/img/icon.png"
          alt="Logo Kumbung Sense"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Kumbung Sense</h1>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex flex-col">
              <span>{user?.displayName}</span>
              <span>{user?.email}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden"
          aria-label="Buka menu pengguna"
        >
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="text-gray-600" />
          )}
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
            <div className="px-4 py-2 border-b text-sm font-semibold text-gray-800">
              {user?.displayName || "Pengguna"}
            </div>
            <Link
              href="/profile"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsDropdownOpen(false)}
            >
              <User className="mr-2" size={16} />
              Profil
            </Link>
            <Link
              href="/settings"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsDropdownOpen(false)}
            >
              <Settings className="mr-2" size={16} />
              Pengaturan
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              <LogOut className="mr-2" size={16} />
              Keluar
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default AppHeader;
