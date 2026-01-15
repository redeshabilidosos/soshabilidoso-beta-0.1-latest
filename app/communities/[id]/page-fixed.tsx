'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/components/providers/providers';
import { Sidebar } from '@/components/navigation/sidebar';
import { MobileNav } from '@/components/navigation/mobile-nav';
import { CyberButton } from '@/components/ui/cyber-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CommunityStatsWidget } from '@/components/communities/community-stats-widget';
import { FeaturedMembers } from '@/components/communities/featured-members';
import { RecentActivity } from '@/components/communities/recent-activity';
import { CommunityMediaGallery } from '@/components/communities/community-media-gallery';
import { PostMediaPreview, SingleMediaPreview } from '@/components/ui/post-media-preview';
import { 
  Group, 
  Users, 
  MessageSquare, 
  ArrowLeft, 
  Settings, 
  Share2,
  Calendar,
  MapPin,
  Link as LinkIcon,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  Globe,
  Lock,
  Heart,
  Eye,
  MoreHorizontal,
  Camera,
  Play,
  Image as ImageIcon,
  Star,
  Crown,
  Verified,
  Bell,
  BellOff,
  UserPlus,
  UserMinus,
  Send,
  Bookmark,
  Flag,
  TrendingUp,
  Award,
  Zap,
  Activity,
  Target,
  Shield
} from 'lucide-react';

// Mock data para la comunidad/página
const mockCommunityData = {
  '1': {
    id: '1',
    name: 'Desarrollo Web Avanzado',
    description: 'Aprende tecnologías cutting-edge, proyectos reales y mentoría de desarrolladores senior.',
    type: 'premium',
    category: 'Tecnología',
    members: 4567,
    posts: 3421,
    isJoined: true,
    isOwner: false,
    createdAt: '2024-01-15',
    location: 'Colombia',
    isVerified: true,
    isPremium: true,
    price: 120000,
    currency: 'COP',
    rating: 4.9,
    totalRatings: 1250,
    profileImage: '/api/placeholder/120/120',
    coverImage: '/api/placeholder/800/300',
    badges: ['Verificado', 'Premium', 'Top Rated'],
    socialLinks: {
      instagram: '@devwebavanzado',
      twitter: '@devweb_pro',
      facebook: 'DevWebAvanzado',
      youtube: 'DevWebAvanzado',
      website: 'https://devwebavanzado.com'
    },
    stats: {
      activeMembers: 3200,
      weeklyPosts: 45,
      monthlyGrowth: 12.5,
      engagement: 85
    },
    features: [
      'Proyectos reales',
      'Code reviews',
      'Mentoría 1:1',
      'Certificaciones',
      'Networking exclusivo'
    ]
  },
  '2': {
    id: '2',
    name: 'Fútbol Profesional',
    description: 'La comunidad más grande de fútbol en Colombia. Análisis, debates y noticias del fútbol mundial.',
    type: 'public',
    category: 'Deportes',
    members: 25840,
    posts: 8932,
    isJoined: false,
    isOwner: false,
    createdAt: '2023-08-10',
    location: 'Colombia',
    isVerified: true,
    isPremium: false,
    rating: 4.7,
    totalRatings: 890,
    profileImage: '/api/placeholder/120/120',
    coverImage: '/api/placeholder/800/300',
    badges: ['Verificado', 'Comunidad Oficial'],
    socialLinks: {
      instagram: '@futbolpro_col',
      twitter: '@futbolprofesional',
      facebook: 'FutbolProfesionalColombia',
      youtube: 'FutbolProColombia',
      website: 'https://futbolpro.co'
    },
    stats: {
      activeMembers: 18500,
      weeklyPosts: 120,
      monthlyGrowth: 8.3,
      engagement: 92
    },
    features: [
      'Análisis tácticos',
      'Transmisiones en vivo',
      'Debates exclusivos',
      'Noticias al instante'
    ]
  },
  '3': {
    id: '3',
    name: 'Cocina Creativa',
    description: 'Recetas innovadoras, técnicas culinarias y una comunidad apasionada por la gastronomía.',
    type: 'public',
    category: 'Gastronomía',
    members: 12350,
    posts: 5670,
    isJoined: true,
    isOwner: false,
    createdAt: '2023-11-20',
    location: 'Internacional',
    isVerified: false,
    isPremium: false,
    rating: 4.5,
    totalRatings: 456,
    profileImage: '/api/placeholder/120/120',
    coverImage: '/api/placeholder/800/300',
    badges: ['Trending'],
    socialLinks: {
      instagram: '@cocinacreativa',
      twitter: '',
      facebook: '',
      youtube: 'CocinaCreativaTV',
      website: ''
    },
    stats: {
      activeMembers: 8900,
      weeklyPosts: 78,
      monthlyGrowth: 15.2,
      engagement: 78
    },
    features: [
      'Recetas exclusivas',
      'Videos tutoriales',
      'Challenges culinarios',
      'Tips de chefs'
    ]
  }
};

