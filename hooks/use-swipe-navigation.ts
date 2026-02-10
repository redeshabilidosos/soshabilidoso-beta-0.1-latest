"use client";

import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import anime from 'animejs';

// Orden de navegación de las tabs principales
const navigationOrder = [
  '/feed',
  '/reels',
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

    anime({
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

    // Solo en móvil/tablet
    if (window.innerWidth >= 1024) return;

    // Swipe izquierda (siguiente)
    if (swipeDistance > minSwipeDistance) {
      navigateToNext();
    }
    // Swipe derecha (anterior)
    else if (swipeDistance < -minSwipeDistance) {
      navigateToPrevious();
    }
  };

  const navigateToNext = () => {
    const currentIndex = navigationOrder.indexOf(pathname);
    if (currentIndex !== -1 && currentIndex < navigationOrder.length - 1) {
      const nextPath = navigationOrder[currentIndex + 1];
      console.log('👉 Navegando a:', nextPath);
      router.push(nextPath);
    }
  };

  const navigateToPrevious = () => {
    const currentIndex = navigationOrder.indexOf(pathname);
    if (currentIndex > 0) {
      const prevPath = navigationOrder[currentIndex - 1];
      console.log('👈 Navegando a:', prevPath);
      router.push(prevPath);
    }
  };

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      handleSwipe();
    };

    // Solo agregar listeners en móvil/tablet
    if (window.innerWidth < 1024) {
      document.addEventListener('touchstart', handleTouchStart);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);

      return () => {
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [pathname]);

  return { showSwipeHint };
}
