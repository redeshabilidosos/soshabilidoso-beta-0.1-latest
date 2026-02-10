'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { CyberButton } from '@/components/ui/cyber-button';
import { 
  CalendarDays, 
  MapPin, 
  Clock, 
  Users, 
  Music, 
  Palette, 
  Theater, 
  Camera,
  Search,
  Filter,
  Plus,
  Eye,
  Heart,
  Share2,
  ExternalLink,
  Instagram,
  Facebook,
  Twitter,
  Globe,
  Star,
  Ticket
} from 'lucide-react';
import { CreateEventDialog } from './create-event-dialog';
import { EventDetailDialog } from './event-detail-dialog';

interface CulturalAgendaSectionProps {
  onCreateEvent: () => void;
}

// Mock data para eventos culturales
const mockEvents = [
  {
    id: '1',
    title: 'Festival de Jazz en el Parque',
    description: 'Una noche mágica con los mejores exponentes del jazz nacional e internacional. Ven y disfruta de música en vivo bajo las estrellas. Este festival reúne a más de 15 artistas reconocidos, incluyendo bandas locales emergentes y músicos internacionales de renombre. Habrá food trucks, zona de picnic familiar y actividades para niños.',
    date: '2024-02-15',
    time: '19:00',
    endTime: '23:00',
    location: 'Parque Simón Bolívar, Bogotá',
    address: 'Calle 63 # 68-95, Bogotá',
    category: 'Música',
    tags: ['jazz', 'música en vivo', 'festival', 'parque', 'familia'],
    price: 'Gratis',
    capacity: 500,
    attendees: 234,
    image: '/api/placeholder/400/250',
    video: 'https://example.com/jazz-festival-promo.mp4',
    organizer: {
      id: '1',
      name: 'Fundación Jazz Colombia',
      avatar: '/api/placeholder/40/40',
      verified: true,
      rating: 4.9
    },
    socialLinks: {
      instagram: 'https://instagram.com/jazzfestival',
      facebook: 'https://facebook.com/jazzfestival',
      website: 'https://jazzfestival.co'
    },
    featured: true,
    likes: 89,
    isLiked: false,
    views: 1234,
    createdAt: '2024-01-10T10:00:00Z'
  },
  {
    id: '2',
    title: 'Exposición de Arte Contemporáneo: "Voces del Futuro"',
    description: 'Muestra colectiva de artistas emergentes colombianos que exploran las nuevas tendencias del arte nacional. La exposición presenta obras de 25 artistas de diferentes regiones del país, incluyendo instalaciones interactivas, pintura digital, escultura urbana y arte conceptual. Una experiencia visual única que reflexiona sobre la identidad colombiana en el siglo XXI.',
    date: '2024-02-20',
    time: '10:00',
    endTime: '18:00',
    location: 'Museo de Arte Moderno, Medellín',
    address: 'Carrera 44 # 19A-100, Medellín',
    category: 'Arte',
    tags: ['arte contemporáneo', 'exposición', 'artistas colombianos', 'instalaciones', 'cultura'],
    price: '$15.000',
    capacity: 200,
    attendees: 87,
    image: '/api/placeholder/400/250',
    video: 'https://example.com/arte-contemporaneo-tour.mp4',
    organizer: {
      id: '2',
      name: 'Museo de Arte Moderno',
      avatar: '/api/placeholder/40/40',
      verified: true,
      rating: 4.8
    },
    socialLinks: {
      instagram: 'https://instagram.com/mamm',
      website: 'https://mamm.org'
    },
    featured: false,
    likes: 45,
    isLiked: true,
    views: 567,
    createdAt: '2024-01-08T14:30:00Z'
  },
  {
    id: '3',
    title: 'Obra de Teatro: "Cien Años de Soledad"',
    description: 'Adaptación teatral de la obra maestra de Gabriel García Márquez dirigida por el reconocido director Carlos Vives Jr. Una puesta en escena espectacular que rinde homenaje al realismo mágico con efectos visuales innovadores, música en vivo y un elenco de 20 actores. La obra recorre los momentos más emblemáticos de la novela en un viaje de 2.5 horas lleno de magia, amor y nostalgia.',
    date: '2024-02-25',
    time: '20:00',
    endTime: '22:30',
    location: 'Teatro Colón, Bogotá',
    address: 'Calle 10 # 5-32, Bogotá',
    category: 'Teatro',
    tags: ['teatro', 'garcía márquez', 'literatura', 'drama', 'realismo mágico'],
    price: '$45.000 - $120.000',
    capacity: 300,
    attendees: 156,
    image: '/api/placeholder/400/250',
    video: 'https://example.com/cien-anos-trailer.mp4',
    organizer: {
      id: '3',
      name: 'Teatro Nacional',
      avatar: '/api/placeholder/40/40',
      verified: true,
      rating: 4.7
    },
    socialLinks: {
      instagram: 'https://instagram.com/teatronacional',
      facebook: 'https://facebook.com/teatronacional',
      twitter: 'https://twitter.com/teatronacional'
    },
    featured: true,
    likes: 156,
    isLiked: false,
    views: 2341,
    createdAt: '2024-01-05T16:45:00Z'
  },
  {
    id: '4',
    title: 'Taller de Fotografía Urbana: "Capturando la Esencia de la Ciudad"',
    description: 'Aprende técnicas avanzadas de fotografía callejera con profesionales reconocidos internacionalmente. El taller incluye teoría sobre composición, manejo de luz natural, técnicas de street photography y post-producción digital. Incluye recorrido guiado por el centro histórico, sesión práctica de 6 horas, almuerzo, material didáctico y certificado de participación.',
    date: '2024-02-18',
    time: '09:00',
    endTime: '17:00',
    location: 'Centro Histórico, Cartagena',
    address: 'Plaza de Armas, Cartagena',
    category: 'Educación',
    tags: ['fotografía', 'taller', 'urbano', 'aprendizaje', 'street photography'],
    price: '$80.000',
    capacity: 15,
    attendees: 12,
    image: '/api/placeholder/400/250',
    video: 'https://example.com/fotografia-urbana-preview.mp4',
    organizer: {
      id: '4',
      name: 'Escuela de Fotografía Visual',
      avatar: '/api/placeholder/40/40',
      verified: false,
      rating: 4.6
    },
    socialLinks: {
      instagram: 'https://instagram.com/fotografiavisual',
      website: 'https://fotografiavisual.co'
    },
    featured: false,
    likes: 23,
    isLiked: false,
    views: 345,
    createdAt: '2024-01-12T11:20:00Z'
  },
  {
    id: '5',
    title: 'Concierto Sinfónico: "Música de Película"',
    description: 'La Orquesta Sinfónica Nacional presenta un espectacular concierto dedicado a las bandas sonoras más icónicas del cine. Desde John Williams hasta Hans Zimmer, revive las melodías de Star Wars, El Señor de los Anillos, Titanic, Inception y muchas más. Un evento único con proyecciones visuales sincronizadas y efectos especiales que transportarán al público a sus películas favoritas.',
    date: '2024-02-28',
    time: '20:30',
    endTime: '22:30',
    location: 'Teatro Mayor Julio Mario Santo Domingo, Bogotá',
    address: 'Avenida Calle 170 # 67-51, Bogotá',
    category: 'Música',
    tags: ['sinfónico', 'cine', 'orquesta', 'bandas sonoras', 'clásico'],
    price: '$65.000 - $180.000',
    capacity: 1200,
    attendees: 890,
    image: '/api/placeholder/400/250',
    video: 'https://example.com/concierto-sinfonico-trailer.mp4',
    organizer: {
      id: '5',
      name: 'Orquesta Sinfónica Nacional',
      avatar: '/api/placeholder/40/40',
      verified: true,
      rating: 4.9
    },
    socialLinks: {
      instagram: 'https://instagram.com/osn_colombia',
      facebook: 'https://facebook.com/osncolombia',
      website: 'https://osn.gov.co'
    },
    featured: true,
    likes: 234,
    isLiked: true,
    views: 3456,
    createdAt: '2024-01-03T09:15:00Z'
  },
  {
    id: '6',
    title: 'Festival de Danza Contemporánea: "Cuerpos en Movimiento"',
    description: 'Tres días de danza contemporánea con compañías nacionales e internacionales. El festival incluye espectáculos, talleres magistrales, conferencias sobre técnica y creación coreográfica, y una competencia de jóvenes talentos. Participan 12 compañías de danza de Colombia, Argentina, México y España. Ideal para bailarines, estudiantes de artes escénicas y amantes de la danza.',
    date: '2024-03-05',
    time: '18:00',
    endTime: '22:00',
    location: 'Centro Cultural Gabriel García Márquez, Bogotá',
    address: 'Calle 11 # 5-60, Bogotá',
    category: 'Danza',
    tags: ['danza contemporánea', 'festival', 'internacional', 'talleres', 'competencia'],
    price: '$40.000 - $90.000',
    capacity: 400,
    attendees: 178,
    image: '/api/placeholder/400/250',
    video: 'https://example.com/danza-contemporanea-reel.mp4',
    organizer: {
      id: '6',
      name: 'Fundación Danza Viva',
      avatar: '/api/placeholder/40/40',
      verified: true,
      rating: 4.7
    },
    socialLinks: {
      instagram: 'https://instagram.com/danzaviva',
      facebook: 'https://facebook.com/fundaciondanzaviva',
      website: 'https://danzaviva.org'
    },
    featured: false,
    likes: 67,
    isLiked: false,
    views: 789,
    createdAt: '2024-01-15T11:30:00Z'
  },
  {
    id: '7',
    title: 'Feria del Libro Independiente: "Letras Libres"',
    description: 'La feria más importante de literatura independiente en Colombia. Más de 80 editoriales independientes, librerías especializadas, autores emergentes y reconocidos. Incluye presentaciones de libros, conversatorios, talleres de escritura creativa, cuentacuentos para niños, café literario y zona de intercambio de libros usados. Un paraíso para los amantes de la lectura y la literatura alternativa.',
    date: '2024-03-10',
    time: '10:00',
    endTime: '20:00',
    location: 'Parque de los Periodistas, Bogotá',
    address: 'Avenida Jiménez con Carrera 4, Bogotá',
    category: 'Literatura',
    tags: ['libros', 'literatura', 'independiente', 'autores', 'lectura'],
    price: 'Gratis',
    capacity: 2000,
    attendees: 456,
    image: '/api/placeholder/400/250',
    video: 'https://example.com/feria-libro-resumen.mp4',
    organizer: {
      id: '7',
      name: 'Colectivo Letras Libres',
      avatar: '/api/placeholder/40/40',
      verified: false,
      rating: 4.5
    },
    socialLinks: {
      instagram: 'https://instagram.com/letraslibrescol',
      facebook: 'https://facebook.com/letraslibres',
      website: 'https://letraslibres.co'
    },
    featured: false,
    likes: 123,
    isLiked: false,
    views: 1567,
    createdAt: '2024-01-20T14:45:00Z'
  },
  {
    id: '8',
    title: 'Masterclass de Cocina Molecular con Chef Internacional',
    description: 'Aprende las técnicas más avanzadas de gastronomía molecular de la mano del Chef Michelin Pierre Dubois. Esta masterclass exclusiva incluye demostración en vivo de técnicas como esferificación, gelificación, nitrógeno líquido y texturas innovadoras. Los participantes podrán practicar las técnicas, degustar creaciones únicas y llevarse un kit de ingredientes especiales. Cupos limitados para una experiencia personalizada.',
    date: '2024-03-15',
    time: '15:00',
    endTime: '19:00',
    location: 'Instituto Culinario de Colombia, Medellín',
    address: 'Carrera 70 # 52-21, Medellín',
    category: 'Educación',
    tags: ['cocina molecular', 'gastronomía', 'chef internacional', 'masterclass', 'técnicas'],
    price: '$250.000',
    capacity: 20,
    attendees: 18,
    image: '/api/placeholder/400/250',
    video: 'https://example.com/cocina-molecular-demo.mp4',
    organizer: {
      id: '8',
      name: 'Instituto Culinario de Colombia',
      avatar: '/api/placeholder/40/40',
      verified: true,
      rating: 4.8
    },
    socialLinks: {
      instagram: 'https://instagram.com/icc_colombia',
      website: 'https://icc.edu.co'
    },
    featured: true,
    likes: 89,
    isLiked: true,
    views: 1234,
    createdAt: '2024-01-25T16:20:00Z'
  }
];

