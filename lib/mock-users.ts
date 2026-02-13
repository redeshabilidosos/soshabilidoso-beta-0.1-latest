/**
 * Usuarios de prueba para desarrollo local
 */
import { User } from '@/types/user';

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'usuario_prueba',
    email: 'prueba@test.com',
    displayName: 'Usuario de Prueba',
    bio: 'Usuario de prueba para desarrollo local',
    avatar: '/logo.png',
    coverPhoto: null,
    cover_photo: null,
    cover_photo_url: null,
    position: 'Desarrollador',
    team: 'Equipo SOS',
    contactNumber: '+1234567890',
    is_verified: true,
    followers: 42,
    following: 24,
    posts: 15,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    username: 'admin',
    email: 'admin@test.com',
    displayName: 'Administrador',
    bio: 'Cuenta de administrador para pruebas',
    avatar: '/logo.png',
    coverPhoto: null,
    cover_photo: null,
    cover_photo_url: null,
    position: 'Admin',
    team: 'SOS Team',
    contactNumber: '+0987654321',
    is_verified: true,
    followers: 100,
    following: 50,
    posts: 25,
    createdAt: new Date().toISOString(),
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