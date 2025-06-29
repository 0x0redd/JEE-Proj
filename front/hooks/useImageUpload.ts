import { useState, useCallback } from 'react';
import { ImageService, ImageUploadResponse } from '../services/imageService';

interface UseImageUploadReturn {
  uploadImage: (file: File) => Promise<ImageUploadResponse>;
  deleteImage: (imageUrl: string) => Promise<ImageUploadResponse>;
  checkImageExists: (imageUrl: string) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

export const useImageUpload = (): UseImageUploadReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const uploadImage = useCallback(async (file: File): Promise<ImageUploadResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate file first
      const validation = ImageService.validateImageFile(file);
      if (!validation.valid) {
        setError(validation.error || 'Invalid file');
        return { success: false, error: validation.error };
      }

      const result = await ImageService.uploadImage(file);
      
      if (!result.success) {
        setError(result.error || 'Upload failed');
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteImage = useCallback(async (imageUrl: string): Promise<ImageUploadResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await ImageService.deleteImage(imageUrl);
      
      if (!result.success) {
        setError(result.error || 'Delete failed');
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Delete failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkImageExists = useCallback(async (imageUrl: string): Promise<boolean> => {
    try {
      const result = await ImageService.checkImageExists(imageUrl);
      return result.exists;
    } catch (err) {
      console.error('Error checking image existence:', err);
      return false;
    }
  }, []);

  return {
    uploadImage,
    deleteImage,
    checkImageExists,
    isLoading,
    error,
    clearError,
  };
}; 