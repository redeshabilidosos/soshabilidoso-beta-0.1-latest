"use client";

import { useState } from 'react';
import { Users, UserPlus, MessageCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserSearch } from '@/components/users/user-search';
import { FriendRequests } from '@/components/users/friend-requests';
import { User, usersService } from '@/lib/services/users.service';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/navigation/sidebar';
import { MobileNav } from '@/components/navigation/mobile-nav';
import { useToast } from '@/hooks/use-toast';

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
    <div className="min-h-screen">
      <Sidebar />
      <MobileNav />
      
      <main className="pb-24 lg:ml-64 lg:pb-0 pt-28 md:pt-12 lg:pt-6 relative z-10 min-h-screen">
        <div className="max-w-4xl mx-auto p-4 space-y-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">
              Descubrir Usuarios
            </h1>
            <p className="text-gray-300">
              Encuentra y conecta con otros usuarios de la comunidad
            </p>
          </div>

          <Tabs defaultValue="search" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="search" className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Buscar Usuarios</span>
              </TabsTrigger>
              <TabsTrigger value="requests" className="flex items-center space-x-2">
                <UserPlus className="w-4 h-4" />
                <span>Solicitudes</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="search">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>Buscar Usuarios</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <UserSearch
                    onUserSelect={handleUserSelect}
                    onMessageUser={handleMessageUser}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="requests">
              <FriendRequests />
            </TabsContent>
          </Tabs>

          {/* Información adicional */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Consejos para Conectar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium">Completa tu perfil</h4>
                    <p className="text-sm text-gray-600">
                      Un perfil completo ayuda a otros usuarios a conocerte mejor
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium">Sé activo</h4>
                    <p className="text-sm text-gray-600">
                      Publica contenido y participa en conversaciones
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium">Respeta a la comunidad</h4>
                    <p className="text-sm text-gray-600">
                      Mantén un ambiente positivo y respetuoso
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Funciones Disponibles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Users className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Seguir usuarios</h4>
                    <p className="text-sm text-gray-600">
                      Ve las publicaciones de usuarios que sigues
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <UserPlus className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Solicitudes de amistad</h4>
                    <p className="text-sm text-gray-600">
                      Conecta más profundamente con otros usuarios
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MessageCircle className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Mensajes directos</h4>
                    <p className="text-sm text-gray-600">
                      Chatea privadamente con tus amigos
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}