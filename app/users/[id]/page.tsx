'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/components/providers/providers';
import { Sidebar } from '@/components/navigation/sidebar';
import { MobileNav } from '@/components/navigation/mobile-nav';
import { CyberButton } from '@/components/ui/cyber-button';
import { Camera, Edit2, MapPin, Calendar, Users, Image as ImageIcon, MessageCircle, UserPlus, Check, Clock, X, Play, Twitter, Instagram, Youtube, Globe, User as UserIconComponent } from 'lucide-react'; // Importar Play y iconos de redes sociales, renombrar User a UserIconComponent
import { User, Post, Community } from '@/types/user'; // Importar Post y Community
import { toast } from 'sonner';
import { PostCard } from '@/components/ui/post-card'; // Importar PostCard
import { mockPosts } from '@/data/mock-data'; // Importar mockPosts desde el nuevo archivo
import { mockCommunities } from '@/data/mock-data'; // Importar mockCommunities desde el nuevo archivo

// Mock data for other users (you would fetch this from a database)
const mockUsers: User[] = [
  {
    id: '2',
    email: 'maria@example.com',
    username: 'maria_skills',
    displayName: 'María González',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    coverPhoto: 'https://images.pexels.com/photos/1618269/pexels-photo-1618269.jpeg?auto=compress&cs=tinysrgb&w=1200',
    position: 'Mediocampista',
    team: 'Las Águilas FC',
    bio: 'Apasionada por el fútbol, especialista en jugadas creativas y pases precisos. Siempre buscando el siguiente desafío en el campo.',
    followers: 892,
    following: 234,
    posts: 56,
    createdAt: '2024-01-15T10:30:00Z',
    friendIds: ['1'], // Assuming current user (id: '1') is friends with Maria
    interests: ['fútbol', 'estrategia', 'entrenamiento'],
    communityIds: ['comm1'], // Comunidades a las que pertenece
    socialLinks: [
      { platform: 'instagram', url: 'https://instagram.com/maria_skills' },
      { platform: 'twitter', url: 'https://twitter.com/maria_skills' },
    ],
  },
  {
    id: '3',
    email: 'carlos@example.com',
    username: 'carlos_gk',
    displayName: 'Carlos Mendoza',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    coverPhoto: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=1200',
    position: 'Portero',
    team: 'Defensores United',
    bio: 'Guardameta con más de 10 años de experiencia. Siempre listo para el desafío y proteger mi portería.',
    followers: 654,
    following: 187,
    posts: 78,
    createdAt: '2024-01-10T14:20:00Z',
    friendIds: ['1'], // Assuming current user (id: '1') is friends with Carlos
    interests: ['portería', 'táctica', 'reflejos'],
    communityIds: ['comm1', 'comm2'], // Comunidades a las que pertenece
    socialLinks: [
      { platform: 'youtube', url: 'https://youtube.com/carlos_gk' },
    ],
  },
  {
    id: '4',
    email: 'ana@example.com',
    username: 'ana_striker',
    displayName: 'Ana Rodríguez',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
    coverPhoto: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=1200',
    position: 'Delantera',
    team: 'Tigres Femenino',
    bio: 'Goleadora nata con un instinto natural para el área rival. Máxima anotadora de la liga y siempre buscando el gol.',
    followers: 1203,
    following: 456,
    posts: 112,
    createdAt: '2024-01-05T09:15:00Z',
    friendIds: [],
    interests: ['goles', 'velocidad', 'remate'],
    communityIds: ['comm3'], // Comunidades a las que pertenece
    socialLinks: [
      { platform: 'instagram', url: 'https://instagram.com/ana_striker' },
      { platform: 'website', url: 'https://anarodriguez.com' },
    ],
  },
  {
    id: '5',
    email: 'luis@example.com',
    username: 'luis_defense',
    displayName: 'Luis Ramírez',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
    coverPhoto: 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=1200',
    position: 'Defensor Central',
    team: 'Sporting Club',
    bio: 'Defensor sólido y líder natural. La defensa es mi pasión y mi fortaleza en el campo.',
    followers: 445,
    following: 123,
    posts: 34,
    createdAt: '2024-01-20T08:45:00Z',
    friendIds: [],
    interests: ['defensa', 'liderazgo', 'fuerza'],
    communityIds: [], // No pertenece a ninguna comunidad mock
    socialLinks: [],
  },
];

