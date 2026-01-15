"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  BookOpen, Trophy, Clock, ChevronRight, ArrowLeft,
  GraduationCap, Users, Target, Award, Play, CheckCircle2,
  Dumbbell, Scale, Building2, Mic, Globe, UserCheck
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/navigation/sidebar";
import { MobileNav } from "@/components/navigation/mobile-nav";
import { useAuth } from "@/components/providers/providers";

// Datos de las secciones de capacitación
const seccionesData = [
  {
    id: "tecnicas-practicas",
    nombre: "Técnicas y Prácticas",
    descripcion: "Métodos y ejercicios para desarrollar habilidades individuales y colectivas",
    icono: Dumbbell,
    color: "#00ff88",
    temasTotal: 7,
    duracionTotal: "4h 30min"
  },
  {
    id: "escuelas-formacion",
    nombre: "Escuelas de Formación",
    descripcion: "Centros especializados para jóvenes futbolistas con entrenamiento estructurado",
    icono: GraduationCap,
    color: "#3b82f6",
    temasTotal: 5,
    duracionTotal: "3h 15min"
  },
  {
    id: "reglamentos-fifa",
    nombre: "Reglamentos FIFA",
    descripcion: "Leyes del Juego establecidas por la FIFA - reglas universales del deporte",
    icono: Scale,
    color: "#f59e0b",
    temasTotal: 6,
    duracionTotal: "2h 45min"
  },
  {
    id: "reglamentos-arbitros",
    nombre: "Reglamentos de Árbitros",
    descripcion: "Normativas específicas que rigen la labor del cuerpo arbitral",
    icono: UserCheck,
    color: "#ef4444",
    temasTotal: 4,
    duracionTotal: "2h 00min"
  },
  {
    id: "estructura-sede",
    nombre: "Estructura de Sede Deportiva",
    descripcion: "Infraestructura física necesaria para operar un centro de formación",
    icono: Building2,
    color: "#8b5cf6",
    temasTotal: 6,
    duracionTotal: "3h 00min"
  },
  {
    id: "conferencias-coaches",
    nombre: "Conferencias para Coaches",
    descripcion: "Sesiones formativas para entrenadores y staff técnico",
    icono: Mic,
    color: "#ec4899",
    temasTotal: 6,
    duracionTotal: "4h 00min"
  },
  {
    id: "representacion-jugadores",
    nombre: "Representación de Jugadores",
    descripcion: "Gestión de contratos, imagen y carrera de deportistas",
    icono: Users,
    color: "#14b8a6",
    temasTotal: 4,
    duracionTotal: "2h 30min"
  },
  {
    id: "educacion-idiomas",
    nombre: "Educación de Idiomas",
    descripcion: "Programa de enseñanza de lenguas para futbolistas internacionales",
    icono: Globe,
    color: "#f97316",
    temasTotal: 5,
    duracionTotal: "5h 00min"
  }
];

export default function CapacitacionesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [progresoUsuario, setProgresoUsuario] = useState<{[key: string]: number}>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de progreso del usuario
    const loadProgreso = async () => {
      setLoading(true);
      // TODO: Cargar desde API
      // Por ahora datos de ejemplo
      setProgresoUsuario({
        "tecnicas-practicas": 3,
        "escuelas-formacion": 0,
        "reglamentos-fifa": 2,
        "reglamentos-arbitros": 0,
        "estructura-sede": 1,
        "conferencias-coaches": 0,
        "representacion-jugadores": 0,
        "educacion-idiomas": 0
      });
      setLoading(false);
    };
    loadProgreso();
  }, []);

  const calcularProgresoTotal = () => {
    const totalTemas = seccionesData.reduce((acc, s) => acc + s.temasTotal, 0);
    const temasCompletados = Object.values(progresoUsuario).reduce((acc, v) => acc + v, 0);
    return Math.round((temasCompletados / totalTemas) * 100);
  };

  const getEstadoSeccion = (seccionId: string, temasTotal: number) => {
    const completados = progresoUsuario[seccionId] || 0;
    if (completados === 0) return "no_iniciado";
    if (completados >= temasTotal) return "completado";
    return "en_progreso";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00ff88]"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-black text-white relative overflow-hidden">
      {/* Fondo de estrellas */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </div>

      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <MobileNav />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden w-full xl:ml-64">
          <div className="w-full max-w-7xl px-4 md:px-6 lg:pl-6 lg:pr-10 xl:pl-8 xl:pr-16 py-6 pb-24 md:pb-8 relative z-10">
            
            {/* Header */}
            <div className="mb-8">
              <Button
                variant="ghost"
                onClick={() => router.push('/communities')}
                className="mb-4 hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Regresar a Comunidades
              </Button>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <GraduationCap className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Comunidad Educativa</h1>
                    <p className="text-gray-400">Capacitaciones y Formación Deportiva</p>
                  </div>
                </div>
                
                {/* Stats rápidas */}
                <div className="flex gap-4">
                  <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-center">
                    <p className="text-2xl font-bold text-[#00ff88]">{calcularProgresoTotal()}%</p>
                    <p className="text-xs text-gray-400">Progreso Total</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-center">
                    <p className="text-2xl font-bold text-blue-400">{seccionesData.length}</p>
                    <p className="text-xs text-gray-400">Secciones</p>
                  </div>
                </div>
              </motion.div>
            </div>

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
                          {Object.values(progresoUsuario).reduce((a, b) => a + b, 0)} de {seccionesData.reduce((a, s) => a + s.temasTotal, 0)} temas completados
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-[#00ff88]/20 text-[#00ff88] border-[#00ff88]/30">
                      Nivel: Principiante
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
                {seccionesData.map((seccion, index) => {
                  const IconComponent = seccion.icono;
                  const completados = progresoUsuario[seccion.id] || 0;
                  const porcentaje = Math.round((completados / seccion.temasTotal) * 100);
                  const estado = getEstadoSeccion(seccion.id, seccion.temasTotal);
                  
                  return (
                    <motion.div
                      key={seccion.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => router.push(`/capacitaciones/secciones/${seccion.id}`)}
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
                              {seccion.temasTotal} temas
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {seccion.duracionTotal}
                            </span>
                          </div>
                          
                          {/* Progreso */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-400">{completados}/{seccion.temasTotal} completados</span>
                              <span style={{ color: seccion.color }}>{porcentaje}%</span>
                            </div>
                            <Progress 
                              value={porcentaje} 
                              className="h-1.5 bg-white/10"
                              style={{ 
                                ['--progress-color' as any]: seccion.color 
                              }}
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
                  { nombre: "Primer Paso", descripcion: "Completa tu primer tema", icono: "🎯", desbloqueado: true },
                  { nombre: "Técnico", descripcion: "Completa Técnicas y Prácticas", icono: "⚽", desbloqueado: false },
                  { nombre: "Árbitro", descripcion: "Domina los reglamentos", icono: "🏆", desbloqueado: false },
                  { nombre: "Coach", descripcion: "Completa conferencias", icono: "📋", desbloqueado: false },
                  { nombre: "Políglota", descripcion: "Completa idiomas", icono: "🌍", desbloqueado: false },
                  { nombre: "Maestro", descripcion: "Completa todo", icono: "👑", desbloqueado: false },
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
      </div>
    </div>
  );
}
