"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Root page: selalu redirect ke /login
export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/login");
  }, [router]);
  return null;
}
// This page redirects users to the login page.
// Always redirects to /login regardless of authentication status.
