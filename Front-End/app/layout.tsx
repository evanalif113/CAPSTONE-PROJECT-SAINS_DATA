// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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
  }
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}