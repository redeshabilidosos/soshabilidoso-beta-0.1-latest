"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/providers';
import { Sidebar } from '@/components/navigation/sidebar';
import { MobileNav } from '@/components/navigation/mobile-nav';
import { UserPostsGrid } from '@/components/profile/user-posts-grid';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { usersService, User } from '@/lib/services/users.service';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Calendar, 
  MapPin, 
  MessageCircle, 
  UserPlus, 
  UserCheck, 
  Clock,
  ArrowLeft,
  Shield,
  X
} from 'lucide-react';

export default function PublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  
  const username = params.username as string;
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ url: string; type: 'avatar' | 'cover' } | null>(null);

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
      return;
    }
    
    if (username === currentUser.username) {
      router.push('/profile');
      return;
    }
    
    loadUserProfile();
  }, [username, currentUser]);

  const loadUserProfile = async () => {
    try {
      const userProfile = await usersService.getUserProfile(username);
      setProfileUser(userProfile);
    } catch (error) {
      console.error('Error loading user profile:', error);
      toast({
        title: "Error",
        description: "Usuario no encontrado",
        variant: "destructive",
      });
      router.push('/users');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!profileUser) return;
    
    setActionLoading(true);
    try {
      if (profileUser.is_following) {
        await usersService.unfollowUser(profileUser.username);
        setProfileUser(prev => prev ? { ...prev, is_following: false } : null);
        toast({
          title: "Éxito",
          description: `Has dejado de seguir a ${profileUser.display_name}`,
        });
      } else {
        await usersService.followUser(profileUser.username);
        setProfileUser(prev => prev ? { ...prev, is_following: true } : null);
        toast({
          title: "Éxito",
          description: `Ahora sigues a ${profileUser.display_name}`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendFriendRequest = async () => {
    if (!profileUser) return;
    
    setActionLoading(true);
    try {
      await usersService.sendFriendRequest(profileUser.username);
      setProfileUser(prev => prev ? { ...prev, friend_request_status: 'sent' } : null);
      toast({
        title: "Éxito",
        description: `Solicitud de amistad enviada a ${profileUser.display_name}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleMessage = async () => {
    if (!profileUser) return;
    
    try {
      const response = await usersService.createChatWithUser(profileUser.username);
      router.push(`/messages?user=${profileUser.username}`);
      
      if (response.created) {
        toast({
          title: "Éxito",
          description: `Chat creado con ${profileUser.display_name}`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getFriendRequestButton = () => {
    if (!profileUser) return null;

    if (profileUser.is_friend) {
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          <UserCheck className="w-4 h-4 mr-1" />
          Amigos
        </Badge>
      );
    }

    if (profileUser.friend_request_status === 'sent') {
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          <Clock className="w-4 h-4 mr-1" />
          Solicitud Enviada
        </Badge>
      );
    }

    if (profileUser.friend_request_status === 'received') {
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          <Clock className="w-4 h-4 mr-1" />
          Solicitud Recibida
        </Badge>
      );
    }

    return (
      <Button
        variant="outline"
        onClick={handleSendFriendRequest}
        disabled={actionLoading}
        className="flex items-center space-x-2"
      >
        <UserPlus className="w-4 h-4" />
        <span>Agregar Amigo</span>
      </Button>
    );
  };

  if (!currentUser) return null;

  if (loading) {
    return (
      <div className="min-h-screen">
        <Sidebar />
        <main className="pb-24 xl:ml-64 xl:pb-0">
          <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen">
        <Sidebar />
        <main className="pb-24 xl:ml-64 xl:pb-0">
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Usuario no encontrado</h2>
              <Button onClick={() => router.push('/users')}>
                Volver a búsqueda
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Sidebar />
      
      <main className="pb-24 xl:ml-64 xl:pb-0">
        <div className="max-w-4xl mx-auto p-4 space-y-6">
          {/* Header con botón de volver */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver</span>
            </Button>
          </div>

          {/* Cover Photo & Profile */}
          <div className="glass-card overflow-visible">
            {/* Cover Photo */}
            <div 
              className="relative h-48 lg:h-64 cursor-pointer overflow-hidden rounded-t-lg"
              onClick={() => {
                setSelectedImage({ 
                  url: (profileUser as any).cover_photo || (profileUser as any).coverPhoto || '/app/assets/logososbetav1.png', 
                  type: 'cover' 
                });
                setImageModalOpen(true);
              }}
            >
              <img
                src={(profileUser as any).cover_photo || (profileUser as any).coverPhoto || '/app/assets/logososbetav1.png'}
                alt="Cover"
                className="w-full h-full object-cover hover:opacity-90 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>

            {/* Profile Info - Sin superposición */}
            <div className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-6">
                {/* Avatar */}
                <div 
                  className="relative flex-shrink-0 cursor-pointer -mt-16 lg:-mt-16 mb-4 lg:mb-0"
                  onClick={() => {
                    setSelectedImage({ url: profileUser.avatar_url, type: 'avatar' });
                    setImageModalOpen(true);
                  }}
                >
                  <img
                    src={profileUser.avatar_url}
                    alt={profileUser.display_name}
                    className="w-28 h-28 lg:w-32 lg:h-32 rounded-full ring-4 ring-neon-green/50 mx-auto lg:mx-0 object-cover hover:ring-neon-green transition-all bg-black"
                  />
                  {profileUser.is_verified && (
                    <div className="absolute bottom-2 right-2 p-1 bg-blue-500 rounded-full">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                {/* Info del usuario */}
                <div className="flex-1 text-center lg:text-left min-w-0">
                  <div className="space-y-1">
                    <div className="flex items-center justify-center lg:justify-start space-x-2 flex-wrap">
                      <h1 className="text-xl lg:text-2xl font-bold text-white break-words">
                        {profileUser.display_name}
                      </h1>
                      {profileUser.is_verified && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                          ✓ Verificado
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">@{profileUser.username}</p>
                    {profileUser.bio && (
                      <p className="text-gray-300 text-sm max-w-md break-words mt-2">{profileUser.bio}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-center lg:justify-start flex-wrap gap-3 mt-3 text-xs text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Users size={14} />
                      <span>{profileUser.followers_count} seguidores</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>{profileUser.following_count} siguiendo</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>{profileUser.posts_count} posts</span>
                    </div>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="mt-4 lg:mt-0 flex flex-col space-y-2 flex-shrink-0">
                  <div className="flex space-x-2 justify-center lg:justify-end">
                    {getFriendRequestButton()}
                    
                    <Button
                      variant={profileUser.is_following ? "secondary" : "default"}
                      onClick={handleFollow}
                      disabled={actionLoading}
                      size="sm"
                      className="flex items-center space-x-1"
                    >
                      <Users className="w-4 h-4" />
                      <span>{profileUser.is_following ? 'Siguiendo' : 'Seguir'}</span>
                    </Button>
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={handleMessage}
                    size="sm"
                    className="flex items-center space-x-1"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Mensaje</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold text-white mb-4">Información</h2>
              <div className="space-y-4">
                {profileUser.position && (
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-neon-green rounded-full"></div>
                    <div>
                      <p className="text-gray-400 text-sm">Posición/Rol</p>
                      <p className="text-white font-medium">{profileUser.position}</p>
                    </div>
                  </div>
                )}
                
                {profileUser.team && (
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-neon-blue rounded-full"></div>
                    <div>
                      <p className="text-gray-400 text-sm">Equipo/Grupo</p>
                      <p className="text-white font-medium">{profileUser.team}</p>
                    </div>
                  </div>
                )}
                
                {(profileUser as any).interests && (profileUser as any).interests.length > 0 && (
                  <div className="flex items-start space-x-3">
                    <div className="w-3 h-3 bg-purple-400 rounded-full mt-1.5"></div>
                    <div>
                      <p className="text-gray-400 text-sm">Intereses</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {(profileUser as any).interests.map((interest: string, index: number) => (
                          <span key={index} className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="glass-card p-6">
              <h2 className="text-xl font-bold text-white mb-4">Estadísticas</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-neon-green">{profileUser.posts_count}</div>
                  <div className="text-sm text-gray-400">Publicaciones</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-neon-blue">{profileUser.followers_count}</div>
                  <div className="text-sm text-gray-400">Seguidores</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{profileUser.following_count}</div>
                  <div className="text-sm text-gray-400">Siguiendo</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {profileUser.is_verified ? '✓' : '-'}
                  </div>
                  <div className="text-sm text-gray-400">Verificado</div>
                </div>
              </div>
            </div>
          </div>

          {/* Publicaciones del Usuario */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                Publicaciones de {profileUser.display_name}
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/profile/${profileUser.username}/gallery`)}
                className="flex items-center space-x-2"
              >
                <span>Ver Galería</span>
              </Button>
            </div>
            
            <UserPostsGrid username={profileUser.username} isOwnProfile={false} />
          </div>
        </div>
      </main>

      <MobileNav />

      {/* Modal para ver imagen expandida */}
      <Dialog open={imageModalOpen} onOpenChange={setImageModalOpen}>
        <DialogContent className="max-w-4xl w-full p-0 bg-black/95 border-white/10">
          <div className="relative">
            <button
              onClick={() => setImageModalOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            
            {selectedImage && (
              <div className={`flex items-center justify-center ${selectedImage.type === 'cover' ? 'min-h-[300px] max-h-[70vh]' : 'p-8'}`}>
                <img
                  src={selectedImage.url}
                  alt={selectedImage.type === 'avatar' ? 'Foto de perfil' : 'Foto de portada'}
                  className={`${
                    selectedImage.type === 'avatar' 
                      ? 'w-80 h-80 rounded-full object-cover ring-4 ring-neon-green/50' 
                      : 'w-full h-full object-contain max-h-[70vh]'
                  }`}
                />
              </div>
            )}
            
            {selectedImage && (
              <div className="p-4 text-center text-gray-400 text-sm">
                {selectedImage.type === 'avatar' ? 'Foto de perfil' : 'Foto de portada'} de {profileUser?.display_name}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}