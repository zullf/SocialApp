import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { requestMediaLibraryPermission } from './permissions';

export async function pickImageFromGallery() {
  try {
    const granted = await requestMediaLibraryPermission();
    if (!granted) return null;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],   
      allowsEditing: true,      
      aspect: [1, 1],           
      quality: 1,
    });

    if (result.canceled) return null;
    return result.assets[0];
  } catch (error) {
    console.error('[ImageTools] Gagal pilih gambar:', error);
    return null;
  }
}

export async function processImage(uri, maxSize = 800, quality = 0.75) {
  try {
    const context = ImageManipulator.manipulate(uri);
    context.resize({ width: maxSize });
    const image = await context.renderAsync();
    const result = await image.saveAsync({
      compress: quality,
      format: SaveFormat.JPEG,
    });

    console.log('[ImageTools] Gambar diproses:', {
      width: result.width,
      height: result.height,
    });
    return result;
  } catch (error) {
    console.error('[ImageTools] Gagal proses gambar:', error);
    try {
      const { manipulateAsync } = await import('expo-image-manipulator');
      const result = await manipulateAsync(
        uri,
        [{ resize: { width: maxSize } }],
        { compress: quality, format: SaveFormat.JPEG }
      );
      return result;
    } catch (fallbackError) {
      console.error('[ImageTools] Fallback juga gagal:', fallbackError);
      return null;
    }
  }
}

export async function pickAndProcessImage() {
  const picked = await pickImageFromGallery();
  if (!picked) return null;

  const processed = await processImage(picked.uri, 800, 0.75);
  if (!processed) return null;

  return { original: picked, processed };
}
