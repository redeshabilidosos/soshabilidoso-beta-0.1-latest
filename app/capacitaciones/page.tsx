"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  BookOpen, Trophy, Clock, ChevronRight, ArrowLeft,
  GraduationCap, Users, Target, Award, Play, CheckCircle2,
  Dumbbell, Scale, Building2, Mic, Globe, UserCheck, Sparkles
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/navigation/sidebar";
import { MobileNav } from "@/components/navigation/mobile-nav";
import { useAuth } from "@/components/providers/providers";
import { useForceBlackBackground } from "@/hooks/use-force-black-background";

// API URL
const API_URL = 'http://127.0.0.1:8000/api';

// Mapeo de iconos por slug de sección
const iconosSeccion: { [key: string]: any } = {
  "tecnicas-practicas": Dumbbell,
  "escuelas-formacion": GraduationCap,
  "reglamentos-fifa": Scale,
  "tactica-estrategia": Target,
  "preparacion-fisica": Dumbbell,
  "reglamentos-arbitros": UserCheck,
  "estructura-sede": Building2,
  "conferencias-coaches": Mic,
  "representacion-jugadores": Users,
  "educacion-idiomas": Globe,
};

// Colores por sección
const coloresSeccion: { [key: string]: string } = {
  "tecnicas-practicas": "#00ff88",
  "escuelas-formacion": "#3b82f6",
  "reglamentos-fifa": "#f59e0b",
  "tactica-estrategia": "#ef4444",
  "preparacion-fisica": "#10b981",
  "reglamentos-arbitros": "#ef4444",
  "estructura-sede": "#8b5cf6",
  "conferencias-coaches": "#ec4899",
  "representacion-jugadores": "#14b8a6",
  "educacion-idiomas": "#f97316",
};

interface Seccion {
  id: string;
  slug: string;
  nombre: string;
  descripcion: string;
  color: string;
  icono: string;
  temas_total: number;
  temas_completados: number;
  duracion_total: string;
  orden: number;
}

