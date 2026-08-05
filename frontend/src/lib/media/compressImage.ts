import imageCompression from 'browser-image-compression';

export const compressImage = async (file: File): Promise<File> => {
  const options = {
    maxSizeMB: 0.8,          // Target size ~800KB max
    maxWidthOrHeight: 1920,  // Resize images larger than 1920px
    useWebWorker: true,
    fileType: 'image/webp',  // Convert JPEG/PNG to WebP
    initialQuality: 0.8,     // Target quality ~80%
    preserveExif: true,      // Preserve EXIF orientation
  };

  try {
    const compressedFile = await imageCompression(file, options);
    // browser-image-compression might return a Blob, we need to ensure it's a File
    return new File([compressedFile], file.name.replace(/\.[^/.]+$/, ".webp"), {
      type: 'image/webp',
      lastModified: Date.now(),
    });
  } catch (error) {
    console.error('Error compressing image:', error);
    throw error;
  }
};
