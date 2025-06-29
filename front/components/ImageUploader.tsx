'use client';

import React, { useState, useRef } from 'react';
import { useImageUpload } from '../hooks/useImageUpload';
import { ImageService } from '../services/imageService';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, Upload, X, Check } from 'lucide-react';

interface ImageUploaderProps {
  onImageUploaded?: (imageUrl: string) => void;
  onImageDeleted?: (imageUrl: string) => void;
  multiple?: boolean;
  maxFiles?: number;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUploaded,
  onImageDeleted,
  multiple = false,
  maxFiles = 5
}) => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { uploadImage, deleteImage, isLoading, error, clearError } = useImageUpload();

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    
    // Check if we're within the limit
    if (uploadedImages.length + fileArray.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} images`);
      return;
    }

    for (const file of fileArray) {
      const result = await uploadImage(file);
      if (result.success && result.imageUrl) {
        setUploadedImages(prev => [...prev, result.imageUrl!]);
        onImageUploaded?.(result.imageUrl);
      }
    }
  };

  const handleDeleteImage = async (imageUrl: string) => {
    const result = await deleteImage(imageUrl);
    if (result.success) {
      setUploadedImages(prev => prev.filter(url => url !== imageUrl));
      onImageDeleted?.(imageUrl);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Image Upload
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription className="flex items-center justify-between">
              {error}
              <Button variant="ghost" size="sm" onClick={clearError}>
                <X className="h-4 w-4" />
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            Drag and drop images here, or{' '}
            <button
              type="button"
              className="text-blue-600 hover:text-blue-500"
              onClick={() => fileInputRef.current?.click()}
            >
              browse
            </button>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Supports: JPEG, PNG, GIF, WebP (max 10MB each)
          </p>
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple={multiple}
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
        </div>

        {/* Upload Progress */}
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            Uploading...
          </div>
        )}

        {/* Uploaded Images */}
        {uploadedImages.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Uploaded Images ({uploadedImages.length}/{maxFiles})</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {uploadedImages.map((imageUrl, index) => (
                <div key={index} className="relative group">
                  <img
                    src={ImageService.getImageUrl(imageUrl)}
                    alt={`Uploaded ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => handleDeleteImage(imageUrl)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <div className="absolute bottom-1 left-1 bg-green-500 text-white rounded-full p-1">
                    <Check className="h-3 w-3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 