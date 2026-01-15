'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Plus, X, ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, Heart, PartyPopper, Flame, ThumbsUp, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserProfileDialog } from '@/components/ui/user-profile-dialog';
import { User } from '@/types/user';
import { storiesService } from '@/lib/services/stories.service';

export interface Story {
  id: string;
  userId: string;
  user: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
  };
  mediaUrl: string;
  mediaType: 'image' | 'video';
  createdAt: string;
  expiresAt: string;
  viewed: boolean;
}

export interface UserStories {
  user: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
  };
  stories: Story[];
  hasUnviewed: boolean;
}

interface StoriesSliderProps {
  userStories: UserStories[];
  currentUserId?: string;
  currentUser?: {
    id: string;
    username: string;
    displayName?: string;
    avatar?: string;
  };
  onAddStory?: () => void;
  onStoryViewed?: (storyId: string) => void;
}

// Componente del avatar con borde animado
const StoryAvatar = ({ 
  userStory, 
  onClick, 
  isCurrentUser = false,
  onAddClick
}: { 
  userStory: UserStories; 
  onClick: () => void;
  isCurrentUser?: boolean;
  onAddClick?: () => void;
}) => {
  const hasStories = userStory.stories.length > 0;
  const hasUnviewed = userStory.hasUnviewed;

  return (
    <div className="flex flex-col items-center space-y-1 min-w-[70px] cursor-pointer group">
      <div 
        className="relative p-[3px]"
        onClick={hasStories ? onClick : (isCurrentUser ? onAddClick : undefined)}
      >
        {/* Borde animado con gradiente - contenedor exterior */}
        <div className={cn(
          "absolute inset-0 rounded-full",
          hasStories && hasUnviewed 
            ? "bg-gradient-to-tr from-neon-green via-neon-blue to-neon-purple"
            : hasStories 
              ? "bg-gradient-to-tr from-gray-500 to-gray-600"
              : "bg-gray-700/50"
        )}>
          {/* Animación de rotación del gradiente */}
          {hasStories && hasUnviewed && (
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-neon-green via-neon-blue to-neon-purple animate-spin-slow opacity-80" />
          )}
        </div>
        
        {/* Avatar */}
        <Avatar className={cn(
          "w-14 h-14 border-[3px] border-[#0a0a0f] relative z-10 transition-transform group-hover:scale-105"
        )}>
          <AvatarImage 
            src={userStory.user.avatar} 
            alt={userStory.user.displayName}
            className="object-cover"
          />
          <AvatarFallback className="bg-dark-lighter text-white">
            {userStory.user.displayName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* Botón de agregar historia para el usuario actual */}
        {isCurrentUser && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddClick?.();
            }}
            className="absolute -bottom-1 -right-1 w-5 h-5 bg-neon-green rounded-full flex items-center justify-center z-20 hover:bg-neon-green/80 transition-colors"
          >
            <Plus size={12} className="text-black" />
          </button>
        )}
      </div>
      
      <span className="text-xs text-gray-400 truncate max-w-[60px] group-hover:text-white transition-colors">
        {isCurrentUser ? 'Tu historia' : userStory.user.displayName.split(' ')[0]}
      </span>
    </div>
  );
};


