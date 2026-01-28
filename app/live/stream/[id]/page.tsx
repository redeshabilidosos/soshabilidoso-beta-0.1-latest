'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CyberpunkStreamOverlay } from '@/components/streaming/cyberpunk-stream-overlay';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  MessageSquare, Send, Users, Maximize, ArrowLeft,
  Gift, Heart, Star, Zap, Crown, Sparkles, Clock, Radio, Smile, ChevronLeft, ChevronRight,
  Video, VideoOff, Mic, MicOff, Settings, Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
  isStreamer?: boolean;
}

interface Gift {
  id: string;
  name: string;
  icon: any;
  price: number;
  color: string;
}

const GIFTS: Gift[] = [
  { id: '1', name: 'Corazón', icon: Heart, price: 1, color: 'text-pink-400' },
  { id: '2', name: 'Estrella', icon: Star, price: 5, color: 'text-yellow-400' },
  { id: '3', name: 'Rayo', icon: Zap, price: 10, color: 'text-purple-400' },
  { id: '4', name: 'Corona', icon: Crown, price: 25, color: 'text-amber-400' },
  { id: '5', name: 'Diamante', icon: Sparkles, price: 50, color: 'text-cyan-400' },
  { id: '6', name: 'Regalo', icon: Gift, price: 100, color: 'text-green-400' },
];

