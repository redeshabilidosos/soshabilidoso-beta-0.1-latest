'use client';

import { useEffect, memo, ReactNode, useMemo, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/components/providers/providers';
import { useCachedUser } from '@/lib/hooks/use-cached-auth';

interface ProtectedRouteProps {
  children: ReactNode;
}

// Rutas públicas que no requieren autenticación
const PUBLIC_ROUTES = new Set(['/', '/login', '/register', '/auth']);

export const ProtectedRoute = memo(function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const cachedUser = useCachedUser();
  const router = useRouter();
  const pathname = usePathname();
  const hasRedirectedRef = useRef(false);

  // Usar usuario del caché o del contexto
  const effectiveUser = user || cachedUser;
  const isPublicRoute = useMemo(() => PUBLIC_ROUTES.has(pathname), [pathname]);

  useEffect(() => {
    // Solo redirigir una vez si no hay usuario
    if (!isLoading && !effectiveUser && !isPublicRoute && !hasRedirectedRef.current) {
      hasRedirectedRef.current = true;
      router.replace('/');
    }
  }, [effectiveUser, isLoading, isPublicRoute, router]);

  // Reset redirect flag cuando cambia la ruta
  useEffect(() => {
    hasRedirectedRef.current = false;
  }, [pathname]);

  // Si es ruta pública, mostrar contenido inmediatamente
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Si hay usuario (del caché o contexto), mostrar contenido inmediatamente
  if (effectiveUser) {
    return <>{children}</>;
  }

  // Mientras carga y no hay usuario en caché, mostrar skeleton mínimo
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
        {/* Skeleton mínimo */}
      </div>
    );
  }

  // Sin usuario, se redirigirá
  return null;
});
