import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('firebaseIdToken');
  const { pathname } = request.nextUrl;

  const protectedPaths = ['/dashboard'];
  const isProtected = protectedPaths.some(path => pathname.startsWith(path));

  // Jika mencoba akses halaman yang dilindungi tanpa token, redirect ke login
  if (isProtected && !token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Jika sudah ada token dan mencoba akses halaman login, redirect ke dashboard
  if (pathname === '/login' && token) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

// Konfigurasi matcher untuk menentukan path mana yang akan dijalankan oleh middleware
export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};