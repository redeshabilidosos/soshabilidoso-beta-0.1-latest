/**
 * Hook para precargar datos críticos al iniciar la aplicación
 * Esto mejora el rendimiento al tener los datos en caché antes de que se necesiten
 */

import { useEffect } from 'react';
import { preloadSiteSettings } from '@/lib/services/site-settings';
import { preloadMenuRoutes } from '@/lib/services/menu-config';

export function usePreloadData() {
  useEffect(() => {
    // Precargar datos en paralelo al montar la app
    const preloadAll = async () => {
      try {
        await Promise.all([
          preloadSiteSettings(),
          preloadMenuRoutes(),
        ]);
      } catch (error) {
        // Silenciosamente fallar, los datos se cargarán cuando se necesiten
      }
    };

    preloadAll();
  }, []);
}
