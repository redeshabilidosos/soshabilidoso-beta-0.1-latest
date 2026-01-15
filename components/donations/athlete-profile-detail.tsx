'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CyberButton } from '@/components/ui/cyber-button';
import { MediaSlider } from './media-slider';
import { MediaGallery } from './media-gallery';
import { DonationDialog } from './donation-dialog';
import {
  MapPin,
  Calendar,
  Ruler,
  Trophy,
  Users,
  Heart,
  CheckCircle,
  Star,
  Target,
  Clock,
  Award,
  Share2,
  Images,
} from 'lucide-react';
import { toast } from 'sonner';

interface Athlete {
  id: string;
  name: string;
  username: string;
  age: number;
  height: string;
  weight?: string;
  sport: string;
  position: string;
  team: string;
  city: string;
  experienceYears: number;
  achievements: string;
  description: string;
  goalDescription: string;
  goal: number;
  raised: number;
  donors: number;
  media: { type: string; url: string; thumbnail: string }[];
  avatar: string;
  verified: boolean;
  featured: boolean;
  createdAt: string;
}

interface AthleteProfileDetailProps {
  athlete: Athlete;
}

export function AthleteProfileDetail({ athlete }: AthleteProfileDetailProps) {
  const [isDonationDialogOpen, setIsDonationDialogOpen] = useState(false);

  const progress = (athlete.raised / athlete.goal) * 100;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleShare = async () => {
    const url = window.location.href;
    const text = `Apoya a ${athlete.name} en su carrera deportiva - ${athlete.sport}`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title: athlete.name, text, url });
      } catch (err) {
        // Usuario canceló
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Enlace copiado al portapapeles');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con avatar y nombre */}
      <Card className="glass-card overflow-hidden">
        <div className="relative">
          {/* Media Slider grande */}
          <div className="h-72 md:h-96">
            <MediaSlider media={athlete.media} />
          </div>
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
            {athlete.featured && (
              <Badge className="bg-neon-green text-black font-semibold px-3 py-1">
                <Star className="w-4 h-4 mr-1" />
                Destacado
              </Badge>
            )}
            {athlete.verified && (
              <Badge className="bg-blue-500 text-white px-3 py-1">
                <CheckCircle className="w-4 h-4 mr-1" />
                Verificado
              </Badge>
            )}
          </div>

          {/* Botón compartir */}
          <button
            onClick={handleShare}
            className="absolute top-4 right-4 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors z-10"
          >
            <Share2 size={20} />
          </button>
        </div>

        <CardContent className="p-6">
          {/* Info principal */}
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {/* Avatar */}
            <img
              src={athlete.avatar}
              alt={athlete.name}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full ring-4 ring-neon-green/50 object-cover mx-auto md:mx-0 -mt-16 md:-mt-20 relative z-10 bg-gray-900"
            />
            
            {/* Nombre y detalles */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-white mb-1">{athlete.name}</h1>
              <p className="text-gray-400 mb-3">@{athlete.username}</p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <Badge variant="outline" className="text-neon-green border-neon-green/50 px-3 py-1">
                  <Trophy className="w-4 h-4 mr-1" />
                  {athlete.sport}
                </Badge>
                <span className="text-gray-300">{athlete.position}</span>
                {athlete.team && (
                  <span className="text-gray-400">• {athlete.team}</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid de información */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass-card p-4 text-center">
          <Calendar className="w-6 h-6 text-neon-green mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{athlete.age}</p>
          <p className="text-gray-400 text-sm">Años</p>
        </Card>
        
        <Card className="glass-card p-4 text-center">
          <Ruler className="w-6 h-6 text-neon-blue mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{athlete.height}</p>
          <p className="text-gray-400 text-sm">Altura</p>
        </Card>
        
        <Card className="glass-card p-4 text-center">
          <MapPin className="w-6 h-6 text-neon-green mx-auto mb-2" />
          <p className="text-lg font-bold text-white truncate">{athlete.city.split(',')[0]}</p>
          <p className="text-gray-400 text-sm">Ciudad</p>
        </Card>
        
        <Card className="glass-card p-4 text-center">
          <Clock className="w-6 h-6 text-neon-blue mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{athlete.experienceYears}</p>
          <p className="text-gray-400 text-sm">Años exp.</p>
        </Card>
      </div>

      {/* Descripción y Galería - Sobre mí */}
      <Card className="glass-card">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-neon-green" />
            Sobre mí
          </h2>
          <p className="text-gray-300 leading-relaxed mb-6">{athlete.description}</p>
          
          {/* Galería de fotos y videos */}
          {athlete.media && athlete.media.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Images className="w-5 h-5 mr-2 text-neon-blue" />
                Galería
              </h3>
              <MediaGallery media={athlete.media} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Logros */}
      <Card className="glass-card">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-neon-green" />
            Logros deportivos
          </h2>
          <div className="flex flex-wrap gap-2">
            {athlete.achievements.split(',').map((achievement, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-gray-300 border-white/20 px-3 py-1"
              >
                🏆 {achievement.trim()}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Meta de recaudación */}
      <Card className="glass-card border-2 border-neon-green/30">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-neon-green" />
            ¿Para qué necesito el apoyo?
          </h2>
          <p className="text-gray-300 leading-relaxed mb-6">{athlete.goalDescription}</p>

          {/* Barra de progreso */}
          <div className="mb-6">
            <div className="flex justify-between text-lg mb-3">
              <span className="text-neon-green font-bold">
                {formatCurrency(athlete.raised)}
              </span>
              <span className="text-gray-400">
                Meta: {formatCurrency(athlete.goal)}
              </span>
            </div>
            <div className="h-4 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-neon-green to-neon-blue rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <div className="flex justify-between items-center mt-3">
              <span className="text-gray-400 flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {athlete.donors} donantes
              </span>
              <span className="text-neon-green font-bold text-lg">
                {progress.toFixed(0)}% completado
              </span>
            </div>
          </div>

          {/* Botón de donar */}
          <CyberButton
            className="w-full text-lg py-4"
            size="lg"
            onClick={() => setIsDonationDialogOpen(true)}
          >
            <Heart className="w-6 h-6 mr-2" />
            Donar Ahora
          </CyberButton>
        </CardContent>
      </Card>

      {/* Dialog de donación */}
      <DonationDialog
        isOpen={isDonationDialogOpen}
        onClose={() => setIsDonationDialogOpen(false)}
        athlete={{
          ...athlete,
          media: athlete.media,
        }}
      />
    </div>
  );
}