// Mock posts data
const mockPosts = [
  {
    id: '1',
    content: '🚀 Nuevo proyecto: Sistema de autenticación con Next.js 14 y Supabase. Incluye:\n\n✅ Auth con Google/GitHub\n✅ Middleware de protección\n✅ Dashboard personalizado\n✅ Roles y permisos\n\n¿Quién quiere el código completo? 👇',
    author: {
      name: 'Desarrollo Web Avanzado',
      avatar: '/api/placeholder/40/40',
      isVerified: true,
      isPremium: true
    },
    createdAt: '2024-01-20T10:30:00Z',
    likes: 456,
    comments: 89,
    shares: 34,
    views: 2340,
    isLiked: false,
    isPinned: true,
    type: 'text',
    images: ['/api/placeholder/600/400'],
    tags: ['NextJS', 'Supabase', 'Authentication', 'Tutorial']
  },
  {
    id: '2',
    content: '🎥 LIVE CODING SESSION: Construyendo una API REST con TypeScript y Prisma\n\n📅 Hoy 8:00 PM COT\n🎯 Nivel: Intermedio-Avanzado\n⏱️ Duración: 2 horas\n\n¡Nos vemos en el stream! Link en comentarios 👨‍💻',
    author: {
      name: 'Desarrollo Web Avanzado',
      avatar: '/api/placeholder/40/40',
      isVerified: true,
      isPremium: true
    },
    createdAt: '2024-01-19T15:45:00Z',
    likes: 234,
    comments: 67,
    shares: 23,
    views: 1890,
    isLiked: true,
    isPinned: false,
    type: 'video',
    videoThumbnail: '/api/placeholder/600/400',
    tags: ['LiveCoding', 'TypeScript', 'Prisma', 'API']
  },
  {
    id: '3',
    content: '💡 TIP DEL DÍA: Optimización de imágenes en Next.js\n\nUsa el componente Image de Next.js para:\n• Lazy loading automático\n• Responsive images\n• WebP conversion\n• Mejor Core Web Vitals\n\n¿Conocías estos beneficios? 🤔',
    author: {
      name: 'Desarrollo Web Avanzado',
      avatar: '/api/placeholder/40/40',
      isVerified: true,
      isPremium: true
    },
    createdAt: '2024-01-18T09:15:00Z',
    likes: 189,
    comments: 45,
    shares: 18,
    views: 1456,
    isLiked: false,
    isPinned: false,
    type: 'text',
    images: ['/api/placeholder/600/300', '/api/placeholder/600/300'],
    tags: ['NextJS', 'Performance', 'Images', 'Tips']
  },
  {
    id: '4',
    content: '🔥 PROYECTO DESTACADO DE LA SEMANA\n\nNuestro miembro @carlos_dev creó una increíble dashboard con:\n\n🎨 Tailwind CSS + Framer Motion\n📊 Charts interactivos con Recharts\n🌙 Dark/Light mode\n📱 Completamente responsive\n\n¡Felicitaciones Carlos! 👏',
    author: {
      name: 'Desarrollo Web Avanzado',
      avatar: '/api/placeholder/40/40',
      isVerified: true,
      isPremium: true
    },
    createdAt: '2024-01-17T14:20:00Z',
    likes: 312,
    comments: 78,
    shares: 45,
    views: 2100,
    isLiked: true,
    isPinned: false,
    type: 'showcase',
    images: ['/api/placeholder/600/400', '/api/placeholder/600/400', '/api/placeholder/600/400'],
    tags: ['Showcase', 'Dashboard', 'TailwindCSS', 'FramerMotion']
  }
];