export default function UserProfileViewPage() {
  const { user: currentUser, toggleFriendStatus, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [friendStatus, setFriendStatus] = useState<'none' | 'pending' | 'friends'>('none');
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [userCommunities, setUserCommunities] = useState<Community[]>([]);

  useEffect(() => {
    // Solo redirigir si ya terminó de cargar la autenticación y no hay usuario
    if (!authLoading && !currentUser) {
      router.push('/');
      return;
    }
    
    // Solo cargar datos si hay usuario autenticado
    if (!currentUser) return;

    if (userId === currentUser.id) {
      setProfileUser(currentUser);
      setFriendStatus('friends'); // Current user is always "friends" with themselves
      setUserPosts(mockPosts.filter(post => post.userId === currentUser.id));
      setUserCommunities(mockCommunities.filter(comm => currentUser.communityIds?.includes(comm.id)));
    } else {
      // Simulate fetching user data
      const foundUser = mockUsers.find(u => u.id === userId);
      if (foundUser) {
        setProfileUser(foundUser);
        if (currentUser.friendIds?.includes(foundUser.id)) {
          setFriendStatus('friends');
        } else {
          // In a real app, you'd check for pending requests here
          setFriendStatus('none');
        }
        setUserPosts(mockPosts.filter(post => post.userId === foundUser.id));
        setUserCommunities(mockCommunities.filter(comm => foundUser.communityIds?.includes(comm.id)));
      } else {
        toast.error('Usuario no encontrado.');
        router.push('/feed'); // Redirect if user not found
      }
    }
  }, [userId, currentUser, authLoading, router]);

  // Solo mostrar loading si está cargando Y no hay usuario
  if (authLoading && !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-10 h-10 border-3 border-neon-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!currentUser || !profileUser) return null;

  const handleFriendAction = async () => {
    if (!currentUser) {
      toast.error('Debes iniciar sesión para gestionar conexiones.');
      return;
    }
    if (currentUser.id === profileUser.id) {
      toast.info('No puedes enviarte una solicitud a ti mismo.');
      return;
    }

    await toggleFriendStatus(profileUser.id, friendStatus);
    // Update local status based on the action
    if (friendStatus === 'none') {
      setFriendStatus('pending'); // Simulate request sent
    } else if (friendStatus === 'pending') {
      setFriendStatus('friends'); // Simulate request accepted
    } else if (friendStatus === 'friends') {
      setFriendStatus('none'); // Simulate friend removed
    }
  };

  const getFriendButton = () => {
    if (currentUser?.id === profileUser.id) {
      return (
        <CyberButton variant="outline" disabled>
          <UserIconComponent size={16} className="mr-2" />
          <span>Tu Perfil</span>
        </CyberButton>
      );
    }

    switch (friendStatus) {
      case 'none':
        return (
          <CyberButton onClick={handleFriendAction}>
            <UserPlus size={16} className="mr-2" />
            <span>Conectar</span>
          </CyberButton>
        );
      case 'pending':
        return (
          <CyberButton variant="secondary" onClick={handleFriendAction}>
            <Clock size={16} className="mr-2" />
            <span>Solicitud Pendiente</span>
          </CyberButton>
        );
      case 'friends':
        return (
          <div className="flex flex-wrap gap-2"> {/* Modificado: flex-wrap gap-2 */}
            <CyberButton variant="outline">
              <MessageCircle size={16} className="mr-2" />
              <span>Mensaje</span>
            </CyberButton>
            <CyberButton variant="destructive" onClick={handleFriendAction}>
              <X size={16} className="mr-2" />
              <span>Desconectar</span>
            </CyberButton>
          </div>
        );
      default:
        return null;
    }
  };

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'twitter': return <Twitter size={20} className="text-blue-400" />;
      case 'instagram': return <Instagram size={20} className="text-pink-500" />;
      case 'youtube': return <Youtube size={20} className="text-red-600" />;
      default: return <Globe size={20} className="text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen">
      <Sidebar />
      
      <main className="pb-24 xl:ml-64 xl:pb-0">
        <div className="max-w-4xl mx-auto p-4 space-y-6">
          {/* Cover Photo & Profile */}
          <div className="glass-card overflow-visible">
            {/* Cover Photo */}
            <div className="relative h-48 lg:h-64 rounded-t-lg overflow-hidden">
              <img
                src={profileUser.coverPhoto || 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=1200'}
                alt="Cover"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>

            {/* Profile Info */}
            <div className="p-6 pt-20 lg:pt-24">
              <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-6 -mt-20 lg:-mt-24 relative z-10">
                <div className="relative flex-shrink-0 w-36 h-36 lg:w-40 lg:h-40 mx-auto lg:mx-0">
                  <img
                    src={profileUser.avatar}
                    alt={profileUser.displayName}
                    className="w-full h-full object-cover rounded-full ring-4 ring-neon-green/50 shadow-xl"
                  />
                </div>

                <div className="flex-1 text-center lg:text-left mt-4 lg:mt-0 min-w-0">
                  <div className="space-y-2">
                    <h1 className="text-2xl lg:text-3xl font-bold text-white break-words">{profileUser.displayName}</h1>
                    <p className="text-gray-400 break-words">@{profileUser.username}</p>
                    {profileUser.bio && (
                      <p className="text-gray-300 max-w-md break-words">{profileUser.bio}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-center lg:justify-start space-x-6 mt-4 text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Users size={16} />
                      <span>{profileUser.followers} seguidores</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>{profileUser.following} siguiendo</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar size={16} />
                      <span>Se unió en {formatJoinDate(profileUser.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 lg:mt-0">
                  {getFriendButton()}
                </div>
              </div>
            </div>
          </div>

          {/* Football Info & Social Links */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold text-white mb-4">Información General</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-neon-green rounded-full"></div>
                  <div>
                    <p className="text-gray-400 text-sm">Posición/Rol</p>
                    <p className="text-white font-medium">{profileUser.position || 'No especificada'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-neon-blue rounded-full"></div>
                  <div>
                    <p className="text-gray-400 text-sm">Equipo/Grupo</p>
                    <p className="text-white font-medium">{profileUser.team || 'Independiente'}</p>
                  </div>
                </div>
                {profileUser.interests && profileUser.interests.length > 0 && (
                    <div className="flex items-start space-x-3">
                      <div className="w-3 h-3 bg-purple-400 rounded-full mt-1.5"></div>
                      <div>
                        <p className="text-gray-400 text-sm">Intereses</p>
                        <p className="text-white font-medium flex flex-wrap gap-2">
                          {profileUser.interests.map((interest, index) => (
                            <span key={index} className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                              {interest}
                            </span>
                          ))}
                        </p>
                      </div>
                    </div>
                  )}
              </div>
            </div>

            <div className="glass-card p-6">
              <h2 className="text-xl font-bold text-white mb-4">Redes Sociales</h2>
              {profileUser.socialLinks && profileUser.socialLinks.length > 0 ? (
                <div className="space-y-3">
                  {profileUser.socialLinks.map((link, index) => (
                    <a 
                      key={index} 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
                    >
                      {getSocialIcon(link.platform)}
                      <span className="font-medium">{link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}</span>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No hay redes sociales añadidas.</p>
              )}
            </div>
          </div>

          {/* Communities Section */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-white mb-4">Comunidades de {profileUser.displayName}</h2>
            {userCommunities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userCommunities.map((comm) => (
                  <div key={comm.id} className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl">
                    <img
                      src={comm.coverImage}
                      alt={comm.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-medium text-white">{comm.name}</h3>
                      <p className="text-gray-400 text-sm">{comm.membersCount} miembros</p>
                    </div>
                    <CyberButton variant="ghost" size="sm" className="ml-auto">
                      Ver
                    </CyberButton>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No pertenece a ninguna comunidad.</p>
            )}
          </div>

          {/* Statistics */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-white mb-4">Estadísticas</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-neon-green">{profileUser.posts}</div>
                <div className="text-sm text-gray-400">Publicaciones</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-neon-blue">156</div> {/* Mock data */}
                <div className="text-sm text-gray-400">Me gusta totales</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">89</div> {/* Mock data */}
                <div className="text-sm text-gray-400">Celebraciones</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">23</div> {/* Mock data */}
                <div className="text-sm text-gray-400">Golazos</div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Actividad Reciente</h2>
              <CyberButton variant="outline" className="flex items-center space-x-2">
                <ImageIcon size={16} />
                <span>Ver Galería</span>
              </CyberButton>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {userPosts.slice(0, 4).map((postItem) => ( // Mostrar hasta 4 publicaciones recientes
                <div key={postItem.id} className="aspect-square bg-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition-colors cursor-pointer">
                  {postItem.images && postItem.images.length > 0 ? (
                    <img
                      src={postItem.images[0]} // Usar la primera imagen de la publicación
                      alt={postItem.content}
                      className="w-full h-full object-cover"
                    />
                  ) : postItem.video ? (
                    <div className="relative w-full h-full flex items-center justify-center bg-black">
                      <video
                        src={postItem.video}
                        className="w-full h-full object-cover"
                        poster="https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=400" // Placeholder
                      />
                      <Play className="absolute text-white" size={32} />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-400 text-center p-2">
                      <p className="text-sm line-clamp-3">{postItem.content}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {userPosts.length > 4 && (
              <div className="text-center mt-4">
                <CyberButton variant="outline" size="lg">
                  Ver todas las publicaciones
                </CyberButton>
              </div>
            )}
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
}