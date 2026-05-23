import { Alert } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as MediaLibrary from 'expo-media-library';
import { isExpoGoAndroid, loadNotifications } from './notificationEnvironment';

function showPermissionDeniedAlert(featureName) {
  Alert.alert(
    'Izin Diperlukan',
    `SocialApp membutuhkan izin ${featureName}. Silakan aktifkan di Pengaturan > Aplikasi > SocialApp.`,
    [{ text: 'OK' }]
  );
}

function confirmPermissionRequest(featureName, reason) {
  return new Promise((resolve) => {
    Alert.alert(
      `Izinkan ${featureName}?`,
      reason,
      [
        { text: 'Batal', style: 'cancel', onPress: () => resolve(false) },
        { text: 'Lanjut', onPress: () => resolve(true) },
      ]
    );
  });
}

export async function requestCameraPermission() {
  try {
    const existing = await Camera.getCameraPermissionsAsync();
    if (existing.status === 'granted') return true;

    const shouldRequest = await confirmPermissionRequest(
      'Kamera',
      'SocialApp memakai kamera untuk mengambil foto post langsung dari perangkat.'
    );
    if (!shouldRequest) return false;

    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== 'granted') { showPermissionDeniedAlert('Kamera'); return false; }
    return true;
  } catch (e) { console.error('[Permissions] Camera:', e); return false; }
}

export async function requestMediaLibraryPermission() {
  try {
    const existing = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (existing.status === 'granted') return true;

    const shouldRequest = await confirmPermissionRequest(
      'Galeri Foto',
      'SocialApp memakai galeri untuk memilih foto yang akan diproses dan diposting.'
    );
    if (!shouldRequest) return false;

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { showPermissionDeniedAlert('Galeri Foto'); return false; }
    return true;
  } catch (e) { console.error('[Permissions] MediaLibrary:', e); return false; }
}

export async function requestSaveMediaPermission() {
  try {
    const existing = await MediaLibrary.getPermissionsAsync();
    if (existing.status === 'granted') return true;

    const shouldRequest = await confirmPermissionRequest(
      'Simpan ke Galeri',
      'SocialApp membutuhkan izin ini untuk menyimpan foto ke album SocialApp di galeri perangkat.'
    );
    if (!shouldRequest) return false;

    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') { showPermissionDeniedAlert('Simpan ke Galeri'); return false; }
    return true;
  } catch (e) { console.error('[Permissions] SaveMedia:', e); return false; }
}

export async function requestLocationPermission() {
  try {
    const existing = await Location.getForegroundPermissionsAsync();
    if (existing.status === 'granted') return true;

    const shouldRequest = await confirmPermissionRequest(
      'Lokasi GPS',
      'SocialApp memakai koordinat GPS perangkat untuk menampilkan posisi Anda dan pengguna terdekat di peta.'
    );
    if (!shouldRequest) return false;

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') { showPermissionDeniedAlert('Lokasi (GPS)'); return false; }
    return true;
  } catch (e) { console.error('[Permissions] Location:', e); return false; }
}

export async function requestNotificationPermission() {
  try {
    const Notifications = await loadNotifications([
      'getPermissionsAsync',
      'requestPermissionsAsync',
    ]);
    if (!Notifications) return false;

    const { status: existing } = await Notifications.getPermissionsAsync();
    if (existing === 'granted') return true;

    const shouldRequest = await confirmPermissionRequest(
      'Notifikasi',
      isExpoGoAndroid()
        ? 'SocialApp memakai notifikasi lokal untuk simulasi pesan. Push remote perlu development build di Expo SDK 55.'
        : 'SocialApp memakai notifikasi untuk mengirim simulasi pesan dan menerima update dari aplikasi.'
    );
    if (!shouldRequest) return false;

    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') { showPermissionDeniedAlert('Notifikasi'); return false; }
    return true;
  } catch { return false; }
}
