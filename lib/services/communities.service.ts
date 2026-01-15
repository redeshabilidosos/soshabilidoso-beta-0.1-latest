/**
 * Servicio para gestionar comunidades y categorías
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export interface CommunityCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  image: string | null;
  order: number;
  community_count: number;
  subcommunity_count: number;
}

export interface Community {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  type: 'public' | 'private' | 'page';
  owner: {
    id: string;
    username: string;
    first_name: string;
    last_name: string;
    avatar: string | null;
  };
  profile_image: string | null;
  cover_image: string | null;
  location: string;
  is_active: boolean;
  is_verified: boolean;
  member_count: number;
  post_count: number;
  subcommunity_count: number;
  is_member: boolean;
  is_owner: boolean;
  is_subcommunity: boolean;
  category_info: {
    id: string;
    name: string;
    slug: string;
    icon: string;
    color: string;
  } | null;
  parent_info: {
    id: string;
    name: string;
    slug: string;
  } | null;
  subcommunities: {
    id: string;
    name: string;
    slug: string;
    description: string;
    member_count: number;
    profile_image: string | null;
  }[];
  created_at: string;
}

export interface CommunityPost {
  id: string;
  community: string;
  author: {
    id: string;
    username: string;
    first_name: string;
    last_name: string;
    avatar: string | null;
  };
  content: string;
  post_type: string;
  image_url: string | null;
  video_file_url: string | null;
  like_count: number;
  comment_count: number;
  is_liked: boolean;
  is_pinned: boolean;
  created_at: string;
}

class CommunitiesService {
  private baseUrl = `${API_BASE_URL}/communities`;
  private categoriesUrl = `${API_BASE_URL}/communities/categories`;

  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  // ==================== CATEGORÍAS ====================

  async getCategories(): Promise<CommunityCategory[]> {
    const response = await fetch(`${this.categoriesUrl}/`, {
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener categorías');
    }

    const data = await response.json();
    // Manejar respuesta paginada de DRF
    return data.results || data;
  }

  async getCategoryBySlug(slug: string): Promise<CommunityCategory> {
    const response = await fetch(`${this.categoriesUrl}/${slug}/`, {
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Categoría no encontrada');
    }

    return response.json();
  }

  async getCategoryWithCommunities(slug: string): Promise<{
    category: CommunityCategory;
    communities: Community[];
  }> {
    const response = await fetch(`${this.categoriesUrl}/${slug}/communities/`, {
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener comunidades de la categoría');
    }

    return response.json();
  }

  async getCategoryAllCommunities(slug: string): Promise<{
    category: CommunityCategory;
    main_communities: Community[];
    subcommunities: Community[];
    total_count: number;
  }> {
    const response = await fetch(`${this.categoriesUrl}/${slug}/all_communities/`, {
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener todas las comunidades');
    }

    return response.json();
  }

  // ==================== COMUNIDADES ====================

  async getCommunities(params?: {
    category_slug?: string;
    type?: string;
    search?: string;
    only_main?: boolean;
    only_sub?: boolean;
    parent?: string;
  }): Promise<Community[]> {
    const searchParams = new URLSearchParams();
    
    if (params?.category_slug) searchParams.append('category_slug', params.category_slug);
    if (params?.type) searchParams.append('type', params.type);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.only_main) searchParams.append('only_main', 'true');
    if (params?.only_sub) searchParams.append('only_sub', 'true');
    if (params?.parent) searchParams.append('parent', params.parent);

    const url = `${this.baseUrl}/?${searchParams.toString()}`;
    const response = await fetch(url, {
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener comunidades');
    }

    const data = await response.json();
    // Manejar respuesta paginada de DRF
    return data.results || data;
  }

  async getCommunityById(id: string): Promise<Community> {
    const response = await fetch(`${this.baseUrl}/${id}/`, {
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Comunidad no encontrada');
    }

    return response.json();
  }

  async getSubcommunities(communityId: string): Promise<{
    parent: { id: string; name: string; slug: string };
    subcommunities: Community[];
    count: number;
  }> {
    const response = await fetch(`${this.baseUrl}/${communityId}/subcommunities/`, {
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener subcomunidades');
    }

    return response.json();
  }

  async joinCommunity(communityId: string): Promise<{ message: string; is_member: boolean }> {
    const response = await fetch(`${this.baseUrl}/${communityId}/join/`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al unirse a la comunidad');
    }

    return response.json();
  }

  async getMyCommunities(): Promise<{
    owned: Community[];
    joined: Community[];
  }> {
    const response = await fetch(`${this.baseUrl}/my_communities/`, {
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener mis comunidades');
    }

    return response.json();
  }

  async createCommunity(formData: FormData): Promise<Community> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    
    const response = await fetch(`${this.baseUrl}/`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        // No incluir Content-Type para FormData, el navegador lo establece automáticamente
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw { response: { data: errorData } };
    }

    return response.json();
  }

  // ==================== POSTS ====================

  async getCommunityPosts(communityId: string): Promise<CommunityPost[]> {
    const response = await fetch(`${this.baseUrl}/${communityId}/posts/`, {
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener publicaciones');
    }

    return response.json();
  }

  async createPost(communityId: string, data: { content: string; post_type?: string }): Promise<CommunityPost> {
    const response = await fetch(`${this.baseUrl}/${communityId}/posts/`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al crear publicación');
    }

    return response.json();
  }
}

export const communitiesService = new CommunitiesService();