// Tipos de reacciones disponibles
const STORY_REACTIONS = [
  { type: 'like', icon: Heart, color: 'text-red-500', bg: 'bg-red-500', emoji: '❤️' },
  { type: 'fire', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500', emoji: '🔥' },
  { type: 'celebrate', icon: PartyPopper, color: 'text-yellow-500', bg: 'bg-yellow-500', emoji: '🎉' },
  { type: 'thumbsup', icon: ThumbsUp, color: 'text-neon-green', bg: 'bg-neon-green', emoji: '👍' },
];

// Componente de partícula flotante para efecto de reacción
const FloatingReaction = ({ emoji, onComplete }: { emoji: string; onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const randomX = Math.random() * 60 - 30; // -30 a 30
  const randomDelay = Math.random() * 0.3;

  return (
    <div 
      className="absolute bottom-20 left-1/2 pointer-events-none z-30 animate-float-up"
      style={{
        transform: `translateX(${randomX}px)`,
        animationDelay: `${randomDelay}s`,
      }}
    >
      <span className="text-4xl drop-shadow-lg">{emoji}</span>
    </div>
  );
};

// Visor de historias en pantalla completa con swipe
const StoryViewer = ({
  isOpen,
  onClose,
  userStories,
  initialUserIndex,
  onStoryViewed,
  onStoryReaction
}: {
  isOpen: boolean;
  onClose: () => void;
  userStories: UserStories[];
  initialUserIndex: number;
  onStoryViewed?: (storyId: string) => void;
  onStoryReaction?: (storyId: string, reactionType: string) => void;
}) => {
  const [currentUserIndex, setCurrentUserIndex] = useState(initialUserIndex);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [floatingReactions, setFloatingReactions] = useState<{ id: number; emoji: string }[]>([]);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [replyText, setReplyText] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const reactionIdRef = useRef(0);
  
  // Estados para swipe/touch
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Set para evitar llamadas duplicadas a markAsViewed
  const viewedStoriesRef = useRef<Set<string>>(new Set());

  const currentUser = userStories[currentUserIndex];
  const currentStory = currentUser?.stories[currentStoryIndex];
  
  // Duración de 20 segundos para imágenes, 30 para videos
  const STORY_DURATION = currentStory?.mediaType === 'video' ? 30000 : 20000;
  const minSwipeDistance = 50;

  useEffect(() => {
    setCurrentUserIndex(initialUserIndex);
    setCurrentStoryIndex(0);
    setProgress(0);
    // Limpiar el set de vistas cuando se abre el visor
    if (isOpen) {
      viewedStoriesRef.current.clear();
    }
  }, [initialUserIndex, isOpen]);

  useEffect(() => {
    if (currentStory && !viewedStoriesRef.current.has(currentStory.id)) {
      // Marcar como vista solo si no se ha visto antes en esta sesión
      viewedStoriesRef.current.add(currentStory.id);
      storiesService.markAsViewed(currentStory.id).catch(() => {
        // Si falla, remover del set para permitir reintentar
        viewedStoriesRef.current.delete(currentStory.id);
      });
      if (onStoryViewed) {
        onStoryViewed(currentStory.id);
      }
    }
  }, [currentStory?.id, onStoryViewed]);

  // Temporizador de progreso
  useEffect(() => {
    if (!isOpen || isPaused || isDragging) return;

    progressInterval.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          goToNextStory();
          return 0;
        }
        return prev + (100 / (STORY_DURATION / 100));
      });
    }, 100);

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [isOpen, isPaused, isDragging, currentStoryIndex, currentUserIndex, STORY_DURATION]);

  const goToNextStory = useCallback(() => {
    if (currentStoryIndex < currentUser.stories.length - 1) {
      // Siguiente historia del mismo usuario
      setCurrentStoryIndex(prev => prev + 1);
      setProgress(0);
    } else if (currentUserIndex < userStories.length - 1) {
      // Siguiente usuario
      setCurrentUserIndex(prev => prev + 1);
      setCurrentStoryIndex(0);
      setProgress(0);
    } else {
      // Fin de todas las historias
      onClose();
    }
  }, [currentStoryIndex, currentUserIndex, currentUser?.stories.length, userStories.length, onClose]);

  const goToPrevStory = useCallback(() => {
    if (currentStoryIndex > 0) {
      // Historia anterior del mismo usuario
      setCurrentStoryIndex(prev => prev - 1);
      setProgress(0);
    } else if (currentUserIndex > 0) {
      // Usuario anterior
      setCurrentUserIndex(prev => prev - 1);
      const prevUser = userStories[currentUserIndex - 1];
      setCurrentStoryIndex(prevUser.stories.length - 1);
      setProgress(0);
    }
  }, [currentStoryIndex, currentUserIndex, userStories]);

  // Handlers para swipe táctil
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const currentTouch = e.targetTouches[0].clientX;
    setTouchEnd(currentTouch);
    setDragOffset(currentTouch - touchStart);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setIsDragging(false);
      setDragOffset(0);
      return;
    }
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      goToNextStory();
    } else if (isRightSwipe) {
      goToPrevStory();
    }
    
    setIsDragging(false);
    setDragOffset(0);
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Handlers para mouse (desktop)
  const onMouseDown = (e: React.MouseEvent) => {
    setTouchStart(e.clientX);
    setIsDragging(true);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !touchStart) return;
    setDragOffset(e.clientX - touchStart);
  };

  const onMouseUp = (e: React.MouseEvent) => {
    if (!touchStart) {
      setIsDragging(false);
      return;
    }
    
    const distance = touchStart - e.clientX;
    
    // Si no hubo movimiento significativo, tratar como tap
    if (Math.abs(distance) < 10) {
      handleTap(e);
    } else if (distance > minSwipeDistance) {
      goToNextStory();
    } else if (distance < -minSwipeDistance) {
      goToPrevStory();
    }
    
    setIsDragging(false);
    setDragOffset(0);
    setTouchStart(null);
  };

  const handleTap = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const width = rect.width;
    const height = rect.height;
    
    // Ignorar taps en la zona de reacciones (parte inferior)
    if (y > height - 120) return;
    
    if (x < width / 3) {
      goToPrevStory();
    } else if (x > (width * 2) / 3) {
      goToNextStory();
    } else {
      setIsPaused(prev => !prev);
    }
  };

  const handleReaction = (reactionType: string, emoji: string) => {
    const newReactions = Array.from({ length: 5 }, () => ({
      id: reactionIdRef.current++,
      emoji
    }));
    setFloatingReactions(prev => [...prev, ...newReactions]);
    
    if (currentStory) {
      storiesService.reactToStory(currentStory.id, reactionType as 'like' | 'fire' | 'celebrate' | 'thumbsup').catch(() => {});
    }
    
    if (onStoryReaction && currentStory) {
      onStoryReaction(currentStory.id, reactionType);
    }
  };

  const removeFloatingReaction = (id: number) => {
    setFloatingReactions(prev => prev.filter(r => r.id !== id));
  };

  const handleAvatarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPaused(true);
    setShowProfileDialog(true);
  };

  const handleProfileDialogClose = () => {
    setShowProfileDialog(false);
    setIsPaused(false);
  };

  // Ir a una historia específica por índice
  const goToStoryByIndex = (index: number) => {
    if (index >= 0 && index < currentUser.stories.length) {
      setCurrentStoryIndex(index);
      setProgress(0);
    }
  };

  const profileUser: User | null = currentUser ? {
    id: currentUser.user.id,
    username: currentUser.user.username,
    displayName: currentUser.user.displayName,
    avatar: currentUser.user.avatar,
    email: '',
    createdAt: new Date().toISOString(),
  } : null;

  if (!currentStory) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-lg w-full h-[90vh] p-0 bg-black border-none overflow-hidden">
          <div 
            ref={containerRef}
            className="relative w-full h-full select-none"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={() => { setIsDragging(false); setDragOffset(0); }}
            style={{
              transform: isDragging ? `translateX(${dragOffset * 0.3}px)` : 'translateX(0)',
              transition: isDragging ? 'none' : 'transform 0.3s ease-out',
            }}
          >
            {/* Partículas flotantes de reacciones */}
            {floatingReactions.map(reaction => (
              <FloatingReaction
                key={reaction.id}
                emoji={reaction.emoji}
                onComplete={() => removeFloatingReaction(reaction.id)}
              />
            ))}

            {/* Barras de progreso - clickeables para saltar */}
            <div className="absolute top-2 left-2 right-2 z-20 flex space-x-1">
              {currentUser.stories.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => { e.stopPropagation(); goToStoryByIndex(idx); }}
                  className="flex-1 h-2 bg-white/30 rounded-full overflow-hidden hover:bg-white/40 transition-colors cursor-pointer"
                >
                  <div 
                    className="h-full bg-white rounded-full transition-all duration-100"
                    style={{ 
                      width: idx < currentStoryIndex ? '100%' : 
                             idx === currentStoryIndex ? `${progress}%` : '0%' 
                    }}
                  />
                </button>
              ))}
            </div>

            {/* Contador de historias */}
            {currentUser.stories.length > 1 && (
              <div className="absolute top-5 right-14 z-20 bg-black/50 px-2 py-0.5 rounded-full">
                <span className="text-white text-xs font-medium">
                  {currentStoryIndex + 1}/{currentUser.stories.length}
                </span>
              </div>
            )}

            {/* Header con info del usuario */}
            <div className="absolute top-8 left-2 right-2 z-20 flex items-center justify-between">
              <div 
                className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={(e) => { e.stopPropagation(); handleAvatarClick(e); }}
              >
                <Avatar className="w-10 h-10 border-2 border-neon-green/50 ring-2 ring-neon-green/30">
                  <AvatarImage src={currentUser.user.avatar} />
                  <AvatarFallback className="bg-dark-lighter">{currentUser.user.displayName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-white text-sm font-medium">{currentUser.user.displayName}</p>
                  <p className="text-white/60 text-xs">
                    {new Date(currentStory.createdAt).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                {currentStory.mediaType === 'video' && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
                    className="p-2 text-white/80 hover:text-white"
                  >
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                )}
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsPaused(!isPaused); }}
                  className="p-2 text-white/80 hover:text-white"
                >
                  {isPaused ? <Play size={20} /> : <Pause size={20} />}
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onClose(); }}
                  className="p-2 text-white/80 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Contenido de la historia con transición */}
            <div className="w-full h-full flex items-center justify-center">
              {currentStory.mediaType === 'image' ? (
                <img 
                  src={currentStory.mediaUrl} 
                  alt="Story"
                  className="w-full h-full object-contain pointer-events-none"
                  draggable={false}
                />
              ) : (
                <video
                  ref={videoRef}
                  src={currentStory.mediaUrl}
                  className="w-full h-full object-contain pointer-events-none"
                  autoPlay
                  muted={isMuted}
                  playsInline
                  loop={false}
                />
              )}
            </div>

            {/* Indicadores de navegación lateral (flechas) */}
            <button 
              onClick={(e) => { e.stopPropagation(); goToPrevStory(); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 text-white/30 hover:text-white/80 z-20 transition-colors"
            >
              <ChevronLeft size={36} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); goToNextStory(); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white/30 hover:text-white/80 z-20 transition-colors"
            >
              <ChevronRight size={32} />
            </button>

            {/* Barra de reacciones en la parte inferior */}
            <div 
              className="absolute bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-black/80 to-transparent"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Botones de reacción */}
              <div className="flex justify-center gap-4 mb-3">
                {STORY_REACTIONS.map((reaction) => (
                  <button
                    key={reaction.type}
                    onClick={() => handleReaction(reaction.type, reaction.emoji)}
                    className={cn(
                      "p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20",
                      "hover:scale-125 hover:bg-white/20 active:scale-95",
                      "transition-all duration-200 ease-out",
                      reaction.color
                    )}
                  >
                    <reaction.icon size={24} fill="currentColor" />
                  </button>
                ))}
              </div>

              {/* Input de respuesta */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Enviar mensaje..."
                  className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white placeholder-white/50 text-sm focus:outline-none focus:border-neon-green/50"
                  onFocus={() => setIsPaused(true)}
                  onBlur={() => !replyText.trim() && setIsPaused(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && replyText.trim() && currentStory) {
                      storiesService.replyToStory(currentStory.id, replyText.trim());
                      setReplyText('');
                      setIsPaused(false);
                    }
                  }}
                />
                <button 
                  className="p-2 bg-neon-green rounded-full text-black hover:bg-neon-green/80 transition-colors disabled:opacity-50"
                  disabled={!replyText.trim()}
                  onClick={() => {
                    if (replyText.trim() && currentStory) {
                      storiesService.replyToStory(currentStory.id, replyText.trim());
                      setReplyText('');
                      setIsPaused(false);
                    }
                  }}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogo de perfil del usuario */}
      {profileUser && (
        <UserProfileDialog
          isOpen={showProfileDialog}
          onClose={handleProfileDialogClose}
          profileUser={profileUser}
        />
      )}
    </>
  );
};


