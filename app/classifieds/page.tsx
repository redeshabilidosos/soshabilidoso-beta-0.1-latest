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
import { BrowseEnhancement } from '@/components/classifieds/browse-enhancement';
import { PublishMainView } from '@/components/classifieds/publish-main-view';
import { PublicationFormDialog } from '@/components/classifieds/publication-form-dialog';
import { JobSearchSection } from '@/components/classifieds/job-search-section';
import { EnterprisesSection } from '@/components/classifieds/enterprises-section';
import { CulturalAgendaSection } from '@/components/classifieds/cultural-agenda-section';

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
    <div className="min-h-screen">
      <Sidebar />
      
      <main className="pb-24 xl:ml-64 xl:pb-0 min-h-screen">
        <div className="container mx-auto px-4 py-6 max-w-6xl pb-32 xl:pb-6">
          {/* Header */}
          <div className="mb-6 space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2 flex items-center space-x-2">
                <Briefcase className="text-neon-green" />
                <span>Clasificados</span>
              </h1>
              <p className="text-gray-400">
                Compra, vende e intercambia con la comunidad SOS-HABILIDOSO
              </p>
            </div>
            <PublicationStatsBanner />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-sm pb-4 -mx-4 px-4">
              <TabsList className="grid w-full grid-cols-6 h-auto gap-1">
                <TabsTrigger value="browse" className="flex items-center justify-center space-x-1 text-xs py-2 px-1">
                  <Search className="w-4 h-4" />
                  <span className="hidden sm:inline">Explorar</span>
                </TabsTrigger>
                <TabsTrigger value="my-ads" className="flex items-center justify-center space-x-1 text-xs py-2 px-1">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Mis Anuncios</span>
                </TabsTrigger>
                <TabsTrigger value="jobs" className="flex items-center justify-center space-x-1 text-xs py-2 px-1">
                  <UserSearch className="w-4 h-4" />
                  <span className="hidden sm:inline">Empleos</span>
                </TabsTrigger>
                <TabsTrigger value="enterprises" className="flex items-center justify-center space-x-1 text-xs py-2 px-1">
                  <Rocket className="w-4 h-4" />
                  <span className="hidden sm:inline">Conexiones</span>
                </TabsTrigger>
                <TabsTrigger value="cultural-agenda" className="flex items-center justify-center space-x-1 text-xs py-2 px-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/30">
                  <CalendarDays className="w-4 h-4 text-purple-400" />
                  <span className="hidden sm:inline text-purple-300">Agenda Cultural</span>
                </TabsTrigger>
                <TabsTrigger value="create" className="flex items-center justify-center space-x-1 text-xs py-2 px-1">
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Publicar</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="browse" className="space-y-6 pb-8">
              {/* Search and Filters */}
              <Card className="glass-card">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Buscar productos..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-400"
                      />
                    </div>
                    <CyberButton
                      variant="outline"
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center justify-center space-x-2 min-w-[100px]"
                    >
                      <Filter className="w-4 h-4" />
                      <span>Filtros</span>
                    </CyberButton>
                  </div>

                  {/* Categories */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {categories.map((category) => (
                      <CyberButton
                        key={category.value}
                        variant={selectedCategory === category.value ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedCategory(category.value)}
                        className={`text-xs ${selectedCategory === category.value ? 'bg-neon-green text-black' : ''}`}
                      >
                        {category.name} ({category.count})
                      </CyberButton>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Classifieds Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
                {filteredClassifieds.map((item) => (
                  <Card key={item.id} className="glass-card hover:border-neon-green/30 transition-all duration-300 group">
                    <div className="relative">
                      <div className="h-40 sm:h-48 bg-gradient-to-r from-gray-800 to-gray-700 rounded-t-lg flex items-center justify-center">
                        <Briefcase className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
                      </div>
                      
                      {item.featured && (
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-neon-green text-black text-xs">
                            <Star className="w-3 h-3 mr-1" />
                            Destacado
                          </Badge>
                        </div>
                      )}
                      
                      <div className="absolute top-2 right-2">
                        <button
                          onClick={() => handleLike(item.id)}
                          className={`p-2 rounded-full transition-colors ${
                            item.isLiked 
                              ? 'bg-red-500 text-white' 
                              : 'bg-black/50 text-white hover:bg-red-500'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${item.isLiked ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>
                    
                    <CardContent className="p-3 sm:p-4">
                      <div className="mb-3">
                        <h3 className="font-semibold text-white mb-1 line-clamp-1 text-sm sm:text-base">{item.title}</h3>
                        <p className="text-xs sm:text-sm text-gray-400 line-clamp-2">{item.description}</p>
                      </div>

                      <div className="mb-3">
                        <div className="text-lg sm:text-xl font-bold text-neon-green mb-1">
                          {formatPrice(item.price, item.currency)}
                          {item.negotiable && (
                            <span className="text-xs text-gray-400 ml-2">Negociable</span>
                          )}
                        </div>
                        <div className="flex items-center text-xs text-gray-400 space-x-2">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{item.location}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                        <div className="flex items-center space-x-3">
                          <span className="flex items-center space-x-1">
                            <Eye className="w-3 h-3" />
                            <span>{item.views}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Heart className="w-3 h-3" />
                            <span>{item.likes}</span>
                          </span>
                        </div>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span className="hidden sm:inline">{getTimeAgo(item.createdAt)}</span>
                          <span className="sm:hidden">Hace {Math.floor(Math.random() * 24)}h</span>
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          <div className="w-6 h-6 bg-neon-green/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-3 h-3 text-neon-green" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-white truncate">{item.seller.name}</p>
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <span className="text-xs text-gray-400">{item.seller.rating}</span>
                            </div>
                          </div>
                        </div>
                        <CyberButton 
                          size="sm"
                          onClick={() => handleViewDetails(item)}
                          className="ml-2 text-xs px-2 py-1"
                        >
                          <span className="hidden sm:inline">Ver Detalles</span>
                          <span className="sm:hidden">Ver</span>
                        </CyberButton>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="my-ads" className="space-y-6 pb-8">
              <Card className="glass-card">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-white flex items-center space-x-2">
                    <User className="w-5 h-5 text-neon-green" />
                    <span>Mis Anuncios</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="text-center py-8">
                    <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">
                      No tienes anuncios publicados
                    </h3>
                    <p className="text-gray-400 mb-4 text-sm sm:text-base">
                      Publica tu primer anuncio y comienza a vender
                    </p>
                    <CyberButton onClick={() => setIsEnhancedCreateOpen(true)}>
                      Crear Anuncio
                    </CyberButton>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="create" className="space-y-6 pb-8">
              <PublishMainView 
                onCreatePublication={handleCreatePublication}
                onBrowseRequested={handleBrowseRequested}
              />
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
    </div>
  );
}