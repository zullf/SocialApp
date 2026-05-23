import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  ActivityIndicator, Image, Dimensions, Alert, Animated,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const COLORS = {
  primary: '#6C63FF', background: '#0F0F1A', surface: '#1A1A2E',
  text: '#E8E8F0', textMuted: '#6B6B8A', accent: '#FF6584', white: '#FFFFFF',
};

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState('back');
  const [flash, setFlash] = useState('off');
  const [countdown, setCountdown] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);

  const cameraRef = useRef(null);
  const countdownInterval = useRef(null);
  const countdownAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    return () => {
      if (countdownInterval.current) clearInterval(countdownInterval.current);
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      return () => {
        if (countdownInterval.current) {
          clearInterval(countdownInterval.current);
          setCountdown(null);
        }
      };
    }, [])
  );

  const animateCountdown = () => {
    countdownAnim.setValue(2);
    Animated.spring(countdownAnim, { toValue: 1, friction: 4, useNativeDriver: true }).start();
  };

  const startCountdownAndCapture = () => {
    if (isTakingPhoto || countdown !== null) return;
    let count = 3;
    setCountdown(count);
    animateCountdown();

    countdownInterval.current = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
        animateCountdown();
      } else {
        clearInterval(countdownInterval.current);
        setCountdown(null);
        takePhoto();
      }
    }, 1000);
  };

  const takePhoto = async () => {
    if (!cameraRef.current) return;
    try {
      setIsTakingPhoto(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });
      setCapturedPhoto(photo);
    } catch (error) {
      console.error('[CameraScreen] Gagal ambil foto:', error);
      Alert.alert('Gagal', 'Tidak bisa mengambil foto. Coba lagi.');
    } finally {
      setIsTakingPhoto(false);
    }
  };

  const toggleFacing = () => setFacing((p) => (p === 'back' ? 'front' : 'back'));
  const toggleFlash = () => setFlash((p) => (p === 'off' ? 'on' : 'off'));
  const retakePhoto = () => setCapturedPhoto(null);
  const handleRequestCameraPermission = () => {
    Alert.alert(
      'Izinkan Kamera?',
      'SocialApp membutuhkan izin kamera untuk membuka CameraView dan mengambil foto post.',
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Lanjut', onPress: requestPermission },
      ]
    );
  };

  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Ionicons name="camera-outline" size={80} color={COLORS.textMuted} />
          <Text style={styles.permissionTitle}>Akses Kamera Diperlukan</Text>
          <Text style={styles.permissionDesc}>
            SocialApp membutuhkan izin kamera untuk mengambil foto.
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={handleRequestCameraPermission}>
            <Text style={styles.permissionButtonText}>Izinkan Akses Kamera</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (capturedPhoto) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.previewContainer}>
          <Text style={styles.previewTitle}>📸 Hasil Foto</Text>
          <Image
            source={{ uri: capturedPhoto.uri }}
            style={styles.previewImage}
            resizeMode="cover"
          />
          <View style={styles.previewInfo}>
            <Text style={styles.previewInfoText}>
              {capturedPhoto.width} × {capturedPhoto.height} px
            </Text>
          </View>
          <View style={styles.previewActions}>
            <TouchableOpacity style={styles.retakeButton} onPress={retakePhoto}>
              <Ionicons name="camera-reverse-outline" size={20} color={COLORS.text} />
              <Text style={styles.retakeButtonText}>Ambil Ulang</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.usePhotoButton}
              onPress={() => Alert.alert('✅', 'Foto siap digunakan!')}
            >
              <Ionicons name="checkmark-circle" size={20} color={COLORS.background} />
              <Text style={styles.usePhotoButtonText}>Gunakan Foto</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.screenTitle}>Kamera</Text>
        <TouchableOpacity style={styles.topButton} onPress={toggleFlash}>
          <Ionicons
            name={flash === 'on' ? 'flash' : 'flash-off'}
            size={22}
            color={flash === 'on' ? '#FFD166' : COLORS.textMuted}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
          flash={flash}
        >
          <View style={styles.cameraOverlay}>
            <View style={styles.grid}>
              {[0, 1, 2].map((row) => (
                <View key={row} style={styles.gridRow}>
                  {[0, 1, 2].map((col) => (
                    <View
                      key={col}
                      style={[
                        styles.gridCell,
                        col > 0 && styles.gridCellBorderLeft,
                        row > 0 && styles.gridCellBorderTop,
                      ]}
                    />
                  ))}
                </View>
              ))}
            </View>

            {countdown !== null && (
              <View style={styles.countdownOverlay}>
                <Animated.Text
                  style={[styles.countdownText, { transform: [{ scale: countdownAnim }] }]}
                >
                  {countdown}
                </Animated.Text>
              </View>
            )}
          </View>
        </CameraView>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.sideButton} onPress={toggleFacing}>
          <Ionicons name="camera-reverse-outline" size={28} color={COLORS.text} />
          <Text style={styles.sideButtonLabel}>Flip</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.shutterButton, (isTakingPhoto || countdown !== null) && styles.shutterDisabled]}
          onPress={startCountdownAndCapture}
          disabled={isTakingPhoto || countdown !== null}
        >
          {isTakingPhoto
            ? <ActivityIndicator size="small" color={COLORS.primary} />
            : <View style={styles.shutterInner} />
          }
        </TouchableOpacity>

        <TouchableOpacity style={styles.sideButton}>
          <Ionicons name="images-outline" size={28} color={COLORS.textMuted} />
          <Text style={[styles.sideButtonLabel, { color: COLORS.textMuted }]}>Galeri</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.hint}>Tekan tombol untuk countdown 3-2-1 📸</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14,
  },
  screenTitle: { color: COLORS.text, fontSize: 20, fontWeight: '700' },
  topButton: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.surface,
    alignItems: 'center', justifyContent: 'center',
  },
  cameraContainer: {
    marginHorizontal: 16, borderRadius: 20, overflow: 'hidden', aspectRatio: 3 / 4,
  },
  camera: { flex: 1 },
  cameraOverlay: { flex: 1 },
  grid: { flex: 1 },
  gridRow: { flex: 1, flexDirection: 'row' },
  gridCell: { flex: 1 },
  gridCellBorderLeft: { borderLeftWidth: 0.5, borderColor: 'rgba(255,255,255,0.15)' },
  gridCellBorderTop: { borderTopWidth: 0.5, borderColor: 'rgba(255,255,255,0.15)' },
  countdownOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)',
  },
  countdownText: {
    fontSize: 120, fontWeight: '900', color: COLORS.white,
    textShadowColor: 'rgba(108,99,255,0.8)', textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  controls: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 40, paddingTop: 24, paddingBottom: 8,
  },
  shutterButton: {
    width: 72, height: 72, borderRadius: 36, borderWidth: 4, borderColor: COLORS.text,
    alignItems: 'center', justifyContent: 'center',
  },
  shutterDisabled: { borderColor: COLORS.textMuted },
  shutterInner: { width: 54, height: 54, borderRadius: 27, backgroundColor: COLORS.white },
  sideButton: { alignItems: 'center', gap: 4 },
  sideButtonLabel: { color: COLORS.text, fontSize: 11, fontWeight: '500' },
  hint: { textAlign: 'center', color: COLORS.textMuted, fontSize: 12, paddingBottom: 12 },
  permissionContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 16 },
  permissionTitle: { color: COLORS.text, fontSize: 22, fontWeight: '700', textAlign: 'center' },
  permissionDesc: { color: COLORS.textMuted, fontSize: 15, textAlign: 'center', lineHeight: 22 },
  permissionButton: { backgroundColor: COLORS.primary, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 14 },
  permissionButtonText: { color: COLORS.text, fontSize: 16, fontWeight: '700' },
  previewContainer: { flex: 1, padding: 20, alignItems: 'center' },
  previewTitle: { color: COLORS.text, fontSize: 20, fontWeight: '700', marginBottom: 16, alignSelf: 'flex-start' },
  previewImage: { width: SCREEN_WIDTH - 40, aspectRatio: 1, borderRadius: 16 },
  previewInfo: {
    marginTop: 12, backgroundColor: COLORS.surface,
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8,
  },
  previewInfoText: { color: COLORS.textMuted, fontSize: 13 },
  previewActions: { flexDirection: 'row', gap: 12, marginTop: 20, width: '100%' },
  retakeButton: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.surface, paddingVertical: 14, borderRadius: 14, gap: 8,
    borderWidth: 1, borderColor: 'rgba(108,99,255,0.2)',
  },
  retakeButtonText: { color: COLORS.text, fontWeight: '600' },
  usePhotoButton: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.primary, paddingVertical: 14, borderRadius: 14, gap: 8,
  },
  usePhotoButtonText: { color: COLORS.background, fontWeight: '700' },
});
