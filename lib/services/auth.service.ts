/**
 * Servicio de autenticación
 */
import { api } from '../api-client';
import { User } from '@/types/user';
import { mockCredentials, mockUsers } from '../mock-users';

export interface LoginCredentials {
  login: string;  // Puede ser email o username
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  display_name: string;
  password: string;
  password_confirm: string;
  position?: string;
  team?: string;
  bio?: string;
  contact_number?: string;
  account_type?: 'user' | 'enterprise';
  company_name?: string;
  industry?: string;
  website?: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface PasswordChangeData {
  current_password: string;
  new_password: string;
  new_password_confirm: string;
}

export class AuthService {
  // Mapear campos del backend al frontend
  private mapUserFields(user: any): User {
    // Asegurar que las URLs de imágenes sean absolutas
    const ensureAbsoluteUrl = (url: string | null | undefined): string | undefined => {
      if (!url) return undefined;
      if (url.startsWith('http')) return url;
      // Si es una URL relativa, agregar el dominio del backend
      return `http://127.0.0.1:8000${url}`;
    };

    return {
      ...user,
      displayName: user.display_name || user.displayName || user.company_name || user.username,
      coverPhoto: ensureAbsoluteUrl(user.cover_photo_url || user.cover_photo || user.coverPhoto),
      contactNumber: user.contact_number || user.contactNumber,
      createdAt: user.created_at || user.createdAt,
      // Asegurar que avatar tenga un valor por defecto
      avatar: ensureAbsoluteUrl(user.avatar || user.avatar_url) || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.display_name || user.displayName || user.company_name || user.username)}&background=39FF14&color=000`,
      // Mapear tipo de cuenta
      accountType: user.account_type || user.accountType || 'user',
      account_type: user.account_type || user.accountType || 'user',
    };
  }

  // Iniciar sesión
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login/', credentials);
      
      // Mapear campos del usuario
      const mappedUser = this.mapUserFields(response.user);
      
      // Guardar tokens en localStorage
      localStorage.setItem('access_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);
      localStorage.setItem('user', JSON.stringify(mappedUser));
      
      return { ...response, user: mappedUser };
    } catch (error: any) {
      // Fallback a usuarios mock si el backend no está disponible
      if (!error.response || error.response.status >= 500) {
        const mockUser = mockCredentials.find(
          cred => cred.login === credentials.login && cred.password === credentials.password
        );
        
        if (mockUser) {
          const mockTokens = {
            access: 'mock_access_token_' + Date.now(),
            refresh: 'mock_refresh_token_' + Date.now()
          };
          
          // Guardar tokens mock en localStorage
          localStorage.setItem('access_token', mockTokens.access);
          localStorage.setItem('refresh_token', mockTokens.refresh);
          localStorage.setItem('user', JSON.stringify(mockUser.user));
          localStorage.setItem('mock_mode', 'true');
          
          return {
            access: mockTokens.access,
            refresh: mockTokens.refresh,
            user: mockUser.user
          };
        }
      }
      
      throw error;
    }
  }

  // Registrarse
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<any>('/auth/register/', data);
    
    // Mapear campos del usuario
    const mappedUser = this.mapUserFields(response.user);
    
    // Guardar tokens en localStorage
    // El backend devuelve tokens en response.tokens
    localStorage.setItem('access_token', response.tokens.access);
    localStorage.setItem('refresh_token', response.tokens.refresh);
    localStorage.setItem('user', JSON.stringify(mappedUser));
    
    return {
      access: response.tokens.access,
      refresh: response.tokens.refresh,
      user: mappedUser
    };
  }

  // Cerrar sesión
  async logout(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await api.post('/auth/logout/', { refresh_token: refreshToken });
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Limpiar localStorage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      localStorage.removeItem('mock_mode');
    }
  }

  // Obtener perfil del usuario
  async getProfile(): Promise<User> {
    try {
      const response = await api.get<User>('/auth/profile/');
      const mappedUser = this.mapUserFields(response);
      localStorage.setItem('user', JSON.stringify(mappedUser));
      return mappedUser;
    } catch (error) {
      // Fallback a usuario mock si está en modo mock
      if (localStorage.getItem('mock_mode') === 'true') {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          return JSON.parse(userStr);
        }
      }
      throw error;
    }
  }

  // Actualizar perfil
  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.patch<User>('/auth/profile/', data);
    
    // Mapear y actualizar usuario en localStorage
    const mappedUser = this.mapUserFields(response);
    localStorage.setItem('user', JSON.stringify(mappedUser));
    
    return mappedUser;
  }

  // Cambiar contraseña
  async changePassword(data: PasswordChangeData): Promise<void> {
    return api.post('/auth/change-password/', data);
  }

  // Solicitar reset de contraseña
  async requestPasswordReset(email: string): Promise<void> {
    return api.post('/auth/reset-password/', { email });
  }

  // Confirmar reset de contraseña
  async confirmPasswordReset(token: string, newPassword: string): Promise<void> {
    return api.post('/auth/reset-password/confirm/', {
      token,
      new_password: newPassword,
      new_password_confirm: newPassword,
    });
  }

  // Verificar token
  async verifyToken(): Promise<User> {
    try {
      const response = await api.get<{ valid: boolean; user: any }>('/auth/verify/');
      // El endpoint devuelve { valid: true, user: {...} }
      const userData = response.user || response;
      const mappedUser = this.mapUserFields(userData);
      localStorage.setItem('user', JSON.stringify(mappedUser));
      return mappedUser;
    } catch (error) {
      // Fallback a usuario mock si está en modo mock
      if (localStorage.getItem('mock_mode') === 'true') {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          return JSON.parse(userStr);
        }
      }
      throw error;
    }
  }

  // Obtener usuario actual del localStorage
  getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return null;
      
      const user = JSON.parse(userStr);
      // Mapear campos por si el usuario guardado tiene formato antiguo
      return this.mapUserFields(user);
    } catch {
      return null;
    }
  }

  // Verificar si está autenticado
  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  // Obtener token de acceso
  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // Obtener token de refresh
  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  // Subir avatar
  async uploadAvatar(file: File): Promise<{ avatar_url: string; user?: User }> {
    console.log('📤 [AUTH SERVICE] Iniciando subida de avatar:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });
    
    const formData = new FormData();
    formData.append('avatar', file);
    
    console.log('📤 [AUTH SERVICE] FormData creado, enviando a /auth/upload-avatar/');
    
    const response = await api.post('/auth/upload-avatar/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('✅ [AUTH SERVICE] Respuesta del servidor:', response);
    
    return response;
  }

  // Subir foto de portada
  async uploadCoverPhoto(file: File): Promise<{ cover_photo_url: string; user?: User }> {
    console.log('📤 [AUTH SERVICE] Iniciando subida de foto de portada:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });
    
    const formData = new FormData();
    formData.append('cover_photo', file);
    
    console.log('📤 [AUTH SERVICE] FormData creado, enviando a /auth/upload-cover/');
    
    const response = await api.post('/auth/upload-cover/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('✅ [AUTH SERVICE] Respuesta del servidor:', response);
    
    return response;
  }
}

export const authService = new AuthService();