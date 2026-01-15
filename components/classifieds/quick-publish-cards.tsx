'use client';

import { Card, CardContent } from '@/components/ui/card';
import { CyberButton } from '@/components/ui/cyber-button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingBag, 
  Store, 
  Briefcase, 
  Plus,
  TrendingUp,
  Clock,
  Star
} from 'lucide-react';

interface QuickPublishCardsProps {
  onCreateClick: () => void;
}

const quickActions = [
  {
    id: 'product',
    title: 'Vender Producto',
    description: 'Artículos físicos, electrónicos, ropa, deportes...',
    icon: ShoppingBag,
    color: 'text-blue-400',
    bgGradient: 'from-blue-500/10 to-cyan-500/10',
    borderColor: 'border-blue-500/20',
    examples: ['iPhone', 'Bicicleta', 'Guitarra', 'Zapatillas'],
    stats: '2.3k productos activos'
  },
  {
    id: 'marketplace',
    title: 'Ofrecer Servicio',
    description: 'Servicios locales, reparaciones, limpieza, tutorías...',
    icon: Store,
    color: 'text-green-400',
    bgGradient: 'from-green-500/10 to-emerald-500/10',
    borderColor: 'border-green-500/20',
    examples: ['Limpieza', 'Delivery', 'Reparaciones', 'Clases'],
    stats: '1.8k servicios disponibles',
    popular: true
  },
  {
    id: 'freelancer',
    title: 'Trabajo Freelancer',
    description: 'Proyectos remotos, diseño, programación, marketing...',
    icon: Briefcase,
    color: 'text-purple-400',
    bgGradient: 'from-purple-500/10 to-pink-500/10',
    borderColor: 'border-purple-500/20',
    examples: ['Diseño', 'Desarrollo', 'Marketing', 'Redacción'],
    stats: '950 freelancers activos'
  }
];

export function QuickPublishCards({ onCreateClick }: QuickPublishCardsProps) {
  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-white flex items-center justify-center space-x-2">
          <TrendingUp className="w-5 h-5 text-neon-green" />
          <span>Publica Rápidamente</span>
        </h3>
        <p className="text-gray-400 text-sm">
          Elige el tipo de publicación que mejor se adapte a lo que ofreces
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickActions.map((action) => {
          const Icon = action.icon;
          
          return (
            <Card
              key={action.id}
              className={`
                relative cursor-pointer transition-all duration-300 hover:scale-105
                glass-card hover:border-white/30 ${action.borderColor}
                bg-gradient-to-br ${action.bgGradient}
              `}
              onClick={onCreateClick}
            >
              {action.popular && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-neon-green text-black text-xs font-semibold px-2 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Popular
                  </Badge>
                </div>
              )}

              <CardContent className="p-4 space-y-3">
                {/* Header */}
                <div className="flex items-start space-x-3">
                  <div className={`
                    w-10 h-10 rounded-xl bg-gradient-to-br ${action.bgGradient} 
                    border ${action.borderColor} flex items-center justify-center
                  `}>
                    <Icon className={`w-5 h-5 ${action.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white text-sm">{action.title}</h4>
                    <p className="text-xs text-gray-400 line-clamp-2">{action.description}</p>
                  </div>
                </div>

                {/* Examples */}
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 font-medium">Ejemplos populares:</p>
                  <div className="flex flex-wrap gap-1">
                    {action.examples.slice(0, 3).map((example, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 bg-white/5 border border-white/10 rounded-full text-gray-300"
                      >
                        {example}
                      </span>
                    ))}
                    {action.examples.length > 3 && (
                      <span className="text-xs px-2 py-1 text-gray-500">
                        +{action.examples.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="text-xs text-gray-400 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {action.stats}
                  </span>
                  <div className="flex items-center text-xs text-neon-green">
                    <Plus className="w-3 h-3 mr-1" />
                    <span>Publicar</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Call to Action */}
      <div className="text-center pt-4">
        <CyberButton onClick={onCreateClick} size="lg" className="min-w-[200px]">
          <Plus className="w-4 h-4 mr-2" />
          Crear Publicación
        </CyberButton>
        <p className="text-xs text-gray-500 mt-2">
          ✨ Publicación gratuita • 📈 Alcance inmediato • 🔒 Transacciones seguras
        </p>
      </div>
    </div>
  );
}