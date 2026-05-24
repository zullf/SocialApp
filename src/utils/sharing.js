import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';
import { ensureLocalFileUri } from './localFile';

export async function shareFile(fileUri, mimeType = 'image/jpeg') {
  try {
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert(
        'Tidak Tersedia',
        'Fitur berbagi tidak tersedia di perangkat ini.'
      );
      return false;
    }

    const localUri = await ensureLocalFileUri(fileUri, mimeType === 'image/jpeg' ? 'jpg' : 'bin');

    await Sharing.shareAsync(localUri, {
      mimeType,
      dialogTitle: 'Bagikan Post SocialApp',
      UTI: mimeType === 'image/jpeg' ? 'public.jpeg' : 'public.item',
    });

    console.log('[Sharing] File berhasil dibagikan:', localUri);
    return true;
  } catch (error) {
    if (error.message && error.message.includes('cancel')) {
      console.log('[Sharing] User membatalkan share.');
      return false;
    }
    console.error('[Sharing] Error:', error);
    Alert.alert('Gagal', 'Tidak bisa membagikan file. Coba lagi.');
    return false;
  }
}
