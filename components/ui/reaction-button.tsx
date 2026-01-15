'use client';

import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReactionButtonProps {
  icon: LucideIcon;
  count: number;
  color: string;
  hoverColor: string;
  active: boolean;
  onClick: () => void;
  label: string;
  activeBg?: string;
}

export function ReactionButton({ 
  icon: Icon, 
  count, 
  color, 
  hoverColor, 
  active, 
  onClick, 
  label,
  activeBg = 'bg-white/10'
}: ReactionButtonProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        'flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg transition-all duration-200 min-w-0',
        active 
          ? `${color} ${activeBg}` 
          : `text-gray-400 hover:bg-white/10 ${hoverColor}`
      )}
      title={label}
    >
      <Icon 
        size={18} 
        fill={active ? 'currentColor' : 'none'}
        className="transition-all duration-200 flex-shrink-0"
      />
      <span className="text-sm">
        {count}
      </span>
    </button>
  );
}