'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { MessageCircle, X } from 'lucide-react';
import { useAuth } from '@/components/providers/providers';
import { messagingService } from '@/lib/services/messaging.service';
import { useNotificationSound } from '@/hooks/use-notification-sound';

export default function FloatingChatButton() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [position, setPosition] = useState({ x: 20, y: 200 });
  const [mounted, setMounted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const buttonRef = useRef<HTMLDivElement>(null);
  const previousCountRef = useRef(0);

  // Hook para sonidos
  const { playMessageSound } = useNotificationSound({ enabled: true });

  // Umbral mínimo de movimiento para considerar que es un drag (en píxeles)
  const DRAG_THRESHOLD = 5;

  // Ocultar en la página de mensajes
  const isMessagesPage = pathname === '/messages' || pathname?.startsWith('/messages/');

  // Configurar posición inicial después del montaje (parte superior derecha)
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      setPosition({
        x: window.innerWidth - 80,
        y: 80 // Parte superior
      });
    }
  }, []);

  // Obtener conteo de mensajes no leídos
  useEffect(() => {
    if (!user) return;

    const fetchUnreadCount = async () => {
      try {
        const chats = await messagingService.getChats();
        const totalUnread = chats.results.reduce((sum, chat) => sum + (chat.unread_count || 0), 0);
        
        // Si hay más mensajes no leídos que antes, reproducir sonido
        if (totalUnread > previousCountRef.current && previousCountRef.current > 0) {
          console.log('🔊 Nuevo mensaje no leído detectado');
          playMessageSound();
        }
        
        previousCountRef.current = totalUnread;
        setUnreadCount(totalUnread);
      } catch (error) {
        console.error('Error al obtener mensajes no leídos:', error);
      }
    };

    // Cargar inmediatamente
    fetchUnreadCount();

    // Actualizar cada 5 segundos
    const interval = setInterval(fetchUnreadCount, 5000);

    return () => clearInterval(interval);
  }, [user, playMessageSound]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setHasMoved(false); // Resetear al iniciar
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;

    // Detectar si el movimiento supera el umbral
    const deltaX = Math.abs(newX - position.x);
    const deltaY = Math.abs(newY - position.y);
    
    if (deltaX > DRAG_THRESHOLD || deltaY > DRAG_THRESHOLD) {
      setHasMoved(true);
    }

    // Limitar el movimiento dentro de la ventana
    const maxX = window.innerWidth - 60;
    const maxY = window.innerHeight - 60;

    setPosition({
      x: Math.max(10, Math.min(newX, maxX)),
      y: Math.max(10, Math.min(newY, maxY))
    });
  };

  const handleMouseUp = () => {
    // Solo navegar si NO hubo movimiento (fue un click directo)
    if (!hasMoved && isDragging) {
      router.push('/messages');
    }
    setIsDragging(false);
    setHasMoved(false);
  };

  // Agregar event listeners para el drag
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, hasMoved]);

  // No mostrar si no hay usuario logueado, no está montado, o está en la página de mensajes
  if (!user || !mounted || isMessagesPage) return null;

  // Manejar el drag en móvil
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setHasMoved(false);
    setDragStart({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();

    const touch = e.touches[0];
    const newX = touch.clientX - dragStart.x;
    const newY = touch.clientY - dragStart.y;

    // Detectar si el movimiento supera el umbral
    const deltaX = Math.abs(newX - position.x);
    const deltaY = Math.abs(newY - position.y);
    
    if (deltaX > DRAG_THRESHOLD || deltaY > DRAG_THRESHOLD) {
      setHasMoved(true);
    }

    const maxX = window.innerWidth - 60;
    const maxY = window.innerHeight - 60;

    setPosition({
      x: Math.max(10, Math.min(newX, maxX)),
      y: Math.max(10, Math.min(newY, maxY))
    });
  };

  const handleTouchEnd = () => {
    if (!hasMoved && isDragging) {
      router.push('/messages');
    }
    setIsDragging(false);
    setHasMoved(false);
  };

  return (
    <>
      {/* Botón flotante principal */}
      <div
        ref={buttonRef}
        className={`fixed z-[9999] select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          touchAction: 'none',
          padding: '8px' // Espacio para el indicador de notificación
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative group">
          {/* Botón principal */}
          <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-neon-green to-neon-blue rounded-full transition-all duration-300 flex items-center justify-center active:scale-95 border-2 border-white/20 overflow-hidden hover:brightness-110 shadow-lg shadow-neon-green/30">
            <MessageCircle className="w-6 h-6 md:w-7 md:h-7 text-white" />
          </div>

          {/* Indicador de mensajes no leídos - solo mostrar si hay mensajes */}
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 min-w-[20px] h-5 md:min-w-[24px] md:h-6 bg-red-500 rounded-full flex items-center justify-center border-2 border-black animate-pulse px-1">
              <span className="text-white text-[10px] md:text-xs font-bold">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            </div>
          )}

          {/* Tooltip - solo en desktop */}
          <div className="hidden md:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-black/90 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
            Mensajes
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90"></div>
          </div>
        </div>
      </div>
    </>
  );
}