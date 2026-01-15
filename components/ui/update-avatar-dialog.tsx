'use client';

import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { CyberButton } from '@/components/ui/cyber-button';
import { Camera, Check, Upload, Link, X } from 'lucide-react';
import { useAuth } from '@/components/providers/providers';
import { toast } from 'sonner';

interface UpdateAvatarDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatar: string;
}

export function UpdateAvatarDialog({ isOpen, onClose, currentAvatar }: UpdateAvatarDialogProps) {
  const { updateProfile, uploadAvatar } = useAuth();
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url');
  const [newAvatarUrl, setNewAvatarUrl] = useState(currentAvatar);
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

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('El archivo es demasiado grande. Máximo 5MB');
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
        if (!newAvatarUrl.trim()) {
          toast.error('Por favor, introduce una URL para el avatar.');
          return;
        }
        await updateProfile({ avatar: newAvatarUrl.trim() });
      } else {
        if (!selectedFile) {
          toast.error('Por favor, selecciona un archivo.');
          return;
        }
        await uploadAvatar(selectedFile);
      }
      
      toast.success('Avatar actualizado con éxito!');
      onClose();
      resetForm();
    } catch (error: any) {
      console.error('Error updating avatar:', error);
      toast.error(error.message || 'Error al actualizar el avatar.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setUploadMethod('url');
    setNewAvatarUrl(currentAvatar);
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
    if (uploadMethod === 'url' && newAvatarUrl) {
      return newAvatarUrl;
    }
    return currentAvatar;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] glass-card border-neon-green/20">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center space-x-2">
            <Camera size={20} className="text-neon-green" />
            <span>Actualizar Avatar</span>
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Elige cómo quieres actualizar tu avatar.
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
                placeholder="URL del avatar"
                value={newAvatarUrl}
                onChange={(e) => setNewAvatarUrl(e.target.value)}
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
                      JPG, PNG o WebP (máx. 5MB)
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
              <div className="flex justify-center">
                <img 
                  src={getPreviewImage()} 
                  alt="Vista previa" 
                  className="w-24 h-24 object-cover rounded-full border-2 border-neon-green/50" 
                />
              </div>
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