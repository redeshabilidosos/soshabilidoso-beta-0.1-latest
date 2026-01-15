'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CyberButton } from '@/components/ui/cyber-button';
import { Input } from '@/components/ui/input';
import { InvestmentDialog } from './investment-dialog';
import { ProjectDetailDialog } from './project-detail-dialog';
import {
  Search,
  MapPin,
  Target,
  TrendingUp,
  Rocket,
  Users,
  Star,
  Plus,
  Lightbulb,
  DollarSign,
  Building2,
  Handshake,
  Leaf,
  Heart,
  ChevronRight,
} from 'lucide-react';

// Mock data de proyectos/empresas buscando inversión
const mockProjects = [
  {
    id: '1',
    name: 'EcoTech Solutions',
    founder: 'María García',
    avatar: 'https://ui-avatars.com/api/?name=Maria+Garcia&background=00ff88&color=fff',
    category: 'Tecnología Verde',
    location: 'Bogotá, Colombia',
    description: 'Plataforma de reciclaje inteligente que conecta hogares con centros de acopio, promoviendo la economía circular en comunidades de bajos recursos.',
    problem: 'El 70% de los residuos reciclables terminan en rellenos sanitarios por falta de acceso a puntos de reciclaje.',
    solution: 'App móvil que geolocaliza puntos de reciclaje y recompensa a usuarios con descuentos en comercios locales.',
    fundingGoal: 50000000,
    fundingRaised: 18500000,
    investors: 12,
    stage: 'Semilla',
    impact: 'Ambiental',
    featured: true,
    verified: true,
    tags: ['Sostenibilidad', 'App Móvil', 'Economía Circular'],
    createdAt: '2024-12-10',
  },
  {
    id: '2',
    name: 'AgroConecta',
    founder: 'Carlos Mendoza',
    avatar: 'https://ui-avatars.com/api/?name=Carlos+Mendoza&background=00ff88&color=fff',
    category: 'Agro',
    location: 'Medellín, Colombia',
    description: 'Marketplace que conecta pequeños agricultores directamente con consumidores, eliminando intermediarios y mejorando ingresos rurales.',
    problem: 'Los pequeños agricultores pierden hasta el 60% de sus ganancias por intermediarios.',
    solution: 'Plataforma digital de venta directa con logística colaborativa entre comunidades.',
    fundingGoal: 80000000,
    fundingRaised: 45000000,
    investors: 28,
    stage: 'Pre-Serie A',
    impact: 'Social',
    featured: true,
    verified: true,
    tags: ['Agricultura', 'Marketplace', 'Impacto Social'],
    createdAt: '2024-11-25',
  },
  {
    id: '3',
    name: 'EduAccess',
    founder: 'Ana Rodríguez',
    avatar: 'https://ui-avatars.com/api/?name=Ana+Rodriguez&background=00ff88&color=fff',
    category: 'Educación',
    location: 'Cali, Colombia',
    description: 'Plataforma de educación técnica gratuita para jóvenes de estratos 1 y 2, con certificaciones reconocidas por empresas.',
    problem: 'Solo el 20% de jóvenes de bajos recursos accede a educación técnica de calidad.',
    solution: 'Cursos online gratuitos con mentorías y conexión directa con empleadores.',
    fundingGoal: 35000000,
    fundingRaised: 12000000,
    investors: 8,
    stage: 'Idea',
    impact: 'Educativo',
    featured: false,
    verified: false,
    tags: ['Educación', 'Inclusión', 'Empleo'],
    createdAt: '2024-12-15',
  },
  {
    id: '4',
    name: 'SaludComunitaria',
    founder: 'Pedro López',
    avatar: 'https://ui-avatars.com/api/?name=Pedro+Lopez&background=00ff88&color=fff',
    category: 'Salud',
    location: 'Barranquilla, Colombia',
    description: 'Red de telemedicina para zonas rurales con brigadas de salud móviles y seguimiento digital de pacientes.',
    problem: 'El 40% de la población rural no tiene acceso a servicios de salud básicos.',
    solution: 'Consultas virtuales + brigadas presenciales con equipos médicos portátiles.',
    fundingGoal: 120000000,
    fundingRaised: 35000000,
    investors: 15,
    stage: 'Semilla',
    impact: 'Salud',
    featured: false,
    verified: true,
    tags: ['Telemedicina', 'Salud Rural', 'Impacto Social'],
    createdAt: '2024-12-05',
  },
];

const categories = ['Todos', 'Tecnología Verde', 'Agro', 'Educación', 'Salud', 'Fintech', 'Social'];
const stages = ['Todos', 'Idea', 'Semilla', 'Pre-Serie A', 'Serie A'];

interface EnterprisesSectionProps {
  onCreateProject?: () => void;
}

