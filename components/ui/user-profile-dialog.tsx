'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { CyberButton } from '@/components/ui/cyber-button';
import { X, User as UserIcon, MapPin, Calendar, Users, Trophy, MessageCircle, UserPlus, Check, Clock } from 'lucide-react';
import { User } from '@/types/user';
import { useAuth } from '@/components/providers/providers';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation'; // Importar useRouter

interface UserProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  profileUser: User; // El usuario cuyo perfil se está viendo
}

export function UserProfileDialog({ isOpen, onClose, profileUser }: UserProfileDialogProps) {
  const { user: currentUser } = useAuth();
  const router = useRouter(); // Inicializar useRouter
  const [friendStatus, setFriendStatus] = useState<'none' | 'pending' | 'friends'>('none');
  const [fullProfile, setFullProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser && profileUser) {
      if (currentUser.friendIds?.includes(profileUser.id)) {
        setFriendStatus('friends');
      } else {
        // For simplicity, we'll assume 'pending' if not friends and not current user
        // In a real app, you'd check a separate 'pendingRequests' list
        setFriendStatus('none'); 
      }
    }
  }, [currentUser, profileUser]);

  useEffect(() => {
    if (isOpen && profileUser) {
      loadFullProfile();
    }
  }, [isOpen, profileUser]);

  const loadFullProfile = async () => {
    try {
      setLoading(true);
      const { usersService } = await import('@/lib/services/users.service');
      const profile = await usersService.getUserProfile(profileUser.username);
      setFullProfile(profile);
      console.log('Full profile loaded:', profile);
    } catch (error) {
      console.error('Error loading full profile:', error);
      // Si falla, usar el profileUser original
      setFullProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFriendAction = async () => {
    if (!currentUser) {
      toast.error('Debes iniciar sesión para gestionar conexiones.');
      return;
    }
    if (currentUser.id === profileUser.id) {
      toast.info('No puedes enviarte una solicitud a ti mismo.');
      return;
    }

    // TODO: Implementar llamada a API para gestionar conexiones
    // Update local status based on the action
    if (friendStatus === 'none') {
      setFriendStatus('pending'); // Simulate request sent
      toast.success('Solicitud de conexión enviada');
    } else if (friendStatus === 'pending') {
      setFriendStatus('friends'); // Simulate request accepted
      toast.success('Conexión aceptada');
    } else if (friendStatus === 'friends') {
      setFriendStatus('none'); // Simulate friend removed
      toast.info('Conexión eliminada');
    }
  };

  const handleViewFullProfile = () => {
    onClose(); // Close the dialog first
    // Usar username si está disponible, sino usar id
    const profilePath = profileUser.username 
      ? `/profile/${profileUser.username}`
      : `/users/${profileUser.id}`;
    router.push(profilePath);
  };

  const handleSendMessage = () => {
    onClose(); // Close the dialog first
    // Redirigir a mensajes con el usuario seleccionado
    router.push(`/messages?user=${profileUser.id}`);
  };

  if (!profileUser) return null;

  const getFriendButton = () => {
    // Si es el usuario actual, mostrar botón deshabilitado
    if (currentUser?.id === profileUser.id) {
      return (
        <CyberButton variant="outline" disabled size="sm">
          <UserIcon size={14} className="mr-1" />
          <span className="text-sm">Tu Perfil</span>
        </CyberButton>
      );
    }

    switch (friendStatus) {
      case 'none':
        return (
          <CyberButton onClick={handleFriendAction} size="sm">
            <UserPlus size={14} className="mr-1" />
            <span className="text-sm">Conectar</span>
          </CyberButton>
        );
      case 'pending':
        return (
          <CyberButton variant="secondary" size="sm" disabled>
            <Clock size={14} className="mr-1" />
            <span className="text-sm">Pendiente</span>
          </CyberButton>
        );
      case 'friends':
        return (
          <CyberButton onClick={handleSendMessage} size="sm">
            <MessageCircle size={14} className="mr-1" />
            <span className="text-sm">Mensaje</span>
          </CyberButton>
        );
      default:
        return null;
    }
  };

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
  };

  // Usar el perfil completo si está disponible, sino usar profileUser
  const displayUser = fullProfile || profileUser;
  
  // Obtener la imagen de portada real del usuario (sin fallback a imagen externa)
  const coverImage = displayUser.cover_photo_url || displayUser.cover_photo || displayUser.coverPhoto || '';

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] border-neon-green/20 p-0 overflow-hidden bg-transparent backdrop-blur-none">
        <DialogTitle className="sr-only">
          Perfil de {profileUser.displayName}
        </DialogTitle>
        
        {/* Fondo con imagen de portada desenfocada o gradiente */}
        <div className="absolute inset-0 z-0">
          {coverImage ? (
            <>
              <img
                src={coverImage}
                alt="Background"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 backdrop-blur-2xl bg-black/60" />
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-900 via-black to-gray-800" />
          )}
        </div>

        <div className="relative z-10 overflow-y-auto max-h-[85vh] scrollbar-hide">
          {/* Cover Photo - Usando la imagen de portada real del usuario */}
          <div className="h-24 sm:h-32 relative overflow-hidden">
            {coverImage ? (
              <img
                src={coverImage}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-neon-green/20 via-neon-blue/20 to-purple-500/20" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          </div>

          {/* Profile Info */}
          <div className="p-4 sm:p-6 -mt-12 sm:-mt-16 relative z-10">
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-neon-green"></div>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center">
                <img
                  src={displayUser.avatar_url || displayUser.avatar}
                  alt={displayUser.display_name || displayUser.displayName}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full ring-4 ring-neon-green/50 mb-3 shadow-2xl"
                />
                <h1 className="text-xl sm:text-2xl font-bold text-white drop-shadow-lg">{displayUser.display_name || displayUser.displayName}</h1>
                <p className="text-gray-300 text-sm sm:text-base drop-shadow-md">@{displayUser.username}</p>
                {displayUser.bio && (
                  <p className="text-gray-200 text-sm max-w-md mt-2 text-center drop-shadow-md bg-black/30 px-3 py-1.5 rounded-lg backdrop-blur-sm">{displayUser.bio}</p>
                )}
              </div>
            )}

            <div className="flex flex-wrap justify-center mt-4 gap-2">
              {getFriendButton()}
              <CyberButton variant="outline" onClick={handleViewFullProfile} size="sm">
                <UserIcon size={14} className="mr-1" />
                <span className="text-sm">Ver Perfil Completo</span>
              </CyberButton>
            </div>

            {!loading && (
              <>
                <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center mt-4 border-t border-white/20 pt-4 bg-black/20 backdrop-blur-sm rounded-lg p-3">
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-neon-green drop-shadow-lg">{displayUser.followers_count || displayUser.followers || 0}</div>
                    <div className="text-xs text-gray-300">Seguidores</div>
                  </div>
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-neon-blue drop-shadow-lg">{displayUser.following_count || displayUser.following || 0}</div>
                    <div className="text-xs text-gray-300">Siguiendo</div>
                  </div>
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-white drop-shadow-lg">{displayUser.posts_count || displayUser.posts || 0}</div>
                    <div className="text-xs text-gray-300">Publicaciones</div>
                  </div>
                </div>

                <div className="space-y-3 mt-4 border-t border-white/20 pt-4 bg-black/20 backdrop-blur-sm rounded-lg p-3">
                  <h2 className="text-base sm:text-lg font-bold text-white mb-2 drop-shadow-lg">Intereses</h2>
                  
                  {/* Mostrar intereses si existen */}
                  {displayUser.interests && displayUser.interests.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {displayUser.interests.map((interest: string, index: number) => (
                        <span
                          key={index}
                          className="px-2.5 py-1 bg-neon-green/20 text-neon-green rounded-full text-xs font-medium border border-neon-green/30 shadow-lg shadow-neon-green/20 backdrop-blur-sm"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-2">
                      <p className="text-gray-400 text-xs">No ha agregado intereses aún</p>
                    </div>
                  )}

                  {/* Información adicional */}
                  <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                    {displayUser.position && (
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-neon-green rounded-full shadow-lg shadow-neon-green/50"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-300 text-xs">Posición</p>
                          <p className="text-white text-sm font-medium drop-shadow-md truncate">{displayUser.position}</p>
                        </div>
                      </div>
                    )}
                    
                    {displayUser.team && (
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-neon-blue rounded-full shadow-lg shadow-neon-blue/50"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-300 text-xs">Equipo</p>
                          <p className="text-white text-sm font-medium drop-shadow-md truncate">{displayUser.team}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      <Calendar size={16} className="text-gray-300 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-300 text-xs">Miembro desde</p>
                        <p className="text-white text-sm font-medium drop-shadow-md">{formatJoinDate(displayUser.created_at || displayUser.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}