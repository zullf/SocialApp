import * as MediaLibrary from 'expo-media-library';
import { Alert, Platform } from 'react-native';
import Constants from 'expo-constants';
import { requestSaveMediaPermission } from './permissions';
import { ensureLocalFileUri } from './localFile';

function isExpoGoAndroid() {
  return Platform.OS === 'android' && Constants.appOwnership === 'expo';
}

export async function saveImageToGallery(uri, albumName = 'SocialApp') {
  try {
    const granted = await requestSaveMediaPermission();
    if (!granted) return null;

    const localUri = await ensureLocalFileUri(uri, 'jpg');

    if (isExpoGoAndroid()) {
      await MediaLibrary.saveToLibraryAsync(localUri);
      console.log('[MediaLibrary] Gambar disimpan ke galeri:', localUri);
      Alert.alert('Tersimpan', 'Gambar berhasil disimpan ke galeri perangkat.');
      return { uri: localUri };
    }

    const asset = await MediaLibrary.createAssetAsync(localUri);

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
