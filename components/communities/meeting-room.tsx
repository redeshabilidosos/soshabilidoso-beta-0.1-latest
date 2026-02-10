'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CyberButton } from '@/components/ui/cyber-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useNotificationSound } from '@/hooks/use-notification-sound';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff,
  Settings,
  Users,
  MessageSquare,
  Share2,
  Monitor,
  Hand,
  MoreVertical,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Grid3X3,
  User
} from 'lucide-react';

interface Participant {
  id: string;
  name: string;
  avatar: string;
  isHost: boolean;
  isMuted: boolean;
  isVideoOff: boolean;
  isHandRaised: boolean;
  isSpeaking: boolean;
}

interface MeetingRoomProps {
  meetingId: string;
  meetingTitle: string;
  onLeaveMeeting: () => void;
}

const mockParticipants: Participant[] = [
  {
    id: '1',
    name: 'Carlos Mendoza (Tú)',
    avatar: '/api/placeholder/40/40',
    isHost: true,
    isMuted: false,
    isVideoOff: false,
    isHandRaised: false,
    isSpeaking: true
  },
  {
    id: '2',
    name: 'Ana García',
    avatar: '/api/placeholder/40/40',
    isHost: false,
    isMuted: false,
    isVideoOff: false,
    isHandRaised: true,
    isSpeaking: false
  },
  {
    id: '3',
    name: 'Luis Rodríguez',
    avatar: '/api/placeholder/40/40',
    isHost: false,
    isMuted: true,
    isVideoOff: false,
    isHandRaised: false,
    isSpeaking: false
  },
  {
    id: '4',
    name: 'María López',
    avatar: '/api/placeholder/40/40',
    isHost: false,
    isMuted: false,
    isVideoOff: true,
    isHandRaised: false,
    isSpeaking: false
  }
];

