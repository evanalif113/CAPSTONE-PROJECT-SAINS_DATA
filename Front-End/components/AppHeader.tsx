import React from "react";
import { LogOutIcon } from "./Icon";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const AppHeader: React.FC = () => {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {/* Ganti logo lama dengan img logo */}
        <img
          src="/img/icon.png"
          alt="Logo Kumbung Sense"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Kumbung Sense</h1>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Online</span>
            </div>
            <span>Als1</span>
            <span>GT Pengempon</span>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={handleLogout}
          className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
          title="Logout"
          aria-label="Logout"
        >
          <LogOutIcon />
        </button>
      </div>
    </header>
  );
};

export default AppHeader;
