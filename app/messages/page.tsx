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
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, ArrowLeft, Users, Sparkles, MessageCircle } from 'lucide-react';
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
        <div id="messages-page" className="h-[calc(100dvh-6rem)] flex flex-col">
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
      <div id="messages-page" className="h-screen flex">
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
        <div className="flex-1 relative bg-black">
          {selectedChatId ? (
            <ChatWindow chatId={selectedChatId} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center relative overflow-hidden p-6">
              {/* Fondo de estrellas animadas - igual que el chat */}
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
              
              <Card className="relative z-10 bg-black/40 backdrop-blur-xl border-white/10 max-w-md w-full">
                <CardContent className="pt-8 pb-8 text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-neon-green/20 to-emerald-500/10 flex items-center justify-center mx-auto mb-5 backdrop-blur-sm border border-neon-green/20 shadow-lg shadow-neon-green/10">
                    <MessageCircle className="w-10 h-10 text-neon-green" />
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <h2 className="text-2xl font-bold text-white">
                      Tus mensajes
                    </h2>
                    <Badge className="bg-neon-green/20 text-neon-green border-neon-green/30 text-xs">
                      Activo
                    </Badge>
                  </div>
                  
                  <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                    Selecciona una conversación de la lista o inicia un nuevo chat con tus amigos
                  </p>
                  
                  <button
                    onClick={() => setShowNewChat(true)}
                    className="px-6 py-3 bg-gradient-to-r from-neon-green to-emerald-500 text-black font-semibold rounded-full hover:shadow-lg hover:shadow-neon-green/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto group"
                  >
                    <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    Nuevo Chat
                  </button>
                  
                  {/* Consejos rápidos */}
                  <div className="mt-6 pt-6 border-t border-white/10 space-y-2">
                    <p className="text-xs text-gray-500 font-medium mb-3">Consejos rápidos</p>
                    <div className="flex items-start gap-2 text-left">
                      <div className="w-1.5 h-1.5 rounded-full bg-neon-green/50 mt-1.5 flex-shrink-0" />
                      <p className="text-xs text-gray-400">Personaliza el color de tus burbujas de mensaje</p>
                    </div>
                    <div className="flex items-start gap-2 text-left">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50 mt-1.5 flex-shrink-0" />
                      <p className="text-xs text-gray-400">Cambia el fondo del chat con estrellas, corazones o partículas</p>
                    </div>
                    <div className="flex items-start gap-2 text-left">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500/50 mt-1.5 flex-shrink-0" />
                      <p className="text-xs text-gray-400">Reacciona a mensajes con doble clic</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

// Estilos CSS para las estrellas animadas
const styles = `
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
  /* Tamaños variados */
  .star-1, .star-6, .star-11, .star-16 { font-size: 10px; }
  .star-3, .star-8, .star-13, .star-18 { font-size: 18px; }
  .star-5, .star-10, .star-15, .star-20 { font-size: 12px; }
  /* Colores variados */
  .star-2, .star-7, .star-12, .star-17 { color: #ffec8b; text-shadow: 0 0 8px #ffec8b; }
  .star-4, .star-9, .star-14, .star-19 { color: #fff8dc; text-shadow: 0 0 8px #fff8dc; }
  /* Posiciones y animaciones */
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
`;

// Inyectar estilos
if (typeof document !== 'undefined') {
  const styleElement = document.getElementById('messages-stars-styles');
  if (!styleElement) {
    const style = document.createElement('style');
    style.id = 'messages-stars-styles';
    style.textContent = styles;
    document.head.appendChild(style);
  }
}
