import React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Absensi Karyawan - NuansPresens",
  description: "Aplikasi absensi karyawan dengan scan QR dan deteksi lokasi",
}

export default function KaryawanLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-svh bg-background">
      {children}
    </div>
  )
}
