import type React from "react"
import type { Metadata } from "next";
import './globals.css'

export const metadata: Metadata = {
  title: "Kumbung Sense",
  description: "Penelitian dan Pengembangan",
  icons: {
    icon: [
      {
        url: "/img/icon.png",
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
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}