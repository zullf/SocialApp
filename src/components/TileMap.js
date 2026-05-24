import React, { useMemo, useState } from 'react';
import { Image, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import {
  MAP_ATTRIBUTION,
  MAP_RADIUS_METERS,
  TILE_SIZE,
  createVisibleTiles,
  getMapProjection,
  metersToPixels,
} from '../utils/mapTiles';

const COLORS = {
  primary: '#6C63FF',
  textMuted: '#667085',
  accent: '#FF6584',
  success: '#12B76A',
};

export default function TileMap({ location, nearbyUsers }) {
  const [mapSize, setMapSize] = useState({ width: 0, height: 0 });

  const projection = useMemo(
    () => getMapProjection(location, mapSize),
    [location, mapSize.width, mapSize.height]
  );

  const tiles = useMemo(
    () => createVisibleTiles(projection, mapSize),
    [projection, mapSize.width, mapSize.height]
  );

  const userPoint = projection?.toScreenPoint(location.latitude, location.longitude);
  const radiusPixels = projection
    ? metersToPixels(MAP_RADIUS_METERS, location.latitude)
    : 0;

  const handleLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    setMapSize((currentSize) => {
      if (currentSize.width === width && currentSize.height === height) return currentSize;
      return { width, height };
    });
  };

  return (
    <View style={styles.map} onLayout={handleLayout}>
      {tiles.map((tile) => (
        <Image
          key={tile.key}
          source={{ uri: tile.uri }}
          style={[
            styles.mapTile,
            {
              left: tile.left,
              top: tile.top,
            },
          ]}
        />
      ))}

      {userPoint && (
        <View
          pointerEvents="none"
          style={[
            styles.radiusCircle,
            {
              width: radiusPixels * 2,
              height: radiusPixels * 2,
              borderRadius: radiusPixels,
              left: userPoint.x - radiusPixels,
              top: userPoint.y - radiusPixels,
            },
          ]}
        />
      )}

      {nearbyUsers.map((user, index) => {
        const point = projection?.toScreenPoint(user.latitude, user.longitude);
        if (!point) return null;

        const markerColor = index % 2 === 0 ? COLORS.accent : COLORS.success;

        return (
          <View
            key={user.id}
            style={[
              styles.nearbyMapMarker,
              {
                left: point.x - 18,
                top: point.y - 42,
                backgroundColor: markerColor,
              },
            ]}
          >
            <Text style={styles.nearbyMapMarkerText}>
              {user.name ? user.name[0].toUpperCase() : '?'}
            </Text>
            <View style={[styles.nearbyMapMarkerTail, { borderTopColor: markerColor }]} />
          </View>
        );
      })}

      {userPoint && (
        <>
          <View
            style={[
              styles.currentLocationPin,
              {
                left: userPoint.x - 20,
                top: userPoint.y - 54,
              },
            ]}
          >
            <View style={styles.currentLocationPinHead}>
              <Ionicons name="person" size={18} color="#0B8F72" />
            </View>
            <View style={styles.currentLocationPinTail} />
          </View>
          <View
            style={[
              styles.currentLocationDot,
              {
                left: userPoint.x - 8,
                top: userPoint.y - 8,
              },
            ]}
          />
        </>
      )}

      <View style={styles.mapAttribution}>
        <Text style={styles.mapAttributionText}>{MAP_ATTRIBUTION}</Text>
      </View>

      <View style={styles.coordsOverlay}>
        <Ionicons name="navigate" size={12} color={COLORS.primary} />
        <Text style={styles.coordsText}>
          {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
    backgroundColor: '#EAF1F6',
  },
  mapTile: {
    position: 'absolute',
    width: TILE_SIZE,
    height: TILE_SIZE,
  },
  radiusCircle: {
    position: 'absolute',
    backgroundColor: 'rgba(18, 183, 106, 0.12)',
    borderWidth: 2,
    borderColor: 'rgba(18, 183, 106, 0.35)',
  },
  currentLocationPin: {
    position: 'absolute',
    width: 40,
    height: 54,
    alignItems: 'center',
    zIndex: 5,
  },
  currentLocationPinHead: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#34D399',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 5,
    elevation: 6,
  },
  currentLocationPinTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#34D399',
    marginTop: -2,
  },
  currentLocationDot: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#3478F6',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    zIndex: 6,
  },
  nearbyMapMarker: {
    position: 'absolute',
    width: 36,
    height: 42,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    zIndex: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  nearbyMapMarkerText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 18,
  },
  nearbyMapMarkerTail: {
    position: 'absolute',
    bottom: -10,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  mapAttribution: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    backgroundColor: 'rgba(255,255,255,0.86)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  mapAttributionText: {
    color: COLORS.textMuted,
    fontSize: 9,
  },
  coordsOverlay: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
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
});
