// app/layout.tsx
import type { Metadata } from "next";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Inter } from "next/font/google";
import { UIProvider } from "@/context/UIContext"; // Import UIProvider
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Kumbung Sense",
    default: "Kumbung Sense",
  },
  description:
    "Kumbung Sense adalah aplikasi web yang membantu petani jamur dalam memantau dan mengontrol kondisi lingkungan kumbung secara real-time. Dengan integrasi IoT, pengguna dapat melihat data sensor (suhu, kelembapan, intensitas cahaya, kelembapan media tanam) dan mengatur perangkat (kipas, humidifier, lampu) langsung dari dashboard.",
  keywords: [
    "Jamur",
    "Kumbung",
    "Pertanian",
    "IoT",
    "Sensor",
    "Monitoring",
    "Kontrol",
    "Suhu",
    "Kelembapan",
    "Intensitas Cahaya",
    "Kelembapan Media Tanam",
  ],
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      {
        url: "/img/icon.png",
        sizes: "180x180",
        type: "image/png",
        href: "/img/icon.png",
      },
    ],
    apple: [
      {
        url: "/img/icon.png",
        sizes: "180x180",
        type: "image/png",
        href: "/img/icon.png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <AuthProvider>
          <UIProvider>
            {children}
            <Analytics />
            <SpeedInsights />
          </UIProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
