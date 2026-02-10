"use client";

import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ActivityItem {
  id: string;
  name: string;
  status: "success" | "pending" | "failed";
  timestamp: string;
  type: "masuk" | "keluar";
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
        <Clock className="h-8 w-8 mb-2 opacity-50" />
        <p className="text-sm">Belum ada aktivitas</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
        Aktivitas Terbaru
      </h3>
      <div className="space-y-2">
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className={cn(
              "flex items-center justify-between rounded-xl border border-border bg-card/50 px-4 py-3 transition-all",
              index === 0 && "animate-in slide-in-from-top-2 duration-300"
            )}
          >
            <div className="flex items-center gap-3">
              {activity.status === "success" && (
                <CheckCircle2 className="h-5 w-5 text-success" />
              )}
              {activity.status === "pending" && (
                <Clock className="h-5 w-5 text-warning animate-pulse" />
              )}
              {activity.status === "failed" && (
                <XCircle className="h-5 w-5 text-destructive" />
              )}
              <div>
                <p className="font-medium text-foreground">{activity.name}</p>
                <p className="text-xs text-muted-foreground">
                  {activity.type === "masuk" ? "Masuk" : "Keluar"} - {activity.timestamp}
                </p>
              </div>
            </div>
            <span
              className={cn(
                "rounded-full px-2 py-1 text-xs font-medium",
                activity.status === "success" && "bg-success/15 text-success",
                activity.status === "pending" && "bg-warning/15 text-warning",
                activity.status === "failed" && "bg-destructive/15 text-destructive"
              )}
            >
              {activity.status === "success" && "Berhasil"}
              {activity.status === "pending" && "Proses"}
              {activity.status === "failed" && "Gagal"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
