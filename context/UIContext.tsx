// context/UIContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// Apa saja yang akan kita sediakan secara global
interface UIContextType {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

// Komponen Provider-nya
export function UIProvider({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prevState) => !prevState);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const value = { isSidebarOpen, toggleSidebar, closeSidebar };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

// Custom hook untuk mempermudah pemakaian
export const useUI = (): UIContextType => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
};
