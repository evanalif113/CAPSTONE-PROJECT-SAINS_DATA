"use client";

import React from "react";

const Footer: React.FC = () => {
  // Fungsi untuk mendapatkan tahun saat ini secara dinamis
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-gray-200 bg-white p-4 text-center shadow-inner-top">
      <p className="text-sm text-gray-500">
        Copyright &copy; {currentYear} Kumbung Sense. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;