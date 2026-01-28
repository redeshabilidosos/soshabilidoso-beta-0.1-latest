'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CyberButton } from '@/components/ui/cyber-button';
import { 
  ShoppingCart, 
  Briefcase, 
  ShoppingBag, 
  Store, 
  ArrowRight,
  TrendingUp,
  Users,
  Star,
  Zap,
  DollarSign,
  Plus
} from 'lucide-react';

interface PublishMainViewProps {
  onCreatePublication: (type: 'product' | 'marketplace' | 'freelancer') => void;
  onBrowseRequested: () => void;
}

const mainActions = [
  {
    id: 'sell' as const,
    title: 'Quiero Vender Algo',
    subtitle: 'Publica productos o servicios',
    description: 'Vende productos físicos, ofrece servicios locales o trabaja como freelancer',
    icon: ShoppingCart,
    color: 'text-green-400',
    bgGradient: 'from-green-500/20 to-emerald-500/20',
    borderColor: 'border-green-500/30',
    popular: true
  },
  {
    id: 'hire' as const,
    title: 'Quiero Contratar / Busco que me Contraten',
    subtitle: 'Encuentra o busca oportunidades',
    description: 'Contrata servicios, busca productos o encuentra oportunidades laborales',
    icon: Briefcase,
    color: 'text-blue-400',
    bgGradient: 'from-blue-500/20 to-cyan-500/20',
    borderColor: 'border-blue-500/30'
  }
];

const sellOptions = [
  {
    id: 'product' as const,
    title: 'Producto Físico',
    subtitle: 'Vende artículos tangibles',
    description: 'Perfecto para vender objetos físicos como electrónicos, ropa, deportes, etc.',
    icon: ShoppingBag,
    color: 'text-blue-400',
    bgGradient: 'from-blue-500/20 to-cyan-500/20',
    borderColor: 'border-blue-500/30',
    examples: ['iPhone', 'Bicicleta', 'Guitarra', '+1'],
    features: [
      'Galería de fotos múltiples',
      'Estado del producto',
      'Precio negociable',
      '+2 características más...'
    ],
    stats: '2.3k productos activos'
  },
  {
    id: 'marketplace' as const,
    title: 'Servicio Marketplace',
    subtitle: 'Ofrece servicios locales',
    description: 'Ideal para servicios como reparaciones, limpieza, delivery, tutorías, etc.',
    icon: Store,
    color: 'text-green-400',
    bgGradient: 'from-green-500/20 to-emerald-500/20',
    borderColor: 'border-green-500/30',
    examples: ['Limpieza', 'Delivery', 'Reparaciones', '+1'],
    features: [
      'Tarifas por hora/servicio',
      'Disponibilidad horaria',
      'Área de cobertura',
      '+2 características más...'
    ],
    stats: '1.8k servicios disponibles',
    popular: true
  },
  {
    id: 'freelancer' as const,
    title: 'Trabajo Freelancer',
    subtitle: 'Proyectos profesionales',
    description: 'Para trabajos remotos como diseño, programación, marketing, escritura, etc.',
    icon: Briefcase,
    color: 'text-purple-400',
    bgGradient: 'from-purple-500/20 to-pink-500/20',
    borderColor: 'border-purple-500/30',
    examples: ['Diseño', 'Desarrollo', 'Marketing', '+1'],
    features: [
      'Portfolio de trabajos',
      'Presupuestos personalizados',
      'Plazos de entrega',
      '+2 características más...'
    ],
    stats: '950 freelancers activos'
  }
];

