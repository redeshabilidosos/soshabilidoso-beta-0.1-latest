/**
 * Servicio de API para Empresas
 */
import api from '../api-client';

export interface Enterprise {
  id: string;
  name: string;
  username: string;
  logo_url: string | null;
  cover_image_url: string | null;
  tagline: string;
  description: string;
  category: string;
  industry: string;
  website: string | null;
  email: string;
  phone: string | null;
  location: string;
  founded_year: number | null;
  employees_count: string;
  is_verified: boolean;
  is_following: boolean;
  is_owner: boolean;
  followers_count: number;
  posts_count: number;
  created_at: string;
  owner_username?: string;
}

export interface EnterpriseSearchResponse {
  results: Enterprise[];
  count: number;
  next: string | null;
  previous: string | null;
}

export interface CreateEnterpriseData {
  name: string;
  username: string;
  tagline?: string;
  description?: string;
  category: string;
  industry?: string;
  location?: string;
  website?: string;
  email?: string;
  phone?: string;
  founded_year?: number;
  employees_count?: string;
}

export const enterprisesService = {
  // Buscar empresas
  async searchEnterprises(
    query: string = '',
    page: number = 1,
    category?: string
  ): Promise<EnterpriseSearchResponse> {
    const params = new URLSearchParams();
    if (query) params.append('search', query);
    if (category) params.append('category', category);
    params.append('page', page.toString());
    
    try {
      const response = await api.get(`/enterprises/?${params.toString()}`);
      return {
        results: response.results || response,
        count: response.count || response.length,
        next: response.next || null,
        previous: response.previous || null,
      };
    } catch (error) {
      console.error('Error searching enterprises:', error);
      return { results: [], count: 0, next: null, previous: null };
    }
  },

  // Obtener empresa por ID
  async getEnterprise(id: string): Promise<Enterprise> {
    return api.get(`/enterprises/${id}/`);
  },

  // Crear empresa
  async createEnterprise(data: CreateEnterpriseData): Promise<Enterprise> {
    return api.post('/enterprises/', data);
  },

  // Actualizar empresa
  async updateEnterprise(id: string, data: Partial<CreateEnterpriseData>): Promise<Enterprise> {
    return api.patch(`/enterprises/${id}/`, data);
  },

  // Obtener mis empresas
  async getMyEnterprises(): Promise<Enterprise[]> {
    const response = await api.get('/enterprises/my_enterprises/');
    return response;
  },

  // Seguir empresa
  async followEnterprise(id: string): Promise<{ following: boolean; followers_count: number }> {
    return api.post(`/enterprises/${id}/follow/`);
  },

  // Dejar de seguir empresa
  async unfollowEnterprise(id: string): Promise<{ following: boolean; followers_count: number }> {
    return api.post(`/enterprises/${id}/unfollow/`);
  },

  // Subir logo
  async uploadLogo(id: string, file: File): Promise<Enterprise> {
    const formData = new FormData();
    formData.append('logo', file);
    return api.post(`/enterprises/${id}/upload_logo/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Subir portada
  async uploadCover(id: string, file: File): Promise<Enterprise> {
    const formData = new FormData();
    formData.append('cover_image', file);
    return api.post(`/enterprises/${id}/upload_cover/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Obtener categorías de empresas
  async getCategories(): Promise<{ value: string; label: string }[]> {
    return [
      { value: 'deportes', label: 'Deportes' },
      { value: 'fitness', label: 'Fitness' },
      { value: 'nutricion', label: 'Nutrición' },
      { value: 'tecnologia', label: 'Tecnología' },
      { value: 'salud', label: 'Salud' },
      { value: 'educacion', label: 'Educación' },
      { value: 'entretenimiento', label: 'Entretenimiento' },
      { value: 'moda', label: 'Moda' },
      { value: 'alimentos', label: 'Alimentos' },
      { value: 'servicios', label: 'Servicios' },
      { value: 'otro', label: 'Otro' },
    ];
  },
};

export default enterprisesService;
