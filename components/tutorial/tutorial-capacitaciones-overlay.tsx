'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTutorialCapacitaciones } from './tutorial-capacitaciones-provider';
import { X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';

export function TutorialCapacitacionesOverlay() {
  const { currentStep, isActive, totalSteps, nextStep, prevStep, skipTutorial, getCurrentStep } = useTutorialCapacitaciones();
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isCenter, setIsCenter] = useState(false);

  const step = getCurrentStep();
  const isLastStep = currentStep === totalSteps - 1;

  // Efecto de confeti en el último paso
  useEffect(() => {
    if (isActive && isLastStep && step?.id === 7) {
      console.log('🎊 Mostrando confeti en tutorial de capacitaciones');
      
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
  }, [isActive, isLastStep, step]);

  useEffect(() => {
    console.log('🎯 Tutorial Overlay - Estado:', {
      isActive,
      step: step?.title,
      targetElement: step?.targetElement
    });
  }, [isActive, step]);

  useEffect(() => {
    if (!isActive || !step) return;

    const updatePosition = () => {
      if (step.targetElement === 'center') {
        setIsCenter(true);
        return;
      }

      // En móvil, siempre centrar o mostrar en la parte inferior
      const isMobile = window.innerWidth < 640;
      
      if (isMobile) {
        setIsCenter(true);
        return;
      }

      setIsCenter(false);
      const element = document.querySelector(step.targetElement);
      
      if (element) {
        const rect = element.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

        let top = 0;
        let left = 0;

        // Ajustar posición según el viewport
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const cardWidth = 384; // max-w-md = 384px
        const cardHeight = 400; // altura estimada del card

        switch (step.position) {
          case 'top':
            top = rect.top + scrollTop - 180;
            left = Math.max(cardWidth / 2, Math.min(viewportWidth - cardWidth / 2, rect.left + scrollLeft + rect.width / 2));
            break;
          case 'bottom':
            top = rect.bottom + scrollTop + 20;
            left = Math.max(cardWidth / 2, Math.min(viewportWidth - cardWidth / 2, rect.left + scrollLeft + rect.width / 2));
            break;
          case 'left':
            top = rect.top + scrollTop + rect.height / 2;
            left = Math.max(cardWidth / 2, rect.left + scrollLeft - 320);
            break;
          case 'right':
            top = rect.top + scrollTop + rect.height / 2;
            left = Math.min(viewportWidth - cardWidth / 2, rect.right + scrollLeft + 20);
            break;
        }

        // Verificar si el card se desborda y centrarlo si es necesario
        const wouldOverflowTop = top < 20;
        const wouldOverflowBottom = (top + cardHeight) > (scrollTop + viewportHeight - 20);
        const wouldOverflowLeft = (left - cardWidth / 2) < 20;
        const wouldOverflowRight = (left + cardWidth / 2) > (viewportWidth - 20);

        if (wouldOverflowTop || wouldOverflowBottom || wouldOverflowLeft || wouldOverflowRight) {
          // Si se desborda, centrar el card
          setIsCenter(true);
          return;
        }

        setPosition({ top, left });

        // Scroll suave al elemento
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        // Si no encuentra el elemento, centrar
        setIsCenter(true);
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [step, isActive]);

  // Manejar teclas
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        nextStep();
      } else if (e.key === 'ArrowLeft') {
        prevStep();
      } else if (e.key === 'Escape') {
        skipTutorial();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, nextStep, prevStep, skipTutorial]);

  if (!isActive || !step) return null;

  console.log('🎯 RENDERIZANDO OVERLAY:', {
    isActive,
    step: step.title,
    targetElement: step.targetElement,
    position: step.position
  });

  return (
    <AnimatePresence>
      {/* Overlay oscuro */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-[9998]"
        onClick={skipTutorial}
      />

      {/* Card del tutorial */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', damping: 20 }}
        className={`fixed z-[9999] ${
          isCenter 
            ? 'inset-x-0 top-0 flex items-start justify-center pt-20 p-4' 
            : 'px-4 sm:px-0'
        }`}
        style={!isCenter ? { 
          top: `${position.top}px`, 
          left: `${position.left}px`,
          transform: 'translateX(-50%)'
        } : {}}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-2 border-neon-green/50 rounded-2xl shadow-2xl shadow-neon-green/20 p-4 sm:p-6 w-full max-w-[calc(100vw-2rem)] sm:max-w-md">
          {/* Header */}
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-neon-green/20 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-neon-green" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base sm:text-lg font-bold text-white truncate">{step.title}</h3>
                <p className="text-xs text-gray-400">
                  Paso {currentStep + 1} de {totalSteps}
                </p>
              </div>
            </div>
            <button
              onClick={skipTutorial}
              className="text-gray-400 hover:text-white transition-colors p-1 flex-shrink-0"
              aria-label="Cerrar tutorial"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Descripción */}
          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 whitespace-pre-line">
            {step.description}
          </p>

          {/* Progress bar */}
          <div className="mb-4 sm:mb-6">
            <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-neon-green to-neon-blue"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="text-gray-400 hover:text-white disabled:opacity-30 w-full sm:w-auto text-xs sm:text-sm"
            >
              <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Anterior
            </Button>

            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={skipTutorial}
                className="border-white/20 text-gray-300 hover:bg-white/10 flex-1 sm:flex-none text-xs sm:text-sm"
              >
                Saltar
              </Button>
              
              <Button
                size="sm"
                onClick={nextStep}
                className="bg-neon-green text-black hover:bg-neon-green/80 font-semibold flex-1 sm:flex-none text-xs sm:text-sm"
              >
                {currentStep === totalSteps - 1 ? '¡Comenzar! 🚀' : 'Siguiente'}
                {currentStep < totalSteps - 1 && <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />}
              </Button>
            </div>
          </div>

          {/* Hint de teclado - solo visible en desktop */}
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/10 hidden sm:block">
            <p className="text-xs text-gray-500 text-center">
              Usa las flechas ← → o Enter para navegar • ESC para salir
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
