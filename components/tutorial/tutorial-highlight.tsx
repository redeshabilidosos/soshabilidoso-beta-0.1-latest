'use client';

import { useEffect } from 'react';
import { useTutorial } from './tutorial-provider';

/**
 * Componente que agrega resaltado a los elementos del sidebar durante el tutorial
 */
export function TutorialHighlight() {
  const { isActive, currentStep, getCurrentStep } = useTutorial();
  const step = getCurrentStep();

  useEffect(() => {
    if (!isActive || !step) {
      // Limpiar todos los resaltados
      document.querySelectorAll('.tutorial-highlight').forEach(el => {
        el.classList.remove('tutorial-highlight');
      });
      return;
    }

    // Limpiar resaltados anteriores
    document.querySelectorAll('.tutorial-highlight').forEach(el => {
      el.classList.remove('tutorial-highlight');
    });

    // Agregar resaltado al elemento actual
    const element = document.querySelector(step.target) as HTMLElement;
    if (element) {
      element.classList.add('tutorial-highlight');
    }

    // Cleanup al desmontar
    return () => {
      document.querySelectorAll('.tutorial-highlight').forEach(el => {
        el.classList.remove('tutorial-highlight');
      });
    };
  }, [isActive, currentStep, step]);

  // Agregar estilos globales
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const styleId = 'tutorial-highlight-styles';
    let styleElement = document.getElementById(styleId);

    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      styleElement.innerHTML = `
        .tutorial-highlight {
          position: relative;
          animation: tutorial-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .tutorial-highlight::before {
          content: '';
          position: absolute;
          inset: -4px;
          border: 3px solid rgba(0, 255, 136, 0.6);
          border-radius: 12px;
          pointer-events: none;
          z-index: 1;
          box-shadow: 
            0 0 20px rgba(0, 255, 136, 0.4),
            inset 0 0 20px rgba(0, 255, 136, 0.1);
        }
        
        .tutorial-highlight::after {
          content: '';
          position: absolute;
          inset: -8px;
          border: 2px solid rgba(0, 255, 136, 0.3);
          border-radius: 14px;
          pointer-events: none;
          z-index: 0;
          animation: tutorial-glow 2s ease-in-out infinite;
        }
        
        @keyframes tutorial-pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }
        
        @keyframes tutorial-glow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.05);
          }
        }
      `;
      document.head.appendChild(styleElement);
    }

    return () => {
      const style = document.getElementById(styleId);
      if (style) {
        style.remove();
      }
    };
  }, []);

  return null;
}