export default function CapacitacionesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [secciones, setSecciones] = useState<Seccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [estadisticas, setEstadisticas] = useState<any>(null);

  // Aplicar fondo negro con estrellas
  useForceBlackBackground();

  useEffect(() => {
    let isMounted = true;
    
    const loadDatos = async () => {
      if (!isMounted) return;
      
      setLoading(true);
      try {
        const token = localStorage.getItem('access_token');
        const headers: any = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const seccionesResponse = await fetch(`${API_URL}/learning/secciones/`, { headers });
        
        if (seccionesResponse.ok && isMounted) {
          const seccionesData = await seccionesResponse.json();
          
          const seccionesFormateadas: Seccion[] = seccionesData.map((seccion: any) => ({
            id: seccion.id,
            slug: seccion.slug,
            nombre: seccion.nombre,
            descripcion: seccion.descripcion,
            color: coloresSeccion[seccion.slug] || seccion.color || "#00ff88",
            icono: seccion.icono || "BookOpen",
            temas_total: seccion.temas_total || 0,
            temas_completados: seccion.temas_completados || 0,
            duracion_total: seccion.duracion_total || "0min",
            orden: seccion.orden || 0
          }));
          
          seccionesFormateadas.sort((a, b) => a.orden - b.orden);
          setSecciones(seccionesFormateadas);
          
          if (token && isMounted) {
            try {
              const estadisticasResponse = await fetch(`${API_URL}/learning/progreso/estadisticas/`, { headers });
              if (estadisticasResponse.ok) {
                const estadisticasData = await estadisticasResponse.json();
                setEstadisticas(estadisticasData);
              }
            } catch (error) {
              // Error silencioso para estadísticas
            }
          }
        }
      } catch (error) {
        // Error silencioso
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    loadDatos();
    
    return () => {
      isMounted = false;
    };
  }, [user]);

  const calcularProgresoTotal = () => {
    if (estadisticas) {
      return estadisticas.porcentaje_progreso || 0;
    }
    
    const totalTemas = secciones.reduce((acc, s) => acc + s.temas_total, 0);
    const temasCompletados = secciones.reduce((acc, s) => acc + s.temas_completados, 0);
    return totalTemas > 0 ? Math.round((temasCompletados / totalTemas) * 100) : 0;
  };

  const getEstadoSeccion = (temasCompletados: number, temasTotal: number) => {
    if (temasCompletados === 0) return "no_iniciado";
    if (temasCompletados >= temasTotal) return "completado";
    return "en_progreso";
  };

  const getNivelUsuario = () => {
    if (estadisticas) {
      return estadisticas.nivel || "Principiante";
    }
    
    const progreso = calcularProgresoTotal();
    if (progreso >= 80) return "Experto";
    if (progreso >= 50) return "Intermedio";
    if (progreso >= 20) return "Aprendiz";
    return "Principiante";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00ff88]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <Sidebar />
      
      <main className="relative z-10 lg:ml-64 pb-24 lg:pb-0">
        {/* Header con degradado */}
        <div className="bg-gradient-to-b from-[#00ff88]/10 to-transparent py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              {/* Logo Animado con Levitación y Partículas */}
              <div className="relative inline-block mb-8">
                {/* Partículas flotantes */}
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(12)].map((_, i) => {
                    const angle = (i * 30) * (Math.PI / 180);
                    const radius = 80;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;
                    
                    return (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full"
                        style={{
                          background: i % 3 === 0 ? '#00ff88' : i % 3 === 1 ? '#00ffff' : '#ff00ff',
                          left: '50%',
                          top: '50%',
                          boxShadow: `0 0 10px ${i % 3 === 0 ? '#00ff88' : i % 3 === 1 ? '#00ffff' : '#ff00ff'}`,
                        }}
                        animate={{
                          x: [x, x + Math.cos(angle + 0.5) * 10, x],
                          y: [y, y + Math.sin(angle + 0.5) * 10, y],
                          opacity: [0.3, 1, 0.3],
                          scale: [0.8, 1.2, 0.8],
                          rotate: [0, 360, 0],
                        }}
                        transition={{
                          duration: 3 + (i * 0.2),
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: i * 0.1,
                        }}
                      />
                    );
                  })}
                </div>
                
                {/* Ícono de capacitaciones con efecto de levitación */}
                <motion.div
                  className="w-32 h-32 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center relative z-10 cursor-pointer"
                  style={{
                    filter: "drop-shadow(0 0 3px rgba(0,255,136,0.6))",
                    transformStyle: "preserve-3d",
                  }}
                  animate={{
                    y: [0, -15, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  whileHover={{
                    scale: 1.1,
                    filter: "drop-shadow(0 0 8px rgba(0,255,136,0.8))",
                  }}
                  whileTap={{
                    rotateY: 360,
                  }}
                >
                  <GraduationCap className="w-16 h-16 text-white" />
                </motion.div>
              </div>
              
              <h1 className="text-4xl font-bold mb-2">
                <Sparkles className="w-8 h-8 inline mr-2 text-[#00ff88]" />
                Comunidad Educativa
              </h1>
              <p className="text-gray-400">Capacitaciones y Formación Deportiva</p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto p-4 space-y-6">
            
            {/* Botón de regreso */}
            <Button
              variant="ghost"
              onClick={() => router.push('/communities')}
              className="mb-4 hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Regresar a Comunidades
            </Button>
            
            {/* Barra de progreso general */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-white/10">
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <Trophy className="w-6 h-6 text-yellow-400" />
                      <div>
                        <h3 className="font-semibold">Tu Progreso de Aprendizaje</h3>
                        <p className="text-sm text-gray-400">
                          {estadisticas ? 
                            `${estadisticas.temas_completados} de ${estadisticas.temas_totales} temas completados` :
                            `${secciones.reduce((a, s) => a + s.temas_completados, 0)} de ${secciones.reduce((a, s) => a + s.temas_total, 0)} temas completados`
                          }
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-[#00ff88]/20 text-[#00ff88] border-[#00ff88]/30">
                      Nivel: {getNivelUsuario()}
                    </Badge>
                  </div>
                  <Progress value={calcularProgresoTotal()} className="h-3 bg-white/10" />
                </CardContent>
              </Card>
            </motion.div>

            {/* Grid de Secciones */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#00ff88]" />
                Secciones de Aprendizaje
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {secciones.map((seccion, index) => {
                  const IconComponent = iconosSeccion[seccion.slug] || BookOpen;
                  const porcentaje = seccion.temas_total > 0 ? Math.round((seccion.temas_completados / seccion.temas_total) * 100) : 0;
                  const estado = getEstadoSeccion(seccion.temas_completados, seccion.temas_total);
                  
                  return (
                    <motion.div
                      key={seccion.slug}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => router.push(`/capacitaciones/secciones/${seccion.slug}`)}
                      className="cursor-pointer"
                    >
                      <Card className="bg-black/60 border-white/10 hover:border-white/30 transition-all h-full overflow-hidden group">
                        {/* Header con color */}
                        <div 
                          className="h-2"
                          style={{ backgroundColor: seccion.color }}
                        />
                        
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div 
                              className="w-12 h-12 rounded-xl flex items-center justify-center"
                              style={{ backgroundColor: `${seccion.color}20` }}
                            >
                              <IconComponent 
                                className="w-6 h-6" 
                                style={{ color: seccion.color }}
                              />
                            </div>
                            
                            {estado === "completado" && (
                              <Badge className="bg-[#00ff88]/20 text-[#00ff88] text-xs">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Completado
                              </Badge>
                            )}
                            {estado === "en_progreso" && (
                              <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">
                                <Play className="w-3 h-3 mr-1" />
                                En progreso
                              </Badge>
                            )}
                          </div>
                          
                          <h3 className="font-bold text-white mb-1 group-hover:text-[#00ff88] transition-colors">
                            {seccion.nombre}
                          </h3>
                          <p className="text-xs text-gray-400 line-clamp-2 mb-3">
                            {seccion.descripcion}
                          </p>
                          
                          {/* Info */}
                          <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-3 h-3" />
                              {seccion.temas_total} temas
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {seccion.duracion_total}
                            </span>
                          </div>
                          
                          {/* Progreso */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-400">{seccion.temas_completados}/{seccion.temas_total} completados</span>
                              <span style={{ color: seccion.color }}>{porcentaje}%</span>
                            </div>
                            <Progress 
                              value={porcentaje} 
                              className="h-1.5 bg-white/10"
                            />
                          </div>
                          
                          {/* Botón */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full mt-3 text-xs group-hover:bg-white/10"
                          >
                            {estado === "no_iniciado" ? "Comenzar" : "Continuar"}
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Logros */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-400" />
                Logros Disponibles
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {[
                  { nombre: "Primer Paso", descripcion: "Completa tu primer tema", icono: "🎯", desbloqueado: (estadisticas?.temas_completados || 0) > 0 },
                  { nombre: "Técnico", descripcion: "Completa Técnicas y Prácticas", icono: "⚽", desbloqueado: false },
                  { nombre: "Árbitro", descripcion: "Domina los reglamentos", icono: "🏆", desbloqueado: false },
                  { nombre: "Coach", descripcion: "Completa conferencias", icono: "📋", desbloqueado: false },
                  { nombre: "Políglota", descripcion: "Completa idiomas", icono: "🌍", desbloqueado: false },
                  { nombre: "Maestro", descripcion: "Completa todo", icono: "👑", desbloqueado: (estadisticas?.porcentaje_progreso || 0) >= 100 },
                ].map((logro, i) => (
                  <Card 
                    key={i}
                    className={`border-white/10 transition-all ${
                      logro.desbloqueado 
                        ? "bg-yellow-500/10 border-yellow-500/30" 
                        : "bg-black/40 opacity-50"
                    }`}
                  >
                    <CardContent className="p-3 text-center">
                      <div className="text-2xl mb-1">{logro.icono}</div>
                      <p className="text-xs font-semibold text-white">{logro.nombre}</p>
                      <p className="text-[10px] text-gray-500">{logro.descripcion}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>

          </div>
        </main>

        <MobileNav />
      </div>
    );
  }