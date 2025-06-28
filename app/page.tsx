'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Root page: always redirect to /login
export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push("/authentication"); // Redirect to the login page
  }, [router]);
  return null;
}
// This page redirects users to the login page.
// Always redirects to /login regardless of authentication status.
