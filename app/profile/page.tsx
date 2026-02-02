'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/providers';
import { Sidebar } from '@/components/navigation/sidebar';
import { MobileNav } from '@/components/navigation/mobile-nav';
import { CyberButton } from '@/components/ui/cyber-button';
import { Camera, Edit2, MapPin, Calendar, Users, Image as ImageIcon, Plus, FolderPlus, User as UserIcon, ImagePlus, X, ArrowLeft, Building2, Eye, Award, Heart, BookOpen } from 'lucide-react';
import { UpdateCoverPhotoDialog } from '@/components/ui/update-cover-photo-dialog';
import { UpdateAvatarDialog } from '@/components/ui/update-avatar-dialog';
import { NewPostDialog } from '@/components/ui/new-post-dialog';
import { UserPostsGrid } from '@/components/profile/user-posts-grid';
import { Post } from '@/types/user';
import { enterprisesService, Enterprise } from '@/lib/services/enterprises.service';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

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
  const [selectedImageType, setSelectedImageType] = useState<'avatar' | 'cover'>('avatar'); // Tipo de imagen seleccionada
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false); // Estado para el modal de portada expandida
  const [isCreateAlbumOpen, setIsCreateAlbumOpen] = useState(false); // Estado para el modal de crear álbum
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null); // Álbum seleccionado para ver
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0); // Índice de la foto seleccionada
  const [isPhotoViewerOpen, setIsPhotoViewerOpen] = useState(false); // Estado para el visor de fotos
  const [profilePhotos, setProfilePhotos] = useState<any[]>([]); // Fotos de perfil del álbum
  const [coverPhotos, setCoverPhotos] = useState<any[]>([]); // Fotos de portada del álbum
  const [touchStart, setTouchStart] = useState<number>(0);
  const [touchEnd, setTouchEnd] = useState<number>(0);
  const [loadingAlbum, setLoadingAlbum] = useState(false);
  const [userStats, setUserStats] = useState({
    totalLikes: 0,        // Reacciones que ha dado el usuario
    communitiesCount: 0,  // Comunidades a las que está suscrito
    achievementsCount: 0, // Insignias de learning obtenidas
  });
  const [myEnterprises, setMyEnterprises] = useState<Enterprise[]>([]);

  // Bloquear scroll cuando el modal está abierto
  useEffect(() => {
    if (isAvatarModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isAvatarModalOpen]);

  // Navegación con teclado en el visor de fotos
  useEffect(() => {
    if (!isPhotoViewerOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevPhoto();
      } else if (e.key === 'ArrowRight') {
        nextPhoto();
      } else if (e.key === 'Escape') {
        setIsPhotoViewerOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPhotoViewerOpen, selectedPhotoIndex]);

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

  // Función para abrir el visor de fotos
  const openPhotoViewer = (index: number) => {
    setSelectedPhotoIndex(index);
    setIsPhotoViewerOpen(true);
  };

  // Función para navegar a la siguiente foto
  const nextPhoto = () => {
    const photos = getCurrentPhotos();
    if (selectedPhotoIndex < photos.length - 1) {
      setSelectedPhotoIndex(prev => prev + 1);
    }
  };

  // Función para navegar a la foto anterior
  const prevPhoto = () => {
    if (selectedPhotoIndex > 0) {
      setSelectedPhotoIndex(prev => prev - 1);
    }
  };

  // Obtener el array de fotos actual
  const getCurrentPhotos = () => {
    if (selectedAlbum === 'profile') {
      return profilePhotos.length > 0 ? profilePhotos : (user.avatar ? [{ file_url: user.avatar, created_at: new Date() }] : []);
    } else {
      return coverPhotos.length > 0 ? coverPhotos : (user.coverPhoto ? [{ file_url: user.coverPhoto, created_at: new Date() }] : []);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextPhoto();
    }
    if (isRightSwipe) {
      prevPhoto();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <div className="min-h-screen">
      <Sidebar />
      
      <main className="pb-24 lg:ml-64 lg:pb-0 pt-12 md:pt-6 lg:pt-6 relative z-10 min-h-screen">
        <div className="max-w-4xl mx-auto p-4 space-y-2">
          {/* Botón Regresar - Solo visible en móvil y tablet */}
          <div className="lg:hidden -mb-1">
            <CyberButton
              variant="outline"
              size="sm"
              onClick={() => router.push('/feed')}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Regresar al Feed
            </CyberButton>
          </div>

          {/* Cover Photo & Profile - Mejorado con shadcn */}
          <Card className="overflow-visible border-0 bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl rounded-3xl">
            {/* Cover Photo */}
            <div className="relative h-48 lg:h-64 overflow-hidden rounded-t-3xl group">
              <img
                src={user.coverPhoto || 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=1200'}
                alt="Cover"
                className="w-full h-full object-cover cursor-pointer transition-transform group-hover:scale-105"
                onClick={() => {
                  setSelectedImageType('cover');
                  setIsAvatarModalOpen(true);
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
              <Button 
                size="icon"
                variant="secondary"
                className="absolute top-4 right-4 bg-black/40 backdrop-blur-md hover:bg-black/60 border-white/10 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCoverPhotoDialogOpen(true);
                }}
              >
                <Camera size={18} />
              </Button>
            </div>

            {/* Profile Info */}
            <CardContent className="p-4 lg:p-6 pt-16 lg:pt-20">
              <div className="flex flex-col lg:flex-row lg:items-end lg:space-x-6 -mt-24 lg:-mt-28 relative z-10">
                <div className="relative flex-shrink-0 mx-auto lg:mx-0 mb-4 lg:mb-0">
                  <Avatar 
                    className="w-36 h-36 lg:w-44 lg:h-44 ring-4 ring-primary/50 hover:ring-primary transition-all cursor-pointer shadow-2xl"
                    onClick={() => {
                      setSelectedImageType('avatar');
                      setIsAvatarModalOpen(true);
                    }}
                  >
                    <AvatarImage src={user.avatar} alt={user.displayName} />
                    <AvatarFallback className="text-4xl bg-gradient-to-br from-primary to-purple-600">
                      {user.displayName?.charAt(0) || user.username?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <Button 
                    size="icon"
                    className="absolute bottom-2 right-2 rounded-full shadow-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsAvatarDialogOpen(true);
                    }}
                  >
                    <Camera size={16} />
                  </Button>
                </div>

                <div className="flex-1 text-center lg:text-left min-w-0 mt-2 lg:mt-0">
                  {isEditing ? (
                    <div className="space-y-3">
                      <Input
                        name="displayName"
                        value={formData.displayName}
                        onChange={handleChange}
                        className="text-2xl font-bold h-auto py-2"
                      />
                      <Textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Cuéntanos sobre ti..."
                        rows={3}
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <h1 className="text-2xl lg:text-3xl font-bold text-white break-words leading-tight">
                        {user.displayName || user.username}
                      </h1>
                      <Badge variant="secondary" className="text-sm">
                        @{user.username}
                      </Badge>
                      {user.bio && (
                        <p className="text-sm text-muted-foreground max-w-2xl break-words mt-2">{user.bio}</p>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-center lg:justify-start gap-6 mt-4 text-sm text-muted-foreground flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <Users size={16} className="text-primary" />
                      <span className="font-medium text-white">{user.followers}</span>
                      <span>seguidores</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-white">{user.following}</span>
                      <span>siguiendo</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar size={16} className="text-primary" />
                      <span>Enero 2024</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 w-full lg:w-auto mt-4 lg:mt-0">
                  {isEditing ? (
                    <div className="flex gap-2">
                      <Button onClick={handleSave} className="flex-1 lg:flex-none">
                        Guardar
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsEditing(false)}
                        className="flex-1 lg:flex-none"
                      >
                        Cancelar
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Button 
                        onClick={() => router.push('/profile/edit')}
                        variant="outline"
                        className="w-full lg:w-auto"
                      >
                        <Edit2 size={16} className="mr-2" />
                        Editar Perfil
                      </Button>
                      <Button 
                        onClick={() => setIsNewPostDialogOpen(true)}
                        className="w-full lg:w-auto"
                      >
                        <Plus size={16} className="mr-2" />
                        Nueva Publicación
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Info & Stats - Mejorado con Tabs de shadcn */}
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex">
              <TabsTrigger value="info">Información</TabsTrigger>
              <TabsTrigger value="stats">Estadísticas</TabsTrigger>
              <TabsTrigger value="enterprise">Mi Empresa</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="mt-4">
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserIcon size={20} className="text-primary" />
                    Información General
                  </CardTitle>
                  <CardDescription>
                    Detalles sobre tu perfil y actividades
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="position">Posición/Rol</Label>
                        <Input
                          id="position"
                          name="position"
                          value={formData.position}
                          onChange={handleChange}
                          placeholder="Ej: Delantero, Bailarín, Músico"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="team">Equipo/Grupo Actual</Label>
                        <Input
                          id="team"
                          name="team"
                          value={formData.team}
                          onChange={handleChange}
                          placeholder="Ej: Los Habilidosos FC, Banda Sonora"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="interests">Intereses (separados por comas)</Label>
                        <Input
                          id="interests"
                          name="interests"
                          value={formData.interests}
                          onChange={handleChange}
                          placeholder="Ej: fútbol, música electrónica, arte digital"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">Posición/Rol</p>
                          <p className="font-medium">{user.position || 'No especificada'}</p>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">Equipo/Grupo</p>
                          <p className="font-medium">{user.team || 'Independiente'}</p>
                        </div>
                      </div>
                      {user.interests && user.interests.length > 0 && (
                        <>
                          <Separator />
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                            <div className="flex-1">
                              <p className="text-sm text-muted-foreground mb-2">Intereses</p>
                              <div className="flex flex-wrap gap-2">
                                {user.interests.map((interest, index) => (
                                  <Badge key={index} variant="secondary">
                                    {interest}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats" className="mt-4">
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award size={20} className="text-primary" />
                    Estadísticas
                  </CardTitle>
                  <CardDescription>
                    Tu actividad en la plataforma
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                      <div className="text-3xl font-bold text-primary mb-1">{user.posts}</div>
                      <div className="text-sm text-muted-foreground">Publicaciones</div>
                    </div>
                    <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
                      <div className="text-3xl font-bold text-blue-500 mb-1">{userStats.totalLikes}</div>
                      <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                        <Heart size={14} />
                        Reacciones
                      </div>
                    </div>
                    <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20">
                      <div className="text-3xl font-bold text-purple-500 mb-1">{userStats.communitiesCount}</div>
                      <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                        <Users size={14} />
                        Comunidades
                      </div>
                    </div>
                    <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border border-yellow-500/20">
                      <div className="text-3xl font-bold text-yellow-500 mb-1">{userStats.achievementsCount}</div>
                      <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                        <BookOpen size={14} />
                        Insignias
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="enterprise" className="mt-4">
              {myEnterprises.length > 0 ? (
                <Card className="border-l-4 border-l-purple-500 rounded-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 size={20} className="text-purple-500" />
                      Mi Empresa
                    </CardTitle>
                    <CardDescription>
                      Empresas que administras
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {myEnterprises.map((enterprise) => (
                      <div
                        key={enterprise.id}
                        className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 to-transparent hover:from-purple-500/20 transition-all cursor-pointer border border-purple-500/20"
                        onClick={() => router.push(`/enterprise/${enterprise.id}`)}
                      >
                        <Avatar className="w-14 h-14">
                          <AvatarImage 
                            src={enterprise.logo_url || `https://ui-avatars.com/api/?name=${enterprise.name}&background=8B5CF6&color=fff`}
                            alt={enterprise.name}
                          />
                          <AvatarFallback className="bg-purple-600">
                            {enterprise.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium truncate">{enterprise.name}</h3>
                            {enterprise.is_verified && (
                              <Badge variant="secondary" className="text-purple-400">
                                ✓ Verificada
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">@{enterprise.username}</p>
                        </div>
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                          <Eye size={14} className="mr-1" />
                          Ver Perfil
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ) : (
                <Card className="rounded-2xl">
                  <CardContent className="py-12 text-center">
                    <Building2 size={48} className="mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No tienes empresas</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Crea una cuenta de empresa para promocionar tu negocio
                    </p>
                    <Button onClick={() => router.push('/settings')}>
                      Crear Empresa
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          {/* Publicaciones del Usuario - Mejorado */}
          <Card className="rounded-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon size={20} className="text-primary" />
                    Mis Publicaciones
                  </CardTitle>
                  <CardDescription>
                    Todas tus publicaciones en un solo lugar
                  </CardDescription>
                </div>
                <Button onClick={() => setIsNewPostDialogOpen(true)}>
                  <Plus size={16} className="mr-2" />
                  Nueva Publicación
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <UserPostsGrid username={user.username} isOwnProfile={true} refreshTrigger={refreshTrigger} />
            </CardContent>
          </Card>

          {/* Mi Galería - Álbumes - Mejorado */}
          <Card className="rounded-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon size={20} className="text-primary" />
                    Mi Galería
                  </CardTitle>
                  <CardDescription>
                    Organiza tus fotos en álbumes
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => setIsCreateAlbumOpen(true)}
                  >
                    <FolderPlus size={16} className="mr-2" />
                    Crear Álbum
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/profile/${user.username}/gallery`)}
                  >
                    Ver Galería
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Grid de Álbumes */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* Álbum: Fotos de Perfil */}
                <div 
                  className="group cursor-pointer"
                  onClick={() => setSelectedAlbum('profile')}
                >
                  <div className="aspect-square bg-gradient-to-br from-primary/20 to-emerald-600/20 rounded-2xl border border-primary/30 overflow-hidden relative hover:border-primary/60 transition-all hover:shadow-lg hover:shadow-primary/20">
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt="Fotos de perfil" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <UserIcon size={40} className="text-primary/50" />
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
                  <div className="aspect-square bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl border border-blue-500/30 overflow-hidden relative hover:border-blue-500/60 transition-all hover:shadow-lg hover:shadow-blue-500/20">
                    {user.coverPhoto ? (
                      <img 
                        src={user.coverPhoto} 
                        alt="Fotos de portada" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImagePlus size={40} className="text-blue-500/50" />
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
                  <div className="aspect-square bg-secondary/50 rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center hover:border-primary/50 hover:bg-secondary transition-all">
                    <Plus size={32} className="text-muted-foreground group-hover:text-primary transition-colors mb-2" />
                    <p className="text-muted-foreground text-sm group-hover:text-foreground transition-colors">Crear Álbum</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Modal de Crear Álbum - Mejorado */}
          <Dialog open={isCreateAlbumOpen} onOpenChange={setIsCreateAlbumOpen}>
            <DialogContent className="sm:max-w-md">
              <CardHeader className="px-0 pt-0">
                <CardTitle>Crear Nuevo Álbum</CardTitle>
                <CardDescription>
                  Organiza tus fotos en un nuevo álbum
                </CardDescription>
              </CardHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="album-name">Nombre del álbum</Label>
                  <Input
                    id="album-name"
                    placeholder="Ej: Vacaciones 2024"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="album-description">Descripción (opcional)</Label>
                  <Textarea
                    id="album-description"
                    placeholder="Describe tu álbum..."
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Subir fotos</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer bg-secondary/20">
                    <ImageIcon size={32} className="mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground text-sm">Arrastra fotos aquí o haz clic para seleccionar</p>
                    <p className="text-muted-foreground text-xs mt-1">JPG, PNG hasta 10MB</p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsCreateAlbumOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    // TODO: Implementar creación de álbum
                    setIsCreateAlbumOpen(false);
                  }}
                >
                  Crear Álbum
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Modal de Ver Álbum - Mejorado */}
          <Dialog open={!!selectedAlbum && !isPhotoViewerOpen} onOpenChange={(open) => !open && setSelectedAlbum(null)}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader className="px-0 pt-0 sticky top-0 bg-background z-10 pb-4">
                <CardTitle>
                  {selectedAlbum === 'profile' ? 'Fotos de Perfil' : 'Fotos de Portada'}
                </CardTitle>
              </CardHeader>
              
              <div>
                {loadingAlbum ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Cargando fotos...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {/* Mostrar fotos del álbum desde el backend */}
                    {selectedAlbum === 'profile' && profilePhotos.length > 0 ? (
                      profilePhotos.map((photo, index) => (
                        <div 
                          key={photo.id || index} 
                          className="aspect-square rounded-lg overflow-hidden relative group border border-border cursor-pointer"
                          onClick={() => openPhotoViewer(index)}
                        >
                          <img 
                            src={photo.file_url || photo.file} 
                            alt={`Foto de perfil ${index + 1}`} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <Eye size={32} className="text-white" />
                            </div>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-xs text-gray-300">
                              {new Date(photo.created_at).toLocaleDateString('es-ES')}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : selectedAlbum === 'profile' && user.avatar ? (
                      <div 
                        className="aspect-square rounded-lg overflow-hidden border border-border cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => openPhotoViewer(0)}
                      >
                        <img 
                          src={user.avatar} 
                          alt="Foto de perfil actual" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : null}
                    
                    {selectedAlbum === 'cover' && coverPhotos.length > 0 ? (
                      coverPhotos.map((photo, index) => (
                        <div 
                          key={photo.id || index} 
                          className={`${index === 0 ? 'col-span-2 md:col-span-3 aspect-video' : 'aspect-square'} rounded-lg overflow-hidden relative group border border-border cursor-pointer`}
                          onClick={() => openPhotoViewer(index)}
                        >
                          <img 
                            src={photo.file_url || photo.file} 
                            alt={`Foto de portada ${index + 1}`} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <Eye size={32} className="text-white" />
                            </div>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-xs text-gray-300">
                              {new Date(photo.created_at).toLocaleDateString('es-ES')}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : selectedAlbum === 'cover' && user.coverPhoto ? (
                      <div 
                        className="aspect-video col-span-2 md:col-span-3 rounded-lg overflow-hidden border border-border cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => openPhotoViewer(0)}
                      >
                        <img 
                          src={user.coverPhoto} 
                          alt="Foto de portada actual" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : null}
                    
                    {/* Mensaje cuando no hay fotos */}
                    {selectedAlbum === 'profile' && profilePhotos.length === 0 && !user.avatar && (
                      <div className="aspect-square rounded-lg bg-secondary flex items-center justify-center col-span-full">
                        <p className="text-muted-foreground">No hay fotos de perfil</p>
                      </div>
                    )}
                    {selectedAlbum === 'cover' && coverPhotos.length === 0 && !user.coverPhoto && (
                      <div className="aspect-video rounded-lg bg-secondary flex items-center justify-center col-span-full">
                        <p className="text-muted-foreground">No hay fotos de portada</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          {/* Visor de Fotos con Navegación */}
          <Dialog open={isPhotoViewerOpen} onOpenChange={setIsPhotoViewerOpen}>
            <DialogContent className="max-w-[100vw] w-full h-screen max-h-screen p-0 bg-black border-0">
              <div 
                className="relative w-full h-full flex items-center justify-center overflow-hidden"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {/* Imagen Principal - Con límites de tamaño */}
                <div className="relative w-full h-full flex items-center justify-center px-16 md:px-24 py-20">
                  <img
                    src={getCurrentPhotos()[selectedPhotoIndex]?.file_url || getCurrentPhotos()[selectedPhotoIndex]?.file}
                    alt={`Foto ${selectedPhotoIndex + 1}`}
                    className="max-w-full max-h-full w-auto h-auto object-contain"
                    style={{ maxWidth: '90vw', maxHeight: '80vh' }}
                  />
                </div>

                {/* Botón Anterior - Siempre visible */}
                <Button
                  size="icon"
                  variant="ghost"
                  className={`absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white rounded-full w-12 h-12 md:w-14 md:h-14 z-20 transition-all ${
                    selectedPhotoIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-100'
                  }`}
                  onClick={prevPhoto}
                  disabled={selectedPhotoIndex === 0}
                >
                  <ArrowLeft size={28} />
                </Button>

                {/* Botón Siguiente - Siempre visible */}
                <Button
                  size="icon"
                  variant="ghost"
                  className={`absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white rounded-full w-12 h-12 md:w-14 md:h-14 z-20 transition-all ${
                    selectedPhotoIndex >= getCurrentPhotos().length - 1 ? 'opacity-30 cursor-not-allowed' : 'opacity-100'
                  }`}
                  onClick={nextPhoto}
                  disabled={selectedPhotoIndex >= getCurrentPhotos().length - 1}
                >
                  <ArrowLeft size={28} className="rotate-180" />
                </Button>

                {/* Indicador de Swipe en Móvil */}
                {getCurrentPhotos().length > 1 && (
                  <div className="absolute bottom-20 left-1/2 -translate-x-1/2 md:hidden">
                    <div className="flex items-center gap-2 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-full text-white text-xs animate-pulse">
                      <ArrowLeft size={16} />
                      <span>Desliza para navegar</span>
                      <ArrowLeft size={16} className="rotate-180" />
                    </div>
                  </div>
                )}

                {/* Contador de Fotos */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm px-5 py-2.5 rounded-full text-white text-sm font-medium z-20">
                  {selectedPhotoIndex + 1} / {getCurrentPhotos().length}
                </div>

                {/* Botón Cerrar */}
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-4 right-4 bg-black/70 hover:bg-black/90 text-white rounded-full w-10 h-10 z-20"
                  onClick={() => setIsPhotoViewerOpen(false)}
                >
                  <X size={20} />
                </Button>

                {/* Información de la Foto */}
                <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm px-4 py-2.5 rounded-xl text-white max-w-xs z-20">
                  <p className="text-sm font-semibold">
                    {selectedAlbum === 'profile' ? 'Foto de Perfil' : 'Foto de Portada'}
                  </p>
                  {getCurrentPhotos()[selectedPhotoIndex]?.created_at && (
                    <p className="text-xs text-gray-300 mt-0.5">
                      {new Date(getCurrentPhotos()[selectedPhotoIndex].created_at).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  )}
                </div>

                {/* Indicadores de Navegación por Teclado - Desktop */}
                <div className="hidden md:flex absolute bottom-6 right-6 bg-black/80 backdrop-blur-sm px-4 py-2 rounded-xl text-white text-xs gap-3 z-20">
                  <div className="flex items-center gap-1.5">
                    <kbd className="px-2 py-1 bg-white/10 rounded">←</kbd>
                    <span>Anterior</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <kbd className="px-2 py-1 bg-white/10 rounded">→</kbd>
                    <span>Siguiente</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <kbd className="px-2 py-1 bg-white/10 rounded">ESC</kbd>
                    <span>Cerrar</span>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

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

      {/* Modal de Imagen Expandida (Avatar o Portada) */}
      <Dialog open={isAvatarModalOpen} onOpenChange={setIsAvatarModalOpen}>
        <DialogContent className="max-w-4xl w-full p-0 bg-black/95 border-white/10">
          <div className="relative">
            {selectedImageType === 'avatar' ? (
              <div className="flex items-center justify-center p-8 pt-12">
                <img
                  src={user.avatar}
                  alt={user.displayName}
                  className="w-80 h-80 rounded-lg object-cover ring-4 ring-neon-green/50"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-[300px] max-h-[70vh] pt-8">
                <img
                  src={user.coverPhoto || 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=1200'}
                  alt="Foto de portada"
                  className="w-full h-full object-contain max-h-[70vh]"
                />
              </div>
            )}
            
            <div className="p-4 text-center text-gray-400 text-sm">
              {selectedImageType === 'avatar' ? 'Foto de perfil' : 'Foto de portada'} de {user.displayName}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}