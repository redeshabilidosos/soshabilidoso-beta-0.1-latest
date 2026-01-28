'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/providers/providers';
import { Sidebar } from '@/components/navigation/sidebar';
import { MobileNav } from '@/components/navigation/mobile-nav';
import { CyberButton } from '@/components/ui/cyber-button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Radio, 
  Settings, 
  Users, 
  ArrowLeft,
  Monitor,
  Camera,
  X
} from 'lucide-react';
import { toast } from 'sonner';

export default function StartLivePage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const communityId = searchParams.get('community');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamId, setStreamId] = useState<string | null>(null);
  const [streamTitle, setStreamTitle] = useState('');
  const [streamDescription, setStreamDescription] = useState('');
  const [viewerCount, setViewerCount] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [devices, setDevices] = useState<{ video: MediaDeviceInfo[], audio: MediaDeviceInfo[] }>({ video: [], audio: [] });
  const [selectedVideoDevice, setSelectedVideoDevice] = useState<string>('');
  const [selectedAudioDevice, setSelectedAudioDevice] = useState<string>('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [communityInfo, setCommunityInfo] = useState<{ name: string; type: string } | null>(null);

  // Iniciar cámara al cargar
  useEffect(() => {
    if (user) {
      startCamera();
      loadDevices();
      
      // Cargar info de la comunidad si existe
      if (communityId) {
        loadCommunityInfo();
      }
    }
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [user, communityId]);

  const loadCommunityInfo = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://127.0.0.1:8000/api/communities/${communityId}/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setCommunityInfo({ name: data.name, type: data.type });
        // Si la comunidad es privada o premium, la transmisión será privada
        setIsPrivate(data.type === 'private' || data.type === 'premium');
      }
    } catch (error) {
      console.error('Error loading community info:', error);
    }
  };


  const loadDevices = async () => {
    try {
      const deviceList = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = deviceList.filter(d => d.kind === 'videoinput');
      const audioDevices = deviceList.filter(d => d.kind === 'audioinput');
      setDevices({ video: videoDevices, audio: audioDevices });
      
      if (videoDevices.length > 0) setSelectedVideoDevice(videoDevices[0].deviceId);
      if (audioDevices.length > 0) setSelectedAudioDevice(audioDevices[0].deviceId);
    } catch (error) {
      console.error('Error loading devices:', error);
    }
  };

  const startCamera = async (videoDeviceId?: string, audioDeviceId?: string) => {
    try {
      console.log('[CAMERA] Solicitando acceso a cámara y micrófono...');
      console.log('[CAMERA] Navegador:', navigator.userAgent);
      
      // Detener stream anterior si existe
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      // Verificar si getUserMedia está disponible
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Tu navegador no soporta acceso a cámara y micrófono');
      }

      const constraints: MediaStreamConstraints = {
        video: videoDeviceId 
          ? { deviceId: { exact: videoDeviceId } } 
          : { 
              width: { ideal: 1280 },
              height: { ideal: 720 },
              facingMode: 'user'
            },
        audio: audioDeviceId 
          ? { deviceId: { exact: audioDeviceId } } 
          : {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true
            }
      };

      console.log('[CAMERA] Constraints:', constraints);
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('[CAMERA] Stream obtenido:', newStream);
      console.log('[CAMERA] Video tracks:', newStream.getVideoTracks());
      console.log('[CAMERA] Audio tracks:', newStream.getAudioTracks());
      
      setStream(newStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        await videoRef.current.play();
        console.log('[CAMERA] Video reproduciendo correctamente');
      }
      
      toast.success('Cámara iniciada correctamente');
    } catch (error: any) {
      console.error('[CAMERA ERROR]', error);
      console.error('[CAMERA ERROR] Name:', error.name);
      console.error('[CAMERA ERROR] Message:', error.message);
      
      let errorMessage = 'No se pudo acceder a la cámara.';
      let errorDetails = '';
      
      // Detectar navegador Brave
      const isBrave = (navigator as any).brave && typeof (navigator as any).brave.isBrave === 'function';
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage = 'Permiso denegado para acceder a la cámara y micrófono.';
        if (isBrave) {
          errorDetails = 'En Brave: Haz clic en el icono del escudo en la barra de direcciones y permite el acceso a la cámara.';
        } else {
          errorDetails = 'Por favor, permite el acceso en la configuración de tu navegador.';
        }
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        errorMessage = 'No se encontró ninguna cámara o micrófono conectado.';
        errorDetails = 'Verifica que tus dispositivos estén conectados correctamente.';
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        errorMessage = 'La cámara está siendo usada por otra aplicación.';
        errorDetails = 'Cierra otras aplicaciones que puedan estar usando la cámara.';
      } else if (error.name === 'OverconstrainedError') {
        errorMessage = 'No se pudo satisfacer las restricciones de video solicitadas.';
        errorDetails = 'Intenta con otra cámara si tienes múltiples dispositivos.';
      } else if (error.name === 'TypeError') {
        errorMessage = 'Error de configuración del navegador.';
        errorDetails = 'Asegúrate de estar usando HTTPS o localhost.';
      }
      
      toast.error(errorMessage + (errorDetails ? ' ' + errorDetails : ''), {
        duration: 6000
      });
    }
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioOn(audioTrack.enabled);
      }
    }
  };

  const startStreaming = async () => {
    if (!streamTitle.trim()) {
      toast.error('Por favor, ingresa un título para tu transmisión');
      return;
    }

    // Generar ID único para la transmisión
    const newStreamId = `live-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setStreamId(newStreamId);
    setIsStreaming(true);
    
    // Guardar info del stream en localStorage para que meeting pueda acceder
    const streamData = {
      id: newStreamId,
      title: streamTitle,
      description: streamDescription,
      hostId: user?.id,
      hostName: user?.displayName || user?.username,
      hostAvatar: user?.avatar,
      communityId: communityId,
      communityName: communityInfo?.name,
      isPrivate: isPrivate,
      startedAt: new Date().toISOString(),
      isLive: true
    };
    
    // Guardar en localStorage para simular persistencia
    const existingStreams = JSON.parse(localStorage.getItem('active_streams') || '[]');
    existingStreams.push(streamData);
    localStorage.setItem('active_streams', JSON.stringify(existingStreams));
    
    toast.success('¡Transmisión iniciada!');
    
    // Redirigir a la página de meeting con el ID del stream
    router.push(`/meeting/${newStreamId}?host=true`);
  };

  const stopStreaming = () => {
    setIsStreaming(false);
    setViewerCount(0);
    toast.info('Transmisión finalizada');
  };

  const handleDeviceChange = async (type: 'video' | 'audio', deviceId: string) => {
    if (type === 'video') {
      setSelectedVideoDevice(deviceId);
      await startCamera(deviceId, selectedAudioDevice);
    } else {
      setSelectedAudioDevice(deviceId);
      await startCamera(selectedVideoDevice, deviceId);
    }
  };

  // Solo mostrar loading si está cargando auth Y no hay usuario
  if (authLoading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-10 h-10 border-3 border-neon-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;


  return (
    <div className="min-h-screen bg-black text-white">
      <Sidebar />
      
      <main className="pb-24 xl:ml-64 xl:pb-0">
        <div className="max-w-6xl mx-auto p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Radio className="w-6 h-6 text-red-500" />
                  {isStreaming ? 'En Vivo' : 'Iniciar Transmisión'}
                </h1>
                {communityId && (
                  <p className="text-sm text-gray-400">Transmitiendo en comunidad</p>
                )}
              </div>
            </div>
            
            {isStreaming && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-red-500/20 px-3 py-1.5 rounded-full">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-red-400 text-sm font-medium">EN VIVO</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 px-3 py-1.5 rounded-full">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{viewerCount} viendo</span>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Preview de video */}
            <div className="lg:col-span-2">
              <Card className="glass-card border-white/10 overflow-hidden">
                <div className="relative aspect-video bg-gray-900">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${!isVideoOn ? 'hidden' : ''}`}
                    style={{ transform: 'scaleX(1)' }}
                  />
                  
                  {!isVideoOn && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                      <div className="text-center">
                        <VideoOff className="w-16 h-16 text-gray-500 mx-auto mb-2" />
                        <p className="text-gray-400">Cámara desactivada</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Controles de video */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-3">
                    <button
                      onClick={toggleVideo}
                      className={`p-3 rounded-full transition-colors ${
                        isVideoOn ? 'bg-white/20 hover:bg-white/30' : 'bg-red-500 hover:bg-red-600'
                      }`}
                    >
                      {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                    </button>
                    
                    <button
                      onClick={toggleAudio}
                      className={`p-3 rounded-full transition-colors ${
                        isAudioOn ? 'bg-white/20 hover:bg-white/30' : 'bg-red-500 hover:bg-red-600'
                      }`}
                    >
                      {isAudioOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                    </button>
                    
                    <button
                      onClick={() => setShowSettings(!showSettings)}
                      className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                    >
                      <Settings className="w-5 h-5" />
                    </button>
                    
                    {isStreaming && (
                      <button
                        onClick={stopStreaming}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-full text-sm font-medium transition-colors"
                      >
                        Finalizar
                      </button>
                    )}
                  </div>
                </div>
              </Card>
              
              {/* Configuración de dispositivos */}
              {showSettings && (
                <Card className="glass-card border-white/10 mt-4">
                  <CardContent className="p-4 space-y-4">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Configuración de dispositivos
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">
                          <Camera className="w-4 h-4 inline mr-1" />
                          Cámara
                        </label>
                        <select
                          value={selectedVideoDevice}
                          onChange={(e) => handleDeviceChange('video', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                        >
                          {devices.video.map(device => (
                            <option key={device.deviceId} value={device.deviceId} className="bg-gray-800">
                              {device.label || `Cámara ${devices.video.indexOf(device) + 1}`}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">
                          <Mic className="w-4 h-4 inline mr-1" />
                          Micrófono
                        </label>
                        <select
                          value={selectedAudioDevice}
                          onChange={(e) => handleDeviceChange('audio', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                        >
                          {devices.audio.map(device => (
                            <option key={device.deviceId} value={device.deviceId} className="bg-gray-800">
                              {device.label || `Micrófono ${devices.audio.indexOf(device) + 1}`}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>


            {/* Panel de configuración */}
            <div className="space-y-4">
              <Card className="glass-card border-white/10">
                <CardContent className="p-4 space-y-4">
                  <h3 className="font-semibold text-white">Detalles de la transmisión</h3>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Título *</label>
                    <Input
                      value={streamTitle}
                      onChange={(e) => setStreamTitle(e.target.value)}
                      placeholder="Ej: Sesión de Q&A en vivo"
                      className="bg-white/5 border-white/10 text-white"
                      disabled={isStreaming}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Descripción</label>
                    <Textarea
                      value={streamDescription}
                      onChange={(e) => setStreamDescription(e.target.value)}
                      placeholder="Describe de qué tratará tu transmisión..."
                      className="bg-white/5 border-white/10 text-white min-h-[80px] resize-none"
                      disabled={isStreaming}
                    />
                  </div>
                  
                  {!isStreaming ? (
                    <CyberButton
                      onClick={startStreaming}
                      className="w-full"
                      disabled={!stream}
                    >
                      <Radio className="w-4 h-4 mr-2" />
                      Iniciar Transmisión
                    </CyberButton>
                  ) : (
                    <div className="text-center py-2">
                      <p className="text-neon-green text-sm font-medium">
                        ¡Estás en vivo!
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        Tu transmisión está siendo vista por {viewerCount} personas
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Tips */}
              <Card className="glass-card border-white/10">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-white mb-3">💡 Tips para tu transmisión</h3>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li className="flex items-start gap-2">
                      <span className="text-neon-green">•</span>
                      Asegúrate de tener buena iluminación
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-neon-green">•</span>
                      Usa auriculares para mejor audio
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-neon-green">•</span>
                      Verifica tu conexión a internet
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-neon-green">•</span>
                      Interactúa con tu audiencia
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
