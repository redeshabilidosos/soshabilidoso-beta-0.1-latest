'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
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
    <div className="space-y-4 md:space-y-6">
      {/* Header con portada y perfil - Mejorado */}
      <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-800 overflow-hidden">
        <div className="relative">
          {/* Media Slider como portada - Altura reducida */}
          <div className="h-48 md:h-64 relative">
            <MediaSlider media={athlete.media} />
            
            {/* Overlay gradient para mejor legibilidad */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-900/90" />
          </div>
          
          {/* Badges - Posicionados mejor */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
            {athlete.featured && (
              <Badge className="bg-primary text-primary-foreground font-semibold">
                <Star className="w-3 h-3 mr-1" />
                Destacado
              </Badge>
            )}
            {athlete.verified && (
              <Badge className="bg-blue-500 text-white">
                <CheckCircle className="w-3 h-3 mr-1" />
                Verificado
              </Badge>
            )}
          </div>

          {/* Botón compartir - Ajustado para no desbordar */}
          <Button
            onClick={handleShare}
            size="icon"
            variant="secondary"
            className="absolute top-3 right-3 z-10 bg-black/60 hover:bg-black/80 backdrop-blur-sm"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>

        <CardContent className="p-4 md:p-6">
          {/* Info principal con avatar - Espaciado reducido */}
          <div className="flex flex-col md:flex-row md:items-start gap-4 -mt-12 md:-mt-16">
            {/* Avatar con Shadcn UI - Mejor posicionado */}
            <Avatar className="w-24 h-24 md:w-28 md:h-28 ring-4 ring-primary/50 mx-auto md:mx-0 relative z-10 bg-gray-900">
              <AvatarImage src={athlete.avatar} alt={athlete.name} />
              <AvatarFallback className="text-2xl bg-gradient-to-br from-primary to-purple-600">
                {athlete.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            {/* Nombre y detalles - Mejor espaciado */}
            <div className="flex-1 text-center md:text-left md:pt-8">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">{athlete.name}</h1>
              <p className="text-muted-foreground mb-3">@{athlete.username}</p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <Badge variant="outline" className="text-primary border-primary/50">
                  <Trophy className="w-3 h-3 mr-1" />
                  {athlete.sport}
                </Badge>
                <span className="text-sm text-gray-300">{athlete.position}</span>
                {athlete.team && (
                  <span className="text-sm text-muted-foreground">• {athlete.team}</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid de información - Con Shadcn UI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-800">
          <CardContent className="p-4 text-center">
            <Calendar className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="text-xl md:text-2xl font-bold text-white">{athlete.age}</p>
            <p className="text-muted-foreground text-xs md:text-sm">Años</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-800">
          <CardContent className="p-4 text-center">
            <Ruler className="w-5 h-5 text-blue-400 mx-auto mb-2" />
            <p className="text-xl md:text-2xl font-bold text-white">{athlete.height}</p>
            <p className="text-muted-foreground text-xs md:text-sm">Altura</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-800">
          <CardContent className="p-4 text-center">
            <MapPin className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="text-base md:text-lg font-bold text-white truncate">{athlete.city.split(',')[0]}</p>
            <p className="text-muted-foreground text-xs md:text-sm">Ciudad</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-800">
          <CardContent className="p-4 text-center">
            <Clock className="w-5 h-5 text-blue-400 mx-auto mb-2" />
            <p className="text-xl md:text-2xl font-bold text-white">{athlete.experienceYears}</p>
            <p className="text-muted-foreground text-xs md:text-sm">Años exp.</p>
          </CardContent>
        </Card>
      </div>

      {/* Descripción y Galería - Con Shadcn UI */}
      <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Sobre mí
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-300 leading-relaxed">{athlete.description}</p>
          
          {/* Galería de fotos y videos */}
          {athlete.media && athlete.media.length > 0 && (
            <>
              <Separator className="bg-gray-800" />
              <div>
                <h3 className="text-base md:text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Images className="w-4 h-4 text-blue-400" />
                  Galería
                </h3>
                <MediaGallery media={athlete.media} />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Logros - Con Shadcn UI */}
      <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Logros deportivos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {athlete.achievements.split(',').map((achievement, index) => (
              <Badge 
                key={index} 
                variant="secondary"
                className="bg-gray-800/80 text-gray-300 border-gray-700"
              >
                🏆 {achievement.trim()}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Meta de recaudación - Con Shadcn UI */}
      <Card className="bg-gray-900/80 backdrop-blur-xl border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            ¿Para qué necesito el apoyo?
          </CardTitle>
          <CardDescription className="text-gray-300">
            {athlete.goalDescription}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Barra de progreso */}
          <div>
            <div className="flex justify-between text-sm md:text-base mb-2">
              <span className="text-primary font-bold">
                {formatCurrency(athlete.raised)}
              </span>
              <span className="text-muted-foreground">
                Meta: {formatCurrency(athlete.goal)}
              </span>
            </div>
            <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs md:text-sm text-muted-foreground flex items-center gap-1">
                <Users className="w-3 h-3" />
                {athlete.donors} donantes
              </span>
              <span className="text-primary font-bold text-sm md:text-base">
                {progress.toFixed(0)}% completado
              </span>
            </div>
          </div>

          {/* Botón de donar - Con Shadcn UI */}
          <Button
            className="w-full text-base md:text-lg py-5 md:py-6 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
            size="lg"
            onClick={() => setIsDonationDialogOpen(true)}
          >
            <Heart className="w-5 h-5 mr-2" />
            Donar Ahora
          </Button>
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
