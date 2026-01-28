'use client';

import { useEffect } from 'react';

/**
 * Hook para aplicar fondo negro con degradado y partículas animadas
 * Replica el mismo efecto visual de la página de comunidades
 */
export function useForceBlackBackground() {
  useEffect(() => {
    // Guardar el color actual
    const originalBodyBg = document.body.style.background;
    const originalBodyBgColor = document.body.style.backgroundColor;
    const originalHtmlBg = document.documentElement.style.background;
    const originalHtmlBgColor = document.documentElement.style.backgroundColor;
    
    // Aplicar fondo negro base (no sólido, permite degradados y estilos de componentes)
    const forceBlackBackground = () => {
      // Solo forzar fondo negro en contenedores principales
      document.body.style.setProperty('background-color', '#000000', 'important');
      document.documentElement.style.setProperty('background-color', '#000000', 'important');
      
      // Main transparente para permitir degradados
      const main = document.querySelector('main');
      if (main) {
        (main as HTMLElement).style.setProperty('background-color', 'transparent', 'important');
      }
      
      // Contenedor principal de la aplicación
      const appContainer = document.querySelector('#__next');
      if (appContainer) {
        (appContainer as HTMLElement).style.setProperty('background-color', '#000000', 'important');
      }
      
      // Forzar fondo negro en el sidebar
      const sidebar = document.getElementById('main-sidebar');
      if (sidebar) {
        (sidebar as HTMLElement).style.setProperty('background', '#000000', 'important');
        (sidebar as HTMLElement).style.setProperty('background-color', '#000000', 'important');
      }
    };
    
    // Aplicar inmediatamente
    forceBlackBackground();
    
    // Observer para mantener el fondo negro si se re-renderiza
    const observer = new MutationObserver(() => {
      forceBlackBackground();
    });
    
    // Observar cambios en el body para detectar cuando se re-renderiza
    observer.observe(document.body, { childList: true, subtree: true });
    
    // También ejecutar periódicamente para asegurar consistencia
    const interval = setInterval(forceBlackBackground, 500);
    
    // Agregar contenedor de estrellas si no existe
    let starsContainer = document.getElementById('stars-background-container');
    if (!starsContainer) {
      starsContainer = document.createElement('div');
      starsContainer.id = 'stars-background-container';
      starsContainer.style.cssText = 'position: fixed; inset: 0; z-index: 0; overflow: hidden; pointer-events: none; width: 100vw; height: 100vh;';
      starsContainer.innerHTML = `
        <div class="stars"></div>
        <div class="stars2"></div>
        <div class="stars3"></div>
        <div class="stars-neon"></div>
      `;
      document.body.prepend(starsContainer);
    }
    
    // Asegurar que el contenedor de estrellas esté visible y NO bloquee clicks
    if (starsContainer) {
      starsContainer.style.display = 'block';
      starsContainer.style.visibility = 'visible';
      starsContainer.style.opacity = '1';
      starsContainer.style.pointerEvents = 'none'; // CRÍTICO: No bloquear clicks
    }
    
    return () => {
      // Desconectar el observer y limpiar el intervalo
      observer.disconnect();
      clearInterval(interval);
      
      // Restaurar al salir (solo si no es otra página de comunidades o capacitaciones)
      const currentPath = window.location.pathname;
      if (!currentPath.startsWith('/communities') && !currentPath.startsWith('/capacitaciones')) {
        document.body.style.background = originalBodyBg || '#000000';
        document.body.style.backgroundColor = originalBodyBgColor || '#000000';
        document.documentElement.style.background = originalHtmlBg || '#000000';
        document.documentElement.style.backgroundColor = originalHtmlBgColor || '#000000';
        
        const main = document.querySelector('main');
        if (main) {
          (main as HTMLElement).style.background = '';
          (main as HTMLElement).style.backgroundColor = '';
        }
        
        // Remover estrellas
        const container = document.getElementById('stars-background-container');
        if (container) {
          container.remove();
        }
      }
    };
  }, []);
}
