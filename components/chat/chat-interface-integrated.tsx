/**
 * Componente de chat integrado con el backend
 */
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { CyberButton } from '@/components/ui/cyber-button';
import { Input } from '@/components/ui/input';
import { X, Send, Smile, Image as ImageIcon, Video, Settings } from 'lucide-react';
import { ChatPreview, Message } from '@/types/user';
import { useAuth } from '@/components/providers/providers';
import { cn } from '@/lib/utils';
import { ChatSettingsDialog } from '@/components/ui/chat-settings-dialog';
import { toast } from 'sonner';
import { chatService } from '@/lib/services/chat.service';
import { useWebSocket } from '@/hooks/use-websocket';

interface ChatInterfaceIntegratedProps {
  isOpen: boolean;
  onClose: () => void;
  chat: ChatPreview | null;
  onUpdateChat: (updatedChat: ChatPreview) => void;
}

// Estilos para los patrones de fondo
const backgroundStyles: { [key: string]: React.CSSProperties } = {
  particles: {
    backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'12\' height=\'12\' viewBox=\'0 0 12 12\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%2300ff88\' fill-opacity=\'0.05\'%3E%3Ccircle cx=\'2\' cy=\'2\' r=\'0.5\'/%3E%3Ccircle cx=\'8\' cy=\'8\' r=\'0.5\'/%3E%3Ccircle cx=\'10\' cy=\'4\' r=\'0.5\'/%3E%3Ccircle cx=\'4\' cy=\'10\' r=\'0.5\'/%3E%3C/g%3E%3C/svg%3E")',
    backgroundSize: '24px 24px',
  },
  hearts: {
    backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'16\' height=\'16\' viewBox=\'0 0 16 16\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M8 14c-0.5-0.5-4-3.5-4-6.5 0-1.5 1-2.5 2.5-2.5 1 0 1.5 0.5 1.5 0.5s0.5-0.5 1.5-0.5c1.5 0 2.5 1 2.5 2.5 0 3-3.5 6-4 6.5z\' fill=\'%23ff69b4\' fill-opacity=\'0.06\'/%3E%3C/svg%3E")',
    backgroundSize: '32px 32px',
  },
  footballs: {
    backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%2300ff88\' fill-opacity=\'0.05\'%3E%3Ccircle cx=\'10\' cy=\'10\' r=\'4\' fill=\'none\' stroke=\'%2300ff88\' stroke-width=\'0.5\'/%3E%3Cpath d=\'M10 6v8M6 10h8M8 8l4 4M12 8l-4 4\' stroke=\'%2300ff88\' stroke-width=\'0.3\'/%3E%3C/g%3E%3C/svg%3E")',
    backgroundSize: '40px 40px',
  },
  music_notes: {
    backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'18\' height=\'18\' viewBox=\'0 0 18 18\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%238800ff\' fill-opacity=\'0.06\'%3E%3Ccircle cx=\'5\' cy=\'13\' r=\'1.5\'/%3E%3Ccircle cx=\'13\' cy=\'11\' r=\'1.5\'/%3E%3Cpath d=\'M6.5 13V6h1v6l6-1.5V4h1v8\' stroke=\'%238800ff\' stroke-width=\'0.5\' fill=\'none\'/%3E%3C/g%3E%3C/svg%3E")',
    backgroundSize: '36px 36px',
  },
  none: {},
};

