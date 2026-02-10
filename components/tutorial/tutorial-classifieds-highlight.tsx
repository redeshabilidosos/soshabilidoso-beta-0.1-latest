'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTutorialClassifieds } from './tutorial-classifieds-provider';

export function TutorialClassifiedsHighlight() {
  const { isActive, getCurrentStep } = useTutorialClassifieds();
  const [highlightStyle, setHighlightStyle] = useState<React.CSSProperties>({});
  const [showHighlight, setShowHighlight] = useState(false);

  const step = getCurrentStep();

  useEffect(() => {
    if (!isActive || !step || step.targetElement === 'center') {
      setShowHighlight(false);
      return;
    }

    const updateHighlight = () => {
      const element = document.querySelector(step.targetElement);
      
      if (element) {
        const rect = element.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

        // Padding más grande para encasillar mejor
        const padding = 12;

        setHighlightStyle({
          position: 'absolute',
          top: `${rect.top + scrollTop - padding}px`,
          left: `${rect.left + scrollLeft - padding}px`,
          width: `${rect.width + (padding * 2)}px`,
          height: `${rect.height + (padding * 2)}px`,
          pointerEvents: 'none',
        });
        setShowHighlight(true);
      } else {
        setShowHighlight(false);
      }
    };

    updateHighlight();
    window.addEventListener('resize', updateHighlight);
    window.addEventListener('scroll', updateHighlight);

    return () => {
      window.removeEventListener('resize', updateHighlight);
      window.removeEventListener('scroll', updateHighlight);
    };
  }, [step, isActive]);

  if (!showHighlight) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        style={highlightStyle}
        className="z-[9997]"
      >
        {/* Borde principal más grueso con doble efecto */}
        <div className="absolute inset-0 rounded-2xl border-[6px] border-neon-green shadow-[0_0_30px_rgba(0,255,136,0.8),inset_0_0_20px_rgba(0,255,136,0.3)] animate-pulse" />
        
        {/* Borde exterior adicional para más énfasis */}
        <div className="absolute inset-[-4px] rounded-2xl border-2 border-neon-green/40" />
        
        {/* Esquinas decorativas más grandes */}
        <div className="absolute -top-3 -left-3 w-6 h-6 border-t-[5px] border-l-[5px] border-neon-green rounded-tl-xl shadow-[0_0_15px_rgba(0,255,136,0.8)]" />
        <div className="absolute -top-3 -right-3 w-6 h-6 border-t-[5px] border-r-[5px] border-neon-green rounded-tr-xl shadow-[0_0_15px_rgba(0,255,136,0.8)]" />
        <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-[5px] border-l-[5px] border-neon-green rounded-bl-xl shadow-[0_0_15px_rgba(0,255,136,0.8)]" />
        <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-[5px] border-r-[5px] border-neon-green rounded-br-xl shadow-[0_0_15px_rgba(0,255,136,0.8)]" />
        
        {/* Puntos de luz en las esquinas */}
        <div className="absolute -top-1 -left-1 w-3 h-3 bg-neon-green rounded-full shadow-[0_0_10px_rgba(0,255,136,1)] animate-ping" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-neon-green rounded-full shadow-[0_0_10px_rgba(0,255,136,1)] animate-ping" style={{ animationDelay: '0.5s' }} />
        <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-neon-green rounded-full shadow-[0_0_10px_rgba(0,255,136,1)] animate-ping" style={{ animationDelay: '1s' }} />
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-neon-green rounded-full shadow-[0_0_10px_rgba(0,255,136,1)] animate-ping" style={{ animationDelay: '1.5s' }} />
      </motion.div>
    </AnimatePresence>
  );
}
