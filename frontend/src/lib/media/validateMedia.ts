const MAX_IMAGE_SIZE_MB = 15;
const MAX_VIDEO_SIZE_MB = 250;

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm']; // quicktime is mov

export const validateImage = (file: File): { isValid: boolean; error?: string } => {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { isValid: false, error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' };
  }

  const fileSizeMB = file.size / 1024 / 1024;
  if (fileSizeMB > MAX_IMAGE_SIZE_MB) {
    return { isValid: false, error: `File size exceeds ${MAX_IMAGE_SIZE_MB}MB limit.` };
  }

  return { isValid: true };
};

export const validateVideo = (file: File): { isValid: boolean; error?: string } => {
  if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
    return { isValid: false, error: 'Invalid file type. Only MP4, MOV, and WebM are allowed.' };
  }

  const fileSizeMB = file.size / 1024 / 1024;
  if (fileSizeMB > MAX_VIDEO_SIZE_MB) {
    return { isValid: false, error: `File size exceeds ${MAX_VIDEO_SIZE_MB}MB limit.` };
  }

  return { isValid: true };
};
