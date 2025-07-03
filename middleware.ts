// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Ambil token dari cookies
  const token = request.cookies.get('firebaseIdToken');
  const { pathname } = request.nextUrl;

  // Jika tidak ada token dan pengguna mencoba mengakses rute selain otentikasi
  if (!token && pathname !== '/authentication') {
    // Redirect ke halaman login
    return NextResponse.redirect(new URL('/authentication', request.url));
  }

  // Jika ada token dan pengguna mencoba mengakses halaman otentikasi
  if (token && pathname === '/authentication') {
    // Redirect ke dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Lanjutkan ke rute yang diminta jika kondisi di atas tidak terpenuhi
  return NextResponse.next();
}

// Tentukan rute mana yang akan dijalankan oleh middleware ini
export const config = {
  matcher: [
    /*
     * Cocokkan semua path kecuali yang dimulai dengan:
     * - _next/static (file statis)
     * - _next/image (optimasi gambar)
     * - favicon.ico (file favicon)
     * - img/ (folder gambar publik Anda)
     */
    '/((?!_next/static|_next/image|favicon.ico|img/).*)',
  ],
};