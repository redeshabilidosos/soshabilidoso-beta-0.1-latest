'use client';

import { useEffect, useState, useRef, useCallback, lazy, Suspense, memo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/providers';
import { useCachedUser } from '@/lib/hooks/use-cached-auth';
import { Plus, TrendingUp, Loader2, Users } from 'lucide-react';
import { Post } from '@/types/user';
import { Advertisement } from '@/lib/services/advertising.service';
import { Toaster } from 'sonner';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// OPTIMIZACIÓN: Importar directamente componentes pequeños (no lazy)
import { Sidebar } from '@/components/navigation/sidebar';
import { MobileNav } from '@/components/navigation/mobile-nav';
import { PostCard } from '@/components/ui/post-card';
import { RealtimeIndicator } from '@/components/ui/realtime-indicator';

// Define UserStories type locally to avoid importing from lazy-loaded module
interface UserStories {
  user: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
  };
  stories: Array<{
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
  }>;
  hasUnviewed: boolean;
}

// OPTIMIZACIÓN: Lazy loading SOLO para componentes pesados
const MeetingNotifications = lazy(() => import('@/components/communities/meeting-notifications').then(mod => ({ default: mod.MeetingNotifications })));
const NewPostDialog = lazy(() => import('@/components/ui/new-post-dialog').then(mod => ({ default: mod.NewPostDialog })));
const AdCard = lazy(() => import('@/components/advertising/ad-card').then(mod => ({ default: mod.AdCard })));
const StoriesSlider = lazy(() => import('@/components/ui/stories-slider'));
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
  const [suggestedUsers, setSuggestedUsers] = useState<any[]>([]);
  const [suggestedCommunities, setSuggestedCommunities] = useState<any[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);
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

  // OPTIMIZACIÓN: Cargar TODOS los datos en paralelo
  useEffect(() => {
    const loadAllFeedData = async () => {
      if (!effectiveUser) return;
      
      // Prevenir cargas duplicadas
      if (postsLoadedRef.current) return;
      postsLoadedRef.current = true;
      adsLoadedRef.current = true;
      storiesLoadedRef.current = true;
      
      try {
        setIsLoadingPosts(true);
        setIsLoadingStories(true);
        setLoadingSuggestions(true);
        
        const token = localStorage.getItem('access_token');
        
        // CARGAR TODO EN PARALELO con Promise.allSettled
        const [
          postsResult,
          storiesResult,
          adsResult,
          usersResult,
          communitiesResult
        ] = await Promise.allSettled([
          // 1. Posts
          import('@/lib/services/posts.service').then(m => m.postsService.getPosts()),
          
          // 2. Stories
          import('@/lib/services/stories.service').then(m => m.storiesService.getFriendsStories()),
          
          // 3. Ads
          import('@/lib/services/advertising.service').then(m => m.advertisingService.getFeedAds(0, 5)),
          
          // 4. Usuarios sugeridos
          fetch('http://127.0.0.1:8000/api/users/suggested/', {
            headers: { 'Authorization': `Bearer ${token}` }
          }).catch(() => 
            fetch('http://127.0.0.1:8000/api/users/', {
              headers: { 'Authorization': `Bearer ${token}` }
            })
          ),
          
          // 5. Comunidades sugeridas
          fetch('http://127.0.0.1:8000/api/communities/suggested/', {
            headers: { 'Authorization': `Bearer ${token}` }
          }).catch(() =>
            fetch('http://127.0.0.1:8000/api/communities/', {
              headers: { 'Authorization': `Bearer ${token}` }
            })
          )
        ]);
        
        // Procesar Posts
        if (postsResult.status === 'fulfilled') {
          const response = postsResult.value;
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
          console.log('✅ Posts cargados:', mappedPosts.length);
        } else {
          console.error('❌ Error cargando posts:', postsResult.reason);
          toast.error('Error al cargar las publicaciones');
        }
        
        // Procesar Stories
        if (storiesResult.status === 'fulfilled') {
          const backendStories = storiesResult.value;
          
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

          const currentUserId = String(effectiveUser.id);
          const currentUserStory: UserStories = {
            user: {
              id: currentUserId,
              username: effectiveUser.username,
              displayName: effectiveUser.displayName || effectiveUser.username,
              avatar: effectiveUser.avatar || effectiveUser.avatarUrl || '',
            },
            stories: [],
            hasUnviewed: false,
          };

          const currentUserInList = mappedStories.find(us => 
            String(us.user.id) === currentUserId
          );
          
          if (currentUserInList) {
            currentUserInList.user.id = currentUserId;
            const filtered = mappedStories.filter(us => 
              String(us.user.id) !== currentUserId
            );
            setUserStories([currentUserInList, ...filtered]);
          } else {
            setUserStories([currentUserStory, ...mappedStories]);
          }
          console.log('✅ Historias cargadas:', mappedStories.length);
        } else {
          console.error('❌ Error cargando historias:', storiesResult.reason);
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
        }
        
        // Procesar Ads
        if (adsResult.status === 'fulfilled') {
          const response = adsResult.value;
          if (response.ads.length > 0) {
            setFeedAds(response.ads);
            console.log('✅ Anuncios cargados:', response.ads.length);
          } else {
            setFeedAds([demoAd]);
          }
        } else {
          setFeedAds([demoAd]);
        }
        
        // Procesar Usuarios sugeridos
        if (usersResult.status === 'fulfilled') {
          const usersResponse = usersResult.value;
          if (usersResponse.ok) {
            const usersData = await usersResponse.json();
            const users = usersData.results || usersData;
            
            const filteredUsers = users
              .filter((u: any) => u.id !== effectiveUser.id && u.username !== effectiveUser.username)
              .slice(0, 5)
              .map((u: any) => ({
                id: u.id,
                username: u.username,
                display_name: u.display_name || u.displayName || u.username,
                avatar_url: u.avatar_url || u.avatar || u.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.display_name || u.username)}&background=39FF14&color=000`,
                mutual_friends_count: u.mutual_friends_count || Math.floor(Math.random() * 5) + 1
              }));
            
            setSuggestedUsers(filteredUsers);
            console.log('✅ Usuarios cargados:', filteredUsers.length);
          }
        }
        
        // Procesar Comunidades sugeridas
        if (communitiesResult.status === 'fulfilled') {
          const communitiesResponse = communitiesResult.value;
          if (communitiesResponse.ok) {
            const communitiesData = await communitiesResponse.json();
            const communities = communitiesData.results || communitiesData;
            
            const mappedCommunities = communities
              .slice(0, 5)
              .map((c: any) => ({
                id: c.id,
                name: c.name,
                description: c.description || 'Únete a esta comunidad',
                image_url: c.image_url || c.image || c.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=8B5CF6&color=fff&size=128`,
                members_count: c.members_count || c.membersCount || c.subscribers_count || 0
              }));
            
            setSuggestedCommunities(mappedCommunities);
            console.log('✅ Comunidades cargadas:', mappedCommunities.length);
          }
        }
        
      } catch (error) {
        console.error('❌ Error cargando datos del feed:', error);
      } finally {
        setIsLoadingPosts(false);
        setIsLoadingStories(false);
        setLoadingSuggestions(false);
      }
    };
    
    loadAllFeedData();
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

  const handleFollowUser = async (username: string) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://127.0.0.1:8000/api/users/${username}/follow/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Remover usuario de sugerencias
        setSuggestedUsers(prev => prev.filter(u => u.username !== username));
        toast.success('Ahora sigues a este usuario');
      }
    } catch (error) {
      console.error('Error siguiendo usuario:', error);
      toast.error('Error al seguir usuario');
    }
  };

  const handleJoinCommunity = async (communityId: string) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://127.0.0.1:8000/api/communities/${communityId}/subscribe/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Remover comunidad de sugerencias
        setSuggestedCommunities(prev => prev.filter(c => c.id !== communityId));
        toast.success('Te has unido a la comunidad');
      }
    } catch (error) {
      console.error('Error uniéndose a comunidad:', error);
      toast.error('Error al unirse a la comunidad');
    }
  };

  return (
    <div className="min-h-screen bg-transparent">
      {/* OPTIMIZACIÓN: Sidebar sin Suspense ya que no es lazy */}
      <Sidebar />
      
      <main className="pb-24 lg:ml-64 lg:pb-0 lg:pr-80">
        <div className="max-w-3xl mx-auto p-3 md:p-4 lg:p-6 space-y-4 md:space-y-6">
          {/* Header Card - Responsive */}
          <Card className="border-0 bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl rounded-2xl">
            <CardHeader className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 md:gap-3 mb-2">
                    <TrendingUp className="text-primary w-5 h-5 md:w-6 md:h-6" />
                    <CardTitle className="text-lg md:text-2xl">Feed Principal</CardTitle>
                    {/* OPTIMIZACIÓN: Sin Suspense ya que no es lazy */}
                    <RealtimeIndicator 
                      isConnected={isConnected} 
                      showLabel={false}
                      size="sm"
                      className="md:flex"
                    />
                  </div>
                  <CardDescription className="text-xs md:text-sm">
                    Descubre las últimas novedades de tu comunidad
                  </CardDescription>
                </div>
                
                {/* Botón Nueva Publicación - Responsive */}
                <Button 
                  onClick={() => setIsNewPostDialogOpen(true)}
                  className="w-full md:w-auto"
                  size="default"
                >
                  <Plus size={18} className="mr-2" />
                  <span className="hidden sm:inline">Nueva Publicación</span>
                  <span className="sm:hidden">Publicar</span>
                </Button>
              </div>

              <Separator className="my-4" />

              {/* Stories Slider - Responsive */}
              <Suspense fallback={
                <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Skeleton key={i} className="flex-shrink-0 w-16 h-24 md:w-20 md:h-28 rounded-xl" />
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
            </CardHeader>
          </Card>

          {/* Posts Feed - Responsive */}
          <div className="space-y-4 md:space-y-6">
            {isLoadingPosts ? (
              <Card className="rounded-2xl">
                <CardContent className="py-12 text-center">
                  <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
                  <p className="text-muted-foreground">Cargando publicaciones...</p>
                </CardContent>
              </Card>
            ) : posts.length === 0 ? (
              <Card className="rounded-2xl border-dashed">
                <CardContent className="py-12 text-center">
                  <TrendingUp className="w-12 h-12 md:w-16 md:h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg md:text-xl font-bold mb-2">No hay publicaciones aún</h3>
                  <p className="text-sm md:text-base text-muted-foreground mb-6">
                    Sé el primero en compartir algo con la comunidad
                  </p>
                  <Button onClick={() => setIsNewPostDialogOpen(true)} size="lg">
                    <Plus size={18} className="mr-2" />
                    Crear Publicación
                  </Button>
                </CardContent>
              </Card>
            ) : (
              posts.map((post, index) => {
                const shouldShowAd = feedAds.length > 0 && (index + 1) % AD_FREQUENCY === 0;
                const adIndex = Math.floor((index + 1) / AD_FREQUENCY) - 1;
                const adToShow = shouldShowAd && adIndex < feedAds.length ? feedAds[adIndex % feedAds.length] : null;
                
                return (
                  <div key={post.id}>
                    <div id={`post-${post.id}`}>
                      {/* OPTIMIZACIÓN: Sin Suspense ya que PostCard no es lazy */}
                      <PostCard post={post} onPostUpdated={handlePostUpdated} onPostDeleted={handlePostDeleted} />
                    </div>
                    
                    {adToShow && (
                      <div className="mt-4 md:mt-6">
                        <Suspense fallback={
                          <Card className="rounded-2xl">
                            <CardContent className="p-4 md:p-6">
                              <Skeleton className="h-32 w-full rounded-xl" />
                            </CardContent>
                          </Card>
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

          {/* Load More Button - Responsive */}
          {posts.length > 0 && (
            <div className="text-center pt-4">
              <Button variant="outline" size="lg" className="w-full md:w-auto">
                Cargar más publicaciones
              </Button>
            </div>
          )}
        </div>

        {/* Sidebar Derecho - Solo Desktop */}
        <aside className="hidden lg:block fixed right-0 top-0 w-80 h-screen overflow-y-auto p-6 border-l border-border/30 bg-transparent">
          <div className="space-y-6">
            {/* Sugerencias de Usuarios */}
            <Card className="rounded-2xl bg-gray-900/80 backdrop-blur-xl border-gray-800">
              <CardHeader>
                <CardTitle className="text-lg">Sugerencias para ti</CardTitle>
                <CardDescription>Personas que podrían interesarte</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loadingSuggestions ? (
                  <>
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Skeleton className="w-10 h-10 rounded-full" />
                          <div className="space-y-1">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-16" />
                          </div>
                        </div>
                        <Skeleton className="h-8 w-16" />
                      </div>
                    ))}
                  </>
                ) : suggestedUsers.length > 0 ? (
                  suggestedUsers.map(user => (
                    <div key={user.id} className="flex items-center justify-between group">
                      <div 
                        className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                        onClick={() => router.push(`/profile/${user.username}`)}
                      >
                        <Avatar className="w-10 h-10 ring-2 ring-transparent group-hover:ring-primary/50 transition-all">
                          <AvatarImage src={user.avatar_url || user.avatar} alt={user.display_name} />
                          <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600">
                            {user.display_name?.charAt(0) || user.username?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                            {user.display_name || user.username}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            @{user.username}
                          </p>
                          {user.mutual_friends_count > 0 && (
                            <p className="text-xs text-primary">
                              {user.mutual_friends_count} amigo{user.mutual_friends_count > 1 ? 's' : ''} en común
                            </p>
                          )}
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleFollowUser(user.username)}
                        className="flex-shrink-0"
                      >
                        Seguir
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No hay sugerencias disponibles
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Comunidades Sugeridas */}
            <Card className="rounded-2xl bg-gray-900/80 backdrop-blur-xl border-gray-800">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users size={18} className="text-primary" />
                  Comunidades para ti
                </CardTitle>
                <CardDescription>Únete a comunidades que te interesen</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {loadingSuggestions ? (
                  <>
                    {[1, 2, 3].map(i => (
                      <div key={i} className="p-3 rounded-lg border border-border">
                        <div className="flex items-center gap-3 mb-2">
                          <Skeleton className="w-10 h-10 rounded-lg" />
                          <Skeleton className="h-4 w-32 flex-1" />
                        </div>
                        <Skeleton className="h-3 w-full mb-2" />
                        <Skeleton className="h-8 w-full" />
                      </div>
                    ))}
                  </>
                ) : suggestedCommunities.length > 0 ? (
                  suggestedCommunities.map(community => (
                    <div 
                      key={community.id}
                      className="p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-secondary/50 transition-all cursor-pointer group"
                      onClick={() => router.push(`/communities/${community.id}`)}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar className="w-10 h-10 rounded-lg">
                          <AvatarImage src={community.image_url || community.image} alt={community.name} />
                          <AvatarFallback className="bg-gradient-to-br from-primary to-blue-600 rounded-lg">
                            {community.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                            {community.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {community.members_count || 0} miembros
                          </p>
                        </div>
                      </div>
                      {community.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                          {community.description}
                        </p>
                      )}
                      <Button 
                        size="sm" 
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleJoinCommunity(community.id);
                        }}
                      >
                        Unirse
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No hay comunidades sugeridas
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Tendencias */}
            <Card className="rounded-2xl bg-gray-900/80 backdrop-blur-xl border-gray-800">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp size={18} className="text-primary" />
                  Tendencias
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {['#Habilidosos', '#FútbolLibre', '#TécnicaBalón', '#Golazo', '#EntrenamientoFC'].map((tag, i) => (
                  <div 
                    key={i} 
                    className="flex items-center justify-between hover:bg-secondary/50 p-2 rounded-lg transition-colors cursor-pointer group"
                    onClick={() => router.push(`/search?q=${encodeURIComponent(tag)}`)}
                  >
                    <div>
                      <p className="font-medium text-sm group-hover:text-primary transition-colors">{tag}</p>
                      <p className="text-xs text-muted-foreground">
                        {Math.floor(Math.random() * 1000) + 100} publicaciones
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Tendencia
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </aside>
      </main>

      <Suspense fallback={
        <div className="fixed bottom-0 left-0 right-0 h-16 bg-black/50 backdrop-blur-sm animate-pulse lg:hidden" />
      }>
        <MobileNav />
      </Suspense>
      
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
            setUserStories(prev => {
              const currentUserIndex = prev.findIndex(us => 
                String(us.user.id) === String(displayUser.id)
              );
              
              if (currentUserIndex >= 0) {
                const updated = [...prev];
                updated[currentUserIndex] = {
                  ...updated[currentUserIndex],
                  stories: [newStory, ...updated[currentUserIndex].stories],
                  hasUnviewed: false
                };
                return updated;
              }
              
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