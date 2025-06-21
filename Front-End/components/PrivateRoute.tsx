// components/PrivateRoute.tsx
'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Jika loading selesai dan tidak ada user, arahkan ke halaman login
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Selama loading, tampilkan pesan atau spinner
  if (loading) {
    return <p>Loading...</p>;
  }

  // Jika ada user, tampilkan konten halaman (children)
  if (user) {
    return <>{children}</>;
  }
  
  // Jika tidak ada user (setelah loading), return null agar tidak merender apapun sebelum redirect
  return null; 
};

export default PrivateRoute;