export function EnterprisesSection({ onCreateProject }: EnterprisesSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedStage, setSelectedStage] = useState('Todos');
  const [selectedProject, setSelectedProject] = useState<typeof mockProjects[0] | null>(null);
  const [isInvestDialogOpen, setIsInvestDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      notation: 'compact',
    }).format(amount);
  };

  const getProgress = (raised: number, goal: number) => {
    return Math.min(100, (raised / goal) * 100);
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'Ambiental':
        return <Leaf className="w-4 h-4 text-green-400" />;
      case 'Social':
        return <Heart className="w-4 h-4 text-pink-400" />;
      case 'Educativo':
        return <Lightbulb className="w-4 h-4 text-yellow-400" />;
      case 'Salud':
        return <Heart className="w-4 h-4 text-red-400" />;
      default:
        return <Target className="w-4 h-4 text-blue-400" />;
    }
  };

  const handleViewDetails = (project: typeof mockProjects[0]) => {
    setSelectedProject(project);
    setIsDetailDialogOpen(true);
  };

  const handleInvest = (project: typeof mockProjects[0]) => {
    setSelectedProject(project);
    setIsInvestDialogOpen(true);
  };

  const handleInvestFromDetail = () => {
    setIsDetailDialogOpen(false);
    setIsInvestDialogOpen(true);
  };

  const filteredProjects = mockProjects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || project.category === selectedCategory;
    const matchesStage = selectedStage === 'Todos' || project.stage === selectedStage;
    return matchesSearch && matchesCategory && matchesStage;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Rocket className="text-neon-green" />
              Empresas & Proyectos
            </h2>
            <p className="text-gray-400 mt-1">
              Impulsa el desarrollo sostenible apoyando emprendedores de la comunidad
            </p>
          </div>
          <CyberButton onClick={onCreateProject} className="flex items-center gap-2">
            <Plus size={18} />
            Publicar Proyecto
          </CyberButton>
        </div>

        {/* Info banner */}
        <div className="bg-gradient-to-r from-neon-green/10 to-neon-blue/10 border border-neon-green/20 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Handshake className="w-6 h-6 text-neon-green flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-white font-semibold mb-1">¿Tienes una idea o proyecto?</h3>
              <p className="text-gray-400 text-sm">
                Conecta con inversionistas de la comunidad SOS-HABILIDOSO. Apoyamos proyectos que generen 
                impacto social, ambiental y económico en comunidades de bajos recursos.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar proyectos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="text-gray-400 text-sm self-center mr-2">Etapa:</span>
              {stages.map((stage) => (
                <CyberButton
                  key={stage}
                  variant={selectedStage === stage ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedStage(stage)}
                  className={selectedStage === stage ? 'bg-neon-green text-black' : ''}
                >
                  {stage}
                </CyberButton>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid de proyectos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <Card
            key={project.id}
            className="glass-card hover:border-neon-green/30 transition-all overflow-hidden group"
          >
            <CardContent className="p-0">
              {/* Header del proyecto */}
              <div className="p-5 border-b border-white/10">
                <div className="flex items-start gap-4">
                  <img
                    src={project.avatar}
                    alt={project.founder}
                    className="w-14 h-14 rounded-xl object-cover ring-2 ring-neon-green/30"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          {project.name}
                          {project.verified && (
                            <Badge className="bg-blue-500 text-white text-xs">Verificado</Badge>
                          )}
                        </h3>
                        <p className="text-gray-400 text-sm">por {project.founder}</p>
                      </div>
                      {project.featured && (
                        <Badge className="bg-neon-green text-black flex-shrink-0">
                          <Star className="w-3 h-3 mr-1" />
                          Destacado
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {project.location}
                      </span>
                      <span className="flex items-center gap-1">
                        {getImpactIcon(project.impact)}
                        {project.impact}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contenido */}
              <div className="p-5">
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">{project.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="text-neon-green border-neon-green/30">
                    {project.category}
                  </Badge>
                  <Badge variant="outline" className="text-gray-300 border-white/20">
                    {project.stage}
                  </Badge>
                  {project.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-gray-400 border-white/10">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Barra de progreso */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-neon-green font-semibold">
                      {formatCurrency(project.fundingRaised)}
                    </span>
                    <span className="text-gray-400">
                      Meta: {formatCurrency(project.fundingGoal)}
                    </span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-neon-green to-neon-blue rounded-full transition-all"
                      style={{ width: `${getProgress(project.fundingRaised, project.fundingGoal)}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {project.investors} inversionistas
                    </span>
                    <span>{getProgress(project.fundingRaised, project.fundingGoal).toFixed(0)}% financiado</span>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex gap-3">
                  <CyberButton 
                    className="flex-1" 
                    variant="outline"
                    onClick={() => handleViewDetails(project)}
                  >
                    Ver Detalles
                  </CyberButton>
                  <CyberButton 
                    className="flex-1"
                    onClick={() => handleInvest(project)}
                  >
                    <DollarSign className="w-4 h-4 mr-1" />
                    Invertir
                  </CyberButton>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <Rocket className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">No se encontraron proyectos</h3>
          <p className="text-gray-400">Intenta con otros filtros o sé el primero en publicar tu idea</p>
        </div>
      )}

      {/* Dialogs */}
      <InvestmentDialog
        isOpen={isInvestDialogOpen}
        onClose={() => setIsInvestDialogOpen(false)}
        project={selectedProject}
      />

      <ProjectDetailDialog
        isOpen={isDetailDialogOpen}
        onClose={() => setIsDetailDialogOpen(false)}
        project={selectedProject}
        onInvest={handleInvestFromDetail}
      />
    </div>
  );
}
