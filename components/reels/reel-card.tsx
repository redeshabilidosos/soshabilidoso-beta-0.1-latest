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
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ReelComments } from './reel-comments';
import { UserProfileDialog } from '@/components/ui/user-profile-dialog';

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
  const [isInfoExpanded, setIsInfoExpanded] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [isPaused, setIsPaused] = useState(false); // Para el hold/press
  const [showLikeAnimation, setShowLikeAnimation] = useState(false); // Animación de like
  const [showUserProfile, setShowUserProfile] = useState(false); // Modal de perfil
  const [viewCounted, setViewCounted] = useState(false); // Para evitar contar múltiples veces
  const lastTapRef = useRef<number>(0);
  const holdTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isHoldingRef = useRef(false);

  // Log para debug
  useEffect(() => {
    console.log('🎬 ReelCard montado:', {
      id: reel.id,
      videoUrl: reel.videoUrl,
      user: reel.user.username
    });
  }, [reel.id, reel.videoUrl, reel.user.username]);
  const [comments, setComments] = useState([
    {
      id: '1',
      user: {
        id: '1',
        username: 'fitness_lover',
        displayName: 'Fitness Lover',
        avatar: '/api/placeholder/40/40?text=FL',
        isVerified: false
      },
      content: '¡Excelente rutina! Me encanta que sea en casa 💪',
      likes: 12,
      isLiked: false,
      createdAt: '2024-01-20T10:30:00Z'
    },
    {
      id: '2',
      user: {
        id: '2',
        username: 'healthy_life',
        displayName: 'Healthy Life',
        avatar: '/api/placeholder/40/40?text=HL',
        isVerified: true
      },
      content: '¿Cuántas repeticiones recomiendas para principiantes?',
      likes: 8,
      isLiked: true,
      createdAt: '2024-01-20T11:15:00Z'
    }
  ]);

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
      const progress = (video.currentTime / video.duration) * 100;
      setProgress(progress);
    };

    video.addEventListener('timeupdate', updateProgress);
    return () => video.removeEventListener('timeupdate', updateProgress);
  }, []);

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
    onComment(); // Llamar la función original también
  };

  const handleAddComment = (content: string) => {
    const newComment = {
      id: Date.now().toString(),
      user: {
        id: 'current_user',
        username: 'tu_usuario',
        displayName: 'Tu Usuario',
        avatar: '/api/placeholder/40/40?text=TU',
        isVerified: false
      },
      content,
      likes: 0,
      isLiked: false,
      createdAt: new Date().toISOString()
    };
    setComments(prev => [newComment, ...prev]);
  };

  const handleLikeComment = (commentId: string) => {
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
  };

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {/* Video */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover cursor-pointer"
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

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <div 
          className="h-full bg-neon-green transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>



      {/* Top Controls */}
      <div className="absolute top-4 right-4 flex items-center space-x-2 z-10">
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
        <button className="bg-black/50 backdrop-blur-sm rounded-full p-2 hover:bg-black/70 transition-colors">
          <MoreHorizontal className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* User Info & Actions Overlay */}
      <div className="absolute bottom-0 left-0 right-0 pb-20 lg:pb-4 px-4 pt-8 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
        {/* Collapse/Expand Button */}
        <div className="flex justify-center mb-2">
          <button
            onClick={() => setIsInfoExpanded(!isInfoExpanded)}
            className="bg-black/60 backdrop-blur-sm rounded-full p-2 hover:bg-black/80 transition-all duration-300 hover:scale-110 border border-white/20"
          >
            {isInfoExpanded ? (
              <ChevronDown className="w-4 h-4 text-white" />
            ) : (
              <ChevronUp className="w-4 h-4 text-white" />
            )}
          </button>
        </div>
        
        {/* Info indicator when collapsed */}
        {!isInfoExpanded && (
          <div className="flex justify-center mb-2">
            <div className="bg-neon-green/20 backdrop-blur-sm rounded-full px-3 py-1 border border-neon-green/30">
              <span className="text-neon-green text-xs font-medium">Toca ↑ para ver info</span>
            </div>
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
                className="bg-neon-green text-black px-3 py-1.5 rounded-full text-xs font-bold hover:bg-neon-green/80 transition-colors flex items-center space-x-1 shadow-lg"
              >
                <UserPlus className="w-3 h-3" />
                <span>Seguir</span>
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
          <div className="flex justify-between items-end pr-4 pb-4">
            {/* Minimal user info when collapsed */}
            <div className="flex items-center space-x-2 pl-4">
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
    </div>
  );
}