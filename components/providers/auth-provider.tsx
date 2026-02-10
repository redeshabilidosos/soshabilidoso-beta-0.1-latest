/**
 * Provider de autenticación integrado con el backend
 * Optimizado para navegación rápida
 */
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useRef, useCallback, useMemo, startTransition } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types/user';
import { authService, LoginCredentials, RegisterData } from '@/lib/services/auth.service';
import { toast } from 'sonner';
import { setCachedUser } from '@/lib/hooks/use-cached-auth';
import { preloadSiteSettings } from '@/lib/services/site-settings';
import { menuConfigService } from '@/lib/services/menu-config';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  refreshUser: () => Promise<void>;
  uploadAvatar: (file: File) => Promise<boolean>;
  uploadCoverPhoto: (file: File) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Caché global para evitar múltiples cargas
let globalUserCache: User | null = null;
let isGlobalInitialized = false;

// Función para inicializar el caché desde localStorage
function initializeGlobalCache() {
  if (typeof window === 'undefined' || isGlobalInitialized) return;
  
  try {
    const stored = localStorage.getItem('user');
    const token = localStorage.getItem('access_token');
    
    if (stored && token) {
      const parsedUser = JSON.parse(stored) as any;
      // Asegurar que el usuario tenga los campos necesarios
      globalUserCache = {
        ...parsedUser,
        displayName: parsedUser.display_name || parsedUser.displayName || parsedUser.username,
        avatar: parsedUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(parsedUser.display_name || parsedUser.displayName || parsedUser.username || 'U')}&background=39FF14&color=000`,
      };
      setCachedUser(globalUserCache);
      console.log('✅ Usuario cargado desde localStorage:', globalUserCache?.username);
    }
    isGlobalInitialized = true;
  } catch (e) {
    console.error('Error inicializando caché de usuario:', e);
    isGlobalInitialized = true;
  }
}

// Inicializar caché inmediatamente (antes del render)
initializeGlobalCache();

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  // Inicializar con el caché global para evitar parpadeo
  const [user, setUser] = useState<User | null>(globalUserCache);
  const [isLoading, setIsLoading] = useState(!globalUserCache);
  const isInitializedRef = useRef(isGlobalInitialized);
  const verificationDoneRef = useRef(false);

  const isAuthenticated = !!user;

  // Función para actualizar usuario y caché
  const updateUser = useCallback((newUser: User | null) => {
    setUser(newUser);
    globalUserCache = newUser;
    setCachedUser(newUser);
  }, []);

  // Inicializar autenticación al cargar - OPTIMIZADO
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const initAuth = async () => {
      // Si ya está inicializado con usuario, solo verificar en background
      if (isInitializedRef.current && user) {
        if (!verificationDoneRef.current) {
          verificationDoneRef.current = true;
          // OPTIMIZACIÓN: Usar startTransition para no bloquear UI
          startTransition(() => {
            refreshUser().catch(console.warn);
          });
        }
        return;
      }
      
      try {
        const storedUser = authService.getCurrentUser();
        const hasToken = authService.isAuthenticated();
        
        if (storedUser && hasToken) {
          // Asegurar que el usuario tenga los campos necesarios
          const storedUserAny = storedUser as any;
          const normalizedUser = {
            ...storedUser,
            displayName: storedUserAny.display_name || storedUser.displayName || storedUser.username,
            avatar: storedUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(storedUserAny.display_name || storedUser.displayName || storedUser.username || 'U')}&background=39FF14&color=000`,
          };
          
          updateUser(normalizedUser);
          setIsLoading(false);
          isInitializedRef.current = true;
          
          // OPTIMIZACIÓN: Obtener perfil actualizado en background con startTransition
          startTransition(() => {
            authService.getProfile()
              .then(freshUser => {
                const freshUserAny = freshUser as any;
                const mappedUser = {
                  ...freshUser,
                  displayName: freshUserAny.display_name || freshUser.displayName,
                  avatar: freshUser.avatar || freshUserAny.avatar_url,
                  coverPhoto: freshUserAny.cover_photo_url || freshUserAny.cover_photo,
                };
                updateUser(mappedUser);
                localStorage.setItem('user', JSON.stringify(mappedUser));
              })
              .catch(() => {
                // Silenciosamente fallar, usar datos locales
              });
          });
        } else {
          setIsLoading(false);
          isInitializedRef.current = true;
        }
      } catch (error) {
        console.error('❌ Error cargando usuario:', error);
        setIsLoading(false);
        isInitializedRef.current = true;
      }
    };
    
    initAuth();
  }, []); // Sin dependencias - solo ejecutar una vez

  const initializeAuth = useCallback(async () => {
    if (verificationDoneRef.current) return;
    verificationDoneRef.current = true;
    
    try {
      if (authService.isAuthenticated()) {
        try {
          const verifiedUser = await authService.verifyToken();
          // Solo actualizar si hay cambios significativos
          if (verifiedUser && JSON.stringify(verifiedUser) !== JSON.stringify(user)) {
            updateUser(verifiedUser);
          }
        } catch (error) {
          console.warn('⚠️ Error verificando token:', error);
          // Mantener usuario del localStorage
        }
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
    }
  }, [user, updateUser]);

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);
      
      updateUser(response.user);
      verificationDoneRef.current = false; // Reset para permitir verificación
      
      toast.success(`¡Bienvenido, ${response.user.displayName}!`);
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message ||
                          error.response?.data?.non_field_errors?.[0] ||
                          'Error al iniciar sesión';
      
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [updateUser]);

  const register = useCallback(async (data: RegisterData): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authService.register(data);
      updateUser(response.user);
      
      toast.success(`¡Cuenta creada exitosamente! Bienvenido, ${response.user.displayName}!`);
      return true;
    } catch (error: any) {
      console.error('Register error:', error);
      
      if (error.response?.data) {
        const errors = error.response.data;
        Object.entries(errors).forEach(([field, messages]) => {
          if (Array.isArray(messages)) {
            messages.forEach((message: string) => {
              toast.error(`${field}: ${message}`);
            });
          } else {
            toast.error(`${field}: ${messages}`);
          }
        });
      } else {
        toast.error('Error al crear la cuenta');
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [updateUser]);

  const logout = useCallback(async (): Promise<void> => {
    try {
      // Limpiar estado inmediatamente para UI rápida
      updateUser(null);
      globalUserCache = null;
      isGlobalInitialized = false;
      verificationDoneRef.current = false;
      
      // Logout en background
      authService.logout().catch(console.error);
      
      toast.success('Sesión cerrada exitosamente');
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      updateUser(null);
      router.push('/login');
    }
  }, [router, updateUser]);

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Mapear campos del frontend al backend
      const backendData: any = {};
      if (data.displayName !== undefined) backendData.display_name = data.displayName;
      if (data.bio !== undefined) backendData.bio = data.bio;
      if (data.position !== undefined) backendData.position = data.position;
      if (data.team !== undefined) backendData.team = data.team;
      
      // Solo enviar contact_number si tiene valor, de lo contrario enviar null
      if (data.contactNumber !== undefined) {
        backendData.contact_number = data.contactNumber.trim() || null;
      }
      
      if (data.interests !== undefined) backendData.interests = data.interests;
      if (data.coverPhoto !== undefined) {
        backendData.cover_photo = data.coverPhoto;
        backendData.cover_photo_url = data.coverPhoto;
      }
      
      console.log('📤 Enviando datos al backend:', backendData);
      
      const updatedUser = await authService.updateProfile(backendData);
      
      // Mapear campos del backend al frontend
      const updatedUserAny = updatedUser as any;
      const mappedUser = {
        ...updatedUser,
        displayName: updatedUserAny.display_name || updatedUser.displayName,
        coverPhoto: updatedUserAny.cover_photo_url || updatedUserAny.cover_photo || updatedUser.coverPhoto,
        contactNumber: updatedUserAny.contact_number || updatedUser.contactNumber,
      };
      
      console.log('✅ Perfil actualizado:', mappedUser);
      setUser(mappedUser);
      localStorage.setItem('user', JSON.stringify(mappedUser));
      
      toast.success('Perfil actualizado exitosamente');
      return true;
    } catch (error: any) {
      console.error('❌ Update profile error:', error);
      console.error('❌ Error response data:', error.response?.data);
      
      // Mostrar errores específicos de validación
      if (error.response?.data) {
        const errors = error.response.data;
        
        // Si hay errores de campo específicos
        if (typeof errors === 'object' && !errors.detail && !errors.message) {
          Object.entries(errors).forEach(([field, messages]: [string, any]) => {
            const fieldName = field === 'display_name' ? 'Nombre' :
                            field === 'bio' ? 'Biografía' :
                            field === 'position' ? 'Posición' :
                            field === 'team' ? 'Equipo' :
                            field === 'contact_number' ? 'Teléfono' :
                            field === 'interests' ? 'Intereses' : field;
            
            if (Array.isArray(messages)) {
              messages.forEach((msg: string) => {
                toast.error(`${fieldName}: ${msg}`);
              });
            } else {
              toast.error(`${fieldName}: ${messages}`);
            }
          });
          return false;
        }
      }
      
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          'Error al actualizar el perfil';
      
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      if (authService.isAuthenticated()) {
        const refreshedUser = await authService.getProfile();
        
        // Mapear campos del backend al frontend
        const refreshedUserAny = refreshedUser as any;
        const mappedUser = {
          ...refreshedUser,
          displayName: refreshedUserAny.display_name || refreshedUser.displayName,
          avatar: refreshedUser.avatar || refreshedUserAny.avatar_url,
          coverPhoto: refreshedUserAny.cover_photo_url || refreshedUserAny.cover_photo || refreshedUser.coverPhoto,
        };
        
        console.log('🔄 Usuario refrescado:', {
          avatar: mappedUser.avatar,
          coverPhoto: mappedUser.coverPhoto
        });
        setUser(mappedUser);
        globalUserCache = mappedUser;
        localStorage.setItem('user', JSON.stringify(mappedUser));
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
      // Si falla el refresh, mantener el usuario actual
    }
  };

  const uploadAvatar = async (file: File): Promise<boolean> => {
    console.log('🎯 [AUTH PROVIDER] uploadAvatar iniciado');
    console.log('📁 [AUTH PROVIDER] Archivo:', {
      name: file.name,
      size: file.size,
      type: file.type
    });
    
    try {
      setIsLoading(true);
      console.log('📤 [AUTH PROVIDER] Llamando a authService.uploadAvatar...');
      
      const response = await authService.uploadAvatar(file);
      
      console.log('✅ [AUTH PROVIDER] Avatar subido, respuesta completa:', JSON.stringify(response, null, 2));
      console.log('✅ [AUTH PROVIDER] avatar_url:', response.avatar_url);
      console.log('✅ [AUTH PROVIDER] user en respuesta:', response.user ? 'SÍ' : 'NO');
      
      // Actualizar el usuario con los datos completos del servidor
      if (response.user) {
        // Mapear campos del backend al frontend
        const responseUserAny = response.user as any;
        const mappedUser = {
          ...response.user,
          displayName: responseUserAny.display_name || response.user.displayName,
          avatar: response.user.avatar || responseUserAny.avatar_url || (response as any).avatar_url,
          coverPhoto: responseUserAny.cover_photo_url || responseUserAny.cover_photo,
        };
        console.log('✅ [AUTH PROVIDER] Usuario mapeado:', {
          username: mappedUser.username,
          avatar: mappedUser.avatar,
          displayName: mappedUser.displayName
        });
        setUser(mappedUser);
        globalUserCache = mappedUser;
        localStorage.setItem('user', JSON.stringify(mappedUser));
        console.log('💾 [AUTH PROVIDER] Usuario guardado en localStorage');
      } else if (user) {
        // Fallback: actualizar solo el avatar
        const updatedUser = { 
          ...user,
          avatar: response.avatar_url,
        };
        console.log('⚠️ [AUTH PROVIDER] Usando fallback, actualizando solo avatar:', updatedUser.avatar);
        setUser(updatedUser);
        globalUserCache = updatedUser;
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      // Forzar actualización del perfil desde el servidor para asegurar sincronización
      console.log('🔄 [AUTH PROVIDER] Programando refresh del usuario en 500ms...');
      setTimeout(() => {
        console.log('🔄 [AUTH PROVIDER] Ejecutando refreshUser...');
        refreshUser();
      }, 500);
      
      return true;
    } catch (error: any) {
      console.error('❌ [AUTH PROVIDER] Upload avatar error:', error);
      console.error('❌ [AUTH PROVIDER] Error response:', error.response?.data);
      console.error('❌ [AUTH PROVIDER] Error status:', error.response?.status);
      
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          'Error al subir el avatar';
      
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
      console.log('🏁 [AUTH PROVIDER] uploadAvatar finalizado');
    }
  };

  const uploadCoverPhoto = async (file: File): Promise<boolean> => {
    console.log('🎯 [AUTH PROVIDER] uploadCoverPhoto iniciado');
    console.log('📁 [AUTH PROVIDER] Archivo:', {
      name: file.name,
      size: file.size,
      type: file.type
    });
    
    try {
      setIsLoading(true);
      console.log('📤 [AUTH PROVIDER] Llamando a authService.uploadCoverPhoto...');
      
      const response = await authService.uploadCoverPhoto(file);
      
      console.log('✅ [AUTH PROVIDER] Foto de portada subida, respuesta completa:', JSON.stringify(response, null, 2));
      console.log('✅ [AUTH PROVIDER] cover_photo_url:', response.cover_photo_url);
      console.log('✅ [AUTH PROVIDER] user en respuesta:', response.user ? 'SÍ' : 'NO');
      
      // Actualizar el usuario con los datos completos del servidor
      if (response.user) {
        // Mapear campos del backend al frontend
        const responseUserAny = response.user as any;
        const responseAny = response as any;
        const mappedUser = {
          ...response.user,
          coverPhoto: responseUserAny.cover_photo_url || responseUserAny.cover_photo || responseAny.cover_photo_url,
        };
        console.log('✅ [AUTH PROVIDER] Usuario mapeado:', {
          username: mappedUser.username,
          coverPhoto: mappedUser.coverPhoto,
          cover_photo_url: mappedUser.cover_photo_url
        });
        setUser(mappedUser);
        localStorage.setItem('user', JSON.stringify(mappedUser));
        console.log('💾 [AUTH PROVIDER] Usuario guardado en localStorage');
      } else if (user) {
        // Fallback: actualizar solo la foto de portada
        const updatedUser = { 
          ...user,
          coverPhoto: response.cover_photo_url,
          cover_photo: response.cover_photo_url,
          cover_photo_url: response.cover_photo_url,
        };
        console.log('⚠️ [AUTH PROVIDER] Usando fallback, actualizando solo coverPhoto:', updatedUser.coverPhoto);
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      // Forzar actualización del perfil desde el servidor
      console.log('🔄 [AUTH PROVIDER] Ejecutando refreshUser inmediatamente...');
      await refreshUser();
      
      return true;
    } catch (error: any) {
      console.error('❌ [AUTH PROVIDER] Upload cover photo error:', error);
      console.error('❌ [AUTH PROVIDER] Error response:', error.response?.data);
      console.error('❌ [AUTH PROVIDER] Error status:', error.response?.status);
      
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          'Error al subir la foto de portada';
      
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
      console.log('🏁 [AUTH PROVIDER] uploadCoverPhoto finalizado');
    }
  };

  // Memoizar el valor del contexto para evitar re-renders innecesarios
  const value = useMemo<AuthContextType>(() => ({
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    refreshUser,
    uploadAvatar,
    uploadCoverPhoto,
  }), [user, isLoading, isAuthenticated, login, register, logout, updateProfile, refreshUser, uploadAvatar, uploadCoverPhoto]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}