"use client";

import { useState } from 'react';
import { Users, UserPlus, MessageCircle, ArrowLeft, Search, Sparkles, TrendingUp, Award, Shield } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserSearch } from '@/components/users/user-search';
import { FriendRequests } from '@/components/users/friend-requests';
import { User, usersService } from '@/lib/services/users.service';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/navigation/sidebar';
import { MobileNav } from '@/components/navigation/mobile-nav';
import { useToast } from '@/hooks/use-toast';
import { CyberButton } from '@/components/ui/cyber-button';

export default function UsersPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleUserSelect = (user: User) => {
    // Navegar al perfil del usuario
    router.push(`/profile/${user.username}`);
  };

  const handleMessageUser = async (user: User) => {
    try {
      // Crear o obtener chat con el usuario
      const response = await usersService.createChatWithUser(user.username);
      
      // Navegar al chat
      router.push(`/messages?user=${user.username}`);
      
      toast({
        title: "Éxito",
        description: response.created ? `Chat creado con ${user.display_name}` : `Abriendo chat con ${user.display_name}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Fondo de estrellas animadas */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="stars-container">
          <div className="star star-1">✦</div>
          <div className="star star-2">✧</div>
          <div className="star star-3">✦</div>
          <div className="star star-4">✧</div>
          <div className="star star-5">✦</div>
          <div className="star star-6">✧</div>
          <div className="star star-7">✦</div>
          <div className="star star-8">✧</div>
          <div className="star star-9">✦</div>
          <div className="star star-10">✧</div>
          <div className="star star-11">✦</div>
          <div className="star star-12">✧</div>
          <div className="star star-13">✦</div>
          <div className="star star-14">✧</div>
          <div className="star star-15">✦</div>
          <div className="star star-16">✧</div>
          <div className="star star-17">✦</div>
          <div className="star star-18">✧</div>
          <div className="star star-19">✦</div>
          <div className="star star-20">✧</div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-amber-500/5" />
      </div>

      <Sidebar />
      <MobileNav />
      
      <main className="pb-24 lg:ml-64 lg:pb-0 pt-12 md:pt-6 lg:pt-6 relative z-10 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 space-y-6">
          {/* Botón Regresar - Solo visible en móvil y tablet */}
          <div className="lg:hidden">
            <CyberButton
              variant="outline"
              size="sm"
              onClick={() => router.push('/feed')}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Regresar
            </CyberButton>
          </div>

          {/* Header mejorado */}
          <div className="relative">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-green/20 to-neon-green/10 flex items-center justify-center border border-neon-green/30">
                <Users className="w-6 h-6 text-neon-green" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                  Descubrir Usuarios
                  <Badge variant="outline" className="text-xs border-neon-green/30 text-neon-green">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Nuevo
                  </Badge>
                </h1>
                <p className="text-sm md:text-base text-gray-400 mt-1">
                  Encuentra y conecta con otros usuarios de la comunidad
                </p>
              </div>
            </div>
          </div>

          {/* Tabs mejorados */}
          <Tabs defaultValue="search" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10 p-1">
              <TabsTrigger 
                value="search" 
                className="flex items-center gap-2 data-[state=active]:bg-neon-green/20 data-[state=active]:text-neon-green"
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Buscar Usuarios</span>
                <span className="sm:hidden">Buscar</span>
              </TabsTrigger>
              <TabsTrigger 
                value="requests" 
                className="flex items-center gap-2 data-[state=active]:bg-neon-green/20 data-[state=active]:text-neon-green"
              >
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Solicitudes</span>
                <span className="sm:hidden">Solicitudes</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="search" className="space-y-4">
              <Card className="glass-card border-white/10">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-neon-green/20 flex items-center justify-center">
                        <Search className="w-4 h-4 text-neon-green" />
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg">Buscar Usuarios</CardTitle>
                        <CardDescription className="text-xs text-gray-400">
                          Encuentra personas por nombre o empresa
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <UserSearch
                    onUserSelect={handleUserSelect}
                    onMessageUser={handleMessageUser}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="requests" className="space-y-4">
              <FriendRequests />
            </TabsContent>
          </Tabs>

          {/* Información adicional mejorada */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Consejos para Conectar */}
            <Card className="glass-card border-white/10 hover:border-neon-green/30 transition-all duration-300 group">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                  </div>
                  <CardTitle className="text-white text-lg">Consejos para Conectar</CardTitle>
                </div>
                <CardDescription className="text-xs text-gray-400">
                  Mejora tu experiencia en la comunidad
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-neon-green/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white text-sm mb-0.5">Completa tu perfil</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Un perfil completo ayuda a otros usuarios a conocerte mejor
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white text-sm mb-0.5">Sé activo</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Publica contenido y participa en conversaciones
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white text-sm mb-0.5">Respeta a la comunidad</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Mantén un ambiente positivo y respetuoso
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Funciones Disponibles */}
            <Card className="glass-card border-white/10 hover:border-purple-500/30 transition-all duration-300 group">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Award className="w-4 h-4 text-purple-400" />
                  </div>
                  <CardTitle className="text-white text-lg">Funciones Disponibles</CardTitle>
                </div>
                <CardDescription className="text-xs text-gray-400">
                  Descubre todo lo que puedes hacer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-neon-green/20 flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-neon-green" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white text-sm mb-0.5">Seguir usuarios</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Ve las publicaciones de usuarios que sigues
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <UserPlus className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white text-sm mb-0.5">Solicitudes de amistad</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Conecta más profundamente con otros usuarios
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white text-sm mb-0.5">Mensajes directos</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Chatea privadamente con tus amigos
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Estadísticas de la comunidad */}
          <Card className="glass-card border-white/10 hover:border-yellow-500/30 transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-yellow-400" />
                </div>
                <div>
                  <CardTitle className="text-white text-lg">Comunidad Activa</CardTitle>
                  <CardDescription className="text-xs text-gray-400">
                    Únete a miles de usuarios conectados
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-2xl font-bold text-neon-green mb-1">1.2K+</div>
                  <div className="text-xs text-gray-400">Usuarios Activos</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-2xl font-bold text-blue-400 mb-1">5.8K+</div>
                  <div className="text-xs text-gray-400">Conexiones</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-2xl font-bold text-purple-400 mb-1">12K+</div>
                  <div className="text-xs text-gray-400">Mensajes</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <style jsx global>{`
        .stars-container {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        .star {
          position: absolute;
          font-size: 14px;
          opacity: 0.3;
          color: #ffd700;
          text-shadow: 0 0 8px #ffd700;
          animation: starFloat 15s ease-in-out infinite;
        }
        @media (min-width: 768px) {
          .star { font-size: 18px; opacity: 0.25; }
        }
        .star-1 { top: 5%; left: 10%; animation-delay: 0s; }
        .star-2 { top: 12%; right: 8%; animation-delay: 1s; }
        .star-3 { top: 22%; left: 25%; animation-delay: 2s; }
        .star-4 { top: 8%; right: 30%; animation-delay: 3s; }
        .star-5 { top: 32%; left: 5%; animation-delay: 4s; }
        .star-6 { top: 42%; right: 12%; animation-delay: 5s; }
        .star-7 { top: 18%; left: 55%; animation-delay: 6s; }
        .star-8 { top: 52%; right: 20%; animation-delay: 7s; }
        .star-9 { top: 38%; left: 75%; animation-delay: 8s; }
        .star-10 { top: 62%; left: 12%; animation-delay: 9s; }
        .star-11 { top: 48%; right: 45%; animation-delay: 10s; }
        .star-12 { top: 72%; right: 8%; animation-delay: 11s; }
        .star-13 { top: 58%; left: 38%; animation-delay: 12s; }
        .star-14 { top: 82%; left: 60%; animation-delay: 13s; }
        .star-15 { top: 68%; right: 35%; animation-delay: 14s; }
        .star-16 { top: 78%; left: 5%; animation-delay: 0.5s; }
        .star-17 { top: 88%; right: 55%; animation-delay: 1.5s; }
        .star-18 { top: 28%; left: 88%; animation-delay: 2.5s; }
        .star-19 { top: 92%; left: 25%; animation-delay: 3.5s; }
        .star-20 { top: 3%; left: 42%; animation-delay: 4.5s; }

        @keyframes starFloat {
          0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.2; }
          25% { transform: translate(20px, 15px) rotate(90deg); opacity: 0.4; }
          50% { transform: translate(0, 30px) rotate(180deg); opacity: 0.2; }
          75% { transform: translate(-20px, 15px) rotate(270deg); opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}