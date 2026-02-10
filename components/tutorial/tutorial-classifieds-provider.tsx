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
    description: 'Descubre cómo comprar, vender e intercambiar con la comunidad SOS-HABILIDOSO. Te guiaremos paso a paso.',
    targetElement: 'center',
    position: 'center',
  },
  {
    id: 1,
    title: 'Explora Clasificados',
    description: 'Aquí puedes buscar productos, servicios y trabajos freelance publicados por la comunidad.',
    targetElement: '#tab-browse',
    position: 'bottom',
  },
  {
    id: 2,
    title: 'Busca lo que necesitas',
    description: 'Usa la barra de búsqueda para encontrar productos o servicios específicos.',
    targetElement: '#search-bar',
    position: 'bottom',
  },
  {
    id: 3,
    title: 'Filtra tus resultados',
    description: 'Aplica filtros para refinar tu búsqueda por categoría, precio, ubicación y más.',
    targetElement: '#filters-button',
    position: 'bottom',
  },
  {
    id: 4,
    title: 'Navega por categorías',
    description: 'Selecciona una categoría para ver clasificados específicos. Cada categoría muestra el número de anuncios disponibles.',
    targetElement: '#categories-pills',
    position: 'bottom',
  },
  {
    id: 5,
    title: 'Detalles del anuncio',
    description: 'Cada card muestra información clave: imagen, título, precio, ubicación, vendedor y estadísticas. Haz click en el ojo para ver más detalles.',
    targetElement: '#first-classified-card',
    position: 'top',
  },
  {
    id: 6,
    title: 'Guarda tus favoritos',
    description: 'Dale like a los anuncios que te interesen para guardarlos y verlos después.',
    targetElement: '.classified-card-like',
    position: 'left',
  },
  {
    id: 7,
    title: 'Gestiona tus anuncios',
    description: 'Aquí encontrarás todos tus anuncios publicados y podrás editarlos o pausarlos.',
    targetElement: '#tab-my-ads',
    position: 'bottom',
  },
  {
    id: 8,
    title: 'Busca oportunidades laborales',
    description: 'Explora ofertas de empleo o publica tu propia oferta para encontrar talento.',
    targetElement: '#tab-jobs',
    position: 'bottom',
  },
  {
    id: 9,
    title: 'Conecta con empresas',
    description: 'Networking empresarial para proyectos y colaboraciones profesionales.',
    targetElement: '#tab-enterprises',
    position: 'bottom',
  },
  {
    id: 10,
    title: 'Eventos culturales',
    description: 'Descubre y publica eventos culturales, deportivos y comunitarios.',
    targetElement: '#tab-cultural-agenda',
    position: 'bottom',
  },
  {
    id: 11,
    title: 'Crea tu primera publicación',
    description: '¡Es hora de publicar! Elige entre producto físico, servicio o trabajo freelancer.',
    targetElement: '#tab-create',
    position: 'bottom',
  },
  {
    id: 12,
    title: 'Elige el tipo de anuncio',
    description: 'Selecciona el tipo que mejor se adapte a lo que quieres ofrecer. Cada tipo tiene características específicas.',
    targetElement: '#publication-types',
    position: 'top',
  },
  {
    id: 13,
    title: '¡Tutorial completado!',
    description: 'Ya conoces todas las funcionalidades de Clasificados. ¡Comienza a explorar y publicar!',
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
    
    if (!tutorialCompleted) {
      // Iniciar el tutorial automáticamente después de 1 segundo
      const timer = setTimeout(() => {
        setIsActive(true);
      }, 1000);
      
      return () => clearTimeout(timer);
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
