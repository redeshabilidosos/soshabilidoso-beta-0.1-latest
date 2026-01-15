'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/providers';
import { Sidebar } from '@/components/navigation/sidebar';
import { MobileNav } from '@/components/navigation/mobile-nav';
import { CyberButton } from '@/components/ui/cyber-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Group, 
  Users, 
  Plus, 
  Search, 
  Star,
  MessageSquare,
  Eye,
  Shield
} from 'lucide-react';

// Mock data para comunidades
const mockCommunities = [
  {
    id: '1',
    name: 'Fútbol Profesional',
    description: 'Comunidad para discutir sobre fútbol profesional, ligas y torneos internacionales.',
    members: 15420,
    posts: 2341,
    category: 'Deportes',
    isPublic: true,
    isJoined: true,
    avatar: '/api/placeholder/80/80',
    cover: '/api/placeholder/400/200',
    tags: ['fútbol', 'deportes', 'ligas'],
    lastActivity: '2 min ago',
    moderators: 5
  },
  {
    id: '2',
    name: 'Música Urbana',
    description: 'Espacio para compartir y descubrir nueva música urbana, reggaeton, trap y más.',
    members: 8932,
    posts: 1876,
    category: 'Música',
    isPublic: true,
    isJoined: false,
    avatar: '/api/placeholder/80/80',
    cover: '/api/placeholder/400/200',
    tags: ['música', 'urbano', 'reggaeton'],
    lastActivity: '15 min ago',
    moderators: 3
  },
  {
    id: '3',
    name: 'Arte Digital',
    description: 'Comunidad de artistas digitales para compartir trabajos, técnicas y colaborar.',
    members: 5647,
    posts: 987,
    category: 'Arte',
    isPublic: true,
    isJoined: true,
    avatar: '/api/placeholder/80/80',
    cover: '/api/placeholder/400/200',
    tags: ['arte', 'digital', 'diseño'],
    lastActivity: '1 hora ago',
    moderators: 2
  },
  {
    id: '4',
    name: 'Gamers SOS',
    description: 'Para los amantes de los videojuegos. Comparte tus logros y encuentra compañeros de juego.',
    members: 12890,
    posts: 3456,
    category: 'Gaming',
    isPublic: true,
    isJoined: false,
    avatar: '/api/placeholder/80/80',
    cover: '/api/placeholder/400/200',
    tags: ['gaming', 'videojuegos', 'esports'],
    lastActivity: '30 min ago',
    moderators: 7
  },
  {
    id: '5',
    name: 'Cocina Creativa',
    description: 'Recetas, técnicas culinarias y todo sobre el arte de cocinar.',
    members: 3421,
    posts: 654,
    category: 'Lifestyle',
    isPublic: true,
    isJoined: true,
    avatar: '/api/placeholder/80/80',
    cover: '/api/placeholder/400/200',
    tags: ['cocina', 'recetas', 'food'],
    lastActivity: '2 horas ago',
    moderators: 2
  }
];

const categories = [
  { name: 'Todos', value: 'all', count: 25 },
  { name: 'Deportes', value: 'sports', count: 8 },
  { name: 'Música', value: 'music', count: 6 },
  { name: 'Arte', value: 'art', count: 4 },
  { name: 'Gaming', value: 'gaming', count: 5 },
  { name: 'Lifestyle', value: 'lifestyle', count: 2 }
];

