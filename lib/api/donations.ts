/**
 * API de Donaciones - Conexión con el backend Django
 */

// La URL base puede o no incluir /api al final
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
// Asegurarse de que no tenga /api duplicado
const API_BASE_URL = API_URL.endsWith('/api') ? API_URL.replace('/api', '') : API_URL;

export interface SportCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  athletes_count: number;
}

export interface AthleteMedia {
  id: string;
  media_type: 'image' | 'video';
  url: string;
  thumbnail_url: string;
  title: string;
  description: string;
  order: number;
  is_cover: boolean;
}

export interface Athlete {
  id: string;
  full_name: string;
  age: number;
  height: string;
  weight?: string;
  city: string;
  country: string;
  sport: string | SportCategory; // Puede ser string (ID) o objeto completo
  sport_name?: string;
  position: string;
  team: string;
  experience_years?: number;
  achievements?: string;
  description: string;
  goal_description?: string;
  goal_amount: number;
  raised_amount: number;
  donors_count: number;
  progress_percentage: number;
  is_verified: boolean;
  is_featured: boolean;
  cover_image: string | null;
  avatar: string | null;
  media?: AthleteMedia[];
  username?: string;
  created_at: string;
}

export interface Donation {
  id: string;
  athlete: string;
  athlete_name: string;
  donor_display_name: string;
  amount: number;
  payment_method: string;
  status: string;
  message: string;
  created_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/**
 * Obtener lista de deportes
 */
export async function getSports(): Promise<SportCategory[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/donations/sports/`);
    if (!response.ok) throw new Error('Error al obtener deportes');
    const data = await response.json();
    return data.results || data;
  } catch (error) {
    console.error('Error fetching sports:', error);
    return [];
  }
}

/**
 * Obtener lista de deportistas
 */
export async function getAthletes(params?: {
  sport?: string;
  city?: string;
  search?: string;
  featured?: boolean;
}): Promise<Athlete[]> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.sport && params.sport !== 'Todos') {
      searchParams.append('sport', params.sport.toLowerCase());
    }
    if (params?.city) searchParams.append('city', params.city);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.featured) searchParams.append('featured', 'true');

    const url = `${API_BASE_URL}/api/donations/athletes/?${searchParams.toString()}`;
    console.log('🔄 Fetching athletes from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    console.log('📡 Response status:', response.status);
    
    if (!response.ok) {
      console.error('❌ Response not OK:', response.status, response.statusText);
      throw new Error(`Error al obtener deportistas: ${response.status}`);
    }
    
    const data: PaginatedResponse<Athlete> = await response.json();
    console.log('✅ Athletes loaded:', data.count, 'results');
    return data.results || [];
  } catch (error) {
    console.error('❌ Error fetching athletes:', error);
    return [];
  }
}

/**
 * Obtener detalle de un deportista
 */
export async function getAthleteById(id: string): Promise<Athlete | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/donations/athletes/${id}/`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Error al obtener deportista');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching athlete:', error);
    return null;
  }
}

/**
 * Crear una donación
 */
export async function createDonation(data: {
  athlete: string;
  amount: number;
  payment_method: string;
  donor_name?: string;
  donor_email?: string;
  is_anonymous?: boolean;
  message?: string;
}, token?: string): Promise<Donation | null> {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/donations/donations/`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Error al crear donación');
    return await response.json();
  } catch (error) {
    console.error('Error creating donation:', error);
    return null;
  }
}

/**
 * Obtener donaciones del usuario actual
 */
export async function getMyDonations(token: string): Promise<Donation[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/donations/donations/my_donations/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) throw new Error('Error al obtener donaciones');
    return await response.json();
  } catch (error) {
    console.error('Error fetching my donations:', error);
    return [];
  }
}

/**
 * Placeholder para imágenes - usa ui-avatars como fallback
 */
const DEFAULT_PLACEHOLDER = 'https://ui-avatars.com/api/?name=SOS&background=1a1a2e&color=00ff88&size=400';
const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=User&background=00ff88&color=fff&size=100';

/**
 * Obtener el nombre del deporte (puede venir como string o como objeto)
 */
function getSportName(athlete: Athlete): string {
  if (athlete.sport_name) return athlete.sport_name;
  if (typeof athlete.sport === 'object' && athlete.sport !== null) {
    return (athlete.sport as SportCategory).name;
  }
  return String(athlete.sport);
}

/**
 * Transformar datos de la API al formato del frontend
 */
export function transformAthleteForCard(athlete: Athlete) {
  // Construir array de media, usando cover_image si no hay media
  let mediaArray = athlete.media?.filter(m => m.url).map(m => ({
    type: m.media_type,
    url: m.url,
    thumbnail: m.thumbnail_url || m.url,
  })) || [];

  // Si no hay media pero hay cover_image, usarla
  if (mediaArray.length === 0 && athlete.cover_image) {
    mediaArray = [{ type: 'image', url: athlete.cover_image, thumbnail: athlete.cover_image }];
  }

  // Si aún no hay media, usar placeholder
  if (mediaArray.length === 0) {
    mediaArray = [{ type: 'image', url: DEFAULT_PLACEHOLDER, thumbnail: DEFAULT_PLACEHOLDER }];
  }

  return {
    id: athlete.id,
    name: athlete.full_name,
    username: athlete.username || athlete.full_name.toLowerCase().replace(/\s+/g, ''),
    age: athlete.age,
    height: athlete.height,
    sport: getSportName(athlete),
    position: athlete.position,
    city: `${athlete.city}, ${athlete.country}`,
    description: athlete.description,
    goal: parseFloat(String(athlete.goal_amount)),
    raised: parseFloat(String(athlete.raised_amount)),
    donors: athlete.donors_count,
    media: mediaArray,
    avatar: athlete.avatar || athlete.cover_image || DEFAULT_AVATAR,
    verified: athlete.is_verified,
    featured: athlete.is_featured,
  };
}

/**
 * Transformar datos de la API al formato detallado del frontend
 */
export function transformAthleteForDetail(athlete: Athlete) {
  return {
    ...transformAthleteForCard(athlete),
    weight: athlete.weight,
    team: athlete.team,
    experienceYears: athlete.experience_years || 0,
    achievements: athlete.achievements || '',
    goalDescription: athlete.goal_description || athlete.description,
    createdAt: athlete.created_at,
  };
}
