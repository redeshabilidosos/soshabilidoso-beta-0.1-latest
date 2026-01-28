"use client";

import { useState, useEffect } from 'react';
import { MessageCircle, Search, Plus, Users, Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { messagingService, ChatRoom } from '@/lib/services/messaging.service';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface ChatListProps {
  onChatSelect: (chatId: string) => void;
  selectedChatId?: string;
  onNewChat?: () => void;
}

export function ChatList({ onChatSelect, selectedChatId, onNewChat }: ChatListProps) {
  const [chats, setChats] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      const response = await messagingService.getChats();
      setChats(response.results);
    } catch (error) {
      console.error('Error loading chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOtherParticipant = (chat: ChatRoom) => {
    if (chat.chat_type !== 'private') return null;
    const currentUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {};
    return chat.participants?.find(p => p.user.id !== currentUser?.id)?.user;
  };

  const getChatDisplayName = (chat: ChatRoom) => {
    if (chat.name) return chat.name;
    if (chat.chat_type === 'private') {
      const other = getOtherParticipant(chat);
      return other?.display_name || 'Usuario';
    }
    return 'Chat';
  };

  const getChatAvatar = (chat: ChatRoom) => {
    if (chat.avatar) return chat.avatar;
    if (chat.chat_type === 'private') {
      const other = getOtherParticipant(chat);
      return other?.avatar_url;
    }
    return undefined;
  };

  const formatLastActivity = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) return 'Ahora';
    if (diffInHours < 24) {
      return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    }
    return formatDistanceToNow(date, { addSuffix: false, locale: es });
  };

  const filteredChats = chats.filter(chat => {
    if (!searchQuery) return true;
    const displayName = getChatDisplayName(chat).toLowerCase();
    const otherUser = getOtherParticipant(chat);
    const username = otherUser?.username?.toLowerCase() || '';
    return displayName.includes(searchQuery.toLowerCase()) || username.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="h-full flex flex-col bg-black/20 backdrop-blur-sm">
      {/* Header mejorado */}
      <div className="p-4 border-b border-white/10 bg-black/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-green/20 to-emerald-500/10 flex items-center justify-center border border-neon-green/20">
              <MessageCircle className="w-5 h-5 text-neon-green" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Mensajes
                <Badge className="bg-neon-green/20 text-neon-green border-neon-green/30 text-[10px] px-1.5 py-0">
                  {chats.length}
                </Badge>
              </h2>
              <p className="text-xs text-gray-500">Tus conversaciones</p>
            </div>
          </div>
          {onNewChat && (
            <button
              onClick={onNewChat}
              className="p-2.5 bg-gradient-to-br from-neon-green/10 to-emerald-500/5 hover:from-neon-green/20 hover:to-emerald-500/10 rounded-xl transition-all text-neon-green border border-neon-green/20 hover:scale-105 active:scale-95 group"
              title="Nuevo chat"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            </button>
          )}
        </div>
        
        {/* Barra de búsqueda mejorada */}
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 group-focus-within:text-neon-green transition-colors" />
          <input
            placeholder="Buscar chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-green/50 focus:bg-white/10 focus:ring-2 focus:ring-neon-green/20 transition-all text-sm"
          />
        </div>
      </div>
      
      {/* Lista de chats */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative">
              <div className="w-12 h-12 border-3 border-neon-green/20 border-t-neon-green rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-neon-green/50" />
              </div>
            </div>
            <p className="text-gray-500 text-sm mt-4">Cargando chats...</p>
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            {chats.length === 0 ? (
              <Card className="bg-black/40 backdrop-blur-xl border-white/10 max-w-xs">
                <CardHeader className="text-center pb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neon-green/20 to-emerald-500/10 flex items-center justify-center mx-auto mb-4 border border-neon-green/20">
                    <Users className="w-8 h-8 text-neon-green" />
                  </div>
                  <CardTitle className="text-white text-lg">No tienes chats aún</CardTitle>
                  <CardDescription className="text-gray-400 text-sm">
                    Busca amigos y envíales un mensaje para comenzar
                  </CardDescription>
                </CardHeader>
                {onNewChat && (
                  <div className="px-6 pb-6">
                    <button
                      onClick={onNewChat}
                      className="w-full px-4 py-2.5 bg-gradient-to-r from-neon-green to-emerald-500 text-black rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-neon-green/25 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      Nuevo Chat
                    </button>
                  </div>
                )}
              </Card>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-3 border border-white/10">
                  <Search className="w-7 h-7 text-gray-600" />
                </div>
                <p className="text-gray-500 text-sm">No se encontraron chats</p>
                <p className="text-gray-600 text-xs mt-1">Intenta con otro término</p>
              </div>
            )}
          </div>
        ) : (
          <div className="py-2 space-y-1">
            {filteredChats.map((chat) => {
              const otherUser = getOtherParticipant(chat);
              const isSelected = selectedChatId === chat.id;
              const hasUnread = chat.unread_count && chat.unread_count > 0;
              
              return (
                <button
                  key={chat.id}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Chat clicked:', chat.id);
                    onChatSelect(chat.id);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-200 relative",
                    "focus:outline-none focus:ring-2 focus:ring-neon-green/50",
                    isSelected 
                      ? "bg-neon-green/10 border-l-4 border-neon-green" 
                      : "hover:bg-white/5 border-l-4 border-transparent active:bg-white/10"
                  )}
                >
                  {/* Avatar con indicador online */}
                  <div className="relative flex-shrink-0">
                    <Avatar className={cn(
                      "w-12 h-12 ring-2 transition-all",
                      isSelected ? "ring-neon-green/50" : "ring-transparent"
                    )}>
                      <AvatarImage src={getChatAvatar(chat)} alt={getChatDisplayName(chat)} />
                      <AvatarFallback className="bg-gradient-to-br from-neon-green/80 to-emerald-600 text-white font-semibold">
                        {getChatDisplayName(chat).charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Online indicator */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-black" />
                    
                    {/* Unread badge */}
                    {hasUnread && (
                      <div className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {chat.unread_count! > 99 ? '99+' : chat.unread_count}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Info del chat */}
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between mb-0.5">
                      <div className="flex items-center gap-1.5 min-w-0 flex-1">
                        <h3 className={cn(
                          "font-semibold text-sm truncate",
                          hasUnread ? "text-white" : "text-gray-200"
                        )}>
                          {getChatDisplayName(chat)}
                        </h3>
                        {otherUser?.account_type === 'enterprise' && (
                          <span className="text-xs flex-shrink-0" title="Empresa verificada">🏢</span>
                        )}
                        {otherUser?.is_verified && otherUser?.account_type !== 'enterprise' && (
                          <Badge className="bg-blue-500/20 text-blue-400 border-0 text-[10px] px-1 py-0 flex-shrink-0">✓</Badge>
                        )}
                      </div>
                      <span className={cn(
                        "text-xs flex-shrink-0 ml-2",
                        hasUnread ? "text-neon-green font-medium" : "text-gray-500"
                      )}>
                        {formatLastActivity(chat.last_activity)}
                      </span>
                    </div>
                    
                    {otherUser && (
                      <p className="text-xs text-gray-500 truncate">@{otherUser.username}</p>
                    )}
                    
                    {chat.last_message && (
                      <p className={cn(
                        "text-sm truncate mt-0.5",
                        hasUnread ? "text-gray-300 font-medium" : "text-gray-500"
                      )}>
                        {typeof chat.last_message === 'object' 
                          ? (chat.last_message.message_type === 'image' ? '📷 Imagen' : 
                             chat.last_message.message_type === 'video' ? '🎥 Video' :
                             chat.last_message.message_type === 'audio' ? '🎵 Audio' :
                             chat.last_message.message_type === 'story_reply' ? '📖 Respondió a tu historia' :
                             chat.last_message.content || '')
                          : chat.last_message}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
