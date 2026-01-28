'use client';

import { memo, useState, useRef, useEffect } from 'react';
import { Smile } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface EmojiPickerButtonProps {
  onEmojiSelect: (emoji: string) => void;
  className?: string;
}

// Emojis más usados organizados por categorías
const EMOJI_CATEGORIES = {
  'Frecuentes': ['😀', '😂', '🤣', '😊', '😍', '🥰', '😘', '😎', '🤔', '😢', '😭', '😡', '👍', '👏', '🙌'],
  'Deportes': ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸', '🥊', '🥋', '⛳', '🏹', '🎯'],
  'Emociones': ['❤️', '💙', '💚', '💛', '🧡', '💜', '🖤', '💔', '💕', '💖', '💗', '💓', '💞', '💝', '💟'],
  'Gestos': ['👋', '🤚', '✋', '🖐️', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆'],
  'Celebración': ['🎉', '🎊', '🎈', '🎁', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '⭐', '🌟', '✨', '💫', '🔥'],
};

export const EmojiPickerButton = memo(function EmojiPickerButton({ 
  onEmojiSelect,
  className = ''
}: EmojiPickerButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof EMOJI_CATEGORIES>('Frecuentes');

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={`p-2 text-gray-400 hover:text-neon-green hover:bg-white/10 rounded-lg transition-colors ${className}`}
          aria-label="Seleccionar emoji"
        >
          <Smile size={20} />
        </button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-0 bg-gray-900 border-white/10" 
        align="end"
        sideOffset={5}
      >
        <div className="flex flex-col h-96">
          {/* Categorías */}
          <div className="flex border-b border-white/10 overflow-x-auto scrollbar-hide">
            {Object.keys(EMOJI_CATEGORIES).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category as keyof typeof EMOJI_CATEGORIES)}
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'text-neon-green border-b-2 border-neon-green'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Grid de emojis */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-8 gap-2">
              {EMOJI_CATEGORIES[selectedCategory].map((emoji, index) => (
                <button
                  key={`${emoji}-${index}`}
                  onClick={() => handleEmojiClick(emoji)}
                  className="text-2xl hover:bg-white/10 rounded-lg p-2 transition-colors"
                  title={emoji}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Footer con info */}
          <div className="border-t border-white/10 p-2 text-center">
            <p className="text-xs text-gray-400">
              Haz clic en un emoji para agregarlo
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
});
