'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/providers';
import { Sidebar } from '@/components/navigation/sidebar';
import { MobileNav } from '@/components/navigation/mobile-nav';
import { CyberButton } from '@/components/ui/cyber-button';
import { Search, Filter, UserPlus, MapPin, ChevronDown } from 'lucide-react'; // Importar ChevronDown
import { User } from '@/types/user';
import { cn } from '@/lib/utils'; // Importar cn
import { toast } from 'sonner'; // Importar toast para notificaciones

// Lista completa de roles/posiciones
const allRoles = [
  'all',
  // Deportes
  'Atleta profesional', 'Entrenador / DT', 'Árbitro / Juez deportivo', 'Preparador físico',
  'Fisioterapeuta deportivo', 'Fisioterapeuta deportivo', 'Scout / Ojeador', 'Delegado de equipo', 'Comentarista deportivo',
  'Agente deportivo', 'Nutricionista deportivo',
  // Cultura
  'Actor / Actriz', 'Director de cine o teatro', 'Guionista', 'Escritor / Novelista / Poeta',
  'Pintor / Artista visual', 'Escultor', 'Bailarín / Coreógrafo', 'Fotógrafo',
  'Gestor cultural', 'Crítico de arte',
  // Sociales
  'Trabajador social', 'Psicólogo comunitario', 'Sociólogo', 'Antropólogo',
  'Mediador familiar o comunitario', 'Activista social o ambiental', 'Educador social',
  'Promotor de salud comunitaria', 'Coordinador de ONG', 'Intérprete cultural',
  // Ramas educativas
  'Maestro / Profesor', 'Director de institución educativa', 'Orientador educativo', 'Pedagogo',
  'Investigador educativo', 'Tutor en línea', 'Especialista en educación especial',
  'Diseñador de materiales educativos', 'Administrador educativo', 'Formador corporativo',
  // Musicales
  'Músico / Instrumentista', 'Cantante / Solista', 'Compositor / Arreglista',
  'Director de orquesta o coro', 'Productor musical', 'Ingeniero de sonido', 'DJ',
  'Crítico musical', 'Luthier', 'Profesor de música',
  // Chefs / Gastronomía
  'Chef ejecutivo', 'Pastelero / Repostero', 'Panadero', 'Sous chef', 'Sommelier',
  'Bartender / Mixólogo', 'Crítico gastronómico', 'Investigador culinario',
  'Chef de catering', 'Instructor de cocina'
];

// Mock data for search results (updated with diverse roles)
const mockUsers: User[] = [
  {
    id: '2',
    email: 'maria@example.com',
    username: 'maria_skills',
    displayName: 'María González',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    position: 'Bailarín / Coreógrafo',
    team: 'Street Dance Crew',
    bio: 'Apasionada por el baile urbano y la creación de coreografías innovadoras.',
    followers: 892,
    following: 234,
    posts: 56,
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '3',
    email: 'carlos@example.com',
    username: 'carlos_gk',
    displayName: 'Carlos Mendoza',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    position: 'Productor musical',
    team: 'Sound Waves Studio',
    bio: 'Creando beats y melodías que inspiran. Más de 10 años en la producción musical.',
    followers: 654,
    following: 187,
    posts: 78,
    createdAt: '2024-01-10T14:20:00Z',
  },
  {
    id: '4',
    email: 'ana@example.com',
    username: 'ana_striker',
    displayName: 'Ana Rodríguez',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
    position: 'Chef ejecutivo',
    team: 'Restaurante Sabor',
    bio: 'Innovando en la cocina con fusiones de sabores latinos y asiáticos. Máxima creatividad culinaria.',
    followers: 1203,
    following: 456,
    posts: 112,
    createdAt: '2024-01-05T09:15:00Z',
  },
  {
    id: '5',
    email: 'luis@example.com',
    username: 'luis_defense',
    displayName: 'Luis Ramírez',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
    position: 'Maestro / Profesor',
    team: 'Universidad Nacional',
    bio: 'Apasionado por la enseñanza y el desarrollo de nuevas metodologías educativas.',
    followers: 445,
    following: 123,
    posts: 34,
    createdAt: '2024-01-20T08:45:00Z',
  },
  {
    id: '6',
    email: 'sofia@example.com',
    username: 'sofia_art',
    displayName: 'Sofía Arteaga',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400',
    position: 'Pintor / Artista visual',
    team: 'Estudio Creativo',
    bio: 'Explorando el arte abstracto y la expresión a través del color y la forma.',
    followers: 678,
    following: 289,
    posts: 67,
    createdAt: '2024-01-18T11:30:00Z',
  },
  {
    id: '7',
    email: 'pedro@example.com',
    username: 'pedro_social',
    displayName: 'Pedro García',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400',
    position: 'Trabajador social',
    team: 'ONG Esperanza',
    bio: 'Dedicado a mejorar la calidad de vida en comunidades vulnerables.',
    followers: 321,
    following: 98,
    posts: 21,
    createdAt: '2024-02-01T09:00:00Z',
  },
];

