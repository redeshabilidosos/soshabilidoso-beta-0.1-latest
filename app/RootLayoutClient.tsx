'use client';

import React, { useState, useEffect, lazy, Suspense, memo } from 'react';
import { usePathname } from 'next/navigation';
import { Providers } from '@/components/providers/providers';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { BackgroundColorProvider } from '@/components/providers/background-color-provider';
import { useForceSidebarBlack } from '@/hooks/use-force-sidebar-black';
import { usePreloadData } from '@/lib/hooks/use-preload-data';
import { Toaster } from '@/components/ui/toaster';
import { preloadSiteSettings } from '@/lib/services/site-settings';
import { menuConfigService } from '@/lib/services/menu-config';
import { RoutePrefetcher } from '@/components/navigation/route-prefetcher';

// Lazy loading de componentes flotantes
const FloatingChatButton = lazy(() => import('@/components/ui/floating-chat-button'));
const FloatingLogoAndMenuButton = lazy(() => 
  import('@/components/ui/floating-logo-and-menu-button').then(m => ({ default: m.FloatingLogoAndMenuButton }))
);
const InstallPWAPrompt = lazy(() => 
  import('@/components/ui/install-pwa-prompt').then(m => ({ default: m.InstallPWAPrompt }))
);
const ParticleBackground = lazy(() => 
  import('@/components/ui/particle-background').then(m => ({ default: m.ParticleBackground }))
);

interface RootLayoutClientProps {
  children: React.ReactNode;
}

export const RootLayoutClient = memo(function RootLayoutClient({ children }: RootLayoutClientProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [showFloatingButtons, setShowFloatingButtons] = useState(false);
  const pathname = usePathname();
  
  // Forzar fondo negro del sidebar globalmente
  useForceSidebarBlack();
  
  // Precargar datos críticos al iniciar
  usePreloadData();
  
  // Ocultar botones flotantes en la página de mensajes
  const hideFloatingButtons = pathname?.startsWith('/messages');
  
  // Habilitar fondo de partículas en todas las páginas excepto comunidades
  const showParticles = !pathname?.startsWith('/communities');

  useEffect(() => {
    setIsMounted(true);
    
    // Marcar splash como mostrado inmediatamente
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('splashShown', 'true');
    }
    
    // Precargar configuraciones en idle time para no bloquear hidratación
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        Promise.all([
          preloadSiteSettings(),
          menuConfigService.preload()
        ]).catch(console.error);
      }, { timeout: 2000 });
    } else {
      // Fallback para navegadores sin requestIdleCallback
      setTimeout(() => {
        Promise.all([
          preloadSiteSettings(),
          menuConfigService.preload()
        ]).catch(console.error);
      }, 100);
    }
    
    // Mostrar botones flotantes después de que la página esté lista
    const timer = setTimeout(() => {
      setShowFloatingButtons(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <Providers>
      <BackgroundColorProvider />
      {/* Fondo de partículas animadas */}
      {isMounted && showParticles && (
        <Suspense fallback={null}>
          <ParticleBackground />
        </Suspense>
      )}
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
    </Providers>
  );
});