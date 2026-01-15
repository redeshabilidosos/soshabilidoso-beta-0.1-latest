'use client';

import { useState, useRef } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CyberButton } from '@/components/ui/cyber-button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { 
  X, 
  Upload, 
  Video, 
  Camera,
  Play,
  Loader2,
  Music,
  Hash
} from 'lucide-react';

interface UploadReelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReelUploaded?: (reel: any) => void;
}

export function UploadReelModal({ isOpen, onClose, onReelUploaded }: UploadReelModalProps) {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [useCamera, setUseCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('video/')) {
      toast.error('Por favor selecciona un archivo de video');
      return;
    }

    // Validar tamaño (máximo 100MB)
    if (file.size > 100 * 1024 * 1024) {
      toast.error('El video es muy grande. Máximo 100MB');
      return;
    }

    setVideoFile(file);
    const preview = URL.createObjectURL(file);
    setVideoPreview(preview);
  };

  const handleUpload = async () => {
    if (!videoFile) {
      toast.error('Por favor selecciona un video');
      return;
    }

    setIsUploading(true);

    try {
      const token = localStorage.getItem('access_token');
      console.log('🔑 Token encontrado:', token ? 'Sí' : 'No');
      
      if (!token) {
        toast.error('Debes iniciar sesión para subir reels');
        setIsUploading(false);
        return;
      }

      const formData = new FormData();
      formData.append('video', videoFile);
      formData.append('caption', caption);
      formData.append('hashtags', hashtags);

      console.log('📤 Enviando reel a la API...');
      const response = await fetch('http://127.0.0.1:8000/api/reels/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      console.log('📥 Respuesta:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Error de la API:', errorData);
        throw new Error(errorData.detail || errorData.message || 'Error al subir el reel');
      }

      const newReel = await response.json();
      console.log('✅ Reel subido exitosamente:', newReel);
      
      toast.success('¡Reel subido exitosamente!');
      
      if (onReelUploaded) {
        onReelUploaded(newReel);
      }

      // Reset form
      setVideoFile(null);
      setVideoPreview(null);
      setCaption('');
      setHashtags('');
      onClose();
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || 'Error al subir el reel');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      setVideoFile(null);
      setVideoPreview(null);
      setCaption('');
      setHashtags('');
      setUseCamera(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl glass-card border-neon-green/20 p-0">
        <div className="relative">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <Video className="w-6 h-6 text-neon-green" />
              <span>Subir Reel</span>
            </h2>
            <button
              onClick={handleClose}
              disabled={isUploading}
              className="p-2 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {!videoPreview ? (
              <div className="space-y-4">
                {/* Upload Options */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Camera Option */}
                  <button
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-neon-green/30 rounded-xl hover:border-neon-green/50 hover:bg-neon-green/5 transition-all"
                  >
                    <Camera className="w-12 h-12 text-neon-green mb-3" />
                    <span className="text-white font-medium">Grabar Video</span>
                    <span className="text-gray-400 text-sm mt-1">Usar cámara</span>
                  </button>

                  {/* File Upload Option */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-neon-green/30 rounded-xl hover:border-neon-green/50 hover:bg-neon-green/5 transition-all"
                  >
                    <Upload className="w-12 h-12 text-neon-green mb-3" />
                    <span className="text-white font-medium">Subir Video</span>
                    <span className="text-gray-400 text-sm mt-1">Desde galería</span>
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  className="hidden"
                />

                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="video/*"
                  capture="environment"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  className="hidden"
                />

                <div className="text-center text-gray-400 text-sm">
                  <p>Formatos soportados: MP4, MOV, AVI</p>
                  <p>Tamaño máximo: 100MB</p>
                  <p>Duración recomendada: 15-60 segundos</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Video Preview */}
                <div className="relative bg-black rounded-xl overflow-hidden">
                  <video
                    src={videoPreview}
                    controls
                    className="w-full max-h-96 object-contain"
                  />
                  <button
                    onClick={() => {
                      setVideoFile(null);
                      setVideoPreview(null);
                    }}
                    className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>

                {/* Caption */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Descripción
                  </label>
                  <Textarea
                    placeholder="Escribe una descripción para tu reel..."
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="bg-white/5 border-white/10 text-white min-h-[80px]"
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-400 mt-1">{caption.length}/500</p>
                </div>

                {/* Hashtags */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center space-x-2">
                    <Hash className="w-4 h-4" />
                    <span>Hashtags</span>
                  </label>
                  <Input
                    placeholder="#deportes #fitness #motivacion"
                    value={hashtags}
                    onChange={(e) => setHashtags(e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                  />
                  <p className="text-xs text-gray-400 mt-1">Separa los hashtags con espacios</p>
                </div>

                {/* Actions */}
                <div className="flex space-x-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setVideoFile(null);
                      setVideoPreview(null);
                    }}
                    disabled={isUploading}
                    className="flex-1"
                  >
                    Cambiar Video
                  </Button>
                  <CyberButton
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="flex-1"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Subiendo...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Publicar Reel
                      </>
                    )}
                  </CyberButton>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
