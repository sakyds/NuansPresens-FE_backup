"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import {
  Camera,
  LogIn,
  LogOut,
  X,
  Check,
  AlertCircle,
  Loader2,
  MapPin,
  MapPinOff,
  Navigation,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getCurrentPosition,
  isWithinOfficeArea,
  type GeoLocation,
} from "@/lib/geofencing";

type ScanMode = "checkin" | "checkout";
type SubmissionStatus = "idle" | "loading" | "success" | "error";
type LocationStatus = "idle" | "checking" | "inside" | "outside" | "error";

interface SubmissionResponse {
  status: "success" | "error";
  code: number;
  message: string;
  data?: Record<string, unknown>;
}

export function ScanTab() {
  const [scanMode, setScanMode] = useState<ScanMode>("checkin");
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>("idle");
  const [submissionMessage, setSubmissionMessage] = useState<string>("");
  const scannerRef = useRef<Html5Qrcode | null>(null);

  // Geofencing state
  const [locationStatus, setLocationStatus] = useState<LocationStatus>("idle");
  const [locationMessage, setLocationMessage] = useState<string>("");
  const [userLocation, setUserLocation] = useState<GeoLocation | null>(null);
  const [distanceToOffice, setDistanceToOffice] = useState<number | null>(null);

  /**
   * Cek lokasi user sebelum mengizinkan scan
   */
  const checkLocation = async () => {
    setLocationStatus("checking");
    setLocationMessage("Mengecek lokasi Anda...");

    try {
      const position = await getCurrentPosition();
      setUserLocation(position);

      const result = isWithinOfficeArea(position);
      setDistanceToOffice(Math.round(result.distance));

      if (result.isInside) {
        setLocationStatus("inside");
        setLocationMessage(
          `Anda berada di area ${result.nearestOffice?.name || "kantor"} (${Math.round(result.distance)}m)`
        );
      } else {
        setLocationStatus("outside");
        setLocationMessage(
          `Anda di luar area kantor. Jarak ke ${result.nearestOffice?.name || "kantor terdekat"}: ${Math.round(result.distance)}m`
        );
      }
    } catch (error) {
      setLocationStatus("error");
      setLocationMessage(
        error instanceof Error
          ? error.message
          : "Gagal mendapatkan lokasi. Pastikan GPS aktif."
      );
    }
  };

  // Check location on mount
  useEffect(() => {
    checkLocation();
  }, []);

  const submitPresensi = async (token: string) => {
    setSubmissionStatus("loading");
    try {
      const response = await fetch(
        "https://jeramy-silty-stasia.ngrok-free.dev/api/presensi",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_karyawan: 1,
            karyawan_shift: 1,
            curent_shift: 1,
            token: token,
            latitude: userLocation?.latitude,
            longitude: userLocation?.longitude,
          }),
        }
      );

      const data: SubmissionResponse = await response.json();

      if (response.ok && data.status === "success") {
        setSubmissionStatus("success");
        setSubmissionMessage(data.message || "Presensi berhasil dicatat!");
        setTimeout(() => {
          setScannedData(null);
          setSubmissionStatus("idle");
          setSubmissionMessage("");
        }, 3000);
      } else {
        setSubmissionStatus("error");
        setSubmissionMessage(data.message || "Gagal mencatat presensi");
      }
    } catch {
      setSubmissionStatus("error");
      setSubmissionMessage("Terjadi kesalahan saat menghubungi server");
    }
  };

  const startScanner = async () => {
    // Re-check location before scanning
    if (locationStatus !== "inside") {
      await checkLocation();
      // We allow scanning regardless (the API can also validate),
      // but we show a warning if outside
    }

    setScannedData(null);
    setSubmissionStatus("idle");
    setSubmissionMessage("");
    setIsScanning(true);

    await new Promise((resolve) => setTimeout(resolve, 100));

    try {
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          setScannedData(decodedText);
          scanner.stop().catch(() => {});
          setIsScanning(false);
          setTimeout(() => {
            submitPresensi(decodedText);
          }, 500);
        },
        () => {
          // Ignore scan errors (no QR in frame)
        }
      );
    } catch {
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
      } catch {
        // Ignore stop errors
      }
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const canScan = locationStatus === "inside";

  return (
    <div className="flex flex-col gap-5">
      {/* Location Status Card */}
      <div
        className={cn(
          "flex items-center gap-3 rounded-2xl border p-4 transition-all",
          locationStatus === "checking" &&
            "border-accent/50 bg-accent/10",
          locationStatus === "inside" &&
            "border-success/30 bg-success/10",
          locationStatus === "outside" &&
            "border-warning/30 bg-warning/10",
          locationStatus === "error" &&
            "border-destructive/30 bg-destructive/10",
          locationStatus === "idle" && "border-border/50 bg-card"
        )}
      >
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            locationStatus === "checking" && "bg-accent/20",
            locationStatus === "inside" && "bg-success/20",
            locationStatus === "outside" && "bg-warning/20",
            locationStatus === "error" && "bg-destructive/20",
            locationStatus === "idle" && "bg-muted"
          )}
        >
          {locationStatus === "checking" && (
            <Loader2 className="h-5 w-5 text-foreground animate-spin" />
          )}
          {locationStatus === "inside" && (
            <MapPin className="h-5 w-5 text-success" />
          )}
          {locationStatus === "outside" && (
            <Navigation className="h-5 w-5 text-warning" />
          )}
          {locationStatus === "error" && (
            <MapPinOff className="h-5 w-5 text-destructive" />
          )}
          {locationStatus === "idle" && (
            <MapPin className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1">
          <p
            className={cn(
              "text-xs font-medium",
              locationStatus === "inside" && "text-success",
              locationStatus === "outside" && "text-warning",
              locationStatus === "error" && "text-destructive",
              (locationStatus === "checking" || locationStatus === "idle") &&
                "text-muted-foreground"
            )}
          >
            {locationStatus === "inside" && "Di Area Kantor"}
            {locationStatus === "outside" && "Di Luar Area Kantor"}
            {locationStatus === "error" && "Lokasi Tidak Tersedia"}
            {locationStatus === "checking" && "Mengecek Lokasi..."}
            {locationStatus === "idle" && "Lokasi belum dicek"}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {locationMessage}
          </p>
        </div>
        {(locationStatus === "outside" ||
          locationStatus === "error" ||
          locationStatus === "idle") && (
          <button
            type="button"
            onClick={checkLocation}
            className="shrink-0 rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent/80 transition-colors"
          >
            Cek Ulang
          </button>
        )}
      </div>

      {/* Mode Toggle */}
      <div className="flex items-center gap-2 rounded-2xl bg-card p-1.5">
        <button
          type="button"
          onClick={() => setScanMode("checkin")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all",
            scanMode === "checkin"
              ? "bg-success text-success-foreground shadow-lg shadow-success/25"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <LogIn className="h-4 w-4" />
          Check-In
        </button>
        <button
          type="button"
          onClick={() => setScanMode("checkout")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all",
            scanMode === "checkout"
              ? "bg-warning text-warning-foreground shadow-lg shadow-warning/25"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <LogOut className="h-4 w-4" />
          Check-Out
        </button>
      </div>

      {/* Scanner Area */}
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-black">
        {isScanning ? (
          <>
            <div
              id="qr-reader"
              className="h-full w-full [&_video]:h-full [&_video]:w-full [&_video]:object-cover"
            />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="relative h-64 w-64">
                <div
                  className={cn(
                    "absolute top-0 left-0 h-12 w-12 border-t-4 border-l-4 rounded-tl-2xl",
                    scanMode === "checkin" ? "border-success" : "border-warning"
                  )}
                />
                <div
                  className={cn(
                    "absolute top-0 right-0 h-12 w-12 border-t-4 border-r-4 rounded-tr-2xl",
                    scanMode === "checkin" ? "border-success" : "border-warning"
                  )}
                />
                <div
                  className={cn(
                    "absolute bottom-0 left-0 h-12 w-12 border-b-4 border-l-4 rounded-bl-2xl",
                    scanMode === "checkin" ? "border-success" : "border-warning"
                  )}
                />
                <div
                  className={cn(
                    "absolute bottom-0 right-0 h-12 w-12 border-b-4 border-r-4 rounded-br-2xl",
                    scanMode === "checkin" ? "border-success" : "border-warning"
                  )}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={stopScanner}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-black/60 px-6 py-3 text-foreground backdrop-blur-sm"
            >
              <X className="h-5 w-5" />
              Tutup
            </button>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-6 p-8">
            <div
              className={cn(
                "rounded-3xl p-6",
                scanMode === "checkin" ? "bg-success/20" : "bg-warning/20"
              )}
            >
              <Camera
                className={cn(
                  "h-16 w-16",
                  scanMode === "checkin" ? "text-success" : "text-warning"
                )}
              />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground">
                Scan QR Code
              </h3>
              <p className="mt-1 text-sm text-foreground/60">
                {canScan
                  ? "Tekan tombol di bawah untuk memulai"
                  : "Anda harus berada di area kantor untuk scan"}
              </p>
            </div>
            <button
              type="button"
              onClick={startScanner}
              disabled={!canScan}
              className={cn(
                "flex items-center gap-2 rounded-xl px-8 py-3 font-semibold transition-all",
                canScan
                  ? scanMode === "checkin"
                    ? "bg-success text-success-foreground"
                    : "bg-warning text-warning-foreground"
                  : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
              )}
            >
              <Camera className="h-5 w-5" />
              {canScan ? "Buka Kamera" : "Lokasi Tidak Valid"}
            </button>
          </div>
        )}
      </div>

      {/* Scanned Result & Submission Status */}
      {scannedData && (
        <div className="space-y-3">
          <div className="rounded-2xl border border-success/30 bg-success/10 p-4">
            <p className="text-xs text-muted-foreground mb-2">QR Code:</p>
            <p className="text-sm font-mono text-foreground break-all">
              {scannedData}
            </p>
          </div>

          {submissionStatus === "loading" && (
            <div className="rounded-2xl border border-accent/30 bg-accent/10 p-6 flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 text-foreground animate-spin" />
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                  Memproses Presensi...
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Harap tunggu sebentar
                </p>
              </div>
            </div>
          )}

          {submissionStatus === "success" && (
            <div className="rounded-2xl border border-success/50 bg-success/20 p-6 flex flex-col items-center gap-3">
              <div className="rounded-full bg-success/30 p-3">
                <Check className="h-8 w-8 text-success" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-success">
                  {submissionMessage}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {scanMode === "checkin"
                    ? "Selamat datang!"
                    : "Sampai jumpa besok!"}
                </p>
              </div>
            </div>
          )}

          {submissionStatus === "error" && (
            <div className="rounded-2xl border border-destructive/50 bg-destructive/20 p-6 flex flex-col items-center gap-3">
              <div className="rounded-full bg-destructive/30 p-3">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-destructive">
                  {submissionMessage}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setScannedData(null);
                    setSubmissionStatus("idle");
                    setSubmissionMessage("");
                  }}
                  className="mt-3 rounded-lg bg-destructive/30 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/40 transition-colors"
                >
                  Coba Lagi
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Location Info Footer */}
      {userLocation && (
        <div className="rounded-xl border border-border/50 bg-card/50 p-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span>
              Koordinat: {userLocation.latitude.toFixed(6)},{" "}
              {userLocation.longitude.toFixed(6)}
            </span>
            {distanceToOffice !== null && (
              <>
                <span className="text-border">|</span>
                <span>Jarak: {distanceToOffice}m dari kantor</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
