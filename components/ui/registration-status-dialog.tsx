'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { CyberButton } from '@/components/ui/cyber-button';
import { CheckCircle, XCircle } from 'lucide-react';

interface RegistrationStatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  isSuccess: boolean;
  message: string;
}

export function RegistrationStatusDialog({ isOpen, onClose, isSuccess, message }: RegistrationStatusDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] glass-card border-neon-green/20">
        <DialogHeader className="text-center">
          {isSuccess ? (
            <CheckCircle size={48} className="text-neon-green mx-auto mb-4" />
          ) : (
            <XCircle size={48} className="text-red-500 mx-auto mb-4" />
          )}
          <DialogTitle className="text-white text-2xl">
            {isSuccess ? '¡Registro Exitoso!' : 'Error en el Registro'}
          </DialogTitle>
          <DialogDescription className="text-gray-400 text-base">
            {message}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-center sm:justify-center">
          <CyberButton onClick={onClose}>
            Aceptar
          </CyberButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}