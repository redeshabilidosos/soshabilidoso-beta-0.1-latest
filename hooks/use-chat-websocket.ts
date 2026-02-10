import { useEffect, useRef, useState, useCallback } from 'react';
import { Message } from '@/lib/services/messaging.service';
import { useNotificationSound } from './use-notification-sound';

interface UseChatWebSocketProps {
  chatId: string;
  userId: string;
  onNewMessage: (message: Message) => void;
  onTypingStart: (userId: string, username: string) => void;
  onTypingStop: (userId: string) => void;
  soundEnabled?: boolean;
}

export function useChatWebSocket({
  chatId,
  userId,
  onNewMessage,
  onTypingStart,
  onTypingStop,
  soundEnabled = true,
}: UseChatWebSocketProps) {
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const MAX_RECONNECT_ATTEMPTS = 5;

  // Hook de sonidos de notificación
  const { playMessageSound } = useNotificationSound({ enabled: soundEnabled });

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error('No access token found');
        return;
      }

      // Usar ws:// para desarrollo local
      const wsUrl = `ws://127.0.0.1:8000/ws/chat/${chatId}/?token=${token}`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        reconnectAttemptsRef.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          console.log('📨 WebSocket message received:', data);
          
          switch (data.type) {
            case 'chat_message':
              // Mensaje nuevo recibido
              console.log('💬 New chat message:', data.message);
              onNewMessage(data.message);
              
              // Reproducir sonido solo si el mensaje es de otro usuario
              if (data.message.sender.id !== userId) {
                console.log('🔊 Playing message sound for message from:', data.message.sender.username);
                playMessageSound();
              }
              break;
            
            case 'typing_status':
              if (data.user_id !== userId) {
                if (data.is_typing) {
                  onTypingStart(data.user_id, data.username);
                } else {
                  onTypingStop(data.user_id);
                }
              }
              break;
            
            case 'user_status':
              // Manejar estado de usuario (online/offline)
              console.log(`User ${data.username} is ${data.status}`);
              break;
            
            case 'message_read':
              // Manejar mensaje leído
              console.log(`Message ${data.message_id} read by ${data.username}`);
              break;
            
            case 'connection_success':
              console.log('✅ WebSocket connection confirmed:', data.message);
              break;
            
            case 'error':
              console.error('❌ WebSocket error:', data.message);
              break;
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        wsRef.current = null;

        // Intentar reconectar
        if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttemptsRef.current++;
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
          console.log(`Reconnecting in ${delay}ms (attempt ${reconnectAttemptsRef.current})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, delay);
        }
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('Error creating WebSocket:', error);
    }
  }, [chatId, userId, onNewMessage, onTypingStart, onTypingStop]);

  useEffect(() => {
    connect();

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  const sendTypingStart = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'typing',
        is_typing: true,
      }));

      // Limpiar timeout anterior
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Enviar typing_stop después de 3 segundos de inactividad
      typingTimeoutRef.current = setTimeout(() => {
        sendTypingStop();
      }, 3000);
    }
  }, []);

  const sendTypingStop = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'typing',
        is_typing: false,
      }));
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, []);

  const sendMessage = useCallback((content: string, messageType: string = 'text') => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'chat_message',
        content,
        message_type: messageType,
      }));
    }
  }, []);

  return {
    isConnected,
    sendTypingStart,
    sendTypingStop,
    sendMessage,
  };
}
