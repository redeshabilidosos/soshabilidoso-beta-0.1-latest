"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hand, X, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import anime from 'animejs';

export function GestureTutorial() {
  const [show, setShow] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detectar si es móvil/tablet
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Mostrar tutorial de gestos solo si:
    // 1. Es móvil/tablet
    // 2. El tutorial principal ya se completó
    // 3. No se ha visto el tutorial de gestos antes
    const mainTutorialCompleted = localStorage.getItem('tutorial_completed');
    const gestureTutorialSeen = localStorage.getItem('gesture_tutorial_seen');
    
    if (window.innerWidth < 1024 && mainTutorialCompleted && !gestureTutorialSeen) {
      setTimeout(() => {
        setShow(true);
        animateGesture();
      }, 1000);
    }

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const animateGesture = () => {
    const hand = document.getElementById('gesture-tutorial-hand');
    if (!hand) return;

    // Animación de deslizamiento continuo
    anime({
      targets: hand,
      translateX: [100, -150, 100],
      opacity: [0, 1, 1, 1, 0],
      duration: 3000,
      easing: 'easeInOutQuad',
      loop: true,
      delay: 500
    });
  };

  const handleComplete = () => {
    setShow(false);
    localStorage.setItem('gesture_tutorial_seen', 'true');
  };

  if (!isMobile || !show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[2147483647] pointer-events-auto"
        style={{
          background: 'radial-gradient(circle at center, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 100%)'
        }}
      >
        {/* Card del tutorial */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md">
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="glass-card border-2 border-neon-green/50 p-6 rounded-2xl"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <Hand className="w-6 h-6 text-neon-green" />
                <h3 className="text-xl font-bold text-white">
                  ¡Navega con Gestos! 👆
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleComplete}
                className="text-gray-400 hover:text-white -mt-1 -mr-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Contenido */}
            <div className="space-y-4 mb-6">
              <p className="text-gray-300 text-sm leading-relaxed">
                En móvil y tablet, puedes navegar entre secciones deslizando el dedo:
              </p>

              <div className="bg-black/30 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">👈</div>
                  <div>
                    <p className="text-white font-semibold text-sm">Desliza a la izquierda</p>
                    <p className="text-gray-400 text-xs">Para ir a la siguiente sección</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-2xl">👉</div>
                  <div>
                    <p className="text-white font-semibold text-sm">Desliza a la derecha</p>
                    <p className="text-gray-400 text-xs">Para volver a la sección anterior</p>
                  </div>
                </div>
              </div>

              <div className="bg-neon-green/10 border border-neon-green/30 rounded-lg p-3">
                <p className="text-neon-green text-xs font-medium">
                  💡 Orden de navegación: Feed → Clips → Comunidades → Buscar → Notificaciones
                </p>
              </div>
            </div>

            {/* Botón */}
            <Button
              onClick={handleComplete}
              className="w-full bg-neon-green hover:bg-neon-green/80 text-black font-semibold"
            >
              ¡Entendido! 🚀
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>

        {/* Animación de mano deslizando */}
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2">
          <div 
            id="gesture-tutorial-hand"
            style={{
              filter: 'drop-shadow(0 0 15px rgba(0, 255, 136, 0.6))'
            }}
          >
            <Hand 
              size={80} 
              className="text-neon-green"
              style={{
                transform: 'rotate(-90deg)'
              }}
            />
          </div>
        </div>

        {/* Flechas indicadoras animadas */}
        <motion.div
          className="absolute bottom-32 left-8"
          animate={{
            x: [-15, 15, -15],
            opacity: [0.3, 1, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="text-neon-green text-5xl font-bold">←</div>
        </motion.div>

        <motion.div
          className="absolute bottom-32 right-8"
          animate={{
            x: [15, -15, 15],
            opacity: [0.3, 1, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="text-neon-green text-5xl font-bold">→</div>
        </motion.div>

        {/* Línea de deslizamiento */}
        <motion.div
          className="absolute bottom-44 left-1/2 -translate-x-1/2 h-1 bg-gradient-to-r from-transparent via-neon-green to-transparent"
          style={{ width: '60%' }}
          animate={{
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
