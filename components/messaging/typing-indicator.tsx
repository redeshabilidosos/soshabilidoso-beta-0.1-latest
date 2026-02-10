import { motion } from 'framer-motion';

interface TypingIndicatorProps {
  username: string;
  compact?: boolean; // Nueva prop para versión compacta
}

export function TypingIndicator({ username, compact = false }: TypingIndicatorProps) {
  // Versión compacta para mostrar arriba del input
  if (compact) {
    return (
      <div className="flex items-center gap-2 text-xs text-gray-400 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="flex items-center gap-1">
          <motion.div
            className="w-1.5 h-1.5 bg-neon-green rounded-full"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: 0,
            }}
          />
          <motion.div
            className="w-1.5 h-1.5 bg-neon-green rounded-full"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: 0.2,
            }}
          />
          <motion.div
            className="w-1.5 h-1.5 bg-neon-green rounded-full"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: 0.4,
            }}
          />
        </div>
        <span className="font-medium">{username} está escribiendo...</span>
      </div>
    );
  }

  // Versión original para mostrar en el área de mensajes
  return (
    <div className="flex items-end gap-2 mb-2">
      <div className="w-7 flex-shrink-0" />
      <div className="flex flex-col">
        <span className="text-xs text-gray-400 mb-1 ml-3">{username} está escribiendo...</span>
        <div className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-2xl rounded-bl-md">
          <div className="flex items-center gap-1">
            <motion.div
              className="w-2 h-2 bg-gray-400 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: 0,
              }}
            />
            <motion.div
              className="w-2 h-2 bg-gray-400 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: 0.2,
              }}
            />
            <motion.div
              className="w-2 h-2 bg-gray-400 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: 0.4,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
