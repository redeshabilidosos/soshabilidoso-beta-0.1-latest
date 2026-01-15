'use client';

import { Card, CardContent } from '@/components/ui/card';
import { CyberButton } from '@/components/ui/cyber-button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  UserPlus, 
  Briefcase,
  ArrowRight,
  Star,
  Clock,
  Shield,
  Zap
} from 'lucide-react';

interface HireOptionsSelectorProps {
  onOptionSelect: (option: 'browse' | 'post-request') => void;
  onBack: () => void;
}

const options = [
  {
    id: 'browse' as const,
    title: 'Explorar y Contratar',
    subtitle: 'Busca entre servicios disponibles',
    description: 'Navega por productos y servicios ya publicados, contacta directamente con vendedores',
    icon: Search,
    color: 'text-blue-400',
    bgGradient: 'from-blue-500/20 to-cyan-500/20',
    borderColor: 'border-blue-500/30',
    features: [
      'Ver todos los productos y servicios disponibles',
      'Filtrar por categoría, precio y ubicación',
      'Contactar directamente con vendedores',
      'Ver reseñas y calificaciones',
      'Comparar opciones fácilmente'
    ],
    action: 'Explorar Ahora',
    popular: true
  },
  {
    id: 'post-request' as const,
    title: 'Publicar Solicitud',
    subtitle: 'Deja que te encuentren',
    description: 'Publica lo que necesitas y recibe ofertas de vendedores interesados',
    icon: UserPlus,
    color: 'text-green-400',
    bgGradient: 'from-green-500/20 to-emerald-500/20',
    borderColor: 'border-green-500/30',
    features: [
      'Describe exactamente lo que necesitas',
      'Recibe ofertas personalizadas',
      'Los vendedores te contactan directamente',
      'Negocia precios y condiciones',
      'Elige la mejor propuesta'
    ],
    action: 'Crear Solicitud'
  }
];

export function HireOptionsSelector({ onOptionSelect, onBack }: HireOptionsSelectorProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Briefcase className="w-6 h-6 text-neon-green" />
            <span>¿Cómo prefieres encontrar lo que buscas?</span>
          </h2>
          <p className="text-gray-400">
            Elige la forma que mejor se adapte a tus necesidades
          </p>
        </div>
        <CyberButton variant="outline" onClick={onBack} size="sm">
          Volver
        </CyberButton>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {options.map((option) => {
          const Icon = option.icon;
          
          return (
            <Card
              key={option.id}
              className={`
                relative cursor-pointer transition-all duration-300 transform hover:scale-102
                glass-card ${option.borderColor} hover:border-white/40
                bg-gradient-to-br ${option.bgGradient}
                group
              `}
              onClick={() => onOptionSelect(option.id)}
            >
              {option.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-neon-green text-black font-semibold px-3 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Recomendado
                  </Badge>
                </div>
              )}

              <CardContent className="p-6 space-y-5">
                {/* Header */}
                <div className="text-center space-y-3">
                  <div className={`
                    w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${option.bgGradient} 
                    border-2 ${option.borderColor} flex items-center justify-center
                    transition-transform duration-300 group-hover:scale-110
                  `}>
                    <Icon className={`w-8 h-8 ${option.color}`} />
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white">{option.title}</h3>
                    <p className={`text-sm font-medium ${option.color}`}>{option.subtitle}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-400 text-sm text-center leading-relaxed">
                  {option.description}
                </p>

                {/* Features */}
                <div className="space-y-3">
                  <h4 className="text-white font-medium text-sm flex items-center justify-center">
                    <Zap className="w-4 h-4 text-neon-green mr-2" />
                    Características:
                  </h4>
                  <ul className="space-y-2">
                    {option.features.map((feature, index) => (
                      <li key={index} className="text-xs text-gray-300 flex items-start">
                        <div className="w-1 h-1 bg-neon-green rounded-full mt-1.5 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center justify-center">
                    <div className={`flex items-center ${option.color} font-medium text-sm`}>
                      <span>{option.action}</span>
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional Info */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-neon-green mt-0.5" />
          <div className="space-y-2">
            <h4 className="text-white font-medium text-sm">Consejos de Seguridad</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-400">
              <div className="flex items-center space-x-2">
                <Clock className="w-3 h-3 text-blue-400" />
                <span>Verifica la reputación del vendedor</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-3 h-3 text-yellow-400" />
                <span>Lee las reseñas de otros compradores</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-3 h-3 text-green-400" />
                <span>Usa métodos de pago seguros</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-3 h-3 text-purple-400" />
                <span>Comunícate a través de la plataforma</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}