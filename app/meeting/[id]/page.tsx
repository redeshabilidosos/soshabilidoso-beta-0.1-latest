'use client';

// Forzar renderizado dinámico para evitar error en build
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/providers/providers';
import { MeetingRoom } from '@/components/communities/meeting-room';
import { useNotificationSound } from '@/hooks/use-notification-sound';

// Mock meeting data
const mockMeetingData: Record<string, any> = {
  '1': {
    id: '1',
    title: 'Introducción a React Hooks',
    description: 'Aprenderemos los conceptos básicos de useState, useEffect y custom hooks',
    communityId: '1',
    communityName: 'Desarrollo Web Avanzado'
  },
  '2': {
    id: '2',
    title: 'Sesión de Q&A - Desarrollo Backend',
    description: 'Resuelve tus dudas sobre Node.js, APIs y bases de datos',
    communityId: '1',
    communityName: 'Desarrollo Web Avanzado'
  }
};

export default function MeetingPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const isHost = searchParams.get('host') === 'true';
  const [meeting, setMeeting] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Hook para sonidos
  const { playLeaveMeetingSound } = useNotificationSound();

  useEffect(() => {
    // Solo redirigir si ya terminó de cargar la autenticación y no hay usuario
    if (!authLoading && !user) {
      router.push('/');
      return;
    }

    // Solo cargar datos si hay usuario autenticado
    if (!user) return;

    const meetingId = params.id as string;
    
    // Primero buscar en streams activos (localStorage)
    const activeStreams = JSON.parse(localStorage.getItem('active_streams') || '[]');
    const liveStream = activeStreams.find((s: any) => s.id === meetingId);
    
    if (liveStream) {
      setMeeting({
        id: liveStream.id,
        title: liveStream.title,
        description: liveStream.description,
        communityId: liveStream.communityId,
        communityName: liveStream.communityName,
        hostId: liveStream.hostId,
        hostName: liveStream.hostName,
        hostAvatar: liveStream.hostAvatar,
        isPrivate: liveStream.isPrivate,
        isLive: true,
        isHost: isHost || liveStream.hostId === user.id
      });
    } else {
      // Buscar en mock data
      const meetingData = mockMeetingData[meetingId];
      if (meetingData) {
        setMeeting(meetingData);
      }
    }
    
    setIsLoading(false);
  }, [user, authLoading, router, params.id, isHost]);

  const handleLeaveMeeting = () => {
    // Reproducir sonido de salida
    playLeaveMeetingSound();
    
    // Pequeño delay para que se escuche el sonido
    setTimeout(() => {
      // Redirigir de vuelta a la comunidad
      if (meeting?.communityId) {
        router.push(`/communities/${meeting.communityId}`);
      } else {
        router.push('/communities');
      }
    }, 300);
  };

  if (authLoading || !user || isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Cargando reunión...</div>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-xl font-bold mb-2">Reunión no encontrada</h2>
          <button
            onClick={() => router.push('/communities')}
            className="text-neon-blue hover:underline"
          >
            Volver a Comunidades
          </button>
        </div>
      </div>
    );
  }

  return (
    <MeetingRoom
      meetingId={meeting.id}
      meetingTitle={meeting.title}
      onLeaveMeeting={handleLeaveMeeting}
    />
  );
}