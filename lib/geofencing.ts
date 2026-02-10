/**
 * Geofencing Utility
 * Deteksi lokasi karyawan dan validasi apakah berada di area kantor.
 */

export interface GeoLocation {
  latitude: number;
  longitude: number;
}

export interface GeoFence {
  name: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
}

/**
 * Daftar lokasi kantor yang diizinkan untuk absensi.
 * Tambahkan/ubah sesuai kebutuhan.
 */
export const OFFICE_LOCATIONS: GeoFence[] = [
  {
    name: "Kantor Pusat",
    latitude: -6.2088,
    longitude: 106.8456,
    radiusMeters: 200,
  },
];

/**
 * Hitung jarak antara dua koordinat menggunakan formula Haversine (dalam meter)
 */
export function calculateDistance(
  point1: GeoLocation,
  point2: GeoLocation
): number {
  const R = 6371000; // Radius bumi dalam meter
  const dLat = toRadians(point2.latitude - point1.latitude);
  const dLon = toRadians(point2.longitude - point1.longitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(point1.latitude)) *
      Math.cos(toRadians(point2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Cek apakah lokasi user berada di dalam salah satu geofence kantor
 */
export function isWithinOfficeArea(userLocation: GeoLocation): {
  isInside: boolean;
  nearestOffice: GeoFence | null;
  distance: number;
} {
  let nearestOffice: GeoFence | null = null;
  let minDistance = Infinity;

  for (const office of OFFICE_LOCATIONS) {
    const distance = calculateDistance(userLocation, {
      latitude: office.latitude,
      longitude: office.longitude,
    });

    if (distance < minDistance) {
      minDistance = distance;
      nearestOffice = office;
    }

    if (distance <= office.radiusMeters) {
      return {
        isInside: true,
        nearestOffice: office,
        distance,
      };
    }
  }

  return {
    isInside: false,
    nearestOffice,
    distance: minDistance,
  };
}

/**
 * Request lokasi user menggunakan browser Geolocation API
 */
export function getCurrentPosition(): Promise<GeoLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation tidak didukung oleh browser ini"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error("Izin lokasi ditolak. Mohon aktifkan GPS Anda."));
            break;
          case error.POSITION_UNAVAILABLE:
            reject(new Error("Informasi lokasi tidak tersedia."));
            break;
          case error.TIMEOUT:
            reject(new Error("Permintaan lokasi timeout."));
            break;
          default:
            reject(new Error("Terjadi kesalahan saat mendapatkan lokasi."));
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  });
}
