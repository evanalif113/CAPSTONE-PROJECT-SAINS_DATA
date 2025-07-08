"use client";

import { useState } from "react"; // Import useState
import AppHeader from "@/components/AppHeader";
import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import Image from "next/image";
import Link from "next/link";
import { Github } from "lucide-react";
import AboutModal from "@/components/AboutModal"; // Import the modal
import { Toaster, toast } from "sonner"; // Import sonner

// Anda bisa mengganti data ini dengan data developer yang sebenarnya
const developers = [
  {
    id: 1,
    name: "Evan Alif Widhyatma",
    role: "Embedded Systems Engineer, Firmware Engineer, Database Designer, Fullstack Developer, AI Researcher",
    github: "evanalif113",
    avatarUrl: "https://avatars.githubusercontent.com/u/56740250?s=400&u=c89c2318fb527247e99962257f8664ef96b366d1&v=4", // Ganti dengan URL avatar asli
    linkedin: "evan-alif-widhyatma-371966180/",
  },
  {
    id: 2,
    name: "Aisyah Hanan",
    role: "UI/UX Designer, Frontend Developer, Data Analis, Sistem Analis",
    github: "aisyahhhhanannn192",
    avatarUrl: "https://media.licdn.com/dms/image/v2/D5603AQHslpUSuncQmA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1719328817369?e=1757548800&v=beta&t=tLB8YN2t7-On3UXRLnf-Yx4MrwiXX4YR6QJ0FUoSZK4", // Ganti dengan URL avatar asli
    linkedin: "aisyah-hanan-467a4a215/",
  },
  {
    id: 3,
    name: "Putri Cahya Ningrum",
    role: "Public Relation, Dokumenter Projek, Quality Assurance, Desainer Logo",
    github: "putriningrum",
    avatarUrl: "/img/putri-cahya.jpg", // Ganti dengan URL avatar asli
    linkedin: "putri-cahya-ningrum-b8b3a5256",
  },
];

// Define the Developer type
interface Developer {
  id: number;
  name: string;
  role: string;
  github: string;
  avatarUrl: string;
  linkedin: string;
}

export default function AboutPage() {
  const [selectedDeveloper, setSelectedDeveloper] = useState<Developer | null>(null);

  const handleCardClick = (developer: Developer) => {
    setSelectedDeveloper(developer);
    toast(
      <div className="flex items-center gap-4 text-left w-[380px]">
        <Image
          src={developer.avatarUrl}
          alt={`Avatar of ${developer.name}`}
          width={48}
          height={48}
          className="rounded-full border-2 border-gray-200"
        />
        <div>
          <p className="font-semibold text-gray-800">{developer.name}</p>
          <p className="text-sm text-gray-500 line-clamp-2">
            {developer.role}
          </p>
        </div>
      </div>,
      {
        duration: 5000, // Show toast for 5 seconds
      }
    );
  };

  const handleCloseModal = () => {
    setSelectedDeveloper(null);
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        <Toaster richColors position="top-center" />
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Tentang Kami
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Tim di balik pengembangan sistem informasi ini.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {developers.map((dev) => (
                  <div
                    key={dev.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 text-center flex flex-col items-center cursor-pointer hover:shadow-lg hover:scale-105 transition-transform duration-200"
                    onClick={() => handleCardClick(dev)}
                  >
                    <Image
                      src={dev.avatarUrl}
                      alt={`Avatar of ${dev.name}`}
                      width={100}
                      height={100}
                      className="rounded-full mb-4 border-4 border-gray-200 dark:border-gray-600 pointer-events-none"
                    />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white pointer-events-none">
                      {dev.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 pointer-events-none line-clamp-3">
                      {dev.role}
                    </p>
                    <div className="mt-auto inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-500 dark:bg-gray-700 rounded-lg pointer-events-none">
                      Lihat Detail
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
        <AboutModal developer={selectedDeveloper} onClose={handleCloseModal} />
      </div>
    </ProtectedRoute>
  );
}
