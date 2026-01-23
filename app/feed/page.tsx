'use client';

import { useEffect, useState, useRef, useCallback, lazy, Suspense, memo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/providers';
import { useCachedUser } from '@/lib/hooks/use-cached-auth';
import { CyberButton } from '@/components/ui/cyber-button';
import { Plus, TrendingUp } from 'lucide-react';
import { Post } from '@/types/user';
import { Advertisement } from '@/lib/services/advertising.service';
import { Toaster } from 'sonner';
import { toast } from 'sonner';
import { UserStories } from '@/components/ui/stories-slider';

// Lazy loading de componentes pesados
const Sidebar = lazy(() => import('@/components/navigation/sidebar').then(mod => ({ default: mod.Sidebar })));
const MobileNav = lazy(() => import('@/components/navigation/mobile-nav').then(mod => ({ default: mod.MobileNav })));
const PostCard = lazy(() => import('@/components/ui/post-card').then(mod => ({ default: mod.PostCard })));
const RealtimeIndicator = lazy(() => import('@/components/ui/realtime-indicator').then(mod => ({ default: mod.RealtimeIndicator })));
const MeetingNotifications = lazy(() => import('@/components/communities/meeting-notifications').then(mod => ({ default: mod.MeetingNotifications })));
const NewPostDialog = lazy(() => import('@/components/ui/new-post-dialog').then(mod => ({ default: mod.NewPostDialog })));
const AdCard = lazy(() => import('@/components/advertising/ad-card').then(mod => ({ default: mod.AdCard })));
const StoriesSlider = lazy(() => import('@/components/ui/stories-slider').then(mod => ({ default: mod.StoriesSlider })));
const NewStoryDialog = lazy(() => import('@/components/ui/new-story-dialog').then(mod => ({ default: mod.NewStoryDialog })));

export default function FeedPage() {
  const { user } = useAuth();
  const cachedUser = useCachedUser();
  const effectiveUser = user || cachedUser;
  const router = useRouter();
  const [isNewPostDialogOpen, setIsNewPostDialogOpen] = useState(false);
  const [isNewStoryDialogOpen, setIsNewStoryDialogOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [feedAds, setFeedAds] = useState<Advertisement[]>([]);
  const [userStories, setUserStories] = useState<UserStories[]>([]);
  const [isLoadingStories, setIsLoadingStories] = useState(true);
  const postsLoadedRef = useRef(false);
  const adsLoadedRef = useRef(false);
  const storiesLoadedRef = useRef(false);
  
  // Configuración de frecuencia de anuncios (cada N posts)
  const AD_FREQUENCY = 5;
  
  // TODO: Reemplazar con datos reales del backend Django
  // const [userSubscriptions, setUserSubscriptions] = useState<string[]>([]);
  // 
  // useEffect(() => {
  //   // Fetch user subscriptions from Django backend
  //   const fetchUserSubscriptions = async () => {
  //     try {
  //       const response = await fetch('/api/user/subscriptions/', {
  //         headers: {
  //           'Authorization': `Bearer ${localStorage.getItem('access_token')}`
  //         }
  //       });
  //       const data = await response.json();
  //       setUserSubscriptions(data.community_ids || []);
  //     } catch (error) {
  //       console.error('Error fetching subscriptions:', error);
  //     }
  //   };
  //   
  //   if (user) {
  //     fetchUserSubscriptions();
  //   }
  // }, [user]);

  // Simulación temporal - remover cuando se integre Django
  const userSubscriptions: string[] = [
    // Descomenta para probar con suscripciones:
    // '1', '2'
  ];
  
  // WebSocket para actualizaciones en tiempo real
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Función para conectar WebSocket
  const connectWebSocket = useCallback(() => {
    if (!user) return;
    
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = process.env.NODE_ENV === 'production' 
        ? process.env.NEXT_PUBLIC_WS_URL || 'localhost:8000'
        : 'localhost:8000';
      
      const wsUrl = `${protocol}//${host}/ws/feed/?token=${token}`;
      
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('WebSocket del feed conectado');
        setIsConnected(true);
        setConnectionError(null);
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('Mensaje recibido del feed:', message);
          setLastMessage(message);
        } catch (error) {
          console.error('Error parseando mensaje del WebSocket:', error);
        }
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket del feed desconectado');
        setIsConnected(false);
      };

      wsRef.current.onerror = (error) => {
        console.error('Error en WebSocket del feed:', error);
        setConnectionError('Error de conexión con el servidor');
      };

    } catch (error) {
      console.error('Error creando WebSocket:', error);
      setConnectionError('Error al establecer conexión');
    }
  }, [user]);

  // Función para desconectar WebSocket
  const disconnectWebSocket = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close(1000, 'Desconexión intencional');
      wsRef.current = null;
    }
    setIsConnected(false);
    setConnectionError(null);
  }, []);

  // Efecto para manejar la conexión WebSocket
  useEffect(() => {
    if (user) {
      connectWebSocket();
    } else {
      disconnectWebSocket();
    }

    return () => {
      disconnectWebSocket();
    };
  }, [user, connectWebSocket, disconnectWebSocket]);

  const { isLoading } = useAuth();
  
  useEffect(() => {
    // Solo redirigir si ya terminó de cargar y no hay usuario
    if (!isLoading && !effectiveUser) {
      router.push('/');
    }
  }, [effectiveUser, isLoading, router]);

  // Cargar posts del backend - optimizado para evitar cargas duplicadas
  useEffect(() => {
    const loadPosts = async () => {
      if (!effectiveUser || postsLoadedRef.current) return;
      postsLoadedRef.current = true;
      
      try {
        setIsLoadingPosts(true);
        const { postsService } = await import('@/lib/services/posts.service');
        const response = await postsService.getPosts();
        
        // Mapear posts del backend al formato del frontend
        const mappedPosts = response.results.map((post: any) => ({
          id: post.id,
          userId: post.user.id,
          user: {
            id: post.user.id,
            username: post.user.username,
            displayName: post.user.display_name,
            avatar: post.user.avatar_url,
            isVerified: post.user.is_verified,
            position: post.user.position,
            team: post.user.team,
          },
          content: post.content,
          images: post.images || [],
          video: post.video,
          thumbnail: post.thumbnail,
          podcastUrl: post.podcast_url,
          streamingUrl: post.streaming_url,
          type: post.post_type,
          category: post.category,
          likes: post.likes_count || 0,
          celebrations: post.celebrations_count || 0,
          golazos: post.golazos_count || 0,
          laughs: post.laughs_count || post.celebrations_count || 0,
          dislikes: post.dislikes_count || post.golazos_count || 0,
          comments: post.comments || [],
          commentsCount: post.comments_count || 0,
          userReaction: post.user_reaction || null,
          createdAt: post.created_at,
        }));
        
        setPosts(mappedPosts);
        console.log('✅ Posts cargados del backend:', mappedPosts.length);
      } catch (error) {
        console.error('❌ Error cargando posts:', error);
        toast.error('Error al cargar las publicaciones');
      } finally {
        setIsLoadingPosts(false);
      }
    };
    
    loadPosts();
  }, [effectiveUser]);

  // Cargar historias de amigos/contactos
  useEffect(() => {
    const loadStories = async () => {
      if (!effectiveUser || storiesLoadedRef.current) return;
      storiesLoadedRef.current = true;
      
      try {
        setIsLoadingStories(true);
        // Import dinámico del servicio
        const { storiesService } = await import('@/lib/services/stories.service');
        const backendStories = await storiesService.getFriendsStories();
        
        // Mapear historias del backend al formato del frontend
        const mappedStories: UserStories[] = backendStories.map((userStory: any) => ({
          user: {
            id: userStory.user.id,
            username: userStory.user.username,
            displayName: userStory.user.display_name,
            avatar: userStory.user.avatar_url,
          },
          stories: userStory.stories.map((story: any) => ({
            id: story.id,
            userId: story.user.id,
            user: {
              id: story.user.id,
              username: story.user.username,
              displayName: story.user.display_name,
              avatar: story.user.avatar_url,
            },
            mediaUrl: story.media_url,
            mediaType: story.media_type,
            createdAt: story.created_at,
            expiresAt: story.expires_at,
            viewed: story.viewed,
          })),
          hasUnviewed: userStory.has_unviewed,
        }));

        // Agregar el usuario actual al inicio (para que pueda crear historias)
        const currentUserId = String(effectiveUser.id);
        const currentUserStory: UserStories = {
          user: {
            id: currentUserId,
            username: effectiveUser.username,
            displayName: effectiveUser.displayName || effectiveUser.username,
            avatar: effectiveUser.avatar || effectiveUser.avatarUrl || '',
          },
          stories: [], // Se cargarán las historias propias si existen
          hasUnviewed: false,
        };

        // Verificar si el usuario actual ya está en la lista (comparar como strings)
        const currentUserInList = mappedStories.find(us => 
          String(us.user.id) === currentUserId
        );
        
        if (currentUserInList) {
          // Mover al inicio y asegurar que el ID sea string
          currentUserInList.user.id = currentUserId;
          const filtered = mappedStories.filter(us => 
            String(us.user.id) !== currentUserId
          );
          setUserStories([currentUserInList, ...filtered]);
        } else {
          setUserStories([currentUserStory, ...mappedStories]);
        }

        console.log('✅ Historias cargadas:', mappedStories.length);
      } catch (error) {
        console.error('❌ Error cargando historias:', error);
        // Si falla, al menos mostrar el usuario actual para que pueda crear historias
        setUserStories([{
          user: {
            id: String(effectiveUser.id),
            username: effectiveUser.username,
            displayName: effectiveUser.displayName || effectiveUser.username,
            avatar: effectiveUser.avatar || effectiveUser.avatarUrl || '',
          },
          stories: [],
          hasUnviewed: false,
        }]);
      } finally {
        setIsLoadingStories(false);
      }
    };
    
    loadStories();
  }, [effectiveUser]);

  // Anuncio de prueba con video local
  const demoAd: Advertisement = {
    id: 'demo-ad-1',
    title: '¡Mejora tu técnica de manejo de balón!',
    description: 'Aprende las mejores técnicas de control y dominio del balón con nuestros cursos especializados.',
    advertiser_name: 'SOS Habilidosos Academy',
    ad_type: 'video',
    media_url: '/manejobalon.mp4',
    advertiser_logo_url: '/Loggo.png',
    link_url: '/capacitaciones',
    call_to_action: 'Ver Capacitaciones',
    carousel_images: [],
  };

  // Cargar anuncios para el feed
  useEffect(() => {
    const loadAds = async () => {
      if (adsLoadedRef.current) return;
      adsLoadedRef.current = true;
      
      try {
        // Import dinámico del servicio
        const { advertisingService } = await import('@/lib/services/advertising.service');
        // Cargar varios anuncios para rotar en el feed
        const response = await advertisingService.getFeedAds(0, 5);
        if (response.ads.length > 0) {
          setFeedAds(response.ads);
          console.log('✅ Anuncios cargados:', response.ads.length);
        } else {
          // Si no hay anuncios del backend, usar el de demostración
          setFeedAds([demoAd]);
          console.log('✅ Usando anuncio de demostración');
        }
      } catch (error) {
        console.error('Error cargando anuncios:', error);
      }
    };
    
    loadAds();
  }, []);

  // Manejar mensajes del WebSocket
  useEffect(() => {
    if (!lastMessage) return;

    switch (lastMessage.type) {
      case 'new_post':
        if (lastMessage.post) {
          setPosts(prevPosts => {
            // Evitar duplicados
            const exists = prevPosts.some(p => p.id === lastMessage.post!.id);
            if (exists) return prevPosts;
            
            // Añadir nuevo post al inicio
            return [lastMessage.post!, ...prevPosts];
          });
          
          // Mostrar notificación solo si no es del usuario actual
          if (lastMessage.post.user.id !== user?.id) {
            toast.success(`Nueva publicación de ${lastMessage.post.user.display_name}`, {
              description: lastMessage.post.content.substring(0, 100) + '...',
              action: {
                label: 'Ver',
                onClick: () => {
                  const postElement = document.getElementById(`post-${lastMessage.post!.id}`);
                  postElement?.scrollIntoView({ behavior: 'smooth' });
                }
              }
            });
          }
        }
        break;

      case 'post_updated':
        if (lastMessage.post) {
          setPosts(prevPosts => 
            prevPosts.map(p => 
              p.id === lastMessage.post!.id ? lastMessage.post! : p
            )
          );
        }
        break;

      case 'post_deleted':
        if (lastMessage.post_id) {
          setPosts(prevPosts => 
            prevPosts.filter(p => p.id !== lastMessage.post_id)
          );
          toast.info('Una publicación ha sido eliminada');
        }
        break;

      case 'post_reaction':
        if (lastMessage.post_id && lastMessage.reaction_data) {
          setPosts(prevPosts => 
            prevPosts.map(p => {
              if (p.id === lastMessage.post_id) {
                return {
                  ...p,
                  likes_count: lastMessage.reaction_data.likes_count,
                  celebrations_count: lastMessage.reaction_data.celebrations_count,
                  golazos_count: lastMessage.reaction_data.golazos_count,
                };
              }
              return p;
            })
          );
        }
        break;

      case 'connection_established':
        console.log('Conexión WebSocket establecida para el feed');
        break;
    }
  }, [lastMessage, user?.id]);

  // Mostrar error de conexión
  useEffect(() => {
    if (connectionError) {
      toast.error('Error de conexión', {
        description: connectionError,
        action: {
          label: 'Recargar',
          onClick: () => window.location.reload()
        }
      });
    }
  }, [connectionError]);

  if (!effectiveUser) return null;
  
  // Usar effectiveUser para el resto del componente
  const displayUser = effectiveUser;

  const handlePostCreated = (newPost: Post) => {
    setPosts(prevPosts => [newPost, ...prevPosts]); // Añadir la nueva publicación al inicio
  };

  const handlePostUpdated = (updatedPost: Post) => {
    setPosts(prevPosts => prevPosts.map(p => p.id === updatedPost.id ? updatedPost : p));
  };

  const handlePostDeleted = (postId: string) => {
    setPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
  };

  return (
    <div className="min-h-screen">
      <Suspense fallback={
        <div className="fixed left-0 top-0 h-screen w-64 bg-black/50 backdrop-blur-sm animate-pulse" />
      }>
        <Sidebar />
      </Suspense>
      
      <main className="pb-24 lg:ml-64 lg:pb-0">
        <div className="max-w-4xl mx-auto p-4 space-y-6">
          {/* Header */}
          <div className="glass-card p-4 lg:p-6">
            {/* Mobile Layout */}
            <div className="lg:hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="text-neon-green" size={20} />
                  <h1 className="text-lg font-bold text-white">Feed Principal</h1>
                  <Suspense fallback={<div className="w-2 h-2 bg-gray-500 rounded-full" />}>
                    <RealtimeIndicator 
                      isConnected={isConnected} 
                      showLabel={false}
                      size="sm"
                    />
                  </Suspense>
                </div>
                <CyberButton 
                  size="sm"
                  className="flex items-center space-x-1 px-2 py-2 text-xs"
                  onClick={() => setIsNewPostDialogOpen(true)}
                >
                  <Plus size={14} />
                  <span>Nueva Publicación</span>
                </CyberButton>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Descubre las últimas novedades de tu comunidad futbolística
              </p>
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:block">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
                    <TrendingUp className="text-neon-green" />
                    <span>Feed Principal</span>
                    <Suspense fallback={<div className="w-3 h-3 bg-gray-500 rounded-full" />}>
                      <RealtimeIndicator 
                        isConnected={isConnected} 
                        showLabel={true}
                        size="lg"
                      />
                    </Suspense>
                  </h1>
                  <p className="text-gray-400">
                    Descubre las últimas novedades de tu comunidad futbolística
                  </p>
                </div>
                <CyberButton 
                  className="flex items-center space-x-2"
                  onClick={() => setIsNewPostDialogOpen(true)}
                >
                  <Plus size={18} />
                  <span>Nueva Publicación</span>
                </CyberButton>
              </div>
            </div>

            {/* Stories Slider */}
            <Suspense fallback={
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex-shrink-0 w-20 h-28 bg-gray-800 rounded-lg animate-pulse" />
                ))}
              </div>
            }>
              <StoriesSlider 
                userStories={userStories}
                currentUserId={displayUser.id}
                currentUser={{
                  id: displayUser.id,
                  username: displayUser.username,
                  displayName: displayUser.displayName || displayUser.username,
                  avatar: displayUser.avatar || displayUser.avatarUrl || ''
                }}
                onAddStory={() => setIsNewStoryDialogOpen(true)}
                onStoryViewed={(storyId) => {
                  // Marcar historia como vista
                  setUserStories(prev => prev.map(us => ({
                    ...us,
                    stories: us.stories.map(s => 
                      s.id === storyId ? { ...s, viewed: true } : s
                    ),
                    hasUnviewed: us.stories.some(s => s.id !== storyId && !s.viewed)
                  })));
                }}
              />
            </Suspense>
          </div>

          {/* Posts Feed */}
          <div className="space-y-6">
            {isLoadingPosts ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-green mx-auto mb-4"></div>
                <p className="text-gray-400">Cargando publicaciones...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No hay publicaciones aún</h3>
                <p className="text-gray-400 mb-6">
                  Sé el primero en compartir algo con la comunidad
                </p>
                <CyberButton onClick={() => setIsNewPostDialogOpen(true)}>
                  <Plus size={18} className="mr-2" />
                  Crear Publicación
                </CyberButton>
              </div>
            ) : (
              posts.map((post, index) => {
                // Calcular si debemos mostrar un anuncio después de este post
                const shouldShowAd = feedAds.length > 0 && (index + 1) % AD_FREQUENCY === 0;
                const adIndex = Math.floor((index + 1) / AD_FREQUENCY) - 1;
                const adToShow = shouldShowAd && adIndex < feedAds.length ? feedAds[adIndex % feedAds.length] : null;
                
                return (
                  <div key={post.id}>
                    <div id={`post-${post.id}`}>
                      <Suspense fallback={
                        <div className="glass-card p-6 animate-pulse">
                          <div className="h-20 bg-gray-800 rounded mb-4" />
                          <div className="h-40 bg-gray-800 rounded" />
                        </div>
                      }>
                        <PostCard post={post} onPostUpdated={handlePostUpdated} onPostDeleted={handlePostDeleted} />
                      </Suspense>
                    </div>
                    
                    {/* Mostrar anuncio cada AD_FREQUENCY posts */}
                    {adToShow && (
                      <div className="mt-6">
                        <Suspense fallback={
                          <div className="glass-card p-6 animate-pulse">
                            <div className="h-32 bg-gray-800 rounded" />
                          </div>
                        }>
                          <AdCard 
                            ad={adToShow} 
                            position={index} 
                            variant="feed" 
                          />
                        </Suspense>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Load More */}
          <div className="text-center">
            <CyberButton variant="outline" size="lg">
              Cargar más publicaciones
            </CyberButton>
          </div>
        </div>
      </main>

      <Suspense fallback={
        <div className="fixed bottom-0 left-0 right-0 h-16 bg-black/50 backdrop-blur-sm animate-pulse" />
      }>
        <MobileNav />
      </Suspense>
      
      {/* Meeting Notifications */}
      <Suspense fallback={null}>
        <MeetingNotifications userSubscriptions={userSubscriptions} />
      </Suspense>
      
      <Suspense fallback={null}>
        <NewPostDialog 
          isOpen={isNewPostDialogOpen} 
          onClose={() => setIsNewPostDialogOpen(false)} 
          onPostCreated={handlePostCreated}
        />
      </Suspense>
      
      <Suspense fallback={null}>
        <NewStoryDialog
          isOpen={isNewStoryDialogOpen}
          onClose={() => setIsNewStoryDialogOpen(false)}
          currentUser={{
            id: String(displayUser.id),
            username: displayUser.username,
            displayName: displayUser.displayName || displayUser.username,
            avatar: displayUser.avatar || displayUser.avatarUrl || ''
          }}
          onStoryCreated={(newStory) => {
            // Agregar la nueva historia al usuario actual
            setUserStories(prev => {
              // Buscar el usuario actual en la lista (comparar como strings)
              const currentUserIndex = prev.findIndex(us => 
                String(us.user.id) === String(displayUser.id)
              );
              
              if (currentUserIndex >= 0) {
                // Usuario encontrado, agregar historia a su lista
                const updated = [...prev];
                updated[currentUserIndex] = {
                  ...updated[currentUserIndex],
                  stories: [newStory, ...updated[currentUserIndex].stories],
                  hasUnviewed: false // Las propias historias no se marcan como no vistas
                };
                return updated;
              }
              
              // Si el usuario no está en la lista, agregarlo al inicio
              return [{
                user: {
                  id: String(displayUser.id),
                  username: displayUser.username,
                  displayName: displayUser.displayName || displayUser.username,
                  avatar: displayUser.avatar || displayUser.avatarUrl || ''
                },
                stories: [newStory],
                hasUnviewed: false
              }, ...prev];
            });
            setIsNewStoryDialogOpen(false);
          }}
        />
      </Suspense>
      
      <Toaster richColors />
    </div>
  );
}