const categories = [
  { name: 'Todos', value: 'all', icon: CalendarDays, count: 32 },
  { name: 'Música', value: 'musica', icon: Music, count: 12 },
  { name: 'Arte', value: 'arte', icon: Palette, count: 8 },
  { name: 'Teatro', value: 'teatro', icon: Theater, count: 6 },
  { name: 'Educación', value: 'educacion', icon: Camera, count: 8 },
  { name: 'Danza', value: 'danza', icon: Users, count: 4 },
  { name: 'Literatura', value: 'literatura', icon: CalendarDays, count: 3 }
];

export function CulturalAgendaSection({ onCreateEvent }: CulturalAgendaSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [events, setEvents] = useState(mockEvents);
  const [showFilters, setShowFilters] = useState(false);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventDetailOpen, setIsEventDetailOpen] = useState(false);

  const handleLike = (eventId: string) => {
    setEvents(prev => 
      prev.map(event => {
        if (event.id === eventId) {
          return {
            ...event,
            isLiked: !event.isLiked,
            likes: event.isLiked ? event.likes - 1 : event.likes + 1
          };
        }
        return event;
      })
    );
  };

  const handleViewEventDetails = (event: any) => {
    // Incrementar contador de vistas
    setEvents(prev => 
      prev.map(e => {
        if (e.id === event.id) {
          return {
            ...e,
            views: e.views + 1
          };
        }
        return e;
      })
    );
    
    setSelectedEvent(event);
    setIsEventDetailOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    return time;
  };

  const getCategoryIcon = (category: string) => {
    const categoryMap: { [key: string]: any } = {
      'Música': Music,
      'Arte': Palette,
      'Teatro': Theater,
      'Educación': Camera,
      'Danza': Users,
      'Literatura': CalendarDays
    };
    const IconComponent = categoryMap[category] || CalendarDays;
    return <IconComponent className="w-4 h-4" />;
  };

  const getCategoryColor = (category: string) => {
    const colorMap: { [key: string]: string } = {
      'Música': 'bg-blue-500/20 text-blue-400 border-blue-400/30',
      'Arte': 'bg-purple-500/20 text-purple-400 border-purple-400/30',
      'Teatro': 'bg-red-500/20 text-red-400 border-red-400/30',
      'Educación': 'bg-green-500/20 text-green-400 border-green-400/30',
      'Danza': 'bg-pink-500/20 text-pink-400 border-pink-400/30',
      'Literatura': 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30'
    };
    return colorMap[category] || 'bg-gray-500/20 text-gray-400 border-gray-400/30';
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || event.category.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEventCreated = (newEvent: any) => {
    setEvents(prev => [newEvent, ...prev]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glass-card border-purple-400/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center">
                <CalendarDays className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <CardTitle className="text-white flex items-center space-x-2">
                  <span>Agenda Cultural</span>
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/30">
                    Nuevo
                  </Badge>
                </CardTitle>
                <p className="text-gray-400 text-sm">
                  Descubre y crea eventos culturales en tu ciudad
                </p>
              </div>
            </div>
            <CyberButton 
              onClick={() => setIsCreateEventOpen(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Crear Evento
            </CyberButton>
          </div>
        </CardHeader>
      </Card>

      {/* Search and Filters */}
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar eventos culturales..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-400"
              />
            </div>
            <CyberButton
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>Filtros</span>
            </CyberButton>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <CyberButton
                  key={category.value}
                  variant={selectedCategory === category.value ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.value)}
                  className={`flex items-center space-x-2 ${
                    selectedCategory === category.value 
                      ? 'bg-purple-500 text-white' 
                      : 'hover:bg-purple-500/20 hover:border-purple-400/50'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{category.name} ({category.count})</span>
                </CyberButton>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="glass-card hover:border-purple-400/50 transition-all duration-300 group overflow-hidden">
            {/* Event Image */}
            <div className="relative h-48 bg-gradient-to-r from-purple-800/50 to-pink-800/50 flex items-center justify-center">
              <CalendarDays className="w-12 h-12 text-purple-300" />
              
              {event.featured && (
                <div className="absolute top-3 left-3">
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <Star className="w-3 h-3 mr-1" />
                    Destacado
                  </Badge>
                </div>
              )}
              
              <div className="absolute top-3 right-3 flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike(event.id);
                  }}
                  className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${
                    event.isLiked 
                      ? 'bg-red-500 text-white animate-pulse' 
                      : 'bg-black/50 text-white hover:bg-red-500'
                  }`}
                >
                  <Heart className={`w-4 h-4 transition-all duration-300 ${event.isLiked ? 'fill-current scale-110' : ''}`} />
                </button>
                <button className="p-2 rounded-full bg-black/50 text-white hover:bg-white/20 transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Date Badge */}
              <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm rounded-lg p-2 text-center">
                <div className="text-xs text-gray-300">
                  {new Date(event.date).toLocaleDateString('es-CO', { month: 'short' }).toUpperCase()}
                </div>
                <div className="text-lg font-bold text-white">
                  {new Date(event.date).getDate()}
                </div>
              </div>
            </div>
            
            <CardContent className="p-4 space-y-3">
              {/* Category and Price */}
              <div className="flex items-center justify-between">
                <Badge className={`flex items-center space-x-1 ${getCategoryColor(event.category)}`}>
                  {getCategoryIcon(event.category)}
                  <span>{event.category}</span>
                </Badge>
                <div className="text-sm font-semibold text-purple-400">
                  {event.price}
                </div>
              </div>

              {/* Title and Description */}
              <div>
                <h3 className="font-semibold text-white mb-1 line-clamp-1">{event.title}</h3>
                <p className="text-sm text-gray-400 line-clamp-2">{event.description}</p>
              </div>

              {/* Event Details */}
              <div className="space-y-2 text-xs text-gray-400">
                <div className="flex items-center space-x-2">
                  <Clock className="w-3 h-3" />
                  <span>{formatTime(event.time)} - {formatTime(event.endTime)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3 h-3" />
                  <span className="line-clamp-1">{event.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-3 h-3" />
                  <span>{event.attendees}/{event.capacity} asistentes</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {event.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs border-gray-600 text-gray-400">
                    #{tag}
                  </Badge>
                ))}
              </div>

              {/* Organizer and Social Links */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <CalendarDays className="w-3 h-3 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-white">{event.organizer.name}</p>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-400">{event.organizer.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  {event.socialLinks.instagram && (
                    <a 
                      href={event.socialLinks.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-1 rounded text-gray-400 hover:text-pink-400 transition-colors"
                    >
                      <Instagram className="w-3 h-3" />
                    </a>
                  )}
                  {event.socialLinks.facebook && (
                    <a 
                      href={event.socialLinks.facebook} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-1 rounded text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      <Facebook className="w-3 h-3" />
                    </a>
                  )}
                  {event.socialLinks.twitter && (
                    <a 
                      href={event.socialLinks.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-1 rounded text-gray-400 hover:text-blue-300 transition-colors"
                    >
                      <Twitter className="w-3 h-3" />
                    </a>
                  )}
                  {event.socialLinks.website && (
                    <a 
                      href={event.socialLinks.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-1 rounded text-gray-400 hover:text-green-400 transition-colors"
                    >
                      <Globe className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-2">
                <CyberButton 
                  size="sm" 
                  onClick={() => handleViewEventDetails(event)}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Ticket className="w-4 h-4 mr-1" />
                  Ver Detalles
                </CyberButton>
                <CyberButton 
                  variant="outline" 
                  size="sm"
                  className="border-purple-400/50 hover:bg-purple-500/20"
                >
                  <Eye className="w-4 h-4" />
                </CyberButton>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-white/10">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center space-x-1">
                    <Eye className="w-3 h-3" />
                    <span>{event.views}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Heart className="w-3 h-3" />
                    <span>{event.likes}</span>
                  </span>
                </div>
                <span>{formatDate(event.date)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredEvents.length === 0 && (
        <Card className="glass-card">
          <CardContent className="text-center py-12">
            <CalendarDays className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              No se encontraron eventos
            </h3>
            <p className="text-gray-400 mb-6">
              No hay eventos que coincidan con tu búsqueda. Intenta con otros términos o crea un nuevo evento.
            </p>
            <CyberButton 
              onClick={() => setIsCreateEventOpen(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Crear Primer Evento
            </CyberButton>
          </CardContent>
        </Card>
      )}

      {/* Create Event Dialog */}
      <CreateEventDialog
        isOpen={isCreateEventOpen}
        onClose={() => setIsCreateEventOpen(false)}
        onEventCreated={handleEventCreated}
      />

      {/* Event Detail Dialog */}
      <EventDetailDialog
        isOpen={isEventDetailOpen}
        onClose={() => setIsEventDetailOpen(false)}
        event={selectedEvent}
      />
    </div>
  );
}