export function MeetingRoom({ meetingId, meetingTitle, onLeaveMeeting }: MeetingRoomProps) {
  const [participants, setParticipants] = useState<Participant[]>(mockParticipants);
  const [isMuted, setIsMuted] = useState(false);
  
  // Hook para sonidos
  const { playLeaveMeetingSound } = useNotificationSound();
  
  // Función para salir con sonido
  const handleLeaveWithSound = () => {
    playLeaveMeetingSound();
    // Pequeño delay para que se escuche el sonido antes de salir
    setTimeout(() => {
      onLeaveMeeting();
    }, 300);
  };
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'speaker'>('grid');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentUser = participants.find(p => p.name.includes('(Tú)'));
  const otherParticipants = participants.filter(p => !p.name.includes('(Tú)'));

  const toggleMute = () => {
    setIsMuted(!isMuted);
    setParticipants(prev => 
      prev.map(p => 
        p.name.includes('(Tú)') ? { ...p, isMuted: !isMuted } : p
      )
    );
  };

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    setParticipants(prev => 
      prev.map(p => 
        p.name.includes('(Tú)') ? { ...p, isVideoOff: !isVideoOff } : p
      )
    );
  };

  const toggleHandRaise = () => {
    setIsHandRaised(!isHandRaised);
    setParticipants(prev => 
      prev.map(p => 
        p.name.includes('(Tú)') ? { ...p, isHandRaised: !isHandRaised } : p
      )
    );
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const renderParticipantVideo = (participant: Participant, isMain = false) => (
    <div 
      key={participant.id}
      className={`relative bg-gray-900 rounded-lg overflow-hidden ${
        isMain ? 'aspect-video' : 'aspect-square'
      } ${participant.isSpeaking ? 'ring-2 ring-neon-green' : ''}`}
    >
      {participant.isVideoOff ? (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
          <Avatar className={isMain ? 'w-20 h-20' : 'w-12 h-12'}>
            <AvatarImage src={participant.avatar} />
            <AvatarFallback className="bg-gradient-to-br from-neon-green to-neon-blue text-white">
              {participant.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
      ) : (
        <video
          ref={participant.name.includes('(Tú)') ? videoRef : undefined}
          className="w-full h-full object-cover"
          autoPlay
          muted={participant.name.includes('(Tú)')}
          poster={participant.avatar}
        />
      )}

      {/* Participant Info */}
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className={`text-white text-sm font-medium px-2 py-1 rounded ${
            participant.isSpeaking ? 'bg-neon-green/20' : 'bg-black/50'
          }`}>
            {participant.name}
          </span>
          {participant.isHost && (
            <Badge className="bg-yellow-500 text-black text-xs">Host</Badge>
          )}
        </div>

        <div className="flex items-center space-x-1">
          {participant.isMuted && (
            <div className="bg-red-500 p-1 rounded">
              <MicOff className="w-3 h-3 text-white" />
            </div>
          )}
          {participant.isHandRaised && (
            <div className="bg-yellow-500 p-1 rounded">
              <Hand className="w-3 h-3 text-black" />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900/90 backdrop-blur-sm p-4 flex items-center justify-between">
        <div>
          <h1 className="text-white font-semibold">{meetingTitle}</h1>
          <p className="text-gray-400 text-sm">{participants.length} participantes</p>
        </div>

        <div className="flex items-center space-x-2">
          <CyberButton
            variant="outline"
            size="sm"
            onClick={() => setShowParticipants(!showParticipants)}
            className="flex items-center space-x-2"
          >
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">{participants.length}</span>
          </CyberButton>

          <CyberButton
            variant="outline"
            size="sm"
            onClick={() => setShowChat(!showChat)}
            className="flex items-center space-x-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Chat</span>
          </CyberButton>

          <CyberButton
            variant="outline"
            size="sm"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </CyberButton>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Video Area */}
        <div className="flex-1 p-4">
          {viewMode === 'grid' ? (
            <div className={`grid gap-4 h-full ${
              participants.length <= 2 ? 'grid-cols-1 lg:grid-cols-2' :
              participants.length <= 4 ? 'grid-cols-2' :
              participants.length <= 9 ? 'grid-cols-3' : 'grid-cols-4'
            }`}>
              {participants.map(participant => renderParticipantVideo(participant))}
            </div>
          ) : (
            <div className="h-full flex flex-col">
              {/* Main Speaker */}
              <div className="flex-1 mb-4">
                {renderParticipantVideo(
                  participants.find(p => p.isSpeaking) || participants[0], 
                  true
                )}
              </div>
              
              {/* Other Participants */}
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {otherParticipants.map(participant => (
                  <div key={participant.id} className="flex-shrink-0 w-32">
                    {renderParticipantVideo(participant)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Participants Panel */}
        {showParticipants && (
          <div className="w-80 bg-gray-900/90 backdrop-blur-sm p-4 border-l border-gray-700">
            <h3 className="text-white font-semibold mb-4">
              Participantes ({participants.length})
            </h3>
            <div className="space-y-2">
              {participants.map(participant => (
                <div key={participant.id} className="flex items-center justify-between p-2 rounded hover:bg-gray-800/50">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={participant.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-neon-green to-neon-blue text-white text-xs">
                        {participant.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-white text-sm">{participant.name}</p>
                      {participant.isHost && (
                        <Badge className="bg-yellow-500 text-black text-xs">Host</Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    {participant.isMuted && <MicOff className="w-4 h-4 text-red-400" />}
                    {participant.isHandRaised && <Hand className="w-4 h-4 text-yellow-400" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat Panel */}
        {showChat && (
          <div className="w-80 bg-gray-900/90 backdrop-blur-sm p-4 border-l border-gray-700 flex flex-col">
            <h3 className="text-white font-semibold mb-4">Chat</h3>
            <div className="flex-1 bg-gray-800/50 rounded p-3 mb-4 overflow-y-auto">
              <p className="text-gray-400 text-sm text-center">
                El chat aparecerá aquí durante la reunión
              </p>
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Escribe un mensaje..."
                className="flex-1 bg-gray-800 text-white px-3 py-2 rounded border border-gray-600 focus:border-neon-blue focus:outline-none"
              />
              <CyberButton size="sm">Enviar</CyberButton>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-gray-900/90 backdrop-blur-sm p-4">
        <div className="flex items-center justify-center space-x-4">
          {/* Mute Button */}
          <CyberButton
            onClick={toggleMute}
            className={`p-3 rounded-full ${
              isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </CyberButton>

          {/* Video Button */}
          <CyberButton
            onClick={toggleVideo}
            className={`p-3 rounded-full ${
              isVideoOff ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </CyberButton>

          {/* Screen Share */}
          <CyberButton
            onClick={toggleScreenShare}
            className={`p-3 rounded-full ${
              isScreenSharing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <Monitor className="w-5 h-5" />
          </CyberButton>

          {/* Raise Hand */}
          <CyberButton
            onClick={toggleHandRaise}
            className={`p-3 rounded-full ${
              isHandRaised ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <Hand className="w-5 h-5" />
          </CyberButton>

          {/* View Mode */}
          <CyberButton
            onClick={() => setViewMode(viewMode === 'grid' ? 'speaker' : 'grid')}
            className="p-3 rounded-full bg-gray-700 hover:bg-gray-600"
          >
            {viewMode === 'grid' ? <User className="w-5 h-5" /> : <Grid3X3 className="w-5 h-5" />}
          </CyberButton>

          {/* Settings */}
          <CyberButton className="p-3 rounded-full bg-gray-700 hover:bg-gray-600">
            <Settings className="w-5 h-5" />
          </CyberButton>

          {/* Leave Meeting */}
          <CyberButton
            onClick={handleLeaveWithSound}
            className="p-3 rounded-full bg-red-600 hover:bg-red-700"
          >
            <PhoneOff className="w-5 h-5" />
          </CyberButton>
        </div>
      </div>
    </div>
  );
}