import { api } from '../api-client';

export interface SiteSettings {
  show_register_habilidosos_button: boolean;
  updated_at: string;
}

class SiteSettingsService {
  /**
   * Obtener las configuraciones del sitio
   */
  async getSettings(): Promise<SiteSettings> {
    const response = await api.get<{ data: SiteSettings }>('/site-settings/');
    return response.data as any;
  }
}

export const siteSettingsService = new SiteSettingsService();
