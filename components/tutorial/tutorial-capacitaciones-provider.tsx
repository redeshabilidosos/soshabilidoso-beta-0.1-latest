'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface TutorialStep {
  id: number;
  title: string;
  description: string;
  targetElement: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: string;
}

interface TutorialCapacitacionesContextType {
  currentStep: number;
  isActive: boolean;
  totalSteps: number;
  nextStep: () => void;
  prevStep: () => void;
  skipTutorial: () => void;
  startTutorial: () => void;
  getCurrentStep: () => TutorialStep | null;
}

const TutorialCapacitacionesContext = createContext<TutorialCapacitacionesContextType | undefined>(undefined);

const tutorialSteps: TutorialStep[] = [
  {
    id: 0,
    title: '¡Bienvenido a Capacitaciones! 🎓',
    description: 'Descubre la Comunidad Educativa donde podrás aprender técnicas deportivas, reglamentos, tácticas y mucho más. Te mostraremos cómo funciona paso a paso.',
    targetElement: 'center',
    position: 'center',
  },
  {
    id: 1,
    title: 'Tu Progreso de Aprendizaje 📊',
    description: 'Aquí puedes ver tu progreso general en todas las secciones. Completa temas para subir de nivel: Principiante → Aprendiz → Intermedio → Experto.',
    targetElement: '.progress-card',
    position: 'bottom',
  },
  {
    id: 2,
    title: 'Secciones de Aprendizaje 📚',
    description: 'Explora las 10 secciones disponibles: Técnicas y Prácticas, Escuelas de Formación, Reglamentos FIFA, Táctica y Estrategia, Preparación Física, y más. Cada sección tiene múltiples temas para aprender.',
    targetElement: '.secciones-grid',
    position: 'top',
  },
  {
    id: 3,
    title: 'Cards de Secciones 🎯',
    description: 'Cada card muestra: el nombre de la sección, descripción, número de temas, duración total y tu progreso. Haz clic en cualquier card para explorar sus temas.',
    targetElement: '.seccion-card:first-child',
    position: 'bottom',
  },
  {
    id: 4,
    title: 'Estados de Progreso 🏆',
    description: 'Las secciones tienen 3 estados: "No iniciado" (sin progreso), "En progreso" (algunos temas completados) y "Completado" (todos los temas terminados).',
    targetElement: '.seccion-card:first-child',
    position: 'bottom',
  },
  {
    id: 5,
    title: 'Logros Disponibles 🏅',
    description: 'Desbloquea logros al completar secciones y temas: Primer Paso, Técnico, Árbitro, Coach, Políglota y Maestro. ¡Colecciónalos todos!',
    targetElement: '.logros-section',
    position: 'top',
  },
  {
    id: 6,
    title: '¡Comienza a Aprender! 🚀',
    description: 'Haz clic en cualquier sección para ver sus temas. Completa los temas en orden para desbloquear el siguiente. ¡Cada tema incluye videos, texto y un quiz final!',
    targetElement: '.seccion-card:first-child',
    position: 'bottom',
  },
  {
    id: 7,
    title: '🎊 ¡FELICIDADES! 🎊',
    description: '¡Has completado el tutorial de Capacitaciones!\n\n✅ Conoces cómo funciona el progreso\n✅ Sabes explorar las secciones\n✅ Entiendes los estados y logros\n✅ Estás listo para aprender\n\n¡Comienza tu viaje educativo ahora!',
    targetElement: 'center',
    position: 'center',
  },
];

export function TutorialCapacitacionesProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Verificar si el usuario ya completó el tutorial
    const tutorialCompleted = localStorage.getItem('capacitaciones_tutorial_completed');
    
    console.log('🎓 Tutorial Capacitaciones - Estado:', {
      tutorialCompleted,
      isActive,
      currentStep,
      willStart: !tutorialCompleted
    });
    
    if (!tutorialCompleted) {
      // Iniciar el tutorial automáticamente después de 500ms
      const timer = setTimeout(() => {
        console.log('🎓 ✅ INICIANDO TUTORIAL DE CAPACITACIONES...');
        setIsActive(true);
      }, 500);
      
      return () => clearTimeout(timer);
    } else {
      console.log('🎓 ⏭️ Tutorial ya completado, no se iniciará automáticamente');
    }
  }, []);

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Tutorial completado
      completeTutorial();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const skipTutorial = () => {
    completeTutorial();
  };

  const startTutorial = () => {
    setCurrentStep(0);
    setIsActive(true);
  };

  const completeTutorial = () => {
    setIsActive(false);
    setCurrentStep(0);
    localStorage.setItem('capacitaciones_tutorial_completed', 'true');
  };

  const getCurrentStep = (): TutorialStep | null => {
    return tutorialSteps[currentStep] || null;
  };

  const value: TutorialCapacitacionesContextType = {
    currentStep,
    isActive,
    totalSteps: tutorialSteps.length,
    nextStep,
    prevStep,
    skipTutorial,
    startTutorial,
    getCurrentStep,
  };

  return (
    <TutorialCapacitacionesContext.Provider value={value}>
      {children}
    </TutorialCapacitacionesContext.Provider>
  );
}

export function useTutorialCapacitaciones() {
  const context = useContext(TutorialCapacitacionesContext);
  if (context === undefined) {
    throw new Error('useTutorialCapacitaciones must be used within a TutorialCapacitacionesProvider');
  }
  return context;
}
