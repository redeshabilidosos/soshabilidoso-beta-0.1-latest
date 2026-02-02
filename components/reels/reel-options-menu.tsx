'use client';

import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MoreHorizontal, Flag, AlertTriangle, Ban, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

interface ReelOptionsMenuProps {
  reelId: string;
}

const reportReasons = [
  { value: 'spam', label: 'Spam o contenido engañoso', icon: AlertTriangle },
  { value: 'inappropriate', label: 'Contenido inapropiado', icon: Ban },
  { value: 'violence', label: 'Violencia o contenido peligroso', icon: AlertTriangle },
  { value: 'harassment', label: 'Acoso o bullying', icon: Ban },
  { value: 'hate', label: 'Discurso de odio', icon: Flag },
  { value: 'copyright', label: 'Infracción de derechos de autor', icon: Flag },
  { value: 'other', label: 'Otro motivo', icon: Flag },
];

export function ReelOptionsMenu({ reelId }: ReelOptionsMenuProps) {
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReport = async () => {
    if (!selectedReason) {
      toast.error('Por favor selecciona un motivo');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Debes iniciar sesión');
        return;
      }

      const response = await fetch(`http://127.0.0.1:8000/api/reels/${reelId}/report/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reason: selectedReason,
          description: additionalInfo,
        }),
      });

      if (response.ok) {
        toast.success('Reporte enviado correctamente');
        setShowReportDialog(false);
        setSelectedReason('');
        setAdditionalInfo('');
      } else {
        toast.error('Error al enviar el reporte');
      }
    } catch (error) {
      console.error('Error al reportar:', error);
      toast.error('Error al enviar el reporte');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNotInterested = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Debes iniciar sesión');
        return;
      }

      const response = await fetch(`http://127.0.0.1:8000/api/reels/${reelId}/not-interested/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success('No verás más contenido similar');
      } else {
        toast.error('Error al procesar tu solicitud');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al procesar tu solicitud');
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="bg-black/50 backdrop-blur-sm rounded-full p-2 hover:bg-black/70 transition-colors">
            <MoreHorizontal className="w-5 h-5 text-white" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-56 bg-gray-900/95 backdrop-blur-xl border-gray-800"
        >
          <DropdownMenuItem
            onClick={() => setShowReportDialog(true)}
            className="text-white hover:bg-white/10 cursor-pointer"
          >
            <Flag className="w-4 h-4 mr-2 text-red-500" />
            Denunciar video
          </DropdownMenuItem>
          
          <DropdownMenuSeparator className="bg-gray-800" />
          
          <DropdownMenuItem
            onClick={handleNotInterested}
            className="text-white hover:bg-white/10 cursor-pointer"
          >
            <EyeOff className="w-4 h-4 mr-2 text-gray-400" />
            No me interesa
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Report Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="sm:max-w-[500px] bg-gray-900/95 backdrop-blur-xl border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Flag className="w-5 h-5 text-red-500" />
              Denunciar video
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Ayúdanos a mantener la comunidad segura. Selecciona el motivo de tu reporte.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <RadioGroup value={selectedReason} onValueChange={setSelectedReason}>
              {reportReasons.map((reason) => {
                const Icon = reason.icon;
                return (
                  <div key={reason.value} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                    <RadioGroupItem value={reason.value} id={reason.value} />
                    <Label
                      htmlFor={reason.value}
                      className="flex items-center gap-2 text-white cursor-pointer flex-1"
                    >
                      <Icon className="w-4 h-4 text-gray-400" />
                      {reason.label}
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>

            <div className="space-y-2">
              <Label htmlFor="additional-info" className="text-white">
                Información adicional (opcional)
              </Label>
              <Textarea
                id="additional-info"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder="Proporciona más detalles sobre tu reporte..."
                className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 resize-none"
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowReportDialog(false)}
              disabled={isSubmitting}
              className="bg-transparent border-gray-700 text-white hover:bg-white/10"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleReport}
              disabled={!selectedReason || isSubmitting}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar reporte'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
