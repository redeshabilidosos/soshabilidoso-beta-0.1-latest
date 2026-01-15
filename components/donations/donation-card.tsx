'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CyberButton } from '@/components/ui/cyber-button';
import { MediaSlider } from './media-slider';
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
} from 'lucide-react';

interface Athlete {
  id: string;
  name: string;
  username: string;
  age: number;
  height: string;
  sport: string;
  position: string;
  city: string;
  description: string;
  goal: number;
  raised: number;
  donors: number;
  media: { type: string; url: string; thumbnail: string }[];
  avatar: string;
  verified: boolean;
  featured: boolean;
}

interface DonationCardProps {
  athlete: Athlete;
}

export function DonationCard({ athlete }: DonationCardProps) {
  const [isDonationDialogOpen, setIsDonationDialogOpen] = useState(false);
  const router = useRouter();

  const progress = (athlete.raised / athlete.goal) * 100;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleCardClick = () => {
    router.push(`/donations/${athlete.id}`);
  };

  const handleDonateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDonationDialogOpen(true);
  };

  return (
    <>
      <Card 
        className="glass-card overflow-hidden hover:border-neon-green/40 transition-all duration-300 group cursor-pointer"
        onClick={handleCardClick}
      >
        {/* Media Slider */}
        <div className="relative">
          <MediaSlider media={athlete.media} />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
            {athlete.featured && (
              <Badge className="bg-neon-green text-black font-semibold">
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
        </div>

        <CardContent className="p-5">
          {/* Header con avatar y nombre */}
          <div className="flex items-start space-x-4 mb-4">
            <img
              src={athlete.avatar}
              alt={athlete.name}
              className="w-14 h-14 rounded-full ring-2 ring-neon-green/50 object-cover"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-white truncate">{athlete.name}</h3>
              <p className="text-gray-400 text-sm">@{athlete.username}</p>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline" className="text-neon-green border-neon-green/50">
                  <Trophy className="w-3 h-3 mr-1" />
                  {athlete.sport}
                </Badge>
                <span className="text-gray-400 text-sm">{athlete.position}</span>
              </div>
            </div>
          </div>

          {/* Info del deportista */}
          <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-white/5 rounded-xl">
            <div className="text-center">
              <div className="flex items-center justify-center text-gray-400 mb-1">
                <Calendar className="w-4 h-4 mr-1" />
              </div>
              <p className="text-white font-semibold">{athlete.age} años</p>
              <p className="text-gray-500 text-xs">Edad</p>
            </div>
            <div className="text-center border-x border-white/10">
              <div className="flex items-center justify-center text-gray-400 mb-1">
                <Ruler className="w-4 h-4 mr-1" />
              </div>
              <p className="text-white font-semibold">{athlete.height}</p>
              <p className="text-gray-500 text-xs">Altura</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center text-gray-400 mb-1">
                <MapPin className="w-4 h-4 mr-1" />
              </div>
              <p className="text-white font-semibold text-sm truncate">{athlete.city.split(',')[0]}</p>
              <p className="text-gray-500 text-xs">Ciudad</p>
            </div>
          </div>

          {/* Descripción */}
          <p className="text-gray-300 text-sm mb-4 line-clamp-3">{athlete.description}</p>

          {/* Barra de progreso */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-neon-green font-semibold">
                {formatCurrency(athlete.raised)}
              </span>
              <span className="text-gray-400">
                Meta: {formatCurrency(athlete.goal)}
              </span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-neon-green to-neon-blue rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-400 text-xs flex items-center">
                <Users className="w-3 h-3 mr-1" />
                {athlete.donors} donantes
              </span>
              <span className="text-neon-green text-sm font-semibold">
                {progress.toFixed(0)}% completado
              </span>
            </div>
          </div>

          {/* Botón de donar */}
          <CyberButton
            className="w-full"
            size="lg"
            onClick={handleDonateClick}
          >
            <Heart className="w-5 h-5 mr-2" />
            Donar Ahora
          </CyberButton>
        </CardContent>
      </Card>

      <DonationDialog
        isOpen={isDonationDialogOpen}
        onClose={() => setIsDonationDialogOpen(false)}
        athlete={athlete}
      />
    </>
  );
}
