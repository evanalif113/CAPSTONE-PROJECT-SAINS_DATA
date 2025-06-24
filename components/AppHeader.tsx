import React from "react";
import { 
  LogOut 
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const AppHeader: React.FC = () => {

const { 
  logout,
  user,
  loading 
} = useAuth();

const router = useRouter();

  const handleLogout = async () => {
    console.log("Mencoba untuk logout...");
    await logout();
    console.log("Proses logout selesai.");
    router.push("/authentication"); // Arahkan ke halaman login setelah logout
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
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Online</span>
            </div>
            <div className="flex flex-col">
              <span>{user?.email}</span>
              <span>{user?.metadata.lastSignInTime}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={handleLogout}
          className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
          title="Logout"
          aria-label="Logout">
          <LogOut/>
        </button>
      </div>
    </header>
  );
};

export default AppHeader;
