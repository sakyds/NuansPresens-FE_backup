"use client";

import { LayoutDashboard, LogOut } from "lucide-react";
import { clearSession, ADMIN_COOKIE } from "@/lib/auth";

interface SidebarProps {
  onSignOut: () => void;
}

export function Sidebar({ onSignOut }: SidebarProps) {
  const handleSignOut = () => {
    clearSession("admin");
    document.cookie = `${ADMIN_COOKIE}=; path=/; max-age=0`;
    onSignOut();
    window.location.href = "/admin/login";
  };

  return (
    <aside className="flex h-screen w-20 flex-col items-center justify-between border-r border-border bg-sidebar py-8">
      <div className="flex flex-col items-center gap-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success">
          <span className="text-xl font-bold text-success-foreground">A</span>
        </div>
      </div>

      <nav className="flex flex-col items-center gap-4">
        <button
          type="button"
          className="group flex h-12 w-12 flex-col items-center justify-center rounded-xl bg-accent text-foreground transition-colors hover:bg-success hover:text-success-foreground"
          aria-label="Dashboard"
        >
          <LayoutDashboard className="h-5 w-5" />
        </button>
        <span className="text-xs text-muted-foreground">Dashboard</span>
      </nav>

      <button
        type="button"
        onClick={handleSignOut}
        className="group flex h-12 w-12 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        aria-label="Sign Out"
      >
        <LogOut className="h-5 w-5" />
      </button>
    </aside>
  );
}
