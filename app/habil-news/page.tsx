'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/providers';
import { Sidebar } from '@/components/navigation/sidebar';
import { MobileNav } from '@/components/navigation/mobile-nav';
import { PostCard } from '@/components/ui/post-card';
import { CyberButton } from '@/components/ui/cyber-button';
import { Plus, Newspaper, Filter, ChevronDown } from 'lucide-react'; // Usar Newspaper para Habil News, importar Filter y ChevronDown
import { Post } from '@/types/user';
import { NewPostDialog } from '@/components/ui/new-post-dialog';
import { Toaster } from 'sonner';
import { cn } from '@/lib/utils'; // Importar cn
import { mockPosts } from '@/data/mock-data'; // Importar mockPosts desde el nuevo archivo

export default function HabilNewsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [isNewPostDialogOpen, setIsNewPostDialogOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>(mockPosts.filter(p => p.category !== 'football')); // Filtrar posts de fútbol para Habil News
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all'); // Nuevo estado para el filtro de categoría
  const [showCategoryFilters, setShowCategoryFilters] = useState(true); // Estado para controlar la visibilidad de los filtros

  // Definir las categorías disponibles
  const postCategories = [
    'all', 'football', 'general_sport', 'culture', 'music', 'dance', 'education', 'food', 'gaming', 'other'
  ];

  useEffect(() => {
    // Solo redirigir si ya terminó de cargar la autenticación y no hay usuario
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  // Solo mostrar loading si está cargando Y no hay usuario
  if (authLoading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-10 h-10 border-3 border-neon-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  const handlePostCreated = (newPost: Post) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  const handlePostUpdated = (updatedPost: Post) => {
    setPosts(prevPosts => prevPosts.map(p => p.id === updatedPost.id ? updatedPost : p));
  };

  const filteredPosts = posts.filter(post => {
    if (activeCategoryFilter === 'all') {
      return true;
    }
    return post.category === activeCategoryFilter;
  });

  // Contadores para las estadísticas rápidas
  const totalPosts = filteredPosts.length;
  const footballPosts = filteredPosts.filter(p => p.category === 'football').length;
  const musicPosts = filteredPosts.filter(p => p.category === 'music').length;
  const dancePosts = filteredPosts.filter(p => p.category === 'dance').length;
  const culturePosts = filteredPosts.filter(p => p.category === 'culture').length;
  const educationPosts = filteredPosts.filter(p => p.category === 'education').length;
  const generalSportPosts = filteredPosts.filter(p => p.category === 'general_sport').length;
  const otherPosts = filteredPosts.filter(p => p.category === 'other').length;

  return (
    <div className="min-h-screen">
      <Sidebar />
      
      <main className="pb-24 xl:ml-64 xl:pb-0">
        <div className="max-w-4xl mx-auto p-4 space-y-6">
          {/* Header */}
          <div className="glass-card p-4 lg:p-6">
            {/* Mobile Layout */}
            <div className="lg:hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Newspaper className="text-neon-blue" size={20} />
                  <h1 className="text-lg font-bold text-white">Habil News</h1>
                </div>
                <CyberButton 
                  size="sm"
                  className="flex items-center space-x-1 px-2 py-2 text-xs"
                  onClick={() => setIsNewPostDialogOpen(true)}
                >
                  <Plus size={14} />
                  <span>Nueva Publicación</span>
                </CyberButton>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Noticias rápidas y contenido dinámico de todas las habilidades
              </p>
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:block">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
                    <Newspaper className="text-neon-blue" />
                    <span>Habil News</span>
                  </h1>
                  <p className="text-gray-400">Noticias rápidas y contenido dinámico de todas las habilidades</p>
                </div>
                <CyberButton 
                  className="flex items-center space-x-2"
                  onClick={() => setIsNewPostDialogOpen(true)}
                >
                  <Plus size={18} />
                  <span>Nueva Publicación</span>
                </CyberButton>
              </div>
            </div>

            {/* Quick Stats (can be adapted for Habil News if needed) */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-neon-green">{totalPosts}</div>
                <div className="text-sm text-gray-400">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-neon-blue">{footballPosts}</div>
                <div className="text-sm text-gray-400">Fútbol</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{musicPosts}</div>
                <div className="text-sm text-gray-400">Música</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{culturePosts}</div>
                <div className="text-sm text-gray-400">Cultura</div>
              </div>
            </div>

            {/* Filters for Habil News */}
            <div className="flex flex-col">
              <button
                onClick={() => setShowCategoryFilters(!showCategoryFilters)}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors py-2"
              >
                <Filter className="mr-2" size={16} />
                <span className="font-medium">Filtrar por Categoría</span>
                <ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform duration-200", showCategoryFilters && "rotate-180")} />
              </button>
              {showCategoryFilters && (
                <div className="flex items-center space-x-2 flex-wrap gap-y-2 mt-2">
                  {postCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategoryFilter(category)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        activeCategoryFilter === category
                          ? 'bg-neon-green/20 text-neon-green border border-neon-green/50'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      {category === 'all' ? 'Todas' : category.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Posts Feed */}
          <div className="space-y-6">
            {filteredPosts.length === 0 ? (
              <div className="glass-card p-8 text-center">
                <Newspaper className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-lg font-semibold text-white mb-2">No se encontraron publicaciones</h3>
                <p className="text-gray-400">Intenta con otros filtros o crea una nueva publicación.</p>
              </div>
              ) : (
              filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} onPostUpdated={handlePostUpdated} />
              ))
            )}
          </div>

          {/* Load More */}
          <div className="text-center">
            <CyberButton variant="outline" size="lg">
              Cargar más publicaciones
            </CyberButton>
          </div>
        </div>
      </main>

      <MobileNav />
      <NewPostDialog 
        isOpen={isNewPostDialogOpen} 
        onClose={() => setIsNewPostDialogOpen(false)} 
        onPostCreated={handlePostCreated}
      />
      <Toaster richColors />
    </div>
  );
}