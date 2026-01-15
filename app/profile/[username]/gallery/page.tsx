'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/components/providers/providers';
import { Sidebar } from '@/components/navigation/sidebar';
import { MobileNav } from '@/components/navigation/mobile-nav';
import { CyberButton } from '@/components/ui/cyber-button';
import { 
  Image as ImageIcon, Play, Heart, MessageCircle, Share, Grid, List, X,
  FolderOpen, Video, Radio, Mic, Film, Plus, Eye, ArrowLeft, User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// Tipos
interface GalleryItem {
  id: string;
  type: 'image' | 'video' | 'reel' | 'stream' | 'podcast';
  url: string;
  thumbnail?: string;
  title?: string;
  caption: string;
  likes: number;
  comments: number;
  views?: number;
  duration?: string;
  createdAt: string;
  tags: string[];
  albumId?: string;
}

interface Album {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  itemCount: number;
  createdAt: string;
}

interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  coverPhoto?: string;
}

type TabType = 'all' | 'albums' | 'photos' | 'videos' | 'reels' | 'streams' | 'podcasts';


export default function UserGalleryPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const username = params.username as string;
  
  const [profileUser, setProfileUser] = useState<UserProfile | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  // Cargar datos del usuario y su galería
  useEffect(() => {
    const loadUserGallery = async () => {
      if (!username) return;
      
      try {
        setLoading(true);
        const { usersService } = await import('@/lib/services/users.service');
        
        // Obtener perfil del usuario
        const userProfile = await usersService.getUserProfile(username);
        setProfileUser({
          id: userProfile.id,
          username: userProfile.username,
          displayName: userProfile.display_name || (userProfile as any).displayName,
          avatar: userProfile.avatar_url || (userProfile as any).avatar,
          coverPhoto: userProfile.cover_photo || (userProfile as any).coverPhoto,
        });
        
        // Verificar si es el perfil propio
        setIsOwnProfile(user?.username === username);
        
        // Obtener TODOS los posts del usuario para extraer media (sin paginación limitada)
        // Cargar múltiples páginas si es necesario
        let allPosts: any[] = [];
        let currentPage = 1;
        let hasMore = true;
        
        while (hasMore) {
          const response = await usersService.getUserPosts(username, undefined, currentPage);
          console.log(`📸 Gallery - Page ${currentPage} response:`, response);
          
          const pagePosts = response.results || response || [];
          allPosts = [...allPosts, ...pagePosts];
          
          hasMore = !!response.next;
          currentPage++;
          
          // Limitar a 10 páginas máximo para evitar loops infinitos
          if (currentPage > 10) break;
        }
        
        const userPosts = allPosts;
        console.log('📸 Gallery - Total posts loaded:', userPosts.length);
        
        // Convertir posts a items de galería
        const items: GalleryItem[] = [];
        
        userPosts.forEach((post: any, postIndex: number) => {
          console.log(`📸 Post ${postIndex}:`, {
            id: post.id,
            type: post.post_type,
            hasImages: post.images?.length > 0,
            hasVideo: !!post.video,
            hasPodcast: !!post.podcast_url,
            hasStreaming: !!post.streaming_url,
            images: post.images,
            video: post.video
          });
          
          // Agregar imágenes
          if (post.images && post.images.length > 0) {
            post.images.forEach((img: string, idx: number) => {
              items.push({
                id: `${post.id}-img-${idx}`,
                type: 'image',
                url: img,
                caption: post.content || '',
                likes: post.likes_count || 0,
                comments: post.comments_count || 0,
                createdAt: post.created_at,
                tags: [],
              });
            });
          }
          
          // Agregar video
          if (post.video) {
            items.push({
              id: `${post.id}-video`,
              type: post.post_type === 'reel' ? 'reel' : 'video',
              url: post.video,
              thumbnail: post.thumbnail || post.images?.[0],
              caption: post.content || '',
              likes: post.likes_count || 0,
              comments: post.comments_count || 0,
              views: post.views_count,
              createdAt: post.created_at,
              tags: [],
            });
          }
          
          // Agregar podcast
          if (post.podcast_url) {
            items.push({
              id: `${post.id}-podcast`,
              type: 'podcast',
              url: post.podcast_url,
              thumbnail: post.images?.[0],
              title: post.title || 'Podcast',
              caption: post.content || '',
              likes: post.likes_count || 0,
              comments: post.comments_count || 0,
              createdAt: post.created_at,
              tags: [],
            });
          }
          
          // Agregar streaming
          if (post.streaming_url || post.post_type === 'streaming') {
            items.push({
              id: `${post.id}-stream`,
              type: 'stream',
              url: post.streaming_url || '',
              thumbnail: post.images?.[0],
              title: post.title || 'Stream',
              caption: post.content || '',
              likes: post.likes_count || 0,
              comments: post.comments_count || 0,
              views: post.views_count,
              createdAt: post.created_at,
              tags: [],
            });
          }
        });
        
        console.log('📸 Gallery - Total items extracted:', items.length);
        setGalleryItems(items);
        
        // Cargar álbumes del usuario (incluyendo Fotos de Perfil y Fotos de Portada)
        try {
          const loadedAlbums: Album[] = [];
          
          // Cargar álbum de fotos de perfil (siempre mostrar, aunque esté vacío)
          const profilePhotosAlbum = await usersService.getProfilePhotosAlbum(username);
          loadedAlbums.push({
            id: profilePhotosAlbum?.id || 'profile-photos',
            name: 'Fotos de Perfil',
            description: 'Historial de fotos de perfil',
            coverImage: profilePhotosAlbum?.files?.[0]?.file_url || profilePhotosAlbum?.cover_image || userProfile.avatar_url,
            itemCount: profilePhotosAlbum?.file_count || profilePhotosAlbum?.files?.length || (userProfile.avatar_url ? 1 : 0),
            createdAt: profilePhotosAlbum?.created_at || new Date().toISOString(),
          });
          
          // Cargar álbum de fotos de portada (siempre mostrar, aunque esté vacío)
          const coverPhotosAlbum = await usersService.getCoverPhotosAlbum(username);
          const coverPhotoUrl = coverPhotosAlbum?.files?.[0]?.file_url || coverPhotosAlbum?.cover_image || userProfile.cover_photo || '';
          loadedAlbums.push({
            id: coverPhotosAlbum?.id || 'cover-photos',
            name: 'Fotos de Portada',
            description: 'Historial de fotos de portada',
            coverImage: coverPhotoUrl,
            itemCount: coverPhotosAlbum?.file_count || coverPhotosAlbum?.files?.length || (coverPhotoUrl ? 1 : 0),
            createdAt: coverPhotosAlbum?.created_at || new Date().toISOString(),
          });
          
          // Cargar otros álbumes del usuario
          const otherAlbums = await usersService.getUserAlbums(username);
          if (otherAlbums && Array.isArray(otherAlbums)) {
            otherAlbums.forEach((album: any) => {
              // Evitar duplicar los álbumes de perfil y portada
              if (album.name !== 'Fotos de Perfil' && album.name !== 'Fotos de Portada') {
                loadedAlbums.push({
                  id: album.id,
                  name: album.name,
                  description: album.description || '',
                  coverImage: album.cover_image || album.files?.[0]?.file_url || '',
                  itemCount: album.file_count || album.files?.length || 0,
                  createdAt: album.created_at,
                });
              }
            });
          }
          
          console.log('📸 Gallery - Albums loaded:', loadedAlbums);
          setAlbums(loadedAlbums);
        } catch (albumError) {
          console.error('❌ Error loading albums:', albumError);
        }
        
      } catch (error) {
        console.error('❌ Error loading gallery:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUserGallery();
  }, [username, user]);

  const [albumPhotos, setAlbumPhotos] = useState<GalleryItem[]>([]);
  const [loadingAlbum, setLoadingAlbum] = useState(false);

  useEffect(() => {
    setIsPlayingVideo(false);
  }, [selectedItem]);

  // Función para manejar click en álbum
  const handleAlbumClick = async (album: Album) => {
    setSelectedAlbum(album);
    setLoadingAlbum(true);
    
    try {
      const { usersService } = await import('@/lib/services/users.service');
      
      let albumData;
      if (album.name === 'Fotos de Perfil') {
        albumData = await usersService.getProfilePhotosAlbum(username);
      } else if (album.name === 'Fotos de Portada') {
        albumData = await usersService.getCoverPhotosAlbum(username);
      } else {
        // Para otros álbumes, cargar desde el endpoint general
        const allAlbums = await usersService.getUserAlbums(username);
        albumData = allAlbums.find((a: any) => a.id === album.id);
      }
      
      const photos: GalleryItem[] = [];
      
      if (albumData && albumData.files && albumData.files.length > 0) {
        albumData.files.forEach((file: any, idx: number) => {
          photos.push({
            id: file.id || `${album.id}-${idx}`,
            type: 'image' as const,
            url: file.file_url || file.file,
            caption: file.original_name || album.name,
            likes: 0,
            comments: 0,
            createdAt: file.created_at || album.createdAt,
            tags: [],
            albumId: album.id,
          });
        });
      } else if (album.name === 'Fotos de Perfil' && profileUser?.avatar) {
        // Si no hay fotos en el álbum pero el usuario tiene avatar, mostrarlo
        photos.push({
          id: 'current-avatar',
          type: 'image' as const,
          url: profileUser.avatar,
          caption: 'Foto de perfil actual',
          likes: 0,
          comments: 0,
          createdAt: new Date().toISOString(),
          tags: [],
          albumId: album.id,
        });
      } else if (album.name === 'Fotos de Portada' && (profileUser?.coverPhoto || album.coverImage)) {
        // Si no hay fotos en el álbum pero hay cover, mostrarlo
        photos.push({
          id: 'current-cover',
          type: 'image' as const,
          url: profileUser?.coverPhoto || album.coverImage,
          caption: 'Foto de portada actual',
          likes: 0,
          comments: 0,
          createdAt: new Date().toISOString(),
          tags: [],
          albumId: album.id,
        });
      }
      
      setAlbumPhotos(photos);
    } catch (error) {
      console.error('Error loading album photos:', error);
      setAlbumPhotos([]);
    } finally {
      setLoadingAlbum(false);
    }
  };

  // Filtrar items según la pestaña activa
  const getFilteredItems = useCallback(() => {
    if (selectedAlbum) {
      return albumPhotos;
    }
    switch (activeTab) {
      case 'photos': return galleryItems.filter(i => i.type === 'image');
      case 'videos': return galleryItems.filter(i => i.type === 'video');
      case 'reels': return galleryItems.filter(i => i.type === 'reel');
      case 'streams': return galleryItems.filter(i => i.type === 'stream');
      case 'podcasts': return galleryItems.filter(i => i.type === 'podcast');
      default: return galleryItems;
    }
  }, [activeTab, galleryItems, selectedAlbum, albumPhotos]);

  const filteredItems = getFilteredItems();

  // Estadísticas
  const stats = {
    total: galleryItems.length,
    photos: galleryItems.filter(i => i.type === 'image').length,
    videos: galleryItems.filter(i => i.type === 'video').length,
    reels: galleryItems.filter(i => i.type === 'reel').length,
    streams: galleryItems.filter(i => i.type === 'stream').length,
    podcasts: galleryItems.filter(i => i.type === 'podcast').length,
    totalLikes: galleryItems.reduce((sum, item) => sum + item.likes, 0),
  };

  const tabs: { key: TabType; label: string; icon: any; count: number }[] = [
    { key: 'all', label: 'Todo', icon: Grid, count: stats.total },
    { key: 'albums', label: 'Álbumes', icon: FolderOpen, count: albums.length },
    { key: 'photos', label: 'Fotos', icon: ImageIcon, count: stats.photos },
    { key: 'videos', label: 'Videos', icon: Video, count: stats.videos },
    { key: 'reels', label: 'Reels', icon: Film, count: stats.reels },
    { key: 'streams', label: 'Streams', icon: Radio, count: stats.streams },
    { key: 'podcasts', label: 'Podcasts', icon: Mic, count: stats.podcasts },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video size={16} />;
      case 'reel': return <Film size={16} />;
      case 'stream': return <Radio size={16} />;
      case 'podcast': return <Mic size={16} />;
      default: return <ImageIcon size={16} />;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-purple-500/20 text-purple-400';
      case 'reel': return 'bg-pink-500/20 text-pink-400';
      case 'stream': return 'bg-red-500/20 text-red-400';
      case 'podcast': return 'bg-orange-500/20 text-orange-400';
      default: return 'bg-neon-green/20 text-neon-green';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-10 h-10 border-3 border-neon-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }


  return (
    <div className="min-h-screen">
      <Sidebar />
      
      <main className="pb-24 xl:ml-64 xl:pb-0">
        <div className="max-w-6xl mx-auto p-4 space-y-6">
          {/* Header */}
          <div className="glass-card p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center space-x-4">
                <Link href={`/profile/${username}`} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <ArrowLeft className="text-gray-400" size={20} />
                </Link>
                {profileUser && (
                  <div className="flex items-center space-x-3">
                    <img src={profileUser.avatar} alt={profileUser.displayName} className="w-12 h-12 rounded-full ring-2 ring-neon-green/50" />
                    <div>
                      <h1 className="text-xl font-bold text-white flex items-center space-x-2">
                        <ImageIcon className="text-neon-green" size={20} />
                        <span>Galería de {profileUser.displayName}</span>
                      </h1>
                      <p className="text-gray-400 text-sm">@{profileUser.username}</p>
                    </div>
                  </div>
                )}
              </div>
              {isOwnProfile && (
                <CyberButton className="flex items-center space-x-2">
                  <Plus size={16} />
                  <span>Subir Contenido</span>
                </CyberButton>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 mb-6">
              <div className="text-center">
                <div className="text-xl font-bold text-neon-green">{stats.total}</div>
                <div className="text-xs text-gray-400">Total</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-blue-400">{stats.photos}</div>
                <div className="text-xs text-gray-400">Fotos</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-purple-400">{stats.videos}</div>
                <div className="text-xs text-gray-400">Videos</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-pink-400">{stats.reels}</div>
                <div className="text-xs text-gray-400">Reels</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-red-400">{stats.streams}</div>
                <div className="text-xs text-gray-400">Streams</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-orange-400">{stats.podcasts}</div>
                <div className="text-xs text-gray-400">Podcasts</div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 overflow-x-auto pb-2 scrollbar-hide">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => { setActiveTab(tab.key); setSelectedAlbum(null); }}
                    className={cn(
                      'flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
                      activeTab === tab.key
                        ? 'bg-neon-green/20 text-neon-green border border-neon-green/50'
                        : 'bg-white/5 text-gray-300 hover:bg-white/10'
                    )}
                  >
                    <tab.icon size={16} />
                    <span>{tab.label}</span>
                    <span className="text-xs opacity-60">({tab.count})</span>
                  </button>
                ))}
              </div>
              <div className="hidden sm:flex items-center space-x-2">
                <button onClick={() => setViewMode('grid')} className={cn('p-2 rounded-lg transition-colors', viewMode === 'grid' ? 'bg-neon-green/20 text-neon-green' : 'text-gray-400 hover:text-white')}>
                  <Grid size={20} />
                </button>
                <button onClick={() => setViewMode('list')} className={cn('p-2 rounded-lg transition-colors', viewMode === 'list' ? 'bg-neon-green/20 text-neon-green' : 'text-gray-400 hover:text-white')}>
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Albums Section */}
          {activeTab === 'albums' && (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {isOwnProfile && (
                <div className="football-card p-6 flex flex-col items-center justify-center min-h-[200px] cursor-pointer hover:border-neon-green/50 transition-colors">
                  <div className="w-16 h-16 rounded-full bg-neon-green/20 flex items-center justify-center mb-3">
                    <Plus className="text-neon-green" size={32} />
                  </div>
                  <span className="text-white font-medium">Crear Álbum</span>
                </div>
              )}
              {/* Mostrar álbumes */}
              {albums.map((album) => (
                <div 
                  key={album.id} 
                  className="football-card overflow-hidden cursor-pointer group hover:border-neon-green/50 transition-colors"
                  onClick={() => handleAlbumClick(album)}
                >
                  <div className="relative aspect-square">
                    {album.coverImage ? (
                      <img 
                        src={album.coverImage} 
                        alt={album.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-neon-green/20 to-neon-blue/20 flex items-center justify-center">
                        <FolderOpen className="text-neon-green" size={48} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-semibold truncate">{album.name}</h3>
                      <p className="text-gray-300 text-sm">{album.itemCount} {album.itemCount === 1 ? 'foto' : 'fotos'}</p>
                    </div>
                  </div>
                </div>
              ))}
              {albums.length === 0 && !isOwnProfile && (
                <div className="col-span-full text-center py-8 text-gray-400">
                  No hay álbumes creados
                </div>
              )}
            </div>
          )}

          {/* Vista de álbum seleccionado */}
          {selectedAlbum && (
            <div className="glass-card p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => { setSelectedAlbum(null); setAlbumPhotos([]); }}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="text-gray-400" size={20} />
                  </button>
                  <div>
                    <h2 className="text-lg font-bold text-white">{selectedAlbum.name}</h2>
                    <p className="text-gray-400 text-sm">{albumPhotos.length} {albumPhotos.length === 1 ? 'foto' : 'fotos'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Gallery Content */}
          {(activeTab !== 'albums' || selectedAlbum) && (
            <>
              {loadingAlbum ? (
                <div className="glass-card p-8 text-center">
                  <div className="w-10 h-10 border-3 border-neon-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-400">Cargando álbum...</p>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="glass-card p-8 text-center">
                  <ImageIcon className="mx-auto text-gray-400 mb-4" size={48} />
                  <h3 className="text-lg font-semibold text-white mb-2">No hay contenido</h3>
                  <p className="text-gray-400">No se encontró contenido de este tipo</p>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredItems.map((item) => (
                    <div key={item.id} className="football-card overflow-hidden cursor-pointer group" onClick={() => setSelectedItem(item)}>
                      <div className="relative aspect-square">
                        {/* Para videos sin thumbnail, mostrar un placeholder con el primer frame o un fondo */}
                        {item.type === 'video' || item.type === 'reel' ? (
                          item.thumbnail ? (
                            <img src={item.thumbnail} alt={item.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-purple-900/50 to-black flex flex-col items-center justify-center">
                              <video 
                                src={item.url} 
                                className="w-full h-full object-cover"
                                muted
                                preload="metadata"
                                onLoadedMetadata={(e) => {
                                  // Intentar mostrar el primer frame
                                  const video = e.target as HTMLVideoElement;
                                  video.currentTime = 0.1;
                                }}
                              />
                            </div>
                          )
                        ) : (
                          <img src={item.thumbnail || item.url} alt={item.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        )}
                        <div className={cn('absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1', getTypeBadgeColor(item.type))}>
                          {getTypeIcon(item.type)}
                          <span className="capitalize">{item.type}</span>
                        </div>
                        {item.duration && <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 rounded text-white text-xs">{item.duration}</div>}
                        {['video', 'reel', 'stream'].includes(item.type) && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play className="text-white" size={40} />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white text-sm">
                            <div className="flex items-center space-x-3">
                              <span className="flex items-center space-x-1"><Heart size={14} /><span>{item.likes}</span></span>
                              {item.views && <span className="flex items-center space-x-1"><Eye size={14} /><span>{item.views}</span></span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredItems.map((item) => (
                    <div key={item.id} className="football-card p-4 flex items-center space-x-4 cursor-pointer hover:border-neon-green/30" onClick={() => setSelectedItem(item)}>
                      <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                        <img src={item.thumbnail || item.url} alt={item.caption} className="w-full h-full object-cover" />
                        {['video', 'reel', 'stream'].includes(item.type) && <div className="absolute inset-0 flex items-center justify-center bg-black/30"><Play size={20} className="text-white" /></div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={cn('px-2 py-0.5 rounded text-xs font-medium', getTypeBadgeColor(item.type))}>{item.type}</span>
                        </div>
                        <p className="text-white font-medium truncate">{item.title || item.caption}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                          <span className="flex items-center space-x-1"><Heart size={12} /><span>{item.likes}</span></span>
                          <span className="flex items-center space-x-1"><MessageCircle size={12} /><span>{item.comments}</span></span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <MobileNav />


      {/* Modal for selected item */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="relative">
              {selectedItem.type === 'image' ? (
                <img src={selectedItem.url} alt={selectedItem.caption} className="w-full h-auto max-h-[60vh] object-contain" />
              ) : selectedItem.type === 'podcast' ? (
                <div className="aspect-video bg-gradient-to-br from-orange-500/20 to-purple-500/20 flex flex-col items-center justify-center p-8">
                  <Mic className="text-orange-400 mb-4" size={64} />
                  <h3 className="text-white text-xl font-bold mb-2">{selectedItem.title}</h3>
                  <audio controls src={selectedItem.url} className="w-full max-w-md mt-4">Tu navegador no soporta audio.</audio>
                </div>
              ) : (
                <div className="relative w-full aspect-video bg-black">
                  {!isPlayingVideo ? (
                    <div className="relative w-full h-full cursor-pointer" onClick={() => setIsPlayingVideo(true)}>
                      <img src={selectedItem.thumbnail || selectedItem.url} alt={selectedItem.caption} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <Play className="text-white ml-1" size={40} />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <video src={selectedItem.url} controls autoPlay className="w-full h-full object-contain" poster={selectedItem.thumbnail} />
                  )}
                </div>
              )}
              <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors">
                <X size={20} />
              </button>
              <div className={cn('absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2', getTypeBadgeColor(selectedItem.type))}>
                {getTypeIcon(selectedItem.type)}
                <span className="capitalize">{selectedItem.type}</span>
              </div>
            </div>
            <div className="p-6">
              {selectedItem.title && <h3 className="text-white text-lg font-bold mb-2">{selectedItem.title}</h3>}
              <p className="text-gray-300 mb-4">{selectedItem.caption}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6 text-gray-400">
                  <span className="flex items-center space-x-2"><Heart size={18} /><span>{selectedItem.likes}</span></span>
                  <span className="flex items-center space-x-2"><MessageCircle size={18} /><span>{selectedItem.comments}</span></span>
                  {selectedItem.views && <span className="flex items-center space-x-2"><Eye size={18} /><span>{selectedItem.views} vistas</span></span>}
                </div>
                <div className="flex items-center space-x-2">
                  <CyberButton size="sm"><Heart size={16} /></CyberButton>
                  <CyberButton size="sm" variant="outline"><Share size={16} /></CyberButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
