/**
 * Servicio de API para Clasificados
 */
import api from '../api-client';

// Tipos
export interface ClassifiedSeller {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  avatar: string | null;
  rating: number;
  verified: boolean;
}

export interface BaseClassified {
  id: string;
  short_id: string;
  title: string;
  description: string;
  price: number;
  currency: 'COP' | 'USD';
  negotiable: boolean;
  location: string;
  latitude?: number;
  longitude?: number;
  images: string[];
  status: 'draft' | 'active' | 'paused' | 'sold' | 'expired' | 'deleted';
  is_featured: boolean;
  views_count: number;
  likes_count: number;
  contacts_count: number;
  tags: string[];
  created_at: string;
  updated_at: string;
  expires_at?: string;
  seller: ClassifiedSeller;
  is_liked: boolean;
}

export interface ProductClassified extends BaseClassified {
  category: string;
  condition: 'new' | 'like_new' | 'good' | 'fair';
  brand?: string;
  model?: string;
  delivery_available: boolean;
  delivery_cost?: number;
  pickup_available: boolean;
}

export interface ServiceClassified extends BaseClassified {
  category: string;
  availability: string;
  typical_duration: string;
  coverage_area: string;
  coverage_radius_km?: number;
  price_type: 'hourly' | 'service' | 'project';
  rating: number;
  reviews_count: number;
  instant_booking: boolean;
}

export interface FreelancerClassified extends BaseClassified {
  category: string;
  skills: string[];
  portfolio_url: string;
  portfolio_images: string[];
  delivery_time: string;
  project_type: 'one_time' | 'ongoing' | 'both';
  years_experience: number;
  rating: number;
  reviews_count: number;
  completed_projects: number;
}

export interface CreateProductData {
  title: string;
  description: string;
  price: number;
  currency: 'COP' | 'USD';
  negotiable: boolean;
  location: string;
  images: string[];
  tags: string[];
  category: string;
  condition: string;
  brand?: string;
  model?: string;
  delivery_available: boolean;
  delivery_cost?: number;
  pickup_available: boolean;
}

export interface CreateServiceData {
  title: string;
  description: string;
  price: number;
  currency: 'COP' | 'USD';
  negotiable: boolean;
  location: string;
  images: string[];
  tags: string[];
  category: string;
  availability: string;
  typical_duration: string;
  coverage_area?: string;
  coverage_radius_km?: number;
  price_type: 'hourly' | 'service' | 'project';
  instant_booking: boolean;
}

export interface CreateFreelancerData {
  title: string;
  description: string;
  price: number;
  currency: 'COP' | 'USD';
  negotiable: boolean;
  location: string;
  images: string[];
  tags: string[];
  category: string;
  skills: string[];
  portfolio_url?: string;
  portfolio_images?: string[];
  delivery_time: string;
  project_type: 'one_time' | 'ongoing' | 'both';
  years_experience?: number;
}

export interface ClassifiedsStats {
  total_products: number;
  total_services: number;
  total_freelancers: number;
  total_active: number;
}

