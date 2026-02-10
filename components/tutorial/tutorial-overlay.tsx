'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTutorial } from './tutorial-provider';
import { X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export function TutorialOverlay() {
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

  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [spotlightPosition, setSpotlightPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const overlayRef = useRef<HTMLDivElement>(null);

  const step = getCurrentStep();
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
  const isCenterPlacement = step?.placement === 'center';
  
  // Mostrar el overlay desde el paso 11 en adelante (ya no hay paso de sugerencias)
  // DESHABILITADO: Ahora usamos solo el inline card
  const shouldShowOverlay = false; // isActive && step && currentStep > 10;

  // Navegación con teclado
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        if (!isLastStep) nextStep();
        else completeTutorial();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (!isFirstStep) prevStep();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        skipTutorial();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, isFirstStep, isLastStep, nextStep, prevStep, completeTutorial, skipTutorial]);

  // Encontrar el elemento target y calcular posiciones
  useEffect(() => {
    if (!step || !isActive) return;

    const findAndPositionElement = () => {
      const element = document.querySelector(step.target) as HTMLElement;
      
      // SCROLL AUTOMÁTICO AL INICIO EN MÓVIL
      const isMobile = window.innerWidth < 768;
      const isSuggestionsStep = currentStep === 11 || currentStep === 12;
      
      // Solo hacer scroll al inicio en el primer paso, NO en sugerencias
      if (isMobile && currentStep === 0) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      
      if (element) {
        setTargetElement(element);
        
        const rect = element.getBoundingClientRect();
        const padding = 20;
        
        // Posición del spotlight
        setSpotlightPosition({
          top: rect.top - padding,
          left: rect.left - padding,
          width: rect.width + padding * 2,
          height: rect.height + padding * 2,
        });
        
        // Posición del tooltip - ESTRATEGIA MEJORADA: ARRIBA DEL FEED
        if (isCenterPlacement) {
          // Modal centrado
          setTooltipPosition({
            top: window.innerHeight / 2,
            left: window.innerWidth / 2,
          });
        } else {
          // Detectar dispositivo y calcular espacios
          const isMobile = window.innerWidth < 768;
          const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
          const isDesktop = window.innerWidth >= 1024;
          
          // Dimensiones del viewport disponible
          const viewportWidth = window.innerWidth;
          const viewportHeight = window.innerHeight;
          
          // Calcular sidebars según dispositivo
          const sidebarLeft = isDesktop ? 256 : 0;
          const sidebarRight = isDesktop ? 320 : 0;
          const contentWidth = viewportWidth - sidebarLeft - sidebarRight;
          
          // Dimensiones del tooltip responsivas
          let tooltipWidth = 380;
          if (isMobile) {
            tooltipWidth = Math.min(340, viewportWidth - 32); // Margen de 16px a cada lado
          } else if (isTablet) {
            tooltipWidth = Math.min(360, viewportWidth - 48);
          }
          
          const tooltipHeight = 280; // Altura estimada del tooltip
          const margin = isMobile ? 16 : 20;
          
          // ESTRATEGIA MÓVIL: SIEMPRE ARRIBA, FIJO
          // En móvil, ignorar la posición del elemento y mostrar siempre arriba
          const topOffsetMobile = 70; // Justo debajo del header en móvil
          const topOffsetTablet = 90;
          const topOffsetDesktop = 100;
          
          let top = 0;
          let left = 0;
          
          if (isMobile) {
            // EN MÓVIL: Posición fija arriba, sin importar dónde esté el elemento
            top = topOffsetMobile;
            left = (viewportWidth - tooltipWidth) / 2;
          } else {
            // EN TABLET Y DESKTOP: Posicionar relativo al elemento
            const spaceAbove = rect.top;
            const spaceBelow = viewportHeight - rect.bottom;
            const topOffset = isTablet ? topOffsetTablet : topOffsetDesktop;
            
            // Intentar posicionar arriba del elemento primero
            if (spaceAbove >= tooltipHeight + margin) {
              // Hay espacio arriba del elemento - POSICIÓN PREFERIDA
              top = rect.top - tooltipHeight - margin;
            } else if (rect.top > topOffset + tooltipHeight) {
              // Si el elemento está lo suficientemente abajo, posicionar arriba
              top = Math.max(topOffset, rect.top - tooltipHeight - margin);
            } else {
              // Si no hay espacio arriba, posicionar en la parte superior del viewport
              top = topOffset;
            }
            
            // Asegurar que no se salga por arriba o abajo
            top = Math.max(topOffset, Math.min(top, viewportHeight - tooltipHeight - margin));
            
            // Calcular posición horizontal
            if (isTablet) {
              // En tablet, centrar con más espacio
              left = (viewportWidth - tooltipWidth) / 2;
            } else {
              // En desktop, verificar si es paso de sugerencias
              if (isSuggestionsStep) {
                // Para sugerencias, posicionar en el área del sidebar derecho
                // Centrar en el espacio entre el contenido y el borde derecho
                const rightSidebarCenter = viewportWidth - sidebarRight / 2;
                left = rightSidebarCenter - tooltipWidth / 2;
                
                // Asegurar que no se salga del sidebar derecho
                const minLeft = viewportWidth - sidebarRight - tooltipWidth - margin;
                const maxLeft = viewportWidth - margin - tooltipWidth;
                left = Math.max(minLeft, Math.min(left, maxLeft));
              } else {
                // Para otros elementos, centrar en el área de contenido (entre sidebars)
                const contentCenterX = sidebarLeft + contentWidth / 2;
                left = contentCenterX - tooltipWidth / 2;
                
                // Asegurar que no se salga del área de contenido
                const minLeft = sidebarLeft + margin;
                const maxLeft = viewportWidth - sidebarRight - tooltipWidth - margin;
                left = Math.max(minLeft, Math.min(left, maxLeft));
              }
            }
          }
          
          setTooltipPosition({ top, left });
        }
      } else {
        // Si no encuentra el elemento, mostrar en el centro o arriba según dispositivo
        const isMobile = window.innerWidth < 768;
        const viewportWidth = window.innerWidth;
        const tooltipWidth = isMobile ? Math.min(340, viewportWidth - 32) : 380;
        
        if (isMobile) {
          // En móvil, mostrar arriba aunque no encuentre el elemento
          setTooltipPosition({
            top: 70,
            left: (viewportWidth - tooltipWidth) / 2,
          });
        } else {
          // En desktop/tablet, centrar
          setTooltipPosition({
            top: window.innerHeight / 2,
            left: window.innerWidth / 2,
          });
        }
      }
    };

    // Esperar un poco para que el DOM se actualice
    const timer = setTimeout(findAndPositionElement, 100);
    
    // Recalcular en resize y scroll
    window.addEventListener('resize', findAndPositionElement);
    window.addEventListener('scroll', findAndPositionElement, true);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', findAndPositionElement);
      window.removeEventListener('scroll', findAndPositionElement, true);
    };
  }, [step, isActive, currentStep, isCenterPlacement]);

  // Confetti en el último paso
  useEffect(() => {
    if (isLastStep && isActive) {
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#00FF88', '#00D9FF', '#8B5CF6'],
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#00FF88', '#00D9FF', '#8B5CF6'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    }
  }, [isLastStep, isActive]);

  // Scroll al elemento si está fuera de vista (solo en desktop/tablet)
  // DESHABILITADO para sugerencias (pasos 11-12) para no mover el contenido
  useEffect(() => {
    if (targetElement && !isCenterPlacement) {
      const isMobile = window.innerWidth < 768;
      const isSuggestionsStep = currentStep === 11 || currentStep === 12;
      
      // En móvil NO hacer scroll, el tooltip está fijo arriba
      // En sugerencias NO hacer scroll, están en el sidebar derecho
      // En desktop/tablet SÍ hacer scroll al elemento (excepto sugerencias)
      if (!isMobile && !isSuggestionsStep) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }, [targetElement, isCenterPlacement, currentStep]);

  if (!shouldShowOverlay || !step) return null;

  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <AnimatePresence>
      <motion.div
        ref={overlayRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] pointer-events-none"
      >
        {/* Overlay oscuro con spotlight */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm">
          {!isCenterPlacement && targetElement && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="absolute rounded-2xl"
              style={{
                top: spotlightPosition.top,
                left: spotlightPosition.left,
                width: spotlightPosition.width,
                height: spotlightPosition.height,
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 255, 136, 0.3)',
                border: '2px solid rgba(0, 255, 136, 0.5)',
                pointerEvents: 'none',
              }}
            />
          )}
        </div>

        {/* Tooltip */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
          className="absolute pointer-events-auto z-[10000]"
          style={{
            top: isCenterPlacement ? '50%' : tooltipPosition.top,
            left: isCenterPlacement ? '50%' : tooltipPosition.left,
            transform: isCenterPlacement ? 'translate(-50%, -50%)' : 'none',
            width: isCenterPlacement 
              ? 'min(90%, 500px)' 
              : window.innerWidth < 768
                ? 'min(calc(100vw - 32px), 340px)' // Móvil
                : window.innerWidth < 1024
                  ? 'min(calc(100vw - 48px), 360px)' // Tablet
                  : '380px', // Desktop
            maxWidth: '100%',
          }}
        >
          <Card className="bg-gray-900/98 backdrop-blur-xl border-2 border-neon-green/50 shadow-2xl shadow-neon-green/20 overflow-hidden">
            <CardContent className="p-3 sm:p-4 space-y-2.5 sm:space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-1.5">
                    <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neon-green flex-shrink-0" />
                    <h3 className="text-xs sm:text-sm md:text-base font-bold text-white line-clamp-1">{step.title}</h3>
                  </div>
                  <p className="text-gray-300 text-[11px] sm:text-xs leading-relaxed line-clamp-3 sm:line-clamp-4">
                    {step.content}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={skipTutorial}
                  className="text-gray-400 hover:text-white hover:bg-white/10 flex-shrink-0 h-6 w-6 sm:h-7 sm:w-7"
                >
                  <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </Button>
              </div>

              {/* Progress Bar */}
              <div className="space-y-0.5 sm:space-y-1">
                <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-gray-400">
                  <span>Paso {currentStep + 1} de {totalSteps}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-0.5 sm:h-1 bg-gray-800">
                  <div
                    className="h-full bg-gradient-to-r from-neon-green to-neon-blue transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </Progress>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between gap-1.5 sm:gap-2 pt-0.5 sm:pt-1">
                <Button
                  variant="outline"
                  onClick={skipTutorial}
                  size="sm"
                  className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 text-gray-300 text-[10px] sm:text-[11px] h-7 sm:h-8 px-2 sm:px-3"
                >
                  Saltar
                </Button>
                
                <div className="flex gap-1 sm:gap-1.5">
                  {!isFirstStep && (
                    <Button
                      variant="outline"
                      onClick={prevStep}
                      size="sm"
                      className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 text-[10px] sm:text-[11px] h-7 sm:h-8 px-1.5 sm:px-2"
                    >
                      <ChevronLeft className="w-3 h-3 sm:mr-0.5" />
                      <span className="hidden sm:inline">Atrás</span>
                    </Button>
                  )}
                  
                  <Button
                    onClick={isLastStep ? completeTutorial : nextStep}
                    size="sm"
                    className="bg-gradient-to-r from-neon-green to-emerald-500 hover:from-neon-green/90 hover:to-emerald-500/90 text-black font-semibold text-[10px] sm:text-[11px] h-7 sm:h-8 px-2 sm:px-3"
                  >
                    {isLastStep ? (
                      <>
                        <span className="hidden sm:inline">¡Comenzar! 🚀</span>
                        <span className="sm:hidden">🚀 Listo</span>
                      </>
                    ) : (
                      <>
                        <span className="hidden sm:inline">Siguiente</span>
                        <ChevronRight className="w-3 h-3 sm:ml-0.5" />
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Indicador de teclado - Solo en desktop */}
              <div className="hidden sm:block text-[9px] text-gray-500 text-center pt-1 border-t border-gray-800/50">
                💡 Usa ← → para navegar | ESC para salir
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Flecha apuntando al elemento (solo si no es center) */}
        {!isCenterPlacement && targetElement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute pointer-events-none"
            style={{
              top: spotlightPosition.top + spotlightPosition.height / 2,
              left: spotlightPosition.left + spotlightPosition.width / 2,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-4 h-4 rounded-full bg-neon-green shadow-lg shadow-neon-green/50"
            />
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
