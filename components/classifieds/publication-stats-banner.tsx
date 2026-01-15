'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Users, 
  Eye, 
  MessageSquare,
  Star,
  Zap,
  Clock
} from 'lucide-react';

const stats = [
  {
    label: 'Publicaciones Activas',
    value: '5.2k',
    change: '+12%',
    icon: TrendingUp,
    color: 'text-neon-green'
  },
  {
    label: 'Usuarios Conectados',
    value: '1.8k',
    change: '+8%',
    icon: Users,
    color: 'text-blue-400'
  },
  {
    label: 'Vistas Hoy',
    value: '24.5k',
    change: '+15%',
    icon: Eye,
    color: 'text-purple-400'
  },
  {
    label: 'Mensajes Enviados',
    value: '892',
    change: '+23%',
    icon: MessageSquare,
    color: 'text-yellow-400'
  }
];

const highlights = [
  {
    text: 'Respuesta promedio en 2 horas',
    icon: Clock,
    color: 'text-green-400'
  },
  {
    text: '4.8★ calificación promedio',
    icon: Star,
    color: 'text-yellow-400'
  },
  {
    text: 'Transacciones 100% seguras',
    icon: Zap,
    color: 'text-neon-green'
  }
];

export function PublicationStatsBanner() {
  return (
    <Card className="glass-card border-neon-green/20 bg-gradient-to-r from-neon-green/5 to-blue-500/5">
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start space-x-2 mb-1">
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                    <span className="text-xs text-gray-400">{stat.label}</span>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start space-x-2">
                    <span className="text-lg font-bold text-white">{stat.value}</span>
                    <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
                      {stat.change}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Highlights */}
          <div className="lg:border-l lg:border-white/10 lg:pl-6">
            <div className="space-y-2">
              {highlights.map((highlight, index) => {
                const Icon = highlight.icon;
                return (
                  <div key={index} className="flex items-center justify-center lg:justify-start space-x-2">
                    <Icon className={`w-3 h-3 ${highlight.color}`} />
                    <span className="text-xs text-gray-300">{highlight.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}