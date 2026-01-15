/**
 * Hook personalizado para manejar WebSocket del feed en tiempo real
 */
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '@/components/providers/providers';

interface Post {
  id: string;
  user: any;
  content: string;
  post_type: string;
  images: string[];
  video?: string;
  created_at: string;
  likes_count: number;
  celebrations_count: number;
  golazos_count: number;
  comments_count: number;
  shares_count: number;
  user_reaction?: {
    reaction_type: string;
  };
}

interface WebSocketMessage {
  type: 'new_post' | 'post_updated' | 'post_deleted' | 'post_reaction' | 'connection_established' | 'pong';
  post?: Post;
  post_id?: string;
  reaction_data?: any;
  message?: string;
  timestamp?: number;
}

interface UseFeedWebSocketReturn {
  isConnected: boolean;
  connectionError: string | null;
  lastMessage: WebSocketMessage | null;
}

export const useFeedWebSocket = (): UseFeedWebSocketReturn => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = useCallback(() => {
    if (!user) return;
    
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
      // Determinar la URL del WebSocket
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = process.env.NODE_ENV === 'production' 
        ? process.env.NEXT_PUBLIC_WS_URL || 'localhost:8000'
        : 'localhost:8000';
      
      const wsUrl = `${protocol}//${host}/ws/feed/?token=${token}`;
      
      console.log('Conectando a WebSocket del feed:', wsUrl);
      
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('WebSocket del feed conectado');
        setIsConnected(true);
        setConnectionError(null);
        reconnectAttempts.current = 0;

        // Configurar ping para mantener la conexión viva
        pingIntervalRef.current = setInterval(() => {
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
              type: 'ping',
              timestamp: Date.now()
            }));
          }
        }, 30000); // Ping cada 30 segundos
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          console.log('Mensaje recibido del feed:', message);
          setLastMessage(message);
        } catch (error) {
          console.error('Error parseando mensaje del WebSocket:', error);
        }
      };

      wsRef.current.onclose = (event) => {
        console.log('WebSocket del feed desconectado:', event.code, event.reason);
        setIsConnected(false);
        
        // Limpiar ping interval
        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current);
          pingIntervalRef.current = null;
        }

        // Intentar reconectar si no fue un cierre intencional
        if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
          console.log(`Reintentando conexión en ${delay}ms (intento ${reconnectAttempts.current + 1})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttempts.current++;
            connect();
          }, delay);
        } else if (reconnectAttempts.current >= maxReconnectAttempts) {
          setConnectionError('No se pudo conectar al servidor. Intenta recargar la página.');
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('Error en WebSocket del feed:', error);
        setConnectionError('Error de conexión con el servidor');
      };

    } catch (error) {
      console.error('Error creando WebSocket:', error);
      setConnectionError('Error al establecer conexión');
    }
  }, [user, token]);

  const disconnect = useCallback(() => {
    // Limpiar timeouts e intervals
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
    }

    // Cerrar WebSocket
    if (wsRef.current) {
      wsRef.current.close(1000, 'Desconexión intencional');
      wsRef.current = null;
    }
    
    setIsConnected(false);
    setConnectionError(null);
    reconnectAttempts.current = 0;
  }, []);

  // Efecto para manejar la conexión
  useEffect(() => {
    if (user) {
      connect();
    } else {
      disconnect();
    }

    // Cleanup al desmontar
    return () => {
      disconnect();
    };
  }, [user, connect, disconnect]);

  // Manejar visibilidad de la página
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Página oculta - mantener conexión pero reducir actividad
        console.log('Página oculta - manteniendo conexión WebSocket');
      } else {
        // Página visible - asegurar conexión activa
        console.log('Página visible - verificando conexión WebSocket');
        if (!isConnected && user) {
          connect();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isConnected, user, connect]);

  return {
    isConnected,
    connectionError,
    lastMessage
  };
};