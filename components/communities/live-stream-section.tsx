'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CyberButton } from '@/components/ui/cyber-button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Radio,
  Users,
  Eye,
  Clock,
  Play,
  Maximize,
  Volume2,
  MessageSquare,
  Heart,
  Share2,
  Settings
} from 'lucide-react';

interface LiveStreamData {
  isLive: boolean;
  title: string;
  instructor: string;
  instructorAvatar?: string;
  viewers: number;
  duration: string;
  thumbnail: string;
  description?: string;
  category?: string;
}

interface LiveStreamSectionProps {
  streamData: LiveStreamData;
  communityName: string;
  onJoinStream?: () => void;
}

export function LiveStreamSection({ streamData, communityName, onJoinStream }: LiveStreamSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [likes, setLikes] = useState(156);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleJoinStream = () => {
    if (onJoinStream) {
      onJoinStream();
    } else {
      // Simular unirse al stream
      window.open('/meeting/live-stream', '_blank');
    }
  };

  if (!streamData.isLive) {
    return (
      <Card className="glass-card">
        <CardContent className="p-6 text-center">
          <Radio className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No hay transmisión en vivo
          </h3>
          <p className="text-gray-400 mb-4">
            Las clases en vivo aparecerán aquí cuando estén activas
          </p>
          <CyberButton variant="outline">
            Ver horario de clases
          </CyberButton>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card overflow-hidden">
      <CardContent className="p-0">
        {/* Stream Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Radio className="w-6 h-6 text-red-500" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <Badge className="bg-red-500 text-white mb-1">
                  EN VIVO
                </Badge>
                <h3 className="text-lg font-bold text-white">
                  {streamData.title}
                </h3>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <Eye className="w-4 h-4" />
              <span>{streamData.viewers.toLocaleString()} espectadores</span>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-300">
            <div className="flex items-center space-x-2">
              <Avatar className="w-6 h-6">
                <AvatarImage src={streamData.instructorAvatar || '/api/placeholder/40/40'} />
                <AvatarFallback className="bg-gradient-to-br from-neon-green to-neon-blue text-white text-xs">
                  {streamData.instructor.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">{streamData.instructor}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{streamData.duration}</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {communityName}
            </Badge>
          </div>
        </div>

        {/* Video Player */}
        <div className="relative bg-black aspect-video">
          <img
            src={streamData.thumbnail}
            alt={streamData.title}
            className="w-full h-full object-cover"
          />
          
          {/* Play Overlay */}
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center group hover:bg-black/20 transition-colors">
            <CyberButton
              onClick={handleJoinStream}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg font-semibold"
            >
              <Play className="w-6 h-6 mr-2" />
              Unirse a la clase en vivo
            </CyberButton>
          </div>

          {/* Live Indicator */}
          <div className="absolute top-4 left-4">
            <Badge className="bg-red-500 text-white flex items-center space-x-2 px-3 py-1">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="font-semibold">EN VIVO</span>
            </Badge>
          </div>

          {/* Duration */}
          <div className="absolute top-4 right-4">
            <Badge className="bg-black/70 text-white">
              {streamData.duration}
            </Badge>
          </div>

          {/* Controls Overlay */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center space-x-2">
              <CyberButton size="sm" variant="outline" className="bg-black/50 border-white/20">
                <Volume2 className="w-4 h-4" />
              </CyberButton>
              <CyberButton size="sm" variant="outline" className="bg-black/50 border-white/20">
                <Settings className="w-4 h-4" />
              </CyberButton>
            </div>
            
            <CyberButton size="sm" variant="outline" className="bg-black/50 border-white/20">
              <Maximize className="w-4 h-4" />
            </CyberButton>
          </div>
        </div>

        {/* Stream Actions */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  isLiked 
                    ? 'bg-red-500/20 text-red-400' 
                    : 'hover:bg-gray-800 text-gray-300'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                <span className="font-medium">{likes}</span>
              </button>
              
              <button className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-800 text-gray-300 transition-colors">
                <MessageSquare className="w-5 h-5" />
                <span className="font-medium">Chat</span>
              </button>
              
              <button className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-800 text-gray-300 transition-colors">
                <Share2 className="w-5 h-5" />
                <span className="font-medium">Compartir</span>
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-neon-green border-neon-green">
                <Users className="w-3 h-3 mr-1" />
                {streamData.viewers} en vivo
              </Badge>
            </div>
          </div>
        </div>

        {/* Stream Description */}
        {streamData.description && (
          <div className="p-4">
            <div className={`text-gray-300 text-sm ${!isExpanded ? 'line-clamp-2' : ''}`}>
              {streamData.description}
            </div>
            {streamData.description.length > 100 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-neon-blue text-sm mt-2 hover:underline"
              >
                {isExpanded ? 'Ver menos' : 'Ver más'}
              </button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}