'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Mic, MicOff, Video, VideoOff, PhoneOff, Users, 
  MessageSquare, Settings, MoreVertical, Monitor, 
  Hand, Grid3x3, Maximize2, Send, X, Copy, Share2, Link2
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { MeetingInfoModal } from '@/components/live/meeting-info-modal';

interface Participant {
  id: string;
  name: string;
  avatar?: string;
  isMuted: boolean;
  isVideoOff: boolean;
  isHandRaised: boolean;
  isSpeaking: boolean;
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
}

export default function MeetingRoomPage() {
  const params = useParams();
  const router = useRouter();
  const meetingId = params.id as string;
  
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(true);
  const [chatMessage, setChatMessage] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'speaker'>('grid');
  
  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: '1',
      name: 'Tú',
      isMuted: false,
      isVideoOff: false,
      isHandRaised: false,
      isSpeaking: false,
    },
    // Participantes de ejemplo
    ...Array.from({ length: 5 }, (_, i) => ({
      id: `${i + 2}`,
      name: `Participante ${i + 1}`,
      isMuted: Math.random() > 0.5,
      isVideoOff: Math.random() > 0.7,
      isHandRaised: false,
      isSpeaking: Math.random() > 0.8,
    })),
  ]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      userId: '2',
      userName: 'Participante 1',
      message: '¡Hola a todos!',
      timestamp: new Date(),
    },
  ]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // Inicializar cámara al montar el componente
    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user'
          }, 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });
        
        streamRef.current = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Asegurar que el video se reproduzca
          videoRef.current.play().catch(err => {
            console.error('Error playing video:', err);
          });
        }
        
        console.log('Cámara inicializada correctamente');
      } catch (error) {
        console.error('Error accessing camera:', error);
        toast.error('No se pudo acceder a la cámara. Verifica los permisos.');
      }
    };

    setupCamera();
    
    return () => {
      // Limpiar stream al desmontar
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          track.stop();
          console.log('Track stopped:', track.kind);
        });
      }
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(track => {
        track.enabled = isMuted; // Invertido porque el estado cambiará
      });
    }
  };

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach(track => {
        track.enabled = isVideoOff; // Invertido porque el estado cambiará
      });
    }
  };

  const handleLeave = () => {
    if (confirm('¿Estás seguro de que quieres salir de la reunión?')) {
      router.push('/live');
    }
  };

  const sendMessage = () => {
    if (!chatMessage.trim()) return;
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: '1',
      userName: 'Tú',
      message: chatMessage,
      timestamp: new Date(),
    };
    
    setChatMessages([...chatMessages, newMessage]);
    setChatMessage('');
  };

  const copyMeetingLink = () => {
    const meetingLink = `${window.location.origin}/live/meeting/${meetingId}`;
    navigator.clipboard.writeText(meetingLink);
    toast.success('Enlace copiado al portapapeles');
  };

  const shareMeetingInfo = () => {
    const meetingLink = `${window.location.origin}/live/meeting/${meetingId}`;
    const shareText = `Únete a mi reunión virtual:\n\nID: ${meetingId}\nEnlace: ${meetingLink}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Reunión Virtual',
        text: shareText,
      }).catch(() => {
        // Si falla, copiar al portapapeles
        navigator.clipboard.writeText(shareText);
        toast.success('Información copiada al portapapeles');
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('Información copiada al portapapeles');
    }
  };

  const getGridCols = (count: number) => {
    if (count === 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-1 md:grid-cols-2';
    if (count <= 4) return 'grid-cols-2';
    if (count <= 6) return 'grid-cols-2 md:grid-cols-3';
    if (count <= 9) return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-3';
    return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      {/* Header */}
      <div className="h-16 bg-gray-900/95 backdrop-blur-xl border-b border-gray-800 flex items-center justify-between px-4 z-10">
        <div className="flex items-center gap-3">
          <Badge className="bg-green-500 text-white">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-2" />
            En Vivo
          </Badge>
          <div className="hidden md:flex items-center gap-2">
            <span className="text-sm font-medium">
              Reunión Virtual
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyMeetingLink}
              className="h-7 px-2 text-xs font-mono hover:bg-blue-500/10 hover:text-blue-400"
            >
              <Link2 className="w-3 h-3 mr-1" />
              ID: {meetingId}
            </Button>
          </div>
          <span className="text-xs text-muted-foreground hidden lg:inline">
            {participants.length} participantes
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={shareMeetingInfo}
            className="hidden sm:flex bg-blue-500/10 hover:bg-blue-500/20 text-blue-400"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Compartir
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewMode(viewMode === 'grid' ? 'speaker' : 'grid')}
            className="hidden md:flex"
          >
            {viewMode === 'grid' ? <Maximize2 className="w-4 h-4" /> : <Grid3x3 className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowParticipants(!showParticipants)}
          >
            <Users className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowChat(!showChat)}
          >
            <MessageSquare className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Grid */}
        <div className="flex-1 p-2 md:p-4 overflow-auto">
          <div className={cn(
            'grid gap-2 md:gap-4 h-full',
            getGridCols(participants.length)
          )}>
            {participants.map((participant, index) => (
              <Card 
                key={participant.id}
                className={cn(
                  'relative overflow-hidden bg-gray-900 border-2 transition-all',
                  participant.isSpeaking ? 'border-green-500 shadow-lg shadow-green-500/20' : 'border-gray-800',
                  viewMode === 'speaker' && index === 0 && 'md:col-span-2 md:row-span-2'
                )}
              >
                <CardContent className="p-0 h-full relative">
                  {/* Video */}
                  {participant.id === '1' ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      playsInline
                      className={cn(
                        'w-full h-full object-cover',
                        isVideoOff && 'hidden'
                      )}
                    />
                  ) : (
                    !participant.isVideoOff && (
                      <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900" />
                    )
                  )}

                  {/* Avatar cuando video está apagado */}
                  {((participant.id === '1' && isVideoOff) || (participant.id !== '1' && participant.isVideoOff)) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                      <Avatar className="w-16 h-16 md:w-24 md:h-24">
                        <AvatarImage src={participant.avatar} />
                        <AvatarFallback className="text-2xl">
                          {participant.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  )}

                  {/* Overlay Info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 md:p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs md:text-sm font-medium text-white truncate">
                          {participant.name}
                        </span>
                        {participant.isMuted && (
                          <MicOff className="w-3 h-3 md:w-4 md:h-4 text-red-500" />
                        )}
                      </div>
                      {participant.isHandRaised && (
                        <Hand className="w-4 h-4 text-yellow-500 animate-bounce" />
                      )}
                    </div>
                  </div>

                  {/* Speaking Indicator */}
                  {participant.isSpeaking && !participant.isMuted && (
                    <div className="absolute top-2 right-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Chat Sidebar */}
        {showChat && (
          <Card className="w-80 md:w-96 m-2 md:m-4 flex flex-col border-gray-800 bg-gray-900/95 backdrop-blur-xl">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Chat
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowChat(false)}
                className="md:hidden"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">{msg.userName}</span>
                      <span className="text-xs text-muted-foreground">
                        {msg.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                    <p className="text-sm bg-gray-800/50 rounded-lg p-2">
                      {msg.message}
                    </p>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-gray-800">
              <div className="flex gap-2">
                <Input
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Escribe un mensaje..."
                  className="bg-gray-800/50"
                />
                <Button onClick={sendMessage} size="icon">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Controls Bar */}
      <div className="h-20 bg-gray-900/95 backdrop-blur-xl border-t border-gray-800 flex items-center justify-center px-4 z-10">
        <div className="flex items-center gap-2 md:gap-4">
          <Button
            variant={isMuted ? 'destructive' : 'secondary'}
            size="icon"
            onClick={toggleMute}
            className="h-12 w-12 rounded-full"
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </Button>

          <Button
            variant={isVideoOff ? 'destructive' : 'secondary'}
            size="icon"
            onClick={toggleVideo}
            className="h-12 w-12 rounded-full"
          >
            {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </Button>

          <Button
            variant={isHandRaised ? 'default' : 'secondary'}
            size="icon"
            onClick={() => setIsHandRaised(!isHandRaised)}
            className="h-12 w-12 rounded-full hidden md:flex"
          >
            <Hand className="w-5 h-5" />
          </Button>

          <Button
            variant="secondary"
            size="icon"
            className="h-12 w-12 rounded-full hidden md:flex"
          >
            <Monitor className="w-5 h-5" />
          </Button>

          <Button
            variant="destructive"
            onClick={handleLeave}
            className="h-12 px-6 rounded-full"
          >
            <PhoneOff className="w-5 h-5 mr-2" />
            <span className="hidden md:inline">Salir</span>
          </Button>

          <Button
            variant="secondary"
            size="icon"
            className="h-12 w-12 rounded-full"
          >
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <MeetingInfoModal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        meetingId={meetingId}
        meetingType="meeting"
      />
    </div>
  );
}
