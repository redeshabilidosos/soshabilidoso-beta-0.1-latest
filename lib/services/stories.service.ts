/**
 * Servicio para gestión de historias (Stories)
 * Las historias son contenido efímero que dura 24 horas
 */

export interface Story {
  id: string;
  user: {
    id: string;
    username: string;
    display_name: string;
    avatar_url: string;
  };
  media_url: string;
  media_type: 'image' | 'video';
  created_at: string;
  expires_at: string;
  viewed: boolean;
  views_count: number;
  reactions: {
    like: number;
    fire: number;
    celebrate: number;
    thumbsup: number;
  };
  user_reaction?: string;
}

export interface UserStories {
  user: {
    id: string;
    username: string;
    display_name: string;
    avatar_url: string;
  };
  stories: Story[];
  has_unviewed: boolean;
}

export interface StoriesResponse {
  count: number;
  results: UserStories[];
}

export interface CreateStoryData {
  media_type: 'image' | 'video';
}

class StoriesService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

  private async getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async getAuthHeadersForFormData() {
    const token = localStorage.getItem('access_token');
    return {
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  /**
   * Obtener historias de amigos/contactos
   * Incluye las historias del usuario actual y de sus contactos
   */
  async getFriendsStories(): Promise<UserStories[]> {
    try {
      const response = await fetch(`${this.baseUrl}/stories/friends/`, {
        headers: await this.getAuthHeaders(),
      });

      if (!response.ok) {
        // Si el endpoint no existe aún, devolver array vacío
        if (response.status === 404) {
          console.log('Endpoint de historias no disponible, usando datos locales');
          return [];
        }
        throw new Error('Error al obtener las historias');
      }

      const data: StoriesResponse = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Error fetching stories:', error);
      return [];
    }
  }

  /**
   * Obtener historias del usuario actual
   */
  async getMyStories(): Promise<Story[]> {
    try {
      const response = await fetch(`${this.baseUrl}/stories/me/`, {
        headers: await this.getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 404) {
          return [];
        }
        throw new Error('Error al obtener mis historias');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching my stories:', error);
      return [];
    }
  }

  /**
   * Crear una nueva historia con imagen
   */
  async createStoryWithImage(imageFile: File): Promise<Story> {
    const formData = new FormData();
    formData.append('media', imageFile);
    formData.append('media_type', 'image');

    const response = await fetch(`${this.baseUrl}/stories/`, {
      method: 'POST',
      headers: await this.getAuthHeadersForFormData(),
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error al crear la historia');
    }

    return response.json();
  }

  /**
   * Crear una nueva historia con video
   */
  async createStoryWithVideo(videoFile: File): Promise<Story> {
    const formData = new FormData();
    formData.append('media', videoFile);
    formData.append('media_type', 'video');

    const response = await fetch(`${this.baseUrl}/stories/`, {
      method: 'POST',
      headers: await this.getAuthHeadersForFormData(),
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error al crear la historia');
    }

    return response.json();
  }

  /**
   * Marcar una historia como vista
   */
  async markAsViewed(storyId: string): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/stories/${storyId}/view/`, {
        method: 'POST',
        headers: await this.getAuthHeaders(),
      });
    } catch (error) {
      console.error('Error marking story as viewed:', error);
    }
  }

  /**
   * Reaccionar a una historia
   */
  async reactToStory(storyId: string, reactionType: 'like' | 'fire' | 'celebrate' | 'thumbsup'): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/stories/${storyId}/react/`, {
        method: 'POST',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify({ reaction_type: reactionType }),
      });
    } catch (error) {
      console.error('Error reacting to story:', error);
    }
  }

  /**
   * Eliminar una historia propia
   */
  async deleteStory(storyId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/stories/${storyId}/`, {
      method: 'DELETE',
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al eliminar la historia');
    }
  }

  /**
   * Responder a una historia (enviar mensaje directo)
   */
  async replyToStory(storyId: string, message: string): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/stories/${storyId}/reply/`, {
        method: 'POST',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify({ message }),
      });
    } catch (error) {
      console.error('Error replying to story:', error);
    }
  }
}

export const storiesService = new StoriesService();
