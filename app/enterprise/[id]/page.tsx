'use client';

// Forzar renderizado dinámico para evitar error en build
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/components/providers/providers';
import { Sidebar } from '@/components/navigation/sidebar';
import { MobileNav } from '@/components/navigation/mobile-nav';
import { EnterpriseProfile } from '@/components/enterprise/enterprise-profile';
import { ArrowLeft, RefreshCw, Edit2, Plus } from 'lucide-react';
import { CyberButton } from '@/components/ui/cyber-button';
import { enterprisesService } from '@/lib/services/enterprises.service';

export default function EnterpriseProfilePage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [enterprise, setEnterprise] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const loadEnterprise = async () => {
      const id = params.id as string;
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        // Cargar empresa desde la API
        const enterpriseData = await enterprisesService.getEnterprise(id);
        
        // Transformar datos al formato esperado por el componente
        const formattedEnterprise = {
          id: enterpriseData.id,
          name: enterpriseData.name,
          username: enterpriseData.username,
          tagline: enterpriseData.tagline || '',
          description: enterpriseData.description || '',
          longDescription: '',
          avatar: enterpriseData.logo_url || `https://ui-avatars.com/api/?name=${enterpriseData.name}&background=8B5CF6&color=fff`,
          coverImage: enterpriseData.cover_image_url || 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=1200',
          category: enterpriseData.category || 'General',
          industry: enterpriseData.industry || '',
          location: enterpriseData.location || '',
          founded: enterpriseData.founded_year?.toString() || '',
          employees: enterpriseData.employees_count || '',
          website: enterpriseData.website || '',
          email: enterpriseData.email || '',
          phone: enterpriseData.phone || '',
          verified: enterpriseData.is_verified || false,
          featured: false,
          stats: {
            followers: enterpriseData.followers_count || 0,
            projects: 0,
            investments: 0,
            totalRaised: 0,
          },
          socialLinks: [],
          team: [],
          achievements: [],
          projects: [],
        };

        setEnterprise(formattedEnterprise);
        
        // Verificar si es el propietario
        setIsOwnProfile(enterpriseData.is_owner || false);
        
      } catch (err: any) {
        console.error('Error loading enterprise:', err);
        setError('No se pudo cargar la empresa');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadEnterprise();
    }
  }, [params.id, user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <RefreshCw className="w-10 h-10 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  if (error || !enterprise) {
    return (
      <div className="min-h-screen">
        <Sidebar />
        <main className="pb-24 lg:ml-64 lg:pb-0">
          <div className="container mx-auto px-4 py-6 max-w-5xl">
            <div className="text-center py-20">
              <h2 className="text-xl text-white mb-4">Empresa no encontrada</h2>
              <p className="text-gray-400 mb-6">{error || 'La empresa que buscas no existe'}</p>
              <CyberButton onClick={() => router.back()}>
                Volver
              </CyberButton>
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
      <main className="pb-24 lg:ml-64 lg:pb-0">
        <div className="container mx-auto px-4 py-6 max-w-5xl">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Volver</span>
            </button>
            
            {/* Botones de edición si es perfil propio */}
            {isOwnProfile && (
              <div className="flex gap-3">
                <CyberButton
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/enterprise/${enterprise.id}/edit`)}
                  className="flex items-center gap-2 border-purple-500/50 text-purple-400"
                >
                  <Edit2 size={16} />
                  <span>Editar Perfil</span>
                </CyberButton>
                <CyberButton
                  size="sm"
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
                >
                  <Plus size={16} />
                  <span>Nueva Publicación</span>
                </CyberButton>
              </div>
            )}
          </div>
          
          <EnterpriseProfile enterprise={enterprise} isOwnProfile={isOwnProfile} />
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
