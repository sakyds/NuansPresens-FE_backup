"use client";

import { useState, useEffect } from "react";
import { Play, StopCircle } from "lucide-react";
import { Sidebar } from "./sidebar";
import { DigitalClock } from "@/components/shared/digital-clock";
import { SessionSelector, type SessionType } from "./session-selector";
import { QRCodeDisplay } from "./qr-code-display";
import { RecentActivity, type ActivityItem } from "./recent-activity";

// Demo data for recent activities
const demoActivities: ActivityItem[] = [
  {
    id: "1",
    name: "Budi Santoso",
    status: "success",
    timestamp: "08:15:32",
    type: "masuk",
  },
  {
    id: "2",
    name: "Siti Rahayu",
    status: "success",
    timestamp: "08:14:28",
    type: "masuk",
  },
  {
    id: "3",
    name: "Ahmad Wijaya",
    status: "success",
    timestamp: "08:12:45",
    type: "masuk",
  },
];

export function KioskDashboard() {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionType, setSessionType] = useState<SessionType>("masuk");
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  // Simulate incoming scan activity when session is active
  useEffect(() => {
    if (isSessionActive) {
      setActivities(demoActivities);
      
      const interval = setInterval(() => {
        const names = ["Dewi Lestari", "Rudi Hermawan", "Maya Putri", "Andi Prasetyo", "Nina Wati"];
        const randomName = names[Math.floor(Math.random() * names.length)];
        const now = new Date();
        const timestamp = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
        
        setActivities((prev) => [
          {
            id: Date.now().toString(),
            name: randomName,
            status: "success",
            timestamp,
            type: sessionType,
          },
          ...prev.slice(0, 4),
        ]);
      }, 10000);
      
      return () => clearInterval(interval);
    } else {
      setActivities([]);
    }
  }, [isSessionActive, sessionType]);

  const handleStartSession = () => {
    setIsSessionActive(true);
  };

  const handleStopSession = () => {
    setIsSessionActive(false);
    setActivities([]);
  };

  const handleSignOut = () => {
    setIsSessionActive(false);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar onSignOut={handleSignOut} />
      
      <main className="flex flex-1 flex-col overflow-y-auto">
        <div className="flex min-h-screen flex-col items-center px-4 py-8 sm:px-8 lg:px-12">
          {/* Header with Clock */}
          <div className="mb-8 w-full text-center">
            <DigitalClock variant="large" />
          </div>

          {/* Greeting */}
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-2xl font-semibold text-foreground sm:text-3xl">
              Selamat Datang, <span className="text-success">Administrator</span>
            </h1>
            <p className="text-muted-foreground">
              {isSessionActive 
                ? `Sesi ${sessionType === "masuk" ? "Masuk" : "Keluar"} sedang aktif`
                : "Pilih tipe sesi dan mulai absensi"
              }
            </p>
          </div>

          {/* Main Interactive Area */}
          <div className="flex flex-1 flex-col items-center justify-center gap-8 w-full max-w-4xl">
            {!isSessionActive ? (
              <>
                <SessionSelector
                  selectedType={sessionType}
                  onSelectType={setSessionType}
                />
                <button
                  type="button"
                  onClick={handleStartSession}
                  className={`group relative flex items-center gap-4 rounded-2xl px-10 py-5 text-xl font-semibold transition-all duration-300 shadow-lg hover:scale-105 active:scale-95 ${
                    sessionType === "masuk"
                      ? "bg-success text-success-foreground shadow-success/30 hover:shadow-success/50"
                      : "bg-warning text-warning-foreground shadow-warning/30 hover:shadow-warning/50"
                  }`}
                >
                  <Play className="h-7 w-7 transition-transform group-hover:scale-110" />
                  <span>Mulai Sesi Absensi</span>
                </button>
              </>
            ) : (
              <>
                <QRCodeDisplay sessionType={sessionType} />
                <div className="mt-6 w-full flex justify-center">
                  <RecentActivity activities={activities} />
                </div>
                <button
                  type="button"
                  onClick={handleStopSession}
                  className="mt-4 flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-6 py-3 text-destructive transition-all hover:bg-destructive/20 hover:border-destructive/50"
                >
                  <StopCircle className="h-5 w-5" />
                  <span className="font-medium">Akhiri Sesi</span>
                </button>
              </>
            )}
          </div>

          <footer className="mt-auto pt-8 text-center">
            <p className="text-xs text-muted-foreground/60">
              NuansPresens - Admin Panel v1.0
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
