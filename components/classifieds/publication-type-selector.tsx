'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingBag, 
  Store, 
  Briefcase, 
  Zap, 
  Users, 
  Star,
  ArrowRight,
  Check
} from 'lucide-react';

export interface PublicationType {
  id: 'product' | 'marketplace' | 'freelancer';
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  bgGradient: string;
  features: string[];
  popular?: boolean;
}

const publicationTypes: PublicationType[] = [
  {
    id: 'product',
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
  {
    id: 'marketplace',
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
  {
    id: 'freelancer',
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
];

interface PublicationTypeSelectorProps {
  selectedType: PublicationType['id'] | null;
  onTypeSelect: (type: PublicationType) => void;
  className?: string;
}

export function PublicationTypeSelector({ 
  selectedType, 
  onTypeSelect, 
  className = '' 
}: PublicationTypeSelectorProps) {
  const [hoveredType, setHoveredType] = useState<PublicationType['id'] | null>(null);

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">¿Qué quieres publicar?</h2>
        <p className="text-gray-400">
          Selecciona el tipo de publicación que mejor se adapte a lo que ofreces
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {publicationTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedType === type.id;
          const isHovered = hoveredType === type.id;
          
          return (
            <Card
              key={type.id}
              className={`
                relative cursor-pointer transition-all duration-300 transform
                ${isSelected 
                  ? 'border-neon-green bg-neon-green/5 scale-105 shadow-lg shadow-neon-green/20' 
                  : 'glass-card hover:border-white/30 hover:scale-102'
                }
                ${isHovered && !isSelected ? 'border-white/40' : ''}
              `}
              onClick={() => onTypeSelect(type)}
              onMouseEnter={() => setHoveredType(type.id)}
              onMouseLeave={() => setHoveredType(null)}
            >
              {type.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-neon-green text-black font-semibold px-3 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Más Popular
                  </Badge>
                </div>
              )}

              {isSelected && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-neon-green rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-black" />
                </div>
              )}

              <CardContent className="p-6 space-y-4">
                {/* Header */}
                <div className="text-center space-y-3">
                  <div className={`
                    w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${type.bgGradient} 
                    flex items-center justify-center transition-transform duration-300
                    ${isHovered || isSelected ? 'scale-110' : ''}
                  `}>
                    <Icon className={`w-8 h-8 ${type.color}`} />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-white">{type.title}</h3>
                    <p className={`text-sm ${type.color} font-medium`}>{type.subtitle}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-400 text-sm text-center leading-relaxed">
                  {type.description}
                </p>

                {/* Features */}
                <div className="space-y-2">
                  <h4 className="text-white font-medium text-sm flex items-center">
                    <Zap className="w-4 h-4 text-neon-green mr-2" />
                    Características incluidas:
                  </h4>
                  <ul className="space-y-1">
                    {type.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="text-xs text-gray-400 flex items-center">
                        <div className="w-1 h-1 bg-neon-green rounded-full mr-2" />
                        {feature}
                      </li>
                    ))}
                    {type.features.length > 3 && (
                      <li className="text-xs text-gray-500 italic">
                        +{type.features.length - 3} características más...
                      </li>
                    )}
                  </ul>
                </div>

                {/* Action Indicator */}
                <div className={`
                  flex items-center justify-center pt-2 transition-all duration-300
                  ${isSelected ? 'opacity-100' : 'opacity-0'}
                `}>
                  <div className="flex items-center text-neon-green text-sm font-medium">
                    <span>Continuar</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional Info */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
          <span className="flex items-center">
            <Users className="w-3 h-3 mr-1" />
            Comunidad activa
          </span>
          <span className="flex items-center">
            <Star className="w-3 h-3 mr-1" />
            Sistema de reputación
          </span>
          <span className="flex items-center">
            <Zap className="w-3 h-3 mr-1" />
            Publicación gratuita
          </span>
        </div>
        <p className="text-xs text-gray-500">
          Todas las publicaciones son revisadas para mantener la calidad de la comunidad
        </p>
      </div>
    </div>
  );
}