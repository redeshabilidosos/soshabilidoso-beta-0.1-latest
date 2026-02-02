import { useCallback, useRef, useEffect } from 'react';

interface UseNotificationSoundOptions {
  enabled?: boolean;
  volume?: number; // 0.0 a 1.0
}

export function useNotificationSound(options: UseNotificationSoundOptions = {}) {
  const { enabled = true, volume = 0.5 } = options;
  
  const messageAudioRef = useRef<HTMLAudioElement | null>(null);
  const notificationAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Crear instancias de Audio solo en el cliente
    if (typeof window !== 'undefined') {
      messageAudioRef.current = new Audio('/sounds/sonidomensage.mp3');
      notificationAudioRef.current = new Audio('/sounds/sonidonotificacion.mp3');
      
      // Configurar volumen
      if (messageAudioRef.current) {
        messageAudioRef.current.volume = volume;
      }
      if (notificationAudioRef.current) {
        notificationAudioRef.current.volume = volume;
      }

      // Precargar los sonidos
      messageAudioRef.current?.load();
      notificationAudioRef.current?.load();
    }

    return () => {
      // Limpiar al desmontar
      messageAudioRef.current = null;
      notificationAudioRef.current = null;
    };
  }, [volume]);

  const playMessageSound = useCallback(() => {
    if (!enabled) return;
    
    try {
      if (messageAudioRef.current) {
        // Reiniciar el audio si ya está reproduciéndose
        messageAudioRef.current.currentTime = 0;
        messageAudioRef.current.play().catch(error => {
          console.warn('No se pudo reproducir el sonido de mensaje:', error);
        });
      }
    } catch (error) {
      console.warn('Error al reproducir sonido de mensaje:', error);
    }
  }, [enabled]);

  const playNotificationSound = useCallback(() => {
    if (!enabled) return;
    
    try {
      if (notificationAudioRef.current) {
        // Reiniciar el audio si ya está reproduciéndose
        notificationAudioRef.current.currentTime = 0;
        notificationAudioRef.current.play().catch(error => {
          console.warn('No se pudo reproducir el sonido de notificación:', error);
        });
      }
    } catch (error) {
      console.warn('Error al reproducir sonido de notificación:', error);
    }
  }, [enabled]);

  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    if (messageAudioRef.current) {
      messageAudioRef.current.volume = clampedVolume;
    }
    if (notificationAudioRef.current) {
      notificationAudioRef.current.volume = clampedVolume;
    }
  }, []);

  return {
    playMessageSound,
    playNotificationSound,
    setVolume,
  };
}
