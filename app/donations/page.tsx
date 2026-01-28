'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/providers';
import { Sidebar } from '@/components/navigation/sidebar';
import { MobileNav } from '@/components/navigation/mobile-nav';
import { DonationCard } from '@/components/donations/donation-card';
import { DonationFilters } from '@/components/donations/donation-filters';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Search, RefreshCw, TrendingUp, Users, Target, Sparkles } from 'lucide-react';
import { getAthletes, transformAthleteForCard } from '@/lib/api/donations';

const sports = ['Todos', 'Fútbol', 'Natación', 'Baloncesto', 'Gimnasia', 'Atletismo', 'Tenis', 'Ciclismo', 'Boxeo'];

export default function DonationsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState('Todos');
  const [athletes, setAthletes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  // Cargar deportistas desde la API
  const loadAthletes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAthletes({
        sport: selectedSport !== 'Todos' ? selectedSport : undefined,
        search: searchQuery || undefined,
      });
      
      const transformed = data.map(transformAthleteForCard);
      setAthletes(transformed);
    } catch (err) {
      console.error('Error loading athletes:', err);
      setError('Error al cargar los deportistas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadAthletes();
    }
  }, [user, selectedSport]);

  // Búsqueda con debounce
  useEffect(() => {
    if (!user) return;
    
    const timer = setTimeout(() => {
      loadAthletes();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  if (authLoading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-10 h-10 border-3 border-neon-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-transparent relative">
      <Sidebar />

      <main className="pb-24 xl:ml-64 xl:pb-0 relative z-10">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Header mejorado */}
          <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-800 hover:border-red-500/30 transition-all duration-300 mb-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500/20 to-pink-500/20 flex items-center justify-center border border-red-500/30">
                  <Heart className="w-7 h-7 text-red-400" />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2 mb-1">
                    Donaciones a Deportistas
                    <Badge variant="outline" className="text-xs border-red-400/30 text-red-400">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Activo
                    </Badge>
                  </h1>
                  <p className="text-sm md:text-base text-gray-400">
                    Apoya el talento deportivo colombiano. Tu donación puede cambiar vidas.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-800 hover:border-neon-green/30 transition-all duration-300">
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 rounded-lg bg-neon-green/20 flex items-center justify-center mx-auto mb-2">
                  <Users className="w-5 h-5 text-neon-green" />
                </div>
                <div className="text-xl font-bold text-neon-green mb-1">{athletes.length}</div>
                <div className="text-xs text-gray-400">Deportistas</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-800 hover:border-blue-500/30 transition-all duration-300">
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-xl font-bold text-blue-400 mb-1">8</div>
                <div className="text-xs text-gray-400">Deportes</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-800 hover:border-purple-500/30 transition-all duration-300">
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mx-auto mb-2">
                  <Target className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-xl font-bold text-purple-400 mb-1">95%</div>
                <div className="text-xs text-gray-400">Meta alcanzada</div>
              </CardContent>
            </Card>
          </div>

          {/* Search mejorado */}
          <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-800 hover:border-neon-green/30 transition-all duration-300 mb-6">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Buscar deportistas, deportes o ciudades..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 py-3 text-base bg-white/5 border-white/10 text-white placeholder-gray-400 rounded-lg focus:border-neon-green/50 transition-colors"
                />
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <DonationFilters
            sports={sports}
            selectedSport={selectedSport}
            onSportChange={setSelectedSport}
          />

          {/* Loading State mejorado */}
          {loading && (
            <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-800 mt-8">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neon-green/20 to-neon-green/10 flex items-center justify-center mb-4 border border-neon-green/30">
                  <RefreshCw className="w-8 h-8 text-neon-green animate-spin" />
                </div>
                <span className="text-gray-400 font-medium">Cargando deportistas...</span>
              </CardContent>
            </Card>
          )}

          {/* Error State mejorado */}
          {error && !loading && (
            <Card className="bg-gray-900/80 backdrop-blur-xl border-red-500/30 mt-8">
              <CardContent className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4 border border-red-500/30">
                  <Heart className="w-8 h-8 text-red-400" />
                </div>
                <p className="text-red-400 mb-4 font-medium">{error}</p>
                <button
                  onClick={loadAthletes}
                  className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg border border-red-500/30 transition-all hover:scale-105"
                >
                  Intentar de nuevo
                </button>
              </CardContent>
            </Card>
          )}

          {/* Athletes Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              {athletes.map((athlete) => (
                <DonationCard key={athlete.id} athlete={athlete} />
              ))}
            </div>
          )}

          {/* Empty State mejorado */}
          {!loading && !error && athletes.length === 0 && (
            <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-800 mt-8">
              <CardContent className="text-center py-16">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-800 to-gray-700 flex items-center justify-center mx-auto mb-4 border border-white/10">
                  <Heart className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  No se encontraron deportistas
                </h3>
                <p className="text-gray-400 mb-6">
                  Intenta con otros filtros o términos de búsqueda
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedSport('Todos');
                  }}
                  className="px-6 py-2 bg-neon-green/20 hover:bg-neon-green/30 text-neon-green rounded-lg border border-neon-green/30 transition-all hover:scale-105"
                >
                  Limpiar Filtros
                </button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
