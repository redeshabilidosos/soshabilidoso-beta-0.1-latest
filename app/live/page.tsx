'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Radio, Users, Eye, Play, Clock, 
  GraduationCap, Gamepad2, Key, Search, Video, Plus
} from 'lucide-react';
import { StreamingModal } from '@/components/streaming/streaming-modal';
import { Sidebar } from '@/components/navigation/sidebar';
import { MobileNav } from '@/components/navigation/mobile-nav';
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
    <div className="min-h-screen bg-transparent">
      <Sidebar />
      <MobileNav />
      
      <main className="pb-24 lg:ml-64 lg:pb-0">
        <div className="max-w-7xl mx-auto p-3 md:p-4 lg:p-6 space-y-4 md:space-y-6">
          {/* Header Card */}
          <Card className="border-0 bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl rounded-2xl">
            <CardHeader className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 md:gap-3 mb-2">
                    <div className="relative">
                      <Radio className="w-6 h-6 md:w-7 md:h-7 text-red-500" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    </div>
                    <CardTitle className="text-xl md:text-2xl lg:text-3xl">Transmisiones en Vivo</CardTitle>
                  </div>
                  <CardDescription className="text-xs md:text-sm">
                    Descubre transmisiones en vivo o inicia la tuya
                  </CardDescription>
                </div>
                
                {/* Action Buttons - Responsive */}
                <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                  <Link href="/live/meeting/create" className="w-full sm:w-auto">
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Crear Reunión</span>
                      <span className="sm:hidden">Reunión</span>
                    </Button>
                  </Link>
                  <Link href="/live/class/create" className="w-full sm:w-auto">
                    <Button 
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    >
                      <GraduationCap className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Crear Clase</span>
                      <span className="sm:hidden">Clase</span>
                    </Button>
                  </Link>
                  <Button 
                    onClick={() => setShowStreamModal(true)}
                    className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Iniciar Stream</span>
                    <span className="sm:hidden">Stream</span>
                  </Button>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Join with Code Card */}
              <Card className="rounded-xl border-primary/20 bg-gradient-to-r from-primary/5 to-purple-500/5">
                <CardContent className="p-3 md:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-start sm:items-center gap-3 flex-1">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Key className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm md:text-base font-medium mb-1">¿Tienes un código de acceso?</p>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        Únete a una clase privada con el código del instructor
                      </p>
                    </div>
                  </div>
                  <Link href="/live/join" className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full sm:w-auto">
                      Ingresar código
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </CardHeader>
          </Card>

          {/* Filters and Search */}
          <Card className="rounded-2xl bg-gray-900/80 backdrop-blur-xl border-gray-800">
            <CardContent className="p-3 md:p-4 space-y-3 md:space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 md:pl-10 h-9 md:h-10"
                  placeholder="Buscar transmisiones..."
                />
              </div>

              {/* Filter Tabs */}
              <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="w-full">
                <TabsList className="grid w-full grid-cols-3 h-auto">
                  <TabsTrigger value="all" className="text-xs md:text-sm py-2">
                    <Radio className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                    <span className="hidden sm:inline">Todas</span>
                    <span className="sm:hidden">Todo</span>
                  </TabsTrigger>
                  <TabsTrigger value="class" className="text-xs md:text-sm py-2">
                    <GraduationCap className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                    Clases
                  </TabsTrigger>
                  <TabsTrigger value="stream" className="text-xs md:text-sm py-2">
                    <Gamepad2 className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                    Streams
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>

          {/* Streams Grid */}
          {filteredStreams.length === 0 ? (
            <Card className="rounded-2xl border-dashed bg-gray-900/60 backdrop-blur-xl border-gray-800">
              <CardContent className="py-12 md:py-16 text-center">
                <div className="max-w-md mx-auto space-y-4">
                  <div className="relative inline-block">
                    <Radio className="w-16 h-16 md:w-20 md:h-20 text-muted-foreground" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold mb-2">No hay transmisiones en vivo</h3>
                    <p className="text-sm md:text-base text-muted-foreground mb-6">
                      Sé el primero en iniciar una transmisión y comparte tu contenido
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-center gap-3">
                    <Link href="/live/meeting/create">
                      <Button 
                        size="lg"
                        className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Crear Reunión
                      </Button>
                    </Link>
                    <Link href="/live/class/create">
                      <Button 
                        size="lg"
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                      >
                        <GraduationCap className="w-4 h-4 mr-2" />
                        Crear Clase
                      </Button>
                    </Link>
                    <Button 
                      onClick={() => setShowStreamModal(true)}
                      size="lg"
                      variant="outline"
                      className="w-full"
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Iniciar Stream
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
              {filteredStreams.map(stream => (
                <Link key={stream.id} href={`/live/stream/${stream.id}`}>
                  <Card className="rounded-2xl overflow-hidden hover:border-primary/50 transition-all cursor-pointer group h-full bg-gray-900/80 backdrop-blur-xl border-gray-800">
                    <CardContent className="p-0">
                      {/* Thumbnail */}
                      <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900">
                        <img 
                          src="/api/placeholder/400/225" 
                          alt={stream.title} 
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Top Badges */}
                        <div className="absolute top-2 left-2 flex flex-wrap items-center gap-1.5">
                          <Badge className="bg-red-500 text-white text-xs">
                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse mr-1" />
                            EN VIVO
                          </Badge>
                          {stream.type === 'class' && (
                            <Badge className="bg-green-500 text-white text-xs">
                              <GraduationCap className="w-3 h-3 mr-1" />
                              Clase
                            </Badge>
                          )}
                          {stream.type === 'stream' && (
                            <Badge className="bg-purple-500 text-white text-xs">
                              <Gamepad2 className="w-3 h-3 mr-1" />
                              Stream
                            </Badge>
                          )}
                        </div>

                        {/* Private Badge */}
                        {stream.isPrivate && (
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-yellow-500 text-black text-xs">
                              <Key className="w-3 h-3 mr-1" />
                              Privado
                            </Badge>
                          </div>
                        )}

                        {/* Bottom Stats */}
                        <div className="absolute bottom-2 right-2 flex items-center gap-1.5">
                          <Badge className="bg-black/70 text-white text-xs backdrop-blur-sm">
                            <Eye className="w-3 h-3 mr-1" />
                            {stream.viewers}
                          </Badge>
                          <Badge className="bg-black/70 text-white text-xs backdrop-blur-sm">
                            <Clock className="w-3 h-3 mr-1" />
                            {stream.duration}
                          </Badge>
                        </div>

                        {/* Hover Play Button */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm transform group-hover:scale-110 transition-transform">
                            <Play className="w-6 h-6 md:w-8 md:h-8 text-white ml-1" fill="white" />
                          </div>
                        </div>
                      </div>

                      {/* Stream Info */}
                      <div className="p-3 md:p-4 space-y-2">
                        <h3 className="font-semibold text-sm md:text-base line-clamp-2 group-hover:text-primary transition-colors">
                          {stream.title}
                        </h3>
                        
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6 md:w-7 md:h-7 ring-2 ring-transparent group-hover:ring-primary/50 transition-all">
                            <AvatarImage src={stream.hostAvatar || '/api/placeholder/32/32'} />
                            <AvatarFallback className="text-xs">
                              {stream.hostName?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs md:text-sm text-muted-foreground truncate">
                            {stream.hostName}
                          </span>
                        </div>

                        {(stream.communityName || stream.category) && (
                          <div className="flex flex-wrap items-center gap-1.5">
                            {stream.communityName && (
                              <Badge variant="outline" className="text-xs">
                                <Users className="w-3 h-3 mr-1" />
                                {stream.communityName}
                              </Badge>
                            )}
                            {stream.category && (
                              <Badge variant="secondary" className="text-xs">
                                {stream.category}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <StreamingModal isOpen={showStreamModal} onClose={() => setShowStreamModal(false)} />
    </div>
  );
}