// Servicio de Clasificados
export const classifiedsService = {
  // === PRODUCTOS ===
  async getProducts(params?: {
    category?: string;
    condition?: string;
    min_price?: number;
    max_price?: number;
    location?: string;
    search?: string;
  }): Promise<ProductClassified[]> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, String(value));
      });
    }
    return api.get(`/classifieds/products/?${queryParams.toString()}`);
  },

  async getProduct(id: string): Promise<ProductClassified> {
    return api.get(`/classifieds/products/${id}/`);
  },

  async createProduct(data: CreateProductData): Promise<ProductClassified> {
    return api.post('/classifieds/products/', data);
  },

  async updateProduct(id: string, data: Partial<CreateProductData>): Promise<ProductClassified> {
    return api.patch(`/classifieds/products/${id}/`, data);
  },

  async deleteProduct(id: string): Promise<void> {
    return api.delete(`/classifieds/products/${id}/`);
  },

  async getMyProducts(): Promise<ProductClassified[]> {
    return api.get('/classifieds/products/my_products/');
  },

  async likeProduct(id: string): Promise<{ liked: boolean; likes_count: number }> {
    return api.post(`/classifieds/products/${id}/like/`);
  },

  async contactProductSeller(id: string, message: string): Promise<any> {
    return api.post(`/classifieds/products/${id}/contact/`, { message });
  },

  // === SERVICIOS ===
  async getServices(params?: {
    category?: string;
    min_price?: number;
    max_price?: number;
    location?: string;
    search?: string;
    min_rating?: number;
  }): Promise<ServiceClassified[]> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, String(value));
      });
    }
    return api.get(`/classifieds/services/?${queryParams.toString()}`);
  },

  async getService(id: string): Promise<ServiceClassified> {
    return api.get(`/classifieds/services/${id}/`);
  },

  async createService(data: CreateServiceData): Promise<ServiceClassified> {
    return api.post('/classifieds/services/', data);
  },

  async updateService(id: string, data: Partial<CreateServiceData>): Promise<ServiceClassified> {
    return api.patch(`/classifieds/services/${id}/`, data);
  },

  async deleteService(id: string): Promise<void> {
    return api.delete(`/classifieds/services/${id}/`);
  },

  async getMyServices(): Promise<ServiceClassified[]> {
    return api.get('/classifieds/services/my_services/');
  },

  async likeService(id: string): Promise<{ liked: boolean; likes_count: number }> {
    return api.post(`/classifieds/services/${id}/like/`);
  },

  async contactServiceProvider(id: string, message: string): Promise<any> {
    return api.post(`/classifieds/services/${id}/contact/`, { message });
  },

  async reviewService(id: string, rating: number, comment: string): Promise<any> {
    return api.post(`/classifieds/services/${id}/review/`, { rating, comment });
  },

  // === FREELANCER ===
  async getFreelancerAds(params?: {
    category?: string;
    min_price?: number;
    max_price?: number;
    location?: string;
    search?: string;
    min_rating?: number;
    skill?: string;
  }): Promise<FreelancerClassified[]> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, String(value));
      });
    }
    return api.get(`/classifieds/freelancer/?${queryParams.toString()}`);
  },

  async getFreelancerAd(id: string): Promise<FreelancerClassified> {
    return api.get(`/classifieds/freelancer/${id}/`);
  },

  async createFreelancerAd(data: CreateFreelancerData): Promise<FreelancerClassified> {
    return api.post('/classifieds/freelancer/', data);
  },

  async updateFreelancerAd(id: string, data: Partial<CreateFreelancerData>): Promise<FreelancerClassified> {
    return api.patch(`/classifieds/freelancer/${id}/`, data);
  },

  async deleteFreelancerAd(id: string): Promise<void> {
    return api.delete(`/classifieds/freelancer/${id}/`);
  },

  async getMyFreelancerAds(): Promise<FreelancerClassified[]> {
    return api.get('/classifieds/freelancer/my_freelancer_ads/');
  },

  async likeFreelancerAd(id: string): Promise<{ liked: boolean; likes_count: number }> {
    return api.post(`/classifieds/freelancer/${id}/like/`);
  },

  async contactFreelancer(id: string, message: string): Promise<any> {
    return api.post(`/classifieds/freelancer/${id}/contact/`, { message });
  },

  async reviewFreelancer(id: string, rating: number, comment: string): Promise<any> {
    return api.post(`/classifieds/freelancer/${id}/review/`, { rating, comment });
  },

  // === TODOS LOS CLASIFICADOS ===
  async getAllClassifieds(params?: {
    search?: string;
    type?: 'product' | 'service' | 'freelancer';
  }): Promise<Array<{ type: string; data: any }>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, String(value));
      });
    }
    return api.get(`/classifieds/all/?${queryParams.toString()}`);
  },

  async getMyClassifieds(): Promise<Array<{ type: string; data: any }>> {
    return api.get('/classifieds/all/my_classifieds/');
  },

  async getStats(): Promise<ClassifiedsStats> {
    return api.get('/classifieds/all/stats/');
  },
};

export default classifiedsService;
