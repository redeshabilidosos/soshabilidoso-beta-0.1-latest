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

interface TutorialClassifiedsContextType {
  currentStep: number;
  isActive: boolean;
  totalSteps: number;
  nextStep: () => void;
  prevStep: () => void;
  skipTutorial: () => void;
  startTutorial: () => void;
  getCurrentStep: () => TutorialStep | null;
}

const TutorialClassifiedsContext = createContext<TutorialClassifiedsContextType | undefined>(undefined);

const tutorialSteps: TutorialStep[] = [
  {
    id: 0,
    title: '¡Bienvenido a Clasificados!',
    description: 'Descubre las 6 secciones principales de Clasificados. Te mostraremos cada una paso a paso.',
    targetElement: 'center',
    position: 'center',
  },
  {
    id: 1,
    title: 'Explorar - Posición 2',
    description: 'Busca y descubre productos, servicios y trabajos publicados por la comunidad. Aquí encontrarás todo lo que necesitas.',
    targetElement: '#tab-browse',
    position: 'bottom',
  },
  {
    id: 2,
    title: 'Mis Ads - Posición 3',
    description: 'Gestiona todos tus anuncios publicados. Edita, pausa o elimina tus publicaciones desde aquí.',
    targetElement: '#tab-my-ads',
    position: 'bottom',
  },
  {
    id: 3,
    title: 'Empleos - Posición 4',
    description: 'Explora ofertas de empleo o publica tu propia oferta para encontrar el talento que necesitas.',
    targetElement: '#tab-jobs',
    position: 'bottom',
  },
  {
    id: 4,
    title: 'Conexión - Posición 5',
    description: 'Networking empresarial. Conecta con empresas para proyectos y colaboraciones profesionales.',
    targetElement: '#tab-enterprises',
    position: 'bottom',
  },
  {
    id: 5,
    title: 'Agenda - Posición 6',
    description: 'Descubre y publica eventos culturales, deportivos y comunitarios. Mantente al día con la comunidad.',
    targetElement: '#tab-cultural-agenda',
    position: 'bottom',
  },
  {
    id: 6,
    title: 'Publicar - Posición 7',
    description: '¡Crea tu primera publicación! Elige entre producto físico, servicio marketplace o trabajo freelancer.',
    targetElement: '#tab-create',
    position: 'bottom',
  },
  {
    id: 7,
    title: '🎊 ¡FELICIDADES! 🎊',
    description: '¡Has completado el tutorial de Clasificados!\n\n✅ Conoces las 6 secciones principales\n✅ Sabes cómo explorar productos y servicios\n✅ Puedes publicar tus propios anuncios\n✅ Estás listo para conectar con la comunidad\n\n¡Comienza a explorar y publicar ahora!',
    targetElement: 'center',
    position: 'center',
  },
];

export function TutorialClassifiedsProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Verificar si el usuario ya completó el tutorial
    const tutorialCompleted = localStorage.getItem('classifieds_tutorial_completed');
    
    console.log('🎓 Tutorial Clasificados - Estado:', {
      tutorialCompleted,
      isActive,
      currentStep,
      willStart: !tutorialCompleted
    });
    
    if (!tutorialCompleted) {
      // Iniciar el tutorial automáticamente después de 500ms (más rápido)
      const timer = setTimeout(() => {
        console.log('🎓 ✅ INICIANDO TUTORIAL DE CLASIFICADOS...');
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
    localStorage.setItem('classifieds_tutorial_completed', 'true');
  };

  const getCurrentStep = (): TutorialStep | null => {
    return tutorialSteps[currentStep] || null;
  };

  const value: TutorialClassifiedsContextType = {
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
    <TutorialClassifiedsContext.Provider value={value}>
      {children}
    </TutorialClassifiedsContext.Provider>
  );
}

export function useTutorialClassifieds() {
  const context = useContext(TutorialClassifiedsContext);
  if (context === undefined) {
    throw new Error('useTutorialClassifieds must be used within a TutorialClassifiedsProvider');
  }
  return context;
}
