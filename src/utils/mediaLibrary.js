import * as MediaLibrary from 'expo-media-library';
import { Alert } from 'react-native';
import { requestSaveMediaPermission } from './permissions';

export async function saveImageToGallery(uri, albumName = 'SocialApp') {
  try {
    const granted = await requestSaveMediaPermission();
    if (!granted) return null;

    const asset = await MediaLibrary.createAssetAsync(uri);

    const album = await MediaLibrary.getAlbumAsync(albumName);
    if (album === null) {
      await MediaLibrary.createAlbumAsync(albumName, asset, false);
    } else {
      await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
    }

    console.log('[MediaLibrary] Gambar disimpan ke galeri:', asset.uri);
    Alert.alert('✅ Tersimpan', `Gambar berhasil disimpan ke album "${albumName}".`);
    return asset;
  } catch (error) {
    console.error('[MediaLibrary] Gagal menyimpan gambar:', error);
    Alert.alert('Gagal', 'Tidak bisa menyimpan gambar ke galeri. Coba lagi.');
    return null;
  }
}
