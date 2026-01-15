'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users,
  GraduationCap,
  TrendingUp,
  Award,
  Clock,
  Star,
  Briefcase,
  DollarSign,
  BookOpen,
  Video
} from 'lucide-react';

interface SchoolStatsProps {
  stats: {
    studentsGraduated: number;
    jobPlacementRate: number;
    averageSalaryIncrease: number;
  };
  members: number;
  courses: number;
  instructors: number;
  videos: number;
  rating: number;
  totalRatings: number;
}

export function SchoolStats({ 
  stats, 
  members, 
  courses, 
  instructors, 
  videos, 
  rating, 
  totalRatings 
}: SchoolStatsProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : i < rating
            ? 'text-yellow-400 fill-current opacity-50'
            : 'text-gray-400'
        }`}
      />
    ));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Estudiantes Activos */}
      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{formatNumber(members)}</p>
              <p className="text-sm text-gray-400">Estudiantes Activos</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Graduados */}
      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <GraduationCap className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{formatNumber(stats.studentsGraduated)}</p>
              <p className="text-sm text-gray-400">Graduados Exitosos</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasa de Empleabilidad */}
      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Briefcase className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.jobPlacementRate}%</p>
              <p className="text-sm text-gray-400">Tasa de Empleabilidad</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cursos Disponibles */}
      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-500/20 rounded-lg">
              <BookOpen className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{courses}</p>
              <p className="text-sm text-gray-400">Cursos Disponibles</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructores */}
      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-cyan-500/20 rounded-lg">
              <Award className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{instructors}</p>
              <p className="text-sm text-gray-400">Instructores Expertos</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Videos de Lecciones */}
      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-500/20 rounded-lg">
              <Video className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{formatNumber(videos)}</p>
              <p className="text-sm text-gray-400">Videos de Lecciones</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rating y Aumento Salarial */}
      <Card className="glass-card md:col-span-2 lg:col-span-3">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Rating */}
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-yellow-500/20 rounded-lg">
                <Star className="w-8 h-8 text-yellow-400 fill-current" />
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-3xl font-bold text-white">{rating}</span>
                  <div className="flex items-center space-x-1">
                    {renderStars(rating)}
                  </div>
                </div>
                <p className="text-sm text-gray-400">
                  Basado en {formatNumber(totalRatings)} reseñas de estudiantes
                </p>
              </div>
            </div>

            {/* Aumento Salarial */}
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-green-500/20 rounded-lg">
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-3xl font-bold text-white">{stats.averageSalaryIncrease}%</span>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    <DollarSign className="w-3 h-3 mr-1" />
                    Promedio
                  </Badge>
                </div>
                <p className="text-sm text-gray-400">
                  Aumento salarial promedio después de graduarse
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Certificaciones y Logros */}
      <Card className="glass-card md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Award className="w-5 h-5" />
            <span>Certificaciones y Reconocimientos</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="p-3 bg-blue-500/20 rounded-lg mb-2 mx-auto w-fit">
                <Award className="w-6 h-6 text-blue-400" />
              </div>
              <p className="text-sm font-medium text-white">Certificación ISO</p>
              <p className="text-xs text-gray-400">Calidad Educativa</p>
            </div>
            
            <div className="text-center">
              <div className="p-3 bg-green-500/20 rounded-lg mb-2 mx-auto w-fit">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <p className="text-sm font-medium text-white">Top 10</p>
              <p className="text-xs text-gray-400">Escuelas Tech 2024</p>
            </div>
            
            <div className="text-center">
              <div className="p-3 bg-purple-500/20 rounded-lg mb-2 mx-auto w-fit">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <p className="text-sm font-medium text-white">Partner Oficial</p>
              <p className="text-xs text-gray-400">Google & Microsoft</p>
            </div>
            
            <div className="text-center">
              <div className="p-3 bg-yellow-500/20 rounded-lg mb-2 mx-auto w-fit">
                <Star className="w-6 h-6 text-yellow-400" />
              </div>
              <p className="text-sm font-medium text-white">5 Estrellas</p>
              <p className="text-xs text-gray-400">Satisfacción Estudiantil</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}