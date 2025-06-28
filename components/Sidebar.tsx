"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUI } from "@/context/UIContext";
import { useAuth } from "@/context/AuthContext";
import { getNavItems } from "./navItems";
import { cn } from "@/lib/utils";

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
      {/* Overlay untuk mobile */}
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

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 flex h-full w-64 flex-col bg-slate-800 text-white shadow-xl transition-transform lg:relative lg:w-20 lg:translate-x-0 lg:shadow-none",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-center border-b border-slate-700">
          <img
            src="/img/icon.png"
            alt="Logo Kumbung Sense"
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>
        <nav className="flex-1 space-y-2 overflow-y-auto p-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={closeSidebar}
              className={cn(
                "flex flex-col items-center rounded-lg p-2 text-center transition-colors lg:h-16 lg:justify-center",
                item.active
                  ? "bg-slate-900 text-white shadow-inner"
                  : "text-slate-400 hover:bg-slate-700 hover:text-white"
              )}
              aria-current={item.active ? "page" : undefined}
            >
              <item.icon className="h-6 w-6" />
              <span className="mt-1 text-xs">{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="flex-1"></div>
      </aside>
    </>
  );
};

export default Sidebar;
