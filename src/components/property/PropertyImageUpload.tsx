/**
 * Image Upload Component for Property Media
 * Supports drag-and-drop, preview, reorder, and delete
 */

"use client";

import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, GripVertical, Image as ImageIcon, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface ImageFile {
  id: string;
  file?: File;
  url: string;
  preview: string;
  uploading?: boolean;
  error?: string;
}

interface PropertyImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  maxSizeMB?: number;
}

export function PropertyImageUpload({
  images = [],
  onImagesChange,
  maxImages = 20,
  maxSizeMB = 5
}: PropertyImageUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [imageFiles, setImageFiles] = useState<ImageFile[]>(
    images.map((url, index) => ({
      id: `existing-${index}`,
      url,
      preview: url
    }))
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validate image file
  const validateImage = (file: File): string | null => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return 'Only JPG, PNG, and WebP images are allowed';
    }

    const maxSize = maxSizeMB * 1024 * 1024;
    if (file.size > maxSize) {
      return `Image must be smaller than ${maxSizeMB}MB`;
    }

    return null;
  };

  // Handle file selection
  const handleFiles = async (files: FileList) => {
    const newImages: ImageFile[] = [];
    const currentCount = imageFiles.length;

    if (currentCount + files.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const error = validateImage(file);

      if (error) {
        toast.error(`${file.name}: ${error}`);
        continue;
      }

      // Create preview
      const preview = URL.createObjectURL(file);

      newImages.push({
        id: `new-${Date.now()}-${i}`,
        file,
        url: '',
        preview,
        uploading: true
      });
    }

    if (newImages.length === 0) return;

    // Add images to state
    setImageFiles(prev => [...prev, ...newImages]);

    // Upload images
    for (const imageFile of newImages) {
      await uploadImage(imageFile);
    }
  };

  // Upload single image
  const uploadImage = async (imageFile: ImageFile) => {
    try {
      if (!imageFile.file) return;

      const formData = new FormData();
      formData.append('image', imageFile.file);

      // Simulate upload - Replace with actual upload API
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();

      // Update image file with URL
      setImageFiles(prev => prev.map(img => 
        img.id === imageFile.id 
          ? { ...img, url: data.url, uploading: false }
          : img
      ));

      // Update parent component
      const updatedImages = imageFiles
        .filter(img => img.id !== imageFile.id || data.url)
        .map(img => img.id === imageFile.id ? data.url : img.url)
        .filter(Boolean);
      
      onImagesChange(updatedImages as string[]);

      toast.success('Image uploaded successfully');

    } catch (error) {
      console.error('Upload error:', error);
      
      setImageFiles(prev => prev.map(img => 
        img.id === imageFile.id 
          ? { ...img, uploading: false, error: 'Upload failed' }
          : img
      ));

      toast.error('Failed to upload image');
    }
  };

  // Remove image
  const removeImage = (id: string) => {
    setImageFiles(prev => {
      const newImages = prev.filter(img => img.id !== id);
      onImagesChange(newImages.map(img => img.url).filter(Boolean));
      return newImages;
    });
    toast.success('Image removed');
  };

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  }, [imageFiles.length]);

  // File input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  // Move image up/down
  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= imageFiles.length) return;

    const newImages = [...imageFiles];
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
    
    setImageFiles(newImages);
    onImagesChange(newImages.map(img => img.url).filter(Boolean));
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-200
          ${dragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileInputChange}
          className="hidden"
        />
        
        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-700 font-medium mb-1">
          Drop images here or click to browse
        </p>
        <p className="text-sm text-gray-500">
          JPG, PNG, WebP • Max {maxSizeMB}MB • Up to {maxImages} images
        </p>
        <p className="text-xs text-gray-400 mt-2">
          {imageFiles.length} / {maxImages} images uploaded
        </p>
      </div>

      {/* Image Grid */}
      {imageFiles.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {imageFiles.map((imageFile, index) => (
            <div
              key={imageFile.id}
              className="relative group border rounded-lg overflow-hidden bg-white"
            >
              {/* Image Preview */}
              <div className="aspect-square relative">
                {imageFile.uploading ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  </div>
                ) : imageFile.error ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50">
                    <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
                    <p className="text-xs text-red-600 px-2 text-center">{imageFile.error}</p>
                  </div>
                ) : (
                  <Image
                    src={imageFile.preview}
                    alt={`Property image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                )}

                {/* Hero Badge */}
                {index === 0 && (
                  <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                    Hero Image
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {/* Move Up */}
                {index > 0 && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => moveImage(index, 'up')}
                    className="bg-white/90 hover:bg-white"
                  >
                    ↑
                  </Button>
                )}

                {/* Move Down */}
                {index < imageFiles.length - 1 && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => moveImage(index, 'down')}
                    className="bg-white/90 hover:bg-white"
                  >
                    ↓
                  </Button>
                )}

                {/* Remove */}
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeImage(imageFile.id)}
                  disabled={imageFile.uploading}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Position Number */}
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                #{index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Instructions */}
      {imageFiles.length === 0 && (
        <div className="text-center py-8 text-gray-500 text-sm">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No images uploaded yet</p>
          <p className="text-xs mt-1">The first image will be your hero image</p>
        </div>
      )}
    </div>
  );
}
