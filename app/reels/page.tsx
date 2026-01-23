'use client';

import { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/providers';
import { toast } from 'sonner';

// Lazy loading de componentes pesados
const ReelsViewer = lazy(() => import('@/components/reels/reels-viewer').then(mod => ({ default: mod.ReelsViewer })));
const Sidebar = lazy(() => import('@/components/navigation/sidebar').then(mod => ({ default: mod.Sidebar })));
const MobileNav = lazy(() => import('@/components/navigation/mobile-nav').then(mod => ({ default: mod.MobileNav })));

// Mock data para los reels (fallback)
const mockReels = [
  {
    id: '1',
    videoUrl: '/api/placeholder/video/sample1.mp4',
    thumbnail: '/api/placeholder/400/600?text=⚽+Gol+Increíble',
    title: '⚽ Gol increíble en el último minuto',
    description: 'No te pierdas este golazo que definió el partido. ¡Qué jugada más espectacular! 🔥',
    user: {
      id: '1',
      username: 'futbol_pro',
      displayName: 'Fútbol Pro',
      avatar: '/api/placeholder/100/100?text=FP',
      isVerified: true
    },
    likes: 1250,
    comments: 89,
    shares: 45,
    views: 15600,
    isLiked: false,
    createdAt: '2024-01-20T10:30:00Z',
    tags: ['fútbol', 'gol', 'deporte', 'increíble']
  },
  {
    id: '2',
    videoUrl: '/api/placeholder/video/sample2.mp4',
    thumbnail: '/api/placeholder/400/600?text=🔧+JS+Hack',
    title: '🔧 Truco de programación que te va a sorprender',
    description: 'Este hack de JavaScript te ahorrará horas de trabajo. ¡Compártelo con tus amigos desarrolladores! 💻',
    user: {
      id: '2',
      username: 'dev_master',
      displayName: 'Dev Master',
      avatar: '/api/placeholder/100/100?text=DM',
      isVerified: true
    },
    likes: 890,
    comments: 156,
    shares: 78,
    views: 8900,
    isLiked: true,
    createdAt: '2024-01-19T15:45:00Z',
    tags: ['programación', 'javascript', 'tutorial', 'hack']
  },
  {
    id: '3',
    videoUrl: '/api/placeholder/video/sample3.mp4',
    thumbnail: '/api/placeholder/400/600?text=🍳+Pasta+5min',
    title: '🍳 Receta rápida: Pasta en 5 minutos',
    description: 'La receta más fácil y deliciosa que vas a ver hoy. ¡Perfecta para cuando tienes poco tiempo! 👨‍🍳',
    user: {
      id: '3',
      username: 'chef_rapido',
      displayName: 'Chef Rápido',
      avatar: '/api/placeholder/100/100?text=CR',
      isVerified: false
    },
    likes: 2100,
    comments: 234,
    shares: 123,
    views: 25400,
    isLiked: false,
    createdAt: '2024-01-18T09:15:00Z',
    tags: ['cocina', 'receta', 'rápido', 'pasta']
  },
  {
    id: '4',
    videoUrl: '/api/placeholder/video/sample4.mp4',
    thumbnail: '/api/placeholder/400/600?text=🎸+Guitar+Solo',
    title: '🎸 Solo de guitarra épico',
    description: 'Cuando la música te transporta a otro mundo... ¡Qué talento! 🎵',
    user: {
      id: '4',
      username: 'music_soul',
      displayName: 'Music Soul',
      avatar: '/api/placeholder/100/100?text=MS',
      isVerified: true
    },
    likes: 3400,
    comments: 445,
    shares: 234,
    views: 45600,
    isLiked: true,
    createdAt: '2024-01-17T14:20:00Z',
    tags: ['música', 'guitarra', 'talento', 'épico']
  },
  {
    id: '5',
    videoUrl: '/api/placeholder/video/sample5.mp4',
    thumbnail: '/api/placeholder/400/600?text=💪+Home+Workout',
    title: '💪 Rutina de ejercicio en casa',
    description: 'No necesitas gimnasio para estar en forma. ¡Estos ejercicios son perfectos! 🏋️‍♂️',
    user: {
      id: '5',
      username: 'fit_life',
      displayName: 'Fit Life',
      avatar: '/api/placeholder/100/100?text=FL',
      isVerified: false
    },
    likes: 1800,
    comments: 167,
    shares: 89,
    views: 18900,
    isLiked: false,
    createdAt: '2024-01-16T11:30:00Z',
    tags: ['fitness', 'ejercicio', 'casa', 'salud']
  }
];

export default function ReelsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [reels, setReels] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  // Función para cargar reels desde la API
  const fetchReels = useCallback(async (pageNum: number = 1) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.log('No hay token, usando mock data');
        setReels(mockReels);
        setIsLoading(false);
        return;
      }

      console.log(`📡 Cargando reels - Página ${pageNum}...`);
      const response = await fetch(`http://127.0.0.1:8000/api/reels/?page=${pageNum}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al cargar reels');
      }

      const data = await response.json();
      console.log('✅ Reels cargados:', data);

      if (data.results && data.results.length > 0) {
        // Mapear los datos de la API al formato esperado
        const mappedReels = data.results.map((reel: any) => ({
          id: reel.id,
          videoUrl: reel.video, // La API ya devuelve la URL completa
          thumbnail: reel.thumbnail || null,
          title: reel.caption?.substring(0, 50) || 'Sin título',
          description: reel.caption || '',
          user: {
            id: reel.author.id,
            username: reel.author.username,
            displayName: reel.author.display_name || reel.author.username,
            avatar: reel.author.avatar || '/logo.png',
            isVerified: reel.author.is_verified || false,
            isFollowing: reel.is_following || false
          },
          likes: reel.like_count || 0,
          comments: reel.comment_count || 0,
          shares: reel.share_count || 0,
          views: reel.views_count || 0,
          isLiked: reel.is_liked || false,
          createdAt: reel.created_at,
          tags: reel.hashtags ? reel.hashtags.split(' ').filter((t: string) => t.startsWith('#')) : []
        }));

        if (pageNum === 1) {
          setReels(mappedReels);
        } else {
          setReels(prev => [...prev, ...mappedReels]);
        }

        setHasMore(!!data.next);
      } else if (pageNum === 1) {
        // Si no hay reels en la primera página, usar mock data
        console.log('ℹ️ No hay reels, usando mock data');
        setReels(mockReels);
      }
    } catch (error) {
      console.error('❌ Error cargando reels:', error);
      if (pageNum === 1) {
        setReels(mockReels);
      }
      toast.error('Error al cargar reels');
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  }, []);

  useEffect(() => {
    // Solo redirigir si ya terminó de cargar la autenticación y no hay usuario
    if (!authLoading && !user) {
      router.push('/');
      return;
    }
    
    // Solo cargar reels si hay usuario autenticado
    if (user) {
      fetchReels(1);
    }
  }, [user, authLoading, router, fetchReels]);

  // Detectar ID en URL y posicionar el reel correcto
  useEffect(() => {
    if (reels.length > 0) {
      const urlParams = new URLSearchParams(window.location.search);
      const reelId = urlParams.get('id');
      
      if (reelId) {
        const reelIndex = reels.findIndex(r => r.id === reelId);
        if (reelIndex !== -1) {
          setCurrentIndex(reelIndex);
          // Limpiar el parámetro de la URL sin recargar
          window.history.replaceState({}, '', '/reels');
        }
      }
    }
  }, [reels]);

  // Cargar más reels cuando se acerque al final
  const loadMore = useCallback(() => {
    if (!isFetchingMore && hasMore) {
      setIsFetchingMore(true);
      const nextPage = page + 1;
      setPage(nextPage);
      fetchReels(nextPage);
    }
  }, [isFetchingMore, hasMore, page, fetchReels]);

  const handleLike = async (reelId: string) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Debes iniciar sesión');
        return;
      }

      // Actualizar UI optimistamente
      setReels(prev => 
        prev.map(reel => {
          if (reel.id === reelId) {
            return {
              ...reel,
              isLiked: !reel.isLiked,
              likes: reel.isLiked ? reel.likes - 1 : reel.likes + 1
            };
          }
          return reel;
        })
      );

      // Enviar like a la API
      const response = await fetch(`http://127.0.0.1:8000/api/reels/${reelId}/like/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al dar like');
      }

      const data = await response.json();
      console.log('✅ Like actualizado:', data);
    } catch (error) {
      console.error('❌ Error al dar like:', error);
      // Revertir cambio si falla
      setReels(prev => 
        prev.map(reel => {
          if (reel.id === reelId) {
            return {
              ...reel,
              isLiked: !reel.isLiked,
              likes: reel.isLiked ? reel.likes + 1 : reel.likes - 1
            };
          }
          return reel;
        })
      );
    }
  };

  const handleComment = (reelId: string) => {
    console.log('Comment on reel:', reelId);
    // La funcionalidad de comentarios se maneja en el componente ReelCard
    // Este callback se mantiene para compatibilidad
  };

  const handleShare = async (reel: any) => {
    console.log('Share reel:', reel);
    
    try {
      // Incrementar contador de compartidos en el backend
      const token = localStorage.getItem('access_token');
      if (token) {
        await fetch(`http://127.0.0.1:8000/api/reels/${reel.id}/share/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        // Actualizar contador local
        setReels(prev => 
          prev.map(r => 
            r.id === reel.id 
              ? { ...r, shares: r.shares + 1 }
              : r
          )
        );
      }
      
      // Compartir con URL única del reel
      const shareUrl = `${window.location.origin}/reels?id=${reel.id}`;
      
      if (navigator.share) {
        await navigator.share({
          title: reel.title,
          text: reel.description,
          url: shareUrl
        });
      } else {
        // Fallback: copiar al portapapeles
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Enlace copiado al portapapeles');
      }
    } catch (error) {
      console.error('Error al compartir:', error);
    }
  };

  const handleFollow = async (userId: string) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Debes iniciar sesión');
        return;
      }

      // Encontrar el username del usuario en los reels
      const targetReel = reels.find(reel => reel.user.id === userId);
      if (!targetReel) {
        toast.error('Usuario no encontrado');
        return;
      }

      const username = targetReel.user.username;

      // Llamar a la API para seguir/dejar de seguir usando username
      const isCurrentlyFollowing = targetReel.user.isFollowing;
      const endpoint = `http://127.0.0.1:8000/api/users/${isCurrentlyFollowing ? 'unfollow' : 'follow'}/${username}/`;
      const method = isCurrentlyFollowing ? 'DELETE' : 'POST';

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al seguir usuario');
      }

      const data = await response.json();
      console.log('✅ Usuario seguido/no seguido:', data);
      
      // Actualizar el estado local
      setReels(prev => 
        prev.map(reel => {
          if (reel.user.id === userId) {
            return {
              ...reel,
              user: {
                ...reel.user,
                isFollowing: !reel.user.isFollowing
              }
            };
          }
          return reel;
        })
      );

      toast.success(isCurrentlyFollowing ? 'Usuario no seguido' : 'Usuario seguido');
    } catch (error) {
      console.error('❌ Error al seguir usuario:', error);
      toast.error('Error al seguir usuario');
    }
  };

  const handleView = async (reelId: string) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      // Actualizar UI optimistamente
      setReels(prev => 
        prev.map(reel => {
          if (reel.id === reelId) {
            return {
              ...reel,
              views: reel.views + 1
            };
          }
          return reel;
        })
      );

      // Enviar vista a la API
      const response = await fetch(`http://127.0.0.1:8000/api/reels/${reelId}/view/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('👁️ Vista registrada:', data);
      }
    } catch (error) {
      console.error('❌ Error al registrar vista:', error);
    }
  };

  // Solo mostrar loading si está cargando auth Y no hay usuario
  if (authLoading && !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-neon-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  // Mostrar loading de reels solo si hay usuario pero aún cargando reels
  if (isLoading && reels.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-neon-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Detectar cuando se acerca al final para cargar más
  const handleIndexChange = (newIndex: number) => {
    setCurrentIndex(newIndex);
    
    // Cargar más cuando esté a 2 reels del final
    if (newIndex >= reels.length - 2 && hasMore && !isFetchingMore) {
      loadMore();
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Desktop Sidebar */}
      <Suspense fallback={
        <div className="fixed left-0 top-0 h-screen w-64 bg-black/50 backdrop-blur-sm animate-pulse" />
      }>
        <Sidebar />
      </Suspense>
      
      {/* Main Content */}
      <main className="lg:ml-64">
        <Suspense fallback={
          <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="w-10 h-10 border-3 border-neon-green border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <ReelsViewer
            reels={reels}
            currentIndex={currentIndex}
            onIndexChange={handleIndexChange}
            onLike={handleLike}
            onComment={handleComment}
            onShare={handleShare}
            onFollow={handleFollow}
            onView={handleView}
          />
        </Suspense>
        
        {/* Loading indicator */}
        {isFetchingMore && (
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-black/80 px-4 py-2 rounded-full">
            <p className="text-white text-sm">Cargando más reels...</p>
          </div>
        )}
      </main>

      {/* Mobile Navigation */}
      <Suspense fallback={
        <div className="fixed bottom-0 left-0 right-0 h-16 bg-black/50 backdrop-blur-sm animate-pulse" />
      }>
        <MobileNav />
      </Suspense>
    </div>
  );
}