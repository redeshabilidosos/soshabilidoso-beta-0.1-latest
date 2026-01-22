'use client';

import React, { useState, useEffect, lazy, Suspense, memo, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { Providers } from '@/components/providers/providers';
import { SplashScreen } from '@/components/ui/splash-screen';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { BackgroundColorProvider } from '@/components/providers/background-color-provider';
import { useForceSidebarBlack } from '@/hooks/use-force-sidebar-black';

// Lazy loading de componentes pesados - cargados después del contenido principal
const ParticleBackground = lazy(() => 
  import('@/components/ui/particle-background').then(m => ({ default: m.ParticleBackground }))
);
const StarBackground = lazy(() => 
  import('@/components/ui/star-background').then(m => ({ default: m.StarBackground }))
);
const FloatingChatButton = lazy(() => import('@/components/ui/floating-chat-button'));
const FloatingLogoAndMenuButton = lazy(() => 
  import('@/components/ui/floating-logo-and-menu-button').then(m => ({ default: m.FloatingLogoAndMenuButton }))
);
const InstallPWAPrompt = lazy(() => 
  import('@/components/ui/install-pwa-prompt').then(m => ({ default: m.InstallPWAPrompt }))
);

interface RootLayoutClientProps {
  children: React.ReactNode;
}

export const RootLayoutClient = memo(function RootLayoutClient({ children }: RootLayoutClientProps) {
  // Inicializar con true para evitar flash del splash en hidratación
  const [showSplash, setShowSplash] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [loadBackgrounds, setLoadBackgrounds] = useState(false);
  const [hasCheckedSplash, setHasCheckedSplash] = useState(false);
  const pathname = usePathname();
  
  // Forzar fondo negro del sidebar globalmente
  useForceSidebarBlack();
  
  // Ocultar botones flotantes en la página de mensajes
  const hideFloatingButtons = pathname?.startsWith('/messages');

  useEffect(() => {
    setIsMounted(true);
    
    // Verificar si ya se mostró el splash SOLO en el cliente
    const splashShown = sessionStorage.getItem('splashShown') === 'true';
    if (splashShown) {
      setShowSplash(false);
    }
    setHasCheckedSplash(true);
    
    // Cargar backgrounds con mayor delay para priorizar contenido y navegación
    const timer = setTimeout(() => setLoadBackgrounds(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
    // Guardar que ya se mostró el splash
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('splashShown', 'true');
    }
  }, []);

  // Mientras no se haya verificado el splash, mostrar un placeholder mínimo
  if (!hasCheckedSplash) {
    return (
      <Providers>
        <div className="min-h-screen bg-black" />
      </Providers>
    );
  }

  // Si ya se mostró el splash, renderizar contenido inmediatamente
  if (!showSplash) {
    return (
      <Providers>
        <BackgroundColorProvider />
        {isMounted && loadBackgrounds && (
          <div 
            className="fixed pointer-events-none" 
            style={{
              inset: '0px',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 1,
              position: 'fixed'
            }}
          >
            <Suspense fallback={null}>
              <ParticleBackground />
              <StarBackground />
            </Suspense>
          </div>
        )}
        <div className="min-h-screen relative" style={{ zIndex: 10 }}>
          <ProtectedRoute>
            {children}
          </ProtectedRoute>
          {isMounted && !hideFloatingButtons && (
            <Suspense fallback={null}>
              <FloatingChatButton />
              <FloatingLogoAndMenuButton />
              <InstallPWAPrompt />
            </Suspense>
          )}
        </div>
      </Providers>
    );
  }

  return <SplashScreen onAnimationComplete={handleSplashComplete} />;
});