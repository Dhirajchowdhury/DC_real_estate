import { supabase } from '../supabase';

export interface UploadProgress {
  progress: number;
}

export const uploadMedia = async (
  file: File,
  path: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<string> => {
  try {
    // Note: Supabase JS upload doesn't have native progress events in standard upload yet, 
    // but we can simulate or just show uploading state.
    // For large files TUS protocol should be used for real progress.
    if (onProgress) {
      onProgress({ progress: 10 }); // Start
    }

    const { data, error } = await supabase.storage
      .from('media') // Ensure bucket exists and has correct policies
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw error;
    }

    if (onProgress) {
      onProgress({ progress: 100 }); // Finish
    }

    const { data: publicUrlData } = supabase.storage
      .from('media')
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error uploading media:', error);
    throw error;
  }
};
