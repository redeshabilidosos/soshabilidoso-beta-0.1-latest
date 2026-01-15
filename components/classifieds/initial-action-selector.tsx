'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  Briefcase, 
  ArrowRight,
  TrendingUp,
  Users,
  Star,
  Zap
} from 'lucide-react';

interface InitialActionSelectorProps {
  onActionSelect: (action: 'sell' | 'hire') => void;
}

const actions = [
  {
    id: 'sell' as const,
    title: 'Quiero Vender Algo',
    subtitle: 'Publica productos o servicios',
    description: 'Vende productos físicos, ofrece servicios locales o trabaja como freelancer',
    icon: ShoppingCart,
    color: 'text-green-400',
    bgGradient: 'from-green-500/20 to-emerald-500/20',
    borderColor: 'border-green-500/30',
    hoverBorder: 'hover:border-green-400/50',
    examples: [
      'Productos físicos (electrónicos, ropa, deportes)',
      'Servicios locales (limpieza, reparaciones, delivery)',
      'Trabajo freelancer (diseño, programación, marketing)'
    ],
    stats: '3.2k vendedores activos',
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
    borderColor: 'border-blue-500/30',
    hoverBorder: 'hover:border-blue-400/50',
    examples: [
      'Contratar servicios profesionales',
      'Buscar productos específicos',
      'Encontrar oportunidades de trabajo'
    ],
    stats: '1.8k compradores activos'
  }
];

export function InitialActionSelector({ onActionSelect }: InitialActionSelectorProps) {
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
        {actions.map((action) => {
          const Icon = action.icon;
          
          return (
            <Card
              key={action.id}
              className={`
                relative cursor-pointer transition-all duration-300 transform hover:scale-105
                glass-card ${action.borderColor} ${action.hoverBorder}
                bg-gradient-to-br ${action.bgGradient}
                group
              `}
              onClick={() => onActionSelect(action.id)}
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

                {/* Examples */}
                <div className="space-y-3">
                  <h4 className="text-white font-medium text-sm flex items-center">
                    <TrendingUp className="w-4 h-4 text-neon-green mr-2" />
                    Incluye:
                  </h4>
                  <ul className="space-y-2">
                    {action.examples.map((example, index) => (
                      <li key={index} className="text-sm text-gray-300 flex items-start">
                        <div className="w-1.5 h-1.5 bg-neon-green rounded-full mt-2 mr-3 flex-shrink-0" />
                        <span>{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Stats and CTA */}
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">{action.stats}</span>
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