export default function CommunitiesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [communities, setCommunities] = useState(mockCommunities);
  const [activeTab, setActiveTab] = useState('discover');

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  if (!user) return null;

  const handleJoinCommunity = (communityId: string) => {
    setCommunities(prev => 
      prev.map(community => {
        if (community.id === communityId) {
          return {
            ...community,
            isJoined: !community.isJoined,
            members: community.isJoined ? community.members - 1 : community.members + 1
          };
        }
        return community;
      })
    );
  };

  const filteredCommunities = communities.filter(community => {
    const matchesSearch = community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         community.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || community.category.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const joinedCommunities = communities.filter(c => c.isJoined);

  return (
    <div className="min-h-screen">
      <Sidebar />
      
      <main className="pb-24 xl:ml-64 xl:pb-0">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-2 flex items-center space-x-2">
              <Group className="text-neon-green" />
              <span>Comunidades</span>
            </h1>
            <p className="text-gray-400">
              Descubre y únete a comunidades que comparten tus intereses
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="discover" className="flex items-center space-x-2">
                <Search className="w-4 h-4" />
                <span>Descubrir</span>
              </TabsTrigger>
              <TabsTrigger value="joined" className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Mis Comunidades</span>
              </TabsTrigger>
              <TabsTrigger value="create" className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Crear</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="discover" className="space-y-6">
              {/* Search and Filters */}
              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Buscar comunidades..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-400"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <CyberButton
                          key={category.value}
                          variant={selectedCategory === category.value ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedCategory(category.value)}
                          className={selectedCategory === category.value ? 'bg-neon-green text-black' : ''}
                        >
                          {category.name} ({category.count})
                        </CyberButton>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Communities Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCommunities.map((community) => (
                  <Card key={community.id} className="glass-card hover:border-neon-green/30 transition-all duration-300">
                    <div className="relative h-32 bg-gradient-to-r from-neon-green/20 to-neon-blue/20 rounded-t-lg">
                      <div className="absolute bottom-4 left-4">
                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center border-2 border-white/20">
                          <Group className="w-8 h-8 text-neon-green" />
                        </div>
                      </div>
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary" className="bg-black/50 text-white">
                          {community.category}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="mb-3">
                        <h3 className="font-semibold text-white mb-1">{community.name}</h3>
                        <p className="text-sm text-gray-400 line-clamp-2">{community.description}</p>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center space-x-1">
                            <Users className="w-3 h-3" />
                            <span>{community.members.toLocaleString()}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <MessageSquare className="w-3 h-3" />
                            <span>{community.posts}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Shield className="w-3 h-3" />
                            <span>{community.moderators}</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {community.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs bg-white/5 border-white/10 text-gray-300">
                            #{tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">{community.lastActivity}</span>
                        <CyberButton
                          size="sm"
                          variant={community.isJoined ? 'outline' : 'default'}
                          onClick={() => handleJoinCommunity(community.id)}
                          className={community.isJoined ? 'border-neon-green text-neon-green' : ''}
                        >
                          {community.isJoined ? 'Unirse' : 'Unido'}
                        </CyberButton>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="joined" className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Users className="w-5 h-5 text-neon-green" />
                    <span>Mis Comunidades ({joinedCommunities.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {joinedCommunities.length === 0 ? (
                    <div className="text-center py-8">
                      <Group className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-white mb-2">
                        No te has unido a ninguna comunidad
                      </h3>
                      <p className="text-gray-400 mb-4">
                        Explora y únete a comunidades que te interesen
                      </p>
                      <CyberButton onClick={() => setActiveTab('discover')}>
                        Descubrir Comunidades
                      </CyberButton>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {joinedCommunities.map((community) => (
                        <div key={community.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-neon-green/20 rounded-full flex items-center justify-center">
                              <Group className="w-6 h-6 text-neon-green" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-white">{community.name}</h3>
                              <p className="text-sm text-gray-400">{community.members.toLocaleString()} miembros</p>
                            </div>
                            <CyberButton size="sm" variant="outline">
                              Ver
                            </CyberButton>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="create" className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Plus className="w-5 h-5 text-neon-green" />
                    <span>Crear Nueva Comunidad</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-8">
                    <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">
                      Funcionalidad en Desarrollo
                    </h3>
                    <p className="text-gray-400 mb-4">
                      Pronto podrás crear tus propias comunidades y ser moderador
                    </p>
                    <CyberButton disabled>
                      Próximamente
                    </CyberButton>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <MobileNav />
    </div>
  );
}