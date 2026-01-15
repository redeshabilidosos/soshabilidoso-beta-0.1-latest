'use client';

import React from 'react';
import Image from 'next/image';
import { Classified } from '@/types/user';
import { CyberButton } from './cyber-button';
import { Briefcase, DollarSign, HelpCircle, MapPin, Mail, Phone, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ClassifiedCardProps {
  classified: Classified;
  onContact: (classified: Classified) => void;
  onViewDetails: (classified: Classified) => void; // Nuevo prop
}

export function ClassifiedCard({ classified, onContact, onViewDetails }: ClassifiedCardProps) {
  const getIconForType = (type: Classified['type']) => {
    switch (type) {
      case 'job': return <Briefcase size={18} className="text-neon-green" />;
      case 'sale': return <DollarSign size={18} className="text-yellow-400" />;
      case 'help': return <HelpCircle size={18} className="text-neon-blue" />;
      case 'event': return <CalendarDays size={18} className="text-purple-400" />;
      default: return <Briefcase size={18} className="text-gray-400" />;
    }
  };

  const formatPrice = (price: number | undefined) => {
    if (price === undefined) return '';
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Hace unos minutos';
    if (diffInHours < 24) return `Hace ${diffInHours}h`;
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="glass-card p-4 flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4 border border-white/10 hover:border-neon-green/30 transition-all duration-300">
      {classified.imageUrl && (
        <div className="relative w-full sm:w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
          <Image
            src={classified.imageUrl}
            alt={classified.title}
            fill
            style={{ objectFit: 'cover' }}
            className="group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2">
            <span className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded-full">
              {classified.type.charAt(0).toUpperCase() + classified.type.slice(1)}
            </span>
          </div>
        </div>
      )}

      <div className="flex-1 text-left">
        <div className="flex items-center space-x-2 mb-1">
          {getIconForType(classified.type)}
          <h3 className="text-xl font-semibold text-white">{classified.title}</h3>
        </div>
        <p className="text-gray-400 text-sm line-clamp-2 mb-2">{classified.description}</p>
        
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-400 mb-2">
          {classified.category && (
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-neon-blue rounded-full"></span>
              <span>{classified.category}</span>
            </span>
          )}
          {classified.location && (
            <span className="flex items-center space-x-1">
              <MapPin size={14} />
              <span>{classified.location}</span>
            </span>
          )}
          {classified.price !== undefined && (
            <span className="flex items-center space-x-1 font-bold text-yellow-400">
              <DollarSign size={14} />
              <span>{formatPrice(classified.price)}</span>
            </span>
          )}
          <span className="text-gray-500 text-xs">{formatTimeAgo(classified.createdAt)} por {classified.user.displayName}</span>
        </div>
      </div>

      <div className="flex flex-col space-y-2 sm:ml-auto w-full sm:w-auto">
        <CyberButton
          size="sm"
          onClick={() => onContact(classified)}
          className="flex items-center justify-center space-x-2"
        >
          <Mail size={16} />
          <span>Contactar</span>
        </CyberButton>
        <CyberButton 
          size="sm" 
          variant="ghost" 
          className="flex items-center justify-center space-x-2"
          onClick={() => onViewDetails(classified)} // Abre el diálogo de detalles
        >
          <Phone size={16} />
          <span>Ver Detalles</span>
        </CyberButton>
      </div>
    </div>
  );
}