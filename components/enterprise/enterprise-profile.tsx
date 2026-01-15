'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CyberButton } from '@/components/ui/cyber-button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Building2,
  MapPin,
  Calendar,
  Users,
  Globe,
  Mail,
  Phone,
  CheckCircle,
  Star,
  TrendingUp,
  Briefcase,
  Award,
  Heart,
  Share2,
  MessageSquare,
  ExternalLink,
  Linkedin,
  Instagram,
  Twitter,
  DollarSign,
  Target,
  Rocket,
  FileText,
  ThumbsUp,
  Send,
  MoreHorizontal,
  Image as ImageIcon,
  Camera,
} from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { UpdateCoverPhotoDialog } from '@/components/ui/update-cover-photo-dialog';
import { UpdateAvatarDialog } from '@/components/ui/update-avatar-dialog';
import { messagingService } from '@/lib/services/messaging.service';

interface Enterprise {
  id: string;
  name: string;
  username: string;
  tagline: string;
  description: string;
  longDescription: string;
  avatar: string;
  coverImage: string;
  category: string;
  industry: string;
  location: string;
  founded: string;
  employees: string;
  website: string;
  email: string;
  phone: string;
  verified: boolean;
  featured: boolean;
  stats: {
    followers: number;
    projects: number;
    investments: number;
    totalRaised: number;
  };
  socialLinks: { platform: string; url: string }[];
  team: { name: string; role: string; avatar: string }[];
  achievements: string[];
  projects: { id: string; name: string; status: string; fundingGoal: number; fundingRaised: number }[];
}

interface EnterprisePost {
  id: string;
  content: string;
  image?: string;
  createdAt: string;
  likes: number;
  comments: EnterpriseComment[];
  isLiked: boolean;
}

interface EnterpriseComment {
  id: string;
  author: {
    name: string;
    avatar: string;
    username: string;
  };
  content: string;
  createdAt: string;
  likes: number;
}

// Mock posts de la empresa
const mockPosts: EnterprisePost[] = [
  {
    id: '1',
    content: '🎉 ¡Estamos emocionados de anunciar que hemos alcanzado los 5,000 usuarios activos en nuestra plataforma! Gracias a todos los que creen en nuestra misión de promover el reciclaje inteligente. #EcoTech #Sostenibilidad',
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800',
    createdAt: '2024-12-19T10:30:00Z',
    likes: 156,
    isLiked: false,
    comments: [
      {
        id: 'c1',
        author: { name: 'Carlos Mendoza', avatar: 'https://ui-avatars.com/api/?name=Carlos&background=00ff88&color=fff', username: 'carlosm' },
        content: '¡Felicitaciones! Gran trabajo 👏',
        createdAt: '2024-12-19T11:00:00Z',
        likes: 12,
      },
      {
        id: 'c2',
        author: { name: 'Ana López', avatar: 'https://ui-avatars.com/api/?name=Ana&background=00ff88&color=fff', username: 'analopez' },
        content: 'Increíble logro, sigan así! 🚀',
        createdAt: '2024-12-19T12:30:00Z',
        likes: 8,
      },
    ],
  },
  {
    id: '2',
    content: '📢 Nueva alianza estratégica con 10 centros de acopio en Bogotá. Esto significa más puntos de reciclaje cerca de ti. ¡Descarga nuestra app y encuentra el más cercano!',
    createdAt: '2024-12-18T15:00:00Z',
    likes: 89,
    isLiked: true,
    comments: [
      {
        id: 'c3',
        author: { name: 'Pedro García', avatar: 'https://ui-avatars.com/api/?name=Pedro&background=00ff88&color=fff', username: 'pedrog' },
        content: '¿Cuándo llegan a Medellín?',
        createdAt: '2024-12-18T16:00:00Z',
        likes: 5,
      },
    ],
  },
  {
    id: '3',
    content: '💡 Tip del día: ¿Sabías que reciclar una lata de aluminio ahorra suficiente energía para mantener un televisor encendido durante 3 horas? Pequeñas acciones, grandes impactos. #ReciclajeInteligente',
    createdAt: '2024-12-17T09:00:00Z',
    likes: 234,
    isLiked: false,
    comments: [],
  },
];

