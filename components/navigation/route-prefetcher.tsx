'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Componente para precargar rutas comunes y mejorar la navegación
 * Se ejecuta en background sin bloquear la UI
 */
export function RoutePrefetcher() {
  const router = useRouter();

  useEffect(() => {
    // Esperar a que la página esté completamente cargada
    if (typeof window === 'undefined') return;

    const prefetchRoutes = () => {
      // Rutas más comunes para precargar
      const commonRoutes = [
        '/feed',
        '/profile',
        '/notifications',
        '/messages',
        '/communities',
        '/clips',
        '/live',
        '/classifieds',
      ];

      // Precargar cada ruta con un pequeño delay entre cada una
      commonRoutes.forEach((route, index) => {
        setTimeout(() => {
          router.prefetch(route);
        }, index * 100); // 100ms entre cada prefetch
      });
    };

    // Ejecutar prefetch después de que la página esté idle
    if ('requestIdleCallback' in window) {
      requestIdleCallback(prefetchRoutes, { timeout: 2000 });
    } else {
      // Fallback para navegadores que no soportan requestIdleCallback
      setTimeout(prefetchRoutes, 1000);
    }
  }, [router]);

  return null; // No renderiza nada
}
