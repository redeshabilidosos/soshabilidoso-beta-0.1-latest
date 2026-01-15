'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/providers';
import { useNotifications } from '@/lib/hooks/use-notifications';
import { Sidebar } from '@/components/navigation/sidebar';
import { MobileNav } from '@/components/navigation/mobile-nav';
import { CyberButton } from '@/components/ui/cyber-button';
import { Bell, Heart, MessageCircle, UserPlus, Trophy, Check, X, Mail, User } from 'lucide-react';
import { usersService } from '@/lib/services/users.service';

export default function NotificationsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { notifications, isLoading, markAsRead, markAllAsRead, refreshNotifications } = useNotifications();
  const [filter, setFilter] = useState<string>('all');

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
        alert('¡Solicitud de amistad aceptada!');
      } else {
        await usersService.rejectFriendRequest(requestId);
        alert('Solicitud de amistad rechazada');
      }
      
      // Refrescar notificaciones después de responder
      await refreshNotifications();
    } catch (error: any) {
      console.error('Error handling friend request:', error);
      alert(error.message || 'Error al procesar la solicitud de amistad. Por favor intenta de nuevo.');
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
    <div className="min-h-screen">
      <Sidebar />
      
      <main className="pb-24 xl:ml-64 xl:pb-0">
        <div className="max-w-4xl mx-auto p-4 space-y-6">
          {/* Header */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
                  <Bell className="text-neon-green" />
                  <span>Notificaciones</span>
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </h1>
                <p className="text-gray-400">Mantente al día con todas las interacciones</p>
              </div>
              <CyberButton 
                variant="outline"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
              >
                Marcar todo como leído
              </CyberButton>
            </div>

            {/* Filters */}
            <div className="flex space-x-2">
              {[
                { key: 'all', label: 'Todas' },
                { key: 'unread', label: 'No leídas' },
                { key: 'connections', label: 'Conexiones' },
              ].map((filterOption) => (
                <button
                  key={filterOption.key}
                  onClick={() => setFilter(filterOption.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    filter === filterOption.key
                      ? 'bg-neon-green/20 text-neon-green border border-neon-green/50'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {filterOption.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="glass-card p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-green mx-auto mb-4"></div>
                <p className="text-gray-400">Cargando notificaciones...</p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="glass-card p-8 text-center">
                <Bell className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-lg font-semibold text-white mb-2">No hay notificaciones</h3>
                <p className="text-gray-400">Cuando tengas nuevas interacciones aparecerán aquí</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
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
                  className={`football-card p-4 transition-all duration-300 cursor-pointer hover:scale-[1.02] ${
                    !notification.is_read ? 'border-neon-green/50 bg-neon-green/5' : ''
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start space-y-3 md:space-y-0 md:space-x-4">
                    <div className="flex items-start space-x-4 flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        {getNotificationIcon(notification.notification_type)}
                      </div>
                      
                      <img
                        src={notification.sender?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                        alt={notification.sender?.display_name || 'Usuario'}
                        className="w-12 h-12 rounded-full ring-2 ring-neon-green/30 object-cover bg-gray-800 flex-shrink-0"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default';
                        }}
                      />
                      
                      <div className="flex-1 min-w-0">
                        {notification.sender && (
                          <div className="flex items-center space-x-2 flex-wrap">
                            <span className="font-semibold text-white truncate">
                              {notification.sender.display_name}
                            </span>
                            <span className="text-gray-400 text-sm truncate">
                              @{notification.sender.username}
                            </span>
                            {!notification.is_read && (
                              <div className="w-2 h-2 bg-neon-green rounded-full flex-shrink-0"></div>
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
                      <div className="flex flex-wrap gap-2 mt-3 md:mt-0 md:flex-col md:flex-nowrap md:ml-2 flex-shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFriendRequest(notification, true);
                          }}
                          className="px-3 py-1.5 bg-neon-green/20 hover:bg-neon-green/40 rounded-lg transition-colors text-neon-green text-xs md:text-sm font-medium flex items-center space-x-1"
                        >
                          <Check size={14} />
                          <span>Aceptar</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFriendRequest(notification, false);
                          }}
                          className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/40 rounded-lg transition-colors text-red-400 text-xs md:text-sm font-medium flex items-center space-x-1"
                        >
                          <X size={14} />
                          <span>Rechazar</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewProfile(notification.sender.username);
                          }}
                          className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white text-xs md:text-sm font-medium flex items-center space-x-1"
                        >
                          <User size={14} />
                          <span>Ver perfil</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
}