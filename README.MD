# Kumbung Sense

Aplikasi monitoring dan kontrol IoT untuk kumbung jamur berbasis Framework Next.Js

---

## 🚀 Gambaran Umum

Kumbung Sense adalah **aplikasi web inovatif** yang dirancang untuk membantu petani jamur modern dalam **memantau dan mengontrol kondisi lingkungan kumbung secara real-time**. Dengan integrasi IoT yang canggih, pengguna dapat mengakses data sensor (suhu, kelembapan, intensitas cahaya, dan kelembapan media tanam) serta mengendalikan perangkat aktuator (kipas, humidifier, lampu) langsung dari dashboard yang responsif dan intuitif.

---

## ✨ Fitur Utama

Aplikasi ini dilengkapi dengan berbagai fitur yang mendukung budidaya jamur yang lebih cerdas dan efisien:

* **Autentikasi Pengguna**: Sistem login dan logout yang aman untuk mengelola akses pengguna.
* **Dashboard Real-time**: Memantau data sensor secara langsung dan visual yang mudah dipahami.
* **Kontrol Perangkat**: Mengatur perangkat IoT (kipas, humidifier, lampu) langsung dari aplikasi.
* **Riwayat Data Komprehensif**: Melihat log sensor dan aktuator yang tersimpan rapi.
* **Sistem Notifikasi**: Menerima pemberitahuan penting secara instan mengenai kondisi kumbung.
* **Manajemen Profil Pengguna**: Mengelola informasi pribadi dan pengaturan akun dengan mudah.
* **Manajemen Perangkat**: Menambah, mengedit, dan menghapus perangkat IoT yang terhubung.
* **Prediksi Data**: Memanfaatkan AI untuk memprediksi suhu dan kelembaban, membantu perencanaan yang lebih baik.
* **Analisis Kecerdasan**: Menyajikan analisis data panen dan korelasi lingkungan untuk insight yang lebih dalam.
* **UI Responsif**: Antarmuka pengguna yang adaptif dan optimal di berbagai perangkat (desktop, tablet, mobile).

---

## 🛠️ Tumpukan Teknologi (Tech Stack)

Kumbung Sense dibangun menggunakan teknologi-teknologi modern dan teruji:

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)](https://firebase.google.com)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Plotly.js](https://img.shields.io/badge/plotly.js-21C18D?style=for-the-badge&logo=plotly&logoColor=white)](https://plotly.com/javascript/)
[![Radix UI](https://img.shields.io/badge/Radix%20UI-161618?style=for-the-badge&logo=radix-ui&logoColor=white)](https://www.radix-ui.com/)
[![Lucide React](https://img.shields.io/badge/Lucide-2D3748?style=for-the-badge&logo=lucide&logoColor=white)](https://lucide.dev/guide/packages/lucide-react)

* **Node.js**: Lingkungan runtime JavaScript.
* **React**: Pustaka JavaScript untuk membangun antarmuka pengguna interaktif.
* **Next.js**: Kerangka kerja React untuk aplikasi produksi, mendukung rendering sisi server (SSR) dan generasi situs statis (SSG).
* **TypeScript**: Superset JavaScript yang menambahkan penulisan statis untuk kode yang lebih kuat dan mudah dirawat.
* **Firebase**: Platform pengembangan aplikasi dari Google yang menyediakan basis data real-time, autentikasi, dan hosting.
* **Tailwind CSS**: Kerangka kerja CSS utility-first untuk membangun desain kustom dengan cepat.
* **Plotly.js**: Pustaka visualisasi data untuk membuat grafik interaktif dan menarik.
* **Radix UI**: Pustaka komponen UI tanpa gaya, dapat diakses, dan fleksibel untuk membangun sistem desain berkualitas tinggi.
* **Lucide React**: Pustaka ikon modular yang mudah diintegrasikan ke dalam proyek React.

---

## 🚀 Memulai Project

Ikuti langkah-langkah sederhana ini untuk menjalankan Kumbung Sense di lingkungan lokal Anda:

1.  **Kloning repositori:**
    ```bash
    git clone [https://github.com/evanalif113/Kumbung-Sense.git](https://github.com/evanalif113/Kumbung-Sense.git)
    cd kumbung-sense
    ```
2.  **Instal dependensi:**
    ```bash
    npm install
    ```
3.  **Jalankan aplikasi:**
    ```bash
    npm run dev
    ```
    Aplikasi akan tersedia di `http://localhost:3000`.

---

## ⚙️ Deployment

Untuk deployment aplikasi ke lingkungan produksi, ikuti panduan berikut:

1.  **Build aplikasi untuk produksi:**
    ```bash
    npm run build
    ```
2.  **Jalankan aplikasi yang sudah dibangun:**
    ```bash
    npm start
    ```

---

## 💡 Cara Kerja

Kumbung Sense beroperasi dengan memanfaatkan sinergi antara aplikasi web dan perangkat IoT. Aplikasi ini terintegrasi dengan perangkat keras IoT melalui protokol komunikasi yang sesuai, memungkinkan **pertukaran data dua arah** secara efisien. Data dari sensor-sensor lingkungan (seperti suhu, kelembapan, intensitas cahaya, dan kelembapan media tanam) secara terus-menerus dikumpulkan dan dikirim ke aplikasi secara real-time.

Hal ini memberikan petani **wawasan langsung dan akurat** tentang kondisi aktual di dalam kumbung mereka. Selain pemantauan, pengguna juga memiliki kemampuan untuk **mengontrol aktuator** seperti kipas, humidifier, dan lampu langsung dari antarmuka aplikasi. Fungsionalitas kontrol ini memungkinkan penyesuaian cepat terhadap perubahan kondisi lingkungan yang terdeteksi, memastikan lingkungan optimal untuk pertumbuhan jamur.

---

## 📜 Lisensi & Versi

[![Lisensi MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Versi Project](https://img.shields.io/badge/Version-3.1.0-informational.svg)](https://github.com/evanalif113/Kumbung-Sense)

Project ini dilisensikan di bawah **Lisensi MIT**. Anda bebas menggunakan, memodifikasi, dan mendistribusikan kode ini sesuai dengan ketentuan lisensi.

Versi saat ini dari aplikasi ini adalah **3.1.0**.
