'use client';

import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CyberButton } from '@/components/ui/cyber-button';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Users,
  CheckCircle,
  Star,
  Rocket,
  Target,
  Lightbulb,
  TrendingUp,
  Calendar,
  Globe,
  Mail,
  DollarSign,
  Leaf,
  Heart,
  Building2,
  X,
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  founder: string;
  avatar: string;
  category: string;
  location: string;
  description: string;
  problem: string;
  solution: string;
  fundingGoal: number;
  fundingRaised: number;
  investors: number;
  stage: string;
  impact: string;
  featured: boolean;
  verified: boolean;
  tags: string[];
  createdAt: string;
}

interface ProjectDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onInvest: () => void;
}

export function ProjectDetailDialog({ isOpen, onClose, project, onInvest }: ProjectDetailDialogProps) {
  const router = useRouter();

  if (!project) return null;

  const handleGoToProfile = () => {
    onClose();
    router.push(`/enterprise/${project.id}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const progress = (project.fundingRaised / project.fundingGoal) * 100;

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'Ambiental':
        return <Leaf className="w-5 h-5 text-green-400" />;
      case 'Social':
        return <Heart className="w-5 h-5 text-pink-400" />;
      case 'Educativo':
        return <Lightbulb className="w-5 h-5 text-yellow-400" />;
      case 'Salud':
        return <Heart className="w-5 h-5 text-red-400" />;
      default:
        return <Target className="w-5 h-5 text-blue-400" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header con imagen */}
        <div className="relative h-48 bg-gradient-to-br from-neon-green/20 to-neon-blue/20">
          <div className="absolute inset-0 flex items-center justify-center">
            <Rocket className="w-20 h-20 text-neon-green/30" />
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white"
          >
            <X size={20} />
          </button>
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            {project.featured && (
              <Badge className="bg-neon-green text-black">
                <Star className="w-3 h-3 mr-1" />
                Destacado
              </Badge>
            )}
            {project.verified && (
              <Badge className="bg-blue-500 text-white">
                <CheckCircle className="w-3 h-3 mr-1" />
                Verificado
              </Badge>
            )}
          </div>

          {/* Avatar y nombre */}
          <div className="absolute -bottom-12 left-6 flex items-end gap-4">
            <img
              src={project.avatar}
              alt={project.founder}
              onClick={handleGoToProfile}
              className="w-24 h-24 rounded-2xl ring-4 ring-gray-900 object-cover cursor-pointer hover:ring-neon-green/50 transition-all hover:scale-105"
            />
          </div>
        </div>

        <div className="p-6 pt-16">
          {/* Info principal */}
          <div className="mb-6">
            <h2 
              onClick={handleGoToProfile}
              className="text-2xl font-bold text-white mb-1 cursor-pointer hover:text-neon-green transition-colors inline-flex items-center gap-2"
            >
              {project.name}
              {project.verified && <CheckCircle className="w-5 h-5 text-blue-400" />}
            </h2>
            <p className="text-gray-400">por {project.founder}</p>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <Badge variant="outline" className="text-neon-green border-neon-green/50">
                <Rocket className="w-3 h-3 mr-1" />
                {project.stage}
              </Badge>
              <Badge variant="outline" className="text-gray-300 border-white/20">
                {project.category}
              </Badge>
              <span className="flex items-center text-sm text-gray-400">
                {getImpactIcon(project.impact)}
                <span className="ml-1">Impacto {project.impact}</span>
              </span>
            </div>
          </div>

          {/* Barra de progreso */}
          <div className="glass-card p-4 rounded-xl mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-neon-green font-bold text-lg">
                {formatCurrency(project.fundingRaised)}
              </span>
              <span className="text-gray-400">
                Meta: {formatCurrency(project.fundingGoal)}
              </span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-to-r from-neon-green to-neon-blue rounded-full"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400 flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {project.investors} inversionistas
              </span>
              <span className="text-neon-green font-semibold">
                {progress.toFixed(0)}% financiado
              </span>
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
                <Building2 className="w-5 h-5 mr-2 text-neon-green" />
                Sobre el Proyecto
              </h3>
              <p className="text-gray-300 leading-relaxed">{project.description}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
                <Target className="w-5 h-5 mr-2 text-red-400" />
                El Problema
              </h3>
              <p className="text-gray-300 leading-relaxed">{project.problem}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-yellow-400" />
                Nuestra Solución
              </h3>
              <p className="text-gray-300 leading-relaxed">{project.solution}</p>
            </div>

            {/* Tags */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Etiquetas</h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-gray-300 border-white/20">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Info adicional */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-4 rounded-xl">
                <div className="flex items-center text-gray-400 mb-1">
                  <MapPin className="w-4 h-4 mr-2" />
                  Ubicación
                </div>
                <p className="text-white font-medium">{project.location}</p>
              </div>
              <div className="glass-card p-4 rounded-xl">
                <div className="flex items-center text-gray-400 mb-1">
                  <Calendar className="w-4 h-4 mr-2" />
                  Publicado
                </div>
                <p className="text-white font-medium">{formatDate(project.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-white/10">
            <CyberButton variant="outline" className="flex-1">
              <Mail className="w-4 h-4 mr-2" />
              Contactar
            </CyberButton>
            <CyberButton className="flex-1" onClick={onInvest}>
              <DollarSign className="w-4 h-4 mr-2" />
              Invertir Ahora
            </CyberButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
