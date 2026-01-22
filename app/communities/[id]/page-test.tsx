'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Sidebar } from '@/components/navigation/sidebar';
import { MobileNav } from '@/components/navigation/mobile-nav';
import { CyberButton } from '@/components/ui/cyber-button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CommunityMediaGallery } from '@/components/communities/community-media-gallery';
import { 
  Users, 
  MessageSquare, 
  ArrowLeft, 
  Globe,
  Image as ImageIcon,
  Star
} from 'lucide-react';

// Mock data simplificado
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
    badges: ['Verificado', 'Premium', 'Top Rated']
  },
  '2': {
    id: '2',
    name: 'Fútbol Profesional',
    description: 'La comunidad más grande de fútbol en Colombia.',
    type: 'public',
    category: 'Deportes',
    members: 25840,
    posts: 8932,
    isJoined: false,
    isOwner: false,
    createdAt: '2026-01-10',
    location: 'Colombia',
    isVerified: true,
    isPremium: false,
    rating: 4.7,
    totalRatings: 890,
    profileImage: '/api/placeholder/120/120',
    coverImage: '/api/placeholder/800/300',
    badges: ['Verificado', 'Comunidad Oficial']
  }
};

// Mock media data
const mockMediaData = [
  {
    id: '1',
    type: 'image' as const,
    url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
    title: 'Dashboard moderno con Next.js',
    description: 'Implementación completa de un dashboard administrativo',
    likes: 234,
    isLiked: false,
    uploadedBy: 'Carlos Dev',
    uploadedAt: '2024-01-20T10:30:00Z',
    tags: ['NextJS', 'Dashboard', 'UI/UX']
  },
  {
    id: '2',
    type: 'video' as const,
    url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=450&fit=crop',
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
    url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
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
    url: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=300&fit=crop',
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
    type: 'image' as const,
    url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop',
    title: 'Optimización de performance',
    description: 'Técnicas avanzadas para mejorar el rendimiento web',
    likes: 423,
    isLiked: true,
    uploadedBy: 'Performance Expert',
    uploadedAt: '2024-01-15T11:30:00Z',
    tags: ['Performance', 'Optimization', 'WebVitals']
  },
  {
    id: '6',
    type: 'image' as const,
    url: 'https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=400&h=300&fit=crop',
    title: 'Design System completo',
    description: 'Sistema de diseño escalable para equipos de desarrollo',
    likes: 678,
    isLiked: false,
    uploadedBy: 'UX Designer',
    uploadedAt: '2024-01-14T16:45:00Z',
    tags: ['DesignSystem', 'UI', 'Figma']
  }
];

export default function CommunityProfilePageTest() {
  const router = useRouter();
  const params = useParams();
  const [activeTab, setActiveTab] = useState('media');
  const [media, setMedia] = useState(mockMediaData);

  // Simular datos de comunidad
  const communityId = params.id as string;
  const community = mockCommunityData[communityId as keyof typeof mockCommunityData] || mockCommunityData['1'];

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
    console.log('Download media:', mediaItem);
    const link = document.createElement('a');
    link.href = mediaItem.url;
    link.download = mediaItem.title || 'media';
    link.click();
  };

  const handleUploadMedia = () => {
    console.log('Upload media');
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
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

          {/* Community Header */}
          <div className="mb-8">
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={community.profileImage} />
                    <AvatarFallback className="bg-gradient-to-br from-neon-green to-neon-blue text-white text-xl font-bold">
                      {community.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-2xl font-bold text-white">{community.name}</h1>
                    <p className="text-gray-400">{community.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm">
                      <span className="flex items-center space-x-1 text-white">
                        <Users className="w-4 h-4" />
                        <span>{formatNumber(community.members)} miembros</span>
                      </span>
                      <span className="flex items-center space-x-1 text-white">
                        <MessageSquare className="w-4 h-4" />
                        <span>{formatNumber(community.posts)} posts</span>
                      </span>
                      {community.rating && (
                        <div className="flex items-center space-x-1">
                          {renderStars(community.rating)}
                          <span className="text-sm text-gray-300">
                            {community.rating} ({formatNumber(community.totalRatings)})
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex bg-gray-800/50">
              <TabsTrigger value="posts" className="flex items-center space-x-2 text-white data-[state=active]:bg-neon-green data-[state=active]:text-black">
                <MessageSquare className="w-4 h-4" />
                <span>Posts</span>
              </TabsTrigger>
              <TabsTrigger value="media" className="flex items-center space-x-2 text-white data-[state=active]:bg-neon-green data-[state=active]:text-black">
                <ImageIcon className="w-4 h-4" />
                <span>Media</span>
              </TabsTrigger>
              <TabsTrigger value="about" className="flex items-center space-x-2 text-white data-[state=active]:bg-neon-green data-[state=active]:text-black">
                <Globe className="w-4 h-4" />
                <span>Info</span>
              </TabsTrigger>
              <TabsTrigger value="members" className="flex items-center space-x-2 text-white data-[state=active]:bg-neon-green data-[state=active]:text-black">
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
              <Card className="glass-card">
                <CardContent className="p-6">
                  <h3 className="text-xl font-medium text-white mb-4">
                    Información de la comunidad
                  </h3>
                  <p className="text-gray-400 mb-4">
                    {community.description}
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-white mb-2">Categoría</h4>
                      <Badge variant="secondary" className="bg-neon-green/20 text-neon-green">
                        {community.category}
                      </Badge>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Ubicación</h4>
                      <p className="text-gray-400">{community.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="members">
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">
                  Miembros de la comunidad
                </h3>
                <p className="text-gray-400">
                  {formatNumber(community.members)} miembros en total.
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