import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Marker, Callout } from 'react-native-maps';

const COLORS = {
  primary: '#6C63FF',
  accent: '#FF6584',
  success: '#12B76A',
  warning: '#FFD166',
  text: '#151827',
  surface: '#F4F6FB',
  card: '#FFFFFF',
};

const AVATAR_COLORS = [COLORS.accent, COLORS.success, COLORS.warning, COLORS.primary];

export default function NearbyUserMarker({ user, index }) {
  const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];

  return (
    <Marker
      coordinate={{
        latitude: user.latitude,
        longitude: user.longitude,
      }}
      title={user.name}
      description={`${user.distance} • ${user.status}`}
    >
      <View style={styles.markerContainer}>
        <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
          <Text style={styles.avatarText}>
            {user.name ? user.name[0].toUpperCase() : '?'}
          </Text>
        </View>
        <View style={[styles.markerTail, { borderTopColor: avatarColor }]} />
      </View>

      <Callout style={styles.callout}>
        <View style={styles.calloutContent}>
          <Text style={styles.calloutName}>{user.name}</Text>
          <Text style={styles.calloutDetail}>📍 {user.distance}</Text>
          <Text style={styles.calloutDetail}>💼 {user.status}</Text>
          {user.lastSeen && (
            <Text style={styles.calloutTime}>Terakhir aktif: {user.lastSeen}</Text>
          )}
        </View>
      </Callout>
    </Marker>
  );
}

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  markerTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -1,
  },
  callout: {
    borderRadius: 12,
    overflow: 'hidden',
    minWidth: 160,
  },
  calloutContent: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
  },
  calloutName: {
    color: '#151827',
    fontWeight: '700',
    fontSize: 15,
    marginBottom: 4,
  },
  calloutDetail: {
    color: '#667085',
    fontSize: 13,
    marginTop: 2,
  },
  calloutTime: {
    color: '#667085',
    fontSize: 11,
    marginTop: 6,
    fontStyle: 'italic',
  },
});
