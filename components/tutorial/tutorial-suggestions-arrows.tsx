'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTutorial } from './tutorial-provider';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

/**
 * Componente especial para el paso 11 (Sugerencias)
 * Muestra un card flotante centrado (A) con flechas apuntando al sidebar derecho (B y C)
 * El sidebar derecho NO SE MUEVE de su posición
 */
export function TutorialSuggestionsArrows() {
  const { isActive, currentStep, nextStep, prevStep, skipTutorial, totalSteps } = useTutorial();

  // Solo mostrar en el paso 11
  const shouldShow = isActive && currentStep === 11;

  // Forzar scroll al inicio cuando se muestra el paso 11
  useEffect(() => {
    if (shouldShow) {
      // Scroll suave al inicio de la página
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [shouldShow]);

  if (!shouldShow) return null;

  return (
    <AnimatePresence>
      {/* Overlay oscuro de fondo */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9997]"
      />

      {/* Card de tutorial flotante en el centro (PUNTO A) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.4 }}
        className="fixed z-[9999] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px] px-4"
      >
        <div className="bg-gray-900/98 backdrop-blur-xl border-2 border-neon-green/50 rounded-2xl p-6 shadow-2xl shadow-neon-green/20 relative">
          {/* Botón cerrar */}
          <button
            onClick={skipTutorial}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
            <span className="text-2xl">👥</span>
            DESCUBRE NUEVAS CONEXIONES
          </h3>
          <div className="space-y-3 mb-4">
            <div>
              <h4 className="text-sm font-semibold text-neon-green mb-1">Sugerencias de Amigos</h4>
              <p className="text-gray-300 text-xs leading-relaxed">
                Descubre personas que podrían interesarte basadas en tus intereses y conexiones. Mira el sidebar derecho arriba →
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-neon-green mb-1">Comunidades Sugeridas</h4>
              <p className="text-gray-300 text-xs leading-relaxed">
                Encuentra comunidades que coincidan con tus intereses. Deportes, cultura, música y más. Mira el sidebar derecho →
              </p>
            </div>
          </div>

          {/* Barra de progreso */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
              <span>Paso {currentStep + 1} de {totalSteps}</span>
              <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}%</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-neon-green to-neon-blue transition-all duration-300"
                style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Botones de navegación */}
          <div className="flex items-center justify-between gap-2">
            <Button
              variant="outline"
              onClick={skipTutorial}
              size="sm"
              className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 text-gray-300"
            >
              Saltar tutorial
            </Button>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={prevStep}
                size="sm"
                className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Atrás
              </Button>
              
              <Button
                onClick={nextStep}
                size="sm"
                className="bg-gradient-to-r from-neon-green to-emerald-500 hover:from-neon-green/90 hover:to-emerald-500/90 text-black font-semibold"
              >
                Siguiente
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Flecha desde el card (A) hacia "Sugerencias para ti" (B) - BORDE DERECHO DEL CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="fixed z-[9998] hidden lg:block pointer-events-none"
        style={{
          top: 'calc(50% - 80px)', // Desde arriba del card
          left: 'calc(50% + 250px)', // Desde el borde derecho del card (500px/2 = 250px)
        }}
      >
        <svg width="300" height="120" viewBox="0 0 300 120" className="text-neon-green" style={{ filter: 'drop-shadow(0 0 12px rgba(0, 255, 136, 0.8))' }}>
          {/* Línea curva desde el card hacia arriba-derecha (hacia B) */}
          <motion.path
            d="M 10 60 Q 120 30, 220 45 T 290 50"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 }}
          />
          {/* Punta de flecha */}
          <motion.polygon
            points="283,45 295,50 283,55"
            fill="currentColor"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.3 }}
          />
          {/* Círculo pulsante en el origen (borde del card) */}
          <motion.circle
            cx="10"
            cy="60"
            r="6"
            fill="currentColor"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.3, 1] }}
            transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 2 }}
          />
        </svg>
      </motion.div>

      {/* Flecha desde el card (A) hacia "Comunidades para ti" (C) - BORDE DERECHO DEL CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="fixed z-[9998] hidden lg:block pointer-events-none"
        style={{
          top: 'calc(50% + 40px)', // Desde abajo del card
          left: 'calc(50% + 250px)', // Desde el borde derecho del card (500px/2 = 250px)
        }}
      >
        <svg width="300" height="120" viewBox="0 0 300 120" className="text-neon-green" style={{ filter: 'drop-shadow(0 0 12px rgba(0, 255, 136, 0.8))' }}>
          {/* Línea curva desde el card hacia abajo-derecha (hacia C) */}
          <motion.path
            d="M 10 60 Q 120 80, 220 65 T 290 60"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut", delay: 0.3, repeat: Infinity, repeatDelay: 1 }}
          />
          {/* Punta de flecha */}
          <motion.polygon
            points="283,55 295,60 283,65"
            fill="currentColor"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, duration: 0.3 }}
          />
          {/* Círculo pulsante en el origen (borde del card) */}
          <motion.circle
            cx="10"
            cy="60"
            r="6"
            fill="currentColor"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.3, 1] }}
            transition={{ duration: 0.8, delay: 0.3, repeat: Infinity, repeatDelay: 2 }}
          />
        </svg>
      </motion.div>
    </AnimatePresence>
  );
}
