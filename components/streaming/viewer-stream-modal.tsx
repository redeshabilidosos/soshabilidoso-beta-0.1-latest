'use client';

import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CyberButton } from '@/components/ui/cyber-button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Video, VideoOff, Mic, MicOff, Monitor, MonitorOff, 
  Users, Eye, Send, Heart, Gift, Share2, X, Play, Square,
  Camera, Settings, Gamepad2, Music, Palette, MessageSquare,
  ThumbsUp, Smile, Star, Zap, Crown
} from 'lucide-react';
import { toast } from 'sonner';

interface ViewerStreamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  user: string;
  avatar: string;
  message: string;
  timestamp: Date;
  type: 'message' | 'join' | 'gift' | 'reaction';
  giftType?: string;
}

const CATEGORIES = [
  { id: 'gaming', name: 'Gaming', icon: Gamepad2 },
  { id: 'music', name: 'Música', icon: Music },
  { id: 'art', name: 'Arte', icon: Palette },
  { id: 'chat', name: 'Just Chatting', icon: MessageSquare },
];

const MOCK_MESSAGES: ChatMessage[] = [
  { id: '1', user: 'GamerPro99', avatar: '/api/placeholder/32/32', message: '¡Hola a todos! 👋', timestamp: new Date(), type: 'message' },
  { id: '2', user: 'FutbolFan', avatar: '/api/placeholder/32/32', message: 'Excelente stream!', timestamp: new Date(), type: 'message' },
  { id: '3', user: 'MariaGamer', avatar: '/api/placeholder/32/32', message: '¿Qué juego es este?', timestamp: new Date(), type: 'message' },
];

const REACTIONS = [
  { emoji: '❤️', name: 'heart' },
  { emoji: '🔥', name: 'fire' },
  { emoji: '👏', name: 'clap' },
  { emoji: '😂', name: 'laugh' },
  { emoji: '🎉', name: 'party' },
  { emoji: '💎', name: 'diamond' },
];

