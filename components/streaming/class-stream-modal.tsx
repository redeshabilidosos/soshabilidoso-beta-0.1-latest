'use client';

import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CyberButton } from '@/components/ui/cyber-button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Video, VideoOff, Mic, MicOff, Monitor, MonitorOff, 
  Users, Copy, Link2, Key, X, Play, Square,
  Camera, Settings, Grid3X3, User as UserIcon,
  Lock, Globe, Check
} from 'lucide-react';
import { toast } from 'sonner';

interface Community {
  id: string;
  name: string;
  avatar?: string;
}

interface ClassStreamModalProps {
  isOpen: boolean;
  onClose: () => void;
  communities?: Community[];
}

export function ClassStreamModal({ isOpen, onClose, communities = [] }: ClassStreamModalProps) {
  const [step, setStep] = useState<'config' | 'streaming'>('config');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  
  // Config
  const [streamTitle, setStreamTitle] = useState('');
  const [streamDescription, setStreamDescription] = useState('');
  const [selectedCommunity, setSelectedCommunity] = useState<string>('');
  const [maxParticipants, setMaxParticipants] = useState(50);
  const [requiresApproval, setRequiresApproval] = useState(false);
  
  // Generated access
  const [streamId, setStreamId] = useState<string>('');
  const [accessCode, setAccessCode] = useState<string>('');
  const [streamUrl, setStreamUrl] = useState<string>('');
  
  // Participants (mock)
  const [participants, setParticipants] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'speaker'>('grid');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Mock communities if none provided
  const availableCommunities: Community[] = communities.length > 0 ? communities : [
    { id: '1', name: 'Desarrollo Web Avanzado' },
    { id: '2', name: 'Gamers Colombia' },
    { id: '3', name: 'Fitness & Nutrición' },
    { id: '4', name: 'Marketing Digital' },
  ];

  useEffect(() => {
    if (isOpen && step === 'streaming') {
      initializeCamera();
    }
    return () => stopAllStreams();
  }, [isOpen, step]);

  // Simulate participants joining
  useEffect(() => {
    if (isStreaming) {
      const interval = setInterval(() => {
        if (Math.random() > 0.7 && participants.length < maxParticipants) {
          const names = ['Ana García', 'Luis Rodríguez', 'María López', 'Carlos Mendoza', 'Sofia Torres'];
          const newParticipant = {
            id: Date.now().toString(),
            name: names[Math.floor(Math.random() * names.length)],
            avatar: '/api/placeholder/40/40',
            isMuted: Math.random() > 0.5,
            isVideoOff: Math.random() > 0.7,
            joinedAt: new Date()
          };
          setParticipants(prev => [...prev, newParticipant]);
          toast.success(`${newParticipant.name} se unió a la clase`);
        }
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isStreaming, participants.length, maxParticipants]);

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

  const generateAccessCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const startClass = () => {
    if (!streamTitle.trim()) {
      toast.error('Ingresa un título para la clase');
      return;
    }
    if (!selectedCommunity) {
      toast.error('Selecciona una comunidad');
      return;
    }

    const newStreamId = `class-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newAccessCode = generateAccessCode();
    const url = `${window.location.origin}/meeting/${newStreamId}?code=${newAccessCode}`;

    setStreamId(newStreamId);
    setAccessCode(newAccessCode);
    setStreamUrl(url);
    setStep('streaming');
    setIsStreaming(true);

    // Save to localStorage
    const streamData = {
      id: newStreamId,
      type: 'class',
      title: streamTitle,
      description: streamDescription,
      communityId: selectedCommunity,
      communityName: availableCommunities.find(c => c.id === selectedCommunity)?.name,
      accessCode: newAccessCode,
      hostName: 'Usuario Actual',
      startedAt: new Date().toISOString(),
      isPrivate: true,
      maxParticipants
    };

    const existingStreams = JSON.parse(localStorage.getItem('active_streams') || '[]');
    localStorage.setItem('active_streams', JSON.stringify([...existingStreams, streamData]));

    toast.success('¡Clase iniciada! Comparte el código de acceso con tus estudiantes.');
  };

  const endClass = () => {
    setIsStreaming(false);
    stopAllStreams();
    
    // Remove from localStorage
    const streams = JSON.parse(localStorage.getItem('active_streams') || '[]');
    localStorage.setItem('active_streams', JSON.stringify(streams.filter((s: any) => s.id !== streamId)));
    
    toast.success('Clase finalizada');
    onClose();
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado al portapapeles`);
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
      if (confirm('¿Seguro que quieres finalizar la clase?')) {
        endClass();
      }
    } else {
      setStep('config');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className={`${step === 'streaming' ? 'max-w-6xl' : 'max-w-2xl'} max-h-[95vh] overflow-y-auto glass-card border-neon-green/20`}>
        <DialogHeader>
          <DialogTitle className="text-white flex items-center space-x-2">
            <Users className="text-neon-green" size={20} />
            <span>{step === 'config' ? 'Crear Clase en Vivo' : streamTitle}</span>
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
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Título de la clase *</label>
              <input
                type="text"
                value={streamTitle}
                onChange={(e) => setStreamTitle(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-neon-green focus:outline-none"
                placeholder="Ej: Introducción a React Hooks"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Descripción</label>
              <textarea
                value={streamDescription}
                onChange={(e) => setStreamDescription(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-neon-green focus:outline-none resize-none"
                rows={2}
                placeholder="¿De qué tratará la clase?"
              />
            </div>

            {/* Community Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Comunidad *</label>
              <select
                value={selectedCommunity}
                onChange={(e) => setSelectedCommunity(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-neon-green focus:outline-none"
              >
                <option value="">Selecciona una comunidad</option>
                {availableCommunities.map(community => (
                  <option key={community.id} value={community.id}>{community.name}</option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-1">Solo los suscriptores de esta comunidad podrán unirse</p>
            </div>

            {/* Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Máx. participantes</label>
                <select
                  value={maxParticipants}
                  onChange={(e) => setMaxParticipants(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-neon-green focus:outline-none"
                >
                  <option value={10}>10 participantes</option>
                  <option value={25}>25 participantes</option>
                  <option value={50}>50 participantes</option>
                  <option value={100}>100 participantes</option>
                </select>
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <input
                  type="checkbox"
                  id="requiresApproval"
                  checked={requiresApproval}
                  onChange={(e) => setRequiresApproval(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="requiresApproval" className="text-sm text-gray-300">Aprobar participantes</label>
              </div>
            </div>

            {/* Info */}
            <Card className="bg-blue-500/10 border-blue-500/30">
              <CardContent className="p-3 flex items-start space-x-2">
                <Lock className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-300">
                  <p className="font-medium">Clase privada</p>
                  <p className="text-blue-400/80">Se generará una URL y código de acceso únicos. Solo los miembros de la comunidad seleccionada podrán unirse.</p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end space-x-2 pt-2">
              <CyberButton variant="outline" onClick={onClose}>Cancelar</CyberButton>
              <CyberButton onClick={startClass}>
                <Play className="w-4 h-4 mr-1" />
                Iniciar Clase
              </CyberButton>
            </div>
          </div>
        ) : (
          /* Streaming View */
          <div className="space-y-4">
            {/* Access Info */}
            <Card className="bg-neon-green/10 border-neon-green/30">
              <CardContent className="p-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Key className="w-4 h-4 text-neon-green" />
                      <span className="text-gray-300 text-sm">Código:</span>
                      <code className="bg-gray-800 px-2 py-1 rounded text-neon-green font-mono">{accessCode}</code>
                      <button onClick={() => copyToClipboard(accessCode, 'Código')} className="text-gray-400 hover:text-white">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link2 className="w-4 h-4 text-neon-green" />
                      <button onClick={() => copyToClipboard(streamUrl, 'URL')} className="text-neon-green hover:underline text-sm">
                        Copiar enlace
                      </button>
                    </div>
                  </div>
                  <Badge className="bg-gray-700">
                    <Users className="w-3 h-3 mr-1" />
                    {participants.length + 1}/{maxParticipants}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Video Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Main Video (Host) */}
              <div className="lg:col-span-3">
                <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                  <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                  {!isVideoEnabled && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                      <Avatar className="w-24 h-24">
                        <AvatarFallback className="bg-gradient-to-br from-neon-green to-neon-blue text-white text-3xl">TÚ</AvatarFallback>
                      </Avatar>
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded text-white text-sm flex items-center space-x-1">
                    <Badge className="bg-yellow-500 text-black text-xs">Host</Badge>
                    <span>Tú</span>
                    {!isAudioEnabled && <MicOff className="w-3 h-3 text-red-400" />}
                  </div>
                </div>
              </div>

              {/* Participants */}
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                <h4 className="text-white text-sm font-medium">Participantes ({participants.length})</h4>
                {participants.length === 0 ? (
                  <p className="text-gray-400 text-sm">Esperando participantes...</p>
                ) : (
                  participants.map(p => (
                    <div key={p.id} className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video">
                      {p.isVideoOff ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={p.avatar} />
                            <AvatarFallback>{p.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        </div>
                      ) : (
                        <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" />
                      )}
                      <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between">
                        <span className="text-white text-xs bg-black/70 px-1 rounded truncate">{p.name}</span>
                        {p.isMuted && <MicOff className="w-3 h-3 text-red-400" />}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center space-x-3 pt-2">
              <CyberButton onClick={toggleAudio} className={`p-3 rounded-full ${!isAudioEnabled ? 'bg-red-600' : 'bg-gray-700'}`}>
                {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </CyberButton>
              <CyberButton onClick={toggleVideo} className={`p-3 rounded-full ${!isVideoEnabled ? 'bg-red-600' : 'bg-gray-700'}`}>
                {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </CyberButton>
              <CyberButton onClick={() => setIsScreenSharing(!isScreenSharing)} className={`p-3 rounded-full ${isScreenSharing ? 'bg-neon-green text-black' : 'bg-gray-700'}`}>
                {isScreenSharing ? <MonitorOff className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
              </CyberButton>
              <CyberButton onClick={() => setViewMode(viewMode === 'grid' ? 'speaker' : 'grid')} className="p-3 rounded-full bg-gray-700">
                {viewMode === 'grid' ? <UserIcon className="w-5 h-5" /> : <Grid3X3 className="w-5 h-5" />}
              </CyberButton>
              <CyberButton onClick={endClass} className="p-3 rounded-full bg-red-600 hover:bg-red-700">
                <Square className="w-5 h-5" />
              </CyberButton>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