// Mock media data
const mockMediaData = [
  {
    id: '1',
    type: 'image' as const,
    url: '/api/placeholder/800/600',
    thumbnail: '/api/placeholder/400/300',
    title: 'Dashboard moderno con Next.js',
    description: 'Implementación completa de un dashboard administrativo con gráficos interactivos',
    likes: 234,
    isLiked: false,
    uploadedBy: 'Carlos Dev',
    uploadedAt: '2024-01-20T10:30:00Z',
    tags: ['NextJS', 'Dashboard', 'UI/UX']
  },
  {
    id: '2',
    type: 'video' as const,
    url: '/api/placeholder/video/tutorial.mp4',
    thumbnail: '/api/placeholder/800/450',
    title: 'Tutorial: API REST con TypeScript',
    description: 'Aprende a crear una API REST completa desde cero',
    likes: 456,
    isLiked: true,
    uploadedBy: 'Desarrollo Web Avanzado',
    uploadedAt: '2024-01-19T15:45:00Z',
    tags: ['TypeScript', 'API', 'Tutorial']
  },
  {
    id: '3',
    type: 'image' as const,
    url: '/api/placeholder/800/600',
    thumbnail: '/api/placeholder/400/300',
    title: 'Arquitectura de microservicios',
    description: 'Diagrama de arquitectura para aplicaciones escalables',
    likes: 189,
    isLiked: false,
    uploadedBy: 'Tech Lead',
    uploadedAt: '2024-01-18T09:15:00Z',
    tags: ['Architecture', 'Microservices', 'Scalability']
  },
  {
    id: '4',
    type: 'image' as const,
    url: '/api/placeholder/800/600',
    thumbnail: '/api/placeholder/400/300',
    title: 'Componentes React reutilizables',
    description: 'Librería de componentes personalizados para React',
    likes: 312,
    isLiked: true,
    uploadedBy: 'Frontend Master',
    uploadedAt: '2024-01-17T14:20:00Z',
    tags: ['React', 'Components', 'Library']
  },
  {
    id: '5',
    type: 'video' as const,
    url: '/api/placeholder/video/live-coding.mp4',
    thumbnail: '/api/placeholder/800/450',
    title: 'Live Coding: E-commerce con Next.js',
    description: 'Sesión completa construyendo una tienda online',
    likes: 567,
    isLiked: false,
    uploadedBy: 'Desarrollo Web Avanzado',
    uploadedAt: '2024-01-16T20:00:00Z',
    tags: ['NextJS', 'E-commerce', 'LiveCoding']
  },
  {
    id: '6',
    type: 'image' as const,
    url: '/api/placeholder/800/600',
    thumbnail: '/api/placeholder/400/300',
    title: 'Optimización de performance',
    description: 'Técnicas avanzadas para mejorar el rendimiento web',
    likes: 423,
    isLiked: true,
    uploadedBy: 'Performance Expert',
    uploadedAt: '2024-01-15T11:30:00Z',
    tags: ['Performance', 'Optimization', 'WebVitals']
  },
  {
    id: '7',
    type: 'image' as const,
    url: '/api/placeholder/800/600',
    thumbnail: '/api/placeholder/400/300',
    title: 'Design System completo',
    description: 'Sistema de diseño escalable para equipos de desarrollo',
    likes: 678,
    isLiked: false,
    uploadedBy: 'UX Designer',
    uploadedAt: '2024-01-14T16:45:00Z',
    tags: ['DesignSystem', 'UI', 'Figma']
  },
  {
    id: '8',
    type: 'video' as const,
    url: '/api/placeholder/video/deployment.mp4',
    thumbnail: '/api/placeholder/800/450',
    title: 'Deployment con Docker y AWS',
    description: 'Guía completa para desplegar aplicaciones en la nube',
    likes: 345,
    isLiked: true,
    uploadedBy: 'DevOps Engineer',
    uploadedAt: '2024-01-13T13:20:00Z',
    tags: ['Docker', 'AWS', 'DevOps']
  }
];