export function PublishMainView({ onCreatePublication, onBrowseRequested }: PublishMainViewProps) {
  const [selectedAction, setSelectedAction] = useState<'sell' | 'hire' | null>(null);

  const handleActionSelect = (action: 'sell' | 'hire') => {
    if (action === 'hire') {
      // Abrir directamente el formulario de freelancer
      onCreatePublication('freelancer');
    } else {
      setSelectedAction(action);
    }
  };

  const handleBack = () => {
    setSelectedAction(null);
  };

  if (selectedAction === 'sell') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">¿Qué quieres publicar?</h2>
            <p className="text-gray-400">
              Selecciona el tipo de publicación que mejor se adapte a lo que ofreces
            </p>
          </div>
          <CyberButton variant="outline" onClick={handleBack} size="sm">
            Volver
          </CyberButton>
        </div>

        {/* Publication Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sellOptions.map((option) => {
            const Icon = option.icon;
            
            return (
              <Card
                key={option.id}
                className={`
                  relative cursor-pointer transition-all duration-300 transform hover:scale-105
                  glass-card ${option.borderColor} hover:border-white/40
                  bg-gradient-to-br ${option.bgGradient}
                  group
                `}
                onClick={() => onCreatePublication(option.id)}
              >
                {option.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-neon-green text-black font-semibold px-3 py-1">
                      <Star className="w-3 h-3 mr-1" />
                      Más Popular
                    </Badge>
                  </div>
                )}

                <CardContent className="p-6 space-y-4">
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
                  <div className="space-y-2">
                    <h4 className="text-white font-medium text-sm flex items-center">
                      <Zap className="w-4 h-4 text-neon-green mr-2" />
                      Características incluidas:
                    </h4>
                    <ul className="space-y-1">
                      {option.features.map((feature, index) => (
                        <li key={index} className="text-xs text-gray-300 flex items-start">
                          <div className="w-1 h-1 bg-neon-green rounded-full mt-1.5 mr-2 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Examples */}
                  <div className="space-y-2">
                    <h4 className="text-white font-medium text-xs">Ejemplos populares:</h4>
                    <div className="flex flex-wrap gap-1">
                      {option.examples.map((example, index) => (
                        <span
                          key={index}
                          className="text-xs px-2 py-1 bg-white/5 border border-white/10 rounded-full text-gray-300"
                        >
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Stats and Action */}
                  <div className="space-y-3 pt-3 border-t border-white/10">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400 flex items-center">
                        <Users className="w-3 h-3 mr-1" />
                        {option.stats}
                      </span>
                      <CyberButton size="sm" className="text-xs px-3 py-1">
                        + Publicar
                      </CyberButton>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom Info */}
        <div className="bg-gradient-to-r from-neon-green/5 to-blue-500/5 border border-neon-green/20 rounded-lg p-4">
          <div className="text-center space-y-2">
            <h4 className="text-white font-medium text-sm flex items-center justify-center">
              <Star className="w-4 h-4 text-neon-green mr-2" />
              Beneficios de publicar en SOS-HABILIDOSO
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-gray-400">
              <div className="text-center">
                <div className="text-neon-green font-bold">100%</div>
                <div>Gratuito</div>
              </div>
              <div className="text-center">
                <div className="text-blue-400 font-bold">5k+</div>
                <div>Usuarios activos</div>
              </div>
              <div className="text-center">
                <div className="text-green-400 font-bold">2h</div>
                <div>Respuesta promedio</div>
              </div>
              <div className="text-center">
                <div className="text-yellow-400 font-bold">4.8★</div>
                <div>Calificación promedio</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-white">
            ¿Qué quieres hacer hoy?
          </h2>
          <p className="text-gray-400 text-lg">
            Elige la opción que mejor describa lo que buscas
          </p>
        </div>
        
        {/* Quick Stats */}
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4 text-neon-green" />
            <span>5k+ usuarios activos</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400" />
            <span>4.8★ promedio</span>
          </div>
          <div className="flex items-center space-x-1">
            <Zap className="w-4 h-4 text-neon-blue" />
            <span>Respuesta en 2h</span>
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {mainActions.map((action) => {
          const Icon = action.icon;
          
          return (
            <Card
              key={action.id}
              className={`
                relative cursor-pointer transition-all duration-300 transform hover:scale-105
                glass-card ${action.borderColor} hover:border-white/40
                bg-gradient-to-br ${action.bgGradient}
                group
              `}
              onClick={() => handleActionSelect(action.id)}
            >
              {action.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-neon-green text-black font-semibold px-3 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Más Popular
                  </Badge>
                </div>
              )}

              <CardContent className="p-8 space-y-6">
                {/* Header */}
                <div className="text-center space-y-4">
                  <div className={`
                    w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${action.bgGradient} 
                    border-2 ${action.borderColor} flex items-center justify-center
                    transition-transform duration-300 group-hover:scale-110
                  `}>
                    <Icon className={`w-10 h-10 ${action.color}`} />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white">{action.title}</h3>
                    <p className={`text-sm font-medium ${action.color}`}>{action.subtitle}</p>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {action.description}
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center justify-center">
                    <div className={`flex items-center ${action.color} font-medium`}>
                      <span>Continuar</span>
                      <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
          <span>✨ Publicación gratuita</span>
          <span>🔒 Transacciones seguras</span>
          <span>📱 Notificaciones instantáneas</span>
          <span>⭐ Sistema de reputación</span>
        </div>
        <p className="text-xs text-gray-500 max-w-2xl mx-auto">
          Únete a miles de usuarios que ya están comprando, vendiendo y contratando servicios 
          en la comunidad SOS-HABILIDOSO. Todas las publicaciones son revisadas para mantener 
          la calidad y seguridad de la plataforma.
        </p>
      </div>
    </div>
  );
}