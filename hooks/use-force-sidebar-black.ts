'use client';

import { useEffect } from 'react';

/**
 * Hook para forzar el fondo negro del sidebar globalmente
 * Se debe usar en el layout principal para asegurar consistencia
 */
export function useForceSidebarBlack() {
  useEffect(() => {
    const forceSidebarBlack = () => {
      const sidebar = document.getElementById('main-sidebar');
      if (sidebar) {
        (sidebar as HTMLElement).style.setProperty('background', '#000000', 'important');
        (sidebar as HTMLElement).style.setProperty('background-color', '#000000', 'important');
      }
    };

    // Forzar inmediatamente
    forceSidebarBlack();

    // Observer para mantener el sidebar negro si se re-renderiza
    const observer = new MutationObserver(() => {
      forceSidebarBlack();
    });

    // Observar cambios en el body para detectar cuando se re-renderiza el sidebar
    observer.observe(document.body, { childList: true, subtree: true });

    // También ejecutar en intervalos para asegurar consistencia
    const interval = setInterval(forceSidebarBlack, 1000);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);
}