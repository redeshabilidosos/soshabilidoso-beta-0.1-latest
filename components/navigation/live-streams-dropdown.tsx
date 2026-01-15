'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Card, CardContent } from '@/components/ui/card';
import { CyberButton } from '@/components/ui/cyber-button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Radio,
  Users,
  Eye,
  Play,
  Video,
  MessageSquare,
  Clock,
  Zap,
  ChevronDown,
  ExternalLink,
  X,
  GraduationCap,
  Gamepad2
} from 'lucide-react';
import { ClassStreamModal } from '@/components/streaming/class-stream-modal';
import { ViewerStreamModal } from '@/components/streaming/viewer-stream-modal';

interface LiveStream {
  id: string;
  type: 'meeting' | 'reel' | 'community_event' | 'match';
  title: string;
  description: string;
  hostName: string;
  hostAvatar: string;
  communityName?: string;
  communityId?: string;
  viewers: number;
  duration: string; // tiempo transcurrido
  thumbnail: string;
  isLive: boolean;
  category: string;
  tags: string[];
}

const mockLiveStreams: LiveStream[] = [
  {
    id: '1',
    type: 'meeting',
    title: 'Sesión de Q&A - Desarrollo Backend',
    description: 'Resuelve tus dudas sobre Node.js, APIs y bases de datos',
    hostName: 'Ana García',
    hostAvatar: '/api/placeholder/40/40',
    communityName: 'Desarrollo Web Avanzado',
    communityId: '1',
    viewers: 23,
    duration: '45:32',
    thumbnail: '/api/placeholder/300/200',
    isLive: true,
    category: 'Educación',
    tags: ['Backend', 'Q&A', 'Node.js']
  },
  {
    id: '2',
    type: 'reel',
    title: 'Gol increíble de Messi vs Real Madrid',
    description: 'El mejor gol de la temporada',
    hostName: 'FutbolTotal',
    hostAvatar: '/api/placeholder/40/40',
    viewers: 1247,
    duration: '02:15',
    thumbnail: '/api/placeholder/300/200',
    isLive: true,
    category: 'Deportes',
    tags: ['Fútbol', 'Goles', 'Messi']
  },
  {
    id: '3',
    type: 'community_event',
    title: 'Torneo de FIFA 24 - Final',
    description: 'La gran final del torneo comunitario',
    hostName: 'GamersUnited',
    hostAvatar: '/api/placeholder/40/40',
    communityName: 'Gamers Colombia',
    communityId: '2',
    viewers: 456,
    duration: '1:23:45',
    thumbnail: '/api/placeholder/300/200',
    isLive: true,
    category: 'Gaming',
    tags: ['FIFA', 'Torneo', 'Final']
  },
  {
    id: '4',
    type: 'match',
    title: 'América vs Nacional - EN VIVO',
    description: 'Clásico del fútbol colombiano',
    hostName: 'Deportes SOS',
    hostAvatar: '/api/placeholder/40/40',
    viewers: 3421,
    duration: '78:12',
    thumbnail: '/api/placeholder/300/200',
    isLive: true,
    category: 'Deportes',
    tags: ['Fútbol', 'Clásico', 'Colombia']
  }
];

