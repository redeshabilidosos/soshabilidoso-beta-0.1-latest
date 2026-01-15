'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { CyberButton } from '@/components/ui/cyber-button';
import { Share, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input'; // ¡Importación faltante!

interface SharePostDialogProps {
  isOpen: boolean;
  onClose: () => void;
  postUrl: string; // URL de la publicación a compartir
}

export function SharePostDialog({ isOpen, onClose, postUrl }: SharePostDialogProps) {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(postUrl);
    toast.success('Enlace copiado al portapapeles!');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] glass-card border-neon-green/20">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center space-x-2">
            <Share size={20} className="text-neon-green" />
            <span>Compartir Publicación</span>
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Copia el enlace de esta publicación para compartirla.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input
            value={postUrl}
            readOnly
            className="bg-white/10 border-white/20 text-white"
          />
        </div>
        <DialogFooter>
          <CyberButton variant="outline" onClick={onClose}>
            Cerrar
          </CyberButton>
          <CyberButton onClick={handleCopyLink}>
            <Check size={16} className="mr-2" />
            Copiar Enlace
          </CyberButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}