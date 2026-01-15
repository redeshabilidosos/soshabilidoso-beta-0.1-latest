'use client';

import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { CyberButton } from '@/components/ui/cyber-button';
import { Camera, Check, Upload, Link, X } from 'lucide-react';
import { useAuth } from '@/components/providers/providers';
import { toast } from 'sonner';

interface UpdateCoverPhotoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentCoverPhoto: string;
}

export function UpdateCoverPhotoDialog({ isOpen, onClose, currentCoverPhoto }: UpdateCoverPhotoDialogProps) {
  const { updateProfile, uploadCoverPhoto } = useAuth();
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url');
  const [newCoverPhotoUrl, setNewCoverPhotoUrl] = useState(currentCoverPhoto);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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

    // Validar tamaño (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('El archivo es demasiado grande. Máximo 10MB');
      return;
    }

    setSelectedFile(file);

    // Crear preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (uploadMethod === 'url') {
        if (!newCoverPhotoUrl.trim()) {
          toast.error('Por favor, introduce una URL para la foto de portada.');
          return;
        }
        await updateProfile({ coverPhoto: newCoverPhotoUrl.trim() });
      } else {
        if (!selectedFile) {
          toast.error('Por favor, selecciona un archivo.');
          return;
        }
        await uploadCoverPhoto(selectedFile);
      }
      
      toast.success('Foto de portada actualizada con éxito!');
      onClose();
      resetForm();
    } catch (error: any) {
      console.error('Error updating cover photo:', error);
      toast.error(error.message || 'Error al actualizar la foto de portada.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setUploadMethod('url');
    setNewCoverPhotoUrl(currentCoverPhoto);
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const getPreviewImage = () => {
    if (uploadMethod === 'file' && previewUrl) {
      return previewUrl;
    }
    if (uploadMethod === 'url' && newCoverPhotoUrl) {
      return newCoverPhotoUrl;
    }
    return currentCoverPhoto;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] glass-card border-neon-green/20">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center space-x-2">
            <Camera size={20} className="text-neon-green" />
            <span>Actualizar Foto de Portada</span>
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Elige cómo quieres actualizar tu foto de portada.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          {/* Selector de método */}
          <div className="flex space-x-2">
            <CyberButton
              variant={uploadMethod === 'url' ? 'default' : 'outline'}
              onClick={() => setUploadMethod('url')}
              className="flex-1"
              disabled={isLoading}
            >
              <Link size={16} className="mr-2" />
              URL
            </CyberButton>
            <CyberButton
              variant={uploadMethod === 'file' ? 'default' : 'outline'}
              onClick={() => setUploadMethod('file')}
              className="flex-1"
              disabled={isLoading}
            >
              <Upload size={16} className="mr-2" />
              Subir Archivo
            </CyberButton>
          </div>

          {/* Contenido según el método seleccionado */}
          {uploadMethod === 'url' ? (
            <div>
              <Input
                placeholder="URL de la imagen de portada"
                value={newCoverPhotoUrl}
                onChange={(e) => setNewCoverPhotoUrl(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                disabled={isLoading}
              />
            </div>
          ) : (
            <div>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                {selectedFile ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center space-x-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-white">{selectedFile.name}</span>
                      <button
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewUrl(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <p className="text-xs text-gray-400">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                    <p className="text-gray-400">
                      Haz clic para seleccionar una imagen
                    </p>
                    <p className="text-xs text-gray-500">
                      JPG, PNG o WebP (máx. 10MB)
                    </p>
                  </div>
                )}
                <CyberButton
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-3"
                  disabled={isLoading}
                >
                  {selectedFile ? 'Cambiar archivo' : 'Seleccionar archivo'}
                </CyberButton>
              </div>
            </div>
          )}

          {/* Vista previa */}
          {getPreviewImage() && (
            <div className="space-y-2">
              <p className="text-sm text-gray-400">Vista previa:</p>
              <img 
                src={getPreviewImage()} 
                alt="Vista previa" 
                className="w-full h-32 object-cover rounded-lg border border-gray-600" 
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <CyberButton variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancelar
          </CyberButton>
          <CyberButton onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Guardando...' : <><Check size={16} className="mr-2" /> Guardar</>}
          </CyberButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}