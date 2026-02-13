'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Plus, X, ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, Heart, PartyPopper, Flame, ThumbsUp, Send, Smile, Eye, ChevronDown, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserProfileDialog } from '@/components/ui/user-profile-dialog';
import { User } from '@/types/user';
import { storiesService } from '@/lib/services/stories.service';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { useToast } from '@/hooks/use-toast';

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
  viewsCount?: number;
  reactions?: {
    like: number;
    fire: number;
    celebrate: number;
    thumbsup: number;
  };
  repliesCount?: number;
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
  const latestStory = hasStories ? userStory.stories[userStory.stories.length - 1] : null;

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
        
        {/* Avatar con preview de la historia */}
        <div className={cn(
          "w-14 h-14 border-[3px] border-[#0a0a0f] relative z-10 transition-transform group-hover:scale-105 rounded-full overflow-hidden"
        )}>
          {hasStories && latestStory ? (
            // Mostrar preview de la última historia
            <img 
              src={latestStory.mediaUrl} 
              alt={userStory.user.displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            // Mostrar avatar del usuario si no tiene historias
            <img 
              src={userStory.user.avatar} 
              alt={userStory.user.displayName}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Botón de agregar historia para el usuario actual */}
        {isCurrentUser && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddClick?.();
            }}
            className="absolute -bottom-1 -right-1 w-5 h-5 bg-neon-green rounded-full flex items-center justify-center z-20 hover:bg-neon-green/80 transition-colors border-2 border-[#0a0a0f]"
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


// Tipos de reacciones disponibles con emojis
const STORY_REACTIONS = [
  { type: 'like', emoji: '❤️', color: 'from-red-500 to-pink-500' },
  { type: 'fire', emoji: '🔥', color: 'from-orange-500 to-yellow-500' },
  { type: 'celebrate', emoji: '🎉', color: 'from-purple-500 to-pink-500' },
  { type: 'thumbsup', emoji: '👍', color: 'from-blue-500 to-cyan-500' },
];

// Componente de partícula flotante mejorado con animaciones dinámicas
const FloatingReaction = ({ emoji, onComplete, index }: { emoji: string; onComplete: () => void; index: number }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const randomX = (Math.random() - 0.5) * 100; // -50 a 50
  const randomRotation = (Math.random() - 0.5) * 360; // Rotación aleatoria
  const randomDelay = index * 0.1; // Delay escalonado
  const randomScale = 0.8 + Math.random() * 0.4; // 0.8 a 1.2

  return (
    <div 
      className="absolute bottom-32 left-1/2 pointer-events-none z-40"
      style={{
        transform: `translateX(${randomX}px)`,
        animationDelay: `${randomDelay}s`,
        animation: 'floatUpBounce 3s ease-out forwards',
      }}
    >
      <div
        style={{
          animation: `spin ${2 + Math.random()}s linear infinite`,
          transform: `scale(${randomScale}) rotate(${randomRotation}deg)`,
        }}
      >
        <span className="text-5xl drop-shadow-2xl filter brightness-110">
          {emoji}
        </span>
      </div>
    </div>
  );
};

// Componente de explosión de reacción (efecto burst)
const ReactionBurst = ({ emoji, onComplete }: { emoji: string; onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
      <div className="relative">
        {/* Emoji central grande */}
        <div className="animate-ping-once">
          <span className="text-9xl drop-shadow-2xl filter brightness-125">
            {emoji}
          </span>
        </div>
        {/* Anillo de expansión */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 border-4 border-white rounded-full animate-expand-fade" />
        </div>
      </div>
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
  const [floatingReactions, setFloatingReactions] = useState<{ id: number; emoji: string; index: number }[]>([]);
  const [reactionBurst, setReactionBurst] = useState<{ id: number; emoji: string } | null>(null);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [lastTap, setLastTap] = useState<number>(0);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [swipeDownDistance, setSwipeDownDistance] = useState(0);
  const [reactionCounts, setReactionCounts] = useState<Record<string, number>>({
    like: 0,
    fire: 0,
    celebrate: 0,
    thumbsup: 0,
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const reactionIdRef = useRef(0);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
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
    
    // Cargar contadores de reacciones
    if (currentStory?.reactions) {
      setReactionCounts(currentStory.reactions);
    } else {
      setReactionCounts({ like: 0, fire: 0, celebrate: 0, thumbsup: 0 });
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
    const touchY = e.targetTouches[0].clientY;
    setIsDragging(true);
    handleLongPressStart();
    
    // Solo activar double tap si el toque es en el contenido (no en botones)
    const target = e.target as HTMLElement;
    const isOnButton = target.closest('button') !== null;
    if (!isOnButton) {
      handleDoubleTap(e, true);
    }
    
    // Guardar posición Y para swipe down
    (e.currentTarget as any).startY = touchY;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const currentTouch = e.targetTouches[0].clientX;
    const currentTouchY = e.targetTouches[0].clientY;
    const startY = (e.currentTarget as any).startY || 0;
    
    setTouchEnd(currentTouch);
    setDragOffset(currentTouch - touchStart);
    
    // Detectar swipe down
    const verticalDistance = currentTouchY - startY;
    if (verticalDistance > 0) {
      setSwipeDownDistance(verticalDistance);
    }
    
    handleLongPressEnd();
  };

  const onTouchEnd = () => {
    handleLongPressEnd();
    
    if (!touchStart || !touchEnd) {
      setIsDragging(false);
      setDragOffset(0);
      setSwipeDownDistance(0);
      return;
    }
    
    // Swipe down para cerrar
    if (swipeDownDistance > 150) {
      onClose();
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
    setSwipeDownDistance(0);
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Handlers para mouse (desktop)
  const onMouseDown = (e: React.MouseEvent) => {
    setTouchStart(e.clientX);
    setIsDragging(true);
    handleLongPressStart();
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !touchStart) return;
    setDragOffset(e.clientX - touchStart);
    handleLongPressEnd();
  };

  const onMouseUp = (e: React.MouseEvent) => {
    handleLongPressEnd();
    
    if (!touchStart) {
      setIsDragging(false);
      return;
    }
    
    const distance = touchStart - e.clientX;
    
    // Si no hubo movimiento significativo, tratar como tap
    if (Math.abs(distance) < 10) {
      handleTap(e);
      
      // Solo activar double tap si el click es en el contenido (no en botones)
      const target = e.target as HTMLElement;
      const isOnButton = target.closest('button') !== null;
      if (!isOnButton) {
        handleDoubleTap(e, true);
      }
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

  const handleReaction = async (reactionType: string, emoji: string) => {
    // Efecto burst central
    setReactionBurst({ id: Date.now(), emoji });
    setTimeout(() => setReactionBurst(null), 1000);
    
    // Partículas flotantes (más cantidad para efecto dramático)
    const newReactions = Array.from({ length: 8 }, (_, i) => ({
      id: reactionIdRef.current++,
      emoji,
      index: i
    }));
    setFloatingReactions(prev => [...prev, ...newReactions]);
    
    // Incrementar contador local
    setReactionCounts(prev => ({
      ...prev,
      [reactionType]: (prev[reactionType] || 0) + 1
    }));
    
    // Vibración háptica más intensa
    if ('vibrate' in navigator) {
      navigator.vibrate([30, 10, 30]);
    }
    
    if (currentStory) {
      const result = await storiesService.reactToStory(currentStory.id, reactionType as 'like' | 'fire' | 'celebrate' | 'thumbsup');
      
      // Mostrar feedback si se creó una notificación
      if (result.notification_created) {
        console.log('✅ Notificación enviada al creador de la historia');
      }
    }
    
    if (onStoryReaction && currentStory) {
      onStoryReaction(currentStory.id, reactionType);
    }
  };

  const removeFloatingReaction = (id: number) => {
    setFloatingReactions(prev => prev.filter(r => r.id !== id));
  };

  // Función para enviar respuesta a la historia
  const handleSendReply = async () => {
    if (!replyText.trim() || !currentStory) return;
    
    const message = replyText.trim();
    setReplyText('');
    setShowEmojiPicker(false);
    setIsPaused(false);
    
    // Enviar respuesta
    const result = await storiesService.replyToStory(currentStory.id, message);
    
    // Mostrar feedback
    if (result.success) {
      // Toast de éxito
      toast({
        title: "✅ Mensaje enviado",
        description: "Tu respuesta se envió a la bandeja de entrada",
        duration: 3000,
        className: "bg-gradient-to-r from-neon-green/20 to-neon-blue/20 border-neon-green/50",
      });
      
      if (result.message_created) {
        console.log('✅ Mensaje enviado a la bandeja de entrada');
      }
      if (result.notification_created) {
        console.log('✅ Notificación enviada al creador de la historia');
      }
      
      // Vibración háptica
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
    } else {
      // Toast de error con detalles
      const errorMessage = result.error || "No se pudo enviar el mensaje. Intenta de nuevo.";
      console.error('❌ Error al enviar mensaje:', errorMessage);
      
      toast({
        title: "❌ Error",
        description: errorMessage,
        duration: 5000,
        variant: "destructive",
      });
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setReplyText(prev => prev + emojiData.emoji);
  };

  // Double tap para like rápido (solo en el área de la imagen, no en botones)
  const handleDoubleTap = (e: React.MouseEvent | React.TouchEvent, isOnContent: boolean = false) => {
    // Solo activar double tap si es en el contenido, no en botones
    if (!isOnContent) return;
    
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    
    if (now - lastTap < DOUBLE_TAP_DELAY) {
      // Es un double tap
      handleReaction('like', '❤️');
      // Vibración háptica si está disponible
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
    }
    setLastTap(now);
  };

  // Long press para pausar
  const handleLongPressStart = () => {
    const timer = setTimeout(() => {
      setIsPaused(true);
      if ('vibrate' in navigator) {
        navigator.vibrate(30);
      }
    }, 500);
    setLongPressTimer(timer);
  };

  const handleLongPressEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  // Cerrar emoji picker al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

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
  } as User : null;

  if (!currentStory) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-lg w-full h-[90vh] p-0 bg-black border-none overflow-visible [&>button]:hidden">
          <div 
            ref={containerRef}
            className="relative w-full h-full select-none overflow-hidden rounded-lg"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={() => { setIsDragging(false); setDragOffset(0); handleLongPressEnd(); }}
            style={{
              transform: swipeDownDistance > 0 
                ? `translateY(${swipeDownDistance}px) scale(${1 - swipeDownDistance / 1000})`
                : isDragging 
                  ? `translateX(${dragOffset * 0.3}px)` 
                  : 'translateX(0)',
              transition: isDragging || swipeDownDistance > 0 ? 'none' : 'transform 0.3s ease-out',
              opacity: swipeDownDistance > 0 ? 1 - swipeDownDistance / 300 : 1,
            }}
          >
            {/* Partículas flotantes de reacciones */}
            {floatingReactions.map(reaction => (
              <FloatingReaction
                key={reaction.id}
                emoji={reaction.emoji}
                index={reaction.index}
                onComplete={() => removeFloatingReaction(reaction.id)}
              />
            ))}

            {/* Efecto burst de reacción */}
            {reactionBurst && (
              <ReactionBurst
                key={reactionBurst.id}
                emoji={reactionBurst.emoji}
                onComplete={() => setReactionBurst(null)}
              />
            )}

            {/* Barras de progreso mejoradas con glow - clickeables para saltar */}
            <div className="absolute top-2 left-2 right-2 z-20 flex space-x-1">
              {currentUser.stories.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => { e.stopPropagation(); goToStoryByIndex(idx); }}
                  className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden hover:bg-white/30 transition-colors cursor-pointer relative"
                >
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-100",
                      idx === currentStoryIndex 
                        ? "bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" 
                        : "bg-white"
                    )}
                    style={{ 
                      width: idx < currentStoryIndex ? '100%' : 
                             idx === currentStoryIndex ? `${progress}%` : '0%' 
                    }}
                  />
                </button>
              ))}
            </div>

            {/* Thumbnails de historias múltiples - solo si hay más de una */}
            {currentUser.stories.length > 1 && (
              <div className="absolute top-5 left-2 right-2 z-20 flex gap-1 justify-center mt-1">
                {currentUser.stories.map((story, idx) => (
                  <button
                    key={story.id}
                    onClick={(e) => { e.stopPropagation(); goToStoryByIndex(idx); }}
                    className={cn(
                      "w-8 h-8 rounded-md overflow-hidden border-2 transition-all hover:scale-110",
                      idx === currentStoryIndex 
                        ? "border-neon-green shadow-lg shadow-neon-green/50" 
                        : "border-white/30 opacity-70 hover:opacity-100"
                    )}
                  >
                    <img 
                      src={story.mediaUrl} 
                      alt={`Historia ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Contador de historias */}
            {currentUser.stories.length > 1 && (
              <div className="absolute top-5 right-14 z-20 bg-black/50 px-2 py-0.5 rounded-full">
                <span className="text-white text-xs font-medium">
                  {currentStoryIndex + 1}/{currentUser.stories.length}
                </span>
              </div>
            )}

            {/* Header con info del usuario */}
            <div className={cn(
              "absolute left-2 right-2 z-20 flex items-center justify-between",
              currentUser.stories.length > 1 ? "top-16" : "top-8"
            )}>
              <div 
                className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={(e) => { e.stopPropagation(); handleAvatarClick(e); }}
              >
                <div className="w-10 h-10 rounded-full border-2 border-neon-green/50 ring-2 ring-neon-green/30 overflow-hidden bg-gradient-to-br from-neon-green/20 to-neon-blue/20 flex items-center justify-center">
                  {currentUser.user.avatar ? (
                    <img 
                      src={currentUser.user.avatar} 
                      alt={currentUser.user.displayName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback si la imagen no carga - ocultar imagen y mostrar inicial
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  ) : null}
                  {/* Fallback con inicial - siempre presente pero detrás de la imagen */}
                  <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg pointer-events-none">
                    {currentUser.user.displayName.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{currentUser.user.displayName}</p>
                  <p className="text-white/60 text-xs">
                    {new Date(currentStory.createdAt).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {/* Contador de vistas (solo para historias propias) */}
                {currentStory.userId === currentUser.user.id && currentStory.viewsCount !== undefined && (
                  <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                    <Eye size={14} className="text-white/80" />
                    <span className="text-white/80 text-xs font-medium">{currentStory.viewsCount}</span>
                  </div>
                )}
                {currentStory.mediaType === 'video' && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
                    className="p-2 text-white/80 hover:text-white bg-black/30 rounded-full backdrop-blur-sm"
                  >
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                )}
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsPaused(!isPaused); }}
                  className="p-2 text-white/80 hover:text-white bg-black/30 rounded-full backdrop-blur-sm"
                >
                  {isPaused ? <Play size={20} /> : <Pause size={20} />}
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onClose(); }}
                  className="p-2 text-white/80 hover:text-white bg-black/30 rounded-full backdrop-blur-sm"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Indicador de swipe down */}
            {swipeDownDistance > 20 && (
              <div 
                className={cn(
                  "absolute left-1/2 -translate-x-1/2 z-20 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-full",
                  currentUser.stories.length > 1 ? "top-28" : "top-20"
                )}
                style={{ opacity: Math.min(swipeDownDistance / 150, 1) }}
              >
                <p className="text-white text-sm flex items-center gap-2">
                  <ChevronDown size={16} />
                  Desliza para cerrar
                </p>
              </div>
            )}

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

            {/* Barra de reacciones y comentarios en la parte inferior */}
            <div 
              className="absolute bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black via-black/98 to-transparent pt-8 pb-safe"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div 
                  ref={emojiPickerRef}
                  className="absolute bottom-full left-0 right-0 mb-2 flex justify-center"
                >
                  <div className="bg-gray-900 rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
                    <EmojiPicker
                      onEmojiClick={handleEmojiClick}
                      width={320}
                      height={400}
                      theme={"dark" as any}
                      searchPlaceHolder="Buscar emoji..."
                      previewConfig={{ showPreview: false }}
                    />
                  </div>
                </div>
              )}

              <div className="p-4 space-y-3">
                {/* Botones de reacción rápida con emojis y contadores */}
                <div className="flex justify-center gap-3">
                  {STORY_REACTIONS.map((reaction) => {
                    const count = reactionCounts[reaction.type] || 0;
                    return (
                      <button
                        key={reaction.type}
                        onClick={() => handleReaction(reaction.type, reaction.emoji)}
                        className={cn(
                          "relative group"
                        )}
                        title={`Reaccionar con ${reaction.emoji}`}
                      >
                        {/* Fondo con gradiente animado */}
                        <div className={cn(
                          "absolute inset-0 rounded-full bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md",
                          reaction.color
                        )} />
                        
                        {/* Botón principal */}
                        <div className={cn(
                          "relative p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20",
                          "group-hover:scale-125 group-hover:bg-white/20 group-active:scale-95",
                          "transition-all duration-200 ease-out"
                        )}>
                          <span className="text-2xl filter drop-shadow-lg group-hover:brightness-125 transition-all">
                            {reaction.emoji}
                          </span>
                        </div>
                        
                        {/* Contador con animación */}
                        {count > 0 && (
                          <span className={cn(
                            "absolute -top-1 -right-1 bg-gradient-to-br text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg border-2 border-black/20",
                            "animate-bounce-in",
                            reaction.color
                          )}>
                            {count > 99 ? '99+' : count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Botón para ver respuestas */}
                {currentStory.repliesCount && currentStory.repliesCount > 0 && (
                  <button
                    onClick={() => setShowReplies(!showReplies)}
                    className="w-full flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white/80 hover:text-white hover:bg-white/15 transition-all"
                  >
                    <MessageCircle size={16} />
                    <span className="text-sm">Ver {currentStory.repliesCount} {currentStory.repliesCount === 1 ? 'respuesta' : 'respuestas'}</span>
                  </button>
                )}

                {/* Input de respuesta con emoji picker */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className={cn(
                      "p-2 rounded-full transition-all",
                      showEmojiPicker 
                        ? "bg-neon-green/20 text-neon-green" 
                        : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                    )}
                    title="Agregar emoji"
                  >
                    <Smile size={20} />
                  </button>
                  
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Enviar mensaje..."
                    className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2.5 text-white placeholder-white/50 text-sm focus:outline-none focus:border-neon-green/50 focus:bg-white/15 transition-all"
                    onFocus={() => setIsPaused(true)}
                    onBlur={() => !replyText.trim() && !showEmojiPicker && setIsPaused(false)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && replyText.trim()) {
                        handleSendReply();
                      }
                    }}
                  />
                  
                  <button 
                    className={cn(
                      "p-2.5 rounded-full transition-all",
                      replyText.trim()
                        ? "bg-neon-green text-black hover:bg-neon-green/80 hover:scale-105"
                        : "bg-white/10 text-white/30 cursor-not-allowed"
                    )}
                    disabled={!replyText.trim()}
                    onClick={handleSendReply}
                    title="Enviar mensaje"
                  >
                    <Send size={18} />
                  </button>
                </div>
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
  
  // Encontrar el usuario actual en la lista
  const currentUserIndex = userStories.findIndex(us => 
    String(us.user.id) === normalizedCurrentUserId
  );
  
  // Si el usuario actual existe en la lista, usarlo; si no, crear uno nuevo
  let currentUserStory: UserStories;
  let otherUserStories: UserStories[];
  
  if (currentUserIndex >= 0) {
    // El usuario ya está en la lista, usarlo directamente
    currentUserStory = userStories[currentUserIndex];
    // Filtrar para obtener solo los otros usuarios
    otherUserStories = userStories.filter((_, idx) => idx !== currentUserIndex);
  } else {
    // El usuario no está en la lista, crear uno nuevo
    currentUserStory = {
      user: {
        id: normalizedCurrentUserId,
        username: currentUser?.username || 'tu_usuario',
        displayName: currentUser?.displayName || currentUser?.username || 'Tu Historia',
        avatar: currentUser?.avatar || ''
      },
      stories: [],
      hasUnviewed: false
    };
    // Todos los usuarios son "otros"
    otherUserStories = userStories;
  }
  
  // Duplicar items para el efecto infinito (solo si hay suficientes)
  const duplicatedStories = otherUserStories.length > 3 
    ? [...otherUserStories, ...otherUserStories, ...otherUserStories]
    : otherUserStories.length > 0 
      ? [...otherUserStories, ...otherUserStories]
      : [];

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
