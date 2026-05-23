# SocialApp – SDK 55 Fix Guide

## ❗ Masalah yang Diperbaiki

| Masalah | Penyebab | Fix |
|---------|----------|-----|
| App tidak bisa buka di Android | Expo Go versi SDK 55, tapi `package.json` SDK 51 | Update semua versi package ke SDK 55 |
| Tampil halaman web biasa | `newArchEnabled` belum ada, routing config | Tambah `newArchEnabled: true` di app.json |
| `ImageManipulator` error | SDK 55 pakai new fluent API | Update `imageTools.js` |
| `mediaTypes` deprecated | SDK 55 pakai array string | Ganti ke `mediaTypes: ['images']` |

---

## ✅ Langkah Fix (jalankan berurutan)

```bash
# 1. Masuk ke folder project
cd SocialApp

# 2. Hapus node_modules dan lock file lama
rm -rf node_modules package-lock.json
# Windows: rmdir /s /q node_modules && del package-lock.json

# 3. Copy file-file yang sudah diupdate:
#    - package.json   (versi SDK 55)
#    - app.json       (sesuai config kamu)
#    - babel.config.js
#    - src/utils/imageTools.js     (ImageManipulator API baru)
#    - src/utils/permissions.js
#    - src/screens/CameraScreen.js

# 4. Install ulang dependencies
npm install

# 5. Clear cache Expo
npx expo start --clear

# 6. Scan QR dengan Expo Go di Android
```

---

## 📦 Versi Package SDK 55

```json
"expo": "~55.0.0",
"react": "19.0.0",
"react-native": "0.79.2",
"expo-camera": "~55.0.18",
"expo-image-picker": "~55.0.20",
"expo-image-manipulator": "~13.0.8",
"expo-location": "~55.1.10",
"react-native-maps": "1.20.1",
"expo-notifications": "~55.0.23",
"expo-device": "~7.0.3",
"expo-file-system": "~55.0.21",
"expo-sharing": "~55.0.19",
"expo-media-library": "~55.0.17",
"react-native-screens": "~4.4.0",
"react-native-safe-area-context": "5.4.0",
"react-native-gesture-handler": "~2.24.0",
"react-native-reanimated": "~3.17.4",
"expo-linking": "~7.1.5"
```

---

## ⚠️ Breaking Changes SDK 55 yang Diperbaiki

### 1. `expo-image-manipulator`
```js
// ❌ Lama (SDK 51)
import * as ImageManipulator from 'expo-image-manipulator';
await ImageManipulator.manipulateAsync(uri, actions, options);

// ✅ Baru (SDK 55)
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
const context = ImageManipulator.manipulate(uri);
context.resize({ width: 800 });
const image = await context.renderAsync();
const result = await image.saveAsync({ compress: 0.75, format: SaveFormat.JPEG });
```

### 2. `expo-image-picker` mediaTypes
```js
// ❌ Lama (SDK 51)
mediaTypes: ImagePicker.MediaTypeOptions.Images

// ✅ Baru (SDK 55)
mediaTypes: ['images']
```

### 3. `app.json` — New Architecture
```json
// Tambahkan di root expo object:
"newArchEnabled": true
```

### 4. `react-native-maps` versi
```
// SDK 51: 1.14.0
// SDK 55: 1.20.1
```

---

## 🔍 Cara Verifikasi SDK Expo Go

Buka Expo Go di HP → tap ikon gear ⚙️ → lihat versi SDK.
Harus sama dengan versi `expo` di `package.json`.

Jika beda versi, ada 2 opsi:
1. Update Expo Go di Play Store ke versi terbaru
2. Atau gunakan `expo-dev-client` (development build)

