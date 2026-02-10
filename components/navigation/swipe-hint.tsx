"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { Hand } from 'lucide-react';

interface SwipeHintProps {
  show: boolean;
}

export function SwipeHint({ show }: SwipeHintProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 pointer-events-none lg:hidden"
          style={{
            zIndex: 2147483647,
            background: 'radial-gradient(circle at center, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)'
          }}
        >
          {/* Texto instructivo */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 text-center">
            <motion.p
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-white text-lg font-semibold mb-2"
            >
              Desliza para navegar
            </motion.p>
            <motion.p
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-300 text-sm"
            >
              ← Izquierda o Derecha →
            </motion.p>
          </div>

          {/* Mano animada */}
          <div 
            id="swipe-hint-hand"
            className="absolute top-1/2 left-1/2 -translate-y-1/2"
            style={{
              filter: 'drop-shadow(0 0 10px rgba(0, 255, 136, 0.5))'
            }}
          >
            <Hand 
              size={64} 
              className="text-neon-green"
              style={{
                transform: 'rotate(-90deg)'
              }}
            />
          </div>

          {/* Flechas indicadoras */}
          <motion.div
            className="absolute bottom-32 left-8"
            animate={{
              x: [-10, 10, -10],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="text-neon-green text-4xl">←</div>
          </motion.div>

          <motion.div
            className="absolute bottom-32 right-8"
            animate={{
              x: [10, -10, 10],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="text-neon-green text-4xl">→</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
