import type React from "react"
import type { Metadata } from "next";
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


import './globals.css'

export const metadata: Metadata = {
  title: "Kumbung Sense",
  description: "Penelitian dan Pengembangan",
  icons: {
    icon: [
      {
        url: "/img/logo.jpg",
        href: "/img/logo.jpg",
      },
    ],
    apple: [
      {
        url: "/img/logo.jpg",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
    generator: 'v0.dev'
}
