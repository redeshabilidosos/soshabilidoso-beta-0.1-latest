'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/components/providers/providers';
import { TutorialOverlay } from './tutorial-overlay';
import { TutorialHighlight } from './tutorial-highlight';

interface TutorialStep {
  id: string;
  target: string;
  title: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  page: string;
  action?: () => void;
}

interface TutorialContextType {
  isActive: boolean;
  currentStep: number;
  totalSteps: number;
  startTutorial: () => void;
  skipTutorial: () => void;
  nextStep: () => void;
  prevStep: () => void;
  completeTutorial: () => void;
  getCurrentStep: () => TutorialStep | null;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export const useTutorial = () => {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorial must be used within TutorialProvider');
  }
  return context;
};

// Definición de todos los pasos del tutorial
const tutorialSteps: TutorialStep[] = [
  // PASO 1: Bienvenida
  {
    id: 'welcome',
    target: 'body',
    title: '¡Bienvenido a SOS Habilidoso! 🚀',
    content: 'La red social futurista donde compartes tu pasión por el deporte, la cultura y tus habilidades. Déjanos mostrarte cómo funciona todo en solo 2 minutos.',
    placement: 'center',
    page: '/feed',
  },
  
  // PASO 2: Botón Inicio
  {
    id: 'sidebar-inicio',
    target: '[href="/feed"]',
    title: 'INICIO - Tu punto de partida 🏠',
    content: 'Desde aquí accedes a tu feed principal. Es donde verás todas las publicaciones de las personas que sigues y las comunidades a las que perteneces.',
    placement: 'right',
    page: '/feed',
  },
  
  // PASO 3: Stories
  {
    id: 'stories-slider',
    target: '#stories-slider',
    title: 'STORIES - Momentos que duran 24h ⏰',
    content: 'Comparte fotos y videos que desaparecen después de un día. Toca el círculo con + para crear tu primera historia. Desliza para ver las historias de tus amigos.',
    placement: 'bottom',
    page: '/feed',
  },
  
  // PASO 4: Botón Perfil
  {
    id: 'sidebar-perfil',
    target: '[href="/profile"]',
    title: 'PERFIL - Tu identidad digital 👤',
    content: 'Aquí personalizas tu perfil: foto, biografía, posición deportiva, estadísticas y logros. ¡Haz que tu perfil destaque!',
    placement: 'right',
    page: '/feed',
  },
  
  // PASO 5: Botón Buscar
  {
    id: 'sidebar-buscar',
    target: '[href="/users"]',
    title: 'BUSCAR - Encuentra personas 🔍',
    content: 'Busca usuarios, equipos y habilidosos. Descubre nuevas conexiones y expande tu red social.',
    placement: 'right',
    page: '/feed',
  },
  
  // PASO 6: Botón Notificaciones - MUY IMPORTANTE
  {
    id: 'sidebar-notificaciones',
    target: '[href="/notifications"]',
    title: 'NOTIFICACIONES - Mantente al día 🔔',
    content: 'Recibe alertas de: Likes y reacciones, Comentarios, Nuevos seguidores, Solicitudes de amistad, Actividad en comunidades. ¡Nunca te pierdas nada!',
    placement: 'right',
    page: '/feed',
  },
  
  // PASO 7: Botón Clips - MUY IMPORTANTE
  {
    id: 'sidebar-clips',
    target: '[href="/clips"]',
    title: 'CLIPS - Videos cortos virales 🎬',
    content: 'Descubre contenido viral en formato vertical. Desliza hacia arriba para ver más, dale like y comenta. ¡Entretenimiento sin fin! Crea tus propios clips y hazte viral.',
    placement: 'right',
    page: '/feed',
  },
  
  // PASO 8: Botón En Vivo - MUY IMPORTANTE
  {
    id: 'sidebar-envivo',
    target: '[href="/live"]',
    title: 'EN VIVO - Transmisiones en directo 📡',
    content: 'Transmite en vivo o mira transmisiones de otros usuarios. Interactúa en tiempo real con tu comunidad. Comparte partidos, entrenamientos, eventos culturales y más.',
    placement: 'right',
    page: '/feed',
  },
  
  // PASO 9: Botón Comunidades
  {
    id: 'sidebar-comunidades',
    target: '[href="/communities"]',
    title: 'COMUNIDADES - Encuentra tu tribu 🏘️',
    content: 'Únete a comunidades de: Deportes, Arte, Música, Gastronomía, Educación. Crea tu propia comunidad o únete a una existente.',
    placement: 'right',
    page: '/feed',
  },
  
  // PASO 10: Botón Clasificados - MUY IMPORTANTE
  {
    id: 'sidebar-clasificados',
    target: '[href="/classifieds"]',
    title: 'CLASIFICADOS - Marketplace completo 🛒',
    content: 'Marketplace: Compra y vende productos. Crowdfunding: Financia proyectos. Agenda Cultural: Eventos y actividades. Trabajos Freelancer: Encuentra o publica trabajos. ¡Todo en un solo lugar!',
    placement: 'right',
    page: '/feed',
  },
  
  // PASO 11: Botón Flotante de Mensajes - MUY IMPORTANTE
  {
    id: 'floating-messages-button',
    target: '#floating-messages-button',
    title: 'MENSAJES RÁPIDOS 💬',
    content: 'Acceso rápido a tus conversaciones. Chatea en tiempo real con tus amigos, envía fotos, videos y reacciona a mensajes. ¡Mantente conectado siempre!',
    placement: 'top',
    page: '/feed',
  },
  
  // PASO 14: Feed Principal
  {
    id: 'feed-header',
    target: '#feed-header',
    title: 'Este es tu FEED �',
    content: 'Aquí verás todas las publicaciones de las personas que sigues y las comunidades a las que perteneces. Las publicaciones se actualizan en tiempo real.',
    placement: 'bottom',
    page: '/feed',
  },
  
  // PASO 15: Crear Publicación
  {
    id: 'new-post-button',
    target: '#new-post-button',
    title: 'CREA TU PRIMERA PUBLICACIÓN �',
    content: 'Comparte lo que quieras: Texto, Fotos y videos, Podcasts, Transmisiones en vivo. ¡Exprésate sin límites!',
    placement: 'bottom',
    page: '/feed',
  },
  
  // PASO 16: Reacciones
  {
    id: 'post-reactions',
    target: '.post-reactions',
    title: 'REACCIONA A LAS PUBLICACIONES 🎭',
    content: 'No solo me gusta, tenemos 5 tipos de reacciones: Like, Celebration, Golazo, Laugh, Dislike. ¡Elige la que mejor exprese lo que sientes!',
    placement: 'top',
    page: '/feed',
  },
  
  // PASO 17: Comentarios
  {
    id: 'post-comments',
    target: '.post-comments',
    title: 'COMENTA Y CONVERSA 💭',
    content: 'Participa en las conversaciones: Deja tu opinión, Responde a otros comentarios, Menciona a tus amigos con @. ¡La comunidad te está esperando!',
    placement: 'top',
    page: '/feed',
  },
  
  // PASO 18: Botón Crear (móvil)
  {
    id: 'create-button-mobile',
    target: '#create-button-mobile',
    title: 'CREA CONTENIDO RÁPIDO ⚡',
    content: 'El botón + te permite crear: Publicación, Story, Reel/Clip, Transmisión en vivo. ¡Todo desde un solo lugar!',
    placement: 'top',
    page: '/feed',
  },
  
  // PASO 19: Finalización
  {
    id: 'completion',
    target: 'body',
    title: '¡FELICIDADES! 🎊',
    content: 'Ya conoces lo básico de SOS Habilidoso. Ahora es tu turno: Completa tu perfil, Sigue a usuarios interesantes, Únete a comunidades, Crea tu primera publicación. ¿Listo para comenzar tu aventura?',
    placement: 'center',
    page: '/feed',
  },
];