// Componente principal del slider de historias
export function StoriesSlider({ 
  userStories, 
  currentUserId,
  currentUser,
  onAddStory,
  onStoryViewed 
}: StoriesSliderProps) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedUserIndex, setSelectedUserIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(true);

  // Normalizar el ID del usuario actual a string
  const normalizedCurrentUserId = currentUserId ? String(currentUserId) : 'current-user';
  
  // Encontrar el usuario actual en la lista o crear uno con los datos del usuario logueado
  const existingUserStory = userStories.find(us => 
    String(us.user.id) === normalizedCurrentUserId
  );
  
  const currentUserStory: UserStories = existingUserStory || {
    user: {
      id: normalizedCurrentUserId,
      username: currentUser?.username || 'tu_usuario',
      displayName: currentUser?.displayName || currentUser?.username || 'Tu Historia',
      avatar: currentUser?.avatar || ''
    },
    stories: [],
    hasUnviewed: false
  };
  
  // Si existe pero no tiene avatar actualizado, usar el del usuario logueado
  if (existingUserStory && currentUser?.avatar && !existingUserStory.user.avatar) {
    currentUserStory.user.avatar = currentUser.avatar;
  }
  
  // Filtrar otros usuarios (excluyendo al actual)
  const otherUserStories = userStories.filter(us => 
    String(us.user.id) !== normalizedCurrentUserId
  );
  
  // Duplicar items para el efecto infinito (solo si hay suficientes)
  const duplicatedStories = otherUserStories.length > 3 
    ? [...otherUserStories, ...otherUserStories, ...otherUserStories]
    : [...otherUserStories, ...otherUserStories];

  const handleStoryClick = (userId: string) => {
    // Encontrar el índice del usuario en la lista original (comparar como strings)
    const userIndex = userStories.findIndex(us => 
      String(us.user.id) === String(userId)
    );
    if (userIndex >= 0 && userStories[userIndex].stories.length > 0) {
      setSelectedUserIndex(userIndex);
      setViewerOpen(true);
    }
  };

  // Pausar animación al hover
  const handleMouseEnter = () => setIsAnimating(false);
  const handleMouseLeave = () => setIsAnimating(true);

  return (
    <div className="w-full flex items-start gap-3">
      {/* Usuario actual - ESTÁTICO (no se mueve) */}
      <div className="flex-shrink-0 py-2">
        <StoryAvatar
          userStory={currentUserStory}
          onClick={() => handleStoryClick(currentUserStory.user.id)}
          isCurrentUser={true}
          onAddClick={onAddStory}
        />
      </div>
      
      {/* Separador visual */}
      <div className="w-px h-16 bg-white/10 self-center flex-shrink-0" />
      
      {/* Slider container - solo los otros usuarios se deslizan */}
      <div 
        className="relative overflow-hidden flex-1"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Gradiente de fade en el borde derecho */}
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white/5 to-transparent z-10 pointer-events-none" />
        
        {/* Slider con animación infinita */}
        <div 
          ref={sliderRef}
          className="flex space-x-4 py-2 stories-slider-track"
          style={{
            width: 'fit-content',
            animationPlayState: isAnimating ? 'running' : 'paused',
          }}
        >
          {/* Otros usuarios con historias - duplicados para efecto infinito */}
          {duplicatedStories.map((userStory, index) => (
            <StoryAvatar
              key={`${userStory.user.id}-${index}`}
              userStory={userStory}
              onClick={() => handleStoryClick(userStory.user.id)}
            />
          ))}
        </div>
      </div>

      {/* Visor de historias */}
      <StoryViewer
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        userStories={userStories}
        initialUserIndex={selectedUserIndex}
        onStoryViewed={onStoryViewed}
        onStoryReaction={(storyId, reactionType) => {
          // TODO: Enviar reacción al backend
          console.log(`Reacción ${reactionType} en historia ${storyId}`);
        }}
      />
    </div>
  );
}

