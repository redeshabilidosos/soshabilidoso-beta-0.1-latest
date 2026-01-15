'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/providers';
import { Sidebar } from '@/components/navigation/sidebar';
import { MobileNav } from '@/components/navigation/mobile-nav';
import { DonationCard } from '@/components/donations/donation-card';
import { DonationFilters } from '@/components/donations/donation-filters';
import { Input } from '@/components/ui/input';
import { Heart, Search, RefreshCw } from 'lucide-react';
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
    <div className="min-h-screen">
      <Sidebar />

      <main className="pb-24 xl:ml-64 xl:pb-0">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center space-x-3">
              <Heart className="text-neon-green" size={32} />
              <span>Donaciones a Deportistas</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Apoya el talento deportivo colombiano. Tu donación puede cambiar vidas.
            </p>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar deportistas, deportes o ciudades..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-3 text-lg bg-white/5 border-white/10 text-white placeholder-gray-400 rounded-xl"
              />
            </div>
          </div>

          {/* Filters */}
          <DonationFilters
            sports={sports}
            selectedSport={selectedSport}
            onSportChange={setSelectedSport}
          />

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <RefreshCw className="w-8 h-8 text-neon-green animate-spin" />
              <span className="ml-3 text-gray-400">Cargando deportistas...</span>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-16">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={loadAthletes}
                className="text-neon-green hover:underline"
              >
                Intentar de nuevo
              </button>
            </div>
          )}

          {/* Athletes Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              {athletes.map((athlete) => (
                <DonationCard key={athlete.id} athlete={athlete} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && athletes.length === 0 && (
            <div className="text-center py-16">
              <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">
                No se encontraron deportistas
              </h3>
              <p className="text-gray-400">
                Intenta con otros filtros o términos de búsqueda
              </p>
            </div>
          )}
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
