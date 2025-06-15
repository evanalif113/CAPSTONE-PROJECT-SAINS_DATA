import { HomeIcon, GridIcon, BellIcon, SettingsIcon, UserIcon } from "./Icon"; //    Ganti sesuai lokasi ikonmu, atau salin ikon langsung ke file ini

export const baseNavItems = [
  { name: "Beranda", href: "/", icon: HomeIcon },
  { name: "Data History", href: "/data-history", icon: GridIcon },
  { name: "Alerts", href: "/alerts", icon: BellIcon },
  { name: "Settings", href: "/settings", icon: SettingsIcon },
  { name: "Profile", href: "/profile", icon: UserIcon },
];

export function getNavItems(activeHref: string) {
  return baseNavItems.map((item) => ({
    ...item,
    active: item.href === activeHref,
  }));
}
