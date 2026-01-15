'use client';

import { memo, ReactNode, Suspense } from 'react';
import { Sidebar } from '@/components/navigation/sidebar';
import { MobileNav } from '@/components/navigation/mobile-nav';
import { useAuth } from '@/components/providers/providers';

interface AuthenticatedLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
  showMobileNav?: boolean;
  className?: string;
}

// Skeleton de carga mínimo
const LoadingSkeleton = memo(function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-neon-green border-t-transparent rounded-full animate-spin" />
    </div>
  );
});

export const AuthenticatedLayout = memo(function AuthenticatedLayout({ 
  children, 
  showSidebar = true,
  showMobileNav = true,
  className = ''
}: AuthenticatedLayoutProps) {
  const { user, isLoading } = useAuth();

  // Si está cargando y no hay usuario en caché, mostrar skeleton
  if (isLoading && !user) {
    return <LoadingSkeleton />;
  }

  // Si no hay usuario, no renderizar nada (el ProtectedRoute manejará la redirección)
  if (!user) {
    return null;
  }

  return (
    <div className={`min-h-screen bg-black text-white ${className}`}>
      {/* Fondo de estrellas con CSS - z-index bajo para no interferir con navegación */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: -1 }}>
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </div>

      {showSidebar && <Sidebar />}
      
      <main className={`relative ${showSidebar ? 'lg:ml-64' : ''} ${showMobileNav ? 'pb-24 lg:pb-0' : ''}`} style={{ zIndex: 1 }}>
        {children}
      </main>

      {showMobileNav && <MobileNav />}
    </div>
  );
});