export function LiveStreamsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [streams, setStreams] = useState<LiveStream[]>([]);
  const [filter, setFilter] = useState<'all' | 'meeting' | 'reel' | 'community_event' | 'match'>('all');
  const [mounted, setMounted] = useState(false);
  const [showClassModal, setShowClassModal] = useState(false);
  const [showStreamModal, setShowStreamModal] = useState(false);

  // Verificar que estamos en el cliente y cargar streams
  useEffect(() => {
    setMounted(true);
    loadActiveStreams();
  }, []);

  const loadActiveStreams = () => {
    // Cargar streams activos desde localStorage
    const activeStreams = JSON.parse(localStorage.getItem('active_streams') || '[]');
    
    // Convertir al formato LiveStream
    const liveStreams: LiveStream[] = activeStreams.map((s: any) => ({
      id: s.id,
      type: 'meeting' as const,
      title: s.title,
      description: s.description || '',
      hostName: s.hostName || 'Usuario',
      hostAvatar: s.hostAvatar || '/api/placeholder/40/40',
      communityName: s.communityName,
      communityId: s.communityId,
      viewers: Math.floor(Math.random() * 100) + 1,
      duration: getTimeSince(s.startedAt),
      thumbnail: '/api/placeholder/300/200',
      isLive: true,
      category: 'Streaming',
      tags: ['En Vivo'],
      isPrivate: s.isPrivate
    }));
    
    // Combinar con mock streams si no hay streams activos
    if (liveStreams.length === 0) {
      setStreams(mockLiveStreams);
    } else {
      setStreams([...liveStreams, ...mockLiveStreams.slice(0, 2)]);
    }
  };

  const getTimeSince = (startedAt: string) => {
    const start = new Date(startedAt);
    const now = new Date();
    const diff = Math.floor((now.getTime() - start.getTime()) / 1000);
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Simular actualizaciones en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setStreams(prev => prev.map(stream => ({
        ...stream,
        viewers: stream.viewers + Math.floor(Math.random() * 10) - 5, // Variación aleatoria
        duration: updateDuration(stream.duration)
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const updateDuration = (duration: string) => {
    const [minutes, seconds] = duration.split(':').map(Number);
    const totalSeconds = minutes * 60 + seconds + 1;
    const newMinutes = Math.floor(totalSeconds / 60);
    const newSeconds = totalSeconds % 60;
    return `${newMinutes}:${newSeconds.toString().padStart(2, '0')}`;
  };

  const filteredStreams = streams.filter(stream => {
    if (filter === 'all') return true;
    return stream.type === filter;
  });

  const getTypeIcon = (type: LiveStream['type']) => {
    switch (type) {
      case 'meeting':
        return <Video className="w-4 h-4" />;
      case 'reel':
        return <Play className="w-4 h-4" />;
      case 'community_event':
        return <Users className="w-4 h-4" />;
      case 'match':
        return <Radio className="w-4 h-4" />;
      default:
        return <Radio className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: LiveStream['type']) => {
    switch (type) {
      case 'meeting':
        return 'Reunión';
      case 'reel':
        return 'Reel';
      case 'community_event':
        return 'Evento';
      case 'match':
        return 'Partido';
      default:
        return 'En Vivo';
    }
  };

  const handleStreamClick = (stream: LiveStream & { isPrivate?: boolean }) => {
    // Si es privado, verificar acceso
    if (stream.isPrivate) {
      // TODO: Verificar si el usuario tiene acceso a la comunidad
      console.log('Stream privado - verificar acceso');
    }
    
    // Todos los streams en vivo van a meeting
    if (stream.id.startsWith('live-')) {
      window.location.href = `/meeting/${stream.id}`;
    } else {
      switch (stream.type) {
        case 'meeting':
          window.location.href = `/meeting/${stream.id}`;
          break;
        case 'reel':
          window.location.href = `/reels?id=${stream.id}`;
          break;
        case 'community_event':
          if (stream.communityId) {
            window.location.href = `/communities/${stream.communityId}`;
          }
          break;
        case 'match':
          window.location.href = `/live/${stream.id}`;
          break;
      }
    }
    setIsOpen(false);
  };

  const totalViewers = streams.reduce((total, stream) => total + stream.viewers, 0);

  // Componente del Modal
  const Modal = () => (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ marginLeft: 0 }}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden mx-auto">
        <Card className="glass-card border border-gray-700 shadow-2xl">
        <CardContent className="p-0">
          {/* Header */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Radio className="w-6 h-6 text-red-500" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                </div>
                <h3 className="text-xl font-bold text-white">Transmisiones en Vivo</h3>
                <Badge className="bg-red-500 text-white">
                  {streams.length} activas
                </Badge>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <Eye className="w-4 h-4" />
                  <span>{totalViewers.toLocaleString()} espectadores totales</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CyberButton
                    size="sm"
                    onClick={() => {
                      setShowClassModal(true);
                      setIsOpen(false);
                    }}
                    className="flex items-center space-x-2 bg-neon-green/20 border-neon-green/50 hover:bg-neon-green/30"
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span className="hidden md:inline">Clase</span>
                  </CyberButton>
                  <CyberButton
                    size="sm"
                    onClick={() => {
                      setShowStreamModal(true);
                      setIsOpen(false);
                    }}
                    className="flex items-center space-x-2 bg-purple-500/20 border-purple-500/50 hover:bg-purple-500/30"
                  >
                    <Gamepad2 className="w-4 h-4" />
                    <span className="hidden md:inline">Stream</span>
                  </CyberButton>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400 hover:text-white" />
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {(['all', 'meeting', 'reel', 'community_event', 'match'] as const).map((filterType) => (
                <CyberButton
                  key={filterType}
                  variant={filter === filterType ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(filterType)}
                  className="text-sm"
                >
                  {filterType === 'all' && 'Todas'}
                  {filterType === 'meeting' && 'Reuniones'}
                  {filterType === 'reel' && 'Reels'}
                  {filterType === 'community_event' && 'Eventos'}
                  {filterType === 'match' && 'Partidos'}
                </CyberButton>
              ))}
            </div>
          </div>

          {/* Streams List */}
          <div className="max-h-[70vh] overflow-y-auto">
            {filteredStreams.length === 0 ? (
              <div className="p-12 text-center">
                <Radio className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No hay transmisiones en vivo</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-6">
                {filteredStreams.map((stream) => (
                  <div
                    key={stream.id}
                    onClick={() => handleStreamClick(stream)}
                    className="p-4 hover:bg-gray-800/50 cursor-pointer transition-all rounded-lg border border-gray-700/50 hover:border-neon-green/50 group"
                  >
                    <div className="flex space-x-4">
                      {/* Thumbnail */}
                      <div className="relative flex-shrink-0">
                        <img
                          src={stream.thumbnail}
                          alt={stream.title}
                          className="w-32 h-20 object-cover rounded bg-gray-800"
                        />
                        <div className="absolute top-2 left-2">
                          <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center space-x-1">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            <span>EN VIVO</span>
                          </div>
                        </div>
                        <div className="absolute bottom-2 right-2">
                          <div className="bg-black/80 text-white px-2 py-1 rounded text-xs font-medium">
                            {stream.duration}
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-white font-semibold text-base line-clamp-2 pr-2 group-hover:text-neon-green transition-colors">
                            {stream.title}
                          </h4>
                          <Badge className="bg-gray-700 text-gray-300 text-xs flex items-center space-x-1 flex-shrink-0">
                            {getTypeIcon(stream.type)}
                            <span>{getTypeLabel(stream.type)}</span>
                          </Badge>
                        </div>

                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                          {stream.description}
                        </p>

                        <div className="flex items-center space-x-3 mb-3">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={stream.hostAvatar} />
                            <AvatarFallback className="bg-gradient-to-br from-neon-green to-neon-blue text-white text-xs">
                              {stream.hostName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-gray-300 text-sm font-medium">
                            {stream.hostName}
                          </span>
                          {stream.communityName && (
                            <>
                              <span className="text-gray-500">•</span>
                              <span className="text-gray-400 text-sm">
                                {stream.communityName}
                              </span>
                            </>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-400">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Eye className="w-4 h-4" />
                              <span className="font-medium">{stream.viewers.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{stream.duration}</span>
                            </div>
                          </div>
                          <ExternalLink className="w-4 h-4 text-neon-green opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {filteredStreams.length > 0 && (
            <div className="p-4 border-t border-gray-700 bg-gray-900/50">
              <CyberButton
                variant="outline"
                className="w-full"
                onClick={() => {
                  window.location.href = '/live';
                  setIsOpen(false);
                }}
              >
                Ver todas las transmisiones ({streams.length})
              </CyberButton>
            </div>
          )}
        </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="relative">
      {/* Trigger Button */}
      <CyberButton
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 relative"
      >
        <div className="relative">
          <Radio className="w-4 h-4" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        </div>
        <span className="hidden sm:inline">En Vivo</span>
        <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-500/30">
          {streams.length}
        </Badge>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </CyberButton>

      {/* Portal Modal */}
      {isOpen && mounted && typeof window !== 'undefined' && (
        createPortal(<Modal />, document.body)
      )}

      {/* Class Stream Modal */}
      <ClassStreamModal 
        isOpen={showClassModal} 
        onClose={() => setShowClassModal(false)} 
      />

      {/* Viewer Stream Modal */}
      <ViewerStreamModal 
        isOpen={showStreamModal} 
        onClose={() => setShowStreamModal(false)} 
      />
    </div>
  );
}