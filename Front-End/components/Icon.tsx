// Gunakan lucide-react untuk icon
import React from "react";
import {
  Home,
  Grid,
  Bell,
  Settings,
  User,
  LogOut,
  RefreshCw,
  Tag,
  MoreHorizontal,
  Thermometer,
  Droplets,
  Sun,
  Sprout,
} from "lucide-react";

const HomeIcon = (props: React.ComponentProps<typeof Home>) => <Home size={20} {...props} />;
const GridIcon = (props: React.ComponentProps<typeof Grid>) => <Grid size={20} {...props} />;
const BellIcon = (props: React.ComponentProps<typeof Bell>) => <Bell size={20} {...props} />;
const SettingsIcon = (props: React.ComponentProps<typeof Settings>) => <Settings size={20} {...props} />;
const UserIcon = (props: React.ComponentProps<typeof User>) => <User size={20} {...props} />;
const LogOutIcon = (props: React.ComponentProps<typeof LogOut>) => <LogOut size={20} {...props} />;
const RefreshIcon = (props: React.ComponentProps<typeof RefreshCw>) => <RefreshCw size={18} {...props} />;
const TagIcon = (props: React.ComponentProps<typeof Tag>) => <Tag size={18} {...props} />;
const MoreIcon = (props: React.ComponentProps<typeof MoreHorizontal>) => <MoreHorizontal size={18} {...props} />;

// Sensor icons with color
const TemperatureIcon = (props: React.ComponentProps<typeof Thermometer>) => <Thermometer size={20} color="#ef4444" {...props} />;
const HumidityIcon = (props: React.ComponentProps<typeof Droplets>) => <Droplets size={20} color="#3b82f6" {...props} />;
const LightIntensityIcon = (props: React.ComponentProps<typeof Sun>) => <Sun size={20} color="#f59e0b" {...props} />;
const MoistureIcon = (props: React.ComponentProps<typeof Sprout>) => <Sprout size={20} color="#10b981" {...props} />;

export {
  HomeIcon,
  GridIcon,
  BellIcon,
  SettingsIcon,
  UserIcon,
  LogOutIcon,
  RefreshIcon,
  TagIcon,
  MoreIcon,
  TemperatureIcon,
  HumidityIcon,
  LightIntensityIcon,
  MoistureIcon,
};
