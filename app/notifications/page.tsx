'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/providers';
import { useNotifications } from '@/lib/hooks/use-notifications';
import { Sidebar } from '@/components/navigation/sidebar';
import { MobileNav } from '@/components/navigation/mobile-nav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Bell, Heart, MessageCircle, UserPlus, Trophy, Check, X, Mail, User, ArrowLeft } from 'lucide-react';
import { usersService } from '@/lib/services/users.service';
import { FriendRequestSuccessDialog } from '@/components/ui/friend-request-success-dialog';
import { FriendRequestErrorDialog } from '@/components/ui/friend-request-error-dialog';
export default function NotificationsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { notifications, isLoading, markAsRead, markAllAsRead, refreshNotifications } = useNotifications();
  const [filter, setFilter] = useState<string>('all');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successDialogData, setSuccessDialogData] = useState<{
    friendName: string;
    friendUsername: string;
    friendAvatar?: string;
    isAccepted: boolean;
  } | null>(null);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Solo redirigir si ya terminó de cargar la autenticación y no hay usuario
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  // Solo mostrar loading si está cargando Y no hay usuario
  if (authLoading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-10 h-10 border-3 border-neon-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
      case 'celebration':
      case 'golazo':
        return <Heart className="text-red-400" size={20} />;
      case 'comment':
      case 'reply':
        return <MessageCircle className="text-neon-blue" size={20} />;
      case 'follow':
        return <UserPlus className="text-neon-green" size={20} />;
      case 'friend_request':
      case 'friend_accept':
        return <Trophy className="text-yellow-400" size={20} />;
      case 'share':
        return <Mail className="text-purple-400" size={20} />;
      default:
        return <Bell className="text-gray-400" size={20} />;
    }
  };

  const getNotificationRequestId = (notification: any) => {
    // Para solicitudes de amistad, el ID de la solicitud está en post_id
    if (notification.notification_type === 'friend_request' && notification.post_id) {
      return notification.post_id;
    }
    return notification.id;
  };

  const handleFriendRequest = async (notification: any, accept: boolean) => {
    try {
      // Usar el campo específico friend_request_id
      let requestId = notification.friend_request_id || notification.post_id;
      
      // Si no hay ID, buscar la solicitud por el sender
      if (!requestId && notification.sender) {
        const requests = await usersService.getFriendRequests();
        // Buscar por username del sender
        const request = requests.find((r: any) => {
          const senderUsername = r.sender?.username || r.sender_username;
          return senderUsername === notification.sender.username;
        });
        if (request) {
          requestId = request.id;
        }
      }
      
      if (!requestId) {
        // Intentar una última vez obteniendo todas las solicitudes pendientes
        const allRequests = await usersService.getFriendRequests();
        if (allRequests.length > 0) {
          // Buscar la solicitud más reciente del mismo sender
          const matchingRequest = allRequests.find((r: any) => {
            const senderName = r.sender?.display_name || r.sender?.username;
            return notification.message?.includes(senderName);
          });
          if (matchingRequest) {
            requestId = matchingRequest.id;
          }
        }
      }
      
      if (!requestId) {
        throw new Error('No se encontró la solicitud de amistad. Es posible que ya haya sido procesada.');
      }
      
      if (accept) {
        await usersService.acceptFriendRequest(requestId);
        // Mostrar modal de éxito
        setSuccessDialogData({
          friendName: notification.sender?.display_name || 'Usuario',
          friendUsername: notification.sender?.username || 'usuario',
          friendAvatar: notification.sender?.avatar_url,
          isAccepted: true
        });
        setShowSuccessDialog(true);
      } else {
        await usersService.rejectFriendRequest(requestId);
        // Mostrar modal de rechazo
        setSuccessDialogData({
          friendName: notification.sender?.display_name || 'Usuario',
          friendUsername: notification.sender?.username || 'usuario',
          friendAvatar: notification.sender?.avatar_url,
          isAccepted: false
        });
        setShowSuccessDialog(true);
      }
      
      // Refrescar notificaciones después de responder
      await refreshNotifications();
    } catch (error: any) {
      console.error('Error handling friend request:', error);
      // Mostrar modal de error en lugar de alert
      setErrorMessage(error.message || 'Error al procesar la solicitud de amistad. Por favor intenta de nuevo.');
      setShowErrorDialog(true);
    }
  };

  const handleViewProfile = (username: string) => {
    router.push(`/profile/${username}`);
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.is_read;
    if (filter === 'connections') return notif.notification_type === 'friend_request' || notif.notification_type === 'friend_accept';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="min-h-screen bg-transparent">
      <Sidebar />
      
      <main id="notifications-page" className="pb-24 lg:ml-64 lg:pb-0 pt-12 md:pt-6 lg:pt-6 relative z-10 min-h-screen">
        <div className="max-w-4xl mx-auto p-4 space-y-4">
          {/* Botón Regresar - Solo visible en móvil y tablet */}
          <div className="lg:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/feed')}
              className="flex items-center gap-2 bg-gray-900/80 backdrop-blur-xl border-gray-800 hover:bg-gray-800/80"
            >
              <ArrowLeft size={16} />
              Regresar al Feed
            </Button>
          </div>

          {/* Header */}
          <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-800">
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-2xl font-bold text-white flex items-center gap-2 flex-wrap">
                    <Bell className="text-neon-green" />
                    <span>Notificaciones</span>
                    {unreadCount > 0 && (
                      <Badge variant="destructive" className="ml-2">
                        {unreadCount}
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="text-gray-400 mt-2">
                    Mantente al día con todas las interacciones
                  </CardDescription>
                </div>
                <Button 
                  variant="outline"
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                  className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50"
                >
                  Marcar todo como leído
                </Button>
              </div>
            </CardHeader>
            
            <Separator className="bg-gray-800" />
            
            <CardContent className="pt-6">
              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'all', label: 'Todas' },
                  { key: 'unread', label: 'No leídas' },
                  { key: 'connections', label: 'Conexiones' },
                ].map((filterOption) => (
                  <Button
                    key={filterOption.key}
                    variant={filter === filterOption.key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter(filterOption.key)}
                    className={
                      filter === filterOption.key
                        ? 'bg-neon-green/20 text-neon-green border-neon-green/50 hover:bg-neon-green/30'
                        : 'bg-gray-800/50 border-gray-700 hover:bg-gray-700/50'
                    }
                  >
                    {filterOption.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notifications List */}
          <div className="space-y-3">
            {isLoading ? (
              <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-800">
                <CardContent className="p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-green mx-auto mb-4"></div>
                  <p className="text-gray-400">Cargando notificaciones...</p>
                </CardContent>
              </Card>
            ) : filteredNotifications.length === 0 ? (
              <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-800">
                <CardContent className="p-8 text-center">
                  <Bell className="mx-auto text-gray-400 mb-4" size={48} />
                  <h3 className="text-lg font-semibold text-white mb-2">No hay notificaciones</h3>
                  <p className="text-gray-400">Cuando tengas nuevas interacciones aparecerán aquí</p>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  onClick={() => {
                    // Marcar como leída
                    if (!notification.is_read) {
                      markAsRead(notification.id);
                    }
                    
                    // Navegar según el tipo de notificación
                    if (notification.post_id) {
                      router.push(`/posts/${notification.post_id}`);
                    } else if (notification.notification_type === 'friend_request' || notification.notification_type === 'friend_accept') {
                      // Para solicitudes de amistad, no navegar automáticamente
                      return;
                    } else if (notification.sender) {
                      router.push(`/profile/${notification.sender.username}`);
                    }
                  }}
                  className={`bg-gray-900/80 backdrop-blur-xl border-gray-800 transition-all duration-300 cursor-pointer hover:scale-[1.01] hover:border-gray-700 ${
                    !notification.is_read ? 'border-neon-green/50 bg-neon-green/5' : ''
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.notification_type)}
                        </div>
                        
                        <Avatar className="w-12 h-12 ring-2 ring-neon-green/30 flex-shrink-0">
                          <AvatarImage 
                            src={notification.sender?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                            alt={notification.sender?.display_name || 'Usuario'}
                          />
                          <AvatarFallback className="bg-gray-800">
                            {notification.sender?.display_name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          {notification.sender && (
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-white truncate">
                                {notification.sender.display_name}
                              </span>
                              <span className="text-gray-400 text-sm truncate">
                                @{notification.sender.username}
                              </span>
                              {!notification.is_read && (
                                <Badge variant="default" className="bg-neon-green/20 text-neon-green border-neon-green/50 text-xs">
                                  Nuevo
                                </Badge>
                              )}
                            </div>
                          )}
                          
                          <p className="text-gray-300 mt-1 text-sm md:text-base">{notification.message}</p>

                          <p className="text-gray-500 text-xs md:text-sm mt-2">
                            {notification.time_ago || new Date(notification.created_at).toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                      
                      {notification.notification_type === 'friend_request' && notification.sender && (
                        <div className="flex flex-wrap gap-2 md:flex-col md:flex-nowrap flex-shrink-0">
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFriendRequest(notification, true);
                            }}
                            className="bg-neon-green/20 hover:bg-neon-green/40 text-neon-green border-neon-green/50"
                            variant="outline"
                          >
                            <Check size={14} className="mr-1" />
                            Aceptar
                          </Button>
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFriendRequest(notification, false);
                            }}
                            className="bg-red-500/20 hover:bg-red-500/40 text-red-400 border-red-500/50"
                            variant="outline"
                          >
                            <X size={14} className="mr-1" />
                            Rechazar
                          </Button>
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (notification.sender) {
                                handleViewProfile(notification.sender.username);
                              }
                            }}
                            className="bg-gray-800/50 hover:bg-gray-700/50 border-gray-700"
                            variant="outline"
                          >
                            <User size={14} className="mr-1" />
                            Ver perfil
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>

      <MobileNav />
      
      {/* Modal de éxito/rechazo de solicitud de amistad */}
      {successDialogData && (
        <FriendRequestSuccessDialog
          open={showSuccessDialog}
          onClose={() => {
            setShowSuccessDialog(false);
            setSuccessDialogData(null);
          }}
          friendName={successDialogData.friendName}
          friendUsername={successDialogData.friendUsername}
          friendAvatar={successDialogData.friendAvatar}
          isAccepted={successDialogData.isAccepted}
        />
      )}
      
      {/* Modal de error */}
      <FriendRequestErrorDialog
        open={showErrorDialog}
        onClose={() => {
          setShowErrorDialog(false);
          setErrorMessage('');
        }}
        errorMessage={errorMessage}
      />
    </div>
  );
}