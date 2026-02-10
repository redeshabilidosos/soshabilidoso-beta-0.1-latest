"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface TutorialCommunitiesContextType {
  currentStep: number;
  isActive: boolean;
  startTutorial: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTutorial: () => void;
  completeTutorial: () => void;
  setLoadingComplete: (complete: boolean) => void;
}

const TutorialCommunitiesContext = createContext<TutorialCommunitiesContextType | undefined>(undefined);

export const useTutorialCommunities = () => {
  const context = useContext(TutorialCommunitiesContext);
  if (!context) {
    throw new Error('useTutorialCommunities must be used within TutorialCommunitiesProvider');
  }
  return context;
};

interface TutorialCommunitiesProviderProps {
  children: ReactNode;
}

export const TutorialCommunitiesProvider: React.FC<TutorialCommunitiesProviderProps> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    console.log('🔍 Estado del tutorial:', { loadingComplete, isActive });
  }, [loadingComplete, isActive]);

  useEffect(() => {
    // Auto-iniciar tutorial DESPUÉS de que termine la animación de carga
    const hasCompletedTutorial = localStorage.getItem('communities_tutorial_completed');
    console.log('📋 Tutorial completado previamente:', hasCompletedTutorial);
    
    if (!hasCompletedTutorial && loadingComplete) {
      console.log('🎓 Iniciando tutorial automáticamente después de la carga');
      // Esperar 2 segundos para asegurar que la animación de salida termine
      const timer = setTimeout(() => {
        console.log('✅ Activando tutorial ahora!');
        setIsActive(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [loadingComplete]);

  const startTutorial = () => {
    console.log('🎓 Iniciando tutorial de Comunidades manualmente');
    setCurrentStep(0);
    setIsActive(true);
  };

  const nextStep = () => {
    console.log('➡️ Siguiente paso del tutorial:', currentStep + 1);
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    console.log('⬅️ Paso anterior del tutorial:', currentStep - 1);
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const skipTutorial = () => {
    console.log('⏭️ Tutorial omitido');
    setIsActive(false);
    setCurrentStep(0);
    localStorage.setItem('communities_tutorial_completed', 'true');
  };

  const completeTutorial = () => {
    console.log('✅ Tutorial completado');
    setIsActive(false);
    setCurrentStep(0);
    localStorage.setItem('communities_tutorial_completed', 'true');
  };

  return (
    <TutorialCommunitiesContext.Provider
      value={{
        currentStep,
        isActive,
        startTutorial,
        nextStep,
        prevStep,
        skipTutorial,
        completeTutorial,
        setLoadingComplete,
      }}
    >
      {children}
    </TutorialCommunitiesContext.Provider>
  );
};
