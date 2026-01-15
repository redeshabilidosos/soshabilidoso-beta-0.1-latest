'use client';

import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CyberButton } from '@/components/ui/cyber-button';
import { 
  Video, VideoOff, Mic, MicOff, Monitor, MonitorOff, 
  Settings, Users, MessageCircle, X, Play, Square,
  Camera, CameraOff
} from 'lucide-react';
import { toast } from 'sonner';

interface StreamingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StreamingModal({ isOpen, onClose }: StreamingModalProps) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [streamTitle, setStreamTitle] = useState('');
  const [streamDescription, setStreamDescription] = useState('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (isOpen) {
      initializeCamera();
    } else {
      stopAllStreams();
    }

    return () => {
      stopAllStreams();
    };
  }, [isOpen]);

  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      toast.success('Cámara inicializada correctamente');
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('No se pudo acceder a la cámara. Verifica los permisos.');
    }
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTracks = streamRef.current.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !isVideoEnabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const toggleAudio = () => {
    if (streamRef.current) {
      const audioTracks = streamRef.current.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !isAudioEnabled;
      });
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        
        screenStreamRef.current = screenStream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = screenStream;
        }
        
        setIsScreenSharing(true);
        toast.success('Compartiendo pantalla');
        
        // Detectar cuando el usuario deja de compartir pantalla
        screenStream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          initializeCamera(); // Volver a la cámara
        };
      } else {
        stopScreenShare();
        initializeCamera(); // Volver a la cámara
      }
    } catch (error) {
      console.error('Error sharing screen:', error);
      toast.error('No se pudo compartir la pantalla');
    }
  };

  const stopScreenShare = () => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop());
      screenStreamRef.current = null;
    }
    setIsScreenSharing(false);
  };

  const [streamId, setStreamId] = useState<string | null>(null);
  const [streamUrl, setStreamUrl] = useState<string>('');

  const startStreaming = async () => {
    if (!streamTitle.trim()) {
      toast.error('Por favor, ingresa un título para el streaming');
      return;
    }

    try {
      // Generar ID único para el stream
      const newStreamId = `live-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setStreamId(newStreamId);
      
      // Generar URL para compartir
      const url = `${window.location.origin}/meeting/${newStreamId}`;
      setStreamUrl(url);
      
      // Guardar en localStorage para que otros puedan ver
      const streamData = {
        id: newStreamId,
        title: streamTitle,
        description: streamDescription,
        startedAt: new Date().toISOString(),
        isLive: true
      };
      
      const existingStreams = JSON.parse(localStorage.getItem('active_streams') || '[]');
      existingStreams.push(streamData);
      localStorage.setItem('active_streams', JSON.stringify(existingStreams));
      
      setIsStreaming(true);
      setViewerCount(Math.floor(Math.random() * 50) + 1);
      toast.success('¡Streaming iniciado! Comparte el enlace con tus amigos.');
      
    } catch (error) {
      console.error('Error starting stream:', error);
      toast.error('Error al iniciar el streaming');
      setIsStreaming(false);
    }
  };

  const copyStreamUrl = () => {
    navigator.clipboard.writeText(streamUrl);
    toast.success('¡Enlace copiado al portapapeles!');
  };

  const stopStreaming = () => {
    setIsStreaming(false);
    setViewerCount(0);
    toast.success('Streaming finalizado');
    
    // Aquí se detendría la transmisión real
  };

  const stopAllStreams = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop());
      screenStreamRef.current = null;
    }
  };

  const handleClose = () => {
    if (isStreaming) {
      stopStreaming();
    }
    stopAllStreams();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto glass-card border-neon-green/20">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white flex items-center space-x-2">
              <Video className="text-neon-green" size={20} />
              <span>Streaming en Vivo</span>
              {isStreaming && (
                <div className="flex items-center space-x-2 ml-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-red-400 text-sm font-medium">EN VIVO</span>
                </div>
              )}
            </DialogTitle>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </DialogHeader>

        <div className="space-y-3">
          {/* Configuración del stream (solo si no está streaming) */}
          {!isStreaming && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Título del streaming
                </label>
                <input
                  type="text"
                  value={streamTitle}
                  onChange={(e) => setStreamTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:border-neon-green focus:outline-none"
                  placeholder="¿De qué vas a hablar hoy?"
                  maxLength={100}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Descripción (opcional)
                </label>
                <textarea
                  value={streamDescription}
                  onChange={(e) => setStreamDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:border-neon-green focus:outline-none resize-none"
                  placeholder="Describe tu streaming..."
                  rows={2}
                  maxLength={500}
                />
              </div>
            </div>
          )}

          {/* Vista previa de la cámara - Sin modo espejo (se ve como te ven los demás) */}
          <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9', maxHeight: '280px' }}>
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            
            {/* Overlay de información */}
            {isStreaming && (
              <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                <div className="bg-black/70 rounded-lg px-3 py-2">
                  <h3 className="text-white font-medium">{streamTitle}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-300 mt-1">
                    <div className="flex items-center space-x-1">
                      <Users size={14} />
                      <span>{viewerCount} espectadores</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Controles de video */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="flex items-center space-x-3 bg-black/70 rounded-full px-4 py-2">
                <button
                  onClick={toggleVideo}
                  className={`p-2 rounded-full transition-colors ${
                    isVideoEnabled 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  {isVideoEnabled ? <Camera size={20} /> : <CameraOff size={20} />}
                </button>

                <button
                  onClick={toggleAudio}
                  className={`p-2 rounded-full transition-colors ${
                    isAudioEnabled 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  {isAudioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
                </button>

                <button
                  onClick={toggleScreenShare}
                  className={`p-2 rounded-full transition-colors ${
                    isScreenSharing 
                      ? 'bg-neon-green text-black' 
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                >
                  {isScreenSharing ? <MonitorOff size={20} /> : <Monitor size={20} />}
                </button>
              </div>
            </div>
          </div>

          {/* Controles principales */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-3">
              {isStreaming && (
                <div className="flex items-center space-x-3 text-xs text-gray-300">
                  <div className="flex items-center space-x-1">
                    <Users size={14} />
                    <span>{viewerCount}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle size={14} />
                    <span>Chat</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {!isStreaming ? (
                <CyberButton
                  onClick={startStreaming}
                  size="sm"
                  className="bg-red-600 hover:bg-red-700"
                  disabled={!streamTitle.trim()}
                >
                  <Play size={14} className="mr-1" />
                  Iniciar
                </CyberButton>
              ) : (
                <CyberButton
                  onClick={stopStreaming}
                  size="sm"
                  variant="destructive"
                >
                  <Square size={14} className="mr-1" />
                  Finalizar
                </CyberButton>
              )}
              
              <CyberButton variant="outline" size="sm" onClick={handleClose}>
                Cerrar
              </CyberButton>
            </div>
          </div>

          {/* URL para compartir */}
          {isStreaming && streamUrl && (
            <div className="bg-gray-800 rounded-lg p-3 flex items-center justify-between">
              <div className="flex-1 mr-3">
                <p className="text-xs text-gray-400 mb-1">Comparte este enlace:</p>
                <p className="text-sm text-neon-green truncate">{streamUrl}</p>
              </div>
              <CyberButton size="sm" onClick={copyStreamUrl}>
                Copiar
              </CyberButton>
            </div>
          )}

          {/* Chat del streaming (simulado) */}
          {isStreaming && (
            <div className="bg-gray-800 rounded-lg p-3 h-24 overflow-y-auto">
              <div className="text-sm text-gray-300 space-y-1">
                <div><span className="text-neon-green">Usuario1:</span> ¡Hola! 👋</div>
                <div><span className="text-blue-400">Futbolero23:</span> Excelente stream</div>
                <div><span className="text-purple-400">MariaFC:</span> ¿Cuándo juegas?</div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}