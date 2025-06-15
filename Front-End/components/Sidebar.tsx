import React from "react";

type NavItem = {
  name: string;
  href: string;
  icon: React.FC<any>;
  active?: boolean;
};

interface SidebarProps {
  navItems: NavItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ navItems }) => (
  <div className="w-20 bg-slate-800 flex flex-col items-center py-4 space-y-6">
    <img
      src="/img/icon.png"
      alt="Logo Kumbung Sense"
      className="w-10 h-10 rounded-full object-cover"
    />
    <nav className="flex flex-col space-y-4">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.name}
            onClick={() => (window.location.href = item.href)}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              item.active
                ? "text-white bg-slate-700 hover:bg-slate-600"
                : "text-gray-400 hover:text-white hover:bg-slate-700"
            }`}
          >
            <Icon />
            <span className="text-xs mt-1">{item.name}</span>
          </button>
        );
      })}
    </nav>
    <div className="flex-1"></div>
  </div>
);

export default Sidebar;
