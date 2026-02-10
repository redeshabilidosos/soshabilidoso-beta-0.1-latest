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
  Briefcase, 
  Plus, 
  Search, 
  MapPin, 
  Calendar,
  DollarSign,
  Eye,
  Heart,
  MessageSquare,
  Filter,
  Star,
  Clock,
  User,
  ShoppingBag,
  Store,
  Rocket,
  UserSearch,
  CalendarDays
} from 'lucide-react';
import { CreateClassifiedDialog } from '@/components/classifieds/create-classified-dialog';
import { ClassifiedDetailDialog } from '@/components/classifieds/classified-detail-dialog';
import { EnhancedCreateClassified } from '@/components/classifieds/enhanced-create-classified';
import { QuickPublishCards } from '@/components/classifieds/quick-publish-cards';
import { PublicationStatsBanner } from '@/components/classifieds/publication-stats-banner';
import { MainClassifiedFlow } from '@/components/classifieds/main-classified-flow';
import { PublishMainView } from '@/components/classifieds/publish-main-view';
import { PublicationFormDialog } from '@/components/classifieds/publication-form-dialog';
import { JobSearchSection } from '@/components/classifieds/job-search-section';
import { EnterprisesSection } from '@/components/classifieds/enterprises-section';
import { CulturalAgendaSection } from '@/components/classifieds/cultural-agenda-section';
import { TutorialClassifiedsProvider } from '@/components/tutorial/tutorial-classifieds-provider';
import { TutorialClassifiedsOverlay } from '@/components/tutorial/tutorial-classifieds-overlay';
import { TutorialClassifiedsHighlight } from '@/components/tutorial/tutorial-classifieds-highlight';

// Mock data para clasificados
const mockClassifieds = [
  {
    id: '1',
    title: 'Zapatillas de Fútbol Nike Mercurial',
    description: 'Zapatillas de fútbol profesionales, talla 42, poco uso. Perfectas para césped artificial.',
    price: 150000,
    currency: 'COP',
    category: 'Deportes',
    condition: 'Usado - Como Nuevo',
    location: 'Bogotá, Colombia',
    images: ['/api/placeholder/300/200'],
    seller: {
      id: '1',
      name: 'Carlos Rodríguez',
      avatar: '/api/placeholder/40/40',
      rating: 4.8,
      verified: true
    },
    createdAt: '2024-01-15T10:30:00Z',
    views: 234,
    likes: 12,
    isLiked: false,
    tags: ['fútbol', 'nike', 'zapatillas'],
    negotiable: true,
    featured: true
  },
  {
    id: '2',
    title: 'Guitarra Eléctrica Fender Stratocaster',
    description: 'Guitarra eléctrica en excelente estado, incluye amplificador y cable. Ideal para principiantes.',
    price: 800000,
    currency: 'COP',
    category: 'Música',
    condition: 'Usado - Buen Estado',
    location: 'Medellín, Colombia',
    images: ['/api/placeholder/300/200'],
    seller: {
      id: '2',
      name: 'Ana Música',
      avatar: '/api/placeholder/40/40',
      rating: 4.9,
      verified: true
    },
    createdAt: '2024-01-14T15:45:00Z',
    views: 189,
    likes: 8,
    isLiked: true,
    tags: ['guitarra', 'fender', 'música'],
    negotiable: true,
    featured: false
  },
  {
    id: '3',
    title: 'Tablet Gráfica Wacom Intuos',
    description: 'Tablet gráfica profesional para diseño digital. Incluye lápiz y software original.',
    price: 250000,
    currency: 'COP',
    category: 'Tecnología',
    condition: 'Usado - Como Nuevo',
    location: 'Cali, Colombia',
    images: ['/api/placeholder/300/200'],
    seller: {
      id: '3',
      name: 'Design Pro',
      avatar: '/api/placeholder/40/40',
      rating: 4.7,
      verified: false
    },
    createdAt: '2024-01-13T09:20:00Z',
    views: 156,
    likes: 15,
    isLiked: false,
    tags: ['wacom', 'diseño', 'tablet'],
    negotiable: false,
    featured: false
  },
  {
    id: '4',
    title: 'Bicicleta de Montaña Trek',
    description: 'Bicicleta de montaña en excelente estado, cambios Shimano, frenos de disco.',
    price: 1200000,
    currency: 'COP',
    category: 'Deportes',
    condition: 'Usado - Buen Estado',
    location: 'Barranquilla, Colombia',
    images: ['/api/placeholder/300/200'],
    seller: {
      id: '4',
      name: 'Bike Lover',
      avatar: '/api/placeholder/40/40',
      rating: 4.6,
      verified: true
    },
    createdAt: '2024-01-12T14:10:00Z',
    views: 298,
    likes: 22,
    isLiked: false,
    tags: ['bicicleta', 'trek', 'montaña'],
    negotiable: true,
    featured: true
  }
];

