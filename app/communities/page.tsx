"use client";

import { useState, useEffect, useCallback, memo, useRef, startTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Search, ChevronRight, ChevronLeft, Sparkles, 
  TrendingUp, Grid3X3, List, ArrowLeft,
  Plus, X, Globe, Lock, Crown, Layers
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { communitiesService, CommunityCategory, Community } from "@/lib/services/communities.service";
import { useToast } from "@/hooks/use-toast";
import { DynamicCommunityForm } from "@/components/communities/dynamic-community-form";
import { useAuth } from "@/components/providers/providers";
import { useCachedUser } from "@/lib/hooks/use-cached-auth";
import { LoadingScreen } from "@/components/communities/loading-screen";
import { useForceBlackBackground } from "@/hooks/use-force-black-background";

import { Sidebar } from "@/components/navigation/sidebar";
import { MobileNav } from "@/components/navigation/mobile-nav";

export default function CommunitiesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const cachedUser = useCachedUser();
  const effectiveUser = user || cachedUser;
  
  // Forzar fondo negro en comunidades
  useForceBlackBackground();
  
  const [categories, setCategories] = useState<CommunityCategory[]>([]);
  const [featuredCommunities, setFeaturedCommunities] = useState<Community[]>([]);
  const [allCommunities, setAllCommunities] = useState<Community[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createStep, setCreateStep] = useState<'type' | 'form'>('type');
  const [selectedType, setSelectedType] = useState<'public' | 'private' | 'premium' | 'page'>('public');
  const [isSubcommunity, setIsSubcommunity] = useState(false);
  const [creatingCommunity, setCreatingCommunity] = useState(false);
  const dataLoadedRef = useRef(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  
  // Estados de paginación
  const [categoriesPage, setCategoriesPage] = useState(1);
  const [communitiesPage, setCommunitiesPage] = useState(1);
  const CATEGORIES_PER_PAGE = 8;
  const COMMUNITIES_PER_PAGE = 8;

  // Redirigir si no hay usuario
  useEffect(() => {
    if (!effectiveUser) {
      router.push('/');
    }
  }, [effectiveUser, router]);

  useEffect(() => {
    if (effectiveUser && !dataLoadedRef.current) {
      dataLoadedRef.current = true;
      loadData();
    }
  }, [effectiveUser]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [cats, communities] = await Promise.all([
        communitiesService.getCategories(),
        communitiesService.getCommunities({ only_main: true })
      ]);
      setCategories(cats);
      setAllCommunities(communities);
      setFeaturedCommunities(communities);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las comunidades",
        variant: "destructive",
      });
    } finally {
      // Mantener loading true hasta que termine la animación de carga
      setTimeout(() => {
        setLoading(false);
      }, 100);
    }
  }, [toast]);

  // Calcular datos paginados
  const paginatedCategories = categories.slice(
    (categoriesPage - 1) * CATEGORIES_PER_PAGE,
    categoriesPage * CATEGORIES_PER_PAGE
  );
  const totalCategoriesPages = Math.ceil(categories.length / CATEGORIES_PER_PAGE);

  const paginatedCommunities = featuredCommunities.slice(
    (communitiesPage - 1) * COMMUNITIES_PER_PAGE,
    communitiesPage * COMMUNITIES_PER_PAGE
  );
  const totalCommunitiesPages = Math.ceil(featuredCommunities.length / COMMUNITIES_PER_PAGE);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearching(true);
      const results = await communitiesService.getCommunities({ search: searchQuery });
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (searchQuery) {
        handleSearch();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleCreateCommunity = async (formData: any) => {
    try {
      setCreatingCommunity(true);
      
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('type', selectedType);
      
      if (formData.rules) data.append('rules', formData.rules);
      if (formData.profileImage) data.append('profile_image', formData.profileImage);
      if (formData.coverImage) data.append('cover_image', formData.coverImage);
      if (isSubcommunity && formData.parentCommunityId) {
        data.append('parent', formData.parentCommunityId);
      }
      
      // Campos específicos por tipo
      if (selectedType === 'premium' && formData.subscriptionPrice) {
        data.append('subscription_price', formData.subscriptionPrice);
        data.append('currency', formData.currency || 'COP');
      }
      if (selectedType === 'private') {
        if (formData.maxMembers) data.append('max_members', formData.maxMembers);
        data.append('invite_only', formData.inviteOnly ? 'true' : 'false');
      }
      if (selectedType === 'page') {
        if (formData.website) data.append('website', formData.website);
        if (formData.contactEmail) data.append('contact_email', formData.contactEmail);
        if (formData.businessType) data.append('business_type', formData.businessType);
      }

      const newCommunity = await communitiesService.createCommunity(data);
      
      toast({
        title: "¡Éxito!",
        description: `${isSubcommunity ? 'Subcomunidad' : 'Comunidad'} "${formData.name}" creada correctamente`,
      });
      
      setShowCreateModal(false);
      setCreateStep('type');
      setIsSubcommunity(false);
      
      // Redirigir a la nueva comunidad
      router.push(`/communities/${newCommunity.id}`);
    } catch (error: any) {
      console.error('Error creating community:', error);
      toast({
        title: "Error",
        description: error.response?.data?.detail || "No se pudo crear la comunidad",
        variant: "destructive",
      });
    } finally {
      setCreatingCommunity(false);
    }
  };

  const openCreateModal = (asSubcommunity = false) => {
    setIsSubcommunity(asSubcommunity);
    setCreateStep('type');
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setCreateStep('type');
    setIsSubcommunity(false);
  };

  // Navegación optimizada
  const handleNavigate = useCallback((path: string) => {
    startTransition(() => {
      router.push(path);
    });
  }, [router]);

  // Componente CategoryCard
  const renderCategoryCard = useCallback((category: CommunityCategory) => (
    <motion.div
      key={category.id}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => handleNavigate(`/communities/category/${category.slug}`)}
      className="cursor-pointer"
    >
      <Card className="bg-black/40 border-white/10 hover:border-[#00ff88]/50 transition-all overflow-hidden group">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div 
              className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
              style={{ backgroundColor: `${category.color}20` }}
            >
              {category.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white group-hover:text-[#00ff88] transition-colors">
                {category.name}
              </h3>
              <p className="text-sm text-gray-400">
                {category.community_count} comunidades
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-[#00ff88] transition-colors" />
          </div>
          {category.description && (
            <p className="text-xs text-gray-500 mt-3 line-clamp-2">
              {category.description}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  ), [handleNavigate]);

  // Componente CommunityCard
  const renderCommunityCard = useCallback((community: Community) => (
    <motion.div
      key={community.id}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => handleNavigate(`/communities/${community.id}`)}
      className="cursor-pointer"
    >
      <Card className="bg-black/40 border-white/10 hover:border-[#00ff88]/50 transition-all overflow-hidden h-full">
        <div className="relative h-24 bg-gradient-to-r from-[#00ff88]/20 to-purple-500/20 overflow-hidden">
          {community.cover_image && (
            <img 
              src={community.cover_image} 
              alt={community.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          )}
          {community.category_info && (
            <Badge 
              className="absolute top-2 right-2 text-xs"
              style={{ backgroundColor: community.category_info.color }}
            >
              {community.category_info.icon} {community.category_info.name}
            </Badge>
          )}
        </div>
        <CardContent className="p-4 relative overflow-hidden">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00ff88] to-emerald-600 flex items-center justify-center text-xl border-2 border-black shadow-lg flex-shrink-0 overflow-hidden">
              {community.profile_image ? (
                <img src={community.profile_image} alt="" className="w-full h-full rounded-xl object-cover" loading="lazy" />
              ) : (
                <Users className="w-6 h-6 text-black" />
              )}
            </div>
            <div className="flex-1 min-w-0 overflow-hidden">
              <h3 className="font-bold text-white truncate">{community.name}</h3>
              <p className="text-xs text-gray-400 line-clamp-2 break-words">{community.description}</p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
            <span className="text-xs text-gray-500 truncate">
              <Users className="w-3 h-3 inline mr-1" />
              {community.member_count} miembros
            </span>
            {community.subcommunity_count > 0 && (
              <span className="text-xs text-[#00ff88] truncate ml-2">
                {community.subcommunity_count} subcomunidades
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  ), [handleNavigate]);

  return (
    <>
      <AnimatePresence>
        {(loading || showLoadingScreen) && (
          <LoadingScreen 
            onLoadingComplete={() => setShowLoadingScreen(false)} 
            isDataLoaded={!loading}
          />
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-black text-white relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
      <Sidebar />
      
      {/* Contenido */}
      <main className="relative z-10 lg:ml-64 pb-24 lg:pb-0">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#00ff88]/10 to-transparent py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            {/* Logo Animado con Levitación y Partículas */}
            <div className="relative inline-block mb-8">
              {/* Partículas flotantes */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(12)].map((_, i) => {
                  const angle = (i * 30) * (Math.PI / 180); // 30 grados entre cada partícula
                  const radius = 100; // Radio del círculo alrededor del logo
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;
                  
                  return (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full"
                      style={{
                        background: i % 3 === 0 ? '#00ff88' : i % 3 === 1 ? '#00ffff' : '#ff00ff',
                        left: '50%',
                        top: '50%',
                        boxShadow: `0 0 10px ${i % 3 === 0 ? '#00ff88' : i % 3 === 1 ? '#00ffff' : '#ff00ff'}`,
                      }}
                      animate={{
                        x: [x, x + Math.cos(angle + 0.5) * 15, x],
                        y: [y, y + Math.sin(angle + 0.5) * 15, y],
                        opacity: [0.3, 1, 0.3],
                        scale: [0.8, 1.2, 0.8],
                        rotate: [0, 360, 0],
                      }}
                      transition={{
                        duration: 3 + (i * 0.2),
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.1,
                      }}
                    />
                  );
                })}
              </div>
              
              {/* Logo con efecto de levitación y giro al click */}
              <motion.img 
                src="/logo sos@3x.png" 
                alt="SOS Habilidoso" 
                className="h-44 md:h-56 mx-auto object-contain relative z-10 cursor-pointer"
                style={{
                  filter: "drop-shadow(0 0 3px rgba(0,255,136,0.6))",
                  transformStyle: "preserve-3d",
                }}
                animate={{
                  y: [0, -15, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                whileHover={{
                  scale: 1.1,
                  filter: "drop-shadow(0 0 8px rgba(0,255,136,0.8))",
                }}
                whileTap={{
                  rotateY: 360,
                }}
              />
            </div>
            
            <h1 className="text-4xl font-bold mb-2">
              <Sparkles className="w-8 h-8 inline mr-2 text-[#00ff88]" />
              Comunidades
            </h1>
            <p className="text-gray-400">
              Explora y únete a comunidades de tu interés
            </p>
          </motion.div>

          {/* Search */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <Input
              placeholder="Buscar comunidades..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 bg-black/50 border-white/20 h-12 text-white"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-12">
        {/* Search Results */}
        {searchQuery && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">
              Resultados para "{searchQuery}"
            </h2>
            {searching ? (
              <div className="text-center py-8 text-gray-500">Buscando...</div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map((community) => renderCommunityCard(community))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No se encontraron comunidades
              </div>
            )}
          </div>
        )}

        {/* Categories */}
        {!searchQuery && (
          <>
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Grid3X3 className="w-6 h-6 text-[#00ff88]" />
                  Categorías
                </h2>
                {totalCategoriesPages > 1 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">
                      {categoriesPage} / {totalCategoriesPages}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCategoriesPage(p => Math.max(1, p - 1))}
                      disabled={categoriesPage === 1}
                      className="hover:bg-white/10"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCategoriesPage(p => Math.min(totalCategoriesPages, p + 1))}
                      disabled={categoriesPage === totalCategoriesPages}
                      className="hover:bg-white/10"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {paginatedCategories.map((category) => renderCategoryCard(category))}
              </div>
            </section>

            {/* Featured Communities */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-[#00ff88]" />
                  Comunidades Destacadas
                </h2>
                <div className="flex items-center gap-4">
                  {totalCommunitiesPages > 1 && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">
                        {communitiesPage} / {totalCommunitiesPages}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCommunitiesPage(p => Math.max(1, p - 1))}
                        disabled={communitiesPage === 1}
                        className="hover:bg-white/10"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCommunitiesPage(p => Math.min(totalCommunitiesPages, p + 1))}
                        disabled={communitiesPage === totalCommunitiesPages}
                        className="hover:bg-white/10"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className={
                viewMode === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                  : "space-y-3"
              }>
                {paginatedCommunities.map((community) => renderCommunityCard(community))}
              </div>
            </section>
          </>
        )}
      </div>
      </main>

      <MobileNav />

      {/* Botón flotante para crear comunidad */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-24 right-6 lg:bottom-8 lg:right-8 z-50 flex flex-col items-center gap-2"
      >
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-black/80 text-white text-xs px-3 py-1.5 rounded-full whitespace-nowrap shadow-lg border border-[#00ff88]/30"
        >
          Crear Comunidad
        </motion.span>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => openCreateModal(false)}
          className="w-14 h-14 bg-gradient-to-r from-[#00ff88] to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-[#00ff88]/30"
        >
          <Plus className="w-7 h-7 text-black" />
        </motion.button>
      </motion.div>

      {/* Modal de crear comunidad */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col"
          >
            {/* Header del modal */}
            <div className="flex-shrink-0 bg-gray-900 border-b border-white/10 p-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-xl font-bold text-white">
                {createStep === 'type' 
                  ? (isSubcommunity ? 'Crear Subcomunidad' : 'Crear Comunidad')
                  : `Nueva ${selectedType === 'page' ? 'Página' : 'Comunidad'}`
                }
              </h2>
              <button
                onClick={closeCreateModal}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1">
              {createStep === 'type' ? (
                <div className="space-y-4">
                  {/* Toggle Comunidad/Subcomunidad */}
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <button
                      onClick={() => setIsSubcommunity(false)}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        !isSubcommunity 
                          ? 'bg-[#00ff88] text-black font-bold' 
                          : 'bg-white/10 text-gray-400 hover:bg-white/20'
                      }`}
                    >
                      Comunidad
                    </button>
                    <button
                      onClick={() => setIsSubcommunity(true)}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        isSubcommunity 
                          ? 'bg-[#00ff88] text-black font-bold' 
                          : 'bg-white/10 text-gray-400 hover:bg-white/20'
                      }`}
                    >
                      <Layers className="w-4 h-4 inline mr-2" />
                      Subcomunidad
                    </button>
                  </div>

                  <p className="text-gray-400 text-center text-sm mb-6">
                    {isSubcommunity 
                      ? 'Las subcomunidades pertenecen a una comunidad principal'
                      : 'Selecciona el tipo de comunidad que deseas crear'
                    }
                  </p>

                  {/* Tipos de comunidad */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Pública */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedType('public');
                        setCreateStep('form');
                      }}
                      className="p-4 bg-white/5 border border-white/10 rounded-xl text-left hover:border-green-500/50 hover:bg-green-500/5 transition-all"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                          <Users className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white">Pública</h3>
                          <p className="text-xs text-gray-400">Abierta para todos</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        Cualquier persona puede unirse y ver el contenido
                      </p>
                    </motion.button>

                    {/* Privada */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedType('private');
                        setCreateStep('form');
                      }}
                      className="p-4 bg-white/5 border border-white/10 rounded-xl text-left hover:border-blue-500/50 hover:bg-blue-500/5 transition-all"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                          <Lock className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white">Privada</h3>
                          <p className="text-xs text-gray-400">Solo por invitación</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        Los miembros deben ser aprobados para unirse
                      </p>
                    </motion.button>

                    {/* Premium */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedType('premium');
                        setCreateStep('form');
                      }}
                      className="p-4 bg-white/5 border border-white/10 rounded-xl text-left hover:border-yellow-500/50 hover:bg-yellow-500/5 transition-all"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                          <Crown className="w-5 h-5 text-yellow-400" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white">Premium</h3>
                          <p className="text-xs text-gray-400">Suscripción de pago</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        Los miembros pagan una suscripción mensual
                      </p>
                    </motion.button>

                    {/* Página */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedType('page');
                        setCreateStep('form');
                      }}
                      className="p-4 bg-white/5 border border-white/10 rounded-xl text-left hover:border-purple-500/50 hover:bg-purple-500/5 transition-all"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                          <Globe className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white">Página</h3>
                          <p className="text-xs text-gray-400">Para marcas y empresas</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        Ideal para negocios, marcas personales u organizaciones
                      </p>
                    </motion.button>
                  </div>
                </div>
              ) : (
                <DynamicCommunityForm
                  communityType={selectedType}
                  onSubmit={handleCreateCommunity}
                  onBack={() => setCreateStep('type')}
                  isLoading={creatingCommunity}
                  isSubcommunity={isSubcommunity}
                  parentCommunities={featuredCommunities.map(c => ({ id: c.id, name: c.name }))}
                  categories={categories}
                />
              )}
            </div>
          </motion.div>
        </div>
      )}
      </div>
    </>
  );
}
