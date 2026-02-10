"use client";

import { LogIn, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export type SessionType = "masuk" | "keluar";

interface SessionSelectorProps {
  selectedType: SessionType;
  onSelectType: (type: SessionType) => void;
}

export function SessionSelector({ selectedType, onSelectType }: SessionSelectorProps) {
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
      <button
        type="button"
        onClick={() => onSelectType("masuk")}
        className={cn(
          "group relative flex h-28 w-52 flex-col items-center justify-center gap-2 rounded-2xl border-2 transition-all duration-300 sm:h-32 sm:w-60",
          selectedType === "masuk"
            ? "border-success bg-success/15 shadow-lg shadow-success/20"
            : "border-border bg-card hover:border-success/50 hover:bg-success/5"
        )}
      >
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl transition-colors",
            selectedType === "masuk"
              ? "bg-success text-success-foreground"
              : "bg-muted text-muted-foreground group-hover:bg-success/20 group-hover:text-success"
          )}
        >
          <LogIn className="h-6 w-6" />
        </div>
        <span
          className={cn(
            "text-lg font-semibold transition-colors",
            selectedType === "masuk"
              ? "text-success"
              : "text-foreground"
          )}
        >
          Sesi Masuk
        </span>
        {selectedType === "masuk" && (
          <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-success animate-pulse" />
        )}
      </button>

      <button
        type="button"
        onClick={() => onSelectType("keluar")}
        className={cn(
          "group relative flex h-28 w-52 flex-col items-center justify-center gap-2 rounded-2xl border-2 transition-all duration-300 sm:h-32 sm:w-60",
          selectedType === "keluar"
            ? "border-warning bg-warning/15 shadow-lg shadow-warning/20"
            : "border-border bg-card hover:border-warning/50 hover:bg-warning/5"
        )}
      >
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl transition-colors",
            selectedType === "keluar"
              ? "bg-warning text-warning-foreground"
              : "bg-muted text-muted-foreground group-hover:bg-warning/20 group-hover:text-warning"
          )}
        >
          <LogOut className="h-6 w-6" />
        </div>
        <span
          className={cn(
            "text-lg font-semibold transition-colors",
            selectedType === "keluar"
              ? "text-warning"
              : "text-foreground"
          )}
        >
          Sesi Keluar
        </span>
        {selectedType === "keluar" && (
          <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-warning animate-pulse" />
        )}
      </button>
    </div>
  );
}
