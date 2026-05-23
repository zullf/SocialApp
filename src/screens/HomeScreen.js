import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Alert, ActivityIndicator, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import PostCard from '../components/PostCard';
import { useNotifications } from '../hooks/useNotifications';

const COLORS = {
  primary: '#6C63FF',
  background: '#0F0F1A',
  surface: '#1A1A2E',
  card: '#16213E',
  text: '#E8E8F0',
  textMuted: '#6B6B8A',
  accent: '#FF6584',
  success: '#4ECDC4',
  border: 'rgba(108, 99, 255, 0.15)',
};

const DUMMY_POSTS = [
  {
    id: '1',
    username: 'andi_pratama',
    imageUri: 'https://picsum.photos/seed/post1/800/800',
    caption: 'Sunset di pantai Kuta yang luar biasa indah! 🌅 #Bali #Travel #Photography',
    likes: 142,
    comments: 23,
    timestamp: '2 jam lalu',
    isOnline: true,
  },
  {
    id: '2',
    username: 'sari_dewi',
    imageUri: 'https://picsum.photos/seed/post2/800/800',
    caption: 'Kopi pagi sambil nugas. Produktif mode: ON ☕ #CoffeeTime #WorkFromHome',
    likes: 89,
    comments: 11,
    timestamp: '4 jam lalu',
    isOnline: false,
  },
  {
    id: '3',
    username: 'budi_setiawan',
    imageUri: 'https://picsum.photos/seed/post3/800/800',
    caption: 'Hiking ke Gunung Rinjani, worth it banget! 🏔️ #Adventure #Hiking #NTB',
    likes: 231,
    comments: 45,
    timestamp: '8 jam lalu',
    isOnline: true,
  },
  {
    id: '4',
    username: 'maya_kusuma',
    imageUri: 'https://picsum.photos/seed/post4/800/800',
    caption: 'Weekend getaway ke Yogyakarta 🏯 Candi Borobudur selalu memukau.',
    likes: 178,
    comments: 32,
    timestamp: '1 hari lalu',
    isOnline: false,
  },
  {
    id: '5',
    username: 'rizky_hakim',
    imageUri: 'https://picsum.photos/seed/post5/800/800',
    caption: 'Street food hunting di kawasan Pecinan. Yummy! 🍜 #FoodPhotography',
    likes: 95,
    comments: 18,
    timestamp: '1 hari lalu',
    isOnline: true,
  },
];

export default function HomeScreen() {
  const {
    sendTestNotification,
    loading: notifLoading,
    expoPushToken,
    available: notificationsAvailable,
  } = useNotifications();
  const [refreshing, setRefreshing] = useState(false);

  const handleSendTestNotif = async () => {
    const senders = ['Andi Pratama', 'Sari Dewi', 'Budi Setiawan', 'Maya Kusuma'];
    const messages = [
      'Hei! Lihat post terbaru kamu keren banget!',
      'Kapan kita jalan-jalan lagi nih? 😄',
      'Foto kamu yang tadi bagus banget!',
      'Check out story baruku ya 📸',
    ];
    const randomIdx = Math.floor(Math.random() * senders.length);

    const success = await sendTestNotification(
      senders[randomIdx],
      messages[randomIdx],
      3 
    );

    if (success) {
      Alert.alert(
        '✅ Notifikasi Dijadwalkan',
        'Notifikasi simulasi chat akan muncul dalam 3 detik.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const renderHeader = () => (
    <View>
      <View style={styles.notifBanner}>
        <View style={styles.notifInfo}>
          <Ionicons name="notifications" size={18} color={COLORS.primary} />
          <Text style={styles.notifText}>
            {notificationsAvailable
              ? (expoPushToken ? 'Push token aktif' : 'Notifikasi lokal aktif')
              : 'Notifikasi penuh perlu development build'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.notifButton}
          onPress={handleSendTestNotif}
          disabled={notifLoading}
        >
          {notifLoading ? (
            <ActivityIndicator size="small" color={COLORS.text} />
          ) : (
            <>
              <Ionicons name="send" size={14} color={COLORS.text} />
              <Text style={styles.notifButtonText}>Test Notif</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>For You ✨</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>Social<Text style={styles.logoAccent}>App</Text></Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="heart-outline" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="chatbubble-outline" size={24} color={COLORS.text} />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={DUMMY_POSTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostCard post={item} />}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.feedContent}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="images-outline" size={64} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>Belum ada post</Text>
          </View>
        }
      />
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
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  logo: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  logoAccent: {
    color: COLORS.primary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: COLORS.text,
    fontSize: 9,
    fontWeight: '800',
  },
  feedContent: {
    paddingTop: 8,
    paddingBottom: 20,
  },
  notifBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginBottom: 16,
    marginTop: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  notifInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  notifText: {
    color: COLORS.textMuted,
    fontSize: 13,
    flex: 1,
  },
  notifButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    gap: 5,
  },
  notifButtonText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '700',
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '700',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 16,
  },
});
