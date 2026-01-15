/**
 * Usuarios de prueba para desarrollo local
 */
import { User } from '@/types/user';

export const mockUsers: User[] = [
  {
    id: 1,
    username: 'usuario_prueba',
    email: 'prueba@test.com',
    display_name: 'Usuario de Prueba',
    bio: 'Usuario de prueba para desarrollo local',
    avatar: '/logo.png',
    coverPhoto: null,
    cover_photo: null,
    cover_photo_url: null,
    position: 'Desarrollador',
    team: 'Equipo SOS',
    contact_number: '+1234567890',
    is_verified: true,
    followers_count: 42,
    following_count: 24,
    posts_count: 15,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    username: 'admin',
    email: 'admin@test.com',
    display_name: 'Administrador',
    bio: 'Cuenta de administrador para pruebas',
    avatar: '/logo.png',
    coverPhoto: null,
    cover_photo: null,
    cover_photo_url: null,
    position: 'Admin',
    team: 'SOS Team',
    contact_number: '+0987654321',
    is_verified: true,
    followers_count: 100,
    following_count: 50,
    posts_count: 25,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

export const mockCredentials = [
  {
    login: 'usuario_prueba',
    password: '123456',
    user: mockUsers[0]
  },
  {
    login: 'prueba@test.com',
    password: '123456',
    user: mockUsers[0]
  },
  {
    login: 'admin',
    password: 'admin123',
    user: mockUsers[1]
  },
  {
    login: 'admin@test.com',
    password: 'admin123',
    user: mockUsers[1]
  }
];