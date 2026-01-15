"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Users, ArrowLeft, Search, ChevronRight, 
  Grid3X3, List, Plus, UserPlus
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { communitiesService, CommunityCategory, Community } from "@/lib/services/communities.service";
import { useToast } from "@/hooks/use-toast";

export default function CategoryPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const { toast } = useToast();
  
  const [category, setCategory] = useState<CommunityCategory | null>(null);
  const [mainCommunities, setMainCommunities] = useState<Community[]>([]);
  const [subcommunities, setSubcommunities] = useState<Community[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (slug) {
      loadCategoryData();
    }
  }, [slug]);

  const loadCategoryData = async () => {
    try {
      setLoading(true);
      const data = await communitiesService.getCategoryAllCommunities(slug);
      setCategory(data.category);
      setMainCommunities(data.main_communities);
      setSubcommunities(data.subcommunities);
    } catch (error) {
      console.error('Error loading category:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar la categoría",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCommunity = async (communityId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      const result = await communitiesService.joinCommunity(communityId);
      
      // Actualizar el estado local sin recargar la página
      const updateCommunityMembership = (communities: Community[]) => 
        communities.map(c => 
          c.id === communityId 
            ? { 
                ...c, 
                is_member: result.is_member,
                member_count: result.is_member 
                  ? (c.member_count || 0) + 1 
                  : Math.max((c.member_count || 1) - 1, 0)
              } 
            : c
        );
      
      setMainCommunities(prev => updateCommunityMembership(prev));
      setSubcommunities(prev => updateCommunityMembership(prev));
      
      toast({
        title: result.is_member ? "¡Suscrito!" : "Te has desuscrito",
        description: result.message,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo completar la acción",
        variant: "destructive",
      });
    }
  };

  const filteredMain = mainCommunities.filter(c => 
    !searchQuery || 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSub = subcommunities.filter(c => 
    !searchQuery || 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const MainCommunityCard = ({ community }: { community: Community }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      onClick={() => router.push(`/communities/${community.id}`)}
      className="cursor-pointer"
    >
      <Card className="bg-black/60 border-white/10 hover:border-[#00ff88]/50 transition-all overflow-hidden">
        <div 
          className="h-32 relative"
          style={{ 
            background: community.cover_image 
              ? `url(${community.cover_image}) center/cover` 
              : `linear-gradient(135deg, ${category?.color}40, ${category?.color}10)`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-end gap-3">
              <div 
                className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl border-2 border-black"
                style={{ backgroundColor: category?.color || '#00ff88' }}
              >
                {community.profile_image ? (
                  <img src={community.profile_image} alt="" className="w-full h-full rounded-xl object-cover" />
                ) : (
                  category?.icon || '📁'
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white text-lg">{community.name}</h3>
                <p className="text-sm text-gray-300">{community.member_count} miembros</p>
              </div>
            </div>
          </div>
        </div>
        <CardContent className="p-4">
          <p className="text-sm text-gray-400 line-clamp-2 mb-4">{community.description}</p>
          
          {/* Subcommunities Preview */}
          {community.subcommunities && community.subcommunities.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">Subcomunidades:</p>
              <div className="flex flex-wrap gap-2">
                {community.subcommunities.slice(0, 4).map((sub) => (
                  <Badge 
                    key={sub.id} 
                    variant="outline" 
                    className="text-xs cursor-pointer hover:bg-[#00ff88]/20"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/communities/${sub.id}`);
                    }}
                  >
                    {sub.name}
                  </Badge>
                ))}
                {community.subcommunities.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{community.subcommunities.length - 4} más
                  </Badge>
                )}
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {community.subcommunity_count} subcomunidades
            </span>
            <Button
              size="sm"
              variant={community.is_member ? "outline" : "default"}
              onClick={(e) => handleJoinCommunity(community.id, e)}
              className={community.is_member 
                ? "border-[#00ff88] text-[#00ff88] hover:bg-[#00ff88]/10" 
                : "bg-[#00ff88] text-black hover:bg-[#00ff88]/80"}
            >
              {community.is_member ? "✓ Suscrito" : "Unirse"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const SubcommunityCard = ({ community }: { community: Community }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      onClick={() => router.push(`/communities/${community.id}`)}
      className="cursor-pointer"
    >
      <Card className="bg-black/40 border-white/10 hover:border-[#00ff88]/30 transition-all">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
              style={{ backgroundColor: `${category?.color}30` }}
            >
              {community.profile_image ? (
                <img src={community.profile_image} alt="" className="w-full h-full rounded-lg object-cover" />
              ) : (
                <Users className="w-5 h-5" style={{ color: category?.color }} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-white truncate">{community.name}</h4>
              <p className="text-xs text-gray-500">{community.member_count} miembros</p>
            </div>
            <Button
              size="sm"
              variant={community.is_member ? "outline" : "ghost"}
              onClick={(e) => handleJoinCommunity(community.id, e)}
              className={community.is_member 
                ? "shrink-0 border-[#00ff88] text-[#00ff88] text-xs px-2" 
                : "shrink-0"}
            >
              {community.is_member ? (
                <span>✓ Suscrito</span>
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
            </Button>
          </div>
          {community.parent_info && (
            <p className="text-xs text-gray-600 mt-2">
              En: {community.parent_info.name}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00ff88]"></div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Categoría no encontrada</h2>
          <Button onClick={() => router.push('/communities')}>
            Volver a comunidades
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Fondo de estrellas animadas con CSS */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </div>
      
      {/* Contenido */}
      <div className="relative z-10">
      {/* Header */}
      <div 
        className="py-12 px-4"
        style={{ 
          background: `linear-gradient(180deg, ${category.color}20 0%, transparent 100%)`
        }}
      >
        <div className="max-w-6xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Regresar
          </Button>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-6"
          >
            <div 
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
              style={{ backgroundColor: `${category.color}30` }}
            >
              {category.icon}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{category.name}</h1>
              <p className="text-gray-400">{category.description}</p>
              <div className="flex gap-4 mt-2 text-sm text-gray-500">
                <span>{mainCommunities.length} comunidades</span>
                <span>{subcommunities.length} subcomunidades</span>
              </div>
            </div>
          </motion.div>

          {/* Search */}
          <div className="max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder={`Buscar en ${category.name}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-black/50 border-white/20"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-black/50 border border-white/10 mb-6">
            <TabsTrigger value="all">
              Todas ({mainCommunities.length + subcommunities.length})
            </TabsTrigger>
            <TabsTrigger value="main">
              Principales ({filteredMain.length})
            </TabsTrigger>
            <TabsTrigger value="sub">
              Subcomunidades ({filteredSub.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-8">
            {/* Main Communities */}
            {filteredMain.length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Grid3X3 className="w-5 h-5" style={{ color: category.color }} />
                  Comunidades Principales
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredMain.map((community) => (
                    <MainCommunityCard key={community.id} community={community} />
                  ))}
                  
                  {/* Tarjeta de Comunidad Educativa Capacitaciones */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => router.push('/capacitaciones')}
                    className="cursor-pointer"
                  >
                    <Card className="bg-black/60 border-white/10 hover:border-[#00ff88]/50 transition-all overflow-hidden h-full">
                      <div 
                        className="h-32 relative"
                        style={{ 
                          background: `linear-gradient(135deg, #3b82f620, #8b5cf640)`
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex items-end gap-3">
                            <div 
                              className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl border-2 border-black bg-gradient-to-br from-blue-500 to-purple-600"
                            >
                              📚
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-white text-lg">Comunidad Educativa Capacitaciones</h3>
                              <p className="text-sm text-gray-300">Aprende y crece con nosotros</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                          Accede a cursos, talleres y capacitaciones exclusivas para mejorar tus habilidades deportivas y profesionales.
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            Cursos y talleres disponibles
                          </span>
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push('/capacitaciones');
                            }}
                          >
                            Ver Capacitaciones
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </section>
            )}

            {/* Subcommunities */}
            {filteredSub.length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <List className="w-5 h-5" style={{ color: category.color }} />
                  Subcomunidades
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredSub.map((community) => (
                    <SubcommunityCard key={community.id} community={community} />
                  ))}
                </div>
              </section>
            )}
          </TabsContent>

          <TabsContent value="main">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredMain.map((community) => (
                <MainCommunityCard key={community.id} community={community} />
              ))}
            </div>
            {filteredMain.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No hay comunidades principales en esta categoría
              </div>
            )}
          </TabsContent>

          <TabsContent value="sub">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredSub.map((community) => (
                <SubcommunityCard key={community.id} community={community} />
              ))}
            </div>
            {filteredSub.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No hay subcomunidades en esta categoría
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      </div>
    </div>
  );
}
