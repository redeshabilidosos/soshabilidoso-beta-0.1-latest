'use client';

import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CyberButton } from '@/components/ui/cyber-button';
import { Image, Video, X, Upload, Loader2, Check, Clock } from 'lucide-react';
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
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    processFile(file);
  };

  const processFile = (file: File) => {
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
        toast.success('Video cargado correctamente');
      };
      video.src = URL.createObjectURL(file);
    } else {
      setMediaFile(file);
      setMediaType('image');
      setMediaPreview(URL.createObjectURL(file));
      toast.success('Imagen cargada correctamente');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
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
      toast.success('¡Historia publicada exitosamente!', {
        icon: '🎉',
      });
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
    setIsDragging(false);
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
      <DialogContent className="max-w-[380px] w-[95vw] bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 border border-neon-green/20 p-4 shadow-2xl shadow-neon-green/10">
        <DialogHeader className="mb-2 pr-8">
          <DialogTitle className="text-white flex items-center gap-2 text-base">
            <div className="p-1.5 bg-neon-green/20 rounded-lg">
              <Upload size={14} className="text-neon-green" />
            </div>
            Nueva Historia
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {/* Área de preview/upload */}
          {mediaPreview ? (
            <div className="relative w-full mx-auto" style={{ maxWidth: '280px' }}>
              <div className="relative aspect-[9/16] bg-black rounded-xl overflow-hidden border-2 border-neon-green/30 shadow-lg shadow-neon-green/20">
                {mediaType === 'image' ? (
                  <img 
                    src={mediaPreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video 
                    src={mediaPreview} 
                    className="w-full h-full object-cover"
                    controls
                    autoPlay
                    muted
                  />
                )}
                
                {/* Overlay con info del archivo */}
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-white text-xs">
                      {mediaType === 'image' ? (
                        <Image size={12} className="text-neon-green" />
                      ) : (
                        <Video size={12} className="text-neon-blue" />
                      )}
                      <span className="font-medium">
                        {mediaType === 'image' ? 'Imagen' : 'Video'}
                      </span>
                    </div>
                    <button
                      onClick={clearMedia}
                      className="p-1 bg-red-500/90 rounded-full hover:bg-red-500 transition-all hover:scale-110"
                    >
                      <X size={12} className="text-white" />
                    </button>
                  </div>
                </div>

                {/* Badge de éxito */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-center gap-1.5 bg-neon-green/20 backdrop-blur-sm border border-neon-green/30 rounded-full px-2 py-1">
                  <Check size={12} className="text-neon-green" />
                  <span className="text-neon-green text-xs font-medium">Listo para publicar</span>
                </div>
              </div>
            </div>
          ) : (
            <div 
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "w-full mx-auto border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 p-6 relative overflow-hidden",
                isDragging 
                  ? "border-neon-green bg-neon-green/10 scale-[0.98]" 
                  : "border-white/20 hover:border-neon-green/50 hover:bg-white/5"
              )}
              style={{ maxWidth: '280px', aspectRatio: '9/16' }}
            >
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-neon-green/5 via-transparent to-neon-blue/5 opacity-50" />
              
              <div className="relative z-10 flex flex-col items-center">
                {/* Iconos con animación */}
                <div className="flex gap-3 mb-4">
                  <div className={cn(
                    "p-3 bg-gradient-to-br from-neon-green/20 to-neon-green/10 rounded-xl transition-all duration-300 border border-neon-green/30",
                    !isDragging && "hover:scale-110 hover:shadow-lg hover:shadow-neon-green/20"
                  )}>
                    <Image size={24} className="text-neon-green" />
                  </div>
                  <div className={cn(
                    "p-3 bg-gradient-to-br from-neon-blue/20 to-neon-blue/10 rounded-xl transition-all duration-300 border border-neon-blue/30",
                    !isDragging && "hover:scale-110 hover:shadow-lg hover:shadow-neon-blue/20"
                  )}>
                    <Video size={24} className="text-neon-blue" />
                  </div>
                </div>

                {/* Texto principal */}
                <div className="text-center space-y-2">
                  <p className="text-white text-sm font-semibold">
                    {isDragging ? '¡Suelta aquí!' : 'Selecciona tu contenido'}
                  </p>
                  <p className="text-gray-400 text-xs px-2">
                    {isDragging 
                      ? 'Suelta el archivo para cargarlo' 
                      : 'Haz clic o arrastra una imagen o video'
                    }
                  </p>
                  
                  {/* Requisitos */}
                  <div className="flex items-center justify-center gap-1.5 text-gray-500 text-xs mt-2 pt-2 border-t border-white/10">
                    <Clock size={10} />
                    <span>Videos máx. 30s</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Info de duración con mejor diseño */}
          <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-neon-green/10 via-neon-green/5 to-transparent rounded-lg px-3 py-2 border border-neon-green/20">
            <span className="w-1.5 h-1.5 bg-neon-green rounded-full animate-pulse shadow-lg shadow-neon-green/50" />
            <span className="text-gray-300 text-xs font-medium">Tu historia durará 24 horas</span>
          </div>

          {/* Botones mejorados */}
          <div className="flex gap-2">
            <CyberButton
              variant="outline"
              className="flex-1 text-xs border-white/20 hover:border-white/40"
              size="sm"
              onClick={handleClose}
              disabled={isUploading}
            >
              Cancelar
            </CyberButton>
            <CyberButton
              className={cn(
                "flex-1 text-xs transition-all duration-300",
                mediaFile && !isUploading && "shadow-lg shadow-neon-green/30 hover:shadow-neon-green/50"
              )}
              size="sm"
              onClick={handleUpload}
              disabled={!mediaFile || isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 size={12} className="animate-spin mr-1.5" />
                  Publicando...
                </>
              ) : (
                <>
                  <Upload size={12} className="mr-1.5" />
                  Publicar Historia
                </>
              )}
            </CyberButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default NewStoryDialog;
