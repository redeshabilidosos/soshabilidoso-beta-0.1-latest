'use client';

import React from 'react';
import Image from 'next/image';

interface SimpleLogoProps {
  logoSrc?: string;
  logoAlt?: string;
  logoWidth?: number;
  logoHeight?: number;
}

export function SimpleLogo({ logoSrc, logoAlt, logoWidth = 250, logoHeight = 250 }: SimpleLogoProps) {
  return (
    <div className="relative flex items-center justify-center">
      {/* Partículas flotantes */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full animate-pulse"
            style={{
              background: i % 3 === 0 ? '#00ff88' : i % 3 === 1 ? '#00ffff' : '#ff00ff',
              left: `${15 + (i * 8)}%`,
              top: `${25 + (i % 3) * 25}%`,
              boxShadow: `0 0 8px ${i % 3 === 0 ? '#00ff88' : i % 3 === 1 ? '#00ffff' : '#ff00ff'}`,
              animation: `float-particle ${2 + (i * 0.2)}s ease-in-out infinite`,
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>
      
      {/* Logo con efecto de levitación */}
      {logoSrc && (
        <div 
          className="relative z-10 cursor-pointer hover:scale-110 transition-transform duration-300"
          style={{
            animation: 'float-logo 3s ease-in-out infinite',
          }}
        >
          <Image
            src={logoSrc}
            alt={logoAlt || "Logo"}
            width={logoWidth}
            height={logoHeight}
            className="object-contain"
            style={{
              filter: 'drop-shadow(0 0 3px rgba(0, 255, 136, 0.6))',
            }}
            priority
            quality={75}
          />
        </div>
      )}
      
      {/* Estilos de animación */}
      <style jsx>{`
        @keyframes float-particle {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.4; }
          50% { transform: translateY(-15px) translateX(8px); opacity: 1; }
        }
        @keyframes float-logo {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </div>
  );
}