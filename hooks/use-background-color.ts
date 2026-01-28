'use client';

import { useState, useEffect } from 'react';

export interface BackgroundColor {
  id: string;
  name: string;
  gradient: string;
  preview: string;
}

export const backgroundColors: BackgroundColor[] = [
  {
    id: 'cyber-black ',
    name: 'Cyber Verde',
    gradient: '#000000',
    preview: '#00ff88'
  },
  {
    id: 'ocean-blue',
    name: 'Azul Océano',
    gradient: '#1e2a3a',
    preview: '#0088ff'
  },
  {
    id: 'fire-red',
    name: 'Rojo Fuego',
    gradient: '#2a1010',
    preview: '#ff4444'
  },
  {
    id: 'blackout',
    name: 'Blackout',
    gradient: '#151515',
    preview: '#666666'
  },
  {
    id: 'purple-night',
    name: 'Noche Púrpura',
    gradient: '#2a1540',
    preview: '#8800ff'
  },
  {
    id: 'golden-sunset',
    name: 'Atardecer Dorado',
    gradient: '#3a2510',
    preview: '#ffaa00'
  }
];

export function useBackgroundColor() {
  const [selectedColor, setSelectedColor] = useState<string>('cyber-green');

  useEffect(() => {
    // Cargar el color guardado del localStorage
    const saved = localStorage.getItem('background-color');
    if (saved && backgroundColors.find(c => c.id === saved)) {
      setSelectedColor(saved);
    }
  }, []);

  useEffect(() => {
    // Aplicar el gradiente al body
    const color = backgroundColors.find(c => c.id === selectedColor);
    if (color) {
      document.body.style.background = color.gradient;
      document.body.style.backgroundAttachment = 'fixed';
      // Guardar en localStorage
      localStorage.setItem('background-color', selectedColor);
      
      // Disparar evento personalizado para notificar el cambio
      window.dispatchEvent(new CustomEvent('background-color-changed', {
        detail: { colorId: selectedColor }
      }));
    }
  }, [selectedColor]);

  const changeBackgroundColor = (colorId: string) => {
    const color = backgroundColors.find(c => c.id === colorId);
    if (color) {
      setSelectedColor(colorId);
    }
  };

  return {
    selectedColor,
    backgroundColors,
    changeBackgroundColor,
  };
}