'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
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
  onPostCreated: () => void;
  onStoryCreated: () => void;
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

  // PASO 6: Botón Notificaciones
  {
    id: 'sidebar-notificaciones',
    target: '[href="/notifications"]',
    title: 'NOTIFICACIONES - Mantente al día 🔔',
    content: 'Recibe alertas de: Likes y reacciones, Comentarios, Nuevos seguidores, Solicitudes de amistad, Actividad en comunidades. ¡Nunca te pierdas nada!',
    placement: 'right',
    page: '/feed',
  },

  // PASO 7: Botón Clips
  {
    id: 'sidebar-clips',
    target: '[href="/clips"]',
    title: 'CLIPS - Videos cortos virales 🎬',
    content: 'Descubre contenido viral en formato vertical. Desliza hacia arriba para ver más, dale like y comenta. ¡Entretenimiento sin fin! Crea tus propios clips y hazte viral.',
    placement: 'right',
    page: '/feed',
  },

  // PASO 8: Botón En Vivo
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

  // PASO 10: Botón Clasificados
  {
    id: 'sidebar-clasificados',
    target: '[href="/classifieds"]',
    title: 'CLASIFICADOS - Marketplace completo 🛒',
    content: 'Marketplace: Compra y vende productos. Crowdfunding: Financia proyectos. Agenda Cultural: Eventos y actividades. Trabajos Freelancer: Encuentra o publica trabajos. ¡Todo en un solo lugar!',
    placement: 'right',
    page: '/feed',
  },

  // PASO 11: Feed Principal - Explicación detallada
  {
    id: 'feed-explained',
    target: '#feed-header',
    title: 'ESTE ES TU FEED PRINCIPAL 📰',
    content: 'Aquí verás todas las publicaciones de las personas que sigues y las comunidades a las que perteneces.\n\nLas publicaciones se actualizan en tiempo real. ¡Es tu página de inicio!\n\n👉 Ahora vamos a crear tu primera publicación...',
    placement: 'bottom',
    page: '/feed',
  },

  // PASO 12: Botón Nueva Publicación - MUY ESPECÍFICO
  {
    id: 'new-post-button',
    target: '#new-post-button',
    title: '🎯 PASO 1: CREA TU PRIMERA PUBLICACIÓN',
    content: '👆 HAZ CLIC EN EL BOTÓN "NUEVA PUBLICACIÓN" de arriba.\n\nEscribe algo como:\n💭 "¡Hola comunidad! Soy nuevo aquí"\n📸 O sube una foto\n🎥 O comparte un video\n\n¡Cualquier cosa que quieras compartir!\n\n⏳ Después de publicar, continuaremos automáticamente...',
    placement: 'bottom',
    page: '/feed',
  },

  // PASO 13: Esperando creación de publicación
  {
    id: 'waiting-post',
    target: 'body',
    title: '⏳ ESPERANDO TU PUBLICACIÓN...',
    content: '📝 Escribe tu mensaje en el formulario que se abrió\n\n💡 CONSEJO: Puede ser algo simple como:\n• "¡Hola a todos!"\n• "Mi primera publicación"\n• O sube una imagen\n\n👉 Cuando termines, haz clic en "PUBLICAR"\n\n✨ El tutorial avanzará automáticamente cuando publiques',
    placement: 'center',
    page: '/feed',
  },

  // PASO 14: Stories - Mejores Momentos - MUY ESPECÍFICO
  {
    id: 'stories-create',
    target: '#stories-slider',
    title: '🎯 PASO 2: CREA TU PRIMERA HISTORIA',
    content: '¡Excelente! Ya creaste tu primera publicación 🎉\n\nAhora vamos con las HISTORIAS:\n\n👆 HAZ CLIC EN EL CÍRCULO CON "+" (arriba en las historias)\n\n✨ Las historias duran 24 horas\n📸 Sube una foto o video\n🏆 Comparte momentos especiales\n\n⏳ Después de publicar tu historia, finalizaremos...',
    placement: 'bottom',
    page: '/feed',
  },

  // PASO 15: Esperando creación de historia
  {
    id: 'waiting-story',
    target: 'body',
    title: '⏳ ESPERANDO TU HISTORIA...',
    content: '📸 Sube una foto o video en el formulario que se abrió\n\n💡 CONSEJO:\n• Puede ser cualquier imagen\n• O un video corto\n• ¡Lo que quieras compartir por 24 horas!\n\n👉 Cuando termines, haz clic en "PUBLICAR HISTORIA"\n\n✨ El tutorial finalizará automáticamente cuando publiques',
    placement: 'center',
    page: '/feed',
  },

  // PASO 16: Finalización con Confetti
  {
    id: 'completion',
    target: 'body',
    title: '🎊 ¡FELICIDADES, HABILIDOSO! 🎊',
    content: '¡LO LOGRASTE! Has completado el tutorial completo:\n\n✅ Creaste tu primera publicación\n✅ Creaste tu primera historia\n✅ Conoces todas las funciones principales\n✅ Exploraste la navegación\n✅ Descubriste las comunidades\n\n🚀 ¡Ahora estás listo para conquistar SOS Habilidoso!\n\n💪 Ve y comparte tus habilidades con el mundo',
    placement: 'center',
    page: '/feed',
  },
]

