'use client';

import React, { useEffect, useState } from 'react';
import { TruncatedIcosahedron } from './truncated-icosahedron';

interface SplashScreenProps {
  onAnimationComplete: () => void;
}

export function SplashScreen({ onAnimationComplete }: SplashScreenProps) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      onAnimationComplete();
    }, 1200); // Tiempo suficiente para ver la animación

    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  if (!showSplash) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-gradient-to-br from-cyber-dark via-cyber-gray to-cyber-light text-white">
      {/* Icosaedro truncado (balón) con el logo dentro */}
      <div className="relative">
        <TruncatedIcosahedron 
          logoSrc="/logo sos@3x.png"
          logoAlt="SOS-HABILIDOSO Logo"
          logoWidth={200}
          logoHeight={200}
        />
      </div>
      
      {/* Mensaje de carga */}
      <p className="text-xl text-gray-300 mt-8 animate-pulse">
        Cargando Habilidades...
      </p>
    </div>
  );
}