"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTutorialCommunities } from './tutorial-communities-provider';
import confetti from 'canvas-confetti';

const tutorialSteps = [
  {
    title: "¡Bienvenido a Comunidades! 🌟",
    description: "Descubre y únete a comunidades que comparten tus intereses. Te mostraremos cómo funciona todo.",
    target: null,
    position: "center" as const,
  },
  {
    title: "Explora las Categorías 🎯",
    description: "Aquí encontrarás comunidades organizadas por temas: Habilidosos, Deportes, Música, Tecnología y más.",
    target: ".categories-section",
    position: "bottom" as const,
  },
  {
    title: "Comunidades para Ti ✨",
    description: "Basándonos en tus intereses, te sugerimos comunidades que podrían gustarte.",
    target: ".suggested-section",
    position: "bottom" as const,
  },
  {
    title: "Comunidades Destacadas 🔥",
    description: "Las comunidades más activas y populares de la plataforma.",
    target: ".featured-section",
    position: "bottom" as const,
  },
  {
    title: "Busca Comunidades 🔍",
    description: "Usa el buscador para encontrar comunidades específicas por nombre o tema.",
    target: "#search-communities",
    position: "bottom" as const,
  },
  {
    title: "Cambia la Vista 📱",
    description: "Alterna entre vista de cuadrícula y lista según tu preferencia.",
    target: ".view-toggle",
    position: "left" as const,
  },
  {
    title: "Crea tu Comunidad ➕",
    description: "¿Tienes una idea? Crea tu propia comunidad y construye tu espacio.",
    target: ".create-community-btn",
    position: "left" as const,
  },
  {
    title: "¡Listo para Explorar! 🚀",
    description: "Ya conoces todo lo necesario. ¡Únete a comunidades y comienza a conectar con personas increíbles!",
    target: null,
    position: "center" as const,
  },
];

export const TutorialCommunitiesOverlay: React.FC = () => {
  const { currentStep, isActive, nextStep, prevStep, skipTutorial, completeTutorial } = useTutorialCommunities();

  const currentStepData = tutorialSteps[currentStep];
  const isLastStep = currentStep === tutorialSteps.length - 1;

  useEffect(() => {
    console.log('🎯 Tutorial overlay - isActive:', isActive, 'currentStep:', currentStep);
  }, [isActive, currentStep]);

  useEffect(() => {
    if (isActive && currentStepData?.target) {
      const element = document.querySelector(currentStepData.target);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentStep, isActive, currentStepData]);

  // Efecto de confeti en el último paso
  useEffect(() => {
    if (isActive && isLastStep) {
      const duration = 3000;
      const end = Date.now() + duration;

      const colors = ['#00FF88', '#51C6E0', '#8B5CF6', '#FF6B9D'];

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors: colors,
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
          colors: colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    }
  }, [isActive, isLastStep]);

  if (!isActive) return null;

  const handleNext = () => {
    if (isLastStep) {
      completeTutorial();
    } else {
      nextStep();
    }
  };

  return (
    <AnimatePresence>
      {isActive && (
        <>
          {/* Overlay oscuro */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-[10000]"
            onClick={skipTutorial}
          />

          {/* Highlight del elemento objetivo */}
          {currentStepData.target && (
            <TutorialHighlight target={currentStepData.target} />
          )}

          {/* Card del tutorial - Responsive y Centrado */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`fixed z-[10001] inset-x-0 flex items-center justify-center ${getPositionClasses(currentStepData)}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="glass-card border-2 border-neon-green/50 p-4 sm:p-6 w-[90vw] sm:w-[400px] md:w-[450px] max-w-md shadow-2xl mx-4">
              {/* Header */}
              <div className="flex items-start justify-between mb-4 gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Sparkles className="w-5 h-5 text-neon-green flex-shrink-0" />
                  <h3 className="text-base sm:text-lg font-bold text-white truncate">
                    {currentStepData.title}
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={skipTutorial}
                  className="text-gray-400 hover:text-white -mt-1 -mr-2 flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Descripción */}
              <p className="text-gray-300 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                {currentStepData.description}
              </p>

              {/* Progress dots */}
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                {tutorialSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 sm:h-2 rounded-full transition-all ${
                      index === currentStep
                        ? 'w-6 sm:w-8 bg-neon-green'
                        : index < currentStep
                        ? 'w-1.5 sm:w-2 bg-neon-green/50'
                        : 'w-1.5 sm:w-2 bg-gray-600'
                    }`}
                  />
                ))}
              </div>

              {/* Botones de navegación */}
              <div className="flex items-center justify-between gap-2 sm:gap-3">
                <Button
                  variant="ghost"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="text-gray-400 hover:text-white disabled:opacity-30 text-xs sm:text-sm px-2 sm:px-4"
                >
                  <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span className="hidden sm:inline">Anterior</span>
                  <span className="sm:hidden">Atrás</span>
                </Button>

                <span className="text-xs sm:text-sm text-gray-500 flex-shrink-0">
                  {currentStep + 1} / {tutorialSteps.length}
                </span>

                <Button
                  onClick={handleNext}
                  className="bg-neon-green hover:bg-neon-green/80 text-black font-semibold text-xs sm:text-sm px-3 sm:px-4"
                >
                  {isLastStep ? (
                    <>
                      <span className="hidden sm:inline">¡Comenzar! 🚀</span>
                      <span className="sm:hidden">¡Listo! 🚀</span>
                    </>
                  ) : (
                    <>
                      Siguiente
                      <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Componente para resaltar el elemento objetivo
const TutorialHighlight: React.FC<{ target: string }> = ({ target }) => {
  const [rect, setRect] = React.useState<DOMRect | null>(null);

  useEffect(() => {
    const updateRect = () => {
      const element = document.querySelector(target);
      if (element) {
        setRect(element.getBoundingClientRect());
      }
    };

    updateRect();
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect);

    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect);
    };
  }, [target]);

  if (!rect) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed z-[10000] pointer-events-none"
      style={{
        left: rect.left - 8,
        top: rect.top - 8,
        width: rect.width + 16,
        height: rect.height + 16,
      }}
    >
      <div className="w-full h-full rounded-xl border-4 border-neon-green shadow-[0_0_30px_rgba(0,255,136,0.5)] animate-pulse" />
    </motion.div>
  );
};

// Función para obtener las clases de posición del card - Respetando MobileNav en móvil
function getPositionClasses(step: typeof tutorialSteps[0]): string {
  if (step.position === 'center') {
    return 'top-1/2 -translate-y-1/2 inset-x-0';
  }
  
  if (step.position === 'bottom') {
    // En móvil más arriba para no quedar debajo del MobileNav
    return 'bottom-24 sm:bottom-8 md:bottom-12 inset-x-0';
  }
  
  if (step.position === 'left') {
    // En móvil/tablet centrado, en desktop a la derecha
    return 'top-1/2 -translate-y-1/2 inset-x-0 lg:justify-end lg:pr-8';
  }
  
  return 'top-1/2 -translate-y-1/2 inset-x-0';
}
