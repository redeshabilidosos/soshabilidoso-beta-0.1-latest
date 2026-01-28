'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const [isStreaming, setIsStreaming] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [streamTitle, setStreamTitle] = useState('');
  const [streamDescription, setStreamDescription] = useState('');
  const [streamType, setStreamType] = useState<'class' | 'stream'>('stream');
  const [cameraStatus, setCameraStatus] = useState<'loading' | 'active' | 'error'>('loading');
  
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
    setCameraStatus('loading');
    try {
      console.log('[CAMERA MODAL] Solicitando acceso a cámara y micrófono...');
      console.log('[CAMERA MODAL] Navegador:', navigator.userAgent);
      
      // Verificar si getUserMedia está disponible
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Tu navegador no soporta acceso a cámara y micrófono');
      }

      // Detectar navegador Brave
      const isBrave = (navigator as any).brave && typeof (navigator as any).brave.isBrave === 'function';
      if (isBrave) {
        console.log('[CAMERA MODAL] Navegador Brave detectado');
      }

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
      
      console.log('[CAMERA MODAL] Stream obtenido:', stream);
      console.log('[CAMERA MODAL] Video tracks:', stream.getVideoTracks());
      console.log('[CAMERA MODAL] Audio tracks:', stream.getAudioTracks());
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Esperar a que el video esté listo
        videoRef.current.onloadedmetadata = () => {
          console.log('[CAMERA MODAL] Video metadata cargada');
          videoRef.current?.play().then(() => {
            console.log('[CAMERA MODAL] Video reproduciendo');
            setCameraStatus('active');
            toast.success('Cámara activada correctamente');
          }).catch(err => {
            console.error('[CAMERA MODAL ERROR] Error al reproducir video:', err);
            setCameraStatus('error');
            toast.error('Error al reproducir el video de la cámara');
          });
        };
      } else {
        console.warn('[CAMERA MODAL] videoRef.current es null');
        setCameraStatus('error');
      }
      
    } catch (error: any) {
      console.error('[CAMERA MODAL ERROR]', error);
      console.error('[CAMERA MODAL ERROR] Name:', error.name);
      console.error('[CAMERA MODAL ERROR] Message:', error.message);
      setCameraStatus('error');
      
      let errorMessage = 'No se pudo acceder a la cámara.';
      let errorDetails = '';
      
      // Detectar navegador Brave
      const isBrave = (navigator as any).brave && typeof (navigator as any).brave.isBrave === 'function';
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage = 'Permiso denegado para acceder a la cámara y micrófono.';
        if (isBrave) {
          errorDetails = '\n\nEn Brave:\n1. Haz clic en el icono del escudo (🛡️) en la barra de direcciones\n2. Selecciona "Controles avanzados"\n3. Permite el acceso a la cámara y micrófono\n4. Recarga la página';
        } else {
          errorDetails = '\n\nPor favor:\n1. Haz clic en el icono de cámara en la barra de direcciones\n2. Permite el acceso a la cámara y micrófono\n3. Recarga la página si es necesario';
        }
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        errorMessage = 'No se encontró ninguna cámara o micrófono conectado.';
        errorDetails = '\n\nVerifica que:\n- Tus dispositivos estén conectados correctamente\n- Los drivers estén instalados\n- Otra aplicación no esté usando la cámara';
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        errorMessage = 'La cámara está siendo usada por otra aplicación.';
        errorDetails = '\n\nCierra otras aplicaciones que puedan estar usando la cámara (Zoom, Teams, Skype, etc.)';
      } else if (error.name === 'OverconstrainedError') {
        errorMessage = 'No se pudo satisfacer las restricciones de video solicitadas.';
        errorDetails = '\n\nIntenta con otra cámara si tienes múltiples dispositivos conectados.';
      } else if (error.name === 'TypeError') {
        errorMessage = 'Error de configuración del navegador.';
        errorDetails = '\n\nAsegúrate de:\n- Estar usando HTTPS o localhost\n- Tener permisos de cámara habilitados en el sistema';
      } else if (error.message) {
        errorDetails = '\n\nDetalles: ' + error.message;
      }
      
      toast.error(errorMessage + errorDetails, {
        duration: 8000
      });
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
      
      // Obtener usuario actual
      const currentUser = JSON.parse(localStorage.getItem('current_user') || '{}');
      
      // Guardar en localStorage para que otros puedan ver
      const streamData = {
        id: newStreamId,
        type: streamType,
        title: streamTitle,
        description: streamDescription,
        hostName: currentUser.username || 'Usuario',
        hostAvatar: currentUser.avatar || '',
        startedAt: new Date().toISOString(),
        isLive: true,
        isPrivate: false,
        meetingUrl: '', // Se puede agregar URL de video real aquí
      };
      
      const existingStreams = JSON.parse(localStorage.getItem('active_streams') || '[]');
      existingStreams.push(streamData);
      localStorage.setItem('active_streams', JSON.stringify(existingStreams));
      
      setIsStreaming(true);
      toast.success('¡Streaming iniciado! Redirigiendo...');
      
      // Cerrar modal y redirigir a la vista de streaming
      setTimeout(() => {
        onClose();
        router.push(`/live/stream/${newStreamId}`);
      }, 1000);
      
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
    console.log('🛑 Deteniendo todos los streams...');
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        console.log(`Deteniendo track: ${track.kind}`);
        track.stop();
      });
      streamRef.current = null;
    }
    
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop());
      screenStreamRef.current = null;
    }
    
    setCameraStatus('loading');
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
      <DialogContent className="max-w-2xl glass-card border-cyan-400/20 p-6">
        <DialogHeader>
          <div className="flex items-center justify-between mb-4">
            <DialogTitle className="text-white flex items-center space-x-2 text-xl">
              <Video className="text-cyan-400" size={24} />
              <span className="font-bold">Nuevo Stream</span>
            </DialogTitle>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-700 rounded"
            >
              <X size={20} />
            </button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Configuración del stream */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tipo de transmisión
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setStreamType('class')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    streamType === 'class'
                      ? 'border-cyan-400 bg-cyan-400/10 text-white'
                      : 'border-gray-600 bg-gray-800 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-1">
                    <Video className="w-5 h-5" />
                    <span className="text-sm font-medium">Clase</span>
                  </div>
                </button>
                <button
                  onClick={() => setStreamType('stream')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    streamType === 'stream'
                      ? 'border-purple-500 bg-purple-500/10 text-white'
                      : 'border-gray-600 bg-gray-800 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-1">
                    <Video className="w-5 h-5" />
                    <span className="text-sm font-medium">Stream</span>
                  </div>
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Título del streaming
              </label>
              <input
                type="text"
                value={streamTitle}
                onChange={(e) => setStreamTitle(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:border-cyan-400 focus:outline-none"
                placeholder="¿De qué vas a hablar hoy?"
                maxLength={100}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descripción (opcional)
              </label>
              <textarea
                value={streamDescription}
                onChange={(e) => setStreamDescription(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:border-cyan-400 focus:outline-none resize-none"
                placeholder="Describe tu streaming..."
                rows={2}
                maxLength={500}
              />
            </div>
          </div>

          {/* Vista previa de la cámara - Tamaño fijo */}
          <div className="relative bg-black rounded-lg overflow-hidden h-[280px]">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
              style={{ transform: 'scaleX(-1)' }}
            />
            
            {/* Mensaje de carga o error */}
            {cameraStatus === 'loading' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/95 z-20">
                <div className="relative">
                  <Users className="w-16 h-16 text-cyan-400 mb-4 animate-pulse" />
                  <div className="absolute inset-0 bg-cyan-400/20 rounded-full animate-ping"></div>
                </div>
                <p className="text-white font-semibold text-lg mb-2">Activando cámara...</p>
                <p className="text-gray-400 text-sm text-center px-4 max-w-sm">
                  Por favor, permite el acceso a tu cámara y micrófono cuando el navegador lo solicite
                </p>
              </div>
            )}
            
            {cameraStatus === 'error' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/95 z-20 p-6 overflow-y-auto">
                <CameraOff className="w-16 h-16 text-red-400 mb-4" />
                <p className="text-white font-semibold text-lg mb-2">Error al activar cámara</p>
                <p className="text-gray-400 text-sm text-center px-4 max-w-md mb-4">
                  No se pudo acceder a la cámara. Verifica los permisos en tu navegador.
                </p>
                
                {/* Instrucciones específicas por navegador */}
                <div className="bg-gray-800/50 rounded-lg p-4 mb-4 max-w-md text-left">
                  <p className="text-white font-medium text-sm mb-2">Instrucciones:</p>
                  <ul className="text-gray-300 text-xs space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-0.5">•</span>
                      <span><strong>Chrome/Edge:</strong> Haz clic en el icono de cámara en la barra de direcciones y permite el acceso</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-0.5">•</span>
                      <span><strong>Brave:</strong> Haz clic en el icono del escudo, selecciona "Controles avanzados" y permite cámara/micrófono</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-0.5">•</span>
                      <span><strong>Firefox:</strong> Haz clic en el icono de cámara tachada en la barra de direcciones</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-0.5">•</span>
                      <span>Asegúrate de que ninguna otra aplicación esté usando la cámara</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-0.5">•</span>
                      <span>Verifica que estés usando HTTPS o localhost</span>
                    </li>
                  </ul>
                </div>
                
                <CyberButton 
                  size="sm" 
                  onClick={initializeCamera}
                  className="bg-cyan-400/20 border-cyan-400"
                >
                  Intentar de nuevo
                </CyberButton>
              </div>
            )}

            {/* Controles de video - Siempre visibles */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
              <div className="flex items-center space-x-3 bg-black/80 backdrop-blur-sm rounded-full px-4 py-2.5 border border-cyan-400/30">
                <button
                  onClick={toggleVideo}
                  title={isVideoEnabled ? 'Desactivar cámara' : 'Activar cámara'}
                  className={`p-2.5 rounded-full transition-all ${
                    isVideoEnabled 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  {isVideoEnabled ? <Camera size={20} /> : <CameraOff size={20} />}
                </button>

                <button
                  onClick={toggleAudio}
                  title={isAudioEnabled ? 'Silenciar micrófono' : 'Activar micrófono'}
                  className={`p-2.5 rounded-full transition-all ${
                    isAudioEnabled 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  {isAudioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
                </button>

                <button
                  onClick={toggleScreenShare}
                  title={isScreenSharing ? 'Dejar de compartir' : 'Compartir pantalla'}
                  className={`p-2.5 rounded-full transition-all ${
                    isScreenSharing 
                      ? 'bg-cyan-400 text-black' 
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                >
                  {isScreenSharing ? <MonitorOff size={20} /> : <Monitor size={20} />}
                </button>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <CyberButton variant="outline" size="sm" onClick={handleClose}>
              Cancelar
            </CyberButton>
            <CyberButton
              onClick={startStreaming}
              size="sm"
              className="bg-red-600 hover:bg-red-700 border-red-500"
              disabled={!streamTitle.trim()}
            >
              <Play size={16} className="mr-2" />
              Iniciar Stream
            </CyberButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}