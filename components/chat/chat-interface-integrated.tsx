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
      // Transform API message to frontend Message type
      const transformedMessage: Message = {
        id: message.id,
        senderId: message.sender?.id || message.sender,
        content: message.content,
        timestamp: message.created_at || message.timestamp,
        type: message.message_type || message.type || 'text',
        imageUrl: message.image_url,
        videoUrl: message.video_url,
        emoji: message.emoji
      };
      setMessages(prev => [...prev, transformedMessage]);
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
      
      // Transform API response to match frontend Message type
      const transformedMessages = response.results.map((msg: any) => ({
        id: msg.id,
        senderId: msg.sender?.id || msg.sender,
        content: msg.content,
        timestamp: msg.created_at,
        type: msg.message_type || 'text',
        imageUrl: msg.image_url,
        videoUrl: msg.video_url,
        emoji: msg.emoji
      }));
      
      setMessages(transformedMessages.reverse()); // Invertir para mostrar más recientes al final
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
          <DialogHeader className="p-4 border-b border-white/10 flex-shrink-0 bg-gradient-to-r from-black/50 via-black/30 to-black/50 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={chat.otherUser?.avatar || '/default-avatar.png'}
                    alt={displayName}
                    className="w-12 h-12 rounded-full ring-2 ring-neon-green/30 shadow-lg shadow-neon-green/20"
                  />
                  {/* Indicador online con animación */}
                  {isConnected && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-neon-green rounded-full border-2 border-black animate-pulse shadow-lg shadow-neon-green/50" />
                  )}
                </div>
                <div>
                  <DialogTitle className="text-white text-lg font-semibold flex items-center gap-2">
                    {displayName}
                    {chat.otherUser?.is_verified && (
                      <span className="text-neon-blue text-sm">✓</span>
                    )}
                  </DialogTitle>
                  <DialogDescription className="text-gray-400 text-sm flex items-center gap-2">
                    @{chat.otherUser?.username || 'usuario'}
                    {isConnected && (
                      <span className="flex items-center gap-1 text-neon-green text-xs font-medium">
                        <span className="w-1.5 h-1.5 bg-neon-green rounded-full animate-pulse" />
                        En línea
                      </span>
                    )}
                  </DialogDescription>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsSettingsDialogOpen(true)}
                  className="p-2.5 bg-white/5 rounded-xl text-gray-400 hover:text-neon-green hover:bg-neon-green/10 transition-all hover:scale-110 active:scale-95 border border-white/10"
                  title="Personalizar chat"
                >
                  <Settings size={20} />
                </button>
                <button
                  onClick={onClose}
                  className="p-2.5 bg-white/5 rounded-xl text-white hover:bg-red-500/20 hover:text-red-400 transition-all hover:scale-110 active:scale-95 border border-white/10"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          </DialogHeader>

          <div 
            className={cn(
              "flex-1 overflow-y-auto p-4 scrollbar-hide"
            )}
            style={currentChatBackgroundStyle}
          >
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-neon-green/20 border-t-neon-green rounded-full animate-spin" />
                  <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-neon-blue rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }} />
                </div>
              </div>
            ) : (
              <>
                {messages.map((message, index) => {
                  const isOwn = message.senderId === currentUser?.id;
                  const prevMessage = index > 0 ? messages[index - 1] : null;
                  const nextMessage = index < messages.length - 1 ? messages[index + 1] : null;
                  const isSameSenderAsPrev = prevMessage?.senderId === message.senderId;
                  const isSameSenderAsNext = nextMessage?.senderId === message.senderId;
                  
                  return (
                    <div
                      key={message.id}
                      className={cn(
                        'flex group items-end gap-2 animate-in slide-in-from-bottom-2 duration-300',
                        isOwn ? 'justify-end' : 'justify-start',
                        isSameSenderAsPrev ? 'mt-0.5' : 'mt-3'
                      )}
                    >
                      {/* Avatar para mensajes del otro usuario */}
                      {!isOwn && (
                        <div className={cn(
                          "w-7 h-7 rounded-full flex-shrink-0 transition-opacity",
                          isSameSenderAsNext ? "opacity-0" : "opacity-100"
                        )}>
                          {!isSameSenderAsNext && (
                            <img
                              src={chat.otherUser?.avatar || '/default-avatar.png'}
                              alt=""
                              className="w-full h-full rounded-full ring-1 ring-white/20"
                            />
                          )}
                        </div>
                      )}
                      
                      <div className="relative flex items-center gap-1">
                        {/* Botones de reacción - Lado izquierdo para mensajes del otro */}
                        {!isOwn && (
                          <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:scale-100 scale-90">
                            <div className="flex flex-col gap-1 bg-black/80 backdrop-blur-xl rounded-2xl p-1.5 border border-white/10 shadow-lg shadow-black/50">
                              {['👍', '❤️', '😂', '⚽'].map((emoji) => (
                                <button
                                  key={emoji}
                                  onClick={() => handleReaction(message.id, emoji)}
                                  className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-xl transition-all hover:scale-125 active:scale-95 text-base"
                                  title={`Reaccionar con ${emoji}`}
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Burbuja de mensaje */}
                        <div
                          className={cn(
                            'relative px-4 py-2 max-w-[75%] backdrop-blur-sm transition-all duration-200',
                            'shadow-lg',
                            isOwn
                              ? cn(
                                  'bg-gradient-to-br from-neon-green/30 to-emerald-500/20 text-white',
                                  'border border-neon-green/30',
                                  'rounded-[20px]',
                                  isSameSenderAsNext ? 'rounded-br-md' : 'rounded-br-[20px]',
                                  isSameSenderAsPrev ? 'rounded-tr-md' : 'rounded-tr-[20px]',
                                  'shadow-neon-green/10'
                                )
                              : cn(
                                  'bg-white/10 text-gray-100',
                                  'border border-white/10',
                                  'rounded-[20px]',
                                  isSameSenderAsNext ? 'rounded-bl-md' : 'rounded-bl-[20px]',
                                  isSameSenderAsPrev ? 'rounded-tl-md' : 'rounded-tl-[20px]',
                                  'shadow-black/20'
                                )
                          )}
                        >
                          {/* Efecto de brillo futurista */}
                          <div className={cn(
                            "absolute inset-0 rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                            isOwn 
                              ? "bg-gradient-to-br from-neon-green/10 to-transparent" 
                              : "bg-gradient-to-br from-white/5 to-transparent"
                          )} />
                          
                          <p className="text-[15px] leading-relaxed relative z-10 break-words">
                            {message.content}
                          </p>
                          
                          <div className={cn(
                            "flex items-center gap-1.5 mt-1 relative z-10",
                            isOwn ? "justify-end" : "justify-start"
                          )}>
                            <span className={cn(
                              "text-[11px] font-medium",
                              isOwn ? "text-neon-green/70" : "text-gray-500"
                            )}>
                              {formatTime(message.timestamp)}
                            </span>
                            {isOwn && (
                              <span className="text-neon-green/70 text-xs">✓✓</span>
                            )}
                          </div>
                        </div>
                        
                        {/* Botones de reacción - Lado derecho para mensajes propios */}
                        {isOwn && (
                          <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:scale-100 scale-90">
                            <div className="flex flex-col gap-1 bg-black/80 backdrop-blur-xl rounded-2xl p-1.5 border border-neon-green/20 shadow-lg shadow-neon-green/10">
                              {['👍', '❤️', '😂', '⚽'].map((emoji) => (
                                <button
                                  key={emoji}
                                  onClick={() => handleReaction(message.id, emoji)}
                                  className="w-8 h-8 flex items-center justify-center hover:bg-neon-green/10 rounded-xl transition-all hover:scale-125 active:scale-95 text-base"
                                  title={`Reaccionar con ${emoji}`}
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                
                {/* Indicador de escritura mejorado */}
                {typingUsers.size > 0 && (
                  <div className="flex justify-start items-end gap-2 animate-in fade-in duration-300 mt-3">
                    <div className="w-7 h-7 rounded-full">
                      <img
                        src={chat.otherUser?.avatar || '/default-avatar.png'}
                        alt=""
                        className="w-full h-full rounded-full ring-1 ring-white/20"
                      />
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-[20px] rounded-bl-md border border-white/10 flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          <div className="p-4 border-t border-white/10 flex-shrink-0 bg-black/30 backdrop-blur-xl">
            <div className="flex items-center gap-2">
              {/* Botones de acción alineados con el input */}
              <div className="flex items-center gap-1">
                <button className="p-2 text-gray-400 hover:text-neon-green transition-all hover:bg-neon-green/10 rounded-xl hover:scale-110 active:scale-95">
                  <Smile size={20} />
                </button>
                <button className="p-2 text-gray-400 hover:text-neon-blue transition-all hover:bg-neon-blue/10 rounded-xl hover:scale-110 active:scale-95">
                  <ImageIcon size={20} />
                </button>
                <button className="p-2 text-gray-400 hover:text-purple-400 transition-all hover:bg-purple-400/10 rounded-xl hover:scale-110 active:scale-95">
                  <Video size={20} />
                </button>
              </div>
              
              <div className="flex-1 relative group">
                {/* Efecto de brillo en el input */}
                <div className="absolute inset-0 bg-gradient-to-r from-neon-green/0 via-neon-green/5 to-neon-green/0 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-sm" />
                
                <Input
                  placeholder="Escribe un mensaje..."
                  value={newMessageContent}
                  onChange={handleInputChange}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  className="relative bg-white/5 border-white/10 text-white placeholder-gray-500 focus:ring-2 focus:ring-neon-green/50 focus:border-neon-green/50 rounded-2xl px-4 py-2.5 text-[15px] transition-all duration-200 focus:bg-white/10 h-[44px]"
                  disabled={!isConnected}
                />
              </div>
              
              <button
                onClick={handleSendMessage}
                disabled={!newMessageContent.trim() || !isConnected}
                className={cn(
                  "p-2.5 rounded-2xl transition-all duration-200 shadow-lg flex-shrink-0",
                  newMessageContent.trim() && isConnected
                    ? "bg-gradient-to-br from-neon-green to-emerald-500 text-black hover:shadow-neon-green/50 hover:scale-110 active:scale-95"
                    : "bg-white/5 text-gray-600 cursor-not-allowed"
                )}
              >
                <Send size={20} className={cn(
                  "transition-transform",
                  newMessageContent.trim() && "group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                )} />
              </button>
            </div>
            
            {!isConnected && (
              <div className="text-center mt-2 animate-pulse">
                <div className="inline-flex items-center gap-2 text-red-400 text-xs bg-red-400/10 px-3 py-1.5 rounded-full border border-red-400/20">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-ping" />
                  Reconectando...
                </div>
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