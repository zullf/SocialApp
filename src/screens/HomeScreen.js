import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import PostCard from '../components/PostCard';

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

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const renderHeader = () => (
    <View style={styles.feedHeader}>
      <Text style={styles.sectionTitle}>For You</Text>
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
  feedHeader: {
    paddingTop: 8,
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
