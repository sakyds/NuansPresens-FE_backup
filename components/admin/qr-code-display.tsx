"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { LogIn, LogOut, Scan, Smartphone } from "lucide-react";
import type { SessionType } from "./session-selector";

interface QRCodeDisplayProps {
  sessionType: SessionType;
}

export function QRCodeDisplay({ sessionType }: QRCodeDisplayProps) {
  const [qrData, setQrData] = useState("");
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const GenerateQR =  async () => {
      try {
        let response = await fetch('http://localhost:2000/api/generate-qr', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ type: sessionType }),
        })
        let result = await response.json()
        if(result.status === 'success'){
          setQrData(result.data.token)
        }
      } catch (error) {
        console.error("Error generating QR code:", error);
      }
    }

    GenerateQR();
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : 10));
    }, 1000);
    
    const interval = setInterval(()=> {GenerateQR()}, 10000)
    
    return () => {
      clearInterval(interval);
      clearInterval(countdownInterval);
    };
  }, [sessionType]);

  const gradientColors =
    sessionType === "masuk"
      ? "from-emerald-500/60 via-green-400/40 to-teal-500/60"
      : "from-orange-500/60 via-amber-400/40 to-yellow-500/60";

  const accentColor = sessionType === "masuk" ? "bg-success" : "bg-warning";
  const textColor = sessionType === "masuk" ? "text-success" : "text-warning";
  const borderColor = sessionType === "masuk" ? "border-success/30" : "border-warning/30";

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Live Status Bar */}
      <div className={`flex items-center gap-4 rounded-full border ${borderColor} bg-card/50 px-6 py-3 backdrop-blur-sm`}>
        <div className="flex items-center gap-2">
          <div className="relative flex h-3 w-3">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${accentColor} opacity-75`} />
            <span className={`relative inline-flex rounded-full h-3 w-3 ${accentColor}`} />
          </div>
          <span className={`text-sm font-semibold uppercase tracking-widest ${textColor}`}>Live</span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-2">
          {sessionType === "masuk" ? (
            <LogIn className={`h-4 w-4 ${textColor}`} />
          ) : (
            <LogOut className={`h-4 w-4 ${textColor}`} />
          )}
          <span className="text-sm font-medium text-foreground">
            {sessionType === "masuk" ? "Sesi Masuk" : "Sesi Keluar"}
          </span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>Refresh:</span>
          <span className={`font-mono font-bold ${textColor}`}>{countdown}s</span>
        </div>
      </div>

      {/* QR Code Container */}
      <div className="relative">
        {/* Animated outer glow rings */}
        <div className={`absolute -inset-4 rounded-[2rem] bg-gradient-to-r ${gradientColors} opacity-40 blur-2xl animate-pulse-live`} />
        <div className={`absolute -inset-2 rounded-[1.75rem] bg-gradient-to-br ${gradientColors} opacity-25 blur-xl`} />
        
        {/* Corner decorations */}
        <div className={`absolute -top-2 -left-2 h-8 w-8 rounded-tl-2xl border-t-4 border-l-4 ${sessionType === "masuk" ? "border-success" : "border-warning"}`} />
        <div className={`absolute -top-2 -right-2 h-8 w-8 rounded-tr-2xl border-t-4 border-r-4 ${sessionType === "masuk" ? "border-success" : "border-warning"}`} />
        <div className={`absolute -bottom-2 -left-2 h-8 w-8 rounded-bl-2xl border-b-4 border-l-4 ${sessionType === "masuk" ? "border-success" : "border-warning"}`} />
        <div className={`absolute -bottom-2 -right-2 h-8 w-8 rounded-br-2xl border-b-4 border-r-4 ${sessionType === "masuk" ? "border-success" : "border-warning"}`} />

        {/* Main QR container */}
        <div className="relative rounded-3xl bg-white p-8 shadow-2xl shadow-black/30">
          {/* Inner border decoration */}
          <div className={`absolute inset-2 rounded-2xl border-2 border-dashed ${sessionType === "masuk" ? "border-emerald-200" : "border-orange-200"} opacity-50`} />
          
          {/* QR Code */}
          <div className="relative z-10">
            <QRCodeSVG
              value={qrData}
              size={280}
              bgColor="#ffffff"
              fgColor="#0f172a"
              level="H"
              includeMargin={false}
              
            />
            
            {/* Center logo overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`rounded-xl ${accentColor} p-3 shadow-lg ring-4 ring-white`}>
                {sessionType === "masuk" ? (
                  <LogIn className="h-8 w-8 text-white" />
                ) : (
                  <LogOut className="h-8 w-8 text-white" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scan instruction */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Smartphone className="h-5 w-5" />
          <div className="flex items-center gap-2">
            <span className="text-sm">Scan dengan aplikasi</span>
            <Scan className={`h-5 w-5 ${textColor} animate-pulse`} />
          </div>
        </div>
        <p className="text-center text-xs text-muted-foreground/70">
          QR Code akan diperbarui otomatis setiap 30 detik untuk keamanan
        </p>
      </div>
    </div>
  );
}
