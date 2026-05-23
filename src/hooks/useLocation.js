import { useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import { requestLocationPermission } from '../utils/permissions';

const LOCATION_OPTIONS = {
  accuracy: Location.Accuracy.Balanced,
};

const WATCH_OPTIONS = {
  accuracy: Location.Accuracy.Balanced,
  distanceInterval: 10,
  timeInterval: 5000,
};

function toUserLocation(locationResult) {
  return locationResult?.coords ?? null;
}

export function useLocation() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  const locationSubscription = useRef(null);

  useEffect(() => {
    let isMounted = true;

    async function applyLocation(locationResult) {
      const coords = toUserLocation(locationResult);
      if (!isMounted || !coords) return false;

      setLocation(coords);
      setErrorMsg(null);
      setLoading(false);
      return true;
    }

    async function startWatching() {
      setLoading(true);
      setErrorMsg(null);

      try {
        const granted = await requestLocationPermission();
        if (!granted) {
          if (isMounted) {
            setErrorMsg('Izin lokasi ditolak. Aktifkan izin lokasi untuk SocialApp di pengaturan perangkat.');
            setLoading(false);
          }
          return;
        }

        const servicesEnabled = await Location.hasServicesEnabledAsync();
        if (!servicesEnabled) {
          if (isMounted) {
            setErrorMsg('GPS atau layanan lokasi sedang nonaktif. Aktifkan Location/GPS di perangkat lalu coba lagi.');
            setLoading(false);
          }
          return;
        }

        const lastKnownLocation = await Location.getLastKnownPositionAsync({
          maxAge: 5 * 60 * 1000,
          requiredAccuracy: 1000,
        });
        await applyLocation(lastKnownLocation);

        locationSubscription.current = await Location.watchPositionAsync(
          WATCH_OPTIONS,
          (newLocation) => {
            applyLocation(newLocation);
          }
        );

        try {
          const currentLocation = await Location.getCurrentPositionAsync(LOCATION_OPTIONS);
          await applyLocation(currentLocation);
        } catch (currentError) {
          console.warn('[useLocation] Lokasi saat ini belum tersedia:', currentError);
          if (isMounted && !lastKnownLocation) {
            setErrorMsg('Lokasi belum tersedia. Pastikan GPS aktif, beri izin lokasi, lalu coba lagi di area dengan sinyal yang lebih baik.');
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('[useLocation] Error:', error);
        if (isMounted) {
          setErrorMsg('Gagal mendapatkan lokasi: ' + error.message);
          setLoading(false);
        }
      }
    }

    startWatching();

    return () => {
      isMounted = false;
      if (locationSubscription.current) {
        locationSubscription.current.remove();
        locationSubscription.current = null;
      }
    };
  }, [retryCount]);

  const retry = () => {
    setRetryCount((count) => count + 1);
  };

  return { location, errorMsg, loading, retry };
}