export default function SearchPage() {
  const { user: currentUser, toggleFriendStatus, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false); // Estado para controlar la visibilidad de los filtros, ahora es false por defecto

  useEffect(() => {
    // Solo redirigir si ya terminó de cargar la autenticación y no hay usuario
    if (!authLoading && !currentUser) {
      router.push('/');
    }
  }, [currentUser, authLoading, router]);

  useEffect(() => {
    let filtered = mockUsers;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(u => 
        u.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.position?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.team?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply position filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(u => 
        u.position?.toLowerCase().includes(activeFilter.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  }, [searchQuery, activeFilter]);

  // Solo mostrar loading si está cargando Y no hay usuario
  if (authLoading && !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-10 h-10 border-3 border-neon-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!currentUser) return null;

  const handleFollow = async (userId: string) => {
    if (!currentUser) {
      toast.error('Debes iniciar sesión para seguir a otros usuarios.');
      return;
    }

    const isCurrentlyFriend = currentUser.friendIds?.includes(userId);
    await toggleFriendStatus(userId, isCurrentlyFriend ? 'friends' : 'none');
    // El contexto de autenticación (`useAuth`) se encargará de actualizar el `currentUser`
    // y, por lo tanto, la interfaz de usuario se re-renderizará con el estado de amistad actualizado.
  };

  // Filter out 'all' for display in buttons, but keep it in the logic
  const displayRoles = allRoles.filter(role => role !== 'all');

  return (
    <div className="min-h-screen">
      <Sidebar />
      
      <main className="pb-24 xl:ml-64 xl:pb-0">
        <div className="max-w-4xl mx-auto p-4 space-y-6">
          {/* Header */}
          <div className="glass-card p-6">
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center space-x-2 mb-2">
                  <Search className="text-neon-green" />
                  <span>Buscar Habilidosos</span>
                </h1>
                <p className="text-gray-400">Descubre y conecta con talentos de todo el mundo</p>
              </div>

              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por nombre, usuario, rol o equipo..."
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-col">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors py-2"
                >
                  <Filter className="mr-2" size={16} />
                  <span className="font-medium">Filtrar por Rol</span>
                  <ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform duration-200", showFilters && "rotate-180")} />
                </button>
                {showFilters && (
                  <div className="flex items-center space-x-2 flex-wrap gap-y-2 mt-2">
                    <button
                      onClick={() => setActiveFilter('all')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        activeFilter === 'all'
                          ? 'bg-neon-green/20 text-neon-green border border-neon-green/50'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      Todos
                    </button>
                    {displayRoles.map((role) => (
                      <button
                        key={role}
                        onClick={() => setActiveFilter(role.toLowerCase())}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                          activeFilter === role.toLowerCase()
                            ? 'bg-neon-green/20 text-neon-green border border-neon-green/50'
                            : 'bg-white/10 text-gray-300 hover:bg-white/20'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                Resultados ({filteredUsers.length})
              </h2>
            </div>

            {filteredUsers.length === 0 ? (
              <div className="glass-card p-8 text-center">
                <Search className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-lg font-semibold text-white mb-2">No se encontraron resultados</h3>
                <p className="text-gray-400">Intenta con otros términos de búsqueda o filtros.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredUsers.map((searchUser) => {
                  const isFollowing = currentUser.friendIds?.includes(searchUser.id);
                  return (
                    <div key={searchUser.id} className="football-card p-6">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4"> {/* Ajustado para responsive */}
                        <img
                          src={searchUser.avatar}
                          alt={searchUser.displayName}
                          className="w-16 h-16 rounded-full ring-2 ring-neon-green/50 flex-shrink-0"
                        />
                        
                        <div className="flex-1 min-w-0"> {/* Añadido min-w-0 para que el texto se envuelva */}
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-lg font-semibold text-white truncate">{searchUser.displayName}</h3> {/* Añadido truncate */}
                            <span className="text-gray-400 truncate">@{searchUser.username}</span> {/* Añadido truncate */}
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-400 mb-2"> {/* Ajustado para responsive */}
                            {searchUser.position && (
                              <span className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                                <span>{searchUser.position}</span>
                              </span>
                            )}
                            {searchUser.team && (
                              <span className="flex items-center space-x-1">
                                <MapPin size={14} />
                                <span>{searchUser.team}</span>
                              </span>
                            )}
                          </div>
                          
                          {searchUser.bio && (
                            <p className="text-gray-300 text-sm mb-3 line-clamp-2">{searchUser.bio}</p>
                          )}
                          
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-400"> {/* Ajustado para responsive */}
                            <span>{searchUser.followers} seguidores</span>
                            <span>{searchUser.posts} publicaciones</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-row sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2 mt-4 sm:mt-0 w-full sm:w-auto justify-end"> {/* Ajustado para responsive */}
                          <CyberButton
                            onClick={() => handleFollow(searchUser.id)}
                            variant={isFollowing ? 'outline' : 'primary'}
                            className="flex items-center justify-center space-x-2 flex-1 sm:flex-none"
                            size="sm"
                          >
                            <UserPlus size={16} />
                            <span>
                              {isFollowing ? 'Siguiendo' : 'Seguir'}
                            </span>
                          </CyberButton>
                          
                          <CyberButton variant="ghost" size="sm" className="flex-1 sm:flex-none">
                            Ver Perfil
                          </CyberButton>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Suggested Users */}
          {searchQuery === '' && activeFilter === 'all' && (
            <div className="glass-card p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Habilidosos Sugeridos</h2>
              <div className="grid lg:grid-cols-2 gap-4">
                {mockUsers.slice(0, 4).map((suggestedUser) => {
                  const isFollowingSuggested = currentUser.friendIds?.includes(suggestedUser.id);
                  return (
                    <div key={suggestedUser.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                      <img
                        src={suggestedUser.avatar}
                        alt={suggestedUser.displayName}
                        className="w-12 h-12 rounded-full ring-2 ring-neon-green/30"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-white">{suggestedUser.displayName}</h4>
                        <p className="text-sm text-gray-400">@{suggestedUser.username}</p>
                        {suggestedUser.position && (
                          <p className="text-xs text-neon-green">{suggestedUser.position}</p>
                        )}
                      </div>
                      <div className="flex flex-col space-y-2">
                        <CyberButton 
                          size="sm" 
                          onClick={() => handleFollow(suggestedUser.id)}
                          variant={isFollowingSuggested ? 'outline' : 'primary'}
                        >
                          {isFollowingSuggested ? 'Siguiendo' : 'Conectar'}
                        </CyberButton>
                        <CyberButton 
                          size="sm" 
                          variant="ghost"
                        >
                          Ver Perfil
                        </CyberButton>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      <MobileNav />
    </div>
  );
}