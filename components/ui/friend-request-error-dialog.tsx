'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { CyberButton } from '@/components/ui/cyber-button';
import { AlertTriangle, XCircle } from 'lucide-react';

interface FriendRequestErrorDialogProps {
  open: boolean;
  onClose: () => void;
  errorMessage: string;
}

export function FriendRequestErrorDialog({
  open,
  onClose,
  errorMessage
}: FriendRequestErrorDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900/95 backdrop-blur-xl border-2 border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.3)] max-w-md">
        <DialogHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse"></div>
              <div className="relative bg-red-500/10 p-4 rounded-full border-2 border-red-500/50">
                <XCircle className="w-12 h-12 text-red-500" />
              </div>
            </div>
          </div>
          
          <DialogTitle className="text-2xl font-bold text-center text-white">
            Error al Procesar Solicitud
          </DialogTitle>
          
          <DialogDescription className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              <span className="text-sm font-medium">
                Algo salió mal
              </span>
            </div>
            
            <p className="text-gray-300 text-sm px-4">
              {errorMessage}
            </p>
            
            <p className="text-gray-400 text-xs">
              Por favor, intenta de nuevo o recarga la página.
            </p>
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-center gap-3 pt-4">
          <CyberButton
            onClick={onClose}
            variant="outline"
            className="min-w-[120px] border-red-500/50 text-red-400 hover:bg-red-500/10"
          >
            Cerrar
          </CyberButton>
          <CyberButton
            onClick={() => window.location.reload()}
            className="min-w-[120px]"
          >
            Recargar Página
          </CyberButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