export function ChatInterfaceIntegrated({ isOpen, onClose, chat, onUpdateChat }: ChatInterfaceIntegratedProps) {
  const { user: currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessageContent, setNewMessageContent] = useState('');
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // WebSocket para tiempo real
  const {
    isConnected,
    sendChatMessage,
    sendTypingStatus,
    markMessageAsRead,
    reactToMessage,
  } = useWebSocket(chat?.id || null, {
    onMessage: (message) => {
      setMessages(prev => [...prev, message]);
      scrollToBottom();
    },
    onTyping: (userId, isTyping) => {
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        if (isTyping) {
          newSet.add(userId);
        } else {
          newSet.delete(userId);
        }
        return newSet;
      });
    },
    onMessageRead: (messageId, userId) => {
      // Actualizar estado de lectura si es necesario
      console.log(`Mensaje ${messageId} leído por ${userId}`);
    },
    onMessageReaction: (messageId, userId, reactionType, added) => {
      // Actualizar reacciones en tiempo real
      setMessages(prev => prev.map(msg => {
        if (msg.id === messageId) {
          // Aquí actualizarías las reacciones del mensaje
          return { ...msg };
        }
        return msg;
      }));
    },
    onError: (error) => {
      toast.error(`Error de conexión: ${error}`);
    }
  });

  // Cargar mensajes cuando se abre el chat
  useEffect(() => {
    if (chat && isOpen) {
      loadMessages();
    }
  }, [chat, isOpen]);

  // Scroll automático
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    if (!chat) return;

    try {
      setIsLoading(true);
      const response = await chatService.getMessages(chat.id);
      setMessages(response.results.reverse()); // Invertir para mostrar más recientes al final
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Error al cargar mensajes');
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessageContent.trim() || !currentUser || !chat) return;

    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      senderId: currentUser.id,
      content: newMessageContent.trim(),
      timestamp: new Date().toISOString(),
      type: 'text',
    };

    // Agregar mensaje temporalmente
    setMessages(prev => [...prev, tempMessage]);
    const messageContent = newMessageContent.trim();
    setNewMessageContent('');

    try {
      // Enviar por WebSocket para tiempo real
      sendChatMessage(messageContent);

      // También enviar por API para persistencia
      await chatService.sendMessage(chat.id, {
        content: messageContent,
        message_type: 'text'
      });

      // Actualizar último mensaje del chat
      const updatedChat = {
        ...chat,
        lastMessage: messageContent,
        timestamp: new Date().toISOString()
      };
      onUpdateChat(updatedChat);

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Error al enviar mensaje');
      
      // Remover mensaje temporal si falla
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
      setNewMessageContent(messageContent); // Restaurar contenido
    }
  };

  const handleTyping = useCallback(() => {
    sendTypingStatus(true);

    // Limpiar timeout anterior
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Enviar "no está escribiendo" después de 2 segundos
    typingTimeoutRef.current = setTimeout(() => {
      sendTypingStatus(false);
    }, 2000);
  }, [sendTypingStatus]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessageContent(e.target.value);
    handleTyping();
  };

  const handleSaveChatSettings = async (chatId: string, settings: any) => {
    if (!chat) return;

    try {
      await chatService.updateChatSettings(chatId, settings);
      
      const updatedChat = {
        ...chat,
        ...settings
      };
      onUpdateChat(updatedChat);
      
      toast.success('Configuración guardada');
    } catch (error) {
      console.error('Error updating chat settings:', error);
      toast.error('Error al guardar configuración');
    }
  };

  const handleReaction = async (messageId: string, reactionType: string) => {
    try {
      // Enviar reacción por WebSocket
      reactToMessage(messageId, reactionType);
      
      // También por API
      if (chat) {
        await chatService.reactToMessage(chat.id, messageId, reactionType);
      }
    } catch (error) {
      console.error('Error reacting to message:', error);
      toast.error('Error al reaccionar');
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  if (!chat) {
    return null;
  }

  const currentChatBackgroundStyle = chat.chatBackground ? backgroundStyles[chat.chatBackground] : {};
  const displayName = chat.nickname || chat.otherUser?.displayName || 'Usuario';

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl h-[90vh] flex flex-col glass-card border-neon-green/20 p-0">
          <DialogHeader className="p-4 border-b border-white/10 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={chat.otherUser?.avatar || '/default-avatar.png'}
                  alt={displayName}
                  className="w-10 h-10 rounded-full ring-2 ring-neon-blue/30"
                />
                <div>
                  <DialogTitle className="text-white text-lg">
                    {displayName}
                  </DialogTitle>
                  <DialogDescription className="text-gray-400 text-sm">
                    @{chat.otherUser?.username || 'usuario'}
                    {isConnected && (
                      <span className="ml-2 text-neon-green text-xs">● En línea</span>
                    )}
                  </DialogDescription>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsSettingsDialogOpen(true)}
                  className="p-2 bg-white/10 rounded-lg text-gray-400 hover:text-white hover:bg-white/20 transition-colors"
                  title="Personalizar chat"
                >
                  <Settings size={20} />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          </DialogHeader>

          <div 
            className={cn(
              "flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide"
            )}
            style={currentChatBackgroundStyle}
          >
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="text-gray-400">Cargando mensajes...</div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      'flex group',
                      message.senderId === currentUser?.id ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <div
                      className={cn(
                        'max-w-[70%] p-3 rounded-xl relative',
                        message.senderId === currentUser?.id
                          ? (chat.chatColor || 'bg-neon-green/20') + ' text-white rounded-br-none'
                          : (chat.otherMessageColor || 'bg-white/10') + ' text-gray-200 rounded-bl-none'
                      )}
                    >
                      <p className="text-sm">{message.content}</p>
                      <span className="text-xs text-gray-500 mt-1 block text-right">
                        {formatTime(message.timestamp)}
                      </span>
                      
                      {/* Botones de reacción */}
                      <div className="absolute -top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex space-x-1 bg-black/50 rounded-full p-1">
                          {['👍', '❤️', '😂', '⚽'].map((emoji) => (
                            <button
                              key={emoji}
                              onClick={() => handleReaction(message.id, emoji)}
                              className="hover:scale-110 transition-transform text-xs"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Indicador de escritura */}
                {typingUsers.size > 0 && (
                  <div className="flex justify-start">
                    <div className="bg-white/10 text-gray-400 px-3 py-2 rounded-xl text-sm">
                      Escribiendo...
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          <div className="p-4 border-t border-white/10 flex-shrink-0">
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Smile size={20} />
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <ImageIcon size={20} />
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Video size={20} />
              </button>
              <Input
                placeholder="Escribe un mensaje..."
                value={newMessageContent}
                onChange={handleInputChange}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-neon-green/50"
                disabled={!isConnected}
              />
              <CyberButton 
                onClick={handleSendMessage} 
                disabled={!newMessageContent.trim() || !isConnected}
              >
                <Send size={20} />
              </CyberButton>
            </div>
            
            {!isConnected && (
              <div className="text-center text-red-400 text-xs mt-2">
                Desconectado - Reintentando conexión...
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogo de configuración */}
      {chat && isSettingsDialogOpen && (
        <ChatSettingsDialog
          isOpen={isSettingsDialogOpen}
          onClose={() => setIsSettingsDialogOpen(false)}
          chat={chat}
          onSaveSettings={handleSaveChatSettings}
        />
      )}
    </>
  );
}