'use client';

import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { 
  X, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Radio,
  Camera,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreateMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectType: (type: 'post' | 'reel' | 'story' | 'live' | 'photo') => void;
}

const createOptions = [
  {
    id: 'post',
    name: 'Publicación',
    description: 'Comparte texto, fotos o videos',
    icon: FileText,
    color: 'from-blue-500 to-cyan-500',
    iconColor: 'text-blue-400'
  },
  {
    id: 'reel',
    name: 'Reel',
    description: 'Video corto vertical',
    icon: Video,
    color: 'from-purple-500 to-pink-500',
    iconColor: 'text-purple-400'
  },
  {
    id: 'story',
    name: 'Estado',
    description: 'Comparte un momento temporal',
    icon: Camera,
    color: 'from-orange-500 to-red-500',
    iconColor: 'text-orange-400'
  },
  {
    id: 'photo',
    name: 'Foto',
    description: 'Sube una o varias fotos',
    icon: ImageIcon,
    color: 'from-green-500 to-emerald-500',
    iconColor: 'text-green-400'
  },
  {
    id: 'live',
    name: 'En Vivo',
    description: 'Transmite en directo',
    icon: Radio,
    color: 'from-red-500 to-pink-500',
    iconColor: 'text-red-400'
  }
];

export function CreateMenuModal({ isOpen, onClose, onSelectType }: CreateMenuModalProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleSelect = (type: any) => {
    onSelectType(type);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md glass-card border-neon-green/20 p-0">
        <div className="relative">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h2 className="text-xl font-bold text-white">Crear Contenido</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Options Grid */}
          <div className="p-4 grid grid-cols-2 gap-3">
            {createOptions.map((option) => {
              const Icon = option.icon;
              const isHovered = hoveredId === option.id;
              
              return (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  onMouseEnter={() => setHoveredId(option.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={cn(
                    'relative p-4 rounded-xl border-2 transition-all duration-300',
                    'hover:scale-105 hover:shadow-lg',
                    isHovered 
                      ? 'border-neon-green bg-neon-green/10' 
                      : 'border-white/10 bg-white/5'
                  )}
                >
                  {/* Icon with gradient background */}
                  <div className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center mb-3 mx-auto',
                    'bg-gradient-to-br',
                    option.color,
                    'shadow-lg'
                  )}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Text */}
                  <div className="text-center">
                    <h3 className="text-white font-semibold text-sm mb-1">
                      {option.name}
                    </h3>
                    <p className="text-gray-400 text-xs">
                      {option.description}
                    </p>
                  </div>

                  {/* Hover effect */}
                  {isHovered && (
                    <div className="absolute inset-0 rounded-xl bg-neon-green/5 pointer-events-none" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer tip */}
          <div className="p-4 border-t border-white/10">
            <p className="text-center text-gray-400 text-xs">
              Selecciona el tipo de contenido que deseas crear
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
