import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware untuk memisahkan proteksi halaman antara Karyawan dan Admin.
 *
 * Aturan:
 * - /dashboard (karyawan) -> butuh cookie "karyawan_auth"
 * - /admin/dashboard (admin) -> butuh cookie "admin_auth"
 * - /login -> halaman login karyawan (publik)
 * - /admin/login -> halaman login admin (publik)
 * - Karyawan tidak bisa akses /admin/*
 * - Admin tidak bisa akses /dashboard (karyawan area)
 */

const KARYAWAN_COOKIE = "karyawan_auth";
const ADMIN_COOKIE = "admin_auth";

// Halaman yang bisa diakses tanpa login
const PUBLIC_PATHS = ["/login", "/admin/login"];

// Path prefix untuk area yang dilindungi
const KARYAWAN_PROTECTED_PREFIX = "/dashboard";
const ADMIN_PROTECTED_PREFIX = "/admin/dashboard";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files, API routes, and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".") // static files like .png, .svg, etc.
  ) {
    return NextResponse.next();
  }

  const hasKaryawanAuth = request.cookies.has(KARYAWAN_COOKIE);
  const hasAdminAuth = request.cookies.has(ADMIN_COOKIE);

  // --- ADMIN ROUTES PROTECTION ---
  if (pathname.startsWith("/admin")) {
    // Allow access to admin login page
    if (pathname === "/admin/login") {
      // If already authenticated as admin, redirect to admin dashboard
      if (hasAdminAuth) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
      return NextResponse.next();
    }

    // Protect all other /admin/* pages
    if (!hasAdminAuth) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Block karyawan from accessing admin pages (even if they have karyawan auth)
    // Admin auth is the required credential here - already checked above
    return NextResponse.next();
  }

  // --- KARYAWAN ROUTES PROTECTION ---
  if (pathname.startsWith(KARYAWAN_PROTECTED_PREFIX)) {
    if (!hasKaryawanAuth) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // --- LOGIN PAGES ---
  if (pathname === "/login") {
    // If already authenticated as karyawan, redirect to dashboard
    if (hasKaryawanAuth) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // --- ROOT REDIRECT ---
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
