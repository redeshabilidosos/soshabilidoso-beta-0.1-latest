'use client';

import { CyberButton } from '@/components/ui/cyber-button';
import { Grid3X3, List } from 'lucide-react';

interface ViewToggleProps {
  view: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center space-x-2 bg-white/5 rounded-lg p-1">
      <CyberButton
        variant={view === 'grid' ? 'primary' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('grid')}
        className={`px-3 py-2 ${view === 'grid' ? 'bg-neon-green text-black' : 'text-gray-400 hover:text-white'}`}
      >
        <Grid3X3 className="w-4 h-4" />
      </CyberButton>
      <CyberButton
        variant={view === 'list' ? 'primary' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('list')}
        className={`px-3 py-2 ${view === 'list' ? 'bg-neon-green text-black' : 'text-gray-400 hover:text-white'}`}
      >
        <List className="w-4 h-4" />
      </CyberButton>
    </div>
  );
}