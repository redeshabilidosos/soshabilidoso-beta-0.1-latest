'use client';

import { useState, useRef } from 'react';
import { Camera, Upload, X, Loader2 } from 'lucide-react';
import { CyberButton } from './cyber-button';
import { toast } from 'sonner';

interface ImageUploadProps {
  currentImage?: string;
  onImageUpload: (file: File) => Promise<void>;
  type: 'avatar' | 'cover';
  className?: string;
}

export function ImageUpload({ currentImage, onImageUpload, type, className = '' }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Tipo de archivo no permitido. Use JPG, PNG o WebP');
      return;
    }

    // Validar tamaño
    const maxSize = type === 'avatar' ? 5 * 1024 * 1024 : 10 * 1024 * 1024; // 5MB para avatar, 10MB para portada
    if (file.size > maxSize) {
      const maxSizeMB = maxSize / (1024 * 1024);
      toast.error(`El archivo es demasiado grande. Máximo ${maxSizeMB}MB`);
      return;
    }

    // Crear preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Subir archivo
    handleUpload(file);
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    try {
      await onImageUpload(file);
      toast.success(`${type === 'avatar' ? 'Avatar' : 'Foto de portada'} actualizada exitosamente`);
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error(error.message || 'Error al subir la imagen');
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const clearPreview = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const displayImage = previewUrl || currentImage;

  if (type === 'avatar') {
    return (
      <div className={`relative group ${className}`}>
        <div className="relative w-32 h-32 rounded-full overflow-hidden ring-4 ring-neon-green/50">
          {displayImage ? (
            <img
              src={displayImage}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
              <Camera className="w-8 h-8 text-gray-400" />
            </div>
          )}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            {isUploading ? (
              <Loader2 className="w-6 h-6 text-white animate-spin" />
            ) : (
              <Camera className="w-6 h-6 text-white" />
            )}
          </div>
        </div>

        {/* Botón de cambiar */}
        <CyberButton
          size="sm"
          className="absolute -bottom-2 -right-2"
          onClick={handleButtonClick}
          disabled={isUploading}
        >
          <Camera size={16} />
        </CyberButton>

        {/* Preview controls */}
        {previewUrl && (
          <button
            onClick={clearPreview}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
          >
            <X size={12} />
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    );
  }

  // Cover photo layout
  return (
    <div className={`relative group ${className}`}>
      <div className="relative w-full h-48 lg:h-64 rounded-xl overflow-hidden">
        {displayImage ? (
          <img
            src={displayImage}
            alt="Foto de portada"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-700 flex items-center justify-center">
            <Upload className="w-12 h-12 text-gray-400" />
            <span className="ml-2 text-gray-400">Subir foto de portada</span>
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          {isUploading ? (
            <div className="flex items-center space-x-2 text-white">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Subiendo...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-white">
              <Camera className="w-6 h-6" />
              <span>Cambiar foto</span>
            </div>
          )}
        </div>
      </div>

      {/* Botón de cambiar */}
      <CyberButton
        className="absolute top-4 right-4"
        onClick={handleButtonClick}
        disabled={isUploading}
      >
        <Camera size={16} className="mr-2" />
        Cambiar
      </CyberButton>

      {/* Preview controls */}
      {previewUrl && (
        <button
          onClick={clearPreview}
          className="absolute top-4 left-4 px-3 py-1 bg-red-500 rounded-lg flex items-center space-x-1 text-white hover:bg-red-600 transition-colors"
        >
          <X size={14} />
          <span className="text-sm">Cancelar</span>
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}