import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet,
        ScrollView, TextInput, ActivityIndicator, Alert,} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { pickAndProcessImage } from '../utils/imageTools';
import { saveImageToGallery } from '../utils/mediaLibrary';
import { shareFile } from '../utils/sharing';

const COLORS = {
  primary: '#6C63FF',
  background: '#FFFFFF',
  surface: '#F4F6FB',
  card: '#FFFFFF',
  text: '#151827',
  textMuted: '#667085',
  accent: '#FF6584',
  border: 'rgba(15, 23, 42, 0.08)',
};

export default function PostScreen({ navigation }) {
  const [processedImage, setProcessedImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [processing, setProcessing] = useState(false);
  const [posting, setPosting] = useState(false);

  const handlePick = async () => {
    setProcessing(true);
    const result = await pickAndProcessImage();
    if (result) {
      setProcessedImage(result.processed);
    }
    setProcessing(false);
  };

  const handlePost = async () => {
    if (!processedImage) {
      Alert.alert('Info', 'Pilih gambar terlebih dahulu.');
      return;
    }
    setPosting(true);
    await new Promise((res) => setTimeout(res, 1500));
    setPosting(false);
    Alert.alert('✅', 'Post berhasil dipublikasikan!');
    setProcessedImage(null);
    setCaption('');
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Buat Post</Text>
        </View>

        <TouchableOpacity style={styles.pickArea} onPress={handlePick} disabled={processing}>
          {processing ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : processedImage ? (
            <Image source={{ uri: processedImage.uri }} style={styles.preview} />
          ) : (
            <View style={styles.pickPlaceholder}>
              <Ionicons name="add-circle-outline" size={56} color={COLORS.primary} />
              <Text style={styles.pickText}>Pilih Foto dari Galeri</Text>
              <Text style={styles.pickSubtext}>Crop 1:1 • Resize 800px • Kompres 75%</Text>
            </View>
          )}
        </TouchableOpacity>

        {processedImage && (
          <View style={styles.form}>
            <TextInput
              style={styles.captionInput}
              placeholder="Tulis caption..."
              placeholderTextColor={COLORS.textMuted}
              value={caption}
              onChangeText={setCaption}
              multiline
              maxLength={500}
            />
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={() => saveImageToGallery(processedImage.uri)}
              >
                <Ionicons name="bookmark-outline" size={18} color={COLORS.text} />
                <Text style={styles.saveBtnText}>Simpan</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.shareBtn}
                onPress={() => shareFile(processedImage.uri)}
              >
                <Ionicons name="share-outline" size={18} color={COLORS.text} />
                <Text style={styles.shareBtnText}>Share</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.postBtn} onPress={handlePost} disabled={posting}>
                {posting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Ionicons name="paper-plane" size={18} color="#fff" />
                    <Text style={styles.postBtnText}>Post</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: 20, paddingBottom: 8 },
  title: { color: COLORS.text, fontSize: 22, fontWeight: '800' },
  pickArea: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    aspectRatio: 1,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  pickPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 },
  pickText: { color: COLORS.text, fontWeight: '600', fontSize: 16 },
  pickSubtext: { color: COLORS.textMuted, fontSize: 12 },
  preview: { width: '100%', height: '100%' },
  form: { padding: 16 },
  captionInput: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    color: COLORS.text,
    fontSize: 15,
    minHeight: 80,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
    textAlignVertical: 'top',
  },
  actions: { flexDirection: 'row', gap: 10 },
  saveBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.surface, paddingVertical: 12, borderRadius: 12, gap: 6,
    borderWidth: 1, borderColor: COLORS.border,
  },
  saveBtnText: { color: COLORS.text, fontWeight: '600' },
  shareBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.surface, paddingVertical: 12, borderRadius: 12, gap: 6,
    borderWidth: 1, borderColor: COLORS.border,
  },
  shareBtnText: { color: COLORS.text, fontWeight: '600' },
  postBtn: {
    flex: 1.2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.primary, paddingVertical: 12, borderRadius: 12, gap: 6,
  },
  postBtnText: { color: '#fff', fontWeight: '700' },
});
