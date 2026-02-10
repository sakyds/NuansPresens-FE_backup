/**
 * Auth Utility
 * Manages authentication tokens/sessions for both Karyawan and Admin roles.
 * Uses cookies for session management.
 */

export type UserRole = "karyawan" | "admin";

export interface AuthSession {
  role: UserRole;
  userId: string;
  name: string;
  token: string;
}

const KARYAWAN_SESSION_KEY = "karyawan_session";
const ADMIN_SESSION_KEY = "admin_session";

/**
 * Get the storage key for a given role
 */
function getStorageKey(role: UserRole): string {
  return role === "admin" ? ADMIN_SESSION_KEY : KARYAWAN_SESSION_KEY;
}

/**
 * Save session data to localStorage (client-side only)
 */
export function saveSession(session: AuthSession): void {
  try {
    const key = getStorageKey(session.role);
    localStorage.setItem(key, JSON.stringify(session));
  } catch (error) {
    console.error("Failed to save session:", error);
  }
}

/**
 * Get session data from localStorage
 */
export function getSession(role: UserRole): AuthSession | null {
  try {
    const key = getStorageKey(role);
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Failed to get session:", error);
    return null;
  }
}

/**
 * Clear session data
 */
export function clearSession(role: UserRole): void {
  try {
    const key = getStorageKey(role);
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Failed to clear session:", error);
  }
}

/**
 * Check if user is authenticated for a given role
 */
export function isAuthenticated(role: UserRole): boolean {
  return getSession(role) !== null;
}

/**
 * Cookie-based helpers for middleware (edge runtime)
 * These cookie names are used by the middleware to check auth status
 */
export const KARYAWAN_COOKIE = "karyawan_auth";
export const ADMIN_COOKIE = "admin_auth";

export function getCookieName(role: UserRole): string {
  return role === "admin" ? ADMIN_COOKIE : KARYAWAN_COOKIE;
}