interface TutorialProviderProps {
  children: ReactNode;
}

export function TutorialProvider({ children }: TutorialProviderProps) {
  const { user } = useAuth();
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // Verificar si el usuario ya vio el tutorial
  useEffect(() => {
    if (typeof window === 'undefined' || !user) {
      setIsReady(false);
      return;
    }

    const currentPath = window.location.pathname;
    const isAuthPage = currentPath === '/' || currentPath === '/login' || currentPath === '/register';
    
    if (isAuthPage) {
      setIsReady(false);
      return;
    }

    setIsReady(true);
    
    const seen = localStorage.getItem(`tutorial_seen_${user.id}`);
    
    if (!seen) {
      const timer = setTimeout(() => {
        startTutorial();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const startTutorial = () => {
    setIsActive(true);
    setCurrentStep(0);
    
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const skipTutorial = () => {
    setIsActive(false);
    if (user) {
      localStorage.setItem(`tutorial_seen_${user.id}`, 'true');
    }
  };

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTutorial();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeTutorial = () => {
    setIsActive(false);
    if (user) {
      localStorage.setItem(`tutorial_seen_${user.id}`, 'true');
    }
  };

  const getCurrentStep = () => {
    return tutorialSteps[currentStep] || null;
  };

  const value: TutorialContextType = {
    isActive,
    currentStep,
    totalSteps: tutorialSteps.length,
    startTutorial,
    skipTutorial,
    nextStep,
    prevStep,
    completeTutorial,
    getCurrentStep,
  };

  return (
    <TutorialContext.Provider value={value}>
      {children}
      {isActive && isReady && user && (
        <>
          <TutorialOverlay />
          <TutorialHighlight />
        </>
      )}
    </TutorialContext.Provider>
  );
}
