"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ArrowLeft, BookOpen, Clock, CheckCircle2, Play, Lock,
  ChevronRight, Trophy, Target
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/navigation/sidebar";
import { MobileNav } from "@/components/navigation/mobile-nav";
import { useForceBlackBackground } from "@/hooks/use-force-black-background";

interface Tema {
  id: string;
  slug: string;
  titulo: string;
  descripcion: string;
  nivel: string;
  duracion: string;
  completado: boolean;
}

interface Seccion {
  id: string;
  slug: string;
  nombre: string;
  descripcion: string;
  color: string;
  icono: string;
  temas: Tema[];
  temas_total: number;
  temas_completados: number;
}

export default function SeccionPage() {
  const router = useRouter();
  const params = useParams();
  const seccionSlug = params.id as string;
  
  const [seccion, setSeccion] = useState<Seccion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Aplicar fondo negro con estrellas
  useForceBlackBackground();

  useEffect(() => {
    // Agregar atributo al body para identificar la página
    document.body.setAttribute('data-page', 'capacitaciones');
    
    return () => {
      document.body.removeAttribute('data-page');
    };
  }, []);

  useEffect(() => {
    const loadSeccion = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Obtener token de autenticación
        const token = localStorage.getItem('access_token');
        const headers: any = {
          'Content-Type': 'application/json',
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        // Cargar datos de la sección desde la API
        const response = await fetch(`http://127.0.0.1:8000/api/learning/secciones/${seccionSlug}/`, {
          headers
        });
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: Sección no encontrada`);
        }
        
        const data = await response.json();
        
        // Transformar los datos para que coincidan con la interfaz
        const seccionData: Seccion = {
          id: data.id,
          slug: data.slug,
          nombre: data.nombre,
          descripcion: data.descripcion,
          color: data.color || '#00ff88',
          icono: data.icono || 'BookOpen',
          temas: data.temas.map((tema: any) => ({
            id: tema.id,
            slug: tema.slug,
            titulo: tema.titulo,
            descripcion: tema.descripcion,
            nivel: tema.nivel,
            duracion: tema.duracion,
            completado: tema.completado || false
          })),
          temas_total: data.temas_total,
          temas_completados: data.temas_completados || 0
        };
        
        setSeccion(seccionData);
      } catch (err: any) {
        console.error('Error cargando sección:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (seccionSlug) {
      loadSeccion();
    }
  }, [seccionSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00ff88]"></div>
      </div>
    );
  }

  if (error || !seccion) {
    return (
      <div className="min-h-screen">
        <Sidebar />
        
        <main className="pb-24 lg:ml-64 lg:pb-0 pt-28 md:pt-12 lg:pt-6 relative z-10 min-h-screen">
          <div className="max-w-6xl mx-auto p-4 space-y-6">
            <Button
              variant="ghost"
              onClick={() => router.push('/capacitaciones')}
              className="mb-4 hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Capacitaciones
            </Button>
            
            <Card className="bg-red-500/10 border-red-500/20">
              <CardContent className="p-6 text-center">
                <h2 className="text-xl font-bold text-red-400 mb-2">Sección no encontrada</h2>
                <p className="text-gray-400 mb-4">{error || 'La sección solicitada no existe'}</p>
                <Button onClick={() => router.push('/capacitaciones')}>
                  Volver a Capacitaciones
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        
        <MobileNav />
      </div>
    );
  }

  const porcentaje = seccion.temas_total > 0 ? Math.round((seccion.temas_completados / seccion.temas_total) * 100) : 0;

  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case "basico": return "bg-green-500/20 text-green-400";
      case "intermedio": return "bg-yellow-500/20 text-yellow-400";
      case "avanzado": return "bg-red-500/20 text-red-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="min-h-screen">
      <Sidebar />
      
      <main className="pb-24 lg:ml-64 lg:pb-0 pt-28 md:pt-12 lg:pt-6 relative z-10 min-h-screen">
        <div className="max-w-6xl mx-auto p-4 space-y-6">
            
            {/* Header */}
            <div className="mb-6 max-w-4xl">
              <Button
                variant="ghost"
                onClick={() => router.push('/capacitaciones')}
                className="mb-4 hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a Capacitaciones
              </Button>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${seccion.color}20` }}
                  >
                    <BookOpen className="w-7 h-7" style={{ color: seccion.color }} />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">{seccion.nombre}</h1>
                    <p className="text-gray-400 text-sm">{seccion.descripcion}</p>
                  </div>
                </div>
                
                {/* Progreso de la sección */}
                <Card className="bg-black/40 border-white/10">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                        <span className="text-sm">Progreso de la sección</span>
                      </div>
                      <span className="text-sm font-bold" style={{ color: seccion.color }}>
                        {seccion.temas_completados}/{seccion.temas_total} temas
                      </span>
                    </div>
                    <Progress value={porcentaje} className="h-2 bg-white/10" />
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Lista de Temas */}
            <div className="space-y-3 max-w-4xl">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Target className="w-5 h-5" style={{ color: seccion.color }} />
                Temas del Curso
              </h2>
              
              {seccion.temas.map((tema: any, index: number) => (
                <motion.div
                  key={tema.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index }}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => router.push(`/capacitaciones/temas/${tema.slug}`)}
                  className="cursor-pointer"
                >
                  <Card className={`border-white/10 transition-all hover:border-white/30 ${
                    tema.completado ? "bg-[#00ff88]/5 border-[#00ff88]/20" : "bg-black/40"
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        {/* Número/Estado */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          tema.completado 
                            ? "bg-[#00ff88]/20" 
                            : "bg-white/10"
                        }`}>
                          {tema.completado ? (
                            <CheckCircle2 className="w-5 h-5 text-[#00ff88]" />
                          ) : (
                            <span className="text-sm font-bold text-gray-400">{index + 1}</span>
                          )}
                        </div>
                        
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className={`font-semibold ${tema.completado ? "text-[#00ff88]" : "text-white"}`}>
                              {tema.titulo}
                            </h3>
                            <Badge className={`text-[10px] ${getNivelColor(tema.nivel)}`}>
                              {tema.nivel}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">{tema.descripcion}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {tema.duracion}
                            </span>
                          </div>
                        </div>
                        
                        {/* Acción */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={tema.completado ? "text-[#00ff88]" : "text-gray-400"}
                          >
                            {tema.completado ? "Repasar" : "Iniciar"}
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                          
                          {/* Icono de completado visible */}
                          {tema.completado && (
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ 
                                type: "spring", 
                                stiffness: 260, 
                                damping: 20 
                              }}
                              className="flex items-center justify-center w-8 h-8 rounded-full bg-[#00ff88]/20 border border-[#00ff88]/30"
                            >
                              <CheckCircle2 className="w-5 h-5 text-[#00ff88]" />
                            </motion.div>
                          )}
                        </div>           
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

          </div>
        </main>

        <MobileNav />
      </div>
    );
  }