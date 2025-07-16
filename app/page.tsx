"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import AboutModal from "@/components/AboutModal"; // Import the modal
import { Toaster, toast } from "sonner"; // Import sonner
import { developers, Developer } from "@/lib/developers";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, X } from "lucide-react";
import Footer from "@/components/Footer";

const LandingPage = () => {
  const [selectedDeveloper, setSelectedDeveloper] = useState<Developer | null>(
    null
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const features = [
    {
      title: "Monitoring Real-time",
      description:
        "Pantau kondisi kumbung jamur Anda secara langsung dari mana saja.",
      icon: "📊",
    },
    {
      title: "Kontrol Otomatis",
      description:
        "Sistem aktuator cerdas yang mengatur suhu dan kelembapan secara otomatis.",
      icon: "⚙️",
    },
    {
      title: "Prediksi Panen",
      description:
        "AI untuk memprediksi waktu panen yang optimal dan meningkatkan hasil.",
      icon: "📈",
    },
    {
      title: "Notifikasi Instan",
      description:
        "Dapatkan pemberitahuan penting langsung ke perangkat Anda.",
      icon: "🔔",
    },
  ];

  return (
    <div className="bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
      <Toaster richColors position="top-center" />
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm shadow-md z-50 dark:bg-gray-800/80">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img
              src="/img/icon.png"
              alt="Kumbung Sense Logo"
              className="w-10 h-10 rounded-full"
            />
            <h1 className="text-2xl font-bold text-teal-600 dark:text-teal-400">Kumbung Sense</h1>
          </div>
          
          {/* Desktop Navigation */}
          {!isMobile ? (
            <>
              <nav className="hidden md:flex space-x-8">
                <a
                  href="#home"
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  Home
                </a>
                <a
                  href="#features"
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  Fitur
                </a>
                <a
                  href="#about"
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  Pengembang
                </a>
                <a
                  href="#contact"
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  Kontak
                </a>
              </nav>
            </>
          ) : (
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-800 dark:text-gray-200 z-50"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
        </div>

        {/* Mobile Navigation Menu */}
        {isMobile && isMenuOpen && (
          <div className="absolute top-0 left-0 w-full bg-white dark:bg-gray-800 pt-20 pb-6 shadow-lg">
            <nav className="flex flex-col items-center space-y-6">
              <a
                href="#home"
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-lg"
              >
                Home
              </a>
              <a
                href="#features"
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-lg"
              >
                Fitur
              </a>
              <a
                href="#about"
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-lg"
              >
                Pengembang
              </a>
              <a
                href="#contact"
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-lg"
              >
                Kontak
              </a>
            </nav>
          </div>
        )}
      </header>

      <main>
        {/* Hero Section */}
        <section id="home" className="pt-32 pb-16 text-center bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
              Revolusi Budidaya Jamur dengan Teknologi AIoT
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Kumbung Sense menghadirkan solusi cerdas untuk memonitor, mengontrol,
              dan memprediksi hasil panen jamur Anda. Tingkatkan efisiensi dan
              profitabilitas bisnis dengan berbasis data.
            </p>
            <div className="flex justify-center items-center gap-4">
              <Button
                size="lg"
                className="bg-teal-600 hover:bg-teal-700 text-lg px-8 py-6 dark:bg-teal-500 dark:hover:bg-teal-600"
              >
                <a href="#contact">Hubungi Kami</a>
              </Button>
              <Link href="/authentication">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 border-teal-600 text-teal-600 hover:bg-teal-50 hover:text-teal-700 dark:border-teal-500 dark:text-teal-400 dark:hover:bg-gray-800 dark:hover:text-teal-300"
                >
                  Masuk Dashboard
                </Button>
              </Link>
            </div>
            <div className="mt-12">
              <img
                src="/background.png"
                alt="Dashboard Preview"
                className="rounded-lg shadow-xl mx-auto"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                Fitur Unggulan Kami
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Semua yang Anda butuhkan untuk budidaya jamur modern.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="text-center hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                >
                  <CardHeader>
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <CardTitle className="dark:text-white">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section id="about" className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Tentang Kami
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Tim di balik pengembangan sistem informasi ini.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {developers.map((dev) => (
                <div
                  key={dev.id}
                  onClick={() => setSelectedDeveloper(dev)}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 text-center flex flex-col items-center cursor-pointer hover:shadow-lg hover:scale-105 transition-transform duration-200"
                >
                  <Image
                    src={dev.avatarUrl}
                    alt={`Avatar of ${dev.name}`}
                    width={100}
                    height={100}
                    className="rounded-full mb-4 border-4 border-gray-200 dark:border-gray-600"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {dev.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-3">
                    {dev.role}
                  </p>
                  <div className="mt-auto inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-500 dark:bg-gray-700 rounded-lg">
                    Lihat Detail
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact/Order Section */}
        <section id="contact" className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                Tertarik dengan Kumbung Sense?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
                Hubungi kami untuk informasi lebih lanjut, demo produk, atau
                pemesanan. Klik tombol di bawah untuk memulai percakapan via
                WhatsApp.
              </p>
            </div>
            <div className="text-center">
              <a
                href="https://wa.me/6288225418750?text=Halo,%20saya%20tertarik%20dengan%20produk%20Kumbung%20Sense."
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="bg-green-500 hover:bg-green-600 text-white text-lg px-8 py-6"
                >
                  Hubungi via WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <AboutModal
        developer={selectedDeveloper}
        onClose={() => setSelectedDeveloper(null)}
      />
    </div>
  );
};

export default LandingPage;