interface EnterpriseProfileProps {
  enterprise: Enterprise;
  isOwnProfile?: boolean;
}

export function EnterpriseProfile({ enterprise, isOwnProfile = false }: EnterpriseProfileProps) {
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const [posts, setPosts] = useState<EnterprisePost[]>(mockPosts);
  const [newComment, setNewComment] = useState<Record<string, string>>({});
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [isCoverPhotoDialogOpen, setIsCoverPhotoDialogOpen] = useState(false);
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const [isContacting, setIsContacting] = useState(false);

  const handleContact = async () => {
    if (!enterprise.username) {
      toast.error('No se puede contactar a esta empresa');
      return;
    }
    
    setIsContacting(true);
    try {
      // Crear o obtener el chat con la empresa
      const response = await messagingService.createOrGetChat(enterprise.username);
      // Navegar a la página de mensajes con el chat abierto
      router.push(`/messages?user=${enterprise.username}`);
      toast.success('Abriendo chat con ' + enterprise.name);
    } catch (error: any) {
      console.error('Error al contactar:', error);
      toast.error(error.message || 'Error al iniciar el chat');
    } finally {
      setIsContacting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      notation: 'compact',
    }).format(amount);
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: enterprise.name, url });
      } catch (err) {}
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Enlace copiado');
    }
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'linkedin':
        return <Linkedin size={18} />;
      case 'instagram':
        return <Instagram size={18} />;
      case 'twitter':
        return <Twitter size={18} />;
      default:
        return <Globe size={18} />;
    }
  };

  const handleLikePost = (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
        };
      }
      return post;
    }));
  };

  const handleAddComment = (postId: string) => {
    const comment = newComment[postId]?.trim();
    if (!comment) return;

    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [
            ...post.comments,
            {
              id: `c${Date.now()}`,
              author: {
                name: 'Tú',
                avatar: 'https://ui-avatars.com/api/?name=Tu&background=00ff88&color=fff',
                username: 'tu',
              },
              content: comment,
              createdAt: new Date().toISOString(),
              likes: 0,
            },
          ],
        };
      }
      return post;
    }));
    setNewComment(prev => ({ ...prev, [postId]: '' }));
    toast.success('Comentario publicado');
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffInHours < 1) return 'Hace un momento';
    if (diffInHours < 24) return `Hace ${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Ayer';
    return `Hace ${diffInDays} días`;
  };

  return (
    <div className="space-y-6">
      {/* Header con cover y avatar */}
      <Card className="glass-card overflow-hidden border-2 border-neon-green/30">
        {/* Cover Image */}
        <div className="relative h-48 md:h-64 bg-gradient-to-br from-neon-green/20 to-neon-blue/20">
          {enterprise.coverImage && (
            <img
              src={enterprise.coverImage}
              alt="Cover"
              className="w-full h-full object-cover opacity-50"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            {enterprise.verified && (
              <Badge className="bg-blue-500 text-white px-3 py-1">
                <CheckCircle className="w-4 h-4 mr-1" />
                Empresa Verificada ✓
              </Badge>
            )}
            {enterprise.featured && (
              <Badge className="bg-neon-green text-black px-3 py-1">
                <Star className="w-4 h-4 mr-1" />
                Destacada
              </Badge>
            )}
          </div>

          {/* Botones de acción en cover */}
          <div className="absolute top-4 right-4 flex gap-2">
            {isOwnProfile && (
              <button
                onClick={() => setIsCoverPhotoDialogOpen(true)}
                className="p-3 bg-purple-500/80 hover:bg-purple-500 rounded-full text-white transition-colors"
                title="Cambiar foto de portada"
              >
                <Camera size={20} />
              </button>
            )}
            <button
              onClick={handleShare}
              className="p-3 bg-black/50 hover:bg-black/70 rounded-full text-white"
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>

        <CardContent className="relative px-6 pb-6">
          {/* Avatar y nombre */}
          <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-16 md:-mt-20 mb-6">
            <div className="relative">
              <img
                src={enterprise.avatar}
                alt={enterprise.name}
                className="w-28 h-28 md:w-36 md:h-36 rounded-2xl ring-4 ring-neon-green/50 object-cover bg-gray-900 shadow-xl shadow-neon-green/20"
              />
              {enterprise.verified && (
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center ring-4 ring-gray-900">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              )}
              {isOwnProfile && (
                <button
                  onClick={() => setIsAvatarDialogOpen(true)}
                  className="absolute bottom-2 right-2 p-2.5 bg-purple-500 rounded-full text-white hover:bg-purple-600 transition-colors shadow-lg z-10"
                  title="Cambiar logo"
                >
                  <Camera size={16} />
                </button>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl font-bold text-white">{enterprise.name}</h1>
                <span className="text-2xl">🏢</span>
              </div>
              <p className="text-gray-400 mb-2">@{enterprise.username}</p>
              <p className="text-neon-green font-medium">{enterprise.tagline}</p>
            </div>

            {/* Acciones */}
            <div className="flex gap-3">
              {isOwnProfile ? (
                <>
                  <CyberButton variant="outline">
                    <Share2 className="w-4 h-4 mr-2" />
                    Compartir
                  </CyberButton>
                </>
              ) : (
                <>
                  <CyberButton
                    variant={isFollowing ? 'outline' : 'default'}
                    onClick={() => setIsFollowing(!isFollowing)}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${isFollowing ? 'fill-current text-red-500' : ''}`} />
                    {isFollowing ? 'Siguiendo' : 'Seguir'}
                  </CyberButton>
                  <CyberButton 
                    variant="outline"
                    onClick={handleContact}
                    disabled={isContacting}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    {isContacting ? 'Abriendo...' : 'Contactar'}
                  </CyberButton>
                </>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gradient-to-r from-neon-green/10 to-neon-blue/10 rounded-xl border border-neon-green/20">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{enterprise.stats.followers.toLocaleString()}</p>
              <p className="text-gray-400 text-sm">Seguidores</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{enterprise.stats.projects}</p>
              <p className="text-gray-400 text-sm">Proyectos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{enterprise.stats.investments}</p>
              <p className="text-gray-400 text-sm">Inversionistas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-neon-green">{formatCurrency(enterprise.stats.totalRaised)}</p>
              <p className="text-gray-400 text-sm">Recaudado</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs de contenido */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="posts" className="text-xs sm:text-sm">Publicaciones</TabsTrigger>
          <TabsTrigger value="about" className="text-xs sm:text-sm">Acerca de</TabsTrigger>
          <TabsTrigger value="team" className="text-xs sm:text-sm">Equipo</TabsTrigger>
          <TabsTrigger value="projects" className="text-xs sm:text-sm">Proyectos</TabsTrigger>
          <TabsTrigger value="contact" className="text-xs sm:text-sm">Contacto</TabsTrigger>
        </TabsList>

        {/* Publicaciones */}
        <TabsContent value="posts" className="space-y-6">
          {posts.map((post) => (
            <Card key={post.id} className="glass-card overflow-hidden">
              <CardContent className="p-0">
                {/* Header del post */}
                <div className="p-4 flex items-center gap-3">
                  <img
                    src={enterprise.avatar}
                    alt={enterprise.name}
                    className="w-12 h-12 rounded-xl ring-2 ring-neon-green/30 object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{enterprise.name}</span>
                      {enterprise.verified && (
                        <CheckCircle className="w-4 h-4 text-blue-400" />
                      )}
                      <span className="text-xl">🏢</span>
                    </div>
                    <p className="text-gray-400 text-sm">@{enterprise.username} · {getTimeAgo(post.createdAt)}</p>
                  </div>
                  <button className="p-2 hover:bg-white/10 rounded-full text-gray-400">
                    <MoreHorizontal size={20} />
                  </button>
                </div>

                {/* Contenido */}
                <div className="px-4 pb-3">
                  <p className="text-gray-200 whitespace-pre-wrap">{post.content}</p>
                </div>

                {/* Imagen si existe */}
                {post.image && (
                  <div className="px-4 pb-3">
                    <img
                      src={post.image}
                      alt="Post"
                      className="w-full rounded-xl object-cover max-h-96"
                    />
                  </div>
                )}

                {/* Acciones */}
                <div className="px-4 py-3 border-t border-white/10 flex items-center gap-6">
                  <button
                    onClick={() => handleLikePost(post.id)}
                    className={`flex items-center gap-2 transition-colors ${
                      post.isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                    <span>{post.likes}</span>
                  </button>
                  <button
                    onClick={() => setExpandedComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                    className="flex items-center gap-2 text-gray-400 hover:text-neon-green transition-colors"
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span>{post.comments.length}</span>
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 text-gray-400 hover:text-neon-blue transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Comentarios */}
                {(expandedComments[post.id] || post.comments.length <= 2) && post.comments.length > 0 && (
                  <div className="px-4 pb-4 space-y-3 border-t border-white/10 pt-3">
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <img
                          src={comment.author.avatar}
                          alt={comment.author.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="flex-1 bg-white/5 rounded-xl p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-white text-sm">{comment.author.name}</span>
                            <span className="text-gray-500 text-xs">@{comment.author.username}</span>
                            <span className="text-gray-500 text-xs">· {getTimeAgo(comment.createdAt)}</span>
                          </div>
                          <p className="text-gray-300 text-sm">{comment.content}</p>
                          <button className="flex items-center gap-1 text-gray-500 hover:text-red-400 text-xs mt-2">
                            <Heart className="w-3 h-3" />
                            <span>{comment.likes}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Input para comentar */}
                <div className="px-4 pb-4 flex gap-3 items-center">
                  <img
                    src="https://ui-avatars.com/api/?name=Tu&background=00ff88&color=fff"
                    alt="Tu"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1 flex gap-2">
                    <Input
                      placeholder="Escribe un comentario..."
                      value={newComment[post.id] || ''}
                      onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                      className="bg-white/5 border-white/10 text-white placeholder-gray-500 text-sm"
                    />
                    <CyberButton
                      size="sm"
                      onClick={() => handleAddComment(post.id)}
                      disabled={!newComment[post.id]?.trim()}
                    >
                      <Send className="w-4 h-4" />
                    </CyberButton>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {posts.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">Sin publicaciones</h3>
              <p className="text-gray-400">Esta empresa aún no ha publicado nada</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="about" className="space-y-6">
          {/* Descripción */}
          <Card className="glass-card">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <Building2 className="w-5 h-5 mr-2 text-neon-green" />
                Sobre Nosotros
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">{enterprise.description}</p>
              <p className="text-gray-400 leading-relaxed">{enterprise.longDescription}</p>
            </CardContent>
          </Card>

          {/* Info rápida */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="glass-card p-4 text-center">
              <Briefcase className="w-6 h-6 text-neon-green mx-auto mb-2" />
              <p className="text-white font-medium">{enterprise.industry}</p>
              <p className="text-gray-400 text-sm">Industria</p>
            </Card>
            <Card className="glass-card p-4 text-center">
              <MapPin className="w-6 h-6 text-neon-blue mx-auto mb-2" />
              <p className="text-white font-medium">{enterprise.location.split(',')[0]}</p>
              <p className="text-gray-400 text-sm">Ubicación</p>
            </Card>
            <Card className="glass-card p-4 text-center">
              <Calendar className="w-6 h-6 text-neon-green mx-auto mb-2" />
              <p className="text-white font-medium">{enterprise.founded}</p>
              <p className="text-gray-400 text-sm">Fundada</p>
            </Card>
            <Card className="glass-card p-4 text-center">
              <Users className="w-6 h-6 text-neon-blue mx-auto mb-2" />
              <p className="text-white font-medium">{enterprise.employees}</p>
              <p className="text-gray-400 text-sm">Empleados</p>
            </Card>
          </div>

          {/* Logros */}
          <Card className="glass-card">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2 text-neon-green" />
                Logros y Reconocimientos
              </h2>
              <div className="space-y-3">
                {enterprise.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <div className="w-8 h-8 bg-neon-green/20 rounded-full flex items-center justify-center">
                      <Star className="w-4 h-4 text-neon-green" />
                    </div>
                    <span className="text-gray-300">{achievement}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <Card className="glass-card">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <Users className="w-5 h-5 mr-2 text-neon-green" />
                Nuestro Equipo
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {enterprise.team.map((member, index) => (
                  <div key={index} className="text-center p-6 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-24 h-24 rounded-full mx-auto mb-4 ring-2 ring-neon-green/30"
                    />
                    <h3 className="text-white font-semibold">{member.name}</h3>
                    <p className="text-neon-green text-sm">{member.role}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <Card className="glass-card">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <Rocket className="w-5 h-5 mr-2 text-neon-green" />
                Proyectos Activos
              </h2>
              {enterprise.projects.map((project) => (
                <div key={project.id} className="p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-semibold">{project.name}</h3>
                    <Badge className="bg-green-500/20 text-green-400">{project.status}</Badge>
                  </div>
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-neon-green">{formatCurrency(project.fundingRaised)}</span>
                      <span className="text-gray-400">Meta: {formatCurrency(project.fundingGoal)}</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-neon-green to-neon-blue rounded-full"
                        style={{ width: `${(project.fundingRaised / project.fundingGoal) * 100}%` }}
                      />
                    </div>
                  </div>
                  <CyberButton size="sm" className="w-full">
                    <DollarSign className="w-4 h-4 mr-1" />
                    Invertir en este proyecto
                  </CyberButton>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <Card className="glass-card">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-neon-green" />
                Información de Contacto
              </h2>
              
              <div className="space-y-4">
                <a
                  href={enterprise.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <Globe className="w-5 h-5 text-neon-green" />
                  <span className="text-gray-300">{enterprise.website}</span>
                  <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                </a>
                
                <a
                  href={`mailto:${enterprise.email}`}
                  className="flex items-center gap-3 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <Mail className="w-5 h-5 text-neon-green" />
                  <span className="text-gray-300">{enterprise.email}</span>
                </a>
                
                <a
                  href={`tel:${enterprise.phone}`}
                  className="flex items-center gap-3 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <Phone className="w-5 h-5 text-neon-green" />
                  <span className="text-gray-300">{enterprise.phone}</span>
                </a>
              </div>

              {/* Redes sociales */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <h3 className="text-white font-semibold mb-4">Redes Sociales</h3>
                <div className="flex gap-3">
                  {enterprise.socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-white/10 hover:bg-neon-green/20 rounded-xl flex items-center justify-center text-gray-400 hover:text-neon-green transition-colors"
                    >
                      {getSocialIcon(link.platform)}
                    </a>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogos para editar fotos (solo si es perfil propio) */}
      {isOwnProfile && (
        <>
          <UpdateCoverPhotoDialog
            isOpen={isCoverPhotoDialogOpen}
            onClose={() => setIsCoverPhotoDialogOpen(false)}
          />
          <UpdateAvatarDialog
            isOpen={isAvatarDialogOpen}
            onClose={() => setIsAvatarDialogOpen(false)}
          />
        </>
      )}
    </div>
  );
}
