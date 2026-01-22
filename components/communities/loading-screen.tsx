"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
  isDataLoaded?: boolean;
}

export function LoadingScreen({ onLoadingComplete, isDataLoaded = false }: LoadingScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    // Marcar que la animación terminó después de 1.5 segundos (duración del giro 3D)
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Ocultar cuando AMBOS: animación completa Y datos cargados
    if (animationComplete && isDataLoaded) {
      setIsVisible(false);
      onLoadingComplete?.();
    }
  }, [animationComplete, isDataLoaded, onLoadingComplete]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed flex items-center justify-center overflow-hidden"
      style={{ 
        zIndex: 9999,
        inset: '0px',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        backgroundColor: '#000000',
        background: '#000000'
      }}
    >
      {/* Partículas flotantes */}
      <div className="absolute pointer-events-none" style={{ inset: '0px', top: 0, left: 0, right: 0, bottom: 0 }}>
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 rounded-full"
            style={{
              background:
                i % 3 === 0
                  ? "#00ff88"
                  : i % 3 === 1
                  ? "#00ffff"
                  : "#ff00ff",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: `0 0 15px ${
                i % 3 === 0
                  ? "#00ff88"
                  : i % 3 === 1
                  ? "#00ffff"
                  : "#ff00ff"
              }`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, i % 2 === 0 ? 20 : -20, 0],
              opacity: [0.2, 1, 0.2],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Logo con rotación 3D invertida */}
      <div className="relative z-10">
        <motion.div
          className="relative"
          style={{
            perspective: "1000px",
          }}
        >
          <motion.img
            src="/logo sos@3x.png"
            alt="SOS Habilidoso"
            className="h-48 md:h-64 object-contain"
            style={{
              transformStyle: "preserve-3d",
              filter: "drop-shadow(0 0 20px rgba(0,255,136,0.8))",
            }}
            animate={{
              rotateY: [0, -360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotateY: {
                duration: 1.5,
                ease: "easeInOut",
              },
              scale: {
                duration: 1.5,
                ease: "easeInOut",
              },
            }}
          />

          {/* Anillo de luz giratorio */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              border: "2px solid transparent",
              borderTopColor: "#00ff88",
              borderRightColor: "#00ffff",
            }}
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </motion.div>

        {/* Texto de carga */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.p
            className="text-[#00ff88] font-bold text-xl"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            Cargando Comunidades...
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
}
