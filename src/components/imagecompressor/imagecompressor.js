// imageUtils.js
import imageCompression from 'browser-image-compression';

export async function compressImageIfNeeded(file) {
  if (file.size <= 200 * 1024) {
    console.log('Image is already under 200KB.');
    return file;
  }

  const options = {
    maxSizeMB: 0.2, // 200KB
    maxWidthOrHeight: 1024,
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    console.log('Original size:', (file.size / 1024).toFixed(2), 'KB');
    console.log('Compressed size:', (compressedFile.size / 1024).toFixed(2), 'KB');
    return compressedFile;
  } catch (error) {
    console.error('Compression error:', error);
    return file; // fallback to original
  }
}
