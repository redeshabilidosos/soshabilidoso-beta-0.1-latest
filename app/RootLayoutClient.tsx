'use client';

import React, { useState, useEffect, lazy, Suspense, memo } from 'react';
import { usePathname } from 'next/navigation';
import { Providers } from '@/components/providers/providers';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { BackgroundColorProvider } from '@/components/providers/background-color-provider';
import { TutorialProvider } from '@/components/tutorial/tutorial-provider';
import { useForceSidebarBlack } from '@/hooks/use-force-sidebar-black';
import { usePreloadData } from '@/lib/hooks/use-preload-data';
import { Toaster } from '@/components/ui/toaster';
import { preloadSiteSettings } from '@/lib/services/site-settings';
import { menuConfigService } from '@/lib/services/menu-config';
import { RoutePrefetcher } from '@/components/navigation/route-prefetcher';
import { useSwipeNavigation } from '@/hooks/use-swipe-navigation';
import { SwipeHint } from '@/components/navigation/swipe-hint';
// import { GestureTutorial } from '@/components/tutorial/gesture-tutorial'; // TEMPORALMENTE DESHABILITADO

// Lazy loading de componentes flotantes
const FloatingChatButton = lazy(() => import('@/components/ui/floating-chat-button'));
const FloatingLogoAndMenuButton = lazy(() => 
  import('@/components/ui/floating-logo-and-menu-button').then(m => ({ default: m.FloatingLogoAndMenuButton }))
);
const InstallPWAPrompt = lazy(() => 
  import('@/components/ui/install-pwa-prompt').then(m => ({ default: m.InstallPWAPrompt }))
);
const OptimizedBackground = lazy(() => 
  import('@/components/ui/optimized-background').then(m => ({ default: m.OptimizedBackground }))
);

interface RootLayoutClientProps {
  children: React.ReactNode;
}

export const RootLayoutClient = memo(function RootLayoutClient({ children }: RootLayoutClientProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [showFloatingButtons, setShowFloatingButtons] = useState(false);
  const pathname = usePathname();
  const { showSwipeHint } = useSwipeNavigation();
  
  // Forzar fondo negro del sidebar globalmente
  useForceSidebarBlack();
  
  // Precargar datos críticos al iniciar
  usePreloadData();
  
  // Ocultar botones flotantes en la página de mensajes
  const hideFloatingButtons = pathname?.startsWith('/messages');
  
  // Habilitar fondo optimizado en todas las páginas
  const showBackground = true;

  useEffect(() => {
    setIsMounted(true);
    
    // Marcar splash como mostrado inmediatamente
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('splashShown', 'true');
    }
    
    // OPTIMIZACIÓN: Precargar configuraciones INMEDIATAMENTE (no esperar idle)
    // Esto mejora la carga del menú del sidebar
    Promise.all([
      preloadSiteSettings(),
      menuConfigService.preload()
    ]).catch(console.error);
    
    // Mostrar botones flotantes después de que la página esté lista
    const timer = setTimeout(() => {
      setShowFloatingButtons(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <Providers>
      <TutorialProvider>
        <BackgroundColorProvider />
        {/* Fondo optimizado con anime.js */}
        {isMounted && showBackground && (
          <Suspense fallback={null}>
            <OptimizedBackground />
          </Suspense>
        )}
        {/* Hint de swipe navigation */}
        {isMounted && <SwipeHint show={showSwipeHint} />}
        {/* Tutorial de gestos (solo móvil/tablet) - TEMPORALMENTE DESHABILITADO POR ERROR DE BUILD */}
        {/* {isMounted && <GestureTutorial />} */}
        <div className="min-h-screen relative" style={{ zIndex: 10 }}>
          <ProtectedRoute>
            {children}
          </ProtectedRoute>
          {isMounted && showFloatingButtons && !hideFloatingButtons && (
            <Suspense fallback={null}>
              <FloatingChatButton />
              <FloatingLogoAndMenuButton />
              <InstallPWAPrompt />
            </Suspense>
          )}
          {isMounted && <RoutePrefetcher />}
        </div>
        <Toaster />
      </TutorialProvider>
    </Providers>
  );
});