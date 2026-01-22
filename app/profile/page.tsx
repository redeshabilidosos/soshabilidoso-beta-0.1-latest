'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/providers';
import { Sidebar } from '@/components/navigation/sidebar';
import { MobileNav } from '@/components/navigation/mobile-nav';
import { CyberButton } from '@/components/ui/cyber-button';
import { Camera, Edit2, MapPin, Calendar, Users, Image as ImageIcon, Plus, FolderPlus, User as UserIcon, ImagePlus } from 'lucide-react';
import { UpdateCoverPhotoDialog } from '@/components/ui/update-cover-photo-dialog'; // Importar el nuevo diálogo
import { UpdateAvatarDialog } from '@/components/ui/update-avatar-dialog'; // Importar el nuevo diálogo
import { NewPostDialog } from '@/components/ui/new-post-dialog'; // Importar el diálogo de nueva publicación
import { UserPostsGrid } from '@/components/profile/user-posts-grid'; // Importar el grid de posts
import { Post } from '@/types/user'; // Importar Post para el callback
import { enterprisesService, Enterprise } from '@/lib/services/enterprises.service';
import { Building2, Eye } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateProfile, isLoading } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    position: '',
    team: '',
    interests: '', // Nuevo campo para intereses
  });
  const [isCoverPhotoDialogOpen, setIsCoverPhotoDialogOpen] = useState(false); // Estado para el diálogo de portada
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false); // Estado para el diálogo de avatar
  const [isNewPostDialogOpen, setIsNewPostDialogOpen] = useState(false); // Estado para el diálogo de nueva publicación
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Para actualizar las publicaciones
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false); // Estado para el modal de avatar expandido
  const [isCreateAlbumOpen, setIsCreateAlbumOpen] = useState(false); // Estado para el modal de crear álbum
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null); // Álbum seleccionado para ver
  const [profilePhotos, setProfilePhotos] = useState<any[]>([]); // Fotos de perfil del álbum
  const [coverPhotos, setCoverPhotos] = useState<any[]>([]); // Fotos de portada del álbum
  const [loadingAlbum, setLoadingAlbum] = useState(false);
  const [userStats, setUserStats] = useState({
    totalLikes: 0,        // Reacciones que ha dado el usuario
    communitiesCount: 0,  // Comunidades a las que está suscrito
    achievementsCount: 0, // Insignias de learning obtenidas
  });
  const [myEnterprises, setMyEnterprises] = useState<Enterprise[]>([]);

  // Cargar estadísticas del usuario y empresas
  useEffect(() => {
    if (user) {
      loadUserStats();
      loadMyEnterprises();
    }
  }, [user]);

  const loadMyEnterprises = async () => {
    try {
      const enterprises = await enterprisesService.getMyEnterprises();
      setMyEnterprises(enterprises);
    } catch (error) {
      console.error('Error loading enterprises:', error);
    }
  };

  const loadUserStats = async () => {
    try {
      const token = localStorage.getItem('access_token');
      
      // Cargar comunidades suscritas
      const communitiesRes = await fetch('http://127.0.0.1:8000/api/communities/my-communities/', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (communitiesRes.ok) {
        const communitiesData = await communitiesRes.json();
        setUserStats(prev => ({ 
          ...prev, 
          communitiesCount: communitiesData.results?.length || communitiesData.length || 0 
        }));
      }

      // Cargar logros de learning
      const achievementsRes = await fetch('http://127.0.0.1:8000/api/learning/mis-logros/', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (achievementsRes.ok) {
        const achievementsData = await achievementsRes.json();
        setUserStats(prev => ({ 
          ...prev, 
          achievementsCount: achievementsData.results?.length || achievementsData.length || 0 
        }));
      }

      // Cargar reacciones dadas (si existe el endpoint)
      const reactionsRes = await fetch('http://127.0.0.1:8000/api/posts/my-reactions-count/', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (reactionsRes.ok) {
        const reactionsData = await reactionsRes.json();
        setUserStats(prev => ({ 
          ...prev, 
          totalLikes: reactionsData.count || 0 
        }));
      }
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  };

  // Cargar álbumes cuando se selecciona uno
  useEffect(() => {
    if (selectedAlbum && user) {
      loadAlbumPhotos(selectedAlbum);
    }
  }, [selectedAlbum, user]);

  const loadAlbumPhotos = async (albumType: string) => {
    setLoadingAlbum(true);
    try {
      const token = localStorage.getItem('access_token');
      const endpoint = albumType === 'profile' 
        ? 'http://127.0.0.1:8000/api/media/albums/profile_photos/'
        : 'http://127.0.0.1:8000/api/media/albums/cover_photos/';
      
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (albumType === 'profile') {
          setProfilePhotos(data.files || []);
        } else {
          setCoverPhotos(data.files || []);
        }
      }
    } catch (error) {
      console.error('Error cargando álbum:', error);
    } finally {
      setLoadingAlbum(false);
    }
  };

  useEffect(() => {
    // Solo redirigir si ya terminó de cargar y no hay usuario
    if (!isLoading && !user) {
      router.push('/');
      return;
    }
    
    if (user) {
      // Si es cuenta de empresa, redirigir al perfil de empresa
      if (user.accountType === 'enterprise' || user.account_type === 'enterprise') {
        router.replace(`/enterprise/${user.id}`);
        return;
      }
      
      setFormData({
        displayName: user.displayName || '',
        bio: user.bio || '',
        position: user.position || '',
        team: user.team || '',
        interests: user.interests?.join(', ') || '', // Convertir array a string para el input
      });
    }
  }, [user, isLoading, router]);

  // Mostrar loading si es empresa (mientras redirige)
  if (user && (user.accountType === 'enterprise' || user.account_type === 'enterprise')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-10 h-10 border-3 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Solo mostrar loading si está cargando Y no hay usuario
  if (isLoading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-10 h-10 border-3 border-neon-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  const handleSave = async () => {
    const interestsArray = formData.interests.split(',').map(interest => interest.trim()).filter(interest => interest !== '');
    await updateProfile({ ...formData, interests: interestsArray });
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePostCreated = (newPost: Post) => {
    // Cerrar el diálogo y mostrar mensaje de éxito
    setIsNewPostDialogOpen(false);
    
    // Actualizar las publicaciones
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen">
      <Sidebar />
      
      <main className="pb-24 lg:ml-64 lg:pb-0 pt-28 md:pt-12 lg:pt-6 relative z-10 min-h-screen">
        <div className="max-w-4xl mx-auto p-4 space-y-6">
          {/* Cover Photo & Profile */}
          <div className="glass-card overflow-visible relative z-20">
            {/* Cover Photo */}
            <div className="relative h-48 lg:h-64 overflow-hidden rounded-t-lg">
              <img
                src={user.coverPhoto || 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=1200'}
                alt="Cover"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <button 
                className="absolute top-4 right-4 p-2 bg-black/20 backdrop-blur-sm rounded-lg text-white hover:bg-black/40 transition-colors"
                onClick={() => setIsCoverPhotoDialogOpen(true)} // Abre el diálogo de portada
              >
                <Camera size={20} />
              </button>
            </div>

            {/* Profile Info */}
            <div className="p-4 lg:p-6 pt-20 lg:pt-24">
              <div className="flex flex-col lg:flex-row lg:items-end lg:space-x-6 -mt-20 lg:-mt-24 relative z-10">
                <div className="relative flex-shrink-0 w-36 h-36 lg:w-44 lg:h-44 mx-auto lg:mx-0 mb-4 lg:mb-0">
                  <div 
                    className="w-full h-full rounded-full ring-4 ring-neon-green/50 overflow-hidden bg-gray-800 cursor-pointer hover:ring-neon-green transition-all shadow-xl"
                    onClick={() => setIsAvatarModalOpen(true)}
                  >
                    <img
                      src={user.avatar}
                      alt={user.displayName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button 
                    className="absolute bottom-2 right-2 p-2.5 bg-neon-green rounded-full text-white hover:bg-neon-green/80 transition-colors shadow-lg z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsAvatarDialogOpen(true);
                    }}
                  >
                    <Camera size={18} />
                  </button>
                </div>

                <div className="flex-1 text-center lg:text-left min-w-0 mt-2 lg:mt-0">
                  {isEditing ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        name="displayName"
                        value={formData.displayName}
                        onChange={handleChange}
                        className="text-2xl font-bold bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white w-full lg:w-auto"
                      />
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Cuéntanos sobre ti..."
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-gray-300 placeholder-gray-500 resize-none"
                        rows={3}
                      />
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <h1 className="text-2xl lg:text-3xl font-bold text-white break-words leading-tight">
                        {user.displayName || user.username}
                      </h1>
                      <p className="text-base text-gray-400 break-words">@{user.username}</p>
                      {user.bio && (
                        <p className="text-sm text-gray-300 max-w-2xl break-words mt-2">{user.bio}</p>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-center lg:justify-start space-x-6 mt-4 text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Users size={16} />
                      <span>{user.followers} seguidores</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>{user.following} siguiendo</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar size={16} />
                      <span>Se unió en enero 2024</span>
                    </div>
                  </div>
                </div>

                {/* Mobile Buttons */}
                <div className="lg:hidden mt-4 flex flex-col space-y-2 w-full">
                  {isEditing ? (
                    <div className="flex space-x-2">
                      <CyberButton onClick={handleSave} className="flex-1">
                        Guardar
                      </CyberButton>
                      <CyberButton 
                        variant="outline" 
                        onClick={() => setIsEditing(false)}
                        className="flex-1"
                      >
                        Cancelar
                      </CyberButton>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <CyberButton 
                        onClick={() => router.push('/profile/edit')}
                        className="flex items-center justify-center space-x-1 flex-1"
                        size="sm"
                      >
                        <Edit2 size={14} />
                        <span className="text-sm">Editar</span>
                      </CyberButton>
                      <CyberButton 
                        className="flex items-center justify-center space-x-1 flex-1 text-xs"
                        onClick={() => setIsNewPostDialogOpen(true)}
                        size="sm"
                      >
                        <Plus size={12} />
                        <span>Nueva Publicación</span>
                      </CyberButton>
                    </div>
                  )}
                </div>

                {/* Desktop Buttons */}
                <div className="hidden lg:flex lg:mt-0 flex-col space-y-2">
                  {isEditing ? (
                    <div className="flex space-x-2">
                      <CyberButton onClick={handleSave}>
                        Guardar
                      </CyberButton>
                      <CyberButton 
                        variant="outline" 
                        onClick={() => setIsEditing(false)}
                      >
                        Cancelar
                      </CyberButton>
                    </div>
                  ) : (
                    <CyberButton 
                      onClick={() => router.push('/profile/edit')}
                      className="flex items-center space-x-2"
                    >
                      <Edit2 size={16} />
                      <span>Editar Perfil</span>
                    </CyberButton>
                  )}
                  <CyberButton 
                    className="flex items-center space-x-2"
                    onClick={() => setIsNewPostDialogOpen(true)}
                  >
                    <Plus size={18} />
                    <span>Nueva Publicación</span>
                  </CyberButton>
                </div>
              </div>
            </div>
          </div>

          {/* Football Info */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold text-white mb-4">Información General</h2>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Posición/Rol</label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                      placeholder="Ej: Delantero, Bailarín, Músico"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Equipo/Grupo Actual</label>
                    <input
                      type="text"
                      name="team"
                      value={formData.team}
                      onChange={handleChange}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                      placeholder="Ej: Los Habilidosos FC, Banda Sonora"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Intereses (separados por comas)</label>
                    <input
                      type="text"
                      name="interests"
                      value={formData.interests}
                      onChange={handleChange}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                      placeholder="Ej: fútbol, música electrónica, arte digital, baile urbano"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-neon-green rounded-full"></div>
                    <div>
                      <p className="text-gray-400 text-sm">Posición/Rol</p>
                      <p className="text-white font-medium">{user.position || 'No especificada'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-neon-blue rounded-full"></div>
                    <div>
                      <p className="text-gray-400 text-sm">Equipo/Grupo</p>
                      <p className="text-white font-medium">{user.team || 'Independiente'}</p>
                    </div>
                  </div>
                  {user.interests && user.interests.length > 0 && (
                    <div className="flex items-start space-x-3">
                      <div className="w-3 h-3 bg-purple-400 rounded-full mt-1.5"></div>
                      <div>
                        <p className="text-gray-400 text-sm">Intereses</p>
                        <p className="text-white font-medium flex flex-wrap gap-2">
                          {user.interests.map((interest, index) => (
                            <span key={index} className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                              {interest}
                            </span>
                          ))}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="glass-card p-6">
              <h2 className="text-xl font-bold text-white mb-4">Estadísticas</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-neon-green">{user.posts}</div>
                  <div className="text-sm text-gray-400">Publicaciones</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-neon-blue">{userStats.totalLikes}</div>
                  <div className="text-sm text-gray-400">Reacciones dadas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{userStats.communitiesCount}</div>
                  <div className="text-sm text-gray-400">Comunidades</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{userStats.achievementsCount}</div>
                  <div className="text-sm text-gray-400">Insignias Learning</div>
                </div>
              </div>
            </div>
          </div>

          {/* Mi Empresa - Solo si tiene empresas */}
          {myEnterprises.length > 0 && (
            <div className="glass-card p-6 border-l-4 border-l-purple-500">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Building2 size={20} className="text-purple-400" />
                  Mi Empresa
                </h2>
                <CyberButton
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/settings')}
                  className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                >
                  Gestionar
                </CyberButton>
              </div>
              <div className="space-y-3">
                {myEnterprises.map((enterprise) => (
                  <div
                    key={enterprise.id}
                    className="flex items-center gap-4 p-3 bg-purple-500/10 rounded-xl hover:bg-purple-500/20 transition-colors cursor-pointer"
                    onClick={() => router.push(`/enterprise/${enterprise.id}`)}
                  >
                    <img
                      src={enterprise.logo_url || `https://ui-avatars.com/api/?name=${enterprise.name}&background=8B5CF6&color=fff`}
                      alt={enterprise.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-medium truncate">{enterprise.name}</h3>
                        {enterprise.is_verified && (
                          <span className="text-purple-400 text-sm">✓</span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm">@{enterprise.username}</p>
                    </div>
                    <CyberButton
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700 flex items-center gap-1"
                    >
                      <Eye size={14} />
                      <span>Ver Perfil</span>
                    </CyberButton>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Publicaciones del Usuario */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Mis Publicaciones</h2>
              <CyberButton 
                className="flex items-center space-x-2"
                onClick={() => setIsNewPostDialogOpen(true)}
              >
                <Plus size={16} />
                <span>Nueva Publicación</span>
              </CyberButton>
            </div>
            
            <UserPostsGrid username={user.username} isOwnProfile={true} refreshTrigger={refreshTrigger} />
          </div>

          {/* Mi Galería - Álbumes */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ImageIcon size={20} className="text-neon-green" />
                Mi Galería
              </h2>
              <div className="flex gap-2">
                <CyberButton 
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                  onClick={() => setIsCreateAlbumOpen(true)}
                >
                  <FolderPlus size={16} />
                  <span>Crear Álbum</span>
                </CyberButton>
                <CyberButton 
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                  onClick={() => router.push(`/profile/${user.username}/gallery`)}
                >
                  <span>Ver toda la galería</span>
                </CyberButton>
              </div>
            </div>
            
            {/* Grid de Álbumes */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Álbum: Fotos de Perfil */}
              <div 
                className="group cursor-pointer"
                onClick={() => setSelectedAlbum('profile')}
              >
                <div className="aspect-square bg-gradient-to-br from-neon-green/20 to-emerald-600/20 rounded-xl border border-neon-green/30 overflow-hidden relative hover:border-neon-green/60 transition-all">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt="Fotos de perfil" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <UserIcon size={40} className="text-neon-green/50" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-white font-medium text-sm truncate">Fotos de Perfil</p>
                    <p className="text-gray-300 text-xs">1 foto</p>
                  </div>
                </div>
              </div>

              {/* Álbum: Fotos de Portada */}
              <div 
                className="group cursor-pointer"
                onClick={() => setSelectedAlbum('cover')}
              >
                <div className="aspect-square bg-gradient-to-br from-neon-blue/20 to-blue-600/20 rounded-xl border border-neon-blue/30 overflow-hidden relative hover:border-neon-blue/60 transition-all">
                  {user.coverPhoto ? (
                    <img 
                      src={user.coverPhoto} 
                      alt="Fotos de portada" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImagePlus size={40} className="text-neon-blue/50" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-white font-medium text-sm truncate">Fotos de Portada</p>
                    <p className="text-gray-300 text-xs">1 foto</p>
                  </div>
                </div>
              </div>

              {/* Botón para crear nuevo álbum */}
              <div 
                className="group cursor-pointer"
                onClick={() => setIsCreateAlbumOpen(true)}
              >
                <div className="aspect-square bg-white/5 rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center hover:border-neon-green/50 hover:bg-white/10 transition-all">
                  <Plus size={32} className="text-gray-400 group-hover:text-neon-green transition-colors mb-2" />
                  <p className="text-gray-400 text-sm group-hover:text-white transition-colors">Crear Álbum</p>
                </div>
              </div>
            </div>
          </div>

          {/* Modal de Crear Álbum */}
          {isCreateAlbumOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
              <div className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Crear Nuevo Álbum</h3>
                  <button
                    onClick={() => setIsCreateAlbumOpen(false)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <Plus className="w-5 h-5 text-gray-400 rotate-45" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Nombre del álbum
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Vacaciones 2024"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-neon-green/50 focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Descripción (opcional)
                    </label>
                    <textarea
                      placeholder="Describe tu álbum..."
                      rows={3}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-neon-green/50 focus:outline-none resize-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Subir fotos
                    </label>
                    <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-neon-green/50 transition-colors cursor-pointer">
                      <ImageIcon size={32} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-400 text-sm">Arrastra fotos aquí o haz clic para seleccionar</p>
                      <p className="text-gray-500 text-xs mt-1">JPG, PNG hasta 10MB</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <CyberButton
                    variant="outline"
                    className="flex-1"
                    onClick={() => setIsCreateAlbumOpen(false)}
                  >
                    Cancelar
                  </CyberButton>
                  <CyberButton
                    className="flex-1"
                    onClick={() => {
                      // TODO: Implementar creación de álbum
                      setIsCreateAlbumOpen(false);
                    }}
                  >
                    Crear Álbum
                  </CyberButton>
                </div>
              </div>
            </div>
          )}

          {/* Modal de Ver Álbum */}
          {selectedAlbum && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
              <div className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-gray-900 border-b border-white/10 p-4 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">
                    {selectedAlbum === 'profile' ? 'Fotos de Perfil' : 'Fotos de Portada'}
                  </h3>
                  <button
                    onClick={() => setSelectedAlbum(null)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <Plus className="w-5 h-5 text-gray-400 rotate-45" />
                  </button>
                </div>
                
                <div className="p-4">
                  {loadingAlbum ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-green mx-auto"></div>
                      <p className="text-gray-400 mt-2">Cargando fotos...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {/* Mostrar fotos del álbum desde el backend */}
                      {selectedAlbum === 'profile' && profilePhotos.length > 0 ? (
                        profilePhotos.map((photo, index) => (
                          <div key={photo.id || index} className="aspect-square rounded-lg overflow-hidden relative group">
                            <img 
                              src={photo.file_url || photo.file} 
                              alt={`Foto de perfil ${index + 1}`} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <p className="text-xs text-gray-300">
                                {new Date(photo.created_at).toLocaleDateString('es-ES')}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : selectedAlbum === 'profile' && user.avatar ? (
                        <div className="aspect-square rounded-lg overflow-hidden">
                          <img 
                            src={user.avatar} 
                            alt="Foto de perfil actual" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : null}
                      
                      {selectedAlbum === 'cover' && coverPhotos.length > 0 ? (
                        coverPhotos.map((photo, index) => (
                          <div key={photo.id || index} className={`${index === 0 ? 'col-span-2 md:col-span-3 aspect-video' : 'aspect-square'} rounded-lg overflow-hidden relative group`}>
                            <img 
                              src={photo.file_url || photo.file} 
                              alt={`Foto de portada ${index + 1}`} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <p className="text-xs text-gray-300">
                                {new Date(photo.created_at).toLocaleDateString('es-ES')}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : selectedAlbum === 'cover' && user.coverPhoto ? (
                        <div className="aspect-video col-span-2 md:col-span-3 rounded-lg overflow-hidden">
                          <img 
                            src={user.coverPhoto} 
                            alt="Foto de portada actual" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : null}
                      
                      {/* Mensaje cuando no hay fotos */}
                      {selectedAlbum === 'profile' && profilePhotos.length === 0 && !user.avatar && (
                        <div className="aspect-square rounded-lg bg-white/5 flex items-center justify-center col-span-full">
                          <p className="text-gray-400">No hay fotos de perfil</p>
                        </div>
                      )}
                      {selectedAlbum === 'cover' && coverPhotos.length === 0 && !user.coverPhoto && (
                        <div className="aspect-video rounded-lg bg-white/5 flex items-center justify-center col-span-full">
                          <p className="text-gray-400">No hay fotos de portada</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      <MobileNav />

      {/* Dialogs */}
      {user && (
        <>
          <UpdateCoverPhotoDialog
            isOpen={isCoverPhotoDialogOpen}
            onClose={() => setIsCoverPhotoDialogOpen(false)}
            currentCoverPhoto={user.coverPhoto || ''}
          />
          <UpdateAvatarDialog
            isOpen={isAvatarDialogOpen}
            onClose={() => setIsAvatarDialogOpen(false)}
            currentAvatar={user.avatar}
          />
          <NewPostDialog
            isOpen={isNewPostDialogOpen}
            onClose={() => setIsNewPostDialogOpen(false)}
            onPostCreated={handlePostCreated}
          />
        </>
      )}

      {/* Modal de Avatar Expandido */}
      {isAvatarModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setIsAvatarModalOpen(false)}
        >
          <div className="relative max-w-3xl w-full">
            <button
              onClick={() => setIsAvatarModalOpen(false)}
              className="absolute -top-12 right-0 text-white hover:text-neon-green transition-colors text-4xl font-light"
            >
              ×
            </button>
            <div className="relative rounded-2xl overflow-hidden ring-4 ring-neon-green/50">
              <img
                src={user.avatar}
                alt={user.displayName}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <h3 className="text-2xl font-bold text-white">{user.displayName}</h3>
                <p className="text-gray-300">@{user.username}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}