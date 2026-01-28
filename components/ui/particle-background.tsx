'use client';

import { useEffect } from 'react';
import { useParticleBackground } from '@/hooks/use-particle-background';

export function ParticleBackground() {
  useEffect(() => {
    console.log('🎨 Componente ParticleBackground montado');
  }, []);
  
  useParticleBackground();
  return null;
}