export function ViewerStreamModal({ isOpen, onClose }: ViewerStreamModalProps) {
  const [step, setStep] = useState<'config' | 'streaming'>('config');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  
  // Config
  const [streamTitle, setStreamTitle] = useState('');
  const [streamDescription, setStreamDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('gaming');
  
  // Stream data
  const [streamId, setStreamId] = useState<string>('');
  const [streamUrl, setStreamUrl] = useState<string>('');
  const [viewerCount, setViewerCount] = useState(0);
  const [likes, setLikes] = useState(0);
  
  // Chat
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const [showReactions, setShowReactions] = useState(false);
  const [floatingReactions, setFloatingReactions] = useState<{id: string, emoji: string}[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && step === 'streaming') {
      initializeCamera();
    }
    return () => stopAllStreams();
  }, [isOpen, step]);

  // Simulate viewers and chat
  useEffect(() => {
    if (isStreaming) {
      const viewerInterval = setInterval(() => {
        setViewerCount(prev => Math.max(1, prev + Math.floor(Math.random() * 10) - 3));
      }, 3000);

      const chatInterval = setInterval(() => {
        if (Math.random() > 0.5) {
          const users = ['GamerPro99', 'FutbolFan', 'MariaGamer', 'StreamLover', 'CoolViewer', 'NightOwl'];
          const msgs = ['¡Increíble!', 'Sigue así 💪', '¿De dónde eres?', 'Jajaja 😂', 'Muy bueno!', 'Primera vez aquí', 'Saludos desde Colombia!'];
          const newMsg: ChatMessage = {
            id: Date.now().toString(),
            user: users[Math.floor(Math.random() * users.length)],
            avatar: '/api/placeholder/32/32',
            message: msgs[Math.floor(Math.random() * msgs.length)],
            timestamp: new Date(),
            type: 'message'
          };
          setMessages(prev => [...prev.slice(-50), newMsg]);
        }
      }, 4000);

      return () => {
        clearInterval(viewerInterval);
        clearInterval(chatInterval);
      };
    }
  }, [isStreaming]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (error) {
      toast.error('No se pudo acceder a la cámara');
    }
  };

  const stopAllStreams = () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
  };

  const startStream = () => {
    if (!streamTitle.trim()) {
      toast.error('Ingresa un título para el stream');
      return;
    }

    const newStreamId = `stream-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const url = `${window.location.origin}/live/${newStreamId}`;

    setStreamId(newStreamId);
    setStreamUrl(url);
    setStep('streaming');
    setIsStreaming(true);
    setViewerCount(Math.floor(Math.random() * 20) + 5);

    // Save to localStorage
    const streamData = {
      id: newStreamId,
      type: 'stream',
      title: streamTitle,
      description: streamDescription,
      category: selectedCategory,
      hostName: 'Usuario Actual',
      hostAvatar: '/api/placeholder/40/40',
      startedAt: new Date().toISOString(),
      isPrivate: false
    };

    const existingStreams = JSON.parse(localStorage.getItem('active_streams') || '[]');
    localStorage.setItem('active_streams', JSON.stringify([...existingStreams, streamData]));

    toast.success('¡Stream iniciado!');
  };

  const endStream = () => {
    setIsStreaming(false);
    stopAllStreams();
    
    const streams = JSON.parse(localStorage.getItem('active_streams') || '[]');
    localStorage.setItem('active_streams', JSON.stringify(streams.filter((s: any) => s.id !== streamId)));
    
    toast.success('Stream finalizado');
    onClose();
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const msg: ChatMessage = {
      id: Date.now().toString(),
      user: 'Tú (Host)',
      avatar: '/api/placeholder/32/32',
      message: newMessage,
      timestamp: new Date(),
      type: 'message'
    };
    setMessages(prev => [...prev, msg]);
    setNewMessage('');
  };

  const sendReaction = (emoji: string) => {
    const id = Date.now().toString();
    setFloatingReactions(prev => [...prev, { id, emoji }]);
    setLikes(prev => prev + 1);
    setTimeout(() => {
      setFloatingReactions(prev => prev.filter(r => r.id !== id));
    }, 2000);
  };

  const copyStreamUrl = () => {
    navigator.clipboard.writeText(streamUrl);
    toast.success('Enlace copiado');
  };

  const toggleVideo = () => {
    streamRef.current?.getVideoTracks().forEach(track => track.enabled = !isVideoEnabled);
    setIsVideoEnabled(!isVideoEnabled);
  };

  const toggleAudio = () => {
    streamRef.current?.getAudioTracks().forEach(track => track.enabled = !isAudioEnabled);
    setIsAudioEnabled(!isAudioEnabled);
  };

  const handleClose = () => {
    if (isStreaming) {
      if (confirm('¿Seguro que quieres finalizar el stream?')) endStream();
    } else {
      setStep('config');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className={`${step === 'streaming' ? 'max-w-6xl' : 'max-w-lg'} max-h-[95vh] overflow-hidden glass-card border-purple-500/20`}>
        <DialogHeader>
          <DialogTitle className="text-white flex items-center space-x-2">
            <Video className="text-purple-400" size={20} />
            <span>{step === 'config' ? 'Iniciar Streaming' : streamTitle}</span>
            {isStreaming && (
              <Badge className="bg-red-500 text-white ml-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-1" />
                EN VIVO
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        {step === 'config' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Título del stream *</label>
              <input
                type="text"
                value={streamTitle}
                onChange={(e) => setStreamTitle(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                placeholder="Ej: Jugando FIFA 24 - Road to Glory"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Descripción</label>
              <textarea
                value={streamDescription}
                onChange={(e) => setStreamDescription(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none resize-none"
                rows={2}
                placeholder="Cuéntale a tu audiencia de qué va el stream"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Categoría</label>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center space-x-2 p-3 rounded-lg border transition-all ${
                      selectedCategory === cat.id 
                        ? 'border-purple-500 bg-purple-500/20 text-purple-300' 
                        : 'border-gray-600 hover:border-gray-500 text-gray-300'
                    }`}
                  >
                    <cat.icon className="w-5 h-5" />
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <CyberButton variant="outline" onClick={onClose}>Cancelar</CyberButton>
              <CyberButton onClick={startStream} className="bg-purple-600 hover:bg-purple-700">
                <Play className="w-4 h-4 mr-1" />
                Iniciar Stream
              </CyberButton>
            </div>
          </div>
        ) : (
          /* Streaming View */
          <div className="flex gap-4 h-[70vh]">
            {/* Main Video */}
            <div className="flex-1 flex flex-col">
              <div className="relative bg-black rounded-lg overflow-hidden flex-1">
                <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                {!isVideoEnabled && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                    <Avatar className="w-32 h-32">
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-4xl">TÚ</AvatarFallback>
                    </Avatar>
                  </div>
                )}
                
                {/* Floating Reactions */}
                <div className="absolute bottom-20 right-4 pointer-events-none">
                  {floatingReactions.map(r => (
                    <div key={r.id} className="animate-bounce text-3xl" style={{ animation: 'floatUp 2s ease-out forwards' }}>
                      {r.emoji}
                    </div>
                  ))}
                </div>

                {/* Stats Overlay */}
                <div className="absolute top-4 left-4 flex items-center space-x-3">
                  <Badge className="bg-red-500 text-white">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-1" />
                    EN VIVO
                  </Badge>
                  <Badge className="bg-black/70 text-white">
                    <Eye className="w-3 h-3 mr-1" />
                    {viewerCount}
                  </Badge>
                  <Badge className="bg-black/70 text-white">
                    <Heart className="w-3 h-3 mr-1 text-red-400" />
                    {likes}
                  </Badge>
                </div>

                {/* Share URL */}
                <div className="absolute top-4 right-4">
                  <CyberButton size="sm" variant="outline" onClick={copyStreamUrl} className="bg-black/50">
                    <Share2 className="w-4 h-4 mr-1" />
                    Compartir
                  </CyberButton>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center space-x-3 pt-3">
                <CyberButton onClick={toggleAudio} className={`p-3 rounded-full ${!isAudioEnabled ? 'bg-red-600' : 'bg-gray-700'}`}>
                  {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </CyberButton>
                <CyberButton onClick={toggleVideo} className={`p-3 rounded-full ${!isVideoEnabled ? 'bg-red-600' : 'bg-gray-700'}`}>
                  {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </CyberButton>
                <CyberButton onClick={() => setIsScreenSharing(!isScreenSharing)} className={`p-3 rounded-full ${isScreenSharing ? 'bg-purple-600' : 'bg-gray-700'}`}>
                  {isScreenSharing ? <MonitorOff className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
                </CyberButton>
                <CyberButton onClick={endStream} className="p-3 rounded-full bg-red-600 hover:bg-red-700">
                  <Square className="w-5 h-5" />
                </CyberButton>
              </div>
            </div>

            {/* Chat Panel */}
            <div className="w-80 flex flex-col bg-gray-900/50 rounded-lg border border-gray-700">
              <div className="p-3 border-b border-gray-700 flex items-center justify-between">
                <h4 className="text-white font-medium flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Chat en vivo
                </h4>
                <Badge variant="outline" className="text-xs">
                  <Users className="w-3 h-3 mr-1" />
                  {viewerCount}
                </Badge>
              </div>

              {/* Messages */}
              <div ref={chatRef} className="flex-1 overflow-y-auto p-3 space-y-2">
                {messages.map(msg => (
                  <div key={msg.id} className="flex items-start space-x-2">
                    <Avatar className="w-6 h-6 flex-shrink-0">
                      <AvatarImage src={msg.avatar} />
                      <AvatarFallback className="text-xs">{msg.user.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <span className={`text-xs font-medium ${msg.user.includes('Host') ? 'text-purple-400' : 'text-neon-green'}`}>
                        {msg.user}
                      </span>
                      <p className="text-gray-300 text-sm break-words">{msg.message}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reactions */}
              <div className="p-2 border-t border-gray-700 flex items-center justify-center space-x-1">
                {REACTIONS.map(r => (
                  <button
                    key={r.name}
                    onClick={() => sendReaction(r.emoji)}
                    className="p-2 hover:bg-gray-700 rounded-full transition-colors text-lg"
                  >
                    {r.emoji}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="p-2 border-t border-gray-700">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:border-purple-500 focus:outline-none"
                    placeholder="Escribe un mensaje..."
                  />
                  <CyberButton size="sm" onClick={sendMessage} className="bg-purple-600">
                    <Send className="w-4 h-4" />
                  </CyberButton>
                </div>
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          @keyframes floatUp {
            0% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-100px); }
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}
