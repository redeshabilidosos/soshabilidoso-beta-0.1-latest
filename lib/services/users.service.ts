/**
 * Servicio para gestión de usuarios
 */

export interface User {
  id: string;
  username: string;
  display_name: string;
  avatar?: string;
  avatar_url: string;
  bio?: string;
  position?: string;
  team?: string;
  is_verified: boolean;
  followers_count: number;
  following_count: number;
  posts_count: number;
  is_following?: boolean;
  is_friend?: boolean;
  friend_request_status?: 'sent' | 'received' | null;
}

export interface UserProfile extends User {
  first_name?: string;
  last_name?: string;
  email?: string;
  cover_photo?: string;
  contact_number?: string;
  interests: string[];
  social_links: any[];
  created_at: string;
}

export interface FriendRequest {
  id: string;
  sender: User;
  receiver: User;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;
  created_at: string;
  updated_at: string;
}

export interface SearchUsersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: User[];
}

class UsersService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

  private async getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  /**
   * Buscar usuarios
   */
  async searchUsers(query: string = '', page: number = 1): Promise<SearchUsersResponse> {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (page > 1) params.append('page', page.toString());

    const response = await fetch(
      `${this.baseUrl}/users/search/?${params.toString()}`,
      {
        headers: await this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error('Error al buscar usuarios');
    }

    return response.json();
  }

  /**
   * Obtener perfil de usuario
   */
  async getUserProfile(username: string): Promise<UserProfile> {
    const response = await fetch(
      `${this.baseUrl}/users/profile/${username}/`,
      {
        headers: await this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error('Error al obtener perfil de usuario');
    }

    return response.json();
  }

  /**
   * Seguir usuario
   */
  async followUser(username: string): Promise<{ message: string }> {
    const response = await fetch(
      `${this.baseUrl}/users/follow/${username}/`,
      {
        method: 'POST',
        headers: await this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al seguir usuario');
    }

    return response.json();
  }

  /**
   * Dejar de seguir usuario
   */
  async unfollowUser(username: string): Promise<{ message: string }> {
    const response = await fetch(
      `${this.baseUrl}/users/unfollow/${username}/`,
      {
        method: 'DELETE',
        headers: await this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al dejar de seguir usuario');
    }

    return response.json();
  }

  /**
   * Enviar solicitud de amistad
   */
  async sendFriendRequest(username: string, message?: string): Promise<{ message: string; friend_request: FriendRequest }> {
    const response = await fetch(
      `${this.baseUrl}/users/friend-requests/send/${username}/`,
      {
        method: 'POST',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify({ message: message || '' }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al enviar solicitud de amistad');
    }

    return response.json();
  }

  /**
   * Responder solicitud de amistad
   */
  async respondFriendRequest(requestId: string, action: 'accept' | 'reject'): Promise<{ message: string }> {
    const response = await fetch(
      `${this.baseUrl}/users/friend-requests/${requestId}/respond/`,
      {
        method: 'POST',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify({ action }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al responder solicitud de amistad');
    }

    return response.json();
  }

  /**
   * Aceptar solicitud de amistad
   */
  async acceptFriendRequest(requestId: string): Promise<{ message: string }> {
    return this.respondFriendRequest(requestId, 'accept');
  }

  /**
   * Rechazar solicitud de amistad
   */
  async rejectFriendRequest(requestId: string): Promise<{ message: string }> {
    return this.respondFriendRequest(requestId, 'reject');
  }

  /**
   * Obtener solicitudes de amistad recibidas
   */
  async getFriendRequests(): Promise<FriendRequest[]> {
    const response = await fetch(
      `${this.baseUrl}/users/friend-requests/`,
      {
        headers: await this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error('Error al obtener solicitudes de amistad');
    }

    return response.json();
  }

  /**
   * Obtener amigos
   */
  async getFriends(username?: string): Promise<User[]> {
    const url = username 
      ? `${this.baseUrl}/users/friends/${username}/`
      : `${this.baseUrl}/users/friends/`;

    const response = await fetch(url, {
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener amigos');
    }

    return response.json();
  }

  /**
   * Obtener seguidores
   */
  async getFollowers(username: string): Promise<User[]> {
    const response = await fetch(
      `${this.baseUrl}/users/followers/${username}/`,
      {
        headers: await this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error('Error al obtener seguidores');
    }

    return response.json();
  }

  /**
   * Obtener usuarios que sigue
   */
  async getFollowing(username: string): Promise<User[]> {
    const response = await fetch(
      `${this.baseUrl}/users/following/${username}/`,
      {
        headers: await this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error('Error al obtener usuarios seguidos');
    }

    return response.json();
  }

  /**
   * Crear o obtener chat con usuario
   */
  async createChatWithUser(username: string): Promise<{ chat: any; created: boolean; message?: string }> {
    const response = await fetch(
      `${this.baseUrl}/users/chat/${username}/`,
      {
        method: 'POST',
        headers: await this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al crear chat');
    }

    return response.json();
  }

  /**
   * Obtener publicaciones de un usuario
   */
  async getUserPosts(username: string, postType?: string, page: number = 1): Promise<any> {
    const params = new URLSearchParams();
    if (postType) params.append('type', postType);
    if (page > 1) params.append('page', page.toString());

    const response = await fetch(
      `${this.baseUrl}/users/${username}/posts/?${params.toString()}`,
      {
        headers: await this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error('Error al obtener publicaciones del usuario');
    }

    return response.json();
  }

  /**
   * Obtener estadísticas de publicaciones de un usuario
   */
  async getUserPostsStats(username: string): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/users/${username}/posts/stats/`,
      {
        headers: await this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error('Error al obtener estadísticas de publicaciones');
    }

    return response.json();
  }

  /**
   * Obtener álbum de fotos de perfil
   */
  async getProfilePhotosAlbum(username?: string): Promise<any> {
    const params = username ? `?username=${username}` : '';
    const response = await fetch(
      `${this.baseUrl}/media/albums/profile_photos/${params}`,
      {
        headers: await this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error('Error al obtener álbum de fotos de perfil');
    }

    return response.json();
  }

  /**
   * Obtener álbum de fotos de portada
   */
  async getCoverPhotosAlbum(username?: string): Promise<any> {
    const params = username ? `?username=${username}` : '';
    const response = await fetch(
      `${this.baseUrl}/media/albums/cover_photos/${params}`,
      {
        headers: await this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error('Error al obtener álbum de fotos de portada');
    }

    return response.json();
  }

  /**
   * Obtener todos los álbumes de un usuario
   */
  async getUserAlbums(username?: string): Promise<any[]> {
    const params = username ? `?username=${username}` : '';
    const response = await fetch(
      `${this.baseUrl}/media/albums/${params}`,
      {
        headers: await this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error('Error al obtener álbumes');
    }

    return response.json();
  }
}

export const usersService = new UsersService();