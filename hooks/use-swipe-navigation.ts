"use client";

import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import * as anime from 'animejs';

// Orden de navegación de las tabs principales
const navigationOrder = [
  '/feed',
  '/clips',
  '/communities',
  '/users',
  '/notifications'
];

export function useSwipeNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const [showSwipeHint, setShowSwipeHint] = useState(false);

  useEffect(() => {
    // Mostrar hint de swipe solo en la primera visita
    const hasSeenHint = localStorage.getItem('swipe_hint_seen');
    if (!hasSeenHint && window.innerWidth < 1024) {
      setTimeout(() => {
        setShowSwipeHint(true);
        animateSwipeHint();
        setTimeout(() => {
          setShowSwipeHint(false);
          localStorage.setItem('swipe_hint_seen', 'true');
        }, 3000);
      }, 1000);
    }
  }, []);

  const animateSwipeHint = () => {
    const hand = document.getElementById('swipe-hint-hand');
    if (!hand) return;

    (anime as any)({
      targets: hand,
      translateX: [0, -150, 0],
      opacity: [0, 1, 1, 0],
      duration: 2500,
      easing: 'easeInOutQuad',
      loop: false
    });
  };

  const handleSwipe = () => {
    const swipeDistance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    console.log('🔍 Swipe detectado:', {
      startX: touchStartX.current,
      endX: touchEndX.current,
      distance: swipeDistance,
      pathname: pathname
    });

    // Solo en móvil/tablet
    if (window.innerWidth >= 1024) {
      console.log('⚠️ Swipe ignorado: pantalla desktop');
      return;
    }

    // Ignorar si no hubo movimiento real (endX es 0 o muy cercano a startX)
    if (touchEndX.current === 0 || Math.abs(touchEndX.current - touchStartX.current) < 10) {
      console.log('⚠️ Swipe ignorado: no hubo movimiento horizontal real');
      return;
    }

    // Swipe izquierda (siguiente)
    if (swipeDistance > minSwipeDistance) {
      console.log('👉 Swipe izquierda detectado');
      navigateToNext();
    }
    // Swipe derecha (anterior)
    else if (swipeDistance < -minSwipeDistance) {
      console.log('👈 Swipe derecha detectado');
      navigateToPrevious();
    } else {
      console.log('⚠️ Swipe muy corto:', swipeDistance);
    }
  };

  const navigateToNext = () => {
    const currentIndex = navigationOrder.indexOf(pathname);
    console.log('📍 Posición actual:', currentIndex, 'de', navigationOrder.length - 1);
    
    if (currentIndex !== -1 && currentIndex < navigationOrder.length - 1) {
      const nextPath = navigationOrder[currentIndex + 1];
      console.log('✅ Navegando a siguiente:', nextPath);
      router.push(nextPath);
    } else {
      console.log('⚠️ Ya estás en la última página o ruta no encontrada');
    }
  };

  const navigateToPrevious = () => {
    const currentIndex = navigationOrder.indexOf(pathname);
    console.log('📍 Posición actual:', currentIndex, 'de', navigationOrder.length - 1);
    
    if (currentIndex > 0) {
      const prevPath = navigationOrder[currentIndex - 1];
      console.log('✅ Navegando a anterior:', prevPath);
      router.push(prevPath);
    } else {
      console.log('⚠️ Ya estás en la primera página');
    }
  };

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchEndX.current = e.touches[0].clientX; // Inicializar endX con startX
    };

    const handleTouchMove = (e: TouchEvent) => {
      touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      handleSwipe();
      // Resetear valores después del swipe
      touchStartX.current = 0;
      touchEndX.current = 0;
    };

    // Solo agregar listeners en móvil/tablet
    if (window.innerWidth < 1024) {
      document.addEventListener('touchstart', handleTouchStart, { passive: true });
      document.addEventListener('touchmove', handleTouchMove, { passive: true });
      document.addEventListener('touchend', handleTouchEnd, { passive: true });

      return () => {
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [pathname]);

  return { showSwipeHint };
}
