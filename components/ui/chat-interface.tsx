'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { CyberButton } from '@/components/ui/cyber-button';
import { Input } from '@/components/ui/input';
import { X, Send, Smile, Image as ImageIcon, Video, Settings } from 'lucide-react';
import { ChatPreview, Message } from '@/types/user';
import { useAuth } from '@/components/providers/providers';
import { cn } from '@/lib/utils';
import { ChatSettingsDialog } from './chat-settings-dialog';
import { toast } from 'sonner';

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  chat: ChatPreview | null; // Ahora puede ser null
  onUpdateChat: (updatedChat: ChatPreview) => void;
}

// Mapeo de fondos a clases de Tailwind (simulado)
const backgroundClasses: { [key: string]: string } = {
  particles: 'bg-gradient-to-br from-gray-900 to-gray-800',
  hearts: 'bg-gradient-to-br from-pink-900 to-red-900',
  footballs: 'bg-gradient-to-br from-green-900 to-blue-900',
  music_notes: 'bg-gradient-to-br from-purple-900 to-indigo-900',
  circuits: 'bg-gradient-to-br from-gray-900 to-gray-800', // Clase base para circuitos
  geometric_lines: 'bg-gradient-to-br from-blue-900 to-cyan-900', // Clase base para líneas geométricas
  none: 'bg-transparent',
};

// Estilos para los patrones de fondo mejorados
const backgroundStyles: { [key: string]: React.CSSProperties } = {
  particles: {
    backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%2300ff88\' fill-opacity=\'0.005\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'1\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'1\'/%3E%3Ccircle cx=\'17\' cy=\'7\' r=\'1\'/%3E%3Ccircle cx=\'7\' cy=\'17\' r=\'1\'/%3E%3C/g%3E%3C/svg%3E")',
    backgroundSize: '40px 40px',
  },
  hearts: {
    backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'30\' height=\'30\' viewBox=\'0 0 30 30\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M15 25c-1-1-8-7-8-13 0-3 2-5 5-5 2 0 3 1 3 1s1-1 3-1c3 0 5 2 5 5 0 6-7 12-8 13z\' fill=\'%23ff69b4\' fill-opacity=\'0.005\'/%3E%3C/svg%3E")',
    backgroundSize: '60px 60px',
  },
  footballs: {
    backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%2300ff88\' fill-opacity=\'0.005\'%3E%3Ccircle cx=\'20\' cy=\'20\' r=\'8\' fill=\'none\' stroke=\'%2300ff88\' stroke-width=\'1\'/%3E%3Cpath d=\'M20 12v16M12 20h16M16 16l8 8M24 16l-8 8\' stroke=\'%2300ff88\' stroke-width=\'0.5\'/%3E%3C/g%3E%3C/svg%3E")',
    backgroundSize: '80px 80px',
  },
  music_notes: {
    backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'35\' height=\'35\' viewBox=\'0 0 35 35\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%238800ff\' fill-opacity=\'0.005\'%3E%3Cpath d=\'M10 25c-2 0-3-1-3-3s1-3 3-3 3 1 3 3-1 3-3 3zm0-4c-1 0-1 0-1 1s0 1 1 1 1 0 1-1 0-1-1-1z\'/%3E%3Cpath d=\'M25 20c-2 0-3-1-3-3s1-3 3-3 3 1 3 3-1 3-3 3zm0-4c-1 0-1 0-1 1s0 1 1 1 1 0 1-1 0-1-1-1z\'/%3E%3Cpath d=\'M13 22V10h2v10l8-2V8h2v12c0 2-1 3-3 3s-3-1-3-3c0-1 0-2 1-2l1-1-8 2z\'/%3E%3C/g%3E%3C/svg%3E")',
    backgroundSize: '70px 70px',
  },
  circuits: { // Nuevo patrón de circuitos
    backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%2300ff88\' fill-opacity=\'0.005\'%3E%3Cpath d=\'M0 0h20v20H0zm20 20h20v20H20z\'/%3E%3Cpath d=\'M10 0v40M30 0v40M0 10h40M0 30h40\' stroke=\'%2300ff88\' stroke-width=\'0.5\'/%3E%3Ccircle cx=\'10\' cy=\'10\' r=\'2\'/%3E%3Ccircle cx=\'30\' cy=\'10\' r=\'2\'/%3E%3Ccircle cx=\'10\' cy=\'30\' r=\'2\'/%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'2\'/%3E%3C/g%3E%3C/svg%3E")',
    backgroundSize: '80px 80px',
  },
  geometric_lines: { // Nuevo patrón de líneas geométricas
    backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%230088ff\' fill-opacity=\'0.005\'%3E%3Cpath d=\'M0 0L30 30L0 60L30 30L60 0L30 30L60 60z\' stroke=\'%230088ff\' stroke-width=\'0.5\'/%3E%3C/g%3E%3C/svg%3E")',
    backgroundSize: '120px 120px',
  },
  none: {},
};


