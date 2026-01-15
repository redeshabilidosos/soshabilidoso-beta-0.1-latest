"use client";

import { useState, useEffect } from 'react';
import { Grid, List, Image as ImageIcon, Video, Mic, Radio, FileText, MoreHorizontal, Heart, MessageCircle, Share2, Eye, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usersService } from '@/lib/services/users.service';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { usePosts } from '@/lib/contexts/posts-context';
import { PostDetailDialog } from '@/components/ui/post-detail-dialog';
import { Post as PostType } from '@/types/user';

interface Post {
  id: string;
  content: string;
  post_type: 'text' | 'image' | 'video' | 'podcast' | 'streaming';
  category: string;
  images: string[];
  video?: string;
  thumbnail?: string;
  podcast_url?: string;
  streaming_url?: string;
  likes_count: number;
  celebrations_count: number;
  golazos_count: number;
  comments_count: number;
  shares_count: number;
  views_count: number;
  is_pinned: boolean;
  created_at: string;
  user: {
    username: string;
    display_name: string;
    avatar_url: string;
  };
}

interface UserPostsGridProps {
  username: string;
  isOwnProfile?: boolean;
  refreshTrigger?: number; // Para forzar actualización cuando se crea un post
}

export function UserPostsGrid({ username, isOwnProfile = false, refreshTrigger }: UserPostsGridProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [friends, setFriends] = useState<any[]>([]);
  const [allFriends, setAllFriends] = useState<any[]>([]);
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [friendsPage, setFriendsPage] = useState(1);
  const [friendsHasMore, setFriendsHasMore] = useState(false);
  const [friendsSearch, setFriendsSearch] = useState('');
  const FRIENDS_PER_PAGE = 10;
  const { toast } = useToast();

  useEffect(() => {
    if (selectedType === 'friends') {
      loadFriends();
    } else {
      loadPosts();
    }
    loadStats();
  }, [username, selectedType, refreshTrigger]);

  const loadFriends = async () => {
    try {
      setLoadingFriends(true);
      const friendsList = await usersService.getFriends(username);
      setAllFriends(friendsList);
      setFriendsPage(1);
      setFriendsSearch('');
      // Mostrar solo los primeros 10
      setFriends(friendsList.slice(0, FRIENDS_PER_PAGE));
      setFriendsHasMore(friendsList.length > FRIENDS_PER_PAGE);
    } catch (error) {
      console.error('Error loading friends:', error);
      toast({
        title: "Error",
        description: "Error al cargar los amigos",
        variant: "destructive",
      });
    } finally {
      setLoadingFriends(false);
    }
  };

  const loadMoreFriends = () => {
    const nextPage = friendsPage + 1;
    const startIndex = (nextPage - 1) * FRIENDS_PER_PAGE;
    const endIndex = startIndex + FRIENDS_PER_PAGE;
    const sourceFriends = friendsSearch ? getFilteredFriends() : allFriends;
    const newFriends = sourceFriends.slice(startIndex, endIndex);
    
    setFriends(prev => [...prev, ...newFriends]);
    setFriendsPage(nextPage);
    setFriendsHasMore(endIndex < sourceFriends.length);
  };

  const getFilteredFriends = () => {
    if (!friendsSearch.trim()) return allFriends;
    const search = friendsSearch.toLowerCase();
    return allFriends.filter(friend => 
      friend.username.toLowerCase().includes(search) ||
      (friend.display_name && friend.display_name.toLowerCase().includes(search))
    );
  };

  const handleFriendsSearch = (value: string) => {
    setFriendsSearch(value);
    setFriendsPage(1);
    
    const filtered = value.trim() 
      ? allFriends.filter(friend => 
          friend.username.toLowerCase().includes(value.toLowerCase()) ||
          (friend.display_name && friend.display_name.toLowerCase().includes(value.toLowerCase()))
        )
      : allFriends;
    
    setFriends(filtered.slice(0, FRIENDS_PER_PAGE));
    setFriendsHasMore(filtered.length > FRIENDS_PER_PAGE);
  };

  const loadPosts = async (pageNum = 1, append = false) => {
    try {
      setLoading(!append);
      const postType = selectedType === 'all' ? undefined : selectedType;
      const response = await usersService.getUserPosts(username, postType, pageNum);
      
      if (append) {
        setPosts(prev => [...prev, ...response.results]);
      } else {
        setPosts(response.results);
      }
      
      setHasMore(!!response.next);
      setPage(pageNum);
    } catch (error) {
      console.error('Error loading posts:', error);
      toast({
        title: "Error",
        description: "Error al cargar las publicaciones",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await usersService.getUserPostsStats(username);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      loadPosts(page + 1, true);
    }
  };

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'podcast': return <Mic className="w-4 h-4" />;
      case 'streaming': return <Radio className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getPostTypeLabel = (type: string) => {
    switch (type) {
      case 'image': return 'Foto';
      case 'video': return 'Video';
      case 'podcast': return 'Podcast';
      case 'streaming': return 'Streaming';
      case 'text': return 'Estado';
      default: return 'Publicación';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Fecha desconocida';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Fecha inválida';
    }
    
    return formatDistanceToNow(date, { 
      addSuffix: true, 
      locale: es 
    });
  };

  const getPostThumbnail = (post: Post) => {
    if (post.images && post.images.length > 0) {
      return post.images[0];
    }
    if (post.thumbnail) {
      return post.thumbnail;
    }
    return null;
  };

  const handlePostClick = (post: Post) => {
    // Mapear el post del backend al formato esperado por el modal
    const mappedPost = {
      id: post.id,
      userId: post.user.username,
      user: {
        id: post.user.username,
        username: post.user.username,
        email: '',
        displayName: post.user.display_name,
        bio: '',
        avatar: post.user.avatar_url,
        coverPhoto: null,
        position: '',
        team: '',
        followers: 0,
        following: 0,
        posts: 0,
        interests: [],
      },
      content: post.content,
      images: post.images || [],
      video: post.video,
      thumbnail: post.thumbnail,
      podcastUrl: post.podcast_url,
      streamingUrl: post.streaming_url,
      type: post.post_type as 'text' | 'image' | 'video' | 'highlight' | 'podcast' | 'streaming',
      category: post.category as any,
      likes: post.likes_count,
      celebrations: post.celebrations_count,
      golazos: post.golazos_count,
      laughs: 0,
      comments: [],
      createdAt: post.created_at,
    };
    
    setSelectedPost(mappedPost as any);
    setIsPostModalOpen(true);
  };

  const handleReaction = async (postId: string, reactionType: 'like' | 'celebration' | 'golazo', e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast({
          title: "Error",
          description: "Debes iniciar sesión para reaccionar",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(`http://127.0.0.1:8000/api/posts/${postId}/react/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reaction_type: reactionType }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Actualizar el contador localmente
        setPosts(prevPosts => 
          prevPosts.map(post => {
            if (post.id === postId) {
              const countField = `${reactionType}s_count` as keyof Post;
              return {
                ...post,
                [countField]: data.added 
                  ? (post[countField] as number) + 1 
                  : Math.max((post[countField] as number) - 1, 0)
              };
            }
            return post;
          })
        );

        toast({
          title: data.added ? "¡Reacción agregada!" : "Reacción eliminada",
          description: data.message || (data.added ? "Tu reacción ha sido registrada" : "Tu reacción ha sido eliminada"),
        });
      } else {
        throw new Error('Error al procesar la reacción');
      }
    } catch (error) {
      console.error('Error en reacción:', error);
      toast({
        title: "Error",
        description: "No se pudo agregar la reacción",
        variant: "destructive",
      });
    }
  };

  const postTypes = [
    { value: 'all', label: 'Todas', icon: <Grid className="w-4 h-4" /> },
    { value: 'text', label: 'Estados', icon: <FileText className="w-4 h-4" /> },
    { value: 'image', label: 'Fotos', icon: <ImageIcon className="w-4 h-4" /> },
    { value: 'video', label: 'Videos', icon: <Video className="w-4 h-4" /> },
    { value: 'podcast', label: 'Podcasts', icon: <Mic className="w-4 h-4" /> },
    { value: 'streaming', label: 'Streams', icon: <Radio className="w-4 h-4" /> },
    { value: 'friends', label: 'Amigos', icon: <Users className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{stats.stats.total_posts}</div>
              <div className="text-sm text-gray-600">Publicaciones</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-500">
                {stats.stats.total_reactions.likes + stats.stats.total_reactions.celebrations + stats.stats.total_reactions.golazos}
              </div>
              <div className="text-sm text-gray-600">Reacciones</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-500">{stats.stats.total_reactions.comments}</div>
              <div className="text-sm text-gray-600">Comentarios</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-500">{stats.stats.total_reactions.views}</div>
              <div className="text-sm text-gray-600">Visualizaciones</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtros y vista */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Tabs value={selectedType} onValueChange={setSelectedType} className="w-full sm:w-auto">
          <TabsList className="grid grid-cols-4 sm:grid-cols-7 w-full sm:w-auto">
            {postTypes.map((type) => (
              <TabsTrigger key={type.value} value={type.value} className="flex items-center space-x-1">
                {type.icon}
                <span className="hidden sm:inline">{type.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Vista de Amigos */}
      {selectedType === 'friends' ? (
        <div className="space-y-4">
          {/* Barra de búsqueda */}
          {allFriends.length > 0 && (
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Buscar por @usuario o nombre..."
                value={friendsSearch}
                onChange={(e) => handleFriendsSearch(e.target.value)}
                className="w-full px-4 py-2 pl-10 bg-black/40 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-neon-green/50 focus:ring-1 focus:ring-neon-green/50"
              />
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              {friendsSearch && (
                <button
                  onClick={() => handleFriendsSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-sm"
                >
                  ✕
                </button>
              )}
            </div>
          )}

          {loadingFriends ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-gray-500 mt-2">Cargando amigos...</p>
            </div>
          ) : friends.length === 0 && !friendsSearch ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                No hay amigos
              </h3>
              <p className="text-gray-500">
                {isOwnProfile 
                  ? 'Aún no tienes amigos. ¡Envía solicitudes de amistad!'
                  : 'Este usuario aún no tiene amigos.'
                }
              </p>
            </div>
          ) : friends.length === 0 && friendsSearch ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                Sin resultados
              </h3>
              <p className="text-gray-500">
                No se encontraron amigos con "{friendsSearch}"
              </p>
            </div>
          ) : (
            <>
              {/* Contador */}
              <div className="text-sm text-gray-400">
                Mostrando {friends.length} de {friendsSearch ? getFilteredFriends().length : allFriends.length} amigos
                {friendsSearch && ` (filtrado por "${friendsSearch}")`}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {friends.map((friend) => (
                  <Card 
                    key={friend.id} 
                    className="overflow-hidden hover:shadow-lg hover:border-neon-green/50 transition-all cursor-pointer glass-card"
                    onClick={() => window.location.href = `/profile/${friend.username}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={friend.avatar_url || friend.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(friend.display_name || friend.username)}&background=39FF14&color=000`}
                          alt={friend.display_name || friend.username}
                          className="w-12 h-12 rounded-full object-cover border-2 border-neon-green/30"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-white truncate">{friend.display_name || friend.username}</h4>
                          <p className="text-sm text-gray-400 truncate">@{friend.username}</p>
                        </div>
                      </div>
                      {friend.bio && (
                        <p className="text-xs text-gray-500 mt-2 line-clamp-2">{friend.bio}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Botón cargar más */}
              {friendsHasMore && (
                <div className="text-center pt-4">
                  <Button
                    onClick={loadMoreFriends}
                    variant="outline"
                    className="border-neon-green/30 text-neon-green hover:bg-neon-green/10"
                  >
                    Cargar más amigos
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <>
      {/* Posts */}
      {loading && posts.length === 0 ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-500 mt-2">Cargando publicaciones...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay publicaciones
          </h3>
          <p className="text-gray-500">
            {isOwnProfile 
              ? 'Aún no has publicado nada. ¡Comparte tu primera publicación!'
              : 'Este usuario aún no ha publicado nada.'
            }
          </p>
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {posts.map((post) => (
                <Card 
                  key={post.id} 
                  className="overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer glass-card group"
                  onClick={() => handlePostClick(post)}
                >
                  <div className="relative">
                    {getPostThumbnail(post) ? (
                      <div className="relative w-full h-64 overflow-hidden bg-black/20">
                        <img
                          src={getPostThumbnail(post)!}
                          alt="Post thumbnail"
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-0 left-0 right-0 p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <p className="text-sm line-clamp-2 font-medium">{post.content}</p>
                        </div>
                      </div>
                    ) : post.post_type === 'text' ? (
                      <div className="w-full h-48 bg-gradient-to-br from-neon-green/10 to-neon-blue/10 flex items-center justify-center p-6 border-b border-white/10">
                        <div className="text-center w-full">
                          <div className="text-neon-green mb-3">
                            {getPostTypeIcon(post.post_type)}
                          </div>
                          <p className="text-sm text-white line-clamp-4 font-medium leading-relaxed">
                            {post.content}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center border-b border-white/10">
                        <div className="text-center">
                          <div className="text-gray-400 mb-2">
                            {getPostTypeIcon(post.post_type)}
                          </div>
                          <p className="text-xs text-gray-300">
                            {getPostTypeLabel(post.post_type)}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary" className={`text-xs ${
                        post.post_type === 'text' 
                          ? 'bg-neon-green/20 text-neon-green border border-neon-green/30'
                          : 'bg-white/10 text-gray-300 border border-white/20'
                      }`}>
                        {getPostTypeLabel(post.post_type)}
                      </Badge>
                    </div>
                    
                    {post.is_pinned && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="default" className="text-xs bg-yellow-500/80 text-yellow-100">
                          Fijado
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-4 bg-white/5">
                    {post.post_type !== 'text' && (
                      <p className="text-sm text-gray-300 line-clamp-2 mb-2">
                        {post.content}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{formatDate(post.created_at)}</span>
                      <div className="flex items-center space-x-3">
                        <button 
                          className="flex items-center space-x-1 hover:text-red-400 transition-colors group/btn"
                          onClick={(e) => handleReaction(post.id, 'like', e)}
                          title="Me gusta"
                        >
                          <Heart className="w-3 h-3 group-hover/btn:fill-red-400" />
                          <span>{post.likes_count + post.celebrations_count + post.golazos_count}</span>
                        </button>
                        <button 
                          className="flex items-center space-x-1 hover:text-blue-400 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePostClick(post);
                          }}
                          title="Comentarios"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>{post.comments_count}</span>
                        </button>
                        <span className="flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>{post.views_count}</span>
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <Card 
                  key={post.id} 
                  className="hover:shadow-lg transition-shadow cursor-pointer glass-card"
                  onClick={() => handlePostClick(post)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      {getPostThumbnail(post) ? (
                        <img
                          src={getPostThumbnail(post)!}
                          alt="Post thumbnail"
                          className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                        />
                      ) : post.post_type === 'text' ? (
                        <div className="w-20 h-20 bg-gradient-to-br from-neon-green/10 to-neon-blue/10 rounded-lg flex items-center justify-center flex-shrink-0 border border-white/10">
                          <div className="text-neon-green">
                            {getPostTypeIcon(post.post_type)}
                          </div>
                        </div>
                      ) : (
                        <div className="w-20 h-20 bg-gradient-to-br from-white/5 to-white/10 rounded-lg flex items-center justify-center flex-shrink-0 border border-white/10">
                          <div className="text-gray-400">
                            {getPostTypeIcon(post.post_type)}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="secondary" className={`text-xs ${
                            post.post_type === 'text' 
                              ? 'bg-neon-green/20 text-neon-green border border-neon-green/30'
                              : 'bg-white/10 text-gray-300 border border-white/20'
                          }`}>
                            {getPostTypeLabel(post.post_type)}
                          </Badge>
                          {post.is_pinned && (
                            <Badge variant="default" className="text-xs bg-yellow-500/80 text-yellow-100">
                              Fijado
                            </Badge>
                          )}
                          <span className="text-xs text-gray-400">{formatDate(post.created_at)}</span>
                        </div>
                        
                        <p className="text-gray-300 line-clamp-3 mb-3 leading-relaxed">
                          {post.content}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <button 
                              className="flex items-center space-x-1 hover:text-red-400 transition-colors"
                              onClick={(e) => handleReaction(post.id, 'like', e)}
                              title="Me gusta"
                            >
                              <span>❤️</span>
                              <span>{post.likes_count + post.celebrations_count + post.golazos_count}</span>
                            </button>
                            <button 
                              className="flex items-center space-x-1 hover:text-blue-400 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePostClick(post);
                              }}
                              title="Comentarios"
                            >
                              <span>💬</span>
                              <span>{post.comments_count}</span>
                            </button>
                            <span className="text-purple-400">🔄 {post.shares_count}</span>
                            <span className="text-green-400">👁️ {post.views_count}</span>
                          </div>
                          
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Cargar más */}
          {hasMore && (
            <div className="text-center">
              <Button
                variant="outline"
                onClick={loadMore}
                disabled={loading}
                className="w-full sm:w-auto"
              >
                {loading ? 'Cargando...' : 'Cargar más publicaciones'}
              </Button>
            </div>
          )}
        </>
      )}
        </>
      )}

      {/* Modal de detalle de publicación */}
      {selectedPost && (
        <PostDetailDialog
          isOpen={isPostModalOpen}
          onClose={() => {
            setIsPostModalOpen(false);
            setSelectedPost(null);
          }}
          post={selectedPost}
          onPostUpdated={(updatedPost) => {
            // Actualizar el post en la lista
            setPosts(posts.map(p => p.id === updatedPost.id ? updatedPost : p));
          }}
        />
      )}
    </div>
  );
}