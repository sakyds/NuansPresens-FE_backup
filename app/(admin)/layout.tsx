import React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Panel - NuansPresens",
  description: "Panel administrasi sistem absensi karyawan",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  )
}
