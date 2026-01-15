'use client';

import { Card, CardContent } from '@/components/ui/card';
import { CyberButton } from '@/components/ui/cyber-button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingBag, 
  Store, 
  Briefcase,
  ArrowRight,
  Star,
  TrendingUp,
  DollarSign,
  Users
} from 'lucide-react';

interface SellOptionsSelectorProps {
  onOptionSelect: (option: 'product' | 'marketplace' | 'freelancer') => void;
  onBack: () => void;
}

const sellOptions = [
  {
    id: 'product' as const,
    title: 'Vender Productos',
    subtitle: 'Artículos físicos',
    description: 'Vende productos tangibles como electrónicos, ropa, deportes, libros, etc.',
    icon: ShoppingBag,
    color: 'text-blue-400',
    bgGradient: 'from-blue-500/20 to-cyan-500/20',
    borderColor: 'border-blue-500/30',
    examples: ['iPhone 13 Pro', 'Bicicleta de montaña', 'Guitarra eléctrica', 'Zapatillas Nike'],
    features: [
      'Galería de fotos múltiples',
      'Estado del producto (nuevo/usado)',
      'Precio negociable',
      'Ubicación y opciones de entrega',
      'Categorías específicas'
    ],
    stats: '2.3k productos vendidos',
    avgPrice: '$250.000 COP'
  },
  {
    id: 'marketplace' as const,
    title: 'Ofrecer Servicios',
    subtitle: 'Servicios locales',
    description: 'Ofrece servicios como limpieza, reparaciones, delivery, tutorías, cuidado personal, etc.',
    icon: Store,
    color: 'text-green-400',
    bgGradient: 'from-green-500/20 to-emerald-500/20',
    borderColor: 'border-green-500/30',
    examples: ['Limpieza doméstica', 'Reparación de celulares', 'Clases de inglés', 'Delivery express'],
    features: [
      'Tarifas por hora o servicio',
      'Horarios de disponibilidad',
      'Área de cobertura',
      'Sistema de reservas',
      'Reseñas de clientes'
    ],
    stats: '1.8k servicios activos',
    avgPrice: '$25.000/hora',
    popular: true
  },
  {
    id: 'freelancer' as const,
    title: 'Trabajo Freelancer',
    subtitle: 'Proyectos remotos',
    description: 'Ofrece servicios profesionales como diseño, programación, marketing, redacción, etc.',
    icon: Briefcase,
    color: 'text-purple-400',
    bgGradient: 'from-purple-500/20 to-pink-500/20',
    borderColor: 'border-purple-500/30',
    examples: ['Diseño de logos', 'Desarrollo web', 'Marketing digital', 'Traducción de textos'],
    features: [
      'Portfolio de trabajos',
      'Presupuestos personalizados',
      'Plazos de entrega flexibles',
      'Comunicación directa',
      'Pagos por proyecto'
    ],
    stats: '950 freelancers activos',
    avgPrice: '$150.000/proyecto'
  }
];

export function SellOptionsSelector({ onOptionSelect, onBack }: SellOptionsSelectorProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            <ShoppingBag className="w-6 h-6 text-neon-green" />
            <span>¿Qué tipo de publicación quieres crear?</span>
          </h2>
          <p className="text-gray-400">
            Selecciona la categoría que mejor describa lo que ofreces
          </p>
        </div>
        <CyberButton variant="outline" onClick={onBack} size="sm">
          Volver
        </CyberButton>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
              onClick={() => onOptionSelect(option.id)}
            >
              {option.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-neon-green text-black font-semibold px-3 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Más Popular
                  </Badge>
                </div>
              )}

              <CardContent className="p-5 space-y-4">
                {/* Header */}
                <div className="text-center space-y-3">
                  <div className={`
                    w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${option.bgGradient} 
                    border-2 ${option.borderColor} flex items-center justify-center
                    transition-transform duration-300 group-hover:scale-110
                  `}>
                    <Icon className={`w-7 h-7 ${option.color}`} />
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

                {/* Examples */}
                <div className="space-y-2">
                  <h4 className="text-white font-medium text-xs text-center">Ejemplos populares:</h4>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {option.examples.slice(0, 2).map((example, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 bg-white/5 border border-white/10 rounded-full text-gray-300"
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400 flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      {option.stats}
                    </span>
                    <span className="text-gray-400 flex items-center">
                      <DollarSign className="w-3 h-3 mr-1" />
                      {option.avgPrice}
                    </span>
                  </div>
                </div>

                {/* Features Preview */}
                <div className="space-y-2">
                  <h4 className="text-white font-medium text-xs flex items-center justify-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Incluye:
                  </h4>
                  <ul className="space-y-1">
                    {option.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="text-xs text-gray-300 flex items-start">
                        <div className="w-1 h-1 bg-neon-green rounded-full mt-1.5 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                    {option.features.length > 3 && (
                      <li className="text-xs text-gray-500 text-center italic">
                        +{option.features.length - 3} características más...
                      </li>
                    )}
                  </ul>
                </div>

                {/* Action */}
                <div className="pt-3 border-t border-white/10">
                  <div className="flex items-center justify-center">
                    <div className={`flex items-center ${option.color} font-medium text-sm`}>
                      <span>Crear Publicación</span>
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
      <div className="bg-gradient-to-r from-neon-green/5 to-blue-500/5 border border-neon-green/20 rounded-lg p-4">
        <div className="text-center space-y-2">
          <h4 className="text-white font-medium text-sm flex items-center justify-center">
            <Star className="w-4 h-4 text-neon-green mr-2" />
            Beneficios de vender en SOS-HABILIDOSO
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
    </div>
  );
}