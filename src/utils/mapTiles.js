export const MAP_RADIUS_METERS = 500;
export const MAP_ZOOM = 16;
export const TILE_SIZE = 256;
export const MAP_ATTRIBUTION = '(c) OpenStreetMap (c) CARTO';

const CARTO_TILE_URL = 'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png';

export function toWorldPoint(latitude, longitude, zoom = MAP_ZOOM) {
  const scale = TILE_SIZE * 2 ** zoom;
  const sinLatitude = Math.sin((latitude * Math.PI) / 180);

  return {
    x: ((longitude + 180) / 360) * scale,
    y: (0.5 - Math.log((1 + sinLatitude) / (1 - sinLatitude)) / (4 * Math.PI)) * scale,
  };
}

export function createTileUrl(x, y, z) {
  return CARTO_TILE_URL
    .replace('{z}', z)
    .replace('{x}', x)
    .replace('{y}', y);
}

export function metersToPixels(meters, latitude, zoom = MAP_ZOOM) {
  const metersPerPixel = (156543.03392 * Math.cos((latitude * Math.PI) / 180)) / 2 ** zoom;
  return meters / metersPerPixel;
}

export function getMapProjection(center, size) {
  if (!size.width || !size.height) return null;

  const centerWorld = toWorldPoint(center.latitude, center.longitude);

  return {
    topLeft: {
      x: centerWorld.x - size.width / 2,
      y: centerWorld.y - size.height / 2,
    },
    toScreenPoint(latitude, longitude) {
      const worldPoint = toWorldPoint(latitude, longitude);
      return {
        x: worldPoint.x - (centerWorld.x - size.width / 2),
        y: worldPoint.y - (centerWorld.y - size.height / 2),
      };
    },
  };
}

export function createVisibleTiles(projection, size) {
  if (!projection) return [];

  const maxTile = 2 ** MAP_ZOOM;
  const startX = Math.floor(projection.topLeft.x / TILE_SIZE) - 1;
  const endX = Math.floor((projection.topLeft.x + size.width) / TILE_SIZE) + 1;
  const startY = Math.floor(projection.topLeft.y / TILE_SIZE) - 1;
  const endY = Math.floor((projection.topLeft.y + size.height) / TILE_SIZE) + 1;
  const tiles = [];

  for (let tileX = startX; tileX <= endX; tileX += 1) {
    for (let tileY = startY; tileY <= endY; tileY += 1) {
      if (tileY < 0 || tileY >= maxTile) continue;

      const wrappedX = ((tileX % maxTile) + maxTile) % maxTile;
      tiles.push({
        key: `${tileX}-${tileY}`,
        uri: createTileUrl(wrappedX, tileY, MAP_ZOOM),
        left: tileX * TILE_SIZE - projection.topLeft.x,
        top: tileY * TILE_SIZE - projection.topLeft.y,
      });
    }
  }

  return tiles;
}
