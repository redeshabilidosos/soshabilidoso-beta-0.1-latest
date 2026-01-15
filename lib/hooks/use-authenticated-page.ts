'use client';

import { useAuth } from '@/components/providers/providers';

/**
 * Hook para páginas autenticadas
 * Simplifica el acceso al usuario y estado de carga
 * La protección de rutas se maneja en ProtectedRoute
 */
export function useAuthenticatedPage() {
  const { user, isLoading } = useAuth();
  
  // El usuario está disponible inmediatamente si hay datos en localStorage
  // isLoading solo es true mientras se verifica el token en segundo plano
  return {
    user,
    isLoading,
    // El usuario está listo para usar si existe (incluso si isLoading es true)
    isReady: !!user,
  };
}
