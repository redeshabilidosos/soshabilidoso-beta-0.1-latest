'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/components/providers/providers';
import { Sidebar } from '@/components/navigation/sidebar';
import { MobileNav } from '@/components/navigation/mobile-nav';
import { AthleteProfileDetail } from '@/components/donations/athlete-profile-detail';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { getAthleteById, transformAthleteForDetail } from '@/lib/api/donations';
import { useForceBlackBackground } from '@/hooks/use-force-black-background';

export default function AthleteProfilePage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [athlete, setAthlete] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Aplicar fondo negro con estrellas
  useForceBlackBackground();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const loadAthlete = async () => {
      const id = params.id as string;
      setLoading(true);
      setError(null);
      
      try {
        const data = await getAthleteById(id);
        if (data) {
          setAthlete(transformAthleteForDetail(data));
        } else {
          setAthlete(null);
        }
      } catch (err) {
        console.error('Error loading athlete:', err);
        setError('Error al cargar el perfil');
      } finally {
        setLoading(false);
      }
    };

    if (user && params.id) {
      loadAthlete();
    }
  }, [params.id, user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <RefreshCw className="w-10 h-10 text-neon-green animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  if (error) {
    return (
      <div className="min-h-screen">
        <Sidebar />
        <main className="pb-24 xl:ml-64 xl:pb-0">
          <div className="container mx-auto px-4 py-6 max-w-4xl">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-400 hover:text-white mb-6"
            >
              <ArrowLeft size={20} />
              <span>Volver</span>
            </button>
            <div className="text-center py-16">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-neon-green hover:underline"
              >
                Intentar de nuevo
              </button>
            </div>
          </div>
        </main>
        <MobileNav />
      </div>
    );
  }

  if (!athlete) {
    return (
      <div className="min-h-screen">
        <Sidebar />
        <main className="pb-24 xl:ml-64 xl:pb-0">
          <div className="container mx-auto px-4 py-6 max-w-4xl">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-400 hover:text-white mb-6"
            >
              <ArrowLeft size={20} />
              <span>Volver</span>
            </button>
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-white mb-4">Deportista no encontrado</h2>
              <p className="text-gray-400">El perfil que buscas no existe o ha sido eliminado.</p>
            </div>
          </div>
        </main>
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="pb-24 xl:ml-64 xl:pb-0">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Volver a donaciones</span>
          </button>
          
          <AthleteProfileDetail athlete={athlete} />
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
