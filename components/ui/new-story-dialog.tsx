'use client';

import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CyberButton } from '@/components/ui/cyber-button';
import { Image, Video, X, Upload, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Story } from './stories-slider';
import { toast } from 'sonner';
import { storiesService } from '@/lib/services/stories.service';

interface NewStoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onStoryCreated: (story: Story) => void;
  currentUser?: {
    id: string;
    username: string;
    displayName?: string;
    avatar?: string;
  };
}

export function NewStoryDialog({ isOpen, onClose, onStoryCreated, currentUser }: NewStoryDialogProps) {
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (!isImage && !isVideo) {
      toast.error('Solo se permiten imágenes o videos');
      return;
    }

    // Validar duración del video (máximo 30 segundos)
    if (isVideo) {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        if (video.duration > 30) {
          toast.error('El video debe ser de máximo 30 segundos');
          return;
        }
        setMediaFile(file);
        setMediaType('video');
        setMediaPreview(URL.createObjectURL(file));
      };
      video.src = URL.createObjectURL(file);
    } else {
      setMediaFile(file);
      setMediaType('image');
      setMediaPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!mediaFile || isUploading) {
      if (!mediaFile) toast.error('Selecciona una imagen o video');
      return;
    }

    setIsUploading(true);

    try {
      // Intentar subir al backend
      let backendStory = null;
      try {
        if (mediaType === 'image') {
          backendStory = await storiesService.createStoryWithImage(mediaFile);
        } else {
          backendStory = await storiesService.createStoryWithVideo(mediaFile);
        }
        console.log('✅ Historia creada en backend:', backendStory);
      } catch (backendError) {
        console.log('Backend no disponible, usando datos locales:', backendError);
      }

      // Crear objeto de historia (con datos del backend si están disponibles)
      let newStory: Story;
      
      if (backendStory && backendStory.id) {
        // Usar datos del backend
        newStory = {
          id: String(backendStory.id),
          userId: String(backendStory.user?.id || currentUser?.id || 'current-user'),
          user: {
            id: String(backendStory.user?.id || currentUser?.id || 'current-user'),
            username: backendStory.user?.username || currentUser?.username || 'current_user',
            displayName: backendStory.user?.display_name || currentUser?.displayName || 'Usuario',
            avatar: backendStory.user?.avatar_url || currentUser?.avatar || ''
          },
          mediaUrl: backendStory.media_url || mediaPreview || '',
          mediaType: backendStory.media_type || mediaType,
          createdAt: backendStory.created_at || new Date().toISOString(),
          expiresAt: backendStory.expires_at || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          viewed: false
        };
      } else {
        // Fallback local si el backend no está disponible
        newStory = {
          id: `story-${Date.now()}`,
          userId: currentUser?.id || 'current-user',
          user: {
            id: currentUser?.id || 'current-user',
            username: currentUser?.username || 'current_user',
            displayName: currentUser?.displayName || currentUser?.username || 'Usuario Actual',
            avatar: currentUser?.avatar || ''
          },
          mediaUrl: mediaPreview || '',
          mediaType: mediaType,
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          viewed: false
        };
      }

      onStoryCreated(newStory);
      toast.success('¡Historia publicada!');
      handleClose();
    } catch (error) {
      console.error('Error subiendo historia:', error);
      toast.error('Error al publicar la historia');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setMediaFile(null);
    setMediaPreview(null);
    setMediaType('image');
    onClose();
  };

  const clearMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-dark-card border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Upload size={20} className="text-neon-green" />
            Nueva Historia
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Área de preview/upload */}
          {mediaPreview ? (
            <div className="relative aspect-[9/16] max-h-[400px] bg-black rounded-xl overflow-hidden">
              {mediaType === 'image' ? (
                <img 
                  src={mediaPreview} 
                  alt="Preview" 
                  className="w-full h-full object-contain"
                />
              ) : (
                <video 
                  src={mediaPreview} 
                  className="w-full h-full object-contain"
                  controls
                  autoPlay
                  muted
                />
              )}
              <button
                onClick={clearMedia}
                className="absolute top-2 right-2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
              >
                <X size={16} className="text-white" />
              </button>
            </div>
          ) : (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="aspect-[9/16] max-h-[400px] border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-neon-green/50 transition-colors"
            >
              <div className="flex gap-4 mb-4">
                <div className="p-4 bg-white/5 rounded-full">
                  <Image size={32} className="text-neon-green" />
                </div>
                <div className="p-4 bg-white/5 rounded-full">
                  <Video size={32} className="text-neon-blue" />
                </div>
              </div>
              <p className="text-gray-400 text-sm text-center px-4">
                Haz clic para seleccionar una imagen o video
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Videos de máximo 30 segundos
              </p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Info de duración */}
          <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
            <span className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
            Tu historia durará 24 horas
          </div>

          {/* Botones */}
          <div className="flex gap-3">
            <CyberButton
              variant="outline"
              className="flex-1"
              onClick={handleClose}
              disabled={isUploading}
            >
              Cancelar
            </CyberButton>
            <CyberButton
              className="flex-1"
              onClick={handleUpload}
              disabled={!mediaFile || isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Publicando...
                </>
              ) : (
                'Publicar Historia'
              )}
            </CyberButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default NewStoryDialog;
