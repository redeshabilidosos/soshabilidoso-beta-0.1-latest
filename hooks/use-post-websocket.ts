/**
 * Hook personalizado para manejar WebSocket de un post específico
 */
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '@/components/providers/providers';

interface Comment {
  id: string;
  user: any;
  content: string;
  created_at: string;
  likes_count: number;
  replies?: Comment[];
}

interface WebSocketMessage {
  type: 'new_comment' | 'comment_updated' | 'comment_deleted' | 'post_reaction' | 'comment_like' | 'connection_established' | 'pong';
  comment?: Comment;
  comment_id?: string;
  reaction_data?: any;
  likes_count?: number;
  message?: string;
  timestamp?: number;
}

interface UsePostWebSocketReturn {
  isConnected: boolean;
  connectionError: string | null;
  lastMessage: WebSocketMessage | null;
}

export const usePostWebSocket = (postId: string | null): UsePostWebSocketReturn => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 3;

  const connect = useCallback(() => {
    if (!user || !postId) return;
    
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
      // Determinar la URL del WebSocket
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = process.env.NODE_ENV === 'production' 
        ? process.env.NEXT_PUBLIC_WS_URL || 'localhost:8000'
        : 'localhost:8000';
      
      const wsUrl = `${protocol}//${host}/ws/post/${postId}/?token=${token}`;
      
      console.log('Conectando a WebSocket del post:', wsUrl);
      
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log(`WebSocket del post ${postId} conectado`);
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
        }, 45000); // Ping cada 45 segundos
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          console.log(`Mensaje recibido del post ${postId}:`, message);
          setLastMessage(message);
        } catch (error) {
          console.error('Error parseando mensaje del WebSocket:', error);
        }
      };

      wsRef.current.onclose = (event) => {
        console.log(`WebSocket del post ${postId} desconectado:`, event.code, event.reason);
        setIsConnected(false);
        
        // Limpiar ping interval
        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current);
          pingIntervalRef.current = null;
        }

        // Intentar reconectar si no fue un cierre intencional
        if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 15000);
          console.log(`Reintentando conexión del post en ${delay}ms (intento ${reconnectAttempts.current + 1})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttempts.current++;
            connect();
          }, delay);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error(`Error en WebSocket del post ${postId}:`, error);
        setConnectionError('Error de conexión con el servidor');
      };

    } catch (error) {
      console.error('Error creando WebSocket del post:', error);
      setConnectionError('Error al establecer conexión');
    }
  }, [user, postId]);

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
    if (user && postId) {
      connect();
    } else {
      disconnect();
    }

    // Cleanup al desmontar
    return () => {
      disconnect();
    };
  }, [user, postId, connect, disconnect]);

  return {
    isConnected,
    connectionError,
    lastMessage
  };
};