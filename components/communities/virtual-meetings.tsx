'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CyberButton } from '@/components/ui/cyber-button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Video, 
  Calendar, 
  Clock, 
  Users, 
  Plus,
  Settings,
  Mic,
  MicOff,
  VideoOff,
  Phone,
  Share2,
  MessageSquare,
  MoreVertical
} from 'lucide-react';

interface Meeting {
  id: string;
  title: string;
  description: string;
  scheduledAt: string;
  duration: number; // en minutos
  hostId: string;
  hostName: string;
  hostAvatar: string;
  participants: number;
  maxParticipants: number;
  status: 'scheduled' | 'live' | 'ended';
  isRecurring: boolean;
  meetingUrl?: string;
  tags: string[];
}

interface VirtualMeetingsProps {
  communityId: string;
  isOwner: boolean;
  isMember: boolean;
  isPremium: boolean;
  onCreateMeeting?: () => void;
}

const mockMeetings: Meeting[] = [
  {
    id: '1',
    title: 'Introducción a React Hooks',
    description: 'Aprenderemos los conceptos básicos de useState, useEffect y custom hooks',
    scheduledAt: '2024-01-25T19:00:00Z',
    duration: 90,
    hostId: 'host1',
    hostName: 'Carlos Mendoza',
    hostAvatar: '/api/placeholder/40/40',
    participants: 23,
    maxParticipants: 50,
    status: 'scheduled',
    isRecurring: false,
    tags: ['React', 'Hooks', 'Principiantes']
  },
  {
    id: '2',
    title: 'Sesión de Q&A - Desarrollo Backend',
    description: 'Resuelve tus dudas sobre Node.js, APIs y bases de datos',
    scheduledAt: '2024-01-24T20:30:00Z',
    duration: 60,
    hostId: 'host2',
    hostName: 'Ana García',
    hostAvatar: '/api/placeholder/40/40',
    participants: 15,
    maxParticipants: 30,
    status: 'live',
    isRecurring: true,
    meetingUrl: 'https://meet.soshabilidoso.com/room/abc123',
    tags: ['Backend', 'Q&A', 'Node.js']
  },
  {
    id: '3',
    title: 'Workshop: Diseño de APIs REST',
    description: 'Taller práctico sobre mejores prácticas en el diseño de APIs',
    scheduledAt: '2024-01-23T18:00:00Z',
    duration: 120,
    hostId: 'host1',
    hostName: 'Carlos Mendoza',
    hostAvatar: '/api/placeholder/40/40',
    participants: 45,
    maxParticipants: 50,
    status: 'ended',
    isRecurring: false,
    tags: ['API', 'REST', 'Workshop']
  }
];

export function VirtualMeetings({ communityId, isOwner, isMember, isPremium, onCreateMeeting }: VirtualMeetingsProps) {
  const [meetings, setMeetings] = useState<Meeting[]>(mockMeetings);
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'live' | 'ended'>('all');

  const filteredMeetings = meetings.filter(meeting => {
    if (filter === 'all') return true;
    return meeting.status === filter;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: Meeting['status']) => {
    switch (status) {
      case 'live':
        return 'bg-red-500 text-white';
      case 'scheduled':
        return 'bg-blue-500 text-white';
      case 'ended':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusText = (status: Meeting['status']) => {
    switch (status) {
      case 'live':
        return 'EN VIVO';
      case 'scheduled':
        return 'PROGRAMADA';
      case 'ended':
        return 'FINALIZADA';
      default:
        return 'DESCONOCIDO';
    }
  };

  const handleJoinMeeting = (meeting: Meeting) => {
    if (meeting.status === 'live') {
      // Redirigir a la sala de reuniones
      window.location.href = `/meeting/${meeting.id}`;
    }
  };

  if (!isPremium) {
    return (
      <div className="text-center py-12">
        <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-white mb-2">
          Reuniones Virtuales Premium
        </h3>
        <p className="text-gray-400 mb-6">
          Las reuniones virtuales están disponibles solo para comunidades premium.
        </p>
        <CyberButton>
          Actualizar a Premium
        </CyberButton>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Reuniones Virtuales</h2>
          <p className="text-gray-400">
            Participa en sesiones en vivo con otros miembros de la comunidad
          </p>
        </div>
        
        {(isOwner || isMember) && (
          <CyberButton
            onClick={onCreateMeeting}
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Reunión</span>
          </CyberButton>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'live', 'scheduled', 'ended'] as const).map((filterOption) => (
          <CyberButton
            key={filterOption}
            variant={filter === filterOption ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter(filterOption)}
          >
            {filterOption === 'all' && 'Todas'}
            {filterOption === 'live' && 'En Vivo'}
            {filterOption === 'scheduled' && 'Programadas'}
            {filterOption === 'ended' && 'Finalizadas'}
          </CyberButton>
        ))}
      </div>

      {/* Meetings List */}
      <div className="grid gap-4">
        {filteredMeetings.map((meeting) => (
          <Card key={meeting.id} className="glass-card">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {meeting.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-2">
                        {meeting.description}
                      </p>
                    </div>
                    <Badge className={getStatusColor(meeting.status)}>
                      {getStatusText(meeting.status)}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-3">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(meeting.scheduledAt)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{meeting.duration} min</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{meeting.participants}/{meeting.maxParticipants}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={meeting.hostAvatar} />
                        <AvatarFallback className="bg-gradient-to-br from-neon-green to-neon-blue text-white text-xs">
                          {meeting.hostName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-300">
                        Host: {meeting.hostName}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {meeting.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 lg:ml-4">
                  {meeting.status === 'live' && (
                    <CyberButton
                      onClick={() => handleJoinMeeting(meeting)}
                      className="flex items-center space-x-2 bg-red-600 hover:bg-red-700"
                    >
                      <Video className="w-4 h-4" />
                      <span>Unirse Ahora</span>
                    </CyberButton>
                  )}
                  
                  {meeting.status === 'scheduled' && (
                    <CyberButton
                      variant="outline"
                      className="flex items-center space-x-2"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Recordar</span>
                    </CyberButton>
                  )}

                  {meeting.status === 'ended' && (
                    <CyberButton
                      variant="outline"
                      className="flex items-center space-x-2"
                    >
                      <Video className="w-4 h-4" />
                      <span>Ver Grabación</span>
                    </CyberButton>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMeetings.length === 0 && (
        <div className="text-center py-12">
          <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">
            No hay reuniones {filter !== 'all' ? getStatusText(filter as Meeting['status']).toLowerCase() : ''}
          </h3>
          <p className="text-gray-400">
            {isOwner || isMember 
              ? 'Crea la primera reunión para esta comunidad.'
              : 'Las reuniones aparecerán aquí cuando estén programadas.'
            }
          </p>
        </div>
      )}
    </div>
  );
}