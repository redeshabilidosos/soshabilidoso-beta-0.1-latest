'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { CyberButton } from '@/components/ui/cyber-button';
import { CheckCircle, UserPlus, Sparkles } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface FriendRequestSuccessDialogProps {
  open: boolean;
  onClose: () => void;
  friendName: string;
  friendUsername: string;
  friendAvatar?: string;
  isAccepted: boolean;
}

export function FriendRequestSuccessDialog({
  open,
  onClose,
  friendName,
  friendUsername,
  friendAvatar,
  isAccepted
}: FriendRequestSuccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900/95 backdrop-blur-xl border-2 border-neon-green/50 shadow-[0_0_30px_rgba(0,255,157,0.3)] max-w-md">
        <DialogHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-neon-green/20 rounded-full blur-xl animate-pulse"></div>
              <div className="relative bg-neon-green/10 p-4 rounded-full border-2 border-neon-green/50">
                {isAccepted ? (
                  <CheckCircle className="w-12 h-12 text-neon-green" />
                ) : (
                  <UserPlus className="w-12 h-12 text-red-400" />
                )}
              </div>
            </div>
          </div>
          
          <DialogTitle className="text-2xl font-bold text-center text-white">
            {isAccepted ? '¡Solicitud Aceptada!' : 'Solicitud Rechazada'}
          </DialogTitle>
          
          <DialogDescription className="text-center space-y-4">
            <div className="flex justify-center">
              <Avatar className="w-20 h-20 ring-4 ring-neon-green/30 shadow-lg">
                <AvatarImage 
                  src={friendAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                  alt={friendName}
                />
                <AvatarFallback className="bg-gray-800 text-white text-xl">
                  {friendName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <div className="space-y-1">
              <p className="text-white font-semibold text-lg">
                {friendName}
              </p>
              <p className="text-gray-400 text-sm">
                @{friendUsername}
              </p>
            </div>
            
            {isAccepted ? (
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-neon-green">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Ahora son amigos
                  </span>
                  <Sparkles className="w-4 h-4" />
                </div>
                <p className="text-gray-300 text-sm">
                  Pueden compartir contenido, enviar mensajes y ver las publicaciones de cada uno.
                </p>
              </div>
            ) : (
              <p className="text-gray-300 text-sm">
                La solicitud de amistad ha sido rechazada.
              </p>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-center pt-4">
          <CyberButton
            onClick={onClose}
            className="min-w-[120px]"
          >
            Entendido
          </CyberButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
