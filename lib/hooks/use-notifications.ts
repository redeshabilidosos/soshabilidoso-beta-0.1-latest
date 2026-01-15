/**
 * Hook para manejar notificaciones en tiempo real
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/providers/providers';

export interface Notification {
  id: string;
  notification_type: 'like' | 'comment' | 'follow' | 'friend_request' | 'friend_accept' | 'share' | 'reply' | 'celebration' | 'golazo';
  message: string;
  sender: {
    id: string;
    username: string;
    display_name: string;
    avatar_url: string;
  } | null;
  is_read: boolean;
  created_at: string;
  read_at?: string;
  post_id?: string;
  comment_id?: string;
  friend_request_id?: string;
  time_ago?: string;
}

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [ws, setWs] = useState<WebSocket | null>(null);

  // Cargar notificaciones iniciales
  const fetchNotifications = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const token = localStorage.getItem('access_token');
      
      // Usar AbortController para cancelar peticiones si el componente se desmonta
      const controller = new AbortController();
      
      const response = await fetch('http://localhost:8000/api/notifications/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        signal: controller.signal,
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.results || data);
        
        // Contar no leídas
        const unread = (data.results || data).filter((n: Notification) => !n.is_read).length;
        setUnreadCount(unread);
      }
    } catch (error: any) {
      // Ignorar errores de cancelación
      if (error.name !== 'AbortError') {
        console.error('Error fetching notifications:', error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Conectar WebSocket para notificaciones en tiempo real
  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem('access_token');
    if (!token) return;

    // Intentar conectar WebSocket solo si el backend está disponible
    let websocket: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout;
    let hasConnected = false;

    const connectWebSocket = () => {
      try {
        websocket = new WebSocket(`ws://localhost:8000/ws/notifications/?token=${token}`);

        websocket.onopen = () => {
          hasConnected = true;
          console.log('✅ WebSocket de notificaciones conectado');
        };

        websocket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            if (data.type === 'notification') {
              // Nueva notificación recibida
              setNotifications(prev => [data.notification, ...prev]);
              setUnreadCount(prev => prev + 1);
              
              // Mostrar notificación del navegador si está permitido
              if ('Notification' in window && Notification.permission === 'granted') {
                new Notification(data.notification.title, {
                  body: data.notification.message,
                  icon: data.notification.user.avatar_url,
                  badge: '/logo.png',
                });
              }
            }
          } catch (error) {
            console.error('Error procesando notificación:', error);
          }
        };

        websocket.onerror = () => {
          // Solo mostrar error si ya había conectado antes
          if (hasConnected) {
            console.warn('⚠️ Error en WebSocket de notificaciones');
          }
        };

        websocket.onclose = () => {
          if (hasConnected) {
            console.log('🔌 WebSocket de notificaciones desconectado');
            // Intentar reconectar después de 5 segundos si ya había conectado
            reconnectTimeout = setTimeout(connectWebSocket, 5000);
          }
        };

        setWs(websocket);
      } catch (error) {
        // Silenciar errores de conexión inicial
      }
    };

    // Intentar conectar
    connectWebSocket();

    // Cargar notificaciones iniciales
    fetchNotifications();

    // Cleanup
    return () => {
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
      if (websocket && websocket.readyState === WebSocket.OPEN) {
        websocket.close();
      }
    };
  }, [user, fetchNotifications]);

  // Marcar notificación como leída
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/api/notifications/${notificationId}/read/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  // Marcar todas como leídas
  const markAllAsRead = useCallback(async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/notifications/mark-all-read/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.map(n => ({ ...n, is_read: true }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }, []);

  // Solicitar permiso para notificaciones del navegador
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  }, []);

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    refreshNotifications: fetchNotifications,
    requestNotificationPermission,
  };
}
