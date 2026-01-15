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

// Datos de ejemplo - En producción vendrían del backend
const seccionesDetalle: { [key: string]: any } = {
  "tecnicas-practicas": {
    nombre: "Técnicas y Prácticas",
    descripcion: "Métodos y ejercicios para desarrollar habilidades individuales y colectivas en el fútbol",
    color: "#00ff88",
    temas: [
      { id: "control-balon", titulo: "Control y Dominio del Balón", descripcion: "Técnicas con diferentes superficies del pie", duracion: "45 min", nivel: "basico", completado: true },
      { id: "conduccion-regate", titulo: "Conducción y Regate", descripcion: "Cambios de ritmo y dirección", duracion: "40 min", nivel: "basico", completado: true },
      { id: "pase", titulo: "Técnicas de Pase", descripcion: "Pase corto, largo, con efecto y al espacio", duracion: "35 min", nivel: "intermedio", completado: true },
      { id: "tiro-remate", titulo: "Tiro y Remate", descripcion: "Potencia, colocación y volea", duracion: "50 min", nivel: "intermedio", completado: false },
      { id: "cabeceo", titulo: "Técnica de Cabeceo", descripcion: "Cabeceo ofensivo y defensivo", duracion: "30 min", nivel: "intermedio", completado: false },
      { id: "tecnica-defensiva", titulo: "Técnica Defensiva", descripcion: "Entrada, marcaje y anticipación", duracion: "45 min", nivel: "avanzado", completado: false },
      { id: "tecnica-portero", titulo: "Técnica del Portero", descripcion: "Posición, blocaje y despejes", duracion: "55 min", nivel: "avanzado", completado: false },
    ]
  },
  "reglamentos-fifa": {
    nombre: "Reglamentos FIFA",
    descripcion: "Leyes del Juego establecidas por la FIFA - reglas universales del deporte",
    color: "#f59e0b",
    temas: [
      { id: "reglas-basicas", titulo: "Reglas Fundamentales", descripcion: "11 jugadores, duración, objetivo del juego", duracion: "30 min", nivel: "basico", completado: true },
      { id: "terreno-juego", titulo: "El Terreno de Juego", descripcion: "Dimensiones, marcas y equipamiento", duracion: "25 min", nivel: "basico", completado: true },
      { id: "infracciones", titulo: "Infracciones y Sanciones", descripcion: "Faltas, tarjetas y tiros libres", duracion: "35 min", nivel: "intermedio", completado: false },
      { id: "fuera-juego", titulo: "Fuera de Juego (Offside)", descripcion: "Posición adelantada y excepciones", duracion: "40 min", nivel: "intermedio", completado: false },
      { id: "reanudaciones", titulo: "Reanudaciones del Juego", descripcion: "Saques, córners y penales", duracion: "30 min", nivel: "basico", completado: false },
      { id: "var", titulo: "VAR y Tecnología", descripcion: "Video Assistant Referee", duracion: "25 min", nivel: "avanzado", completado: false },
    ]
  }
};

// Datos por defecto para secciones no definidas
const defaultSeccion = {
  nombre: "Sección",
  descripcion: "Contenido educativo",
  color: "#00ff88",
  temas: [
    { id: "tema-1", titulo: "Tema 1", descripcion: "Descripción del tema", duracion: "30 min", nivel: "basico", completado: false },
    { id: "tema-2", titulo: "Tema 2", descripcion: "Descripción del tema", duracion: "30 min", nivel: "basico", completado: false },
  ]
};

export default function SeccionPage() {
  const router = useRouter();
  const params = useParams();
  const seccionId = params.id as string;
  
  const [seccion, setSeccion] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar datos de la sección
    const loadSeccion = async () => {
      setLoading(true);
      // TODO: Cargar desde API
      const data = seccionesDetalle[seccionId] || { ...defaultSeccion, nombre: seccionId };
      setSeccion(data);
      setLoading(false);
    };
    loadSeccion();
  }, [seccionId]);

  if (loading || !seccion) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00ff88]"></div>
      </div>
    );
  }

  const temasCompletados = seccion.temas.filter((t: any) => t.completado).length;
  const porcentaje = Math.round((temasCompletados / seccion.temas.length) * 100);

  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case "basico": return "bg-green-500/20 text-green-400";
      case "intermedio": return "bg-yellow-500/20 text-yellow-400";
      case "avanzado": return "bg-red-500/20 text-red-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

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
          <div className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 pb-24 md:pb-8 relative z-10">
            
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
                        {temasCompletados}/{seccion.temas.length} temas
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
                  onClick={() => router.push(`/capacitaciones/temas/${tema.id}`)}
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
                        <Button
                          variant="ghost"
                          size="sm"
                          className={tema.completado ? "text-[#00ff88]" : "text-gray-400"}
                        >
                          {tema.completado ? "Repasar" : "Iniciar"}
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
