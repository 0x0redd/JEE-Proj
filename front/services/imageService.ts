const API_BASE_URL = 'http://localhost:8080/api';

export interface ImageUploadResponse {
  success: boolean;
  imageUrl?: string;
  message?: string;
  error?: string;
}

export interface ImageExistsResponse {
  exists: boolean;
  imageUrl: string;
}

export class ImageService {
  static async uploadImage(file: File): Promise<ImageUploadResponse> {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_BASE_URL}/images/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload image');
      }

      return data;
    } catch (error) {
      console.error('Error uploading image:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  static async deleteImage(imageUrl: string): Promise<ImageUploadResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/images/delete?imageUrl=${encodeURIComponent(imageUrl)}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete image');
      }

      return data;
    } catch (error) {
      console.error('Error deleting image:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  static async checkImageExists(imageUrl: string): Promise<ImageExistsResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/images/exists?imageUrl=${encodeURIComponent(imageUrl)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error('Failed to check image existence');
      }

      return data;
    } catch (error) {
      console.error('Error checking image existence:', error);
      return {
        exists: false,
        imageUrl
      };
    }
  }

  static getImageUrl(imageUrl: string): string {
    // If it's already a full URL, return as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    // If it's a relative path, prepend the base URL
    if (imageUrl.startsWith('/')) {
      return `http://localhost:3000${imageUrl}`;
    }
    
    // Default case
    return `http://localhost:3000/${imageUrl}`;
  }

  static validateImageFile(file: File): { valid: boolean; error?: string } {
    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return { valid: false, error: 'File size must be less than 10MB' };
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Only JPEG, PNG, GIF, and WebP images are allowed' };
    }

    return { valid: true };
  }
} 