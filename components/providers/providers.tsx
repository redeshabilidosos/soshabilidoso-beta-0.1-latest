'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from './auth-provider';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="cyber-green" themes={['cyber-green', 'ocean-blue', 'fire-red', 'blackout']}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
}

// Re-exportar useAuth desde el AuthProvider
export { useAuth } from './auth-provider';