/**
 * Componente indicador de conexión en tiempo real
 */
'use client';

import { Wifi, WifiOff, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RealtimeIndicatorProps {
  isConnected: boolean;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function RealtimeIndicator({ 
  isConnected, 
  className, 
  showLabel = false,
  size = 'md'
}: RealtimeIndicatorProps) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const iconSize = sizeClasses[size];

  return (
    <div className={cn(
      'flex items-center space-x-1',
      className
    )}>
      {isConnected ? (
        <>
          <div className="relative">
            <Wifi className={cn(iconSize, 'text-neon-green')} />
            <Activity className={cn(
              iconSize,
              'absolute inset-0 text-neon-green animate-pulse opacity-50'
            )} />
          </div>
          {showLabel && (
            <span className="text-xs text-neon-green font-medium">
              En vivo
            </span>
          )}
        </>
      ) : (
        <>
          <WifiOff className={cn(iconSize, 'text-red-400')} />
          {showLabel && (
            <span className="text-xs text-red-400">
              Desconectado
            </span>
          )}
        </>
      )}
    </div>
  );
}