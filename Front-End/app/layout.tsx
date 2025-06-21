import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "Kumbung Sense",
  description: "Penelitian dan Pengembangan",
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
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
