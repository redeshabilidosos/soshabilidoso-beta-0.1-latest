'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Globe, 
  Crown,
  ArrowRight,
  TrendingUp,
  Star,
  Zap,
  Shield,
  MessageSquare,
  Lock
} from 'lucide-react';

interface CommunityTypeSelectorProps {
  onTypeSelect: (type: 'public' | 'private' | 'premium' | 'page') => void;
}

const communityTypes = [
  {
    id: 'public' as const,
    title: 'Comunidad Abierta',
    subtitle: 'Acceso libre para todos',
    description: 'Cualquier persona puede unirse y participar libremente en las discusiones',
    icon: Users,
    color: 'text-green-400',
    bgGradient: 'from-green-500/20 to-emerald-500/20',
    borderColor: 'border-green-500/30',
    features: [
      'Acceso completamente gratuito',
      'Cualquiera puede unirse',
      'Contenido público y visible',
      'Moderación comunitaria',
      'Crecimiento orgánico'
    ],
    stats: '2.3k comunidades activas',
    popular: true
  },
  {
    id: 'private' as const,
    title: 'Comunidad Privada',
    subtitle: 'Solo por invitación',
    description: 'Acceso restringido con aprobación de administradores o por invitación',
    icon: Lock,
    color: 'text-blue-400',
    bgGradient: 'from-blue-500/20 to-cyan-500/20',
    borderColor: 'border-blue-500/30',
    features: [
      'Acceso por invitación',
      'Contenido exclusivo',
      'Mayor privacidad',
      'Control de miembros',
      'Discusiones especializadas'
    ],
    stats: '890 comunidades exclusivas'
  },
  {
    id: 'premium' as const,
    title: 'Comunidad Premium',
    subtitle: 'Contenido de pago',
    description: 'Acceso mediante suscripción mensual con contenido exclusivo y beneficios',
    icon: Crown,
    color: 'text-yellow-400',
    bgGradient: 'from-yellow-500/20 to-orange-500/20',
    borderColor: 'border-yellow-500/30',
    features: [
      'Monetización de contenido',
      'Suscripciones mensuales',
      'Beneficios exclusivos',
      'Herramientas avanzadas',
      'Soporte prioritario'
    ],
    stats: '156 comunidades premium'
  },
  {
    id: 'page' as const,
    title: 'Página Pública',
    subtitle: 'Perfil de marca o personal',
    description: 'Página para marcas, empresas o figuras públicas con seguidores',
    icon: Globe,
    color: 'text-purple-400',
    bgGradient: 'from-purple-500/20 to-pink-500/20',
    borderColor: 'border-purple-500/30',
    features: [
      'Perfil público verificable',
      'Sistema de seguidores',
      'Publicaciones oficiales',
      'Estadísticas detalladas',
      'Herramientas de marketing'
    ],
    stats: '1.2k páginas verificadas'
  }
];

export function CommunityTypeSelector({ onTypeSelect }: CommunityTypeSelectorProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-white">
            ¿Qué tipo de comunidad quieres crear?
          </h2>
          <p className="text-gray-400 text-lg">
            Elige el formato que mejor se adapte a tus objetivos
          </p>
        </div>
        
        {/* Quick Stats */}
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4 text-neon-green" />
            <span>4.6k+ comunidades</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400" />
            <span>4.9★ satisfacción</span>
          </div>
          <div className="flex items-center space-x-1">
            <Zap className="w-4 h-4 text-neon-blue" />
            <span>Herramientas avanzadas</span>
          </div>
        </div>
      </div>

      {/* Community Types Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {communityTypes.map((type) => {
          const Icon = type.icon;
          
          return (
            <Card
              key={type.id}
              className={`
                relative cursor-pointer transition-all duration-300
                glass-card ${type.borderColor} hover:border-white/40
                bg-gradient-to-br ${type.bgGradient}
                group overflow-visible
              `}
              style={{ marginTop: type.popular ? '16px' : '0' }}
              onClick={() => onTypeSelect(type.id)}
            >
              {type.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-neon-green text-black font-semibold px-3 py-1 shadow-lg">
                    <Star className="w-3 h-3 mr-1" />
                    Más Popular
                  </Badge>
                </div>
              )}

              <CardContent className="p-6 space-y-5">
                {/* Header */}
                <div className="text-center space-y-3">
                  <div className={`
                    w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${type.bgGradient} 
                    border-2 ${type.borderColor} flex items-center justify-center
                    transition-transform duration-300 group-hover:scale-110
                  `}>
                    <Icon className={`w-8 h-8 ${type.color}`} />
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white">{type.title}</h3>
                    <p className={`text-sm font-medium ${type.color}`}>{type.subtitle}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-400 text-sm text-center leading-relaxed">
                  {type.description}
                </p>

                {/* Features */}
                <div className="space-y-3">
                  <h4 className="text-white font-medium text-sm flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-neon-green mr-2" />
                    Características incluidas:
                  </h4>
                  <ul className="space-y-2">
                    {type.features.map((feature, index) => (
                      <li key={index} className="text-xs text-gray-300 flex items-start">
                        <div className="w-1.5 h-1.5 bg-neon-green rounded-full mt-1.5 mr-3 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Stats and Action */}
                <div className="space-y-3 pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400 flex items-center">
                      <MessageSquare className="w-3 h-3 mr-1" />
                      {type.stats}
                    </span>
                    <div className={`flex items-center ${type.color} font-medium`}>
                      <span>Crear</span>
                      <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional Info */}
      <div className="bg-gradient-to-r from-neon-green/5 to-blue-500/5 border border-neon-green/20 rounded-lg p-6">
        <div className="text-center space-y-4">
          <h4 className="text-white font-medium flex items-center justify-center">
            <Shield className="w-5 h-5 text-neon-green mr-2" />
            Beneficios de crear en SOS-HABILIDOSO
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-400">
            <div className="text-center">
              <div className="text-neon-green font-bold text-lg">100%</div>
              <div>Herramientas gratuitas</div>
            </div>
            <div className="text-center">
              <div className="text-blue-400 font-bold text-lg">24/7</div>
              <div>Soporte técnico</div>
            </div>
            <div className="text-center">
              <div className="text-green-400 font-bold text-lg">∞</div>
              <div>Miembros ilimitados</div>
            </div>
            <div className="text-center">
              <div className="text-yellow-400 font-bold text-lg">Pro</div>
              <div>Herramientas avanzadas</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
          <span>🚀 Lanzamiento inmediato</span>
          <span>📊 Analytics incluidos</span>
          <span>🔒 Moderación automática</span>
          <span>💰 Monetización opcional</span>
        </div>
        <p className="text-xs text-gray-500 max-w-2xl mx-auto">
          Todas las comunidades incluyen herramientas de moderación, analytics básicos y soporte técnico. 
          Las comunidades premium tienen acceso a funciones avanzadas de monetización y personalización.
        </p>
      </div>
    </div>
  );
}