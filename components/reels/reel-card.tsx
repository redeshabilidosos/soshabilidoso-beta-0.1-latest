'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  UserPlus,
  Verified,
  MoreHorizontal,
  ChevronUp,
  ChevronDown,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ReelComments } from './reel-comments';
import { UserProfileDialog } from '@/components/ui/user-profile-dialog';
import { ReelOptionsMenu } from './reel-options-menu';
import { UploadReelModal } from './upload-reel-modal';

interface Reel {
  id: string;
  videoUrl: string;
  thumbnail: string;
  title: string;
  description: string;
  user: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
    isVerified: boolean;
    isFollowing?: boolean;
  };
  likes: number;
  comments: number;
  shares: number;
  views: number;
  isLiked: boolean;
  createdAt: string;
  tags: string[];
}

interface ReelCardProps {
  reel: Reel;
  isActive: boolean;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
  onFollow: () => void;
  onView?: () => void;
}

export function ReelCard({
  reel,
  isActive,
  onLike,
  onComment,
  onShare,
  onFollow,
  onView
}: ReelCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // Iniciar con audio activado
  const [showControls, setShowControls] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isInfoExpanded, setIsInfoExpanded] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [isPaused, setIsPaused] = useState(false); // Para el hold/press
  const [showLikeAnimation, setShowLikeAnimation] = useState(false); // Animación de like
  const [showUserProfile, setShowUserProfile] = useState(false); // Modal de perfil
  const [showUploadModal, setShowUploadModal] = useState(false); // Modal de upload
  const [viewCounted, setViewCounted] = useState(false); // Para evitar contar múltiples veces
  const lastTapRef = useRef<number>(0);
  const holdTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isHoldingRef = useRef(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Log para debug
  useEffect(() => {
    console.log('🎬 ReelCard montado:', {
      id: reel.id,
      videoUrl: reel.videoUrl,
      user: reel.user.username
    });
  }, [reel.id, reel.videoUrl, reel.user.username]);
  // Estado para comentarios reales
  const [comments, setComments] = useState<any[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);

  // Cargar comentarios reales cuando se abren
  const loadComments = async () => {
    if (loadingComments) return;
    
    setLoadingComments(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const response = await fetch(`http://127.0.0.1:8000/api/reels/${reel.id}/comments/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const mappedComments = data.results?.map((comment: any) => ({
          id: comment.id,
          user: {
            id: comment.author.id,
            username: comment.author.username,
            displayName: comment.author.display_name || comment.author.username,
            avatar: comment.author.avatar || '/logo.png',
            isVerified: comment.author.is_verified || false
          },
          content: comment.content,
          likes: comment.likes_count || 0,
          isLiked: comment.is_liked || false,
          createdAt: comment.created_at,
          parent: comment.parent,
          replies: [] // Se llenarán después
        })) || [];
        
        // Organizar comentarios y respuestas
        const mainComments = mappedComments.filter((comment: any) => !comment.parent);
        const replies = mappedComments.filter((comment: any) => comment.parent);
        
        // Agregar respuestas a sus comentarios padre
        mainComments.forEach((comment: any) => {
          comment.replies = replies.filter((reply: any) => reply.parent === comment.id);
        });
        
        setComments(mainComments);
      } else {
        console.error('❌ Error cargando comentarios:', response.status);
      }
    } catch (error) {
      console.error('❌ Error cargando comentarios:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  // Auto play/pause based on active state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    console.log('🎬 Reel activo:', isActive, 'Video URL:', reel.videoUrl);

    if (isActive) {
      // Intentar cargar el video primero
      video.load();
      
      // Iniciar con audio activado
      video.muted = false;
      setIsMuted(false);
      
      video.play().then(() => {
        console.log('▶️ Video reproduciendo con audio');
        setIsPlaying(true);
        
        // Contar vista después de 3 segundos de reproducción
        if (!viewCounted && onView) {
          setTimeout(() => {
            if (isActive && !viewCounted) {
              onView();
              setViewCounted(true);
            }
          }, 3000);
        }
      }).catch((error) => {
        console.error('❌ Error reproduciendo video:', error);
        // Si falla por autoplay policy, intentar con mute
        video.muted = true;
        setIsMuted(true);
        video.play().then(() => {
          console.log('▶️ Video reproduciendo (muteado por política de autoplay)');
          setIsPlaying(true);
          
          // Contar vista después de 3 segundos
          if (!viewCounted && onView) {
            setTimeout(() => {
              if (isActive && !viewCounted) {
                onView();
                setViewCounted(true);
              }
            }, 3000);
          }
        }).catch(err => {
          console.error('❌ Error reproduciendo video muteado:', err);
        });
      });
    } else {
      video.pause();
      setIsPlaying(false);
      setViewCounted(false); // Reset cuando cambia de reel
    }
  }, [isActive, reel.videoUrl]);

  // Update progress
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      const currentTime = video.currentTime;
      const duration = video.duration;
      const progress = (currentTime / duration) * 100;
      
      if (!isDragging) {
        setProgress(progress);
        setCurrentTime(currentTime);
        setDuration(duration);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    
    return () => {
      video.removeEventListener('timeupdate', updateProgress);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [isDragging]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  // Función para formatear tiempo (mm:ss)
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Manejar click en la barra de progreso
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    const progressBar = progressBarRef.current;
    if (!video || !progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = (clickX / rect.width) * 100;
    const newTime = (percentage / 100) * video.duration;

    video.currentTime = newTime;
    setProgress(percentage);
    setCurrentTime(newTime);
  };

  // Manejar arrastre en la barra de progreso
  const handleProgressBarDragStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    const video = videoRef.current;
    if (video && isPlaying) {
      video.pause();
    }
  };

  const handleProgressBarDrag = (e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    
    const video = videoRef.current;
    const progressBar = progressBarRef.current;
    if (!video || !progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clickX = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
    const newTime = (percentage / 100) * video.duration;

    setProgress(percentage);
    setCurrentTime(newTime);
  };

  const handleProgressBarDragEnd = () => {
    if (!isDragging) return;
    
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = currentTime;
    setIsDragging(false);
    
    if (isPlaying) {
      video.play();
    }
  };

  // Agregar event listeners para el arrastre
  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e: MouseEvent) => handleProgressBarDrag(e);
      const handleMouseUp = () => handleProgressBarDragEnd();
      const handleTouchMove = (e: TouchEvent) => handleProgressBarDrag(e);
      const handleTouchEnd = () => handleProgressBarDragEnd();

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, currentTime]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Manejar doble tap para dar like
  const handleDoubleTap = () => {
    if (!reel.isLiked) {
      onLike();
    }
    // Mostrar animación de corazón
    setShowLikeAnimation(true);
    setTimeout(() => setShowLikeAnimation(false), 1000);
  };

  // Manejar click/tap en el video
  const handleVideoClick = (e: React.MouseEvent | React.TouchEvent) => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTapRef.current;
    
    // Si fue un doble tap (menos de 300ms entre taps)
    if (timeSinceLastTap < 300 && timeSinceLastTap > 0) {
      handleDoubleTap();
      lastTapRef.current = 0; // Reset para evitar triple tap
    } else {
      lastTapRef.current = now;
    }
  };

  // Manejar inicio de presión (hold)
  const handlePressStart = (e: React.MouseEvent | React.TouchEvent) => {
    isHoldingRef.current = false;
    
    holdTimeoutRef.current = setTimeout(() => {
      isHoldingRef.current = true;
      const video = videoRef.current;
      if (video && isPlaying) {
        video.pause();
        setIsPaused(true);
      }
    }, 200); // 200ms para considerar como hold
  };

  // Manejar fin de presión
  const handlePressEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
    
    // Si estaba en hold, reanudar el video
    if (isHoldingRef.current && isPaused) {
      const video = videoRef.current;
      if (video) {
        video.play();
        setIsPaused(false);
      }
      isHoldingRef.current = false;
    }
  };

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (holdTimeoutRef.current) {
        clearTimeout(holdTimeoutRef.current);
      }
    };
  }, []);

  const handleCommentClick = () => {
    setShowComments(true);
    loadComments(); // Cargar comentarios reales
    onComment(); // Llamar la función original también
  };

  const handleAddComment = async (content: string, parentId?: string) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error('No hay token de autenticación');
        return;
      }

      // Enviar comentario a la API
      const response = await fetch(`http://127.0.0.1:8000/api/reels/${reel.id}/comments/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content,
          parent: parentId || null
        }),
      });

      if (response.ok) {
        const newCommentData = await response.json();
        const newComment = {
          id: newCommentData.id,
          user: {
            id: newCommentData.author.id,
            username: newCommentData.author.username,
            displayName: newCommentData.author.display_name || newCommentData.author.username,
            avatar: newCommentData.author.avatar || '/logo.png',
            isVerified: newCommentData.author.is_verified || false
          },
          content: newCommentData.content,
          likes: newCommentData.likes_count || 0,
          isLiked: newCommentData.is_liked || false,
          createdAt: newCommentData.created_at,
          parent: newCommentData.parent
        };
        
        if (parentId) {
          // Es una respuesta, agregar a las respuestas del comentario padre
          setComments(prev => 
            prev.map(comment => {
              if (comment.id === parentId) {
                return {
                  ...comment,
                  replies: [...(comment.replies || []), newComment]
                };
              }
              return comment;
            })
          );
        } else {
          // Es un comentario principal, agregar al inicio
          setComments(prev => [newComment, ...prev]);
        }
        
        console.log('✅ Comentario agregado:', newComment);
      } else {
        const errorData = await response.json();
        console.error('❌ Error al agregar comentario:', response.status, errorData);
      }
    } catch (error) {
      console.error('❌ Error al agregar comentario:', error);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error('No hay token de autenticación');
        return;
      }

      // Actualizar UI optimistamente
      setComments(prev => 
        prev.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              isLiked: !comment.isLiked,
              likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
            };
          }
          return comment;
        })
      );

      // Enviar like a la API
      const response = await fetch(`http://127.0.0.1:8000/api/reels/${reel.id}/comments/${commentId}/like/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Like en comentario actualizado:', data);
      } else {
        // Revertir cambio si falla
        setComments(prev => 
          prev.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                isLiked: !comment.isLiked,
                likes: comment.isLiked ? comment.likes + 1 : comment.likes - 1
              };
            }
            return comment;
          })
        );
      }
    } catch (error) {
      console.error('❌ Error al dar like al comentario:', error);
      // Revertir cambio si falla
      setComments(prev => 
        prev.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              isLiked: !comment.isLiked,
              likes: comment.isLiked ? comment.likes + 1 : comment.likes - 1
            };
          }
          return comment;
        })
      );
    }
  };

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
      {/* Video Container */}
      <div className="relative w-full h-full flex items-center justify-center">
        <video
          ref={videoRef}
          className="max-w-full max-h-full w-auto h-auto object-contain cursor-pointer"
          loop
          muted={isMuted}
          playsInline
          preload="auto"
          poster={reel.thumbnail}
          onClick={handleVideoClick}
          onMouseDown={handlePressStart}
          onMouseUp={handlePressEnd}
          onMouseLeave={(e) => {
            handlePressEnd(e);
            setShowControls(false);
          }}
          onTouchStart={handlePressStart}
          onTouchEnd={handlePressEnd}
          onMouseEnter={() => setShowControls(true)}
          crossOrigin="anonymous"
          controls={false}
          onError={(e) => {
            console.error('❌ Error cargando video:', e);
            console.log('Video URL:', reel.videoUrl);
            console.log('Error details:', e.currentTarget.error);
          }}
          onLoadedData={() => {
            console.log('✅ Video cargado correctamente');
          }}
          onCanPlay={() => {
            console.log('✅ Video listo para reproducir');
          }}
        >
          <source src={reel.videoUrl} type="video/mp4" />
          Tu navegador no soporta el elemento de video.
        </video>
      </div>

      {/* Animación de Like (doble tap) */}
      {showLikeAnimation && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <Heart 
            className="w-32 h-32 text-red-500 fill-current animate-ping" 
            style={{ animationDuration: '0.5s' }}
          />
        </div>
      )}

      {/* Indicador de pausa (hold) */}
      {isPaused && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none z-10">
          <Pause className="w-16 h-16 text-white/80" />
        </div>
      )}

      {/* Play Button Overlay - Solo cuando el video está detenido y no en pausa por hold */}
      {!isPlaying && !isPaused && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <button
            onClick={togglePlayPause}
            className="w-20 h-20 rounded-full bg-neon-green/80 flex items-center justify-center hover:bg-neon-green transition-all"
          >
            <Play className="w-10 h-10 text-black ml-1" fill="currentColor" />
          </button>
        </div>
      )}

      {/* Progress Bar - Interactiva */}
      <div className="absolute bottom-0 left-0 right-0 z-30 group/progress">
        <div 
          ref={progressBarRef}
          className="relative h-1 bg-white/20 cursor-pointer group-hover/progress:h-2 transition-all duration-200"
          onClick={handleProgressBarClick}
          onMouseDown={handleProgressBarDragStart}
          onTouchStart={handleProgressBarDragStart}
        >
          {/* Barra de progreso */}
          <div 
            className="absolute top-0 left-0 h-full bg-neon-green transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
          
          {/* Indicador de posición (thumb) */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-neon-green rounded-full shadow-lg opacity-0 group-hover/progress:opacity-100 transition-opacity duration-200"
            style={{ left: `${progress}%`, transform: 'translate(-50%, -50%)' }}
          />
          
          {/* Tooltip con tiempo */}
          <div 
            className="absolute -top-8 left-0 bg-black/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded opacity-0 group-hover/progress:opacity-100 transition-opacity duration-200 pointer-events-none"
            style={{ left: `${progress}%`, transform: 'translateX(-50%)' }}
          >
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
      </div>



      {/* Top Controls */}
      <div className="absolute top-4 right-4 flex items-center space-x-2 z-10">
        {/* Pause Button */}
        <button
          onClick={togglePlayPause}
          className="bg-black/50 backdrop-blur-sm rounded-full p-2 hover:bg-black/70 transition-colors"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 text-white" />
          ) : (
            <Play className="w-5 h-5 text-white" />
          )}
        </button>
        
        {/* Mute Button */}
        <button
          onClick={toggleMute}
          className="bg-black/50 backdrop-blur-sm rounded-full p-2 hover:bg-black/70 transition-colors"
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-white" />
          ) : (
            <Volume2 className="w-5 h-5 text-white" />
          )}
        </button>
        
        {/* More Options Button with Dropdown */}
        <ReelOptionsMenu reelId={reel.id} />
      </div>

      {/* User Info & Actions Overlay */}
      <div className={cn(
        "absolute bottom-0 left-0 right-0 pb-20 lg:pb-4 px-4 transition-all duration-300",
        isInfoExpanded 
          ? "bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-8" 
          : "bg-transparent pt-2"
      )}>
        {/* Collapse/Expand Button - Visible en ambos estados */}
        {isInfoExpanded ? (
          <div className="flex justify-center mb-2">
            <button
              onClick={() => setIsInfoExpanded(!isInfoExpanded)}
              className="bg-black/60 backdrop-blur-sm rounded-full p-2 hover:bg-black/80 transition-all duration-300 hover:scale-110 border border-white/20"
            >
              <ChevronDown className="w-4 h-4 text-white" />
            </button>
          </div>
        ) : (
          <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-30 animate-in fade-in duration-300">
            <button
              onClick={() => setIsInfoExpanded(!isInfoExpanded)}
              className="bg-black/70 backdrop-blur-sm rounded-full p-3 hover:bg-black/90 transition-all duration-300 hover:scale-110 border-2 border-neon-green/50 shadow-lg shadow-neon-green/20"
            >
              <ChevronUp className="w-5 h-5 text-neon-green" />
            </button>
          </div>
        )}

        <div className={cn(
          "transition-all duration-300 overflow-hidden",
          isInfoExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}>
          <div className="flex items-end justify-between">
          {/* Left Side - User Info & Description */}
          <div className="flex-1 mr-4">
            {/* User Info */}
            <div className="flex items-center space-x-3 mb-4">
              <div 
                className="relative cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowUserProfile(true);
                }}
              >
                <Image
                  src={reel.user.avatar}
                  alt={reel.user.displayName}
                  width={36}
                  height={36}
                  className="rounded-full ring-2 ring-white/30 hover:ring-neon-green/50 transition-all"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span 
                    className="text-white font-bold text-sm drop-shadow-md cursor-pointer hover:text-neon-green transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowUserProfile(true);
                    }}
                  >
                    @{reel.user.username}
                  </span>
                  {reel.user.isVerified && (
                    <Verified className="w-4 h-4 text-neon-green fill-current drop-shadow-sm" />
                  )}
                </div>
                <span 
                  className="text-white/90 text-xs drop-shadow-sm cursor-pointer hover:text-white transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUserProfile(true);
                  }}
                >
                  {reel.user.displayName}
                </span>
              </div>
              <button
                onClick={onFollow}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-bold transition-colors flex items-center space-x-1 shadow-lg",
                  reel.user.isFollowing 
                    ? "bg-gray-600 text-white hover:bg-gray-700" 
                    : "bg-neon-green text-black hover:bg-neon-green/80"
                )}
              >
                <UserPlus className="w-3 h-3" />
                <span>{reel.user.isFollowing ? 'Siguiendo' : 'Seguir'}</span>
              </button>
            </div>

            {/* Title & Description */}
            <div className="mb-3">
              <h3 className="text-white font-bold text-sm mb-2 line-clamp-1 drop-shadow-lg">
                {reel.title}
              </h3>
              <p className="text-white text-xs line-clamp-3 leading-relaxed drop-shadow-md">
                {reel.description}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {reel.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="text-neon-green text-xs font-bold drop-shadow-md bg-black/30 px-2 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-3 text-white/90 text-xs font-medium drop-shadow-sm">
              <span>{formatNumber(reel.views)} vistas</span>
              <span>•</span>
              <span>{new Date(reel.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Right Side - Action Buttons */}
          <div className="flex flex-col items-center space-y-3 mb-4">
            {/* Upload Button */}
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex flex-col items-center space-y-1 group"
            >
              <div className="bg-neon-green/20 backdrop-blur-sm rounded-full p-3 hover:bg-neon-green/30 transition-all duration-300 group-hover:scale-110 border border-neon-green/40">
                <Plus className="w-6 h-6 text-neon-green" />
              </div>
              <span className="text-white text-xs font-medium">Subir</span>
            </button>

            {/* Like Button */}
            <button
              onClick={onLike}
              className="flex flex-col items-center space-y-1 group"
            >
              <div className={cn(
                "bg-black/60 backdrop-blur-sm rounded-full p-2.5 transition-all duration-300 group-hover:scale-110",
                reel.isLiked ? "bg-red-500/20" : "hover:bg-white/20"
              )}>
                <Heart 
                  className={cn(
                    "w-5 h-5 transition-colors",
                    reel.isLiked ? "text-red-500 fill-current" : "text-white"
                  )} 
                />
              </div>
              <span className="text-white text-xs font-medium">
                {formatNumber(reel.likes)}
              </span>
            </button>

            {/* Comment Button */}
            <button
              onClick={handleCommentClick}
              className="flex flex-col items-center space-y-1 group"
            >
              <div className="bg-black/60 backdrop-blur-sm rounded-full p-2.5 hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-white text-xs font-medium">
                {formatNumber(reel.comments)}
              </span>
            </button>

            {/* Share Button */}
            <button
              onClick={onShare}
              className="flex flex-col items-center space-y-1 group"
            >
              <div className="bg-black/60 backdrop-blur-sm rounded-full p-2.5 hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
                <Share2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-white text-xs font-medium">
                {formatNumber(reel.shares)}
              </span>
            </button>
          </div>
        </div>
        </div>

        {/* Always visible action buttons when collapsed */}
        {!isInfoExpanded && (
          <div className="flex justify-between items-end animate-in slide-in-from-bottom duration-300">
            {/* Minimal user info when collapsed */}
            <div className="flex items-center space-x-2">
              <Image
                src={reel.user.avatar}
                alt={reel.user.displayName}
                width={32}
                height={32}
                className="rounded-full ring-2 ring-white/20 cursor-pointer hover:ring-neon-green/50 transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowUserProfile(true);
                }}
              />
              <span 
                className="text-white font-bold text-sm drop-shadow-md cursor-pointer hover:text-neon-green transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowUserProfile(true);
                }}
              >
                @{reel.user.username}
              </span>
              {reel.user.isVerified && (
                <Verified className="w-4 h-4 text-neon-green fill-current" />
              )}
            </div>
            <div className="flex flex-col items-center space-y-3">
              {/* Like Button */}
              <button
                onClick={onLike}
                className="flex flex-col items-center space-y-1 group"
              >
                <div className={cn(
                  "bg-black/60 backdrop-blur-sm rounded-full p-2.5 transition-all duration-300 group-hover:scale-110",
                  reel.isLiked ? "bg-red-500/20" : "hover:bg-white/20"
                )}>
                  <Heart 
                    className={cn(
                      "w-5 h-5 transition-colors",
                      reel.isLiked ? "text-red-500 fill-current" : "text-white"
                    )} 
                  />
                </div>
                <span className="text-white text-xs font-medium">
                  {formatNumber(reel.likes)}
                </span>
              </button>

              {/* Comment Button */}
              <button
                onClick={handleCommentClick}
                className="flex flex-col items-center space-y-1 group"
              >
                <div className="bg-black/60 backdrop-blur-sm rounded-full p-2.5 hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <span className="text-white text-xs font-medium">
                  {formatNumber(reel.comments)}
                </span>
              </button>

              {/* Share Button */}
              <button
                onClick={onShare}
                className="flex flex-col items-center space-y-1 group"
              >
                <div className="bg-black/60 backdrop-blur-sm rounded-full p-2.5 hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
                  <Share2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-white text-xs font-medium">
                  {formatNumber(reel.shares)}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Comments Modal */}
      <ReelComments
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        reelId={reel.id}
        comments={comments}
        onAddComment={handleAddComment}
        onLikeComment={handleLikeComment}
      />

      {/* User Profile Dialog */}
      <UserProfileDialog
        isOpen={showUserProfile}
        onClose={() => setShowUserProfile(false)}
        profileUser={{
          id: reel.user.id,
          username: reel.user.username,
          displayName: reel.user.displayName,
          avatar: reel.user.avatar,
          email: '',
          bio: '',
          coverPhoto: undefined,
          position: '',
          team: '',
          followers: 0,
          following: 0,
          posts: 0,
          interests: [],
          createdAt: new Date().toISOString(),
        }}
      />

      {/* Upload Reel Modal */}
      <UploadReelModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onReelUploaded={(newReel) => {
          console.log('✅ Nuevo reel subido:', newReel);
          // Aquí podrías actualizar la lista de reels si es necesario
          setShowUploadModal(false);
        }}
      />
    </div>
  );
}