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
import { Group, Users, Plus, Search, Star, MessageSquare } from 'lucide-react';
import { CreateCommunityDialog } from '@/components/communities/create-community-dialog';

// Mock data fuera del componente
const mockCommunities = [
  {
    id: '1',
    name: 'Fútbol Profesional',
    description: 'Comunidad para discutir sobre fútbol profesional, ligas y torneos.',
    members: 15420,
    posts: 2341,
    category: 'Deportes',
    isJoined: true
  },
  {
    id: '2',
    name: 'Música Urbana',
    description: 'Espacio para compartir y descubrir nueva música urbana.',
    members: 8932,
    posts: 1876,
    category: 'Música',
    isJoined: false
  },
  {
    id: '3',
    name: 'Arte Digital',
    description: 'Comunidad de artistas digitales para compartir trabajos.',
    members: 5647,
    posts: 987,
    category: 'Arte',
    isJoined: true
  }
];

export default function CommunitiesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [communities, setCommunities] = useState(mockCommunities);

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  if (!user) return null;

  const handleCommunityCreated = (newCommunity: any) => {
    setCommunities(prev => [newCommunity, ...prev]);
  };

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

          {/* Search */}
          <Card className="glass-card mb-6">
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar comunidades..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-400"
                />
              </div>
            </CardContent>
          </Card>

          {/* Communities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communities.map((community) => (
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
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Activa</span>
                    <CyberButton
                      size="sm"
                      variant={community.isJoined ? 'outline' : 'default'}
                      className={community.isJoined ? 'border-neon-green text-neon-green' : ''}
                    >
                      {community.isJoined ? 'Unido' : 'Unirse'}
                    </CyberButton>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Create Community */}
          <Card className="glass-card mt-6">
            <CardContent className="p-6 text-center">
              <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                ¿Tienes una idea para una comunidad?
              </h3>
              <p className="text-gray-400 mb-4">
                Crea tu propia comunidad y conecta con personas que comparten tus intereses
              </p>
              <CyberButton onClick={() => setIsCreateDialogOpen(true)}>
                Crear Comunidad
              </CyberButton>
            </CardContent>
          </Card>
        </div>
      </main>

      <MobileNav />

      {/* Create Community Dialog */}
      <CreateCommunityDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onCommunityCreated={handleCommunityCreated}
      />
    </div>
  );
}