"use client"

import type React from "react"
import { useState } from "react"

export default function Signup() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")
    try {
      const url = `http://localhost:2518/api/signup?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
      const res = await fetch(url, {
        method: "GET",
      })
      const text = await res.text()
      console.log("API signup response:", { status: res.status, text })
      if (res.status === 201) {
        setSuccess("Registrasi berhasil! Silakan login.")
        setUsername("")
        setPassword("")
        setTimeout(() => {
          window.location.href = "/login"
        }, 1200)
      } else if (res.status === 409) {
        setError(text || "Username sudah terdaftar.")
      } else if (res.status === 400) {
        setError(text || "Username dan password wajib diisi.")
      } else {
        setError(text || "Registrasi gagal.")
      }
    } catch (err) {
      setError("Tidak dapat terhubung ke server. Pastikan server backend berjalan dan dapat diakses.")
      console.error("API signup error:", err)
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-teal-200 rounded-full flex items-center justify-center">
            <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-teal-200" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">Kumbung Sense</h1>

        {/* Subtitle */}
        <p className="text-center text-gray-600 mb-6">Teknologi IoT untuk Kumbung yang Lebih Cerdas dan Terjaga</p>

        {/* Signup instruction */}
        <p className="text-center text-gray-500 text-sm mb-8">Daftar untuk mengakses dashboard monitoring kumbungmu</p>

        {/* Error/Success Message */}
        {error && <div className="mb-4 text-red-600 text-sm text-center">{error}</div>}
        {success && <div className="mb-4 text-green-600 text-sm text-center">{success}</div>}

        {/* Signup Form */}
        <form onSubmit={handleSignup} className="space-y-6">
          {/* Username Field */}
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
      </div>
    </div>
  )
}