export default function StreamViewPage() {
  const params = useParams();
  const router = useRouter();
  const streamId = params.id as string;
  
  const [stream, setStream] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [viewers, setViewers] = useState(37);
  const [streamDuration, setStreamDuration] = useState('0:00');
  const [giftAnimation, setGiftAnimation] = useState<{ gift: Gift; show: boolean } | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showGifts, setShowGifts] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [mirrorVideo, setMirrorVideo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const giftsScrollRef = useRef<HTMLDivElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    loadStream();
    initializeCamera();
    
    const chatInterval = setInterval(() => {
      const mockMessages = [
        'Excelente stream!',
        'Cuando es la proxima clase?',
        'Muy buena explicacion',
        'Gracias por compartir',
        'Saludos desde Colombia!',
      ];
      
      const newMsg: ChatMessage = {
        id: Date.now().toString(),
        username: `Usuario${Math.floor(Math.random() * 1000)}`,
        message: mockMessages[Math.floor(Math.random() * mockMessages.length)],
        timestamp: new Date(),
      };
      
      setChatMessages(prev => [...prev, newMsg].slice(-50));
    }, 5000);

    const viewersInterval = setInterval(() => {
      setViewers(prev => Math.max(1, prev + Math.floor(Math.random() * 5) - 2));
    }, 10000);

    let seconds = 0;
    const durationInterval = setInterval(() => {
      seconds++;
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      setStreamDuration(hours > 0 ? `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}` : `${minutes}:${secs.toString().padStart(2, '0')}`);
    }, 1000);

    return () => {
      clearInterval(chatInterval);
      clearInterval(viewersInterval);
      clearInterval(durationInterval);
      stopCamera();
    };
  }, [streamId]);

  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: 'user'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      localStreamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
      }
      
      setIsLoading(false);
      toast.success('Cámara y micrófono activados');
    } catch (error: any) {
      console.error('Error accessing camera:', error);
      setIsLoading(false);
      
      if (error.name === 'NotAllowedError') {
        toast.error('Permisos denegados. Permite el acceso a la cámara y micrófono.');
      } else if (error.name === 'NotFoundError') {
        toast.error('No se encontró cámara o micrófono.');
      } else {
        toast.error('Error al acceder a la cámara.');
      }
    }
  };

  const stopCamera = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const loadStream = () => {
    const activeStreams = JSON.parse(localStorage.getItem('active_streams') || '[]');
    const foundStream = activeStreams.find((s: any) => s.id === streamId);
    
    if (foundStream) {
      setStream(foundStream);
    } else {
      toast.error('Stream no encontrado');
      router.push('/live');
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsCameraOn(!isCameraOn);
      toast.info(isCameraOn ? 'Cámara desactivada' : 'Cámara activada');
    }
  };

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMicOn(!isMicOn);
      toast.info(isMicOn ? 'Micrófono desactivado' : 'Micrófono activado');
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      username: 'Tú',
      message: newMessage,
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, message]);
    setNewMessage('');
    setShowEmojiPicker(false);
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setNewMessage(prev => prev + emojiData.emoji);
  };

  const scrollGifts = (direction: 'left' | 'right') => {
    if (giftsScrollRef.current) {
      const scrollAmount = 200;
      const newPosition = direction === 'left' 
        ? scrollPosition - scrollAmount 
        : scrollPosition + scrollAmount;
      
      giftsScrollRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      setScrollPosition(newPosition);
    }
  };

  const handleSendGift = async (gift: Gift) => {
    try {
      setGiftAnimation({ gift, show: true });
      toast.success(`¡Enviaste ${gift.name} por $${gift.price}!`);
      
      const giftMessage: ChatMessage = {
        id: Date.now().toString(),
        username: 'Tú',
        message: `🎁 Envió ${gift.name}`,
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, giftMessage]);
      
      setTimeout(() => {
        setGiftAnimation(null);
      }, 3000);
    } catch (error) {
      toast.error('Error al enviar regalo');
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleExitStream = () => {
    setShowExitDialog(false);
    router.push('/live');
  };

  if (!stream) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-primary mx-auto animate-spin" />
          <p className="text-muted-foreground">Cargando stream...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Exit Dialog */}
      <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-red-500/10">
                <ArrowLeft className="w-5 h-5 text-red-500" />
              </div>
              ¿Salir del stream?
            </DialogTitle>
            <DialogDescription>
              Si sales ahora, dejarás de ver la transmisión en vivo
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowExitDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleExitStream}>
              Salir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-primary/10">
                <Settings className="w-5 h-5 text-primary" />
              </div>
              Configuración del Stream
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Mirror Video Toggle */}
            <Card className="rounded-xl">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Efecto Espejo</h4>
                  <p className="text-sm text-muted-foreground">Voltear video horizontalmente</p>
                </div>
                <Button
                  variant={mirrorVideo ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMirrorVideo(!mirrorVideo)}
                >
                  {mirrorVideo ? 'Activado' : 'Desactivado'}
                </Button>
              </CardContent>
            </Card>

            {/* Quality Settings */}
            <Card className="rounded-xl">
              <CardContent className="p-4 space-y-2">
                <h4 className="font-semibold mb-3">Calidad de Video</h4>
                {['720p', '1080p', 'Auto'].map((quality) => (
                  <Button
                    key={quality}
                    variant="outline"
                    className="w-full justify-start"
                    size="sm"
                  >
                    {quality}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          <DialogFooter>
            <Button onClick={() => setShowSettings(false)} className="w-full">
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Overlay Cyberpunk */}
      <CyberpunkStreamOverlay 
        streamerName={stream.hostName || 'Streamer'}
        viewers={viewers}
        isLive={true}
      />

      {/* Gift Animation */}
      {giftAnimation && giftAnimation.show && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none animate-in fade-in zoom-in duration-300 px-4">
          <Card className="rounded-2xl border-2 border-primary shadow-2xl shadow-primary/20 max-w-sm">
            <CardContent className="p-6 md:p-8 text-center space-y-4">
              {React.createElement(giftAnimation.gift.icon, {
                className: `w-16 h-16 md:w-24 md:h-24 ${giftAnimation.gift.color} animate-pulse mx-auto`
              })}
              <div>
                <div className="text-primary text-lg md:text-2xl font-bold">
                  ¡REGALO ENVIADO!
                </div>
                <div className="text-2xl md:text-3xl font-bold mt-2">
                  {giftAnimation.gift.name}
                </div>
                <div className="text-green-500 text-3xl md:text-4xl font-bold mt-2">
                  ${giftAnimation.gift.price}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row h-screen overflow-hidden fixed inset-0">
        {/* Video Area */}
        <div className="flex-1 relative flex flex-col min-h-0 overflow-hidden">
          {/* Video Container */}
          <div className="relative flex-1 bg-black overflow-hidden">
            {/* Video with Neon Corners */}
            <div className="relative h-full w-full p-4 md:p-6 lg:p-8">
              {/* Decorative Neon Corners */}
              <div className="absolute top-4 left-4 md:top-6 md:left-6 lg:top-8 lg:left-8 w-12 h-12 md:w-16 md:h-16 border-t-4 border-l-4 border-primary pointer-events-none z-20" />
              <div className="absolute top-4 right-4 md:top-6 md:right-6 lg:top-8 lg:right-8 w-12 h-12 md:w-16 md:h-16 border-t-4 border-r-4 border-primary pointer-events-none z-20" />
              <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 lg:bottom-8 lg:left-8 w-12 h-12 md:w-16 md:h-16 border-b-4 border-l-4 border-primary pointer-events-none z-20" />
              <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 lg:bottom-8 lg:right-8 w-12 h-12 md:w-16 md:h-16 border-b-4 border-r-4 border-primary pointer-events-none z-20" />
              
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
                  <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 text-primary mx-auto animate-spin" />
                    <p className="text-muted-foreground">Activando camara...</p>
                  </div>
                </div>
              )}
              
              <video
                ref={videoRef}
                className="w-full h-full object-cover rounded-lg"
                autoPlay
                muted
                playsInline
                style={{ transform: mirrorVideo ? 'scaleX(-1)' : 'none' }}
              />

              {/* Live Badge */}
              <div className="absolute top-3 right-3 md:top-6 md:right-6 z-30">
                <Card className="rounded-xl border-red-500 bg-gradient-to-r from-red-600 to-pink-600">
                  <CardContent className="p-2 md:p-3 flex items-center gap-2 md:gap-3">
                    <div className="flex items-center gap-1 md:gap-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      <span className="text-white font-bold text-xs md:text-sm">LIVE</span>
                    </div>
                    <Separator orientation="vertical" className="h-4 bg-white/30" />
                    <div className="flex items-center gap-1 text-white text-xs md:text-sm">
                      <Users className="w-3 h-3 md:w-4 md:h-4" />
                      <span className="font-semibold">{viewers}</span>
                    </div>
                    <Separator orientation="vertical" className="h-4 bg-white/30" />
                    <div className="flex items-center gap-1 text-white text-xs md:text-sm">
                      <Clock className="w-3 h-3 md:w-4 md:h-4" />
                      <span className="font-semibold">{streamDuration}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Controls */}
              <div className="absolute bottom-3 md:bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-2 md:gap-3 z-30">
                <Button
                  size="icon"
                  variant={isCameraOn ? "default" : "destructive"}
                  onClick={toggleVideo}
                  className="rounded-xl"
                >
                  {isCameraOn ? (
                    <Video className="w-4 h-4 md:w-5 md:h-5" />
                  ) : (
                    <VideoOff className="w-4 h-4 md:w-5 md:h-5" />
                  )}
                </Button>
                
                <Button
                  size="icon"
                  variant={isMicOn ? "default" : "destructive"}
                  onClick={toggleAudio}
                  className="rounded-xl"
                >
                  {isMicOn ? (
                    <Mic className="w-4 h-4 md:w-5 md:h-5" />
                  ) : (
                    <MicOff className="w-4 h-4 md:w-5 md:h-5" />
                  )}
                </Button>

                <Button
                  size="icon"
                  variant="outline"
                  onClick={toggleFullscreen}
                  className="rounded-xl"
                >
                  <Maximize className="w-4 h-4 md:w-5 md:h-5" />
                </Button>

                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => setShowSettings(true)}
                  className="rounded-xl"
                >
                  <Settings className="w-4 h-4 md:w-5 md:h-5" />
                </Button>

                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => setShowExitDialog(true)}
                  className="rounded-xl"
                >
                  <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Gifts Panel - Fixed at bottom of video area */}
          <div className="fixed bottom-0 left-0 right-0 lg:right-96 z-40">
            <div className="relative">
              {/* Expandable Gifts - Positioned above the button */}
              <div 
                className={`absolute bottom-full left-0 right-0 transition-all duration-300 ${
                  showGifts ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'
                }`}
              >
                <div className="p-4 relative bg-background/95 backdrop-blur-sm border-t-2 border-primary/30">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => scrollGifts('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex rounded-full"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>

                  <div 
                    ref={giftsScrollRef}
                    className="flex gap-3 md:gap-4 overflow-x-auto px-4 md:px-12 py-2"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {GIFTS.map((gift) => {
                      const IconComponent = gift.icon;
                      return (
                        <Button
                          key={gift.id}
                          variant="outline"
                          onClick={() => handleSendGift(gift)}
                          className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-xl flex-col gap-1 hover:scale-110 transition-transform group relative"
                        >
                          <IconComponent className={`w-8 h-8 md:w-10 md:h-10 ${gift.color} group-hover:animate-pulse`} />
                          <span className="text-xs md:text-sm font-bold">${gift.price}</span>
                          
                          {/* Tooltip */}
                          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                            {gift.name}
                          </div>
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => scrollGifts('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex rounded-full"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              
              {/* Toggle Button */}
              <Card className="rounded-none lg:rounded-tl-2xl border-t-2 border-primary/30">
                <CardContent className="p-0">
                  <Button
                    variant="ghost"
                    onClick={() => setShowGifts(!showGifts)}
                    className="w-full p-4 md:p-6 rounded-none hover:bg-primary/5 flex items-center justify-center gap-2"
                  >
                    <Gift className={`w-5 h-5 md:w-6 md:h-6 text-primary transition-transform ${showGifts ? 'rotate-0' : 'rotate-12'}`} />
                    <span className="font-bold text-base md:text-lg">Apoya al Streamer</span>
                    <svg 
                      className={`w-5 h-5 text-primary transition-transform ${showGifts ? 'rotate-0' : 'rotate-180'}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    <Badge variant="secondary">{GIFTS.length}</Badge>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Chat Panel */}
        <Card className="w-full lg:w-96 rounded-none lg:rounded-tr-2xl border-t-2 lg:border-t-0 lg:border-l-2 border-primary/30 flex flex-col h-96 lg:h-full overflow-hidden">
          <CardContent className="p-0 flex flex-col h-full overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 border-b border-border flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  <h3 className="font-bold">Chat en Vivo</h3>
                </div>
                <div className="flex items-center gap-2 text-primary text-sm">
                  <Radio className="w-4 h-4 animate-pulse" />
                  <span>{chatMessages.length}</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="animate-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-start gap-2">
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-xs">
                          {msg.username.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-semibold truncate ${msg.isStreamer ? 'text-primary' : ''}`}>
                            {msg.username}
                          </span>
                          <span className="text-xs text-muted-foreground flex-shrink-0">
                            {msg.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-sm mt-1 break-words">{msg.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
            </ScrollArea>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-border flex-shrink-0 relative">
              {showEmojiPicker && (
                <div className="absolute bottom-full right-4 mb-2 z-50">
                  <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    width={300}
                    height={400}
                    searchPlaceholder="Buscar emoji..."
                    previewConfig={{ showPreview: false }}
                  />
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="rounded-xl flex-shrink-0"
                >
                  <Smile className="w-5 h-5" />
                </Button>

                <Input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Escribe un mensaje..."
                  className="flex-1 rounded-xl"
                />
                
                <Button
                  type="submit"
                  size="icon"
                  className="rounded-xl flex-shrink-0"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
