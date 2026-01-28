/**
 * Servicio para configuración del menú con caché inteligente
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export interface MenuRoute {
  route_key: string;
  label: string;
  path: string;
  icon: string;
  is_enabled: boolean;
  order: number;
  requires_auth: boolean;
  badge_count: number;
  description?: string;
}

// Caché en memoria
let cachedMenuRoutes: MenuRoute[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutos

// Caché en localStorage
const STORAGE_KEY = 'menu_routes_cache';
const STORAGE_TIMESTAMP_KEY = 'menu_routes_cache_timestamp';

/**
 * Obtener rutas del menú con caché inteligente
 */
export async function getMenuRoutes(): Promise<MenuRoute[]> {
  const now = Date.now();
  
  // 1. Verificar caché en memoria
  if (cachedMenuRoutes && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedMenuRoutes;
  }
  
  // 2. Verificar caché en localStorage
  if (typeof window !== 'undefined') {
    try {
      const storedRoutes = localStorage.getItem(STORAGE_KEY);
      const storedTimestamp = localStorage.getItem(STORAGE_TIMESTAMP_KEY);
      
      if (storedRoutes && storedTimestamp) {
        const timestamp = parseInt(storedTimestamp, 10);
        if ((now - timestamp) < CACHE_DURATION) {
          const routes = JSON.parse(storedRoutes);
          cachedMenuRoutes = routes;
          cacheTimestamp = timestamp;
          return routes;
        }
      }
    } catch (error) {
      console.error('Error leyendo caché de menú:', error);
    }
  }
  
  // 3. Consultar al servidor
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_URL}/site-settings/menu/enabled/`, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Error al obtener menú: ${response.status}`);
    }

    const data = await response.json();
    const routes = Array.isArray(data) ? data : data.results || [];
    
    // Actualizar caché
    cachedMenuRoutes = routes;
    cacheTimestamp = now;
    
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(routes));
        localStorage.setItem(STORAGE_TIMESTAMP_KEY, now.toString());
      } catch (error) {
        console.error('Error guardando caché de menú:', error);
      }
    }
    
    return routes;
  } catch (error) {
    console.error('Error al obtener rutas del menú:', error);
    
    // Fallback a caché antiguo
    if (cachedMenuRoutes) {
      return cachedMenuRoutes;
    }
    
    // Menú por defecto
    return getDefaultMenuRoutes();
  }
}

/**
 * Menú por defecto si todo falla
 */
function getDefaultMenuRoutes(): MenuRoute[] {
  return [
    { route_key: 'feed', label: 'Feed', path: '/feed', icon: 'Home', is_enabled: true, order: 1, requires_auth: true, badge_count: 0 },
    { route_key: 'profile', label: 'Perfil', path: '/profile', icon: 'User', is_enabled: true, order: 2, requires_auth: true, badge_count: 0 },
    { route_key: 'messages', label: 'Mensajes', path: '/messages', icon: 'MessageCircle', is_enabled: true, order: 3, requires_auth: true, badge_count: 0 },
    { route_key: 'notifications', label: 'Notificaciones', path: '/notifications', icon: 'Bell', is_enabled: true, order: 4, requires_auth: true, badge_count: 0 },
    { route_key: 'communities', label: 'Comunidades', path: '/communities', icon: 'Users', is_enabled: true, order: 5, requires_auth: true, badge_count: 0 },
  ];
}

/**
 * Invalidar caché del menú
 */
export function invalidateMenuCache() {
  cachedMenuRoutes = null;
  cacheTimestamp = 0;
  
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_TIMESTAMP_KEY);
  }
}

/**
 * Precargar rutas del menú
 */
export async function preloadMenuRoutes() {
  try {
    await getMenuRoutes();
  } catch (error) {
    console.error('Error precargando menú:', error);
  }
}

/**
 * Servicio de configuración del menú (para compatibilidad)
 */
export const menuConfigService = {
  getMenuRoutes,
  invalidateCache: invalidateMenuCache,
  preload: preloadMenuRoutes,
};