const categories = [
  { name: 'Todos', value: 'all', count: 156 },
  { name: 'Deportes', value: 'deportes', count: 45 },
  { name: 'Tecnología', value: 'tecnologia', count: 38 },
  { name: 'Música', value: 'musica', count: 22 },
  { name: 'Moda', value: 'moda', count: 31 },
  { name: 'Hogar', value: 'hogar', count: 20 }
];

const priceRanges = [
  { label: 'Menos de $100.000', min: 0, max: 100000 },
  { label: '$100.000 - $500.000', min: 100000, max: 500000 },
  { label: '$500.000 - $1.000.000', min: 500000, max: 1000000 },
  { label: 'Más de $1.000.000', min: 1000000, max: Infinity }
];

export default function ClassifiedsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [classifieds, setClassifieds] = useState(mockClassifieds);
  const [activeTab, setActiveTab] = useState('browse');
  const [showFilters, setShowFilters] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEnhancedCreateOpen, setIsEnhancedCreateOpen] = useState(false);
  const [selectedClassified, setSelectedClassified] = useState(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [showPublicationForm, setShowPublicationForm] = useState(false);
  const [selectedPublicationType, setSelectedPublicationType] = useState<'product' | 'marketplace' | 'freelancer' | null>(null);

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

  const handleLike = (classifiedId: string) => {
    setClassifieds(prev => 
      prev.map(item => {
        if (item.id === classifiedId) {
          return {
            ...item,
            isLiked: !item.isLiked,
            likes: item.isLiked ? item.likes - 1 : item.likes + 1
          };
        }
        return item;
      })
    );
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: currency === 'COP' ? 'COP' : 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Hace menos de 1 hora';
    if (diffInHours < 24) return `Hace ${diffInHours} horas`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `Hace ${diffInDays} días`;
  };

  const handleClassifiedCreated = (newClassified: any) => {
    setClassifieds(prev => [newClassified, ...prev]);
    setActiveTab('browse');
  };

  const handleViewDetails = (classified: any) => {
    setSelectedClassified(classified);
    setIsDetailDialogOpen(true);
  };

  const handleContactSeller = (message: string) => {
    // Aquí se integraría con el sistema de mensajería
    console.log('Mensaje para el vendedor:', message);
  };

  const handleCreatePublication = (type: 'product' | 'marketplace' | 'freelancer') => {
    setSelectedPublicationType(type);
    setShowPublicationForm(true);
  };

  const handleBrowseRequested = () => {
    setActiveTab('browse');
  };

  const handleFormClose = () => {
    setShowPublicationForm(false);
    setSelectedPublicationType(null);
  };

  const getPublicationType = (type: 'product' | 'marketplace' | 'freelancer') => {
    const typeMap = {
      product: {
        id: 'product' as const,
        title: 'Producto Físico',
        subtitle: 'Vende artículos tangibles',
        description: 'Perfecto para vender objetos físicos como electrónicos, ropa, deportes, etc.',
        icon: ShoppingBag,
        color: 'text-blue-400',
        bgGradient: 'from-blue-500/20 to-cyan-500/20',
        features: [
          'Galería de fotos múltiples',
          'Estado del producto',
          'Precio negociable',
          'Ubicación y entrega',
          'Categorías específicas'
        ]
      },
      marketplace: {
        id: 'marketplace' as const,
        title: 'Servicio Marketplace',
        subtitle: 'Ofrece servicios locales',
        description: 'Ideal para servicios como reparaciones, limpieza, delivery, tutorías, etc.',
        icon: Store,
        color: 'text-green-400',
        bgGradient: 'from-green-500/20 to-emerald-500/20',
        features: [
          'Tarifas por hora/servicio',
          'Disponibilidad horaria',
          'Área de cobertura',
          'Reseñas y calificaciones',
          'Reserva instantánea'
        ],
        popular: true
      },
      freelancer: {
        id: 'freelancer' as const,
        title: 'Trabajo Freelancer',
        subtitle: 'Proyectos profesionales',
        description: 'Para trabajos remotos como diseño, programación, marketing, escritura, etc.',
        icon: Briefcase,
        color: 'text-purple-400',
        bgGradient: 'from-purple-500/20 to-pink-500/20',
        features: [
          'Portfolio de trabajos',
          'Presupuestos personalizados',
          'Plazos de entrega',
          'Habilidades y certificaciones',
          'Comunicación directa'
        ]
      }
    };
    return typeMap[type];
  };

  const filteredClassifieds = classifieds.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <TutorialClassifiedsProvider>
      <div className="min-h-screen bg-transparent relative overflow-hidden">
        <Sidebar />
      
      <main className="pb-24 xl:ml-64 xl:pb-0 min-h-screen relative z-10">
        <div className="container mx-auto px-4 py-6 max-w-7xl pb-32 xl:pb-6">
          {/* Header mejorado */}
          <div className="mb-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-neon-green/20 to-neon-green/10 flex items-center justify-center border border-neon-green/30">
                <Briefcase className="w-7 h-7 text-neon-green" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                  Clasificados
                  <Badge variant="outline" className="text-xs border-neon-green/30 text-neon-green">
                    <Rocket className="w-3 h-3 mr-1" />
                    Activo
                  </Badge>
                </h1>
                <p className="text-sm md:text-base text-gray-400 mt-1">
                  Compra, vende e intercambia con la comunidad SOS-HABILIDOSO
                </p>
              </div>
            </div>
            <PublicationStatsBanner />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="sticky top-0 z-10 bg-black/90 backdrop-blur-md pb-4 -mx-4 px-4 border-b border-white/10">
              <TabsList className="grid w-full grid-cols-6 h-auto gap-0.5 bg-white/5 border border-white/10 p-0.5">
                <TabsTrigger 
                  id="tab-browse"
                  value="browse" 
                  className="flex flex-col items-center justify-center gap-0 text-xs py-1.5 px-0.5 data-[state=active]:bg-neon-green/20 data-[state=active]:text-neon-green transition-all min-w-0"
                >
                  <Search className="w-3 h-3 flex-shrink-0" />
                  <span className="text-[9px] leading-tight truncate w-full text-center">Explorar</span>
                </TabsTrigger>
                <TabsTrigger 
                  id="tab-my-ads"
                  value="my-ads" 
                  className="flex flex-col items-center justify-center gap-0 text-xs py-1.5 px-0.5 data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 transition-all min-w-0"
                >
                  <User className="w-3 h-3 flex-shrink-0" />
                  <span className="text-[9px] leading-tight truncate w-full text-center">Mis Ads</span>
                </TabsTrigger>
                <TabsTrigger 
                  id="tab-jobs"
                  value="jobs" 
                  className="flex flex-col items-center justify-center gap-0 text-xs py-1.5 px-0.5 data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400 transition-all min-w-0"
                >
                  <UserSearch className="w-3 h-3 flex-shrink-0" />
                  <span className="text-[9px] leading-tight truncate w-full text-center">Empleos</span>
                </TabsTrigger>
                <TabsTrigger 
                  id="tab-enterprises"
                  value="enterprises" 
                  className="flex flex-col items-center justify-center gap-0 text-xs py-1.5 px-0.5 data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400 transition-all min-w-0"
                >
                  <Rocket className="w-3 h-3 flex-shrink-0" />
                  <span className="text-[9px] leading-tight truncate w-full text-center">Conexión</span>
                </TabsTrigger>
                <TabsTrigger 
                  id="tab-cultural-agenda"
                  value="cultural-agenda" 
                  className="flex flex-col items-center justify-center gap-0 text-xs py-1.5 px-0.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-pink-500/20 data-[state=active]:border-purple-400/30 transition-all min-w-0"
                >
                  <CalendarDays className="w-3 h-3 flex-shrink-0" />
                  <span className="text-[9px] leading-tight truncate w-full text-center">Agenda</span>
                </TabsTrigger>
                <TabsTrigger 
                  id="tab-create"
                  value="create" 
                  className="flex flex-col items-center justify-center gap-0 text-xs py-1.5 px-0.5 data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400 transition-all min-w-0"
                >
                  <Plus className="w-3 h-3 flex-shrink-0" />
                  <span className="text-[9px] leading-tight truncate w-full text-center">Publicar</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="browse" className="space-y-6 pb-8">
              {/* Search and Filters mejorado */}
              <Card className="glass-card border-white/10 hover:border-neon-green/30 transition-all duration-300">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="search-bar"
                        placeholder="Buscar productos, servicios..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-11 bg-white/5 border-white/10 text-white placeholder-gray-400 h-11 focus:border-neon-green/50 transition-colors"
                      />
                    </div>
                    <CyberButton
                      id="filters-button"
                      variant="outline"
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center justify-center gap-2 min-w-[120px] h-11"
                    >
                      <Filter className="w-4 h-4" />
                      <span>Filtros</span>
                      <Badge variant="outline" className="ml-1 text-xs">
                        {categories.find(c => c.value === selectedCategory)?.count || 0}
                      </Badge>
                    </CyberButton>
                  </div>

                  {/* Categories mejorado */}
                  <div id="categories-pills" className="flex flex-wrap gap-2 mt-4">
                    {categories.map((category) => (
                      <button
                        key={category.value}
                        onClick={() => setSelectedCategory(category.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                          selectedCategory === category.value
                            ? 'bg-neon-green text-black shadow-lg shadow-neon-green/20'
                            : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                        }`}
                      >
                        {category.name}
                        <span className={`ml-1.5 ${selectedCategory === category.value ? 'text-black/70' : 'text-gray-500'}`}>
                          ({category.count})
                        </span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Classifieds Grid mejorado */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {filteredClassifieds.map((item, index) => (
                  <Card 
                    key={item.id}
                    id={index === 0 ? 'first-classified-card' : undefined}
                    className="glass-card border-white/10 hover:border-neon-green/40 transition-all duration-300 group hover:shadow-xl hover:shadow-neon-green/10 hover:-translate-y-1"
                  >
                    <div className="relative overflow-hidden">
                      <div className="h-36 sm:h-40 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 rounded-t-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                        <Briefcase className="w-10 h-10 text-gray-400 group-hover:text-neon-green transition-colors" />
                      </div>
                      
                      {item.featured && (
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-[10px] font-semibold shadow-lg px-1.5 py-0.5">
                            <Star className="w-2.5 h-2.5 mr-0.5 fill-current" />
                            Destacado
                          </Badge>
                        </div>
                      )}
                      
                      <button
                        onClick={() => handleLike(item.id)}
                        className={`classified-card-like absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-sm transition-all duration-200 ${
                          item.isLiked 
                            ? 'bg-red-500 text-white scale-110' 
                            : 'bg-black/50 text-white hover:bg-red-500 hover:scale-110'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${item.isLiked ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                    
                    <CardContent className="p-3">
                      <div className="mb-2">
                        <h3 className="font-semibold text-white mb-1 line-clamp-1 text-sm group-hover:text-neon-green transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <div className="mb-2 pb-2 border-b border-white/10">
                        <div className="text-lg font-bold text-neon-green mb-1 flex items-baseline gap-1.5">
                          <span className="text-base">{formatPrice(item.price, item.currency)}</span>
                          {item.negotiable && (
                            <Badge variant="outline" className="text-[9px] border-neon-green/30 text-neon-green px-1 py-0">
                              Negociable
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center text-[10px] text-gray-400 gap-1">
                          <MapPin className="w-3 h-3 text-blue-400" />
                          <span className="truncate">{item.location}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-gray-400 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-0.5 hover:text-white transition-colors">
                            <Eye className="w-3 h-3" />
                            <span>{item.views}</span>
                          </span>
                          <span className="flex items-center gap-0.5 hover:text-red-400 transition-colors">
                            <Heart className="w-3 h-3" />
                            <span>{item.likes}</span>
                          </span>
                        </div>
                        <span className="flex items-center gap-0.5">
                          <Clock className="w-3 h-3" />
                          <span className="hidden sm:inline">{getTimeAgo(item.createdAt)}</span>
                          <span className="sm:hidden">Hace {Math.floor(Math.random() * 24)}h</span>
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-1 min-w-0">
                          <div className="w-7 h-7 bg-gradient-to-br from-neon-green/20 to-neon-green/10 rounded-full flex items-center justify-center flex-shrink-0 border border-neon-green/30">
                            <User className="w-3.5 h-3.5 text-neon-green" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[10px] text-white truncate font-medium">{item.seller.name}</p>
                            <div className="flex items-center gap-0.5">
                              <Star className="w-2.5 h-2.5 text-yellow-400 fill-current" />
                              <span className="text-[10px] text-gray-400">{item.seller.rating}</span>
                              {item.seller.verified && (
                                <Badge variant="outline" className="text-[8px] border-blue-400/30 text-blue-400 px-0.5 py-0 h-3">
                                  ✓
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <CyberButton 
                          size="sm"
                          onClick={() => handleViewDetails(item)}
                          className="text-[10px] px-2 py-1 h-7 hover:scale-105 transition-transform"
                        >
                          <Eye className="w-3 h-3" />
                        </CyberButton>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Empty state mejorado */}
              {filteredClassifieds.length === 0 && (
                <Card className="glass-card border-white/10">
                  <CardContent className="py-16 text-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-800 to-gray-700 flex items-center justify-center mx-auto mb-4">
                      <Search className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      No se encontraron resultados
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Intenta con otros términos de búsqueda o categorías
                    </p>
                    <CyberButton onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}>
                      Limpiar Filtros
                    </CyberButton>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="my-ads" className="space-y-6 pb-8">
              <Card className="glass-card border-white/10 hover:border-blue-500/30 transition-all duration-300">
                <CardHeader className="p-4 sm:p-6 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg">Mis Anuncios</CardTitle>
                        <p className="text-xs text-gray-400 mt-0.5">Gestiona tus publicaciones</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs border-blue-400/30 text-blue-400">
                      0 activos
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6 sm:p-8">
                  <div className="text-center py-8">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4 border border-blue-400/30">
                      <Briefcase className="w-10 h-10 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      No tienes anuncios publicados
                    </h3>
                    <p className="text-gray-400 mb-6 text-sm max-w-md mx-auto">
                      Publica tu primer anuncio y comienza a vender productos o servicios a la comunidad
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <CyberButton 
                        onClick={() => setIsEnhancedCreateOpen(true)}
                        className="gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Crear Anuncio
                      </CyberButton>
                      <CyberButton 
                        variant="outline"
                        onClick={() => setActiveTab('browse')}
                        className="gap-2"
                      >
                        <Search className="w-4 h-4" />
                        Explorar Anuncios
                      </CyberButton>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="create" className="space-y-6 pb-8">
              <div id="publication-types">
                <PublishMainView 
                  onCreatePublication={handleCreatePublication}
                  onBrowseRequested={handleBrowseRequested}
                />
              </div>
            </TabsContent>

            <TabsContent value="jobs" className="space-y-6 pb-8">
              <JobSearchSection onCreateJob={() => setActiveTab('create')} />
            </TabsContent>

            <TabsContent value="enterprises" className="space-y-6 pb-8">
              <EnterprisesSection onCreateProject={() => setActiveTab('create')} />
            </TabsContent>

            <TabsContent value="cultural-agenda" className="space-y-6 pb-8">
              <CulturalAgendaSection onCreateEvent={() => setActiveTab('create')} />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <MobileNav />

      {/* Tutorial Components */}
      <TutorialClassifiedsOverlay />
      <TutorialClassifiedsHighlight />

      {/* Dialogs */}
      <CreateClassifiedDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onClassifiedCreated={handleClassifiedCreated}
      />

      <EnhancedCreateClassified
        isOpen={isEnhancedCreateOpen}
        onClose={() => setIsEnhancedCreateOpen(false)}
        onClassifiedCreated={handleClassifiedCreated}
      />

      {/* Publication Form Dialog */}
      {showPublicationForm && selectedPublicationType && (
        <PublicationFormDialog
          isOpen={showPublicationForm}
          onClose={handleFormClose}
          publicationType={getPublicationType(selectedPublicationType)}
          onClassifiedCreated={handleClassifiedCreated}
        />
      )}

      <ClassifiedDetailDialog
        isOpen={isDetailDialogOpen}
        onClose={() => setIsDetailDialogOpen(false)}
        classified={selectedClassified}
        onContactSeller={handleContactSeller}
      />

      {/* Estilos para las estrellas animadas */}
      <style jsx global>{`
        .stars-container {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        .star {
          position: absolute;
          font-size: 14px;
          opacity: 0.3;
          color: #ffd700;
          text-shadow: 0 0 8px #ffd700;
        }
        @media (min-width: 768px) {
          .star { font-size: 18px; opacity: 0.25; }
        }
        @media (min-width: 1024px) {
          .star { font-size: 22px; opacity: 0.2; }
        }
        /* Tamaños variados */
        .star-1, .star-6, .star-11, .star-16 { font-size: 10px; }
        .star-3, .star-8, .star-13, .star-18 { font-size: 18px; }
        .star-5, .star-10, .star-15, .star-20 { font-size: 12px; }
        /* Colores variados */
        .star-2, .star-7, .star-12, .star-17 { color: #ffec8b; text-shadow: 0 0 8px #ffec8b; }
        .star-4, .star-9, .star-14, .star-19 { color: #fff8dc; text-shadow: 0 0 8px #fff8dc; }
        /* Posiciones y animaciones */
        .star-1 { top: 5%; left: 10%; animation: starFloat1 12s ease-in-out infinite; }
        .star-2 { top: 12%; right: 8%; animation: starFloat2 14s ease-in-out infinite; }
        .star-3 { top: 22%; left: 25%; animation: starFloat3 11s ease-in-out infinite; }
        .star-4 { top: 8%; right: 30%; animation: starFloat4 13s ease-in-out infinite; }
        .star-5 { top: 32%; left: 5%; animation: starFloat5 15s ease-in-out infinite; }
        .star-6 { top: 42%; right: 12%; animation: starFloat6 12s ease-in-out infinite; }
        .star-7 { top: 18%; left: 55%; animation: starFloat1 14s ease-in-out infinite reverse; }
        .star-8 { top: 52%; right: 20%; animation: starFloat2 11s ease-in-out infinite reverse; }
        .star-9 { top: 38%; left: 75%; animation: starFloat3 13s ease-in-out infinite; }
        .star-10 { top: 62%; left: 12%; animation: starFloat4 15s ease-in-out infinite; }
        .star-11 { top: 48%; right: 45%; animation: starFloat5 12s ease-in-out infinite reverse; }
        .star-12 { top: 72%; right: 8%; animation: starFloat6 14s ease-in-out infinite reverse; }
        .star-13 { top: 58%; left: 38%; animation: starFloat1 11s ease-in-out infinite; }
        .star-14 { top: 82%; left: 60%; animation: starFloat2 13s ease-in-out infinite; }
        .star-15 { top: 68%; right: 35%; animation: starFloat3 15s ease-in-out infinite reverse; }
        .star-16 { top: 78%; left: 5%; animation: starFloat4 12s ease-in-out infinite reverse; }
        .star-17 { top: 88%; right: 55%; animation: starFloat5 14s ease-in-out infinite; }
        .star-18 { top: 28%; left: 88%; animation: starFloat6 11s ease-in-out infinite; }
        .star-19 { top: 92%; left: 25%; animation: starFloat1 13s ease-in-out infinite reverse; }
        .star-20 { top: 3%; left: 42%; animation: starFloat2 15s ease-in-out infinite reverse; }

        @keyframes starFloat1 {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
          12.5% { transform: translate(20px, 15px) rotate(22deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
          25% { transform: translate(40px, 30px) rotate(45deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
          37.5% { transform: translate(30px, 42px) rotate(67deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
          50% { transform: translate(20px, 55px) rotate(90deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
          62.5% { transform: translate(1px, 43px) rotate(112deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
          75% { transform: translate(-18px, 32px) rotate(135deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
          87.5% { transform: translate(-9px, 16px) rotate(157deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
          100% { transform: translate(0, 0) rotate(180deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
        }
        @keyframes starFloat2 {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
          12.5% { transform: translate(-16px, 21px) rotate(-22deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
          25% { transform: translate(-32px, 42px) rotate(-45deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
          37.5% { transform: translate(-22px, 10px) rotate(-67deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
          50% { transform: translate(-12px, -22px) rotate(-90deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
          62.5% { transform: translate(5px, -2px) rotate(-112deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
          75% { transform: translate(22px, 18px) rotate(-135deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
          87.5% { transform: translate(11px, 9px) rotate(-157deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
          100% { transform: translate(0, 0) rotate(-180deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
        }
        @keyframes starFloat3 {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
          12.5% { transform: translate(14px, -16px) rotate(30deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
          25% { transform: translate(28px, -32px) rotate(60deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
          37.5% { transform: translate(38px, -7px) rotate(90deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
          50% { transform: translate(48px, 18px) rotate(120deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
          62.5% { transform: translate(30px, 31px) rotate(150deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
          75% { transform: translate(12px, 45px) rotate(180deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
          87.5% { transform: translate(6px, 22px) rotate(210deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
          100% { transform: translate(0, 0) rotate(240deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
        }
        @keyframes starFloat4 {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
          12.5% { transform: translate(-11px, -19px) rotate(-30deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
          25% { transform: translate(-22px, -38px) rotate(-60deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
          37.5% { transform: translate(-2px, -28px) rotate(-90deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
          50% { transform: translate(18px, -18px) rotate(-120deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
          62.5% { transform: translate(-10px, -3px) rotate(-150deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
          75% { transform: translate(-38px, 12px) rotate(-180deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
          87.5% { transform: translate(-19px, 6px) rotate(-210deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
          100% { transform: translate(0, 0) rotate(-240deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
        }
        @keyframes starFloat5 {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
          12.5% { transform: translate(16px, -11px) rotate(15deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
          25% { transform: translate(32px, -22px) rotate(30deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
          37.5% { transform: translate(11px, -35px) rotate(45deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
          50% { transform: translate(-10px, -48px) rotate(60deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
          62.5% { transform: translate(5px, -29px) rotate(75deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
          75% { transform: translate(20px, -10px) rotate(90deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
          87.5% { transform: translate(10px, -5px) rotate(105deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
          100% { transform: translate(0, 0) rotate(120deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
        }
        @keyframes starFloat6 {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
          12.5% { transform: translate(-14px, 11px) rotate(-15deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
          25% { transform: translate(-28px, 22px) rotate(-30deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
          37.5% { transform: translate(-3px, 35px) rotate(-45deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
          50% { transform: translate(22px, 48px) rotate(-60deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
          62.5% { transform: translate(31px, 16px) rotate(-75deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
          75% { transform: translate(40px, -15px) rotate(-90deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
          87.5% { transform: translate(20px, -7px) rotate(-105deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
          100% { transform: translate(0, 0) rotate(-120deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
        }
      `}</style>
      </div>
    </TutorialClassifiedsProvider>
  );
}