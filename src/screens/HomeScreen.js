import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import PostCard from '../components/PostCard';
import { useNotifications } from '../context/NotificationContext';

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

const DUMMY_POSTS = [
  {
    id: '1',
    username: 'andi_pratama',
    imageUri: 'https://picsum.photos/seed/post1/800/800',
    caption: 'Sunset di pantai Kuta yang luar biasa indah! #Bali #Travel #Photography',
    likes: 142,
    comments: 23,
    timestamp: '2 jam lalu',
    isOnline: true,
  },
  {
    id: '2',
    username: 'sari_dewi',
    imageUri: 'https://picsum.photos/seed/post2/800/800',
    caption: 'Kopi pagi sambil nugas. Produktif mode: ON #CoffeeTime #WorkFromHome',
    likes: 89,
    comments: 11,
    timestamp: '4 jam lalu',
    isOnline: false,
  },
  {
    id: '3',
    username: 'budi_setiawan',
    imageUri: 'https://picsum.photos/seed/post3/800/800',
    caption: 'Hiking ke Gunung Rinjani, worth it banget! #Adventure #Hiking #NTB',
    likes: 231,
    comments: 45,
    timestamp: '8 jam lalu',
    isOnline: true,
  },
  {
    id: '4',
    username: 'maya_kusuma',
    imageUri: 'https://picsum.photos/seed/post4/800/800',
    caption: 'Weekend getaway ke Yogyakarta. Candi Borobudur selalu memukau.',
    likes: 178,
    comments: 32,
    timestamp: '1 hari lalu',
    isOnline: false,
  },
  {
    id: '5',
    username: 'rizky_hakim',
    imageUri: 'https://picsum.photos/seed/post5/800/800',
    caption: 'Street food hunting di kawasan Pecinan. Yummy! #FoodPhotography',
    likes: 95,
    comments: 18,
    timestamp: '1 hari lalu',
    isOnline: true,
  },
];

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const { notificationStatus, sendTestNotification } = useNotifications();

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const renderHeader = () => {
    const notificationLabel = notificationStatus === 'unavailable'
      ? 'Perlu development build di Android'
      : notificationStatus === 'granted'
        ? 'Local notification aktif'
        : 'Minta izin saat tombol ditekan';

    return (
      <View style={styles.feedHeader}>
        <View style={styles.notificationPanel}>
          <View style={styles.notificationInfo}>
            <View style={styles.notificationIcon}>
              <Ionicons name="notifications-outline" size={20} color="#FFFFFF" />
            </View>
            <View style={styles.notificationTextWrap}>
              <Text style={styles.notificationTitle}>Local Notification</Text>
              <Text style={styles.notificationToken} numberOfLines={1}>
                {notificationLabel}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton} onPress={sendTestNotification}>
            <Ionicons name="send" size={16} color={COLORS.background} />
            <Text style={styles.notificationButtonText}>Kirim Test Notif</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>For You</Text>
      </View>
    );
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
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
    backgroundColor: COLORS.background,
  },
  logo: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
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
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  feedContent: {
    paddingTop: 8,
    paddingBottom: 20,
  },
  feedHeader: {
    paddingTop: 8,
  },
  notificationPanel: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 14,
    backgroundColor: COLORS.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
  },
  notificationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  notificationTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 2,
  },
  notificationToken: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  notificationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 12,
    gap: 8,
  },
  notificationButtonText: {
    color: COLORS.background,
    fontSize: 14,
    fontWeight: '800',
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
