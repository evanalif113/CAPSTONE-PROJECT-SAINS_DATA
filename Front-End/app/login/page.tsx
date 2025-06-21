"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      // Redirect to dashboard
      router.replace("/dashboard");
    }, 1500);
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
          Teknologi IoT untuk Kumbung yang Lebih Cerdas dan Terjaga
        </p>

        {/* Login instruction */}
        <p className="text-center text-gray-500 text-sm mb-8">
          Masuk untuk mengakses dashboard monitoring kumbungmu
        </p>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <input
              type="email"
              placeholder="Alamat email"
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

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
              />
              <span className="text-sm text-gray-600">Ingat saya</span>
            </label>
            <button
              type="button"
              className="text-sm text-teal-600 hover:text-teal-700 transition-colors"
            >
              Lupa sandi?
            </button>
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

        {/* Signup Link */}
        <div className="text-center mt-4 text-sm text-gray-600">
          Belum punya akun?{" "}
          <a
            href="/signup"
            className="text-teal-600 hover:text-teal-800 font-medium transition-colors"
          >
            Daftar di sini
          </a>
        </div>
      </div>
    </div>
  );
}
