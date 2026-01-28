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
  MessageSquare, Settings, Hand, Send, X, GraduationCap,
  FileText, Share2, Copy, Link2
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { MeetingInfoModal } from '@/components/live/meeting-info-modal';

interface Student {
  id: string;
  name: string;
  avatar?: string;
  isMuted: boolean;
  isVideoOff: boolean;
  isHandRaised: boolean;
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
  isQuestion?: boolean;
}

export default function ClassRoomPage() {
  const params = useParams();
  const router = useRouter();
  const classId = params.id as string;
  
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [showStudents, setShowStudents] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(true);
  const [chatMessage, setChatMessage] = useState('');
  const [isQuestion, setIsQuestion] = useState(false);
  const [accessCode] = useState('ABC123'); // TODO: Obtener del backend
  
  const [students, setStudents] = useState<Student[]>([
    // Estudiantes de ejemplo
    ...Array.from({ length: 8 }, (_, i) => ({
      id: `${i + 1}`,
      name: `Estudiante ${i + 1}`,
      isMuted: true,
      isVideoOff: Math.random() > 0.6,
      isHandRaised: Math.random() > 0.9,
    })),
  ]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      userId: '1',
      userName: 'Estudiante 1',
      message: '¿Podrías explicar ese concepto de nuevo?',
      timestamp: new Date(),
      isQuestion: true,
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
        
        console.log('Cámara del instructor inicializada correctamente');
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

  const handleEndClass = () => {
    if (confirm('¿Estás seguro de que quieres finalizar la clase?')) {
      router.push('/live');
    }
  };

  const sendMessage = () => {
    if (!chatMessage.trim()) return;
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: 'instructor',
      userName: 'Instructor',
      message: chatMessage,
      timestamp: new Date(),
      isQuestion,
    };
    
    setChatMessages([...chatMessages, newMessage]);
    setChatMessage('');
    setIsQuestion(false);
  };

  const copyAccessCode = () => {
    navigator.clipboard.writeText(accessCode);
    toast.success('Código copiado al portapapeles');
  };

  const copyClassLink = () => {
    const classLink = `${window.location.origin}/live/class/${classId}`;
    navigator.clipboard.writeText(classLink);
    toast.success('Enlace copiado al portapapeles');
  };

  const shareClassInfo = () => {
    const classLink = `${window.location.origin}/live/class/${classId}`;
    const shareText = `Únete a mi clase virtual:\n\nID: ${classId}\nCódigo de acceso: ${accessCode}\nEnlace: ${classLink}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Clase Virtual',
        text: shareText,
      }).catch(() => {
        navigator.clipboard.writeText(shareText);
        toast.success('Información copiada al portapapeles');
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('Información copiada al portapapeles');
    }
  };

  const raisedHands = students.filter(s => s.isHandRaised).length;

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      {/* Header */}
      <div className="h-16 bg-gradient-to-r from-green-900/95 to-emerald-900/95 backdrop-blur-xl border-b border-green-800 flex items-center justify-between px-4 z-10">
        <div className="flex items-center gap-3">
          <GraduationCap className="w-6 h-6 text-green-400" />
          <div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-500 text-white">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-2" />
                Clase en Vivo
              </Badge>
              {raisedHands > 0 && (
                <Badge className="bg-yellow-500 text-black">
                  <Hand className="w-3 h-3 mr-1" />
                  {raisedHands}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-green-200 hidden md:inline">
                {students.length} estudiantes
              </span>
              <span className="text-xs text-green-200 hidden md:inline">•</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyClassLink}
                className="h-5 px-2 text-xs font-mono text-green-200 hover:bg-white/10 hover:text-white"
              >
                <Link2 className="w-3 h-3 mr-1" />
                ID: {classId}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={shareClassInfo}
            className="hidden sm:flex bg-green-500/20 hover:bg-green-500/30 text-green-200"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Compartir
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={copyAccessCode}
            className="hidden md:flex text-white hover:bg-white/10"
          >
            <Copy className="w-4 h-4 mr-2" />
            Código: {accessCode}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowStudents(!showStudents)}
            className="text-white hover:bg-white/10"
          >
            <Users className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowChat(!showChat)}
            className="text-white hover:bg-white/10"
          >
            <MessageSquare className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-white/10"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Video Area */}
        <div className="flex-1 flex flex-col p-2 md:p-4 gap-2 md:gap-4">
          {/* Instructor Video - Principal */}
          <Card className="flex-1 relative overflow-hidden bg-gray-900 border-2 border-green-500/50">
            <CardContent className="p-0 h-full relative">
              {!isVideoOff ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                  <Avatar className="w-32 h-32">
                    <AvatarFallback className="text-4xl">I</AvatarFallback>
                  </Avatar>
                </div>
              )}

              {/* Instructor Label */}
              <div className="absolute top-4 left-4">
                <Badge className="bg-green-500 text-white">
                  <GraduationCap className="w-3 h-3 mr-1" />
                  Instructor
                </Badge>
              </div>

              {/* Mute Indicator */}
              {isMuted && (
                <div className="absolute top-4 right-4">
                  <div className="bg-red-500 rounded-full p-2">
                    <MicOff className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Students Grid - Smaller */}
          <div className="h-32 md:h-40">
            <ScrollArea className="h-full">
              <div className="flex gap-2 pb-2">
                {students.map((student) => (
                  <Card 
                    key={student.id}
                    className={cn(
                      'relative flex-shrink-0 w-32 md:w-40 h-28 md:h-36 overflow-hidden bg-gray-900 border-2',
                      student.isHandRaised ? 'border-yellow-500' : 'border-gray-800'
                    )}
                  >
                    <CardContent className="p-0 h-full relative">
                      {!student.isVideoOff ? (
                        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="text-sm">
                              {student.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      )}

                      {/* Student Info */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-white truncate">
                            {student.name}
                          </span>
                          {student.isMuted && (
                            <MicOff className="w-3 h-3 text-red-500 flex-shrink-0" />
                          )}
                        </div>
                      </div>

                      {/* Raised Hand */}
                      {student.isHandRaised && (
                        <div className="absolute top-1 right-1">
                          <Hand className="w-4 h-4 text-yellow-500 animate-bounce" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Chat Sidebar */}
        {showChat && (
          <Card className="w-80 md:w-96 m-2 md:m-4 flex flex-col border-gray-800 bg-gray-900/95 backdrop-blur-xl">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Chat de Clase
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
                  <div 
                    key={msg.id} 
                    className={cn(
                      'space-y-1',
                      msg.isQuestion && 'bg-yellow-500/10 rounded-lg p-2 -mx-2'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {msg.isQuestion && (
                        <Hand className="w-3 h-3 text-yellow-500" />
                      )}
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

            <div className="p-4 border-t border-gray-800 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isQuestion"
                  checked={isQuestion}
                  onChange={(e) => setIsQuestion(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="isQuestion" className="text-xs text-muted-foreground flex items-center gap-1">
                  <Hand className="w-3 h-3" />
                  Marcar como pregunta
                </label>
              </div>
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
      <div className="h-20 bg-gradient-to-r from-green-900/95 to-emerald-900/95 backdrop-blur-xl border-t border-green-800 flex items-center justify-center px-4 z-10">
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
            variant="secondary"
            size="icon"
            className="h-12 w-12 rounded-full hidden md:flex"
          >
            <Share2 className="w-5 h-5" />
          </Button>

          <Button
            variant="secondary"
            size="icon"
            className="h-12 w-12 rounded-full hidden md:flex"
          >
            <FileText className="w-5 h-5" />
          </Button>

          <Button
            variant="destructive"
            onClick={handleEndClass}
            className="h-12 px-6 rounded-full"
          >
            <PhoneOff className="w-5 h-5 mr-2" />
            <span className="hidden md:inline">Finalizar Clase</span>
            <span className="md:hidden">Salir</span>
          </Button>
        </div>
      </div>

      <MeetingInfoModal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        meetingId={classId}
        meetingType="class"
        accessCode={accessCode}
      />
    </div>
  );
}
