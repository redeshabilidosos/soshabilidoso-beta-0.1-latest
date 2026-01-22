/**
 * Servicio para consultar las configuraciones del sitio desde el backend
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export interface SiteSettings {
  show_register_habilidosos_button: boolean;
  reality_form_enabled: boolean;
  updated_at: string;
}

/**
 * Obtiene las configuraciones actuales del sitio
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const url = `${API_URL}/site-settings/`;
    console.log('🔍 Consultando configuraciones del sitio en:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // No cachear para obtener siempre la configuración más reciente
      next: { revalidate: 0 }, // Deshabilitar cache de Next.js
    });

    console.log('📡 Response status:', response.status);
    console.log('📡 Response ok:', response.ok);

    if (!response.ok) {
      console.error('❌ Error al obtener configuraciones:', response.status, response.statusText);
      throw new Error(`Error al obtener configuraciones: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Configuraciones obtenidas del servidor:', data);
    return data;
  } catch (error) {
    console.error('❌ ERROR CRÍTICO al obtener configuraciones del sitio:', error);
    console.error('❌ Tipo de error:', error instanceof TypeError ? 'TypeError (posible CORS o red)' : 'Otro error');
    console.error('❌ Mensaje:', error instanceof Error ? error.message : String(error));
    
    // IMPORTANTE: NO retornar valores por defecto, lanzar el error
    // para que el componente sepa que algo falló
    throw error;
  }
}
