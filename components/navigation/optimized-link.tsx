/**
 * Link optimizado para navegación rápida
 * Usa prefetch agresivo y transiciones instantáneas
 */
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { memo, useCallback, MouseEvent, ReactNode } from 'react';

interface OptimizedLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  prefetch?: boolean;
}

export const OptimizedLink = memo(function OptimizedLink({
  href,
  children,
  className,
  onClick,
  prefetch = true,
}: OptimizedLinkProps) {
  const router = useRouter();

  const handleClick = useCallback((e: MouseEvent<HTMLAnchorElement>) => {
    // Si hay un onClick personalizado, ejecutarlo
    if (onClick) {
      onClick();
    }
    
    // Prevenir navegación por defecto para usar router.push
    // que es más rápido en algunos casos
    if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
      e.preventDefault();
      // Usar startTransition para navegación no bloqueante
      router.push(href);
    }
  }, [href, onClick, router]);

  return (
    <Link
      href={href}
      prefetch={prefetch}
      scroll={false}
      className={className}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
});
