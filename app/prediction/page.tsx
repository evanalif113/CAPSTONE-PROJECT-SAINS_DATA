// app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 text-center">
      <div className="max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h1 className="text-6xl font-bold text-slate-800">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-slate-600">Halaman Tidak Ditemukan</h2>
        <p className="mt-2 text-slate-500">
          Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-block rounded-lg bg-slate-800 px-6 py-3 font-semibold text-white transition-colors hover:bg-slate-700"
        >
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  );
}