export default function CommunityProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [activeTab, setActiveTab] = useState('posts');
  const [community, setCommunity] = useState<any>(null);
  const [posts, setPosts] = useState(mockPosts);
  const [media, setMedia] = useState(mockMediaData);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }

    // Simular carga de datos
    const communityId = params.id as string;
    const communityData = mockCommunityData[communityId as keyof typeof mockCommunityData];
    
    if (communityData) {
      setCommunity(communityData);
    }
    
    setIsLoading(false);
  }, [user, router, params.id]);

  if (!user || isLoading) return null;

  if (!community) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-2">Comunidad no encontrada</h2>
          <CyberButton onClick={() => router.push('/communities')}>
            Volver a Comunidades
          </CyberButton>
        </div>
      </div>
    );
  }

  const handleJoinToggle = () => {
    setCommunity(prev => ({
      ...prev,
      isJoined: !prev.isJoined,
      members: prev.isJoined ? prev.members - 1 : prev.members + 1
    }));
  };

  const handleLikePost = (postId: string) => {
    setPosts(prev => 
      prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          };
        }
        return post;
      })
    );
  };

  const handleBookmarkPost = (postId: string) => {
    // Implementar lógica de guardado
    console.log('Bookmark post:', postId);
  };

  const handleLikeMedia = (mediaId: string) => {
    setMedia(prev => 
      prev.map(item => {
        if (item.id === mediaId) {
          return {
            ...item,
            isLiked: !item.isLiked,
            likes: item.isLiked ? item.likes - 1 : item.likes + 1
          };
        }
        return item;
      })
    );
  };

  const handleShareMedia = (mediaItem: any) => {
    // Implementar lógica de compartir
    console.log('Share media:', mediaItem);
    if (navigator.share) {
      navigator.share({
        title: mediaItem.title,
        text: mediaItem.description,
        url: window.location.href
      });
    }
  };

  const handleDownloadMedia = (mediaItem: any) => {
    // Implementar lógica de descarga
    console.log('Download media:', mediaItem);
    const link = document.createElement('a');
    link.href = mediaItem.url;
    link.download = mediaItem.title || 'media';
    link.click();
  };

  const handleUploadMedia = () => {
    // Implementar lógica de subida de medios
    console.log('Upload media');
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Hace menos de 1 hora';
    if (diffInHours < 24) return `Hace ${diffInHours} horas`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `Hace ${diffInDays} días`;
  };

  const getTypeIcon = () => {
    switch (community.type) {
      case 'public': return <Globe className="w-4 h-4" />;
      case 'private': return <Lock className="w-4 h-4" />;
      case 'premium': return <Crown className="w-4 h-4" />;
      case 'page': return <Users className="w-4 h-4" />;
      default: return <Group className="w-4 h-4" />;
    }
  };

  const getTypeLabel = () => {
    switch (community.type) {
      case 'public': return 'Comunidad Pública';
      case 'private': return 'Comunidad Privada';
      case 'premium': return 'Comunidad Premium';
      case 'page': return 'Página';
      default: return 'Comunidad';
    }
  };

  const getActionButtonText = () => {
    if (community.type === 'page') {
      return community.isJoined ? 'Siguiendo' : 'Seguir';
    }
    if (community.type === 'premium') {
      return community.isJoined ? 'Suscrito' : 'Suscribirse';
    }
    return community.isJoined ? 'Unido' : 'Unirse';
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : i < rating
            ? 'text-yellow-400 fill-current opacity-50'
            : 'text-gray-400'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen">
      <Sidebar />
      
      <main className="pb-24 xl:ml-64 xl:pb-0">
        <div className="container mx-auto px-4 py-6 max-w-5xl">
          {/* Back Button */}
          <div className="mb-6">
            <CyberButton
              variant="outline"
              size="sm"
              onClick={() => router.push('/communities')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver</span>
            </CyberButton>
          </div>

          {/* Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
              <TabsTrigger value="posts" className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4" />
                <span>Posts</span>
              </TabsTrigger>
              <TabsTrigger value="media" className="flex items-center space-x-2">
                <ImageIcon className="w-4 h-4" />
                <span>Media</span>
              </TabsTrigger>
              <TabsTrigger value="about" className="flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <span>Info</span>
              </TabsTrigger>
              <TabsTrigger value="members" className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Miembros</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="media">
              <CommunityMediaGallery
                communityId={community.id}
                media={media}
                canUpload={community.isJoined}
                viewMode="grid"
                showFilters={true}
                showStats={true}
                onUpload={handleUploadMedia}
                onLike={handleLikeMedia}
                onShare={handleShareMedia}
                onDownload={handleDownloadMedia}
              />
            </TabsContent>

            <TabsContent value="posts">
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">
                  Posts de la comunidad
                </h3>
                <p className="text-gray-400">
                  Aquí aparecerán las publicaciones de la comunidad.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="about">
              <div className="text-center py-12">
                <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">
                  Información de la comunidad
                </h3>
                <p className="text-gray-400">
                  Detalles sobre la comunidad y sus características.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="members">
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">
                  Miembros de la comunidad
                </h3>
                <p className="text-gray-400">
                  Lista de miembros y administradores.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <MobileNav />
    </div>
  );
}