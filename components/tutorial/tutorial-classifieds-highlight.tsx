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

        setHighlightStyle({
          position: 'absolute',
          top: `${rect.top + scrollTop - 8}px`,
          left: `${rect.left + scrollLeft - 8}px`,
          width: `${rect.width + 16}px`,
          height: `${rect.height + 16}px`,
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={highlightStyle}
        className="z-[9997]"
      >
        {/* Borde animado con efecto neon */}
        <div className="absolute inset-0 rounded-xl border-4 border-neon-green shadow-[0_0_20px_rgba(0,255,136,0.5)] animate-pulse" />
        
        {/* Esquinas decorativas */}
        <div className="absolute -top-2 -left-2 w-4 h-4 border-t-4 border-l-4 border-neon-green rounded-tl-lg" />
        <div className="absolute -top-2 -right-2 w-4 h-4 border-t-4 border-r-4 border-neon-green rounded-tr-lg" />
        <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-4 border-l-4 border-neon-green rounded-bl-lg" />
        <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-4 border-r-4 border-neon-green rounded-br-lg" />
      </motion.div>
    </AnimatePresence>
  );
}
