import React from "react";

type AppHeaderProps = {
  onLogout: () => void;
};

const AppHeader: React.FC<AppHeaderProps> = ({ onLogout }) => (
  <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
    <div className="flex items-center space-x-4">
      <div
        className="w-10 h-10 b
      g-teal-200 rounded-full flex items-center justify-center"
      >
        <div className="w-6 h-6 bg-slate-800 rounded-full"></div>
      </div>
      <div>
        <h1 className="text-lg font-semibold text-gray-900">Kumbung Sense</h1>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Online</span>
          </div>
          <span>Als1</span>
          <span>GT Pengempon</span>
        </div>
      </div>
    </div>
    <div className="flex items-center space-x-4">
      <button
        onClick={onLogout}
        className="p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors bg-slate-800"
        title="Logout"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  </header>
);

export default AppHeader;
