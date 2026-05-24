import { File, Paths } from 'expo-file-system';

function isRemoteUri(uri) {
  return typeof uri === 'string' && /^https?:\/\//i.test(uri);
}

function createCacheFileName(extension) {
  const safeExtension = extension.replace(/^\./, '') || 'jpg';
  const randomPart = Math.random().toString(36).slice(2, 8);
  return `socialapp-${Date.now()}-${randomPart}.${safeExtension}`;
}

export async function ensureLocalFileUri(uri, extension = 'jpg') {
  if (!isRemoteUri(uri)) return uri;

  const destination = new File(Paths.cache, createCacheFileName(extension));
  const downloadedFile = await File.downloadFileAsync(uri, destination);

  return downloadedFile.uri;
}
