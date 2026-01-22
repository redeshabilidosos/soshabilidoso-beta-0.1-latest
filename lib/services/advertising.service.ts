/**
 * Servicio para gestionar la publicidad
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export interface Advertisement {
  id: string;
  title: string;
  description: string;
  advertiser_name: string;
  ad_type: 'image' | 'video' | 'carousel' | 'banner' | 'sponsored_post';
  media_url: string | null;
  advertiser_logo_url: string | null;
  link_url: string;
  call_to_action: string;
  carousel_images: string[];
}

export interface FeedAdsResponse {
  ads: Advertisement[];
  position: number;
}

class AdvertisingService {
  private getAuthHeaders(): HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
  }

  /**
   * Obtener anuncios para mostrar en el feed
   */
  async getFeedAds(position: number = 0, count: number = 1): Promise<FeedAdsResponse> {
    try {
      const response = await fetch(
        `${API_URL}/advertising/ads/get_feed_ads/?position=${position}&count=${count}`,
        {
          method: 'GET',
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error('Error al obtener anuncios');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching feed ads:', error);
      return { ads: [], position };
    }
  }


  /**
   * Registrar una impresión de anuncio
   */
  async recordImpression(adId: string, position: number = 0): Promise<{ success: boolean; impression_id?: string }> {
    try {
      const response = await fetch(
        `${API_URL}/advertising/ads/${adId}/record_impression/`,
        {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ position }),
        }
      );

      if (!response.ok) {
        throw new Error('Error al registrar impresión');
      }

      return await response.json();
    } catch (error) {
      console.error('Error recording impression:', error);
      return { success: false };
    }
  }

  /**
   * Registrar un click en anuncio
   */
  async recordClick(adId: string, impressionId?: string): Promise<{ success: boolean; redirect_url?: string }> {
    try {
      const response = await fetch(
        `${API_URL}/advertising/${adId}/record_click/`,
        {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ impression_id: impressionId }),
        }
      );

      if (!response.ok) {
        throw new Error('Error al registrar click');
      }

      return await response.json();
    } catch (error) {
      console.error('Error recording click:', error);
      return { success: false };
    }
  }

  /**
   * Registrar vista de video
   */
  async recordVideoView(
    adId: string, 
    watchDuration: number, 
    videoDuration: number, 
    completed: boolean
  ): Promise<{ success: boolean }> {
    try {
      const response = await fetch(
        `${API_URL}/advertising/${adId}/record_video_view/`,
        {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({
            watch_duration: watchDuration,
            video_duration: videoDuration,
            completed,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Error al registrar vista de video');
      }

      return await response.json();
    } catch (error) {
      console.error('Error recording video view:', error);
      return { success: false };
    }
  }
}

export const advertisingService = new AdvertisingService();
