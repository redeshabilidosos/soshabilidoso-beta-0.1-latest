'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CyberButton } from '@/components/ui/cyber-button';
import { Badge } from '@/components/ui/badge';
import { 
  Video, 
  Bell, 
  X, 
  Clock,
  Users,
  Calendar
} from 'lucide-react';

interface MeetingNotification {
  id: string;
  type: 'starting_soon' | 'live_now' | 'reminder';
  meetingId: string;
  meetingTitle: string;
  communityName: string;
  scheduledAt: string;
  timeUntilStart?: number; // minutos
  participants?: number;
}

interface MeetingNotificationsProps {
  userSubscriptions?: string[];
}

export function MeetingNotifications({ userSubscriptions = [] }: MeetingNotificationsProps) {
  // Solo mostrar notificaciones si el usuario está suscrito a comunidades
  const mockNotifications: MeetingNotification[] = userSubscriptions.length > 0 ? [
    {
      id: '1',
      type: 'starting_soon',
      meetingId: '2',
      meetingTitle: 'Sesión de Q&A - Backend',
      communityName: 'Desarrollo Web Avanzado',
      scheduledAt: '2024-01-24T20:30:00Z',
      timeUntilStart: 5,
      participants: 15
    },
    {
      id: '2',
      type: 'live_now',
      meetingId: '1',
      meetingTitle: 'Introducción a React Hooks',
      communityName: 'Desarrollo Web Avanzado',
      scheduledAt: '2024-01-24T19:00:00Z',
      participants: 23
    }
  ] : [];

  const [notifications, setNotifications] = useState<MeetingNotification[]>(mockNotifications);
  const [isVisible, setIsVisible] = useState(true);

  const dismissNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const joinMeeting = (meetingId: string) => {
    window.location.href = `/meeting/${meetingId}`;
  };

  const getNotificationColor = (type: MeetingNotification['type']) => {
    switch (type) {
      case 'live_now':
        return 'bg-red-500';
      case 'starting_soon':
        return 'bg-yellow-500';
      case 'reminder':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getNotificationText = (notification: MeetingNotification) => {
    switch (notification.type) {
      case 'live_now':
        return 'EN VIVO AHORA';
      case 'starting_soon':
        return `INICIA EN ${notification.timeUntilStart} MIN`;
      case 'reminder':
        return 'RECORDATORIO';
      default:
        return 'NOTIFICACIÓN';
    }
  };

  const getActionText = (type: MeetingNotification['type']) => {
    switch (type) {
      case 'live_now':
        return 'Unirse Ahora';
      case 'starting_soon':
        return 'Prepararse';
      case 'reminder':
        return 'Ver Detalles';
      default:
        return 'Ver';
    }
  };

  if (!isVisible || notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      {notifications.map((notification) => (
        <Card key={notification.id} className="glass-card border-l-4 border-l-neon-green">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Video className="w-4 h-4 text-neon-green" />
                <Badge className={`${getNotificationColor(notification.type)} text-white text-xs`}>
                  {getNotificationText(notification)}
                </Badge>
              </div>
              <button
                onClick={() => dismissNotification(notification.id)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mb-3">
              <h4 className="text-white font-medium text-sm mb-1">
                {notification.meetingTitle}
              </h4>
              <p className="text-gray-400 text-xs mb-2">
                {notification.communityName}
              </p>
              
              <div className="flex items-center space-x-3 text-xs text-gray-300">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>
                    {new Date(notification.scheduledAt).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                {notification.participants && (
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>{notification.participants}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-2">
              <CyberButton
                size="sm"
                onClick={() => joinMeeting(notification.meetingId)}
                className={`flex-1 text-xs ${
                  notification.type === 'live_now' 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : ''
                }`}
              >
                <Video className="w-3 h-3 mr-1" />
                {getActionText(notification.type)}
              </CyberButton>
              
              <CyberButton
                size="sm"
                variant="outline"
                onClick={() => dismissNotification(notification.id)}
                className="text-xs"
              >
                <Bell className="w-3 h-3" />
              </CyberButton>
            </div>
          </CardContent>
        </Card>
      ))}

      {notifications.length > 1 && (
        <div className="text-center">
          <CyberButton
            size="sm"
            variant="outline"
            onClick={() => setIsVisible(false)}
            className="text-xs"
          >
            Ocultar todas ({notifications.length})
          </CyberButton>
        </div>
      )}
    </div>
  );
}