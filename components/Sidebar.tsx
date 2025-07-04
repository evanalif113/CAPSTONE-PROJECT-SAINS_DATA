"use client";

import React from "react";
import Link from "next/link"; // Tetap gunakan Link
import { usePathname } from "next/navigation";
import { useUI } from "@/context/UIContext";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

import { 
  House, ChartBarIcon, Lightbulb, Cpu, Bell, Settings, User
} from "lucide-react";

// --- DATA NAVIGASI ---
const baseNavItems = [
  { name: "Beranda", href: "/dashboard", icon: House },
  { name: "Data", href: "/data", icon: ChartBarIcon },
  { name: "Intelijen", href: "/intelligence", icon: Lightbulb },
  { name: "Perangkat", href: "/device", icon: Cpu },
  { name: "Notifikasi", href: "/alerts", icon: Bell },
  { name: "Pengaturan", href: "/settings", icon: Settings },
  { name: "Profil", href: "/profile", icon: User },
];

function getNavItems(activeHref: string) {
  return baseNavItems.map((item) => ({
    ...item,
    active: item.href === activeHref,
  }));
}

// --- KOMPONEN SIDEBAR ---
const Sidebar: React.FC = () => {
  const { isSidebarOpen, closeSidebar } = useUI();
  const { user } = useAuth();
  const pathname = usePathname();
  const navItems = getNavItems(pathname);

  if (!user) {
    return null;
  }

  return (
    <>
      {/* Overlay tidak berubah */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Tutup sidebar"
        onClick={closeSidebar}
        onKeyDown={(e) => e.key === "Enter" && closeSidebar()}
        className={cn(
          "fixed inset-0 z-30 bg-black/50 backdrop-blur-sm transition-opacity lg:hidden",
          isSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      <aside
        className={cn(
          "fixed top-0 left-0 z-40 flex h-relative w-60 flex-col bg-slate-800 text-white transition-transform duration-300 ease-in-out",
          "lg:relative lg:translate-x-0 lg:w-28 lg:shadow-none",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-center border-b border-slate-700 px-4">
          <img
            src="/img/icon.png"
            alt="Logo Kumbung Sense"
            className="h-10 w-10 rounded-full object-cover"
          />
        </div>
        <nav className="flex-1 space-y-2 overflow-y-auto p-2">
          {navItems.map((item) => (
            // INI CARA TERBAIK: Menggunakan <Link>
            <Link
              key={item.name}
              href={item.href}
              onClick={closeSidebar} // onClick tetap bisa digunakan di Link
              className={cn(
                "flex items-center gap-4 rounded-lg p-3 text-left font-medium transition-colors",
                "lg:flex-col lg:gap-1 lg:text-center", // Perubahan untuk desktop
                item.active
                  ? "bg-slate-900 text-white"
                  : "text-slate-400 hover:bg-slate-700 hover:text-white"
              )}
              aria-current={item.active ? "page" : undefined}
            >
              <item.icon className="h-6 w-6 shrink-0" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;