// Datos de ejemplo para desarrollo
export const mockUserStories: UserStories[] = [
  {
    user: {
      id: 'current-user', // Este ID debe coincidir con el currentUserId del usuario logueado
      username: 'tu_usuario',
      displayName: 'Tu Historia',
      avatar: 'https://i.pravatar.cc/150?img=12',
    },
    stories: [], // Sin historias para mostrar el botón de agregar
    hasUnviewed: false,
  },
  {
    user: {
      id: '1',
      username: 'carlos_futbol',
      displayName: 'Carlos Rodríguez',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    stories: [
      {
        id: 's1',
        userId: '1',
        user: { id: '1', username: 'carlos_futbol', displayName: 'Carlos Rodríguez', avatar: 'https://i.pravatar.cc/150?img=1' },
        mediaUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400',
        mediaType: 'image',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        viewed: false,
      }
    ],
    hasUnviewed: true,
  },
  {
    user: {
      id: '2',
      username: 'maria_gol',
      displayName: 'María González',
      avatar: 'https://i.pravatar.cc/150?img=5',
    },
    stories: [
      {
        id: 's2',
        userId: '2',
        user: { id: '2', username: 'maria_gol', displayName: 'María González', avatar: 'https://i.pravatar.cc/150?img=5' },
        mediaUrl: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400',
        mediaType: 'image',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        viewed: false,
      }
    ],
    hasUnviewed: true,
  },
  {
    user: {
      id: '3',
      username: 'pedro_10',
      displayName: 'Pedro Martínez',
      avatar: 'https://i.pravatar.cc/150?img=3',
    },
    stories: [
      {
        id: 's3',
        userId: '3',
        user: { id: '3', username: 'pedro_10', displayName: 'Pedro Martínez', avatar: 'https://i.pravatar.cc/150?img=3' },
        mediaUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400',
        mediaType: 'image',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        viewed: true,
      }
    ],
    hasUnviewed: false,
  },
  {
    user: {
      id: '4',
      username: 'ana_soccer',
      displayName: 'Ana López',
      avatar: 'https://i.pravatar.cc/150?img=9',
    },
    stories: [
      {
        id: 's4',
        userId: '4',
        user: { id: '4', username: 'ana_soccer', displayName: 'Ana López', avatar: 'https://i.pravatar.cc/150?img=9' },
        mediaUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400',
        mediaType: 'image',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        viewed: false,
      }
    ],
    hasUnviewed: true,
  },
  {
    user: {
      id: '5',
      username: 'luis_crack',
      displayName: 'Luis Hernández',
      avatar: 'https://i.pravatar.cc/150?img=7',
    },
    stories: [
      {
        id: 's5',
        userId: '5',
        user: { id: '5', username: 'luis_crack', displayName: 'Luis Hernández', avatar: 'https://i.pravatar.cc/150?img=7' },
        mediaUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400',
        mediaType: 'image',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        viewed: false,
      }
    ],
    hasUnviewed: true,
  },
  {
    user: {
      id: '6',
      username: 'sofia_fut',
      displayName: 'Sofía Ramírez',
      avatar: 'https://i.pravatar.cc/150?img=10',
    },
    stories: [
      {
        id: 's6',
        userId: '6',
        user: { id: '6', username: 'sofia_fut', displayName: 'Sofía Ramírez', avatar: 'https://i.pravatar.cc/150?img=10' },
        mediaUrl: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=400',
        mediaType: 'image',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        viewed: true,
      }
    ],
    hasUnviewed: false,
  },
];

export default StoriesSlider;
