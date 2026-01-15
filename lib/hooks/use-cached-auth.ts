/**
 * Hook optimizado para autenticación con caché
 * Evita re-renders innecesarios y mantiene el estado del usuario en memoria
 */
'use client';

import { useCallback, useMemo, useSyncExternalStore } from 'react';

// Store global para el usuario (singleton)
let cachedUser: any = null;
let listeners: Set<() => void> = new Set();

// Inicializar desde localStorage inmediatamente
if (typeof window !== 'undefined') {
  try {
    const stored = localStorage.getItem('user');
    if (stored) {
      cachedUser = JSON.parse(stored);
    }
  } catch (e) {
    // Ignorar errores de parsing
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return cachedUser;
}

function getServerSnapshot() {
  return null;
}

export function setCachedUser(user: any) {
  cachedUser = user;
  listeners.forEach(listener => listener());
}

export function getCachedUser() {
  return cachedUser;
}

export function useCachedUser() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// Hook para verificar autenticación sin causar re-renders
export function useIsAuthenticated() {
  const user = useCachedUser();
  return useMemo(() => !!user, [user]);
}
