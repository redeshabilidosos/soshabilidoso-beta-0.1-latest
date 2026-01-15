/**
 * Hook para WebSocket de chat en tiempo real
 */
import { useEffect, useRef, useState, useCallback } from 'react';
import { Message } from '@/types/user';
import { authService } from '@/lib/services/auth.service';

export interface WebSocketMessage {
  type: 'chat_message' | 'typing_status' | 'user_status' | 'message_read' | 'message_reaction' | 'message_edited' | 'message_deleted' | 'error';
  message?: Message;
  user_id?: string;
  username?: string;
  status?: 'online' | 'offline';
  is_typing?: boolean;
  message_id?: string;
  reaction_type?: string;
  added?: boolean;
  error?: string;
}

export interface UseWebSocketOptions {
  onMessage?: (message: Message) => void;
  onTyping?: (userId: string, isTyping: boolean) => void;
  onUserStatus?: (userId: string, status: 'online' | 'offline') => void;
  onMessageRead?: (messageId: string, userId: string) => void;
  onMessageReaction?: (messageId: string, userId: string, reactionType: string, added: boolean) => void;
  onMessageEdited?: (message: Message) => void;
  onMessageDeleted?: (messageId: string) => void;
  onError?: (error: string) => void;
}

export function useWebSocket(chatId: string | null, options: UseWebSocketOptions = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = useCallback(() => {
    if (!chatId || !authService.isAuthenticated()) {
      return;
    }

    try {
      setConnectionStatus('connecting');
      
      const token = authService.getAccessToken();
      const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws'}/chat/${chatId}/?token=${token}`;
      
      const socket = new WebSocket(wsUrl);
      socketRef.current = socket;

      socket.onopen = () => {
        console.log('WebSocket conectado para chat:', chatId);
        setIsConnected(true);
        setConnectionStatus('connected');
        reconnectAttempts.current = 0;
      };

      socket.onmessage = (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);
          
          switch (data.type) {
            case 'chat_message':
              if (data.message && options.onMessage) {
                options.onMessage(data.message);
              }
              break;
              
            case 'typing_status':
              if (data.user_id && data.is_typing !== undefined && options.onTyping) {
                options.onTyping(data.user_id, data.is_typing);
              }
              break;
              
            case 'user_status':
              if (data.user_id && data.status && options.onUserStatus) {
                options.onUserStatus(data.user_id, data.status);
              }
              break;
              
            case 'message_read':
              if (data.message_id && data.user_id && options.onMessageRead) {
                options.onMessageRead(data.message_id, data.user_id);
              }
              break;
              
            case 'message_reaction':
              if (data.message_id && data.user_id && data.reaction_type && data.added !== undefined && options.onMessageReaction) {
                options.onMessageReaction(data.message_id, data.user_id, data.reaction_type, data.added);
              }
              break;
              
            case 'message_edited':
              if (data.message && options.onMessageEdited) {
                options.onMessageEdited(data.message);
              }
              break;
              
            case 'message_deleted':
              if (data.message_id && options.onMessageDeleted) {
                options.onMessageDeleted(data.message_id);
              }
              break;
              
            case 'error':
              if (data.error && options.onError) {
                options.onError(data.error);
              }
              break;
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      socket.onclose = (event) => {
        console.log('WebSocket desconectado:', event.code, event.reason);
        setIsConnected(false);
        setConnectionStatus('disconnected');
        
        // Intentar reconectar si no fue un cierre intencional
        if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
          const delay = Math.pow(2, reconnectAttempts.current) * 1000; // Backoff exponencial
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttempts.current++;
            connect();
          }, delay);
        }
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionStatus('error');
        if (options.onError) {
          options.onError('Error de conexión WebSocket');
        }
      };

    } catch (error) {
      console.error('Error creating WebSocket:', error);
      setConnectionStatus('error');
    }
  }, [chatId, options]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (socketRef.current) {
      socketRef.current.close(1000, 'Disconnected by user');
      socketRef.current = null;
    }
    
    setIsConnected(false);
    setConnectionStatus('disconnected');
  }, []);

  const sendMessage = useCallback((message: any) => {
    if (socketRef.current && isConnected) {
      socketRef.current.send(JSON.stringify(message));
    }
  }, [isConnected]);

  // Métodos específicos para enviar diferentes tipos de mensajes
  const sendChatMessage = useCallback((content: string, messageType = 'text', replyTo?: string) => {
    sendMessage({
      type: 'chat_message',
      content,
      message_type: messageType,
      reply_to: replyTo,
    });
  }, [sendMessage]);

  const sendTypingStatus = useCallback((isTyping: boolean) => {
    sendMessage({
      type: 'typing',
      is_typing: isTyping,
    });
  }, [sendMessage]);

  const markMessageAsRead = useCallback((messageId: string) => {
    sendMessage({
      type: 'read_message',
      message_id: messageId,
    });
  }, [sendMessage]);

  const reactToMessage = useCallback((messageId: string, reactionType: string) => {
    sendMessage({
      type: 'react_message',
      message_id: messageId,
      reaction_type: reactionType,
    });
  }, [sendMessage]);

  const editMessage = useCallback((messageId: string, content: string) => {
    sendMessage({
      type: 'edit_message',
      message_id: messageId,
      content,
    });
  }, [sendMessage]);

  const deleteMessage = useCallback((messageId: string) => {
    sendMessage({
      type: 'delete_message',
      message_id: messageId,
    });
  }, [sendMessage]);

  // Conectar cuando cambie el chatId
  useEffect(() => {
    if (chatId) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [chatId, connect, disconnect]);

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    connectionStatus,
    connect,
    disconnect,
    sendMessage,
    sendChatMessage,
    sendTypingStatus,
    markMessageAsRead,
    reactToMessage,
    editMessage,
    deleteMessage,
  };
}