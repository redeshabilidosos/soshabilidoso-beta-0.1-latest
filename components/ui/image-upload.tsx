'use client';

import { useState, useRef } from 'react';
import { Camera, Upload, X, Loader2, Settings } from 'lucide-react';
import { CyberButton } from './cyber-button';
import { ImageCropEditor } from './image-crop-editor';
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
  const [showEditor, setShowEditor] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('[IMAGE UPLOAD] Archivo seleccionado:', {
      name: file.name,
      size: file.size,
      type: file.type,
      uploadType: type
    });

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      console.error('[IMAGE UPLOAD] Tipo de archivo no permitido:', file.type);
      toast.error('Tipo de archivo no permitido. Use JPG, PNG o WebP');
      return;
    }

    // Validar tamaño
    const maxSize = type === 'avatar' ? 5 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      const maxSizeMB = maxSize / (1024 * 1024);
      console.error('[IMAGE UPLOAD] Archivo demasiado grande:', file.size, 'Max:', maxSize);
      toast.error(`El archivo es demasiado grande. Máximo ${maxSizeMB}MB`);
      return;
    }

    console.log('[IMAGE UPLOAD] Validaciones pasadas, abriendo editor...');

    // Crear preview y abrir editor
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      console.log('[IMAGE UPLOAD] Imagen cargada, abriendo editor');
      setSelectedFile(imageUrl);
      setShowEditor(true);
    };
    reader.readAsDataURL(file);
  };

  const handleEditorSave = async (croppedBlob: Blob) => {
    console.log('[IMAGE UPLOAD] Imagen editada, iniciando subida...');
    setIsUploading(true);
    
    try {
      // Convertir blob a file
      const file = new File([croppedBlob], `${type}-${Date.now()}.jpg`, { type: 'image/jpeg' });
      
      // Crear preview
      const previewUrl = URL.createObjectURL(croppedBlob);
      setPreviewUrl(previewUrl);
      
      console.log('[IMAGE UPLOAD] Llamando a onImageUpload...');
      await onImageUpload(file);
      console.log('[IMAGE UPLOAD] onImageUpload completado exitosamente');
      toast.success(`${type === 'avatar' ? 'Avatar' : 'Foto de portada'} actualizada exitosamente`);
    } catch (error: any) {
      console.error('[IMAGE UPLOAD] Error en handleEditorSave:', error);
      toast.error(error.message || 'Error al subir la imagen');
      setPreviewUrl(null);
    } finally {
      console.log('[IMAGE UPLOAD] handleEditorSave finalizado');
      setIsUploading(false);
      setShowEditor(false);
      setSelectedFile(null);
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

        {/* Editor de imagen */}
        {selectedFile && (
          <ImageCropEditor
            isOpen={showEditor}
            onClose={() => {
              setShowEditor(false);
              setSelectedFile(null);
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
            }}
            imageSrc={selectedFile}
            onSave={handleEditorSave}
            aspectRatio={1}
            shape="round"
          />
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
              <span>Cambiar foto de portada</span>
            </div>
          )}
        </div>
      </div>

      {/* Botones de acción */}
      <div className="absolute top-4 right-4 flex gap-2">
        {/* Botón de editar posición (solo si ya hay imagen) */}
        {displayImage && (
          <CyberButton
            size="sm"
            variant="outline"
            onClick={() => {
              if (displayImage) {
                setSelectedFile(displayImage);
                setShowEditor(true);
              }
            }}
            disabled={isUploading}
            className="bg-black/50 backdrop-blur-sm border-white/30 hover:bg-black/70"
          >
            <Settings size={16} className="mr-2" />
            Editar posición
          </CyberButton>
        )}
        
        {/* Botón de cambiar foto */}
        <CyberButton
          size="sm"
          onClick={handleButtonClick}
          disabled={isUploading}
          className="bg-neon-green/20 border-neon-green hover:bg-neon-green/30"
        >
          <Camera size={16} className="mr-2" />
          {displayImage ? 'Cambiar foto' : 'Subir foto'}
        </CyberButton>
      </div>

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

      {/* Editor de imagen */}
      {selectedFile && (
        <ImageCropEditor
          isOpen={showEditor}
          onClose={() => {
            setShowEditor(false);
            setSelectedFile(null);
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          }}
          imageSrc={selectedFile}
          onSave={handleEditorSave}
          aspectRatio={16 / 9}
          shape="rect"
        />
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
