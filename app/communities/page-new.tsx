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
import { Textarea } from '@/components/ui/textarea';
import { Group, Users, Plus, Search, MessageSquare, Globe, Lock, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

const initialCommunities = [
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
  const [communities, setCommunities] = useState(initialCommunities);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Deportes',
    type: 'public'
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  if (!user) return null;

  const handleJoinCommunity = (communityId: string) => {
    setCommunities(prev => 
      prev.map(community => 
        community.id === communityId 
          ? { ...community, isJoined: !community.isJoined }
          : community
      )
    );
  };

  const handleCreateCommunity = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.description.trim()) {
      toast.error('Por favor, completa todos los campos');
      return;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newCommunity = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        category: formData.category,
        type: formData.type,
        members: 1,
        posts: 0,
        isJoined: true
      };
      
      setCommunities(prev => [newCommunity, ...prev]);
      toast.success('¡Comunidad creada exitosamente!');
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        category: 'Deportes',
        type: 'public'
      });
      setShowCreateForm(false);
      
    } catch (error) {
      toast.error('Error al crear la comunidad');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCommunities = communities.filter(community =>
    community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    community.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
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
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Activa</span>
                    <CyberButton
                      size="sm"
                      variant={community.isJoined ? 'outline' : 'primary'}
                      className={community.isJoined ? 'border-neon-green text-neon-green' : ''}
                      onClick={() => handleJoinCommunity(community.id)}
                    >
                      {community.isJoined ? 'Unido' : 'Unirse'}
                    </CyberButton>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Create Community Section */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Plus className="w-5 h-5 text-neon-green" />
                  <span>{showCreateForm ? 'Crear Nueva Comunidad' : '¿Tienes una idea para una comunidad?'}</span>
                </div>
                {showCreateForm && (
                  <CyberButton 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowCreateForm(false)}
                    disabled={isLoading}
                  >
                    Cancelar
                  </CyberButton>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!showCreateForm ? (
                <div className="text-center py-6">
                  <Group className="w-12 h-12 text-neon-green mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">
                    Crea tu propia comunidad y conecta con personas que comparten tus intereses
                  </p>
                  <CyberButton onClick={() => setShowCreateForm(true)}>
                    Crear Comunidad
                  </CyberButton>
                </div>
              ) : (
                <form onSubmit={handleCreateCommunity} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Nombre de la Comunidad *
                      </label>
                      <Input
                        placeholder="Ej: Fútbol Profesional Colombia"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Categoría *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                        required
                      >
                        <option value="Deportes" className="bg-gray-800">Deportes</option>
                        <option value="Música" className="bg-gray-800">Música</option>
                        <option value="Arte" className="bg-gray-800">Arte</option>
                        <option value="Gaming" className="bg-gray-800">Gaming</option>
                        <option value="Tecnología" className="bg-gray-800">Tecnología</option>
                        <option value="Lifestyle" className="bg-gray-800">Lifestyle</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Descripción *
                    </label>
                    <Textarea
                      placeholder="Describe de qué trata tu comunidad, qué tipo de contenido se compartirá..."
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400 min-h-[80px]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Tipo de Comunidad *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <Card 
                        className={`cursor-pointer transition-all duration-300 ${
                          formData.type === 'public'
                            ? 'glass-card border-neon-green/50 bg-neon-green/10' 
                            : 'glass-card border-white/10 hover:border-white/20'
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, type: 'public' }))}
                      >
                        <CardContent className="p-3 text-center">
                          <Globe className={`w-6 h-6 mx-auto mb-2 ${
                            formData.type === 'public' ? 'text-neon-green' : 'text-gray-400'
                          }`} />
                          <h5 className="font-semibold text-white text-sm">Pública</h5>
                          <p className="text-xs text-gray-400">Acceso libre</p>
                        </CardContent>
                      </Card>

                      <Card 
                        className={`cursor-pointer transition-all duration-300 ${
                          formData.type === 'private'
                            ? 'glass-card border-neon-green/50 bg-neon-green/10' 
                            : 'glass-card border-white/10 hover:border-white/20'
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, type: 'private' }))}
                      >
                        <CardContent className="p-3 text-center">
                          <Lock className={`w-6 h-6 mx-auto mb-2 ${
                            formData.type === 'private' ? 'text-neon-green' : 'text-gray-400'
                          }`} />
                          <h5 className="font-semibold text-white text-sm">Privada</h5>
                          <p className="text-xs text-gray-400">Solo invitados</p>
                        </CardContent>
                      </Card>

                      <Card 
                        className={`cursor-pointer transition-all duration-300 ${
                          formData.type === 'premium'
                            ? 'glass-card border-neon-green/50 bg-neon-green/10' 
                            : 'glass-card border-white/10 hover:border-white/20'
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, type: 'premium' }))}
                      >
                        <CardContent className="p-3 text-center">
                          <CreditCard className={`w-6 h-6 mx-auto mb-2 ${
                            formData.type === 'premium' ? 'text-neon-green' : 'text-gray-400'
                          }`} />
                          <h5 className="font-semibold text-white text-sm">Premium</h5>
                          <p className="text-xs text-gray-400">De pago</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <CyberButton
                      type="button"
                      variant="outline"
                      onClick={() => setShowCreateForm(false)}
                      disabled={isLoading}
                    >
                      Cancelar
                    </CyberButton>
                    <CyberButton
                      type="submit"
                      disabled={isLoading}
                      className="min-w-[120px]"
                    >
                      {isLoading ? 'Creando...' : 'Crear Comunidad'}
                    </CyberButton>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <MobileNav />
    </div>
  );
}