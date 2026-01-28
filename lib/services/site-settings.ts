/**
 * Servicio para consultar las configuraciones del sitio desde el backend
 * Optimizado con caché inteligente para reducir peticiones HTTP
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export interface SiteSettings {
  show_register_habilidosos_button: boolean;
  reality_form_enabled: boolean;
  updated_at: string;
}

// Caché en memoria para configuraciones
let cachedSettings: SiteSettings | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Caché en localStorage para persistencia entre sesiones
const STORAGE_KEY = 'site_settings_cache';
const STORAGE_TIMESTAMP_KEY = 'site_settings_cache_timestamp';

/**
 * Obtiene las configuraciones actuales del sitio con caché inteligente
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  const now = Date.now();
  
  // 1. Verificar caché en memoria (más rápido)
  if (cachedSettings && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedSettings;
  }
  
  // 2. Verificar caché en localStorage
  if (typeof window !== 'undefined') {
    try {
      const storedSettings = localStorage.getItem(STORAGE_KEY);
      const storedTimestamp = localStorage.getItem(STORAGE_TIMESTAMP_KEY);
      
      if (storedSettings && storedTimestamp) {
        const timestamp = parseInt(storedTimestamp, 10);
        if ((now - timestamp) < CACHE_DURATION) {
          const settings = JSON.parse(storedSettings);
          cachedSettings = settings;
          cacheTimestamp = timestamp;
          return settings;
        }
      }
    } catch (error) {
      console.error('Error leyendo caché:', error);
    }
  }
  
  // 3. Consultar al servidor solo si el caché expiró
  try {
    const url = `${API_URL}/site-settings/`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store',
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener configuraciones: ${response.status}`);
    }

    const data = await response.json();
    
    // Actualizar caché en memoria
    cachedSettings = data;
    cacheTimestamp = now;
    
    // Actualizar caché en localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        localStorage.setItem(STORAGE_TIMESTAMP_KEY, now.toString());
      } catch (error) {
        console.error('Error guardando caché:', error);
      }
    }
    
    return data;
  } catch (error) {
    console.error('❌ ERROR al obtener configuraciones del sitio:', error);
    
    // Si hay caché antiguo, usarlo como fallback
    if (cachedSettings) {
      return cachedSettings;
    }
    
    // Devolver valores por defecto en caso de error
    return {
      show_register_habilidosos_button: true,
      reality_form_enabled: true,
      updated_at: new Date().toISOString()
    };
  }
}

/**
 * Invalidar caché manualmente (útil después de cambios en el admin)
 */
export function invalidateSiteSettingsCache() {
  cachedSettings = null;
  cacheTimestamp = 0;
  
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_TIMESTAMP_KEY);
  }
}

/**
 * Precargar configuraciones (útil al iniciar la app)
 */
export async function preloadSiteSettings() {
  try {
    await getSiteSettings();
  } catch (error) {
    console.error('Error precargando configuraciones:', error);
  }
}
