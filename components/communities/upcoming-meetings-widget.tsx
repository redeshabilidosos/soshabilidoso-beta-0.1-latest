'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CyberButton } from '@/components/ui/cyber-button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Video, 
  Calendar, 
  Clock, 
  Users,
  ArrowRight,
  Bell
} from 'lucide-react';

interface UpcomingMeeting {
  id: string;
  title: string;
  communityName: string;
  communityId: string;
  scheduledAt: string;
  duration: number;
  hostName: string;
  hostAvatar: string;
  participants: number;
  status: 'scheduled' | 'live';
  isJoined: boolean;
}

// Simulamos que el usuario no tiene suscripciones activas por defecto
const mockUpcomingMeetings: UpcomingMeeting[] = [];

interface UpcomingMeetingsWidgetProps {
  userSubscriptions?: string[]; // IDs de comunidades suscritas
  showIfEmpty?: boolean; // Mostrar widget aunque esté vacío
}

export function UpcomingMeetingsWidget({ 
  userSubscriptions = [], 
  showIfEmpty = false 
}: UpcomingMeetingsWidgetProps = {}) {
  // Solo mostrar reuniones de comunidades a las que el usuario está suscrito
  const [allMeetings] = useState<UpcomingMeeting[]>([
    // Estas reuniones solo aparecerán si el usuario está suscrito a las comunidades
    {
      id: '1',
      title: 'Introducción a React Hooks',
      communityName: 'Desarrollo Web Avanzado',
      communityId: '1',
      scheduledAt: '2024-01-25T19:00:00Z',
      duration: 90,
      hostName: 'Carlos Mendoza',
      hostAvatar: '/api/placeholder/40/40',
      participants: 23,
      status: 'scheduled',
      isJoined: true
    },
    {
      id: '2',
      title: 'Sesión de Q&A - Backend',
      communityName: 'Desarrollo Web Avanzado',
      communityId: '1',
      scheduledAt: '2024-01-24T20:30:00Z',
      duration: 60,
      hostName: 'Ana García',
      hostAvatar: '/api/placeholder/40/40',
      participants: 15,
      status: 'live',
      isJoined: true
    }
  ]);

  // Filtrar reuniones basado en suscripciones del usuario
  const meetings = allMeetings.filter(meeting => 
    userSubscriptions.includes(meeting.communityId)
  );

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((date.getTime() - now.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 0) {
      return 'En curso';
    } else if (diffInMinutes < 60) {
      return `En ${diffInMinutes} min`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `En ${hours}h`;
    } else {
      return date.toLocaleDateString('es-ES', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const handleJoinMeeting = (meeting: UpcomingMeeting) => {
    if (meeting.status === 'live') {
      window.location.href = `/meeting/${meeting.id}`;
    }
  };

  const handleViewCommunity = (communityId: string) => {
    window.location.href = `/communities/${communityId}`;
  };

  // No mostrar el widget si no hay reuniones y showIfEmpty es false
  if (meetings.length === 0 && !showIfEmpty) {
    return null;
  }

  // Mostrar mensaje si no hay reuniones pero showIfEmpty es true
  if (meetings.length === 0 && showIfEmpty) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Video className="w-5 h-5" />
            <span>Próximas Reuniones</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-400 text-sm mb-3">
              No tienes reuniones programadas
            </p>
            <CyberButton
              size="sm"
              variant="outline"
              onClick={() => window.location.href = '/communities'}
            >
              Explorar Comunidades
            </CyberButton>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-2">
            <Video className="w-5 h-5" />
            <span>Próximas Reuniones</span>
          </div>
          <Badge variant="outline" className="text-xs">
            {meetings.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {meetings.slice(0, 3).map((meeting) => (
          <div
            key={meeting.id}
            className="p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="text-white font-medium text-sm mb-1">
                  {meeting.title}
                </h4>
                <p className="text-gray-400 text-xs mb-2">
                  {meeting.communityName}
                </p>
              </div>
              {meeting.status === 'live' && (
                <Badge className="bg-red-500 text-white text-xs">
                  EN VIVO
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-gray-300 mb-3">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{formatTime(meeting.scheduledAt)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-3 h-3" />
                  <span>{meeting.participants}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                <Avatar className="w-4 h-4">
                  <AvatarImage src={meeting.hostAvatar} />
                  <AvatarFallback className="bg-gradient-to-br from-neon-green to-neon-blue text-white text-xs">
                    {meeting.hostName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span>{meeting.hostName}</span>
              </div>
            </div>

            <div className="flex space-x-2">
              {meeting.status === 'live' ? (
                <CyberButton
                  size="sm"
                  onClick={() => handleJoinMeeting(meeting)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-xs"
                >
                  <Video className="w-3 h-3 mr-1" />
                  Unirse
                </CyberButton>
              ) : (
                <CyberButton
                  size="sm"
                  variant="outline"
                  onClick={() => handleViewCommunity(meeting.communityId)}
                  className="flex-1 text-xs"
                >
                  <Bell className="w-3 h-3 mr-1" />
                  Recordar
                </CyberButton>
              )}
              
              <CyberButton
                size="sm"
                variant="outline"
                onClick={() => handleViewCommunity(meeting.communityId)}
                className="text-xs"
              >
                <ArrowRight className="w-3 h-3" />
              </CyberButton>
            </div>
          </div>
        ))}

        {meetings.length > 3 && (
          <div className="pt-2 border-t border-gray-700">
            <CyberButton
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={() => window.location.href = '/communities'}
            >
              Ver todas las reuniones
            </CyberButton>
          </div>
        )}
      </CardContent>
    </Card>
  );
}