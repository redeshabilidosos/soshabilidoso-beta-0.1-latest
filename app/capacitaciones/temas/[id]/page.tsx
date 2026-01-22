"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ArrowLeft, BookOpen, Clock, CheckCircle2, Play, ChevronRight,
  ChevronLeft, Trophy, Video, FileText, List, Award, Sparkles
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Sidebar } from "@/components/navigation/sidebar";
import { MobileNav } from "@/components/navigation/mobile-nav";
import { toast } from "sonner";
import { useForceBlackBackground } from "@/hooks/use-force-black-background";

// API URL
const API_URL = 'http://127.0.0.1:8000/api';

export default function TemaPage() {
  const router = useRouter();
  const params = useParams();
  const temaId = params.id as string;
  
  const [tema, setTema] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [completando, setCompletando] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

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
    const loadTema = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('access_token');
        const headers: any = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch(`${API_URL}/learning/temas/${temaId}/`, { headers });
        
        if (response.ok) {
          const data = await response.json();
          // Mapear datos del backend al formato esperado
          // Video por defecto para temas sin video configurado
          const defaultVideo = '/manejobalon.mp4';
          const videoUrl = data.video_url || data.video || defaultVideo;
          
          setTema({
            titulo: data.titulo,
            seccion: data.seccion_nombre || 'Sección',
            seccionId: data.seccion_slug || 'seccion',
            nivel: data.nivel,
            duracion: data.duracion,
            videoUrl: videoUrl,
            completado: data.completado || false,
            contenido: data.contenidos?.map((c: any) => ({
              subtitulo: c.subtitulo,
              texto: c.contenido
            })) || [],
            puntosClave: data.puntos_clave?.map((p: any) => p.texto) || [],
            temaAnterior: data.tema_anterior ? { id: data.tema_anterior.slug, titulo: data.tema_anterior.titulo } : null,
            temaSiguiente: data.tema_siguiente ? { id: data.tema_siguiente.slug, titulo: data.tema_siguiente.titulo } : null
          });
        } else {
          toast.error('Tema no encontrado');
          router.push('/capacitaciones');
        }
      } catch (error) {
        console.error('Error cargando tema:', error);
        toast.error('Error al cargar el tema');
      } finally {
        setLoading(false);
      }
    };
    loadTema();
  }, [temaId, router]);

  const handleMarcarCompletado = async () => {
    setCompletando(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Debes iniciar sesión');
        return;
      }
      
      const response = await fetch(`${API_URL}/learning/temas/${temaId}/marcar_completado/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        setTema({ ...tema, completado: true });
        setShowCompletionModal(true);
      } else {
        toast.error('Error al marcar como completado');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al marcar como completado');
    } finally {
      setCompletando(false);
    }
  };

  const handleSiguienteTema = () => {
    setShowCompletionModal(false);
    if (tema.temaSiguiente) {
      router.push(`/capacitaciones/temas/${tema.temaSiguiente.id}`);
    } else {
      // Si no hay siguiente tema, volver a la sección
      router.push(`/capacitaciones/secciones/${tema.seccionId}`);
    }
  };

  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case "basico": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "intermedio": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "avanzado": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  if (loading || !tema) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00ff88]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Sidebar />
      
      <main className="pb-24 lg:ml-64 lg:pb-0 pt-28 md:pt-12 lg:pt-6 relative z-10 min-h-screen">
        <div className="max-w-6xl mx-auto p-4 space-y-6">
            
            {/* Header */}
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={() => router.push(`/capacitaciones/secciones/${tema.seccionId}`)}
                className="mb-4 hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a {tema.seccion}
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Columna Principal (Contenido) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Título y Meta */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">{tema.seccion}</p>
                      <h1 className="text-2xl md:text-3xl font-bold">{tema.titulo}</h1>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getNivelColor(tema.nivel)}>
                        {tema.nivel}
                      </Badge>
                      <Badge variant="outline" className="border-white/20">
                        <Clock className="w-3 h-3 mr-1" />
                        {tema.duracion}
                      </Badge>
                    </div>
                  </div>
                  
                  {tema.completado && (
                    <div className="flex items-center gap-2 text-[#00ff88] mb-4">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="text-sm font-medium">Tema completado</span>
                    </div>
                  )}
                </motion.div>

                {/* Video */}
                {tema.videoUrl && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Card className="bg-black/40 border-white/10 overflow-hidden">
                      <div className="aspect-video">
                        {/* Detectar si es video local o embed de YouTube/Vimeo */}
                        {(() => {
                          const url = tema.videoUrl;
                          
                          // Convertir URL de YouTube a formato embed
                          if (url.includes('youtube.com/watch')) {
                            const videoId = new URL(url).searchParams.get('v');
                            return (
                              <iframe
                                src={`https://www.youtube.com/embed/${videoId}`}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            );
                          }
                          
                          // YouTube short URL
                          if (url.includes('youtu.be/')) {
                            const videoId = url.split('youtu.be/')[1]?.split('?')[0];
                            return (
                              <iframe
                                src={`https://www.youtube.com/embed/${videoId}`}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            );
                          }
                          
                          // Ya es URL embed de YouTube
                          if (url.includes('youtube.com/embed')) {
                            return (
                              <iframe
                                src={url}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            );
                          }
                          
                          // Vimeo
                          if (url.includes('vimeo.com')) {
                            const vimeoId = url.split('vimeo.com/')[1]?.split('?')[0];
                            return (
                              <iframe
                                src={`https://player.vimeo.com/video/${vimeoId}`}
                                className="w-full h-full"
                                allow="autoplay; fullscreen; picture-in-picture"
                                allowFullScreen
                              />
                            );
                          }
                          
                          // Video local o directo
                          // Si empieza con / es un archivo local en public, si empieza con http es externo
                          // Si es del backend (media), agregar el prefijo del servidor
                          let videoSrc = url;
                          if (url.startsWith('/media/')) {
                            videoSrc = `http://127.0.0.1:8000${url}`;
                          } else if (!url.startsWith('http') && !url.startsWith('/')) {
                            videoSrc = `/${url}`;
                          }
                          
                          return (
                            <video
                              src={videoSrc}
                              controls
                              className="w-full h-full object-contain bg-black"
                              preload="metadata"
                              playsInline
                            >
                              Tu navegador no soporta el elemento de video.
                            </video>
                          );
                        })()}
                      </div>
                    </Card>
                  </motion.div>
                )}

                {/* Contenido */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="bg-black/40 border-white/10">
                    <CardContent className="p-6">
                      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#00ff88]" />
                        Contenido del Tema
                      </h2>
                      
                      <div className="space-y-6">
                        {tema.contenido.map((seccion: any, index: number) => (
                          <div key={index}>
                            <h3 className="font-semibold text-white mb-2">{seccion.subtitulo}</h3>
                            <p className="text-gray-300 text-sm leading-relaxed">{seccion.texto}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Puntos Clave */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="bg-[#00ff88]/5 border-[#00ff88]/20">
                    <CardContent className="p-6">
                      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <List className="w-5 h-5 text-[#00ff88]" />
                        Puntos Clave
                      </h2>
                      
                      <ul className="space-y-2">
                        {tema.puntosClave.map((punto: string, index: number) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-[#00ff88] mt-0.5 flex-shrink-0" />
                            <span className="text-gray-300">{punto}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Sidebar Derecho */}
              <div className="lg:col-span-1 min-w-0">
                {/* Panel de Acciones */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="sticky top-4"
                >
                  <Card className="bg-black/60 border-white/10 overflow-hidden max-w-full">
                    <CardContent className="p-3 sm:p-4 space-y-3">
                      <h3 className="font-semibold flex items-center gap-2 text-xs sm:text-sm">
                        <Trophy className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                        <span className="truncate">Tu Progreso</span>
                      </h3>
                      
                      {!tema.completado ? (
                        <Button
                          onClick={handleMarcarCompletado}
                          disabled={completando}
                          className="w-full bg-[#00ff88] text-black hover:bg-[#00ff88]/80 text-xs"
                          size="sm"
                        >
                          {completando ? (
                            <span className="flex items-center gap-1">
                              <div className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                              <span>Guardando...</span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                              <span>Completar</span>
                            </span>
                          )}
                        </Button>
                      ) : (
                        <div className="space-y-2">
                          <div className="text-center py-2">
                            <Award className="w-8 h-8 text-yellow-400 mx-auto mb-1" />
                            <p className="text-xs text-[#00ff88] font-medium">¡Completado!</p>
                          </div>
                          
                          {tema.temaSiguiente && (
                            <Button
                              onClick={handleSiguienteTema}
                              className="w-full bg-[#00ff88] text-black hover:bg-[#00ff88]/80 text-xs"
                              size="sm"
                            >
                              <span className="flex items-center gap-1">
                                <span>Siguiente tema</span>
                                <ChevronRight className="w-3 h-3 flex-shrink-0" />
                              </span>
                            </Button>
                          )}
                        </div>
                      )}

                      {/* Navegación */}
                      {(tema.temaAnterior || tema.temaSiguiente) && (
                        <div className="border-t border-white/10 pt-3 space-y-2">
                          {tema.temaAnterior && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/capacitaciones/temas/${tema.temaAnterior.id}`)}
                              className="w-full justify-start border-white/20 text-xs overflow-hidden h-8"
                            >
                              <ChevronLeft className="w-3 h-3 mr-1 flex-shrink-0" />
                              <span className="truncate text-xs">{tema.temaAnterior.titulo}</span>
                            </Button>
                          )}
                          
                          {tema.temaSiguiente && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/capacitaciones/temas/${tema.temaSiguiente.id}`)}
                              className="w-full justify-end border-white/20 text-xs overflow-hidden h-8"
                            >
                              <span className="truncate text-xs">{tema.temaSiguiente.titulo}</span>
                              <ChevronRight className="w-3 h-3 ml-1 flex-shrink-0" />
                            </Button>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>

          </div>
        </main>

        <MobileNav />

        {/* Modal de Felicitaciones */}
        <Dialog open={showCompletionModal} onOpenChange={setShowCompletionModal}>
          <DialogContent className="max-w-md mx-auto bg-black/95 border-[#00ff88]/30 backdrop-blur-md">
            <div className="text-center py-6">
              {/* Animación de confeti */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 260, 
                  damping: 20,
                  duration: 0.6 
                }}
                className="mb-6"
              >
                <div className="relative">
                  <Trophy className="w-20 h-20 text-yellow-400 mx-auto" />
                  {/* Partículas animadas */}
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, x: 0, y: 0 }}
                      animate={{ 
                        scale: [0, 1, 0],
                        x: [0, (i % 2 === 0 ? 1 : -1) * (20 + i * 10)],
                        y: [0, -20 - i * 5]
                      }}
                      transition={{
                        duration: 1.5,
                        delay: 0.3 + i * 0.1,
                        repeat: Infinity,
                        repeatDelay: 2
                      }}
                      className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: i % 3 === 0 ? '#00ff88' : i % 3 === 1 ? '#fbbf24' : '#8b5cf6'
                      }}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Texto de felicitaciones */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-white mb-2">
                  ¡Felicitaciones!
                </h2>
                <p className="text-gray-300 mb-6">
                  Has completado este tema exitosamente
                </p>
              </motion.div>

              {/* Información del tema completado */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-[#00ff88]/10 border border-[#00ff88]/20 rounded-lg p-4 mb-6"
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-[#00ff88]" />
                  <span className="font-semibold text-white">{tema?.titulo}</span>
                </div>
                <p className="text-sm text-gray-400">{tema?.seccion}</p>
              </motion.div>

              {/* Botones de acción */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="space-y-3"
              >
                {tema?.temaSiguiente ? (
                  <Button
                    onClick={handleSiguienteTema}
                    className="w-full bg-[#00ff88] text-black hover:bg-[#00ff88]/80 font-semibold"
                  >
                    <span className="flex items-center gap-2">
                      Pasar al siguiente tema
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </Button>
                ) : (
                  <Button
                    onClick={() => router.push(`/capacitaciones/secciones/${tema?.seccionId}`)}
                    className="w-full bg-[#00ff88] text-black hover:bg-[#00ff88]/80 font-semibold"
                  >
                    <span className="flex items-center gap-2">
                      Volver a la sección
                      <Trophy className="w-4 h-4" />
                    </span>
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  onClick={() => setShowCompletionModal(false)}
                  className="w-full border-white/20 text-white hover:bg-white/10"
                >
                  Continuar revisando
                </Button>
              </motion.div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }