'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTutorial } from './tutorial-provider';
import { X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import confetti from 'canvas-confetti';

/**
 * Componente de tutorial que se inserta en el flujo del documento
 * Se muestra debajo de las historias, antes de las publicaciones
 */
export function TutorialInlineCard() {
  const {
    isActive,
    currentStep,
    totalSteps,
    skipTutorial,
    nextStep,
    prevStep,
    completeTutorial,
    getCurrentStep,
  } = useTutorial();

  const step = getCurrentStep();
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  // Mostrar confeti cuando se llegue al paso final
  useEffect(() => {
    if (isActive && isLastStep && step?.id === 'completion') {
      console.log('🎊 Mostrando confeti de finalización');
      
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#00FF88', '#51C6E0', '#8B5CF6', '#FF6B9D']
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#00FF88', '#51C6E0', '#8B5CF6', '#FF6B9D']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    }
  }, [isActive, isLastStep, step, currentStep]);

  // Mostrar inline card en TODOS los pasos del tutorial
  // El card permanece visible desde el inicio hasta el final
  const shouldShowInline = isActive && step;

  // Detectar si estamos en móvil o tablet
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // < 1024px es móvil/tablet
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!shouldShowInline) return null;

  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="w-full my-6 relative"
    >
      {/* Flecha dinámica que apunta al botón correcto según el paso */}
      {(currentStep >= 1 && currentStep <= 10) && (
        <motion.div
          key={currentStep} // Key para forzar re-render en cada paso
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className={`fixed z-10 ${isMobile ? 'block' : 'hidden lg:block'}`}
          style={
            isMobile
              ? {
                  // En móvil/tablet: Flecha apuntando hacia abajo al botón específico del MobileNav
                  bottom: 'calc(64px + 10px)', // Justo encima del MobileNav (64px de altura + 10px de margen)
                  // Calcular posición horizontal según el botón del MobileNav
                  left:
                    currentStep === 1 // Inicio (Home)
                      ? '10%' // Botón Home (🏠) - Primer botón
                      : currentStep === 4 // Buscar
                      ? '23%' // Botón Buscar (🔍) - Segundo botón
                      : currentStep === 3 // Perfil (More/3 puntos)
                      ? '88%' // Botón More (⋯) - Último botón (derecha)
                      : currentStep === 8 // Comunidades (Users)
                      ? '36%' // Botón Users (👥) - Tercer botón
                      : currentStep === 6 // Clips (Play)
                      ? '62%' // Botón Play (▶️) - Quinto botón
                      : currentStep === 5 // Notificaciones (Bell)
                      ? '75%' // Botón Bell (🔔) - Sexto botón
                      : currentStep === 9 // Clasificados (More/3 puntos)
                      ? '88%' // Botón More (⋯) - Último botón (derecha)
                      : currentStep === 7 // En Vivo (Play o similar)
                      ? '62%' // Botón Play (▶️) - Quinto botón
                      : currentStep === 10 // Clasificados también
                      ? '88%' // Botón More (⋯) - Último botón (derecha)
                      : '50%', // Por defecto centro
                  transform: 'translateX(-50%)',
                  width: '100px',
                  height: '80px',
                }
              : {
                  // En desktop: Flecha saliendo desde el botón del sidebar hacia el card
                  left: '256px', // Desde el borde derecho del sidebar (256px de ancho)
                  width: '200px', // Flecha más larga
                  height: '100px',
                  // Calcular posición vertical según el botón específico del sidebar
                  top:
                    currentStep === 1 // Inicio
                      ? '80px' // Posición del botón Inicio
                      : currentStep === 3 // Perfil
                      ? '130px' // Posición del botón Perfil
                      : currentStep === 4 // Buscar
                      ? '180px' // Posición del botón Buscar
                      : currentStep === 5 // Notificaciones
                      ? '230px' // Posición del botón Notificaciones
                      : currentStep === 6 // Clips
                      ? '280px' // Posición del botón Clips
                      : currentStep === 7 // En Vivo
                      ? '330px' // Posición del botón En Vivo
                      : currentStep === 8 // Comunidades
                      ? '380px' // Posición del botón Comunidades
                      : currentStep === 9 // Clasificados
                      ? '430px' // Posición del botón Clasificados
                      : currentStep === 10 // Clasificados (si hay otro)
                      ? '480px' // Posición alternativa
                      : '200px', // Por defecto
                  transform: 'none', // Sin transformación
                }
          }
        >
          {isMobile ? (
            // Flecha hacia abajo para móvil/tablet
            <svg
              width="100"
              height="80"
              viewBox="0 0 100 80"
              className="text-white"
              style={{ filter: 'drop-shadow(0 0 10px rgba(0, 255, 136, 0.7))' }}
            >
              {/* Línea vertical hacia abajo */}
              <motion.path
                d="M 50 10 L 50 65"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
              />
              {/* Punta de flecha hacia abajo */}
              <motion.polygon
                points="45,60 50,70 55,60"
                fill="currentColor"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.3 }}
              />
              {/* Círculo pulsante en el origen */}
              <motion.circle
                cx="50"
                cy="10"
                r="5"
                fill="rgba(0, 255, 136, 0.8)"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.6, times: [0, 0.6, 1] }}
              />
            </svg>
          ) : currentStep !== 2 ? (
            // Flecha horizontal para desktop (desde el botón del sidebar hacia el card)
            <svg
              width="200"
              height="100"
              viewBox="0 0 200 100"
              className="text-white"
              style={{ filter: 'drop-shadow(0 0 10px rgba(0, 255, 136, 0.7))' }}
            >
              {/* Línea curva desde el botón del sidebar hacia el card */}
              <motion.path
                d="M 10 50 Q 80 30, 150 45 T 190 50"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
              />
              {/* Punta de flecha hacia la derecha */}
              <motion.polygon
                points="183,45 195,50 183,55"
                fill="currentColor"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.3 }}
              />
              {/* Círculo pulsante en el origen (botón del sidebar) */}
              <motion.circle
                cx="10"
                cy="50"
                r="5"
                fill="rgba(0, 255, 136, 0.8)"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.6, times: [0, 0.6, 1] }}
              />
            </svg>
          ) : null}
        </motion.div>
      )}

      {/* Flecha especial hacia arriba para Stories - DESHABILITADA */}
      {false && currentStep === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.5 }}
          className="absolute -top-24 left-1/2 -translate-x-1/2 z-10"
          style={{ width: '120px', height: '100px' }}
        >
          <svg width="120" height="100" viewBox="0 0 120 100" className="text-white" style={{ filter: 'drop-shadow(0 0 10px rgba(0, 255, 136, 0.7))' }}> 
            {/* Línea curva hacia arriba */}
            <motion.path
              d="M 60 95 Q 55 60, 60 25"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
            {/* Punta de flecha hacia arriba */}
            <motion.polygon
              points="55,30 60,18 65,30"
              fill="currentColor"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.3 }}
            />
            {/* Círculo pulsante en el origen */}
            <motion.circle
              cx="60"
              cy="95"
              r="5"
              fill="rgba(0, 255, 136, 0.8)"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.6, times: [0, 0.6, 1] }}
            />
          </svg>
        </motion.div>
      )}

      {/* Flecha especial hacia arriba para el botón "Nueva Publicación" en paso 12 */}
      {currentStep === 12 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.5 }}
          className="absolute -top-24 right-4 z-10"
          style={{ width: '120px', height: '100px' }}
        >
          <svg width="120" height="100" viewBox="0 0 120 100" className="text-white" style={{ filter: 'drop-shadow(0 0 10px rgba(0, 255, 136, 0.7))' }}> 
            {/* Línea curva hacia arriba */}
            <motion.path
              d="M 60 95 Q 55 60, 60 25"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
            {/* Punta de flecha hacia arriba */}
            <motion.polygon
              points="55,30 60,18 65,30"
              fill="currentColor"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.3 }}
            />
            {/* Círculo pulsante en el origen */}
            <motion.circle
              cx="60"
              cy="95"
              r="5"
              fill="rgba(0, 255, 136, 0.8)"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.6, times: [0, 0.6, 1] }}
            />
          </svg>
        </motion.div>
      )}

      {/* Flecha especial hacia arriba para las historias en paso 14 */}
      {currentStep === 14 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.5 }}
          className="absolute -top-24 left-1/2 -translate-x-1/2 z-10"
          style={{ width: '120px', height: '100px' }}
        >
          <svg width="120" height="100" viewBox="0 0 120 100" className="text-white" style={{ filter: 'drop-shadow(0 0 10px rgba(0, 255, 136, 0.7))' }}> 
            {/* Línea curva hacia arriba */}
            <motion.path
              d="M 60 95 Q 55 60, 60 25"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
            {/* Punta de flecha hacia arriba */}
            <motion.polygon
              points="55,30 60,18 65,30"
              fill="currentColor"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.3 }}
            />
            {/* Círculo pulsante en el origen */}
            <motion.circle
              cx="60"
              cy="95"
              r="5"
              fill="rgba(0, 255, 136, 0.8)"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.6, times: [0, 0.6, 1] }}
            />
          </svg>
        </motion.div>
      )}

      {/* Borde animado alrededor del card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute -inset-1 bg-gradient-to-r from-neon-green via-neon-blue to-neon-green rounded-2xl opacity-20 blur-sm"
        style={{
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }}
      />

      <Card className="relative bg-gradient-to-br from-gray-900/98 via-gray-900/95 to-gray-800/98 backdrop-blur-xl border-2 border-neon-green/50 shadow-2xl shadow-neon-green/20 overflow-hidden">
        <CardContent className="p-4 sm:p-6 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-5 h-5 text-neon-green flex-shrink-0" />
                </motion.div>
                <h3 className="text-base sm:text-lg font-bold text-white">{step.title}</h3>
              </div>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                {step.content}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={skipTutorial}
              className="text-gray-400 hover:text-white hover:bg-white/10 flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Paso {currentStep + 1} de {totalSteps}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-gray-800">
              <div
                className="h-full bg-gradient-to-r from-neon-green to-neon-blue transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </Progress>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-2 pt-2">
            <Button
              variant="outline"
              onClick={skipTutorial}
              size="sm"
              className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 text-gray-300"
            >
              Saltar tutorial
            </Button>
            
            <div className="flex gap-2">
              {!isFirstStep && (
                <Button
                  variant="outline"
                  onClick={prevStep}
                  size="sm"
                  className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Atrás
                </Button>
              )}
              
              <Button
                onClick={isLastStep ? completeTutorial : nextStep}
                size="sm"
                className="bg-gradient-to-r from-neon-green to-emerald-500 hover:from-neon-green/90 hover:to-emerald-500/90 text-black font-semibold"
              >
                {isLastStep ? (
                  <>
                    ¡Comenzar! 🚀
                  </>
                ) : currentStep === 12 ? (
                  <>
                    Entendido, voy a publicar
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </>
                ) : currentStep === 14 ? (
                  <>
                    Entendido, voy a crear historia
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </>
                ) : (
                  <>
                    Siguiente
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Indicador de teclado - Solo en desktop */}
          <div className="hidden sm:flex items-center justify-center gap-2 text-xs text-gray-500 pt-2 border-t border-gray-800/50">
            <span>💡 Usa</span>
            <kbd className="px-2 py-1 bg-gray-800 rounded border border-gray-700">←</kbd>
            <kbd className="px-2 py-1 bg-gray-800 rounded border border-gray-700">→</kbd>
            <span>para navegar</span>
            <span className="mx-2">|</span>
            <kbd className="px-2 py-1 bg-gray-800 rounded border border-gray-700">ESC</kbd>
            <span>para salir</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