export function ChatInterface({ isOpen, onClose, chat, onUpdateChat }: ChatInterfaceProps) {
  const { user: currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>(chat?.messages || []); // Inicializar con mensajes del chat o array vacío
  const [newMessageContent, setNewMessageContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);

  useEffect(() => {
    if (chat) {
      setMessages(chat.messages);
      scrollToBottom();
    }
  }, [chat]); // Dependencia de chat

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (newMessageContent.trim() && currentUser && chat) { // Asegurarse de que chat no sea null
      const newMessage: Message = {
        id: Date.now().toString(),
        senderId: currentUser.id,
        content: newMessageContent.trim(),
        timestamp: new Date().toISOString(),
        type: 'text',
      };
      setMessages(prev => [...prev, newMessage]);
      setNewMessageContent('');
      // Opcional: Actualizar el chat en el padre con el nuevo mensaje
      onUpdateChat({
        ...chat,
        messages: [...chat.messages, newMessage],
        lastMessage: newMessage.content,
        timestamp: newMessage.timestamp,
      });
    }
  };

  const handleSaveChatSettings = useCallback((chatId: string, settings: { nickname?: string; chatBackground?: string; chatColor?: string; otherMessageColor?: string }) => {
    if (chat) { // Asegurarse de que chat no sea null
      const updatedChat = {
        ...chat,
        nickname: settings.nickname,
        chatBackground: settings.chatBackground,
        chatColor: settings.chatColor,
        otherMessageColor: settings.otherMessageColor,
      };
      onUpdateChat(updatedChat);
    }
  }, [chat, onUpdateChat]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  // Si no hay chat seleccionado, no renderizar el contenido del diálogo
  if (!chat) {
    return null; 
  }

  const currentChatBackgroundStyle = chat.chatBackground ? backgroundStyles[chat.chatBackground] : {};
  const currentChatBackgroundColorClass = chat.chatBackground ? backgroundClasses[chat.chatBackground] : 'bg-transparent';

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl h-[90vh] flex flex-col glass-card border-neon-green/20 p-0">
          <DialogHeader className="p-4 border-b border-white/10 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={chat.otherUser.avatar}
                  alt={chat.otherUser.displayName}
                  className="w-10 h-10 rounded-full ring-2 ring-neon-blue/30"
                />
                <div>
                  <DialogTitle className="text-white text-lg">
                    {chat.nickname || chat.otherUser.displayName}
                  </DialogTitle>
                  <DialogDescription className="text-gray-400 text-sm">@{chat.otherUser.username}</DialogDescription>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <CyberButton variant="ghost" size="icon" onClick={() => setIsSettingsDialogOpen(true)} title="Personalizar chat">
                  <Settings size={20} className="text-gray-400 hover:text-white" />
                </CyberButton>
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
              "flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide",
              currentChatBackgroundColorClass
            )}
            style={currentChatBackgroundStyle}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex',
                  message.senderId === currentUser?.id ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-[70%] p-3 rounded-xl',
                    message.senderId === currentUser?.id
                      ? chat.chatColor || 'bg-neon-green/20' + ' text-white rounded-br-none'
                      : chat.otherMessageColor || 'bg-white/10' + ' text-gray-200 rounded-bl-none'
                  )}
                >
                  <p className="text-sm">{message.content}</p>
                  <span className="text-xs text-gray-500 mt-1 block text-right">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-white/10 flex-shrink-0">
            <div className="flex items-center space-x-2">
              <CyberButton variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Smile size={20} />
              </CyberButton>
              <CyberButton variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <ImageIcon size={20} />
              </CyberButton>
              <CyberButton variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Video size={20} />
              </CyberButton>
              <Input
                placeholder="Escribe un mensaje..."
                value={newMessageContent}
                onChange={(e) => setNewMessageContent(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-neon-green/50"
              />
              <CyberButton onClick={handleSendMessage} disabled={!newMessageContent.trim()}>
                <Send size={20} />
              </CyberButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Renderizar ChatSettingsDialog siempre, controlando su visibilidad con isOpen */}
      {chat && ( // Solo renderizar si hay un chat válido para pasarle
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