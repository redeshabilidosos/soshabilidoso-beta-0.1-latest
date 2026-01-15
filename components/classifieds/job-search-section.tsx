'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CyberButton } from '@/components/ui/cyber-button';
import { Input } from '@/components/ui/input';
import {
  Search,
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  GraduationCap,
  Building2,
  Users,
  Star,
  Filter,
  Plus,
  CheckCircle,
} from 'lucide-react';

// Mock data de ofertas de trabajo
const mockJobs = [
  {
    id: '1',
    title: 'Desarrollador Frontend React',
    company: 'TechCorp Colombia',
    location: 'Bogotá, Colombia',
    type: 'Tiempo Completo',
    modality: 'Remoto',
    salary: { min: 4000000, max: 6000000 },
    description: 'Buscamos desarrollador con experiencia en React, TypeScript y Next.js para unirse a nuestro equipo.',
    requirements: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
    experience: '2-3 años',
    postedAt: '2024-12-18',
    applicants: 23,
    featured: true,
    urgent: false,
  },
  {
    id: '2',
    title: 'Diseñador Gráfico',
    company: 'Agencia Creativa',
    location: 'Medellín, Colombia',
    type: 'Freelance',
    modality: 'Híbrido',
    salary: { min: 2500000, max: 4000000 },
    description: 'Necesitamos diseñador creativo para proyectos de branding y marketing digital.',
    requirements: ['Photoshop', 'Illustrator', 'Figma', 'Creatividad'],
    experience: '1-2 años',
    postedAt: '2024-12-19',
    applicants: 15,
    featured: false,
    urgent: true,
  },
  {
    id: '3',
    title: 'Community Manager',
    company: 'StartUp Digital',
    location: 'Cali, Colombia',
    type: 'Medio Tiempo',
    modality: 'Presencial',
    salary: { min: 1500000, max: 2500000 },
    description: 'Gestión de redes sociales y creación de contenido para marca de tecnología.',
    requirements: ['Redes Sociales', 'Copywriting', 'Canva', 'Analítica'],
    experience: '1 año',
    postedAt: '2024-12-20',
    applicants: 8,
    featured: false,
    urgent: false,
  },
];

const jobCategories = [
  'Todos',
  'Tecnología',
  'Diseño',
  'Marketing',
  'Ventas',
  'Administración',
  'Educación',
  'Salud',
];

const modalityOptions = ['Todos', 'Remoto', 'Presencial', 'Híbrido'];

interface JobSearchSectionProps {
  onCreateJob?: () => void;
}

export function JobSearchSection({ onCreateJob }: JobSearchSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedModality, setSelectedModality] = useState('Todos');

  const formatSalary = (min: number, max: number) => {
    const formatNum = (n: number) =>
      new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);
    return `${formatNum(min)} - ${formatNum(max)}`;
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffInDays === 0) return 'Hoy';
    if (diffInDays === 1) return 'Ayer';
    return `Hace ${diffInDays} días`;
  };

  const filteredJobs = mockJobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesModality = selectedModality === 'Todos' || job.modality === selectedModality;
    return matchesSearch && matchesModality;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Briefcase className="text-neon-green" />
            Busco Trabajo
          </h2>
          <p className="text-gray-400 text-sm">
            Encuentra oportunidades laborales en la comunidad
          </p>
        </div>
        <CyberButton onClick={onCreateJob} className="flex items-center gap-2">
          <Plus size={18} />
          Publicar Oferta
        </CyberButton>
      </div>

      {/* Filtros */}
      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por cargo o empresa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {modalityOptions.map((modality) => (
                <CyberButton
                  key={modality}
                  variant={selectedModality === modality ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedModality(modality)}
                  className={selectedModality === modality ? 'bg-neon-green text-black' : ''}
                >
                  {modality}
                </CyberButton>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de trabajos */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <Card
            key={job.id}
            className="glass-card hover:border-neon-green/30 transition-all cursor-pointer"
          >
            <CardContent className="p-5">
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                {/* Logo empresa */}
                <div className="w-14 h-14 bg-gradient-to-br from-neon-green/20 to-neon-blue/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-7 h-7 text-neon-green" />
                </div>

                {/* Info principal */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{job.title}</h3>
                      <p className="text-gray-400">{job.company}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {job.featured && (
                        <Badge className="bg-neon-green text-black">
                          <Star className="w-3 h-3 mr-1" />
                          Destacado
                        </Badge>
                      )}
                      {job.urgent && (
                        <Badge className="bg-red-500 text-white">Urgente</Badge>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm mb-3 line-clamp-2">{job.description}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {job.requirements.slice(0, 4).map((req) => (
                      <Badge key={req} variant="outline" className="text-gray-300 border-white/20">
                        {req}
                      </Badge>
                    ))}
                  </div>

                  {/* Info adicional */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {job.type}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {formatSalary(job.salary.min, job.salary.max)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {job.applicants} aplicantes
                    </span>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex flex-col gap-2 md:items-end">
                  <span className="text-xs text-gray-500">{getTimeAgo(job.postedAt)}</span>
                  <CyberButton size="sm">Aplicar</CyberButton>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-12">
          <Briefcase className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">No se encontraron ofertas</h3>
          <p className="text-gray-400">Intenta con otros filtros o términos de búsqueda</p>
        </div>
      )}
    </div>
  );
}
