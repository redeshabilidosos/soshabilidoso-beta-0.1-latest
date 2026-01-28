'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Copy, Share2, Link2, Users, Video, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface MeetingInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  meetingId: string;
  meetingType: 'meeting' | 'class';
  accessCode?: string;
}

export function MeetingInfoModal({ 
  isOpen, 
  onClose, 
  meetingId, 
  meetingType,
  accessCode 
}: MeetingInfoModalProps) {
  const [copied, setCopied] = useState(false);

  const meetingLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/live/${meetingType}/${meetingId}`;
  
  const shareText = meetingType === 'class' && accessCode
    ? `Únete a mi clase virtual:\n\nID: ${meetingId}\nCódigo: ${accessCode}\nEnlace: ${meetingLink}`
    : `Únete a mi reunión virtual:\n\nID: ${meetingId}\nEnlace: ${meetingLink}`;

  const copyLink = () => {
    navigator.clipboard.writeText(meetingLink);
    setCopied(true);
    toast.success('Enlace copiado');
    setTimeout(() => setCopied(false), 2000);
  };

  const copyAllInfo = () => {
    navigator.clipboard.writeText(shareText);
    toast.success('Información copiada');
  };

  const shareInfo = () => {
    if (navigator.share) {
      navigator.share({
        title: meetingType === 'class' ? 'Clase Virtual' : 'Reunión Virtual',
        text: shareText,
      }).catch(() => {
        copyAllInfo();
      });
    } else {
      copyAllInfo();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {meetingType === 'class' ? (
              <>
                <Video className="w-5 h-5 text-green-500" />
                Clase Creada
              </>
            ) : (
              <>
                <Users className="w-5 h-5 text-blue-500" />
                Reunión Creada
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            Comparte esta información con los participantes
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Meeting ID */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4 space-y-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">ID de {meetingType === 'class' ? 'Clase' : 'Reunión'}</p>
                <div className="flex items-center justify-between">
                  <code className="text-lg font-mono font-bold">{meetingId}</code>
                  <Badge variant="outline" className="ml-2">
                    <Link2 className="w-3 h-3 mr-1" />
                    Corto
                  </Badge>
                </div>
              </div>

              {/* Access Code for Classes */}
              {meetingType === 'class' && accessCode && (
                <div className="pt-3 border-t border-gray-700">
                  <p className="text-xs text-muted-foreground mb-1">Código de Acceso</p>
                  <code className="text-lg font-mono font-bold text-green-400">{accessCode}</code>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Meeting Link */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Enlace Directo</p>
            <div className="flex gap-2">
              <div className="flex-1 bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-sm font-mono truncate">
                {meetingLink}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={copyLink}
                className="flex-shrink-0"
              >
                {copied ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={copyAllInfo}
              className="flex-1"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copiar Todo
            </Button>
            <Button
              onClick={shareInfo}
              className={
                meetingType === 'class'
                  ? 'flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                  : 'flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700'
              }
            >
              <Share2 className="w-4 h-4 mr-2" />
              Compartir
            </Button>
          </div>

          {/* Instructions */}
          <Card className={
            meetingType === 'class'
              ? 'bg-green-500/5 border-green-500/20'
              : 'bg-blue-500/5 border-blue-500/20'
          }>
            <CardContent className="p-3">
              <p className="text-xs text-muted-foreground">
                💡 <strong>Consejo:</strong> Los participantes pueden unirse usando el ID corto o el enlace directo.
                {meetingType === 'class' && ' Las clases privadas requieren el código de acceso.'}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end pt-2">
          <Button onClick={onClose} variant="ghost">
            Entendido
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
