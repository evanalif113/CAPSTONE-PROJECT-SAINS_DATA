import { 
  House, 
  ChartBarIcon,
  Lightbulb,
  Cpu,
  Bell, 
  Settings,
  User
} from "lucide-react"; //    Ganti sesuai lokasi ikonmu, atau salin ikon langsung ke file ini

export const baseNavItems = [
  { name: "Beranda", href: "/dashboard", icon: House },
  { name: "Data", href: "/data", icon: ChartBarIcon },
  { name: "Intelijen", href: "/intelligence", icon: Lightbulb },
  { name: "Perangkat", href: "/device", icon: Cpu },
  { name: "Notifikasi", href: "/alerts", icon: Bell },
  { name: "Pengaturan", href: "/settings", icon: Settings },
  { name: "Profil", href: "/profile", icon: User },
];

export function getNavItems(activeHref: string) {
  return baseNavItems.map((item) => ({
    ...item,
    active: item.href === activeHref,
  }));
}
