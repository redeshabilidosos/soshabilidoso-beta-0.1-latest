import api from './api';

export interface SiteSettings {
  show_register_habilidosos_button: boolean;
  updated_at: string;
}

class SiteSettingsService {
  /**
   * Obtener las configuraciones del sitio
   */
  async getSettings(): Promise<SiteSettings> {
    const response = await api.get<SiteSettings>('/site-settings/');
    return response.data;
  }
}

export const siteSettingsService = new SiteSettingsService();