interface TutorialProviderProps {
  children: ReactNode;
}

export function TutorialProvider({ children }: TutorialProviderProps) {
  const { user } = useAuth();
  const pathname = usePathname();
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // Verificar si el usuario ya vio el tutorial
  useEffect(() => {
    if (typeof window === 'undefined' || !user) {
      setIsReady(false);
      return;
    }

    // Páginas donde NO se debe mostrar el tutorial
    const excludedPages = [
      '/',
      '/login',
      '/register',
      '/profile', // Excluir página de perfil
      '/settings',
      '/communities',
      '/classifieds'
    ];
    
    const isExcludedPage = excludedPages.some(page => pathname === page || pathname?.startsWith(page + '/'));
    
    if (isExcludedPage) {
      setIsReady(false);
      setIsActive(false); // Asegurar que se desactive
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
  }, [user, pathname]);

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
      const nextStepIndex = currentStep + 1;
      setCurrentStep(nextStepIndex);
      
      // Si avanzamos desde el paso 12 (new-post-button) al 13 (waiting-post), 
      // NO abrir el diálogo automáticamente, dejar que el usuario lo haga
      
      // Si avanzamos desde el paso 14 (stories-create) al 15 (waiting-story),
      // NO abrir el diálogo automáticamente, dejar que el usuario lo haga
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
    
    // Mostrar confeti
    if (typeof window !== 'undefined') {
      // Usar canvas-confetti si está disponible
      import('canvas-confetti').then((confetti) => {
        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
          confetti.default({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#00FF88', '#51C6E0', '#8B5CF6', '#FF6B9D']
          });
          confetti.default({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#00FF88', '#51C6E0', '#8B5CF6', '#FF6B9D']
          });

          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        };

        frame();
      }).catch(() => {
        console.log('Confetti no disponible');
      });
    }
  };

  const getCurrentStep = () => {
    return tutorialSteps[currentStep] || null;
  };

  const onPostCreated = () => {
    console.log('🎯 onPostCreated llamado, currentStep:', currentStep, 'isActive:', isActive);
    // Si estamos en el paso 12 (new-post-button) o 13 (waiting-post), avanzar automáticamente
    if (isActive && (currentStep === 12 || currentStep === 13)) {
      console.log('✅ Publicación creada, avanzando al siguiente paso desde paso', currentStep);
      setTimeout(() => {
        nextStep();
      }, 1000);
    } else {
      console.log('⚠️ No se avanza: isActive=', isActive, 'currentStep=', currentStep);
    }
  };

  const onStoryCreated = () => {
    console.log('🎯 onStoryCreated llamado, currentStep:', currentStep, 'isActive:', isActive);
    // Si estamos en el paso 14 (stories-create) o 15 (waiting-story), avanzar automáticamente
    if (isActive && (currentStep === 14 || currentStep === 15)) {
      console.log('✅ Historia creada, avanzando al paso final desde paso', currentStep);
      setTimeout(() => {
        nextStep();
      }, 1000);
    } else {
      console.log('⚠️ No se avanza: isActive=', isActive, 'currentStep=', currentStep);
    }
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
    onPostCreated,
    onStoryCreated,
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
