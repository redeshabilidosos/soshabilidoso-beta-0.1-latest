"use client";

import { useState, useEffect, useRef } from 'react';
import { 
  Send, Smile, Settings, ArrowLeft, 
  Phone, Video, CheckCheck,
  Paperclip, Bell, BellOff, Heart, Sparkles, Moon, Stars,
  ThumbsDown, Share2, X
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { messagingService, ChatRoom, Message } from '@/lib/services/messaging.service';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { UserProfileDialog } from '@/components/ui/user-profile-dialog';
import EmojiPicker from 'emoji-picker-react';
import { StoryPreviewMessage } from './story-preview-message';
import { TypingIndicator } from './typing-indicator';
import { useChatWebSocket } from '@/hooks/use-chat-websocket';
import dynamic from 'next/dynamic';

// Importar el visor de historias dinámicamente
const StoriesSlider = dynamic(() => import('@/components/ui/stories-slider').then(mod => ({ default: mod.StoriesSlider })), {
  ssr: false
});

interface ChatWindowProps {
  chatId: string;
  onBack?: () => void;
}

// Reacciones disponibles para mensajes
const MESSAGE_REACTIONS = [
  { type: 'love', emoji: '❤️', label: 'Me encanta' },
  { type: 'laugh', emoji: '😂', label: 'Jajaja' },
  { type: 'like', emoji: '👍', label: 'Me gusta' },
  { type: 'dislike', emoji: '👎', label: 'No me gusta' },
];

interface ChatWindowProps {
  chatId: string;
  onBack?: () => void;
}

// Colores predefinidos para burbujas
const BUBBLE_COLORS = [
  { name: 'Verde Neón', value: 'neon-green', bg: 'bg-gradient-to-br from-[#39FF14] to-emerald-500', text: 'text-black' },
  { name: 'Azul', value: 'blue', bg: 'bg-gradient-to-br from-blue-500 to-blue-600', text: 'text-white' },
  { name: 'Púrpura', value: 'purple', bg: 'bg-gradient-to-br from-purple-500 to-violet-600', text: 'text-white' },
  { name: 'Rosa', value: 'pink', bg: 'bg-gradient-to-br from-pink-500 to-rose-500', text: 'text-white' },
  { name: 'Naranja', value: 'orange', bg: 'bg-gradient-to-br from-orange-500 to-amber-500', text: 'text-black' },
  { name: 'Rojo', value: 'red', bg: 'bg-gradient-to-br from-red-500 to-rose-600', text: 'text-white' },
];

// Fondos disponibles
const BACKGROUNDS = [
  { name: 'Estrellas', value: 'stars', icon: Stars },
  { name: 'Corazones', value: 'hearts', icon: Heart },
  { name: 'Partículas', value: 'particles', icon: Sparkles },
  { name: 'Oscuro', value: 'dark', icon: Moon },
];

export function ChatWindow({ chatId, onBack }: ChatWindowProps) {
  const [chat, setChat] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [bubbleColor, setBubbleColor] = useState('neon-green');
  const [chatBackground, setChatBackground] = useState('stars');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [selectedMessageForReaction, setSelectedMessageForReaction] = useState<string | null>(null);
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [messageToShare, setMessageToShare] = useState<Message | null>(null);
  const [typingUsers, setTypingUsers] = useState<Map<string, string>>(new Map());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const currentUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {};
  const userId = currentUser?.id;

  // Integrar WebSocket
  const { isConnected, sendTypingStart, sendTypingStop, sendMessage: sendWsMessage } = useChatWebSocket({
    chatId,
    userId,
    onNewMessage: (message) => {
      setMessages(prev => [...prev, message]);
      scrollToBottom();
    },
    onTypingStart: (userId, username) => {
      setTypingUsers(prev => new Map(prev).set(userId, username));
    },
    onTypingStop: (userId) => {
      setTypingUsers(prev => {
        const newMap = new Map(prev);
        newMap.delete(userId);
        return newMap;
      });
    },
  });

  useEffect(() => {
    loadChat();
    loadMessages();
    const savedColor = localStorage.getItem(`chat_color_${chatId}`);
    const savedBg = localStorage.getItem(`chat_bg_${chatId}`);
    if (savedColor) setBubbleColor(savedColor);
    if (savedBg) setChatBackground(savedBg);
    
    // Enfocar el input cuando se carga el chat
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cerrar emoji picker al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showEmojiPicker && !event.target?.closest('.emoji-picker-container')) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEmojiPicker]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChat = async () => {
    try {
      const chatData = await messagingService.getChat(chatId);
      setChat(chatData);
    } catch (error) {
      console.error('Error loading chat:', error);
    }
  };

  const loadMessages = async () => {
    try {
      const response = await messagingService.getMessages(chatId);
      setMessages(response.results.reverse());
      await messagingService.markAsRead(chatId);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;
    
    setSending(true);
    sendTypingStop(); // Detener indicador de escritura
    
    try {
      const message = await messagingService.sendMessage(chatId, newMessage.trim());
      setMessages(prev => [...prev, message]);
      sendWsMessage(message); // Enviar por WebSocket
      setNewMessage('');
      // Mantener el foco en el input después de enviar
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e as any);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast({ title: "Error", description: "Solo se permiten imágenes", variant: "destructive" });
      return;
    }
    try {
      const message = await messagingService.sendImageMessage(chatId, file);
      setMessages(prev => [...prev, message]);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleColorChange = (color: string) => {
    setBubbleColor(color);
    localStorage.setItem(`chat_color_${chatId}`, color);
  };

  const handleBackgroundChange = (bg: string) => {
    setChatBackground(bg);
    localStorage.setItem(`chat_bg_${chatId}`, bg);
  };

  const handleStoryClick = (storyId: string) => {
    setSelectedStoryId(storyId);
    setShowStoryViewer(true);
  };

  const handleReaction = async (messageId: string, reactionType: string) => {
    try {
      const result = await messagingService.reactToMessage(chatId, messageId, reactionType);
      // Actualizar el mensaje localmente
      setMessages(prev => prev.map(msg => {
        if (msg.id === messageId) {
          const currentUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {};
          let newReactions = [...(msg.reactions || [])];
          
          // Buscar si el usuario ya tiene una reacción
          const existingReactionIndex = newReactions.findIndex(r => r.user.id === currentUser.id);
          
          if (result.reacted) {
            // Agregar o actualizar reacción
            const newReaction = {
              id: Date.now().toString(),
              user: {
                id: currentUser.id,
                username: currentUser.username,
                display_name: currentUser.display_name || currentUser.username,
              },
              reaction_type: reactionType as any,
              created_at: new Date().toISOString(),
            };
            
            if (existingReactionIndex >= 0) {
              newReactions[existingReactionIndex] = newReaction;
            } else {
              newReactions.push(newReaction);
            }
          } else {
            // Eliminar reacción
            if (existingReactionIndex >= 0) {
              newReactions.splice(existingReactionIndex, 1);
            }
          }
          
          return { ...msg, reactions: newReactions };
        }
        return msg;
      }));
      setSelectedMessageForReaction(null);
      toast({ 
        title: "Reacción agregada", 
        description: "Tu reacción se ha registrado correctamente",
        duration: 2000
      });
    } catch (error: any) {
      console.error('Error al reaccionar:', error);
      toast({ 
        title: "Error al reaccionar", 
        description: error.response?.data?.detail || error.message || "No se pudo agregar la reacción. Intenta de nuevo.", 
        variant: "destructive" 
      });
    }
  };

  const handleShareMessage = (message: Message) => {
    setMessageToShare(message);
    setShowShareDialog(true);
  };

  const getReactionEmoji = (type: string) => {
    const reaction = MESSAGE_REACTIONS.find(r => r.type === type);
    return reaction?.emoji || '👍';
  };

  const getGroupedReactions = (reactions: Message['reactions']) => {
    if (!reactions || reactions.length === 0) return [];
    const grouped: { [key: string]: { count: number; users: string[] } } = {};
    reactions.forEach(r => {
      if (!grouped[r.reaction_type]) {
        grouped[r.reaction_type] = { count: 0, users: [] };
      }
      grouped[r.reaction_type].count++;
      grouped[r.reaction_type].users.push(r.user.display_name);
    });
    return Object.entries(grouped).map(([type, data]) => ({
      type,
      emoji: getReactionEmoji(type),
      count: data.count,
      users: data.users,
    }));
  };

  const formatMessageTime = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  const getOtherParticipant = () => {
    if (!chat || chat.chat_type !== 'private') return null;
    const currentUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {};
    return chat.participants?.find(p => p.user.id !== currentUser?.id)?.user;
  };

  const getChatDisplayName = () => {
    if (chat?.name) return chat.name;
    if (chat?.chat_type === 'private') {
      const other = getOtherParticipant();
      return other?.display_name || 'Usuario';
    }
    return 'Chat';
  };

  const getBubbleStyle = () => {
    const color = BUBBLE_COLORS.find(c => c.value === bubbleColor) || BUBBLE_COLORS[0];
    return { bg: color.bg, text: color.text };
  };

  const getColorPreview = (value: string) => {
    const color = BUBBLE_COLORS.find(c => c.value === value);
    return color?.bg || '';
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-black">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-2 border-neon-green border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-400 text-sm">Cargando chat...</span>
        </div>
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="h-full flex items-center justify-center bg-black">
        <div className="text-center">
          <p className="text-gray-400">Chat no encontrado</p>
          {onBack && (
            <button onClick={onBack} className="mt-4 text-neon-green flex items-center gap-2 mx-auto">
              <ArrowLeft className="w-4 h-4" /> Volver
            </button>
          )}
        </div>
      </div>
    );
  }

  const otherUser = getOtherParticipant();
  const bubbleStyle = getBubbleStyle();

  return (
    <div className="h-full flex flex-col bg-black overflow-hidden">
      {/* Fondos animados - posición absoluta dentro del contenedor */}
      {chatBackground === 'stars' && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="stars-container">
            <div className="star star-1">✦</div>
            <div className="star star-2">✧</div>
            <div className="star star-3">✦</div>
            <div className="star star-4">✧</div>
            <div className="star star-5">✦</div>
            <div className="star star-6">✧</div>
            <div className="star star-7">✦</div>
            <div className="star star-8">✧</div>
            <div className="star star-9">✦</div>
            <div className="star star-10">✧</div>
            <div className="star star-11">✦</div>
            <div className="star star-12">✧</div>
            <div className="star star-13">✦</div>
            <div className="star star-14">✧</div>
            <div className="star star-15">✦</div>
            <div className="star star-16">✧</div>
            <div className="star star-17">✦</div>
            <div className="star star-18">✧</div>
            <div className="star star-19">✦</div>
            <div className="star star-20">✧</div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-amber-500/5" />
        </div>
      )}
      
      {chatBackground === 'particles' && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="particles-container">
            {/* Partículas - solo círculos */}
            <div className="particle particle-1"></div>
            <div className="particle particle-2"></div>
            <div className="particle particle-3"></div>
            <div className="particle particle-4"></div>
            <div className="particle particle-5"></div>
            <div className="particle particle-6"></div>
            <div className="particle particle-7"></div>
            <div className="particle particle-8"></div>
            <div className="particle particle-9"></div>
            <div className="particle particle-10"></div>
            <div className="particle particle-11"></div>
            <div className="particle particle-12"></div>
            <div className="particle particle-13"></div>
            <div className="particle particle-14"></div>
            <div className="particle particle-15"></div>
            <div className="particle particle-16"></div>
            <div className="particle particle-17"></div>
            <div className="particle particle-18"></div>
            <div className="particle particle-19"></div>
            <div className="particle particle-20"></div>
            <div className="particle particle-21"></div>
            <div className="particle particle-22"></div>
            <div className="particle particle-23"></div>
            <div className="particle particle-24"></div>
            <div className="particle particle-25"></div>
            <div className="particle particle-26"></div>
            <div className="particle particle-27"></div>
            <div className="particle particle-28"></div>
            <div className="particle particle-29"></div>
            <div className="particle particle-30"></div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-neon-green/5 via-transparent to-emerald-500/5" />
        </div>
      )}
      
      {chatBackground === 'hearts' && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="hearts-container">
            <div className="heart heart-1">♥</div>
            <div className="heart heart-2">♥</div>
            <div className="heart heart-3">♥</div>
            <div className="heart heart-4">♥</div>
            <div className="heart heart-5">♥</div>
            <div className="heart heart-6">♥</div>
            <div className="heart heart-7">♥</div>
            <div className="heart heart-8">♥</div>
            <div className="heart heart-9">♥</div>
            <div className="heart heart-10">♥</div>
            <div className="heart heart-11">♥</div>
            <div className="heart heart-12">♥</div>
            <div className="heart heart-13">♥</div>
            <div className="heart heart-14">♥</div>
            <div className="heart heart-15">♥</div>
            <div className="heart heart-16">♥</div>
            <div className="heart heart-17">♥</div>
            <div className="heart heart-18">♥</div>
            <div className="heart heart-19">♥</div>
            <div className="heart heart-20">♥</div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-transparent to-rose-500/5" />
        </div>
      )}
      
      {chatBackground === 'dark' && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-900" />
      )}

      {/* Header del chat - fijo arriba */}
      <div className="flex-shrink-0 relative z-10 backdrop-blur-xl bg-black/80 border-b border-white/10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            {onBack && (
              <button onClick={onBack} className="lg:hidden p-2 hover:bg-white/10 rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
            )}
            
            <button 
              onClick={() => otherUser && setShowUserProfile(true)}
              className="relative cursor-pointer hover:opacity-80 transition-opacity"
            >
              <Avatar className="w-10 h-10 ring-2 ring-white/20">
                <AvatarImage src={otherUser?.avatar_url || chat.avatar} alt={getChatDisplayName()} />
                <AvatarFallback className="bg-gradient-to-br from-neon-green to-emerald-600 text-white font-semibold">
                  {getChatDisplayName().charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
            </button>
            
            <button 
              onClick={() => otherUser && setShowUserProfile(true)}
              className="flex-1 min-w-0 text-left cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-white truncate">{getChatDisplayName()}</h3>
                {otherUser?.account_type === 'enterprise' && (
                  <span className="text-sm" title="Empresa verificada">🏢</span>
                )}
                {otherUser?.is_verified && otherUser?.account_type !== 'enterprise' && (
                  <Badge className="bg-blue-500/20 text-blue-400 border-0 text-xs px-1.5">✓</Badge>
                )}
              </div>
              <p className="text-xs text-gray-400">
                {otherUser ? `@${otherUser.username}` : 'En línea'}
                {isConnected && <span className="ml-2 text-neon-green">● Conectado</span>}
              </p>
            </button>
          </div>
          
          <div className="flex items-center space-x-1">
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
              <Video className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className={cn(
                "p-2 rounded-full transition-all",
                showSettings ? "bg-neon-green text-black" : "hover:bg-white/10 text-gray-400 hover:text-white"
              )}
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Panel de configuración */}
        {showSettings && (
          <div className="px-4 pb-4 space-y-4 border-t border-white/10 pt-4 animate-in slide-in-from-top-2 duration-200">
            {/* Color de burbujas */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block font-medium">Color de mensajes</label>
              <div className="flex flex-wrap gap-3">
                {BUBBLE_COLORS.map(color => (
                  <button
                    key={color.value}
                    onClick={() => handleColorChange(color.value)}
                    className={cn(
                      "w-10 h-10 rounded-full transition-all duration-200",
                      color.bg,
                      bubbleColor === color.value 
                        ? "ring-2 ring-white ring-offset-2 ring-offset-black scale-110 shadow-lg" 
                        : "hover:scale-110 opacity-80 hover:opacity-100"
                    )}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
            
            {/* Fondo */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block font-medium">Fondo del chat</label>
              <div className="flex flex-wrap gap-2">
                {BACKGROUNDS.map(bg => {
                  const Icon = bg.icon;
                  return (
                    <button
                      key={bg.value}
                      onClick={() => handleBackgroundChange(bg.value)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all duration-200",
                        chatBackground === bg.value 
                          ? "bg-neon-green text-black font-medium shadow-lg shadow-neon-green/25" 
                          : "bg-white/10 text-gray-300 hover:bg-white/20"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {bg.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notificaciones */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-gray-400 font-medium">Notificaciones</span>
              <button
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={cn(
                  "p-2 rounded-full transition-all duration-200",
                  notificationsEnabled 
                    ? "bg-neon-green text-black" 
                    : "bg-white/10 text-gray-400 hover:bg-white/20"
                )}
              >
                {notificationsEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Área de mensajes - única parte con scroll */}
      <div className="flex-1 overflow-y-auto relative z-10 px-4 py-4 min-h-0">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full bg-white/5 backdrop-blur-sm flex items-center justify-center mb-4 ring-1 ring-white/10">
              <Avatar className="w-16 h-16">
                <AvatarImage src={otherUser?.avatar_url} />
                <AvatarFallback className="bg-gradient-to-br from-neon-green to-emerald-600 text-white text-2xl">
                  {getChatDisplayName().charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <h3 className="text-white font-semibold">{getChatDisplayName()}</h3>
              {otherUser?.account_type === 'enterprise' && (
                <span className="text-sm" title="Empresa verificada">🏢</span>
              )}
              {otherUser?.is_verified && otherUser?.account_type !== 'enterprise' && (
                <Badge className="bg-blue-500/20 text-blue-400 border-0 text-xs px-1.5">✓</Badge>
              )}
            </div>
            <p className="text-gray-500 text-sm mb-4">Inicia la conversación</p>
            <div className="flex gap-2">
              <button 
                onClick={() => { setNewMessage('¡Hola! 👋'); inputRef.current?.focus(); }}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm text-white transition-all hover:scale-105"
              >
                ¡Hola! 👋
              </button>
              <button 
                onClick={() => { setNewMessage('¿Cómo estás?'); inputRef.current?.focus(); }}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm text-white transition-all hover:scale-105"
              >
                ¿Cómo estás?
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-0">
            {messages.map((message, index) => {
              const isOwn = message.sender.id === userId;
              const showAvatar = !isOwn && (index === 0 || messages[index - 1]?.sender.id !== message.sender.id);
              const isLastInGroup = index === messages.length - 1 || messages[index + 1]?.sender.id !== message.sender.id;
              const isFirstInGroup = index === 0 || messages[index - 1]?.sender.id !== message.sender.id;
              const groupedReactions = getGroupedReactions(message.reactions);
              const hasReactions = groupedReactions.length > 0;
              
              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-end gap-2 group relative",
                    isOwn ? "justify-end" : "justify-start",
                    isLastInGroup ? "mb-1" : "mb-0",
                    hasReactions && isLastInGroup ? "mb-1.5" : ""
                  )}
                >
                  {!isOwn && (
                    <div className="w-7 flex-shrink-0">
                      {showAvatar && (
                        <div className="w-7 h-7 rounded-full overflow-hidden bg-gradient-to-br from-neon-green/80 to-emerald-600 flex items-center justify-center relative">
                          {message.sender.avatar_url ? (
                            <img 
                              src={message.sender.avatar_url}
                              alt={message.sender.display_name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Fallback si la imagen no carga
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          ) : null}
                          {/* Fallback con inicial - siempre presente */}
                          <div className="absolute inset-0 flex items-center justify-center text-white font-semibold text-xs pointer-events-none">
                            {message.sender.display_name?.charAt(0).toUpperCase()}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className={cn("max-w-[75%] lg:max-w-[60%] relative", isOwn ? "order-1" : "order-2")}>
                    {/* Previsualización de historia si el mensaje es una respuesta a historia */}
                    {message.message_type === 'story_reply' && message.story_preview && (
                      <StoryPreviewMessage
                        storyPreview={message.story_preview}
                        onStoryClick={handleStoryClick}
                        className="mb-2"
                      />
                    )}
                    
                    {message.message_type === 'image' && message.image && (
                      <img
                        src={message.image}
                        alt="Imagen"
                        className="rounded-2xl max-w-full h-auto mb-1 cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => window.open(message.image, '_blank')}
                      />
                    )}
                    
                    {message.content && (
                      <div
                        className={cn(
                          "px-3 py-2 shadow-lg relative",
                          isOwn 
                            ? cn(
                                bubbleStyle.bg, 
                                bubbleStyle.text,
                                isFirstInGroup && isLastInGroup ? "rounded-2xl" :
                                isFirstInGroup ? "rounded-2xl rounded-br-md" :
                                isLastInGroup ? "rounded-2xl rounded-tr-md" : "rounded-2xl rounded-r-md"
                              )
                            : cn(
                                "bg-white/10 backdrop-blur-sm text-white",
                                isFirstInGroup && isLastInGroup ? "rounded-2xl" :
                                isFirstInGroup ? "rounded-2xl rounded-bl-md" :
                                isLastInGroup ? "rounded-2xl rounded-tl-md" : "rounded-2xl rounded-l-md"
                              )
                        )}
                        onDoubleClick={() => setSelectedMessageForReaction(
                          selectedMessageForReaction === message.id ? null : message.id
                        )}
                      >
                        <p className="text-[15px] leading-snug whitespace-pre-wrap break-words">
                          {message.content}
                        </p>
                        
                        {isLastInGroup && (
                          <div className={cn("flex items-center gap-1 mt-1", isOwn ? "justify-end" : "justify-start")}>
                            <span className={cn("text-[10px]", isOwn ? "opacity-70" : "text-gray-500")}>
                              {formatMessageTime(message.created_at)}
                            </span>
                            {isOwn && (
                              <CheckCheck className={cn("w-3.5 h-3.5", message.is_read ? "text-blue-400" : "opacity-60")} />
                            )}
                          </div>
                        )}
                        
                        {/* Reacciones existentes */}
                        {hasReactions && (
                          <div className={cn(
                            "absolute -bottom-4 flex gap-0.5",
                            isOwn ? "right-2" : "left-2"
                          )}>
                            {groupedReactions.map((reaction) => (
                              <button
                                key={reaction.type}
                                onClick={() => handleReaction(message.id, reaction.type)}
                                className="flex items-center gap-0.5 px-1.5 py-0.5 bg-gray-800/90 backdrop-blur-sm rounded-full text-xs hover:bg-gray-700 transition-colors border border-white/10"
                                title={reaction.users.join(', ')}
                              >
                                <span>{reaction.emoji}</span>
                                {reaction.count > 1 && (
                                  <span className="text-gray-300 text-[10px]">{reaction.count}</span>
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Botón para mostrar selector de reacciones */}
                    <button
                      onClick={() => setSelectedMessageForReaction(
                        selectedMessageForReaction === message.id ? null : message.id
                      )}
                      className={cn(
                        "absolute top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-gray-800/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-gray-700 border border-white/10",
                        isOwn ? "-left-16" : "-right-16"
                      )}
                      title="Reaccionar"
                    >
                      <Smile className="w-4 h-4 text-gray-400" />
                    </button>
                    
                    {/* Botón para compartir mensaje */}
                    <button
                      onClick={() => handleShareMessage(message)}
                      className={cn(
                        "absolute top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-gray-800/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-gray-700 border border-white/10",
                        isOwn ? "-left-8" : "-right-8"
                      )}
                      title="Compartir mensaje"
                    >
                      <Share2 className="w-4 h-4 text-gray-400" />
                    </button>
                    
                    {/* Selector de reacciones */}
                    {selectedMessageForReaction === message.id && (
                      <div className={cn(
                        "absolute z-20 flex gap-1 p-2 bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl animate-in zoom-in-95 duration-150",
                        isOwn ? "right-0 -top-12" : "left-0 -top-12"
                      )}>
                        {MESSAGE_REACTIONS.map((reaction) => (
                          <button
                            key={reaction.type}
                            onClick={() => handleReaction(message.id, reaction.type)}
                            className="p-2 hover:bg-white/10 rounded-xl transition-all hover:scale-125 active:scale-95"
                            title={reaction.label}
                          >
                            <span className="text-xl">{reaction.emoji}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            
            {/* Indicador de "está escribiendo" */}
            {Array.from(typingUsers.values()).map((username) => (
              <TypingIndicator key={username} username={username} />
            ))}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input de mensaje - fijo en la parte inferior */}
      <div className="flex-shrink-0 relative z-10 backdrop-blur-xl bg-black/80 border-t border-white/10 p-3">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <div className="flex items-center flex-shrink-0">
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
            <button
              type="button"
              onClick={() => document.getElementById('image-upload')?.click()}
              className="p-2.5 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-neon-green flex-shrink-0"
              title="Adjuntar imagen"
            >
              <Paperclip className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 relative min-w-0">
            <input
              ref={inputRef}
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                if (e.target.value.trim()) {
                  sendTypingStart();
                } else {
                  sendTypingStop();
                }
              }}
              onKeyPress={handleKeyPress}
              placeholder="Escribe un mensaje..."
              className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/10 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-neon-green/50 focus:bg-white/15 transition-all text-[15px]"
              disabled={sending}
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-yellow-400 flex-shrink-0"
              title="Agregar emoji"
            >
              <Smile className="w-4 h-4" />
            </button>
          </div>
          
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className={cn(
              "p-3 rounded-full transition-all duration-200 flex-shrink-0",
              newMessage.trim() 
                ? cn(bubbleStyle.bg, bubbleStyle.text, "shadow-lg hover:scale-105 active:scale-95")
                : "bg-white/10 text-gray-500"
            )}
            title="Enviar mensaje"
          >
            {sending ? (
              <div className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>

        {showEmojiPicker && (
          <div className="absolute bottom-full left-0 right-0 mb-2 mx-3 animate-in slide-in-from-bottom-2 duration-200 emoji-picker-container">
            <div className="flex justify-center">
              <div className="bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                <EmojiPicker
                  onEmojiClick={(emojiData) => {
                    setNewMessage(prev => prev + emojiData.emoji);
                    setShowEmojiPicker(false);
                    inputRef.current?.focus();
                  }}
                  theme="dark"
                  width={350}
                  height={400}
                  searchDisabled={false}
                  skinTonesDisabled={false}
                  previewConfig={{
                    showPreview: false
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CSS para fondos animados con rebote */}
      <style jsx>{`
        /* === CORAZONES === */
        .hearts-container {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        .heart {
          position: absolute;
          font-size: 16px;
          opacity: 0.25;
          color: #ff6b9d;
          text-shadow: 0 0 8px #ff6b9d;
        }
        @media (min-width: 768px) {
          .heart { font-size: 20px; opacity: 0.2; }
        }
        @media (min-width: 1024px) {
          .heart { font-size: 24px; opacity: 0.18; }
        }
        /* Tamaños variados para corazones */
        .heart-1, .heart-6, .heart-11, .heart-16 { font-size: 12px; }
        .heart-3, .heart-8, .heart-13, .heart-18 { font-size: 20px; }
        .heart-5, .heart-10, .heart-15, .heart-20 { font-size: 14px; }
        /* Colores variados para corazones */
        .heart-2, .heart-7, .heart-12, .heart-17 { color: #ff85a2; text-shadow: 0 0 8px #ff85a2; }
        .heart-4, .heart-9, .heart-14, .heart-19 { color: #ff4d7a; text-shadow: 0 0 8px #ff4d7a; }
        /* Posiciones y animaciones de corazones - combinando movimiento y latido */
        .heart-1 { top: 5%; left: 8%; animation: heartFloat1 12s ease-in-out infinite; }
        .heart-2 { top: 15%; right: 12%; animation: heartFloat2 14s ease-in-out infinite; }
        .heart-3 { top: 25%; left: 20%; animation: heartFloat3 11s ease-in-out infinite; }
        .heart-4 { top: 10%; right: 35%; animation: heartFloat4 13s ease-in-out infinite; }
        .heart-5 { top: 35%; left: 5%; animation: heartFloat5 15s ease-in-out infinite; }
        .heart-6 { top: 45%; right: 8%; animation: heartFloat6 12s ease-in-out infinite; }
        .heart-7 { top: 30%; left: 45%; animation: heartFloat1 14s ease-in-out infinite reverse; }
        .heart-8 { top: 55%; right: 25%; animation: heartFloat2 11s ease-in-out infinite reverse; }
        .heart-9 { top: 40%; left: 70%; animation: heartFloat3 13s ease-in-out infinite; }
        .heart-10 { top: 65%; left: 15%; animation: heartFloat4 15s ease-in-out infinite; }
        .heart-11 { top: 50%; right: 50%; animation: heartFloat5 12s ease-in-out infinite reverse; }
        .heart-12 { top: 75%; right: 15%; animation: heartFloat6 14s ease-in-out infinite reverse; }
        .heart-13 { top: 60%; left: 35%; animation: heartFloat1 11s ease-in-out infinite; }
        .heart-14 { top: 85%; left: 55%; animation: heartFloat2 13s ease-in-out infinite; }
        .heart-15 { top: 70%; right: 40%; animation: heartFloat3 15s ease-in-out infinite reverse; }
        .heart-16 { top: 80%; left: 8%; animation: heartFloat4 12s ease-in-out infinite reverse; }
        .heart-17 { top: 90%; right: 60%; animation: heartFloat5 14s ease-in-out infinite; }
        .heart-18 { top: 20%; left: 85%; animation: heartFloat6 11s ease-in-out infinite; }
        .heart-19 { top: 95%; left: 30%; animation: heartFloat1 13s ease-in-out infinite reverse; }
        .heart-20 { top: 8%; left: 50%; animation: heartFloat2 15s ease-in-out infinite reverse; }

        /* Animaciones combinadas de flotación + latido para corazones */
        @keyframes heartFloat1 {
          0% { transform: translate(0, 0) scale(1); opacity: 0.2; }
          12.5% { transform: translate(17px, 12px) scale(1.15); opacity: 0.35; }
          25% { transform: translate(35px, 25px) scale(1); opacity: 0.2; }
          37.5% { transform: translate(25px, 37px) scale(1.15); opacity: 0.35; }
          50% { transform: translate(15px, 50px) scale(1); opacity: 0.2; }
          62.5% { transform: translate(-2px, 40px) scale(1.15); opacity: 0.35; }
          75% { transform: translate(-20px, 30px) scale(1); opacity: 0.2; }
          87.5% { transform: translate(-10px, 15px) scale(1.15); opacity: 0.35; }
          100% { transform: translate(0, 0) scale(1); opacity: 0.2; }
        }
        @keyframes heartFloat2 {
          0% { transform: translate(0, 0) scale(1); opacity: 0.2; }
          12.5% { transform: translate(-15px, 20px) scale(1.15); opacity: 0.35; }
          25% { transform: translate(-30px, 40px) scale(1); opacity: 0.2; }
          37.5% { transform: translate(-20px, 10px) scale(1.15); opacity: 0.35; }
          50% { transform: translate(-10px, -20px) scale(1); opacity: 0.2; }
          62.5% { transform: translate(5px, -2px) scale(1.15); opacity: 0.35; }
          75% { transform: translate(20px, 15px) scale(1); opacity: 0.2; }
          87.5% { transform: translate(10px, 7px) scale(1.15); opacity: 0.35; }
          100% { transform: translate(0, 0) scale(1); opacity: 0.2; }
        }
        @keyframes heartFloat3 {
          0% { transform: translate(0, 0) scale(1); opacity: 0.2; }
          12.5% { transform: translate(12px, -15px) scale(1.15); opacity: 0.35; }
          25% { transform: translate(25px, -30px) scale(1); opacity: 0.2; }
          37.5% { transform: translate(35px, -7px) scale(1.15); opacity: 0.35; }
          50% { transform: translate(45px, 15px) scale(1); opacity: 0.2; }
          62.5% { transform: translate(27px, 27px) scale(1.15); opacity: 0.35; }
          75% { transform: translate(10px, 40px) scale(1); opacity: 0.2; }
          87.5% { transform: translate(5px, 20px) scale(1.15); opacity: 0.35; }
          100% { transform: translate(0, 0) scale(1); opacity: 0.2; }
        }
        @keyframes heartFloat4 {
          0% { transform: translate(0, 0) scale(1); opacity: 0.2; }
          12.5% { transform: translate(-10px, -17px) scale(1.15); opacity: 0.35; }
          25% { transform: translate(-20px, -35px) scale(1); opacity: 0.2; }
          37.5% { transform: translate(-2px, -25px) scale(1.15); opacity: 0.35; }
          50% { transform: translate(15px, -15px) scale(1); opacity: 0.2; }
          62.5% { transform: translate(-10px, -2px) scale(1.15); opacity: 0.35; }
          75% { transform: translate(-35px, 10px) scale(1); opacity: 0.2; }
          87.5% { transform: translate(-17px, 5px) scale(1.15); opacity: 0.35; }
          100% { transform: translate(0, 0) scale(1); opacity: 0.2; }
        }
        @keyframes heartFloat5 {
          0% { transform: translate(0, 0) scale(1); opacity: 0.2; }
          12.5% { transform: translate(15px, -10px) scale(1.15); opacity: 0.35; }
          25% { transform: translate(30px, -20px) scale(1); opacity: 0.2; }
          37.5% { transform: translate(11px, -32px) scale(1.15); opacity: 0.35; }
          50% { transform: translate(-8px, -45px) scale(1); opacity: 0.2; }
          62.5% { transform: translate(5px, -26px) scale(1.15); opacity: 0.35; }
          75% { transform: translate(18px, -8px) scale(1); opacity: 0.2; }
          87.5% { transform: translate(9px, -4px) scale(1.15); opacity: 0.35; }
          100% { transform: translate(0, 0) scale(1); opacity: 0.2; }
        }
        @keyframes heartFloat6 {
          0% { transform: translate(0, 0) scale(1); opacity: 0.2; }
          12.5% { transform: translate(-12px, 10px) scale(1.15); opacity: 0.35; }
          25% { transform: translate(-25px, 20px) scale(1); opacity: 0.2; }
          37.5% { transform: translate(-2px, 32px) scale(1.15); opacity: 0.35; }
          50% { transform: translate(20px, 45px) scale(1); opacity: 0.2; }
          62.5% { transform: translate(29px, 16px) scale(1.15); opacity: 0.35; }
          75% { transform: translate(38px, -12px) scale(1); opacity: 0.2; }
          87.5% { transform: translate(19px, -6px) scale(1.15); opacity: 0.35; }
          100% { transform: translate(0, 0) scale(1); opacity: 0.2; }
        }

        /* === ESTRELLAS === */
        .stars-container {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        .star {
          position: absolute;
          font-size: 14px;
          opacity: 0.3;
          color: #ffd700;
          text-shadow: 0 0 8px #ffd700;
        }
        @media (min-width: 768px) {
          .star { font-size: 18px; opacity: 0.25; }
        }
        @media (min-width: 1024px) {
          .star { font-size: 22px; opacity: 0.2; }
        }
        /* Tamaños variados para estrellas */
        .star-1, .star-6, .star-11, .star-16 { font-size: 10px; }
        .star-3, .star-8, .star-13, .star-18 { font-size: 18px; }
        .star-5, .star-10, .star-15, .star-20 { font-size: 12px; }
        /* Colores variados para estrellas */
        .star-2, .star-7, .star-12, .star-17 { color: #ffec8b; text-shadow: 0 0 8px #ffec8b; }
        .star-4, .star-9, .star-14, .star-19 { color: #fff8dc; text-shadow: 0 0 8px #fff8dc; }
        /* Posiciones y animaciones de estrellas - combinando movimiento y brillo */
        .star-1 { top: 5%; left: 10%; animation: starFloat1 12s ease-in-out infinite; }
        .star-2 { top: 12%; right: 8%; animation: starFloat2 14s ease-in-out infinite; }
        .star-3 { top: 22%; left: 25%; animation: starFloat3 11s ease-in-out infinite; }
        .star-4 { top: 8%; right: 30%; animation: starFloat4 13s ease-in-out infinite; }
        .star-5 { top: 32%; left: 5%; animation: starFloat5 15s ease-in-out infinite; }
        .star-6 { top: 42%; right: 12%; animation: starFloat6 12s ease-in-out infinite; }
        .star-7 { top: 18%; left: 55%; animation: starFloat1 14s ease-in-out infinite reverse; }
        .star-8 { top: 52%; right: 20%; animation: starFloat2 11s ease-in-out infinite reverse; }
        .star-9 { top: 38%; left: 75%; animation: starFloat3 13s ease-in-out infinite; }
        .star-10 { top: 62%; left: 12%; animation: starFloat4 15s ease-in-out infinite; }
        .star-11 { top: 48%; right: 45%; animation: starFloat5 12s ease-in-out infinite reverse; }
        .star-12 { top: 72%; right: 8%; animation: starFloat6 14s ease-in-out infinite reverse; }
        .star-13 { top: 58%; left: 38%; animation: starFloat1 11s ease-in-out infinite; }
        .star-14 { top: 82%; left: 60%; animation: starFloat2 13s ease-in-out infinite; }
        .star-15 { top: 68%; right: 35%; animation: starFloat3 15s ease-in-out infinite reverse; }
        .star-16 { top: 78%; left: 5%; animation: starFloat4 12s ease-in-out infinite reverse; }
        .star-17 { top: 88%; right: 55%; animation: starFloat5 14s ease-in-out infinite; }
        .star-18 { top: 28%; left: 88%; animation: starFloat6 11s ease-in-out infinite; }
        .star-19 { top: 92%; left: 25%; animation: starFloat1 13s ease-in-out infinite reverse; }
        .star-20 { top: 3%; left: 42%; animation: starFloat2 15s ease-in-out infinite reverse; }

        /* Animaciones combinadas de flotación + rotación + brillo para estrellas */
        @keyframes starFloat1 {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
          12.5% { transform: translate(20px, 15px) rotate(22deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
          25% { transform: translate(40px, 30px) rotate(45deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
          37.5% { transform: translate(30px, 42px) rotate(67deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
          50% { transform: translate(20px, 55px) rotate(90deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
          62.5% { transform: translate(1px, 43px) rotate(112deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
          75% { transform: translate(-18px, 32px) rotate(135deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
          87.5% { transform: translate(-9px, 16px) rotate(157deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
          100% { transform: translate(0, 0) rotate(180deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
        }
        @keyframes starFloat2 {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
          12.5% { transform: translate(-16px, 21px) rotate(-22deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
          25% { transform: translate(-32px, 42px) rotate(-45deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
          37.5% { transform: translate(-22px, 10px) rotate(-67deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
          50% { transform: translate(-12px, -22px) rotate(-90deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
          62.5% { transform: translate(5px, -2px) rotate(-112deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
          75% { transform: translate(22px, 18px) rotate(-135deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
          87.5% { transform: translate(11px, 9px) rotate(-157deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
          100% { transform: translate(0, 0) rotate(-180deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
        }
        @keyframes starFloat3 {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
          12.5% { transform: translate(14px, -16px) rotate(30deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
          25% { transform: translate(28px, -32px) rotate(60deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
          37.5% { transform: translate(38px, -7px) rotate(90deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
          50% { transform: translate(48px, 18px) rotate(120deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
          62.5% { transform: translate(30px, 31px) rotate(150deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
          75% { transform: translate(12px, 45px) rotate(180deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
          87.5% { transform: translate(6px, 22px) rotate(210deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
          100% { transform: translate(0, 0) rotate(240deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
        }
        @keyframes starFloat4 {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
          12.5% { transform: translate(-11px, -19px) rotate(-30deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
          25% { transform: translate(-22px, -38px) rotate(-60deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
          37.5% { transform: translate(-2px, -28px) rotate(-90deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
          50% { transform: translate(18px, -18px) rotate(-120deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
          62.5% { transform: translate(-10px, -3px) rotate(-150deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
          75% { transform: translate(-38px, 12px) rotate(-180deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
          87.5% { transform: translate(-19px, 6px) rotate(-210deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
          100% { transform: translate(0, 0) rotate(-240deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
        }
        @keyframes starFloat5 {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
          12.5% { transform: translate(16px, -11px) rotate(15deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
          25% { transform: translate(32px, -22px) rotate(30deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
          37.5% { transform: translate(11px, -35px) rotate(45deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
          50% { transform: translate(-10px, -48px) rotate(60deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
          62.5% { transform: translate(5px, -29px) rotate(75deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
          75% { transform: translate(20px, -10px) rotate(90deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
          87.5% { transform: translate(10px, -5px) rotate(105deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
          100% { transform: translate(0, 0) rotate(120deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
        }
        @keyframes starFloat6 {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
          12.5% { transform: translate(-14px, 11px) rotate(-15deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
          25% { transform: translate(-28px, 22px) rotate(-30deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
          37.5% { transform: translate(-3px, 35px) rotate(-45deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
          50% { transform: translate(22px, 48px) rotate(-60deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
          62.5% { transform: translate(31px, 16px) rotate(-75deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
          75% { transform: translate(40px, -15px) rotate(-90deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
          87.5% { transform: translate(20px, -7px) rotate(-105deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
          100% { transform: translate(0, 0) rotate(-120deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
        }

        /* === PARTÍCULAS === */
        .particles-container {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        .particle {
          position: absolute;
          width: 6px;
          height: 6px;
          background: #39FF14;
          border-radius: 50%;
          opacity: 0.3;
          box-shadow: 0 0 6px #39FF14;
        }
        @media (min-width: 768px) {
          .particle { width: 8px; height: 8px; opacity: 0.25; }
        }
        @media (min-width: 1024px) {
          .particle { width: 10px; height: 10px; opacity: 0.2; }
        }
        
        /* Tamaños variados */
        .particle-1, .particle-7, .particle-13, .particle-19, .particle-25 { width: 4px; height: 4px; }
        .particle-3, .particle-9, .particle-15, .particle-21, .particle-27 { width: 8px; height: 8px; }
        .particle-5, .particle-11, .particle-17, .particle-23, .particle-29 { width: 5px; height: 5px; }
        
        /* Colores variados */
        .particle-2, .particle-8, .particle-14, .particle-20, .particle-26 { background: #00ffcc; box-shadow: 0 0 6px #00ffcc; }
        .particle-4, .particle-10, .particle-16, .particle-22, .particle-28 { background: #88ff00; box-shadow: 0 0 6px #88ff00; }
        .particle-6, .particle-12, .particle-18, .particle-24, .particle-30 { background: #00ff88; box-shadow: 0 0 6px #00ff88; }
        
        /* Posiciones y animaciones suaves */
        .particle-1 { top: 5%; left: 8%; animation: float1 12s ease-in-out infinite, fade 3s ease-in-out infinite; }
        .particle-2 { top: 12%; right: 15%; animation: float2 14s ease-in-out infinite, fade 3.5s ease-in-out infinite 0.5s; }
        .particle-3 { top: 20%; left: 25%; animation: float3 11s ease-in-out infinite, fade 3s ease-in-out infinite 1s; }
        .particle-4 { top: 8%; right: 40%; animation: float4 13s ease-in-out infinite, fade 3.5s ease-in-out infinite 1.5s; }
        .particle-5 { top: 28%; left: 5%; animation: float5 15s ease-in-out infinite, fade 3s ease-in-out infinite 2s; }
        .particle-6 { top: 35%; right: 8%; animation: float6 12s ease-in-out infinite, fade 3.5s ease-in-out infinite 0.3s; }
        .particle-7 { top: 18%; left: 60%; animation: float1 14s ease-in-out infinite reverse, fade 3s ease-in-out infinite 0.8s; }
        .particle-8 { top: 42%; right: 25%; animation: float2 11s ease-in-out infinite reverse, fade 3.5s ease-in-out infinite 1.3s; }
        .particle-9 { top: 30%; left: 80%; animation: float3 13s ease-in-out infinite, fade 3s ease-in-out infinite 1.8s; }
        .particle-10 { top: 48%; left: 12%; animation: float4 15s ease-in-out infinite, fade 3.5s ease-in-out infinite 2.3s; }
        .particle-11 { top: 55%; right: 18%; animation: float5 12s ease-in-out infinite reverse, fade 3s ease-in-out infinite 0.2s; }
        .particle-12 { top: 38%; left: 45%; animation: float6 14s ease-in-out infinite reverse, fade 3.5s ease-in-out infinite 0.7s; }
        .particle-13 { top: 62%; left: 3%; animation: float1 11s ease-in-out infinite, fade 3s ease-in-out infinite 1.2s; }
        .particle-14 { top: 50%; right: 5%; animation: float2 13s ease-in-out infinite, fade 3.5s ease-in-out infinite 1.7s; }
        .particle-15 { top: 68%; left: 30%; animation: float3 15s ease-in-out infinite reverse, fade 3s ease-in-out infinite 2.2s; }
        .particle-16 { top: 58%; right: 35%; animation: float4 12s ease-in-out infinite reverse, fade 3.5s ease-in-out infinite 0.4s; }
        .particle-17 { top: 75%; left: 55%; animation: float5 14s ease-in-out infinite, fade 3s ease-in-out infinite 0.9s; }
        .particle-18 { top: 65%; right: 60%; animation: float6 11s ease-in-out infinite, fade 3.5s ease-in-out infinite 1.4s; }
        .particle-19 { top: 82%; left: 8%; animation: float1 13s ease-in-out infinite reverse, fade 3s ease-in-out infinite 1.9s; }
        .particle-20 { top: 72%; right: 12%; animation: float2 15s ease-in-out infinite reverse, fade 3.5s ease-in-out infinite 2.4s; }
        .particle-21 { top: 88%; left: 40%; animation: float3 12s ease-in-out infinite, fade 3s ease-in-out infinite 0.1s; }
        .particle-22 { top: 78%; right: 45%; animation: float4 14s ease-in-out infinite, fade 3.5s ease-in-out infinite 0.6s; }
        .particle-23 { top: 92%; left: 70%; animation: float5 11s ease-in-out infinite reverse, fade 3s ease-in-out infinite 1.1s; }
        .particle-24 { top: 85%; right: 70%; animation: float6 13s ease-in-out infinite reverse, fade 3.5s ease-in-out infinite 1.6s; }
        .particle-25 { top: 15%; left: 92%; animation: float1 15s ease-in-out infinite, fade 3s ease-in-out infinite 2.1s; }
        .particle-26 { top: 45%; right: 90%; animation: float2 12s ease-in-out infinite, fade 3.5s ease-in-out infinite 0.25s; }
        .particle-27 { top: 95%; left: 20%; animation: float3 14s ease-in-out infinite reverse, fade 3s ease-in-out infinite 0.75s; }
        .particle-28 { top: 25%; right: 85%; animation: float4 11s ease-in-out infinite reverse, fade 3.5s ease-in-out infinite 1.25s; }
        .particle-29 { top: 70%; left: 95%; animation: float5 13s ease-in-out infinite, fade 3s ease-in-out infinite 1.75s; }
        .particle-30 { top: 3%; right: 55%; animation: float6 15s ease-in-out infinite, fade 3.5s ease-in-out infinite 2.25s; }

        /* === ANIMACIONES DE FLOTACIÓN SUAVE CON REBOTE === */
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(40px, 30px); }
          50% { transform: translate(20px, 60px); }
          75% { transform: translate(-20px, 35px); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-35px, 45px); }
          50% { transform: translate(-15px, -25px); }
          75% { transform: translate(25px, 15px); }
        }
        @keyframes float3 {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(30px, -35px); }
          50% { transform: translate(55px, 20px); }
          75% { transform: translate(15px, 50px); }
        }
        @keyframes float4 {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-25px, -40px); }
          50% { transform: translate(20px, -20px); }
          75% { transform: translate(-40px, 10px); }
        }
        @keyframes float5 {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(35px, -25px); }
          50% { transform: translate(-10px, -50px); }
          75% { transform: translate(20px, -10px); }
        }
        @keyframes float6 {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-30px, 25px); }
          50% { transform: translate(25px, 55px); }
          75% { transform: translate(45px, -15px); }
        }
        
        /* Efecto de aparición/desaparición suave */
        @keyframes fade {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.4; }
        }

        /* === EFECTOS ADICIONALES === */
        @media (min-width: 768px) {
          .particle { width: 8px; height: 8px; opacity: 0.25; }
        }
        @media (min-width: 1024px) {
          .particle { width: 10px; height: 10px; opacity: 0.2; }
        }
      `}</style>

      {/* Modal de perfil del usuario */}
      {otherUser && (
        <UserProfileDialog
          isOpen={showUserProfile}
          onClose={() => setShowUserProfile(false)}
          profileUser={{
            id: otherUser.id,
            username: otherUser.username,
            displayName: otherUser.display_name || otherUser.username,
            avatar: otherUser.avatar_url || '',
            bio: '',
            is_verified: otherUser.is_verified,
            followers: 0,
            following: 0,
            posts: 0,
            email: '',
            createdAt: new Date().toISOString(),
          }}
        />
      )}
      
      {/* Visor de historias */}
      {showStoryViewer && selectedStoryId && (
        <div className="fixed inset-0 z-50">
          <StoriesSlider
            userStories={[]}
            currentUserId={userId}
            isOpen={showStoryViewer}
            onClose={() => {
              setShowStoryViewer(false);
              setSelectedStoryId(null);
            }}
            initialStoryId={selectedStoryId}
          />
        </div>
      )}
      
      {/* Diálogo para compartir mensaje */}
      <ShareMessageDialog
        isOpen={showShareDialog}
        onClose={() => {
          setShowShareDialog(false);
          setMessageToShare(null);
        }}
        message={messageToShare}
        currentChatId={chatId}
      />
    </div>
  );
}

// Componente para compartir mensajes con amigos
function ShareMessageDialog({ 
  isOpen, 
  onClose, 
  message, 
  currentChatId 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  message: Message | null;
  currentChatId: string;
}) {
  const [friends, setFriends] = useState<any[]>([]);
  const [chats, setChats] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [selectedChats, setSelectedChats] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      loadChatsAndFriends();
    }
  }, [isOpen]);

  const loadChatsAndFriends = async () => {
    try {
      setLoading(true);
      const chatsResponse = await messagingService.getChats();
      // Filtrar el chat actual
      const filteredChats = chatsResponse.results.filter(chat => chat.id !== currentChatId);
      setChats(filteredChats);
    } catch (error) {
      console.error('Error loading chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleChatSelection = (chatId: string) => {
    const newSelected = new Set(selectedChats);
    if (newSelected.has(chatId)) {
      newSelected.delete(chatId);
    } else {
      newSelected.add(chatId);
    }
    setSelectedChats(newSelected);
  };

  const handleShare = async () => {
    if (selectedChats.size === 0 || !message) return;
    
    setSending(true);
    try {
      let successCount = 0;
      let errorCount = 0;

      for (const chatId of Array.from(selectedChats)) {
        try {
          // Crear el mensaje compartido
          let shareContent = '';
          if (message.content) {
            shareContent = `📤 Mensaje compartido:\n\n"${message.content}"`;
          } else if (message.image) {
            shareContent = '📤 Imagen compartida';
          }
          
          await messagingService.sendMessage(chatId, shareContent);
          
          // Si hay imagen, enviarla también
          if (message.image) {
            // Aquí podrías implementar la lógica para reenviar la imagen
            // Por ahora solo enviamos el texto
          }
          
          successCount++;
        } catch (error) {
          console.error(`Error sharing to chat ${chatId}:`, error);
          errorCount++;
        }
      }

      if (successCount > 0) {
        toast({
          title: "Mensaje compartido",
          description: `Compartido con ${successCount} ${successCount === 1 ? 'chat' : 'chats'}`,
        });
      }

      if (errorCount > 0) {
        toast({
          title: "Algunos mensajes no se enviaron",
          description: `${errorCount} ${errorCount === 1 ? 'mensaje falló' : 'mensajes fallaron'}`,
          variant: "destructive",
        });
      }

      onClose();
      setSelectedChats(new Set());
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo compartir el mensaje",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const getChatDisplayName = (chat: ChatRoom) => {
    if (chat.name) return chat.name;
    if (chat.chat_type === 'private') {
      const currentUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {};
      const otherUser = chat.participants?.find(p => p.user.id !== currentUser?.id)?.user;
      return otherUser?.display_name || 'Usuario';
    }
    return 'Chat';
  };

  const getChatAvatar = (chat: ChatRoom) => {
    if (chat.avatar) return chat.avatar;
    if (chat.chat_type === 'private') {
      const currentUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {};
      const otherUser = chat.participants?.find(p => p.user.id !== currentUser?.id)?.user;
      return otherUser?.avatar_url || '';
    }
    return '';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Share2 className="w-5 h-5 text-neon-green" />
            Compartir mensaje
          </DialogTitle>
        </DialogHeader>

        {/* Vista previa del mensaje */}
        {message && (
          <div className="p-3 bg-white/5 rounded-lg border border-white/10 mb-4">
            <p className="text-xs text-gray-400 mb-2">Vista previa:</p>
            {message.content && (
              <p className="text-sm text-white line-clamp-3">{message.content}</p>
            )}
            {message.image && (
              <div className="mt-2">
                <img 
                  src={message.image} 
                  alt="Imagen" 
                  className="rounded-lg max-h-32 object-cover"
                />
              </div>
            )}
          </div>
        )}

        {/* Lista de chats */}
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-2 border-neon-green border-t-transparent rounded-full animate-spin" />
            </div>
          ) : chats.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>No hay chats disponibles</p>
              <p className="text-xs mt-2">Inicia una conversación primero</p>
            </div>
          ) : (
            chats.map(chat => (
              <button
                key={chat.id}
                onClick={() => toggleChatSelection(chat.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg transition-all",
                  selectedChats.has(chat.id)
                    ? "bg-neon-green/20 border-2 border-neon-green"
                    : "bg-white/5 border-2 border-transparent hover:bg-white/10"
                )}
              >
                <Avatar className="w-10 h-10 flex-shrink-0">
                  <AvatarImage src={getChatAvatar(chat)} />
                  <AvatarFallback className="bg-gradient-to-br from-neon-green to-emerald-600 text-white">
                    {getChatDisplayName(chat).charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left min-w-0">
                  <p className="font-medium text-white truncate">{getChatDisplayName(chat)}</p>
                  {chat.last_message && (
                    <p className="text-xs text-gray-400 truncate">{chat.last_message}</p>
                  )}
                </div>
                {selectedChats.has(chat.id) && (
                  <div className="w-5 h-5 rounded-full bg-neon-green flex items-center justify-center flex-shrink-0">
                    <CheckCheck className="w-3 h-3 text-black" />
                  </div>
                )}
              </button>
            ))
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex gap-2 mt-4">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 bg-white/5 border-white/10 text-white hover:bg-white/10"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleShare}
            disabled={selectedChats.size === 0 || sending}
            className={cn(
              "flex-1",
              selectedChats.size > 0
                ? "bg-gradient-to-r from-neon-green to-emerald-500 text-black hover:shadow-lg hover:shadow-neon-green/25"
                : "bg-gray-700 text-gray-400"
            )}
          >
            {sending ? (
              <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
            ) : (
              `Compartir ${selectedChats.size > 0 ? `(${selectedChats.size})` : ''}`
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
