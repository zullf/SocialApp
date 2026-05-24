import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView,
         ActivityIndicator, Alert, Dimensions, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { pickAndProcessImage } from '../utils/imageTools';
import { saveImageToGallery } from '../utils/mediaLibrary';
import { shareFile } from '../utils/sharing';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const COLORS = {
  primary: '#6C63FF',
  background: '#FFFFFF',
  surface: '#F4F6FB',
  card: '#FFFFFF',
  text: '#151827',
  textMuted: '#667085',
  accent: '#FF6584',
  success: '#12B76A',
  border: 'rgba(15, 23, 42, 0.08)',
};

const PROFILE_STATS = [
  { label: 'Post', value: '48' },
  { label: 'Followers', value: '1.2K' },
  { label: 'Following', value: '384' },
];

export default function ProfileScreen() {
  const [selectedImage, setSelectedImage] = useState(null);   
  const [processedImage, setProcessedImage] = useState(null); 
  const [processing, setProcessing] = useState(false);        
  const [saving, setSaving] = useState(false);
  const [sharing, setSharing] = useState(false);

  const handlePickAndProcess = async () => {
    try {
      setProcessing(true);
      setSelectedImage(null);
      setProcessedImage(null);

      const result = await pickAndProcessImage();

      if (!result) {
        return;
      }

      setSelectedImage(result.original);
      setProcessedImage(result.processed);

      console.log('[ProfileScreen] Gambar asli:', {
        width: result.original.width,
        height: result.original.height,
        uri: result.original.uri,
      });
      console.log('[ProfileScreen] Gambar diproses:', {
        width: result.processed.width,
        height: result.processed.height,
        uri: result.processed.uri,
      });
    } catch (error) {
      console.error('[ProfileScreen] Error pick/process:', error);
      Alert.alert('Error', 'Gagal memproses gambar.');
    } finally {
      setProcessing(false);
    }
  };

  const handleSave = async () => {
    if (!processedImage?.uri) return;
    setSaving(true);
    await saveImageToGallery(processedImage.uri);
    setSaving(false);
  };

  const handleShare = async () => {
    if (!processedImage?.uri) return;
    setSharing(true);
    await shareFile(processedImage.uri);
    setSharing(false);
  };


  const handlePost = () => {
    if (!processedImage) {
      Alert.alert('Info', 'Pilih gambar terlebih dahulu.');
      return;
    }
    Alert.alert('✅ Post Berhasil', 'Foto kamu telah diposting ke feed!');
    setSelectedImage(null);
    setProcessedImage(null);
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profil</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={22} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        <View style={styles.profileSection}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>U</Text>
            </View>
            <TouchableOpacity style={styles.avatarEditBadge}>
              <Ionicons name="camera" size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <Text style={styles.profileName}>Username</Text>
          <Text style={styles.profileBio}>Mobile Developer · 📱 React Native Enthusiast</Text>
          <Text style={styles.profileLocation}>
            <Ionicons name="location-outline" size={13} /> Jakarta, Indonesia
          </Text>

          <View style={styles.statsRow}>
            {PROFILE_STATS.map((stat) => (
              <View key={stat.label} style={styles.statItem}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.editProfileButton}>
            <Text style={styles.editProfileButtonText}>Edit Profil</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <View style={styles.postSection}>
          <Text style={styles.sectionTitle}>📤 Buat Post Baru</Text>
          <Text style={styles.sectionSubtitle}>
            Pilih foto dari galeri → auto crop 1:1 → resize 800px → kompres
          </Text>

          <TouchableOpacity
            style={styles.pickButton}
            onPress={handlePickAndProcess}
            disabled={processing}
          >
            {processing ? (
              <ActivityIndicator size="small" color={COLORS.text} />
            ) : (
              <Ionicons name="images-outline" size={22} color={COLORS.text} />
            )}
            <Text style={styles.pickButtonText}>
              {processing ? 'Memproses...' : 'Pilih dari Galeri'}
            </Text>
          </TouchableOpacity>

          {processedImage && (
            <View style={styles.previewSection}>
              <Image
                source={{ uri: processedImage.uri }}
                style={styles.previewImage}
                resizeMode="cover"
              />

              <View style={styles.imageInfoBox}>
                <View style={styles.imageInfoRow}>
                  <Ionicons name="information-circle-outline" size={16} color={COLORS.primary} />
                  <Text style={styles.imageInfoTitle}>Detail Gambar</Text>
                </View>
                <View style={styles.imageInfoGrid}>
                  <View style={styles.imageInfoItem}>
                    <Text style={styles.imageInfoLabel}>Asli</Text>
                    <Text style={styles.imageInfoValue}>
                      {selectedImage?.width} × {selectedImage?.height}
                    </Text>
                  </View>
                  <View style={styles.imageInfoDivider} />
                  <View style={styles.imageInfoItem}>
                    <Text style={styles.imageInfoLabel}>Setelah Proses</Text>
                    <Text style={styles.imageInfoValue}>
                      {processedImage.width} × {processedImage.height}
                    </Text>
                  </View>
                  <View style={styles.imageInfoDivider} />
                  <View style={styles.imageInfoItem}>
                    <Text style={styles.imageInfoLabel}>Format</Text>
                    <Text style={styles.imageInfoValue}>JPEG · 75%</Text>
                  </View>
                </View>
              </View>

              <View style={styles.previewActions}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator size="small" color={COLORS.success} />
                  ) : (
                    <Ionicons name="bookmark-outline" size={20} color={COLORS.success} />
                  )}
                  <Text style={[styles.actionBtnText, { color: COLORS.success }]}>Simpan</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={handleShare}
                  disabled={sharing}
                >
                  {sharing ? (
                    <ActivityIndicator size="small" color={COLORS.primary} />
                  ) : (
                    <Ionicons name="share-outline" size={20} color={COLORS.primary} />
                  )}
                  <Text style={[styles.actionBtnText, { color: COLORS.primary }]}>Share</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.postButton} onPress={handlePost}>
                  <Ionicons name="paper-plane" size={18} color={COLORS.background} />
                  <Text style={styles.postButtonText}>Post</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '700',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(108,99,255,0.3)',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '800',
  },
  avatarEditBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  profileName: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  profileBio: {
    color: COLORS.textMuted,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 4,
  },
  profileLocation: {
    color: COLORS.textMuted,
    fontSize: 13,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    width: '100%',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '800',
  },
  statLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  editProfileButton: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    paddingHorizontal: 32,
    paddingVertical: 10,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  editProfileButtonText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 20,
    marginVertical: 8,
  },
  postSection: {
    padding: 20,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionSubtitle: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginBottom: 16,
    lineHeight: 18,
  },
  pickButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    paddingVertical: 16,
    borderRadius: 14,
    gap: 10,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  pickButtonText: {
    color: COLORS.text,
    fontWeight: '600',
    fontSize: 15,
  },
  previewSection: {
    marginTop: 20,
  },
  previewImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
    marginBottom: 12,
  },
  imageInfoBox: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  imageInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  imageInfoTitle: {
    color: COLORS.text,
    fontWeight: '600',
    fontSize: 14,
  },
  imageInfoGrid: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageInfoItem: {
    flex: 1,
    alignItems: 'center',
  },
  imageInfoDivider: {
    width: 1,
    height: 32,
    backgroundColor: COLORS.border,
  },
  imageInfoLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginBottom: 3,
  },
  imageInfoValue: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '600',
  },
  previewActions: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionBtnText: {
    fontWeight: '600',
    fontSize: 14,
  },
  postButton: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  postButtonText: {
    color: COLORS.background,
    fontWeight: '700',
    fontSize: 14,
  },
});
