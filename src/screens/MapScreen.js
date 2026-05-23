import React, { useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, TouchableOpacity, } from 'react-native';
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

import { useLocation } from '../hooks/useLocation';
import NearbyUserMarker from '../components/NearbyUserMarker';

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

function generateNearbyUsers(baseLat, baseLng) {
  return [
    {
      id: 'u1',
      name: 'Andi Pratama',
      latitude: baseLat + 0.002,
      longitude: baseLng + 0.003,
      distance: '~250m',
      status: 'Fotografer',
      lastSeen: '5 menit lalu',
    },
    {
      id: 'u2',
      name: 'Sari Dewi',
      latitude: baseLat - 0.001,
      longitude: baseLng + 0.004,
      distance: '~380m',
      status: 'Desainer',
      lastSeen: '12 menit lalu',
    },
    {
      id: 'u3',
      name: 'Budi Setiawan',
      latitude: baseLat + 0.003,
      longitude: baseLng - 0.002,
      distance: '~420m',
      status: 'Developer',
      lastSeen: '30 menit lalu',
    },
    {
      id: 'u4',
      name: 'Maya Kusuma',
      latitude: baseLat - 0.003,
      longitude: baseLng - 0.003,
      distance: '~490m',
      status: 'Content Creator',
      lastSeen: '1 jam lalu',
    },
  ];
}

export default function MapScreen() {
  const { location, errorMsg, loading, retry } = useLocation();

  const nearbyUsers = useMemo(() => {
    if (!location) return [];
    return generateNearbyUsers(location.latitude, location.longitude);
  }, [location]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Mendapatkan lokasi Anda...</Text>
          <Text style={styles.loadingSubtext}>Mohon aktifkan GPS perangkat</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (errorMsg) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Ionicons name="location-outline" size={64} color={COLORS.accent} />
          <Text style={styles.errorTitle}>Lokasi Tidak Tersedia</Text>
          <Text style={styles.errorText}>{errorMsg}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={retry}
          >
            <Ionicons name="refresh-outline" size={18} color={COLORS.text} />
            <Text style={styles.retryButtonText}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const mapRegion = {
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: 0.012,
    longitudeDelta: 0.012,
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Pengguna Terdekat</Text>
          <Text style={styles.headerSubtitle}>Radius 500m dari lokasi Anda</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countBadgeText}>{nearbyUsers.length}</Text>
          <Text style={styles.countBadgeLabel}>online</Text>
        </View>
      </View>

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={mapRegion}
          showsUserLocation={false}   
          showsMyLocationButton={false}
          mapType="standard"
          customMapStyle={darkMapStyle} 
        >
          <Circle
            center={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            radius={500}
            strokeColor="rgba(108, 99, 255, 0.6)"
            fillColor="rgba(108, 99, 255, 0.08)"
            strokeWidth={2}
          />

          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="Anda"
            description="Posisi Anda saat ini"
          >
            <View style={styles.userMarker}>
              <View style={styles.userMarkerInner}>
                <Ionicons name="person" size={18} color={COLORS.text} />
              </View>
              <View style={styles.userMarkerPulse} />
            </View>
          </Marker>

          {nearbyUsers.map((user, index) => (
            <NearbyUserMarker key={user.id} user={user} index={index} />
          ))}
        </MapView>

        <View style={styles.coordsOverlay}>
          <Ionicons name="navigate" size={12} color={COLORS.primary} />
          <Text style={styles.coordsText}>
            {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
          </Text>
        </View>
      </View>

      <View style={styles.userList}>
        <Text style={styles.userListTitle}>Pengguna Terdekat</Text>
        <View style={styles.userChips}>
          {nearbyUsers.map((user) => (
            <View key={user.id} style={styles.userChip}>
              <View style={styles.userChipAvatar}>
                <Text style={styles.userChipAvatarText}>{user.name[0]}</Text>
              </View>
              <View>
                <Text style={styles.userChipName}>{user.name}</Text>
                <Text style={styles.userChipDistance}>{user.distance}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#1a1a2e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0f0f1a' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#6b6b8a' }] },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#16213e' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#212a37' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#0d1b2a' }],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{ color: '#1a1a2e' }],
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 12,
  },
  loadingText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '600',
  },
  loadingSubtext: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  errorTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  errorText: {
    color: COLORS.textMuted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    marginTop: 8,
  },
  retryButtonText: {
    color: COLORS.text,
    fontWeight: '600',
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
  headerSubtitle: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  countBadge: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  countBadgeText: {
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: '800',
  },
  countBadgeLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '500',
  },
  mapContainer: {
    flex: 1,
    marginHorizontal: 16,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  coordsOverlay: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15,15,26,0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 5,
  },
  coordsText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontFamily: 'monospace',
  },
  userMarker: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: 50,
    height: 50,
  },
  userMarkerInner: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.text,
    zIndex: 2,
  },
  userMarkerPulse: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(108,99,255,0.25)',
    zIndex: 1,
  },
  userList: {
    padding: 16,
    paddingTop: 12,
  },
  userListTitle: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  userChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  userChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  userChipAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userChipAvatarText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '700',
  },
  userChipName: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '600',
  },
  userChipDistance: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
});
