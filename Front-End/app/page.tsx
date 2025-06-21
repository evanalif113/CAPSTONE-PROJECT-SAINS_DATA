"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (user) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [user, loading, router]);

  return (
    <div className="flex items-center justify-center h-screen text-gray-500 text-sm">
      Memuat...
    </div>
  );
}
// This page redirects users based on their authentication status.
// If the user is authenticated, they are redirected to the dashboard.
