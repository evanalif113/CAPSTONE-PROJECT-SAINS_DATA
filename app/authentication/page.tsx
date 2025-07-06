"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
} from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";

export default function Authentication() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLogin, setIsLogin] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccess("Registrasi berhasil! Silakan login.");
      setEmail("");
      setPassword("");
      setTimeout(() => {
        router.push("/authentication");
      }, 1200);
    } catch (err: any) {
      setError(err.message || "Registrasi gagal.");
    }
    setIsLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const idToken = await userCredential.user.getIdToken();

      document.cookie = `firebaseIdToken=${idToken}; path=/; max-age=3600`;

      setSuccess("Login berhasil! Mengalihkan...");
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message || "Login gagal.");
    }
    setIsLoading(false);
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setError("");
    setSuccess("");
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        "Guest@mail.com",
        "guest12345"
      );
      const idToken = await userCredential.user.getIdToken();

      document.cookie = `firebaseIdToken=${idToken}; path=/; max-age=3600`;

      setSuccess("Login sebagai tamu berhasil! Mengalihkan...");
      window.location.href = "/dashboard";
    } catch (err: any) {
        if (err.code === 'auth/user-not-found') {
            setError("Akun tamu default tidak ditemukan. Silakan buat akun dengan email: Guest@mail.com dan password: guest12345");
        } else if (err.code === 'auth/wrong-password') {
            setError("Password untuk akun tamu salah. Gunakan password: guest12345");
        } else {
            setError(err.message || "Gagal masuk sebagai tamu.");
        }
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="/img/icon.png"
            alt="Logo Kumbung Sense"
            className="w-16 h-16 rounded-full object-cover"
          />
        </div>
        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Kumbung Sense
        </h1>

        {/* Subtitle */}
        <p className="text-center text-gray-600 mb-6">
          Teknologi AIoT untuk Budidaya Jamur yang Lebih Cerdas dan Presisi
        </p>

        {/* Signup instruction */}
        <p className="text-center text-gray-500 text-sm mb-8">
          Masukan Akun untuk mengakses Dashboard
        </p>

        {/* Error/Success Message */}
        {error && (
          <div className="mb-4 text-red-600 text-sm text-center">{error}</div>
        )}
        {success && (
          <div className="mb-4 text-green-600 text-sm text-center">{success}</div>
        )}

        {/* Toggle antara Signup dan Login */}
        <div className="flex justify-center mb-4">
          <button
            className={`px-4 py-2 rounded-l-lg ${
              !isLogin ? "bg-teal-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setIsLogin(false)}
            type="button"
          >
            Daftar
          </button>
          <button
            className={`px-4 py-2 rounded-r-lg ${
              isLogin ? "bg-teal-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setIsLogin(true)}
            type="button"
          >
            Masuk
          </button>
        </div>

        {/* Signup Form */}
        {!isLogin && (
          <form onSubmit={handleSignup} className="space-y-6">
            {/* Email Field */}
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors"
              />
            </div>
            {/* Password Field */}
            <div>
              <input
                type="password"
                placeholder="Kata Sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors"
              />
            </div>
            {/* Signup Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Daftar...</span>
                </div>
              ) : (
                "Daftar"
              )}
            </button>
          </form>
        )}

        {/* Login Form */}
        {isLogin && (
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors"
              />
            </div>
            {/* Password Field */}
            <div>
              <input
                type="password"
                placeholder="Kata Sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors"
              />
            </div>
            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Masuk...</span>
                </div>
              ) : (
                "Masuk"
              )}
            </button>
          </form>
        )}

        {/* Login/Signup Link */}
        <div className="text-center mt-4 text-sm text-gray-600">
          {isLogin ? (
            <>
              Belum punya akun?{" "}
              <button
                className="text-teal-600 hover:text-teal-800 font-medium transition-colors"
                onClick={() => setIsLogin(false)}
                type="button"
              >
                Daftar di sini
              </button>
            </>
          ) : (
            <>
              Sudah punya akun?{" "}
              <button
                className="text-teal-600 hover:text-teal-800 font-medium transition-colors"
                onClick={() => setIsLogin(true)}
                type="button"
              >
                Masuk di sini
              </button>
            </>
          )}
        </div>

        <div className="mt-6 border-t border-gray-200 pt-6 text-center">
          <p className="text-sm text-gray-500 mb-4">Atau</p>
          <button
            onClick={handleGuestLogin}
            disabled={isLoading}
            className="w-full bg-slate-600 text-white py-3 rounded-lg font-medium hover:bg-slate-700 focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span>Memproses...</span>
            ) : (
                <span>Masuk sebagai Tamu</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

