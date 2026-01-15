'use client';

import { useEffect } from 'react';
import { backgroundColors } from '@/hooks/use-background-color';

export function BackgroundColorProvider() {
  useEffect(() => {
    // Inicializar el color de fondo al cargar la aplicación
    const savedColor = localStorage.getItem('background-color') || 'cyber-green';
    const color = backgroundColors.find(c => c.id === savedColor);
    
    if (color) {
      document.body.style.background = color.gradient;
      document.body.style.backgroundAttachment = 'fixed';
    }
  }, []);

  return null; // Este componente no renderiza nada
}