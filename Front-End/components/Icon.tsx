// Gunakan lucide-react untuk icon
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

// Icon wrapper agar konsisten ukuran dan style
const HomeIcon = (props) => <Home size={20} {...props} />;
const GridIcon = (props) => <Grid size={20} {...props} />;
const BellIcon = (props) => <Bell size={20} {...props} />;
const SettingsIcon = (props) => <Settings size={20} {...props} />;
const UserIcon = (props) => <User size={20} {...props} />;
const LogOutIcon = (props) => <LogOut size={20} {...props} />;
const RefreshIcon = (props) => <RefreshCw size={18} {...props} />;
const TagIcon = (props) => <Tag size={18} {...props} />;
const MoreIcon = (props) => <MoreHorizontal size={18} {...props} />;

// Sensor icons with color
const TemperatureIcon = (props) => <Thermometer size={20} color="#ef4444" {...props} />;
const HumidityIcon = (props) => <Droplets size={20} color="#3b82f6" {...props} />;
const LightIntensityIcon = (props) => <Sun size={20} color="#f59e0b" {...props} />;
const MoistureIcon = (props) => <Sprout size={20} color="#10b981" {...props} />;

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
