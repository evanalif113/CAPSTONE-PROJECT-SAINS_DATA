# Kumbung Sense

Aplikasi monitoring dan kontrol IoT untuk kumbung jamur berbasis Framework Next.Js

## Overview

Kumbung Sense adalah aplikasi web yang membantu petani jamur dalam memantau dan mengontrol kondisi lingkungan kumbung secara real-time. Dengan integrasi IoT, pengguna dapat melihat data sensor (suhu, kelembapan, intensitas cahaya, kelembapan media tanam) dan mengatur perangkat (kipas, humidifier, lampu) langsung dari dashboard.

## Fitur-fitur

- Autentikasi user (login/logout)
- Dashboard monitoring sensor secara real-time
- Kontrol perangkat
- Riwayat data sensor dan log aktuator
- Notifikasi
- Profil Pengguna
- Manajemen perangkat
- UI Responsive

## Tech Stack

- [NodeJS] (https://nodejs.org/id) (Runtime Environment untuk JavaScript )
- [React](https://reactjs.org/) (Pustaka Pengembangan Website)
- [Next.js](https://nextjs.org/) (Kerangka Kerja Pengembangan Website)
- [TypeScript](https://www.typescriptlang.org/) (Bahasa Pemrograman Backend)
- [Firebase](https://firebase.google.com) (Basis Data dan Backend)
- [Tailwind CSS](https://tailwindcss.com/) (CSS)
- [Plotly.js](https://plotly.com/javascript/) (Pustaka Visualisasi Data)
- [Radix UI](https://www.radix-ui.com/) (Pustaka Komponen Antarmuka)
- [lucide-react](https://lucide.dev/guide/packages/lucide-react) (Pustaka Ikon)

## Langkah Memulai

1. **Kloning repositori:**
   ```bash
   git clone https://github.com/evanalif113/Kumbung-Sense.git
   cd kumbung-sense
   ```
2. **Install dependensi:**
   ```bash
   npm install
   ```
3. **Jalankan aplikasi:**
   ```bash
   npm run dev
   ```
   Akses aplikasi di `http://localhost:3000`.

## Deployment

Untuk melakukan deployment aplikasi, ikuti langkah-langkah berikut:

1. **Build aplikasi untuk produksi:**
   ```bash
   npm run build
   ```
2. **Jalankan aplikasi yang sudah dibangun:**
   ```bash
   npm start
   ```

## Build your app

## How It Works

Kumbung Sense memanfaatkan teknologi berikut untuk memberikan fungsionalitasnya:

Aplikasi ini terintegrasi dengan perangkat IoT melalui protokol yang sesuai, memungkinkan komunikasi dua arah antara aplikasi dan perangkat keras. Data sensor dikumpulkan dan dikirim ke aplikasi secara real-time, memberikan wawasan langsung kepada pengguna tentang kondisi kumbung mereka. Pengguna juga dapat mengontrol perangkat seperti kipas, humidifier, dan lampu langsung dari aplikasi, memungkinkan penyesuaian cepat terhadap perubahan kondisi lingkungan.
