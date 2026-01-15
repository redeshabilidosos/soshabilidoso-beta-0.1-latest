'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
}: ConfirmDialogProps) {
  const [isConfirming, setIsConfirming] = React.useState(false);

  const handleConfirm = async () => {
    setIsConfirming(true);
    await new Promise(resolve => setTimeout(resolve, 300)); // Pequeña animación
    onConfirm();
    onClose();
    setIsConfirming(false);
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: 'text-red-400',
          iconBg: 'bg-red-500/20',
          confirmBtn: 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border-red-500/30',
          ring: 'ring-red-500/50',
        };
      case 'warning':
        return {
          icon: 'text-yellow-400',
          iconBg: 'bg-yellow-500/20',
          confirmBtn: 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 border-yellow-500/30',
          ring: 'ring-yellow-500/50',
        };
      case 'info':
        return {
          icon: 'text-neon-blue',
          iconBg: 'bg-neon-blue/20',
          confirmBtn: 'bg-neon-blue/20 text-neon-blue hover:bg-neon-blue/30 border-neon-blue/30',
          ring: 'ring-neon-blue/50',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md glass-card border-white/20 p-0 overflow-hidden backdrop-blur-xl shadow-2xl shadow-black/50 animate-in fade-in-0 zoom-in-95 duration-300">
        {/* Header con gradiente */}
        <div className="relative bg-gradient-to-br from-white/10 to-white/5 border-b border-white/10 p-6">
          <div className="flex items-start space-x-4">
            {/* Icono animado */}
            <div className={`${styles.iconBg} p-3 rounded-full animate-pulse relative`}>
              <AlertTriangle className={`${styles.icon} w-6 h-6 animate-shake`} />
              <div className={`absolute inset-0 rounded-full ${styles.iconBg} animate-ping opacity-75`}></div>
            </div>
            
            <div className="flex-1">
              <DialogTitle className="text-xl font-bold text-white mb-2">
                {title}
              </DialogTitle>
              <DialogDescription className="text-gray-300 leading-relaxed">
                {description}
              </DialogDescription>
            </div>
          </div>
          
          {/* Efecto de brillo superior */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          
          {/* Efecto de brillo lateral animado */}
          <div className={`absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-transparent via-${variant === 'danger' ? 'red' : 'neon-green'}-500/30 to-transparent animate-pulse`}></div>
          <div className={`absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-transparent via-${variant === 'danger' ? 'red' : 'neon-green'}-500/30 to-transparent animate-pulse`} style={{ animationDelay: '0.5s' }}></div>
        </div>

        {/* Botones */}
        <div className="p-6 bg-white/5 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white/10 text-gray-300 rounded-lg hover:bg-white/20 hover:text-white transition-all duration-300 font-medium border border-white/10 hover:border-white/20"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={isConfirming}
            className={`px-6 py-2.5 rounded-lg transition-all duration-300 font-medium border ${styles.confirmBtn} ${styles.ring} hover:ring-2 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2`}
          >
            {isConfirming && (
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            <span>{isConfirming ? 'Eliminando...' : confirmText}</span>
          </button>
        </div>

        {/* Efecto de partículas de fondo */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-50">
          <div className={`absolute top-1/4 left-1/4 w-32 h-32 ${variant === 'danger' ? 'bg-red-500/10' : 'bg-neon-green/5'} rounded-full blur-3xl animate-pulse`}></div>
          <div className={`absolute bottom-1/4 right-1/4 w-32 h-32 ${variant === 'danger' ? 'bg-red-500/10' : 'bg-neon-blue/5'} rounded-full blur-3xl animate-pulse`} style={{ animationDelay: '1s' }}></div>
          <div className={`absolute top-1/2 left-1/2 w-24 h-24 ${variant === 'danger' ? 'bg-red-500/5' : 'bg-neon-green/5'} rounded-full blur-2xl animate-pulse`} style={{ animationDelay: '0.5s' }}></div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
