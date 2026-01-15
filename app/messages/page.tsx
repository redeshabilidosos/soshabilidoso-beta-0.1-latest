"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/providers/providers';
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';
import { ChatList } from '@/components/messaging/chat-list';
import { ChatWindow } from '@/components/messaging/chat-window';
import { FriendsList } from '@/components/messaging/friends-list';
import { messagingService } from '@/lib/services/messaging.service';
import { User } from '@/lib/services/users.service';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, ArrowLeft, Users, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MessagesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [showNewChat, setShowNewChat] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const userParam = searchParams.get('user');
    if (userParam) handleCreateChatWithUser(userParam);
  }, [searchParams]);

  if (!user) {
    router.push('/login');
    return null;
  }

  const handleCreateChatWithUser = async (username: string) => {
    try {
      const response = await messagingService.createOrGetChat(username);
      setSelectedChatId(response.chat.id);
      setShowNewChat(false);
      setRefreshKey(prev => prev + 1);
      if (response.created) {
        toast({ title: "Éxito", description: "Chat creado exitosamente" });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleUserSelect = (selectedUser: User) => handleCreateChatWithUser(selectedUser.username);
  const handleChatSelect = (chatId: string) => { setSelectedChatId(chatId); setShowNewChat(false); };
  const handleBack = () => { if (showNewChat) setShowNewChat(false); else setSelectedChatId(null); };

  // Vista móvil
  if (isMobile) {
    return (
      <AuthenticatedLayout>
        <div className="h-[calc(100dvh-6rem)] flex flex-col">
          {selectedChatId ? (
            <ChatWindow chatId={selectedChatId} onBack={handleBack} />
          ) : showNewChat ? (
            <div className="h-full flex flex-col bg-black/20 backdrop-blur-sm">
              <div className="p-4 border-b border-white/10 flex items-center gap-3">
                <button onClick={handleBack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <ArrowLeft className="w-5 h-5 text-white" />
                </button>
                <h2 className="text-lg font-semibold text-white">Nuevo Chat</h2>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <FriendsList onFriendSelect={handleUserSelect} />
              </div>
            </div>
          ) : (
            <ChatList
              key={refreshKey}
              onChatSelect={handleChatSelect}
              selectedChatId={selectedChatId || undefined}
              onNewChat={() => setShowNewChat(true)}
            />
          )}
        </div>
      </AuthenticatedLayout>
    );
  }

  // Vista desktop
  return (
    <AuthenticatedLayout>
      <div className="h-screen flex">
        {/* Lista de chats - Sidebar izquierdo */}
        <div className="w-80 xl:w-96 border-r border-white/10 flex-shrink-0">
          {showNewChat ? (
            <div className="h-full flex flex-col bg-black/20 backdrop-blur-sm">
              <div className="p-4 border-b border-white/10 flex items-center gap-3">
                <button onClick={() => setShowNewChat(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <ArrowLeft className="w-5 h-5 text-white" />
                </button>
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-neon-green" />
                  Nuevo Chat
                </h2>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <FriendsList onFriendSelect={handleUserSelect} />
              </div>
            </div>
          ) : (
            <ChatList
              key={refreshKey}
              onChatSelect={handleChatSelect}
              selectedChatId={selectedChatId || undefined}
              onNewChat={() => setShowNewChat(true)}
            />
          )}
        </div>

        {/* Ventana de chat - Área principal */}
        <div className="flex-1 relative">
          {selectedChatId ? (
            <ChatWindow chatId={selectedChatId} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center relative">
              {/* Fondo de partículas */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="stars"></div>
                <div className="stars2"></div>
                <div className="stars3"></div>
              </div>
              
              <div className="relative z-10 text-center px-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-neon-green/20 to-emerald-500/10 flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-neon-green/20">
                  <MessageSquare className="w-12 h-12 text-neon-green" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">
                  Tus mensajes
                </h2>
                <p className="text-gray-400 mb-8 max-w-sm">
                  Selecciona una conversación o inicia un nuevo chat con tus amigos
                </p>
                <button
                  onClick={() => setShowNewChat(true)}
                  className="px-6 py-3 bg-gradient-to-r from-neon-green to-emerald-500 text-black font-semibold rounded-full hover:shadow-lg hover:shadow-neon-green/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto"
                >
                  <Sparkles className="w-5 h-5" />
                  Nuevo Chat
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
