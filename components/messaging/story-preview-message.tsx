'use client';

import { useState } from 'react';
import { Play, Image as ImageIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StoryPreview {
  id: string;
  media_url: string;
  media_type: 'image' | 'video';
  user: {
    id: string;
    username: string;
    display_name: string;
    avatar_url?: string;
  };
  created_at: string;
  is_expired: boolean;
}

interface StoryPreviewMessageProps {
  storyPreview: StoryPreview;
  onStoryClick: (storyId: string) => void;
  className?: string;
}

export function StoryPreviewMessage({ storyPreview, onStoryClick, className }: StoryPreviewMessageProps) {
  const [imageError, setImageError] = useState(false);

  if (!storyPreview) return null;

  const handleClick = () => {
    if (!storyPreview.is_expired) {
      onStoryClick(storyPreview.id);
    }
  };

  const getTimeAgo = () => {
    const now = new Date();
    const created = new Date(storyPreview.created_at);
    const diffMs = now.getTime() - created.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffHours > 0) {
      return `Hace ${diffHours}h`;
    } else if (diffMins > 0) {
      return `Hace ${diffMins}m`;
    } else {
      return 'Ahora';
    }
  };

  // Construir URL completa de la imagen
  const getFullMediaUrl = () => {
    if (!storyPreview.media_url) return '';
    // Si ya es una URL completa, devolverla tal cual
    if (storyPreview.media_url.startsWith('http')) {
      return storyPreview.media_url;
    }
    // Si es una ruta relativa, agregar el backend URL (sin /api)
    const backendUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace('/api', '');
    // Asegurar que la URL no tenga doble slash
    const cleanUrl = storyPreview.media_url.startsWith('/') ? storyPreview.media_url : `/${storyPreview.media_url}`;
    return `${backendUrl}${cleanUrl}`;
  };

  // Construir URL completa del avatar
  const getFullAvatarUrl = () => {
    if (!storyPreview.user.avatar_url) return '';
    if (storyPreview.user.avatar_url.startsWith('http')) {
      return storyPreview.user.avatar_url;
    }
    const backendUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace('/api', '');
    const cleanUrl = storyPreview.user.avatar_url.startsWith('/') ? storyPreview.user.avatar_url : `/${storyPreview.user.avatar_url}`;
    return `${backendUrl}${cleanUrl}`;
  };

  const mediaUrl = getFullMediaUrl();
  const avatarUrl = getFullAvatarUrl();
  
  // Debug: mostrar URLs en consola
  console.log('[STORY PREVIEW] Media URL:', mediaUrl);
  console.log('[STORY PREVIEW] Avatar URL:', avatarUrl);

  return (
    <div 
      className={cn(
        "relative rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300",
        storyPreview.is_expired ? "opacity-60 cursor-not-allowed" : "hover:scale-[1.02] hover:shadow-2xl hover:shadow-neon-green/20",
        className
      )}
      onClick={handleClick}
    >
      {/* Previsualización de la historia - MÁS GRANDE */}
      <div className="relative w-full aspect-[9/16] max-w-[280px] bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl overflow-hidden border-2 border-white/10">
        {!imageError && mediaUrl ? (
          <img 
            src={mediaUrl}
            alt="Historia"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => {
              console.error('Error cargando imagen de historia:', mediaUrl);
              setImageError(true);
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3">
            <ImageIcon className="w-16 h-16 text-gray-600" />
            <p className="text-gray-500 text-sm">Historia no disponible</p>
          </div>
        )}
        
        {/* Overlay con gradiente mejorado */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
        
        {/* Borde animado para historias activas */}
        {!storyPreview.is_expired && (
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-neon-green/50 transition-colors rounded-2xl" />
        )}
        
        {/* Icono de play para videos - MÁS GRANDE */}
        {storyPreview.media_type === 'video' && !storyPreview.is_expired && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center group-hover:bg-neon-green/90 group-hover:scale-110 transition-all duration-300 border-2 border-white/30">
              <Play className="w-8 h-8 text-white fill-white ml-1" />
            </div>
          </div>
        )}
        
        {/* Header con etiqueta de historia */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div className="px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/20">
            <span className="text-white text-xs font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
              Historia
            </span>
          </div>
          
          {/* Tiempo transcurrido */}
          {!storyPreview.is_expired && (
            <div className="px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/20">
              <span className="text-white/80 text-xs font-medium flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {getTimeAgo()}
              </span>
            </div>
          )}
        </div>
        
        {/* Etiqueta de expirada - MÁS PROMINENTE */}
        {storyPreview.is_expired && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="px-4 py-2 bg-red-500/90 backdrop-blur-sm rounded-full border-2 border-red-400">
              <span className="text-white text-sm font-bold">Historia Expirada</span>
            </div>
          </div>
        )}
        
        {/* Información del usuario - MÁS VISIBLE */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Redirigir al perfil del usuario
                window.location.href = `/profile/${storyPreview.user.username}`;
              }}
              className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-white/30 hover:ring-neon-green transition-all flex-shrink-0 bg-gradient-to-br from-neon-green to-emerald-500 relative"
            >
              {avatarUrl ? (
                <img 
                  src={avatarUrl}
                  alt={storyPreview.user.display_name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback si la imagen no carga
                    console.error('Error cargando avatar:', avatarUrl);
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              ) : null}
              {/* Fallback con inicial - siempre presente */}
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm pointer-events-none">
                {storyPreview.user.display_name.charAt(0).toUpperCase()}
              </div>
            </button>
            <div className="flex-1 min-w-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = `/profile/${storyPreview.user.username}`;
                }}
                className="text-left hover:opacity-80 transition-opacity"
              >
                <p className="text-white text-sm font-semibold drop-shadow-lg truncate">
                  {storyPreview.user.display_name}
                </p>
                <p className="text-white/70 text-xs truncate">
                  @{storyPreview.user.username}
                </p>
              </button>
            </div>
          </div>
        </div>
        
        {/* Indicador de click - solo para historias activas */}
        {!storyPreview.is_expired && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="px-6 py-3 bg-neon-green/90 backdrop-blur-sm rounded-full border-2 border-white/50 shadow-2xl">
              <span className="text-black text-sm font-bold">Ver Historia</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
