'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CyberButton } from '@/components/ui/cyber-button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Radio, Users, Eye, Play, Clock, 
  GraduationCap, Gamepad2, Key, Search
} from 'lucide-react';
import { ClassStreamModal } from '@/components/streaming/class-stream-modal';
import { ViewerStreamModal } from '@/components/streaming/viewer-stream-modal';
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';
import Link from 'next/link';

interface LiveStream {
  id: string;
  type: 'class' | 'stream';
  title: string;
  description?: string;
  hostName: string;
  hostAvatar?: string;
  communityName?: string;
  category?: string;
  viewers: number;
  duration: string;
  isPrivate: boolean;
  accessCode?: string;
}

export default function LivePage() {
  const [streams, setStreams] = useState<LiveStream[]>([]);
  const [filter, setFilter] = useState<'all' | 'class' | 'stream'>('all');
  const [showClassModal, setShowClassModal] = useState(false);
  const [showStreamModal, setShowStreamModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadStreams();
    const interval = setInterval(loadStreams, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadStreams = () => {
    const activeStreams = JSON.parse(localStorage.getItem('active_streams') || '[]');
    const formattedStreams: LiveStream[] = activeStreams.map((s: any) => ({
      ...s,
      viewers: Math.floor(Math.random() * 100) + 1,
      duration: getTimeSince(s.startedAt),
    }));
    setStreams(formattedStreams);
  };

  const getTimeSince = (startedAt: string) => {
    const start = new Date(startedAt);
    const now = new Date();
    const diff = Math.floor((now.getTime() - start.getTime()) / 1000);
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const filteredStreams = streams.filter(s => {
    if (filter !== 'all' && s.type !== filter) return false;
    if (searchQuery && !s.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <AuthenticatedLayout>
      <div className="p-4 lg:pl-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center">
                <Radio className="w-8 h-8 text-red-500 mr-3" />
                Transmisiones en Vivo
              </h1>
              <p className="text-gray-400 mt-1">Mira o inicia una transmisión</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <CyberButton onClick={() => setShowClassModal(true)} className="bg-neon-green/20 border-neon-green/50">
                <GraduationCap className="w-4 h-4 mr-2" />
                Crear Clase
              </CyberButton>
              <CyberButton onClick={() => setShowStreamModal(true)} className="bg-purple-500/20 border-purple-500/50">
                <Gamepad2 className="w-4 h-4 mr-2" />
                Iniciar Stream
              </CyberButton>
            </div>
          </div>

          {/* Join with Code */}
          <Card className="glass-card border-neon-green/20 mb-6">
            <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <Key className="w-6 h-6 text-neon-green" />
                <div>
                  <p className="text-white font-medium">¿Tienes un código de acceso?</p>
                  <p className="text-gray-400 text-sm">Únete a una clase privada con el código del instructor</p>
                </div>
              </div>
              <Link href="/live/join">
                <CyberButton variant="outline">Ingresar código</CyberButton>
              </Link>
            </CardContent>
          </Card>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-neon-green focus:outline-none"
                placeholder="Buscar transmisiones..."
              />
            </div>
            <div className="flex space-x-2">
              {(['all', 'class', 'stream'] as const).map(f => (
                <CyberButton
                  key={f}
                  variant={filter === f ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(f)}
                >
                  {f === 'all' && 'Todas'}
                  {f === 'class' && <><GraduationCap className="w-4 h-4 mr-1" />Clases</>}
                  {f === 'stream' && <><Gamepad2 className="w-4 h-4 mr-1" />Streams</>}
                </CyberButton>
              ))}
            </div>
          </div>

          {/* Streams Grid */}
          {filteredStreams.length === 0 ? (
            <Card className="glass-card">
              <CardContent className="p-12 text-center">
                <Radio className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No hay transmisiones en vivo</h3>
                <p className="text-gray-400 mb-6">Sé el primero en iniciar una transmisión</p>
                <div className="flex justify-center space-x-3">
                  <CyberButton onClick={() => setShowClassModal(true)}>
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Crear Clase
                  </CyberButton>
                  <CyberButton onClick={() => setShowStreamModal(true)} variant="outline">
                    <Gamepad2 className="w-4 h-4 mr-2" />
                    Iniciar Stream
                  </CyberButton>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStreams.map(stream => (
                <Card key={stream.id} className="glass-card hover:border-neon-green/50 transition-all cursor-pointer group">
                  <CardContent className="p-0">
                    <div className="relative aspect-video bg-gray-800">
                      <img src="/api/placeholder/400/225" alt={stream.title} className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2 flex items-center space-x-2">
                        <Badge className="bg-red-500 text-white">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-1" />
                          EN VIVO
                        </Badge>
                        {stream.type === 'class' && (
                          <Badge className="bg-neon-green/80 text-black">
                            <GraduationCap className="w-3 h-3 mr-1" />Clase
                          </Badge>
                        )}
                        {stream.type === 'stream' && (
                          <Badge className="bg-purple-500/80 text-white">
                            <Gamepad2 className="w-3 h-3 mr-1" />Stream
                          </Badge>
                        )}
                      </div>
                      <div className="absolute bottom-2 right-2 flex items-center space-x-2">
                        <Badge className="bg-black/70 text-white"><Eye className="w-3 h-3 mr-1" />{stream.viewers}</Badge>
                        <Badge className="bg-black/70 text-white"><Clock className="w-3 h-3 mr-1" />{stream.duration}</Badge>
                      </div>
                      {stream.isPrivate && (
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-yellow-500/80 text-black"><Key className="w-3 h-3 mr-1" />Privado</Badge>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <Play className="w-8 h-8 text-white ml-1" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-white font-semibold mb-2 line-clamp-1 group-hover:text-neon-green transition-colors">{stream.title}</h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={stream.hostAvatar || '/api/placeholder/32/32'} />
                          <AvatarFallback className="text-xs">{stream.hostName?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-gray-400 text-sm">{stream.hostName}</span>
                      </div>
                      {stream.communityName && <Badge variant="outline" className="text-xs"><Users className="w-3 h-3 mr-1" />{stream.communityName}</Badge>}
                      {stream.category && <Badge variant="outline" className="text-xs ml-2">{stream.category}</Badge>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <ClassStreamModal isOpen={showClassModal} onClose={() => setShowClassModal(false)} />
      <ViewerStreamModal isOpen={showStreamModal} onClose={() => setShowStreamModal(false)} />
    </AuthenticatedLayout>
  );
}
