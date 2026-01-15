'use client';

import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { CyberButton } from '@/components/ui/cyber-button';
import { Image as ImageIcon, Video, MessageSquare, Lightbulb, Plus, Mic, Radio, Upload, Link as LinkIcon, PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/providers/providers';
import { toast } from 'sonner';
import { Post } from '@/types/user';
import { StreamingModal } from '@/components/streaming/streaming-modal';
import { postsService, CreatePostData } from '@/lib/services/posts.service';

interface NewPostDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (newPost: Post) => void;
  communityId?: string;
}

export function NewPostDialog({ isOpen, onClose, onPostCreated, communityId }: NewPostDialogProps) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [uploadedVideoFile, setUploadedVideoFile] = useState<File | null>(null);
  const [podcastUrl, setPodcastUrl] = useState('');
  const [uploadedPodcastFile, setUploadedPodcastFile] = useState<File | null>(null);
  const [streamingUrl, setStreamingUrl] = useState('');
  const [isLiveStreamingActive, setIsLiveStreamingActive] = useState(false);
  const [postType, setPostType] = useState<'text' | 'image' | 'video' | 'highlight' | 'podcast' | 'streaming'>('text');
  const [isLoading, setIsLoading] = useState(false);

  // Refs para los inputs de archivo
  const imageFileInputRef = useRef<HTMLInputElement>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const podcastFileInputRef = useRef<HTMLInputElement>(null);

  // Estados para controlar si se usa URL o archivo local para Video/Podcast
  const [videoInputMode, setVideoInputMode] = useState<'url' | 'file'>('url');
  const [podcastInputMode, setPodcastInputMode] = useState<'url' | 'file'>('url');
  const [streamingInputMode, setStreamingInputMode] = useState<'url' | 'live'>('url');
  const [isStreamingModalOpen, setIsStreamingModalOpen] = useState(false);


  const handleAddImageUrl = () => {
    setImageUrls([...imageUrls, '']);
  };

  const handleImageUrlChange = (index: number, value: string) => {
    const newImageUrls = [...imageUrls];
    newImageUrls[index] = value;
    setImageUrls(newImageUrls);
  };

  const handleRemoveImageUrl = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleUploadedImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedImageFile(file);
      setImageUrls([]); // Clear URL inputs if a file is uploaded
      toast.success(`Imagen local "${file.name}" seleccionada.`);
    } else {
      setUploadedImageFile(null);
    }
  };

  const handleUploadedVideoFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedVideoFile(file);
      setVideoUrl(''); // Clear URL input if a file is uploaded
      toast.success(`Video local "${file.name}" seleccionado.`);
    } else {
      setUploadedVideoFile(null);
    }
  };

  const handleUploadedPodcastFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedPodcastFile(file);
      setPodcastUrl(''); // Clear URL input if a file is uploaded
      toast.success(`Podcast local "${file.name}" seleccionado.`);
    } else {
      setUploadedPodcastFile(null);
    }
  };

  const handleStartLiveStreaming = () => {
    setIsStreamingModalOpen(true);
  };

  const handleStopLiveStreaming = () => {
    setIsLiveStreamingActive(false);
    toast.info('Transmisión en vivo finalizada.');
    // En una aplicación real, aquí se cerraría la conexión.
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión para crear una publicación.');
      return;
    }

    const hasContent = content.trim() || imageUrls.some(url => url.trim()) || uploadedImageFile || videoUrl.trim() || uploadedVideoFile || podcastUrl.trim() || uploadedPodcastFile || streamingUrl.trim() || isLiveStreamingActive;

    if (!hasContent) {
      toast.error('La publicación no puede estar vacía.');
      return;
    }

    setIsLoading(true);
    try {
      let createdPost;

      // Preparar datos base del post
      const basePostData: CreatePostData = {
        content: content.trim(),
        post_type: postType,
        category: communityId ? 'other' : 'football',
        is_public: true,
      };

      // Manejar diferentes tipos de posts
      if (uploadedImageFile && (postType === 'image' || postType === 'highlight')) {
        // Crear post con archivo de imagen
        createdPost = await postsService.createPostWithImage(basePostData, uploadedImageFile);
      } else if (uploadedVideoFile && postType === 'video') {
        // Crear post con archivo de video
        createdPost = await postsService.createPostWithVideo(basePostData, uploadedVideoFile);
      } else {
        // Crear post con URLs o contenido de texto
        const postData: CreatePostData = {
          ...basePostData,
        };

        // Agregar URLs según el tipo
        if (imageUrls.some(url => url.trim())) {
          postData.images = imageUrls.filter(url => url.trim());
        }

        if (videoUrl.trim()) {
          postData.video = videoUrl.trim();
        }

        if (podcastUrl.trim() || uploadedPodcastFile) {
          postData.podcast_url = podcastUrl.trim() || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
        }

        if (streamingUrl.trim() || isLiveStreamingActive) {
          postData.streaming_url = streamingUrl.trim() || 'https://www.twitch.tv/live-stream';
        }

        createdPost = await postsService.createPost(postData);
      }

      // Convertir el post del backend al formato esperado por el frontend
      const newPost: Post = {
        id: createdPost.id,
        userId: createdPost.user.id,
        user: {
          id: createdPost.user.id,
          username: createdPost.user.username,
          displayName: createdPost.user.display_name,
          avatar: createdPost.user.avatar_url,
          isVerified: createdPost.user.is_verified,
        },
        content: createdPost.content,
        images: createdPost.images,
        video: createdPost.video,
        podcastUrl: createdPost.podcast_url,
        streamingUrl: createdPost.streaming_url,
        type: createdPost.post_type as any,
        category: createdPost.category,
        communityId: communityId,
        likes: createdPost.likes_count,
        celebrations: createdPost.celebrations_count,
        golazos: createdPost.golazos_count,
        comments: [],
        createdAt: createdPost.created_at,
      };

      onPostCreated(newPost);
      toast.success('¡Publicación creada con éxito!');
      
      // Reset form
      setContent('');
      setImageUrls([]);
      setUploadedImageFile(null);
      setVideoUrl('');
      setUploadedVideoFile(null);
      setPodcastUrl('');
      setUploadedPodcastFile(null);
      setStreamingUrl('');
      setIsLiveStreamingActive(false);
      setPostType('text');
      setVideoInputMode('url');
      setPodcastInputMode('url');
      setStreamingInputMode('url');
      if (imageFileInputRef.current) imageFileInputRef.current.value = '';
      if (videoFileInputRef.current) videoFileInputRef.current.value = '';
      if (podcastFileInputRef.current) podcastFileInputRef.current.value = '';
      onClose();
    } catch (error: any) {
      console.error('Error creating post:', error);
      toast.error(error.message || 'Error al crear la publicación.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] glass-card border-neon-green/20">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center space-x-2">
            <Plus size={20} className="text-neon-green" />
            <span>Crear Nueva Publicación {communityId ? `en Comunidad` : ''}</span>
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Comparte tus pensamientos, fotos o videos con la comunidad.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Post Type Selection */}
          <div className="flex flex-wrap gap-2 mb-4"> {/* Modificado para flex-wrap y gap */}
            <button
              onClick={() => setPostType('text')}
              className={cn(
                'flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex-shrink-0',
                postType === 'text' ? 'bg-neon-green/20 text-neon-green border border-neon-green/50' : 'bg-white/10 text-gray-300 hover:bg-white/20'
              )}
            >
              <MessageSquare size={16} />
              <span>Estado</span>
            </button>
            <button
              onClick={() => setPostType('image')}
              className={cn(
                'flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex-shrink-0',
                postType === 'image' ? 'bg-neon-green/20 text-neon-green border border-neon-green/50' : 'bg-white/10 text-gray-300 hover:bg-white/20'
              )}
            >
              <ImageIcon size={16} />
              <span>Imagen</span>
            </button>
            <button
              onClick={() => setPostType('video')}
              className={cn(
                'flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex-shrink-0',
                postType === 'video' ? 'bg-neon-green/20 text-neon-green border border-neon-green/50' : 'bg-white/10 text-gray-300 hover:bg-white/20'
              )}
            >
              <Video size={16} />
              <span>Video</span>
            </button>
            <button
              onClick={() => setPostType('podcast')}
              className={cn(
                'flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex-shrink-0',
                postType === 'podcast' ? 'bg-neon-green/20 text-neon-green border border-neon-green/50' : 'bg-white/10 text-gray-300 hover:bg-white/20'
              )}
            >
              <Mic size={16} />
              <span>Podcast</span>
            </button>
            <button
              onClick={() => setPostType('streaming')}
              className={cn(
                'flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex-shrink-0',
                postType === 'streaming' ? 'bg-neon-green/20 text-neon-green border border-neon-green/50' : 'bg-white/10 text-gray-300 hover:bg-white/20'
              )}
            >
              <Radio size={16} />
              <span>Streaming</span>
            </button>
            <button
              onClick={() => setPostType('highlight')}
              className={cn(
                'flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex-shrink-0',
                postType === 'highlight' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50' : 'bg-white/10 text-gray-300 hover:bg-white/20'
              )}
            >
              <Lightbulb size={16} />
              <span>Highlight</span>
            </button>
          </div>

          {/* Content Textarea */}
          <Textarea
            placeholder="¿Qué tienes en mente, Habilidoso?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px] bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-neon-green/50"
          />

          {/* Image URL/File Inputs */}
          {(postType === 'image' || postType === 'highlight') && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  ref={imageFileInputRef}
                  accept="image/*"
                  onChange={handleUploadedImageFileChange}
                  className="hidden"
                />
                <CyberButton 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => imageFileInputRef.current?.click()}
                  className="flex items-center space-x-2 w-full"
                >
                  <Upload size={16} />
                  <span>{uploadedImageFile ? `Imagen: ${uploadedImageFile.name}` : 'Subir Imagen Local'}</span>
                </CyberButton>
              </div>
              {uploadedImageFile && (
                <div className="mt-2 w-full h-32 relative rounded-lg overflow-hidden">
                  <img 
                    src={URL.createObjectURL(uploadedImageFile)} 
                    alt="Vista previa de imagen" 
                    className="w-full h-full object-cover" 
                  />
                </div>
              )}
              <div className="flex items-center space-x-2">
                <LinkIcon size={16} className="text-gray-400" />
                <Input
                  placeholder="O adjuntar URL de imagen (ej: https://ejemplo.com/imagen.jpg)"
                  value={imageUrls[0] || ''} // Solo un input para URL por simplicidad
                  onChange={(e) => handleImageUrlChange(0, e.target.value)}
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-neon-green/50"
                  disabled={!!uploadedImageFile} // Deshabilitar si ya hay un archivo local
                />
              </div>
              {imageUrls[0] && !uploadedImageFile && (
                <div className="mt-2 w-full h-32 relative rounded-lg overflow-hidden">
                  <img 
                    src={imageUrls[0]} 
                    alt="Vista previa de imagen" 
                    className="w-full h-full object-cover" 
                  />
                </div>
              )}
            </div>
          )}

          {/* Video URL/File Input */}
          {postType === 'video' && (
            <div className="space-y-3">
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="videoInputMode"
                    value="url"
                    checked={videoInputMode === 'url'}
                    onChange={() => setVideoInputMode('url')}
                    className="form-radio text-neon-green focus:ring-neon-green"
                  />
                  <span className="text-white">Adjuntar URL de Video</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="videoInputMode"
                    value="file"
                    checked={videoInputMode === 'file'}
                    onChange={() => setVideoInputMode('file')}
                    className="form-radio text-neon-green focus:ring-neon-green"
                  />
                  <span className="text-white">Subir Video Local</span>
                </label>
              </div>

              {videoInputMode === 'url' ? (
                <Input
                  placeholder="URL del video (YouTube, Vimeo, etc.)"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-neon-green/50"
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    ref={videoFileInputRef}
                    accept="video/*"
                    onChange={handleUploadedVideoFileChange}
                    className="hidden"
                  />
                  <CyberButton 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => videoFileInputRef.current?.click()}
                    className="flex items-center space-x-2 w-full"
                  >
                    <Upload size={16} />
                    <span>{uploadedVideoFile ? `Video: ${uploadedVideoFile.name}` : 'Seleccionar Archivo de Video'}</span>
                  </CyberButton>
                </div>
              )}
            </div>
          )}

          {/* Podcast URL/File Input */}
          {postType === 'podcast' && (
            <div className="space-y-3">
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="podcastInputMode"
                    value="url"
                    checked={podcastInputMode === 'url'}
                    onChange={() => setPodcastInputMode('url')}
                    className="form-radio text-neon-green focus:ring-neon-green"
                  />
                  <span className="text-white">Adjuntar URL de Podcast</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="podcastInputMode"
                    value="file"
                    checked={podcastInputMode === 'file'}
                    onChange={() => setPodcastInputMode('file')}
                    className="form-radio text-neon-green focus:ring-neon-green"
                  />
                  <span className="text-white">Subir Podcast Local</span>
                </label>
              </div>

              {podcastInputMode === 'url' ? (
                <Input
                  placeholder="URL del podcast (MP3, Spotify embed, etc.)"
                  value={podcastUrl}
                  onChange={(e) => setPodcastUrl(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-neon-green/50"
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    ref={podcastFileInputRef}
                    accept="audio/*"
                    onChange={handleUploadedPodcastFileChange}
                    className="hidden"
                  />
                  <CyberButton 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => podcastFileInputRef.current?.click()}
                    className="flex items-center space-x-2 w-full"
                  >
                    <Upload size={16} />
                    <span>{uploadedPodcastFile ? `Podcast: ${uploadedPodcastFile.name}` : 'Seleccionar Archivo de Podcast'}</span>
                  </CyberButton>
                </div>
              )}
            </div>
          )}

          {/* Streaming URL/Live Input */}
          {postType === 'streaming' && (
            <div className="space-y-3">
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="streamingInputMode"
                    value="url"
                    checked={streamingInputMode === 'url'}
                    onChange={() => setStreamingInputMode('url')}
                    className="form-radio text-neon-green focus:ring-neon-green"
                  />
                  <span className="text-white">Adjuntar URL de Streaming</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="streamingInputMode"
                    value="live"
                    checked={streamingInputMode === 'live'}
                    onChange={() => setStreamingInputMode('live')}
                    className="form-radio text-neon-green focus:ring-neon-green"
                  />
                  <span className="text-white">Iniciar Transmisión en Vivo</span>
                </label>
              </div>

              {streamingInputMode === 'url' ? (
                <Input
                  placeholder="URL del streaming (Twitch, YouTube Live, etc.)"
                  value={streamingUrl}
                  onChange={(e) => setStreamingUrl(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-neon-green/50"
                />
              ) : (
                <div className="flex flex-col space-y-2">
                  {isLiveStreamingActive ? (
                    <>
                      <p className="text-neon-green flex items-center space-x-2">
                        <PlayCircle size={20} className="animate-pulse" />
                        <span>¡Transmisión en vivo activa!</span>
                      </p>
                      <CyberButton variant="destructive" onClick={handleStopLiveStreaming}>
                        Finalizar Transmisión
                      </CyberButton>
                    </>
                  ) : (
                    <CyberButton onClick={handleStartLiveStreaming}>
                      Iniciar Transmisión en Vivo
                    </CyberButton>
                  )}
                  <p className="text-gray-400 text-sm">
                    (Esto es una simulación. En una aplicación real, se iniciaría una transmisión real desde tu dispositivo.)
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <CyberButton variant="outline" onClick={onClose}>
            Cancelar
          </CyberButton>
          <CyberButton onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Publicando...' : 'Publicar'}
          </CyberButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* Modal de Streaming */}
    {isStreamingModalOpen && (
      <StreamingModal
        isOpen={isStreamingModalOpen}
        onClose={() => setIsStreamingModalOpen(false)}
      />
    )}
  </>
  );
}