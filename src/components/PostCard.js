import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { saveImageToGallery } from '../utils/mediaLibrary';
import { shareFile } from '../utils/sharing';

const COLORS = { primary: '#6C63FF', surface: '#F4F6FB', card: '#FFFFFF', text: '#151827', textMuted: '#667085',
  accent: '#FF6584', success: '#12B76A', border: 'rgba(15, 23, 42, 0.08)', };

export default function PostCard({ post }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  const [saving, setSaving] = useState(false);   
  const [sharing, setSharing] = useState(false); 

  const handleLike = () => {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleSave = async () => {
    if (!post.imageUri) {
      Alert.alert('Gagal', 'Tidak ada gambar untuk disimpan.');
      return;
    }
    setSaving(true);
    await saveImageToGallery(post.imageUri);
    setSaving(false);
  };

  const handleShare = async () => {
    if (!post.imageUri) {
      Alert.alert('Gagal', 'Tidak ada gambar untuk dibagikan.');
      return;
    }
    setSharing(true);
    await shareFile(post.imageUri);
    setSharing(false);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {post.username ? post.username[0].toUpperCase() : '?'}
            </Text>
          </View>
          {post.isOnline && <View style={styles.onlineDot} />}
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.username}>{post.username || 'Unknown User'}</Text>
          <Text style={styles.timestamp}>{post.timestamp || 'Baru saja'}</Text>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.textMuted} />
        </TouchableOpacity>
      </View>

      {post.imageUri ? (
        <Image
          source={{ uri: post.imageUri }}
          style={styles.postImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Ionicons name="image-outline" size={48} color={COLORS.textMuted} />
          <Text style={styles.imagePlaceholderText}>Tidak ada gambar</Text>
        </View>
      )}

      {post.caption ? (
        <View style={styles.captionContainer}>
          <Text style={styles.caption}>
            <Text style={styles.username}>{post.username} </Text>
            {post.caption}
          </Text>
        </View>
      ) : null}

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
          <Ionicons
            name={liked ? 'heart' : 'heart-outline'}
            size={24}
            color={liked ? COLORS.accent : COLORS.textMuted}
          />
          <Text style={[styles.actionText, liked && styles.actionTextActive]}>
            {likeCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={22} color={COLORS.textMuted} />
          <Text style={styles.actionText}>{post.comments || 0}</Text>
        </TouchableOpacity>

        <View style={styles.spacer} />

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleShare}
          disabled={sharing}
        >
          {sharing ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <Ionicons name="share-outline" size={22} color={COLORS.textMuted} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <Ionicons name="bookmark-outline" size={22} color={COLORS.textMuted} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.success,
    borderWidth: 1.5,
    borderColor: COLORS.card,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    color: COLORS.text,
    fontWeight: '700',
    fontSize: 14,
  },
  timestamp: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 1,
  },
  moreButton: {
    padding: 4,
  },
  postImage: {
    width: '100%',
    aspectRatio: 1,
  },
  imagePlaceholder: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  imagePlaceholderText: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  captionContainer: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 4,
  },
  caption: {
    color: COLORS.textMuted,
    fontSize: 13,
    lineHeight: 19,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 4,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 4,
    gap: 5,
    minWidth: 40,
    justifyContent: 'center',
  },
  actionText: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '500',
  },
  actionTextActive: {
    color: COLORS.accent,
  },
  spacer: {
    flex: 1,
  },
});
