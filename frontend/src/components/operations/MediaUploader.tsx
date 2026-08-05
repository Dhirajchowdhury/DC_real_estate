import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, File as FileIcon, Image as ImageIcon, Video, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { compressImage } from '@/lib/media/compressImage';
import { validateImage, validateVideo } from '@/lib/media/validateMedia';
import { generateThumbnail, dataUrlToFile } from '@/lib/media/generateThumbnail';
import { uploadMedia } from '@/lib/media/uploadMedia';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export interface UploadedMedia {
  url: string;
  thumbnailUrl?: string;
  mediaType: 'IMAGE' | 'VIDEO';
  fileName: string;
  mimeType: string;
  fileSize: number;
  width?: number;
  height?: number;
  duration?: number;
}

interface MediaUploaderProps {
  propertyId: string;
  onUploadComplete: (media: UploadedMedia) => void;
}

interface FileState {
  file: File;
  id: string;
  status: 'PENDING' | 'COMPRESSING' | 'UPLOADING' | 'SUCCESS' | 'ERROR';
  progress: number;
  error?: string;
  previewUrl?: string;
}

export function MediaUploader({ propertyId, onUploadComplete }: MediaUploaderProps) {
  const [files, setFiles] = useState<FileState[]>([]);

  const processFile = async (fileState: FileState) => {
    const { file, id } = fileState;
    const isVideo = file.type.startsWith('video/');
    let fileToUpload = file;
    let thumbnailUrl: string | undefined;
    let width: number | undefined;
    let height: number | undefined;

    try {
      if (isVideo) {
        const { isValid, error } = validateVideo(file);
        if (!isValid) throw new Error(error);

        setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'COMPRESSING', progress: 10 } : f));
        
        // Generate thumbnail
        try {
          const thumbnailDataUrl = await generateThumbnail(file);
          const thumbnailFile = dataUrlToFile(thumbnailDataUrl, `thumb_${file.name}.jpg`);
          const thumbPath = `properties/${propertyId}/thumbnails/${Date.now()}_${thumbnailFile.name}`;
          thumbnailUrl = await uploadMedia(thumbnailFile, thumbPath);
        } catch (e) {
          console.warn('Could not generate/upload thumbnail', e);
        }

      } else {
        const { isValid, error } = validateImage(file);
        if (!isValid) throw new Error(error);

        setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'COMPRESSING', progress: 50 } : f));
        fileToUpload = await compressImage(file);
      }

      setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'UPLOADING', progress: 0 } : f));

      const path = `properties/${propertyId}/${isVideo ? 'videos' : 'images'}/${Date.now()}_${fileToUpload.name}`;
      const url = await uploadMedia(fileToUpload, path, (progressInfo) => {
        setFiles(prev => prev.map(f => f.id === id ? { ...f, progress: progressInfo.progress } : f));
      });

      setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'SUCCESS', progress: 100 } : f));

      const uploadedMedia: UploadedMedia = {
        url,
        thumbnailUrl,
        mediaType: isVideo ? 'VIDEO' : 'IMAGE',
        fileName: fileToUpload.name,
        mimeType: fileToUpload.type,
        fileSize: fileToUpload.size,
        width, // Could be extracted if needed
        height,
      };

      onUploadComplete(uploadedMedia);

    } catch (error: any) {
      setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'ERROR', error: error.message || 'Upload failed' } : f));
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substring(7),
      status: 'PENDING' as const,
      progress: 0,
      previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    }));

    setFiles(prev => [...prev, ...newFiles]);
    newFiles.forEach(processFile);
  }, [propertyId]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': [],
      'video/mp4': [],
      'video/quicktime': [],
      'video/webm': []
    }
  });

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="space-y-4">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/50'}`}
      >
        <input {...getInputProps()} />
        <div className="flex justify-center mb-4 text-muted-foreground">
          <Upload className="w-10 h-10" />
        </div>
        <p className="text-lg font-medium mb-1">Drag & drop media here</p>
        <p className="text-sm text-muted-foreground mb-4">or click to browse files</p>
        <p className="text-xs text-muted-foreground">
          Images up to 15MB (JPEG, PNG, WebP) &bull; Videos up to 250MB (MP4, MOV, WebM)
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-3">
          {files.map(fileState => (
            <Card key={fileState.id} className="p-3 flex items-center gap-4">
              <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center overflow-hidden shrink-0">
                {fileState.previewUrl ? (
                  <img src={fileState.previewUrl} alt="preview" className="w-full h-full object-cover" />
                ) : fileState.file.type.startsWith('video/') ? (
                  <Video className="w-6 h-6 text-muted-foreground" />
                ) : (
                  <FileIcon className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{fileState.file.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  {fileState.status === 'COMPRESSING' && (
                    <><Loader2 className="w-3 h-3 animate-spin text-blue-500" /> <span className="text-xs text-blue-500">Optimizing...</span></>
                  )}
                  {fileState.status === 'UPLOADING' && (
                    <><Loader2 className="w-3 h-3 animate-spin text-primary" /> <span className="text-xs text-primary">Uploading... {fileState.progress}%</span></>
                  )}
                  {fileState.status === 'SUCCESS' && (
                    <><CheckCircle className="w-3 h-3 text-green-500" /> <span className="text-xs text-green-500">Complete</span></>
                  )}
                  {fileState.status === 'ERROR' && (
                    <><AlertCircle className="w-3 h-3 text-red-500" /> <span className="text-xs text-red-500 truncate">{fileState.error}</span></>
                  )}
                  {fileState.status === 'PENDING' && (
                    <span className="text-xs text-muted-foreground">Waiting...</span>
                  )}
                </div>
                
                {(fileState.status === 'COMPRESSING' || fileState.status === 'UPLOADING') && (
                  <div className="w-full bg-secondary h-1.5 rounded-full mt-2 overflow-hidden">
                    <div 
                      className="bg-primary h-full transition-all duration-300" 
                      style={{ width: `${fileState.status === 'COMPRESSING' ? 50 : 50 + (fileState.progress / 2)}%` }}
                    />
                  </div>
                )}
              </div>

              <Button variant="ghost" size="icon" className="shrink-0" onClick={(e) => { e.stopPropagation(); removeFile(fileState.id); }}>
                <X className="w-4 h-4" />
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
