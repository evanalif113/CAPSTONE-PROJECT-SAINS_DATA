import { CpuIcon } from "lucide-react";
import { HomeIcon, ChartBarIcon,BIIcon, DeviceIcon, BellIcon, SettingsIcon, UserIcon } from "@/components/Icon"; //    Ganti sesuai lokasi ikonmu, atau salin ikon langsung ke file ini

export const baseNavItems = [
  { name: "Beranda", href: "/", icon: HomeIcon },
  { name: "Data", href: "/data-history", icon: ChartBarIcon },
  { name: "Kondisi", href: "/condition", icon: DeviceIcon },
  { name: "Intelijen", href: "/intelligence", icon: BIIcon },
  { name: "Perangkat", href: "/device", icon: DeviceIcon },
  { name: "Notifikasi", href: "/alerts", icon: BellIcon },
  { name: "Pengaturan", href: "/settings", icon: SettingsIcon },
  { name: "Profil", href: "/profile", icon: UserIcon },
];

export function getNavItems(activeHref: string) {
  return baseNavItems.map((item) => ({
    ...item,
    active: item.href === activeHref,
  }));
}
