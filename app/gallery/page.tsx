'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/providers';
import { Sidebar } from '@/components/navigation/sidebar';
import { MobileNav } from '@/components/navigation/mobile-nav';
import { CyberButton } from '@/components/ui/cyber-button';
import { 
  Image as ImageIcon, Play, Heart, MessageCircle, Share, Filter, Grid, List, X,
  FolderOpen, Video, Radio, Mic, Film, Plus, MoreHorizontal, Trash2, Edit, Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';

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

// Datos de ejemplo
const mockAlbums: Album[] = [
  { id: '1', name: 'Entrenamientos 2024', description: 'Mis mejores momentos de entrenamiento', coverImage: 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=400', itemCount: 12, createdAt: '2024-01-15' },
  { id: '2', name: 'Partidos Oficiales', description: 'Highlights de partidos', coverImage: 'https://images.pexels.com/photos/1618269/pexels-photo-1618269.jpeg?auto=compress&cs=tinysrgb&w=400', itemCount: 8, createdAt: '2024-01-10' },
  { id: '3', name: 'Celebraciones', description: 'Momentos de victoria', coverImage: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=400', itemCount: 5, createdAt: '2024-01-05' },
];

const mockGalleryItems: GalleryItem[] = [
  { id: '1', type: 'image', url: 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=800', caption: 'Entrenamiento matutino 💪⚽', likes: 156, comments: 23, createdAt: '2024-01-15T10:30:00Z', tags: ['entrenamiento'], albumId: '1' },
  { id: '2', type: 'video', url: '/manejobalon.mp4', thumbnail: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=400', caption: 'Golazo desde fuera del área! 🚀', likes: 289, comments: 45, duration: '0:45', createdAt: '2024-01-14T16:45:00Z', tags: ['gol'], albumId: '2' },
  { id: '3', type: 'image', url: 'https://images.pexels.com/photos/1618269/pexels-photo-1618269.jpeg?auto=compress&cs=tinysrgb&w=800', caption: 'Celebrando la victoria 🎉', likes: 198, comments: 34, createdAt: '2024-01-13T20:15:00Z', tags: ['victoria'], albumId: '3' },
  { id: '4', type: 'reel', url: '/manejobalon.mp4', thumbnail: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=400', title: 'Técnica de regate', caption: 'Tutorial de regate ⚽✨', likes: 567, comments: 89, views: 2340, duration: '0:30', createdAt: '2024-01-12T14:20:00Z', tags: ['tutorial'] },
  { id: '5', type: 'reel', url: '/manejobalon.mp4', thumbnail: 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=400', title: 'Control de balón', caption: 'Domina el balón 🎯', likes: 432, comments: 67, views: 1890, duration: '0:25', createdAt: '2024-01-11T18:30:00Z', tags: ['técnica'] },
  { id: '6', type: 'stream', url: '', thumbnail: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=400', title: 'Entrenamiento en vivo', caption: 'Stream de entrenamiento 📺', likes: 145, comments: 234, views: 890, duration: '1:23:45', createdAt: '2024-01-10T15:45:00Z', tags: ['live'] },
  { id: '7', type: 'podcast', url: '/audio-sample.mp3', thumbnail: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=400', title: 'Mentalidad ganadora', caption: 'Podcast sobre mentalidad deportiva 🎙️', likes: 89, comments: 12, views: 456, duration: '45:30', createdAt: '2024-01-09T12:00:00Z', tags: ['podcast', 'mentalidad'] },
];

type TabType = 'all' | 'albums' | 'photos' | 'videos' | 'reels' | 'streams' | 'podcasts';


export default function GalleryPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(mockGalleryItems);
  const [albums, setAlbums] = useState<Album[]>(mockAlbums);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    setIsPlayingVideo(false);
  }, [selectedItem]);

  if (authLoading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-10 h-10 border-3 border-neon-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  // Filtrar items según la pestaña activa
  const getFilteredItems = useCallback(() => {
    if (selectedAlbum) {
      return galleryItems.filter(item => item.albumId === selectedAlbum.id);
    }
    switch (activeTab) {
      case 'photos': return galleryItems.filter(i => i.type === 'image');
      case 'videos': return galleryItems.filter(i => i.type === 'video');
      case 'reels': return galleryItems.filter(i => i.type === 'reel');
      case 'streams': return galleryItems.filter(i => i.type === 'stream');
      case 'podcasts': return galleryItems.filter(i => i.type === 'podcast');
      default: return galleryItems;
    }
  }, [activeTab, galleryItems, selectedAlbum]);

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

  const handleLike = (itemId: string) => {
    setGalleryItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, likes: item.likes + 1 } : item
    ));
  };

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


  return (
    <div className="min-h-screen">
      <Sidebar />
      
      <main className="pb-24 xl:ml-64 xl:pb-0">
        <div className="max-w-6xl mx-auto p-4 space-y-6">
          {/* Header */}
          <div className="glass-card p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
                  <ImageIcon className="text-neon-green" />
                  <span>{selectedAlbum ? selectedAlbum.name : 'Mi Galería'}</span>
                </h1>
                <p className="text-gray-400">
                  {selectedAlbum ? selectedAlbum.description : 'Todos tus momentos futbolísticos en un solo lugar'}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {selectedAlbum && (
                  <CyberButton variant="outline" onClick={() => setSelectedAlbum(null)}>
                    ← Volver
                  </CyberButton>
                )}
                <CyberButton className="flex items-center space-x-2">
                  <Plus size={16} />
                  <span>Subir Contenido</span>
                </CyberButton>
              </div>
            </div>

            {/* Stats */}
            {!selectedAlbum && (
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
            )}

            {/* Tabs */}
            {!selectedAlbum && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 overflow-x-auto pb-2 scrollbar-hide">
                  {tabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
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
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn('p-2 rounded-lg transition-colors', viewMode === 'grid' ? 'bg-neon-green/20 text-neon-green' : 'text-gray-400 hover:text-white')}
                  >
                    <Grid size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn('p-2 rounded-lg transition-colors', viewMode === 'list' ? 'bg-neon-green/20 text-neon-green' : 'text-gray-400 hover:text-white')}
                  >
                    <List size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>


          {/* Albums Section */}
          {activeTab === 'albums' && !selectedAlbum && (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* Create Album Card */}
              <div className="football-card p-6 flex flex-col items-center justify-center min-h-[200px] cursor-pointer hover:border-neon-green/50 transition-colors">
                <div className="w-16 h-16 rounded-full bg-neon-green/20 flex items-center justify-center mb-3">
                  <Plus className="text-neon-green" size={32} />
                </div>
                <span className="text-white font-medium">Crear Álbum</span>
                <span className="text-gray-400 text-sm">Organiza tu contenido</span>
              </div>
              
              {albums.map((album) => (
                <div
                  key={album.id}
                  className="football-card overflow-hidden cursor-pointer group"
                  onClick={() => setSelectedAlbum(album)}
                >
                  <div className="relative aspect-video">
                    <img src={album.coverImage} alt={album.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-white font-semibold truncate">{album.name}</h3>
                      <p className="text-gray-300 text-sm">{album.itemCount} elementos</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Gallery Content */}
          {(activeTab !== 'albums' || selectedAlbum) && (
            <>
              {filteredItems.length === 0 ? (
                <div className="glass-card p-8 text-center">
                  <ImageIcon className="mx-auto text-gray-400 mb-4" size={48} />
                  <h3 className="text-lg font-semibold text-white mb-2">No hay contenido</h3>
                  <p className="text-gray-400 mb-4">Sube tu primer contenido</p>
                  <CyberButton><Plus size={16} className="mr-2" />Subir Contenido</CyberButton>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredItems.map((item) => (
                    <div key={item.id} className="football-card overflow-hidden cursor-pointer group" onClick={() => setSelectedItem(item)}>
                      <div className="relative aspect-square">
                        <img src={item.thumbnail || item.url} alt={item.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        
                        {/* Type Badge */}
                        <div className={cn('absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1', getTypeBadgeColor(item.type))}>
                          {getTypeIcon(item.type)}
                          <span className="capitalize">{item.type}</span>
                        </div>
                        
                        {/* Duration Badge */}
                        {item.duration && (
                          <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 rounded text-white text-xs">
                            {item.duration}
                          </div>
                        )}
                        
                        {/* Play Icon for videos */}
                        {['video', 'reel', 'stream'].includes(item.type) && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play className="text-white" size={40} />
                          </div>
                        )}
                        
                        {/* Hover Stats */}
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
                        {['video', 'reel', 'stream'].includes(item.type) && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30"><Play size={20} className="text-white" /></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={cn('px-2 py-0.5 rounded text-xs font-medium', getTypeBadgeColor(item.type))}>{item.type}</span>
                          {item.duration && <span className="text-gray-400 text-xs">{item.duration}</span>}
                        </div>
                        <p className="text-white font-medium truncate">{item.title || item.caption}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                          <span className="flex items-center space-x-1"><Heart size={12} /><span>{item.likes}</span></span>
                          <span className="flex items-center space-x-1"><MessageCircle size={12} /><span>{item.comments}</span></span>
                          {item.views && <span className="flex items-center space-x-1"><Eye size={12} /><span>{item.views}</span></span>}
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
                  <img src={selectedItem.thumbnail} alt={selectedItem.title} className="w-32 h-32 rounded-full object-cover mb-4 ring-4 ring-orange-500/50" />
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
              
              {/* Type Badge in Modal */}
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
                  {selectedItem.duration && <span className="text-sm">{selectedItem.duration}</span>}
                </div>
                <div className="flex items-center space-x-2">
                  <CyberButton size="sm" onClick={() => handleLike(selectedItem.id)}><Heart size={16} /></CyberButton>
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
