export function generateNearbyUsers(baseLat, baseLng) {
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
