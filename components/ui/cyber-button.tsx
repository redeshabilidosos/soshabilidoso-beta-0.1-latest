'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot'; // Importar Slot

interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'icon';
  children: React.ReactNode;
  asChild?: boolean; // Añadir asChild prop
}

export const CyberButton = forwardRef<HTMLButtonElement, CyberButtonProps>(
  ({ className, variant = 'primary', size = 'md', asChild = false, children, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-neon-green/50 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'bg-gradient-to-r from-neon-green/20 to-neon-blue/20 hover:from-neon-green/40 hover:to-neon-blue/40 border border-neon-green/50 text-white hover:shadow-neon-green hover:scale-105',
      secondary: 'bg-gradient-to-r from-neon-blue/20 to-purple-500/20 hover:from-neon-blue/40 hover:to-purple-500/40 border border-neon-blue/50 text-white hover:shadow-neon-blue hover:scale-105',
      outline: 'border border-white/30 text-white hover:bg-white/10 hover:border-neon-green/50 hover:text-neon-green',
      ghost: 'text-gray-300 hover:text-white hover:bg-white/10',
      destructive: 'bg-red-600/20 hover:bg-red-600/40 border border-red-600/50 text-red-400 hover:shadow-red-600 hover:scale-105',
    };
    
    const sizes = {
      xs: 'px-2 py-1 text-xs rounded-md',
      sm: 'px-3 py-2 text-sm rounded-lg',
      md: 'px-6 py-3 text-sm rounded-xl',
      lg: 'px-8 py-4 text-base rounded-xl',
      icon: 'h-10 w-10 p-0',
    };

    const Comp = asChild ? Slot : 'button'; // Definir Comp aquí
    
    return (
      <Comp
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

CyberButton.displayName = 'CyberButton';