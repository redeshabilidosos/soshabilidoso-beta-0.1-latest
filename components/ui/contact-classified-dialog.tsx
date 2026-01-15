'use client';

import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { CyberButton } from '@/components/ui/cyber-button';
import { Mail, Phone, User, FileText, Send, Upload } from 'lucide-react';
import { useAuth } from '@/components/providers/providers';
import { toast } from 'sonner';
import { Classified, ContactMessageDetails } from '@/types/user';

interface ContactClassifiedDialogProps {
  isOpen: boolean;
  onClose: () => void;
  classified: Classified;
  onSendMessage: (recipientId: string, messageDetails: ContactMessageDetails) => void;
}

export function ContactClassifiedDialog({ isOpen, onClose, classified, onSendMessage }: ContactClassifiedDialogProps) {
  const { user: currentUser } = useAuth();
  const [senderName, setSenderName] = useState(currentUser?.displayName || '');
  const [senderDescription, setSenderDescription] = useState('');
  const [senderPhone, setSenderPhone] = useState(currentUser?.contactNumber || ''); // Asumiendo que el usuario tiene un contactNumber
  const [senderEmail, setSenderEmail] = useState(currentUser?.email || '');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('El archivo es demasiado grande. Máximo 5MB.');
        setResumeFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      setResumeFile(file);
      toast.success(`Archivo "${file.name}" seleccionado.`);
    } else {
      setResumeFile(null);
    }
  };

  const handleSubmit = async () => {
    if (!currentUser) {
      toast.error('Debes iniciar sesión para contactar al anunciante.');
      return;
    }
    if (!senderName.trim() || !senderDescription.trim() || !senderPhone.trim() || !senderEmail.trim()) {
      toast.error('Por favor, completa todos los campos obligatorios.');
      return;
    }

    setIsLoading(true);
    try {
      const messageDetails: ContactMessageDetails = {
        senderName: senderName.trim(),
        senderDescription: senderDescription.trim(),
        senderPhone: senderPhone.trim(),
        senderEmail: senderEmail.trim(),
        resumeFileName: resumeFile?.name,
        classifiedTitle: classified.title,
      };

      onSendMessage(classified.userId, messageDetails);
      toast.success('Mensaje de contacto enviado con éxito!');
      
      // Reset form
      setSenderDescription('');
      setResumeFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      onClose();
    } catch (error) {
      console.error('Error sending contact message:', error);
      toast.error('Error al enviar el mensaje de contacto.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] glass-card border-neon-green/20">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center space-x-2">
            <Mail size={20} className="text-neon-green" />
            <span>Contactar a {classified.user.displayName}</span>
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Envía un mensaje al anunciante sobre "{classified.title}".
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tu Nombre</label>
            <Input
              placeholder="Tu nombre completo"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-neon-green/50"
              required
              disabled={!!currentUser?.displayName} // Deshabilitar si ya está en el perfil del usuario
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Mensaje / Descripción</label>
            <Textarea
              placeholder={`Hola, estoy interesado/a en tu anuncio de "${classified.title}"...`}
              value={senderDescription}
              onChange={(e) => setSenderDescription(e.target.value)}
              className="min-h-[100px] bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-neon-green/50"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Teléfono de Contacto</label>
              <Input
                type="tel"
                placeholder="Tu número de teléfono"
                value={senderPhone}
                onChange={(e) => setSenderPhone(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-neon-green/50"
                required
                disabled={!!currentUser?.contactNumber} // Deshabilitar si ya está en el perfil del usuario
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email de Contacto</label>
              <Input
                type="email"
                placeholder="Tu correo electrónico"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-neon-green/50"
                required
                disabled={!!currentUser?.email} // Deshabilitar si ya está en el perfil del usuario
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <span className="flex items-center space-x-2">
                <FileText size={16} className="text-gray-400" />
                <span>Currículum / Portafolio (Opcional, máx. 5MB)</span>
              </span>
            </label>
            <Input
              type="file"
              accept=".pdf,.doc,.docx,image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="bg-white/10 border-white/20 text-white file:text-neon-green file:bg-white/10 file:border-0 file:rounded-md file:px-3 file:py-1 file:mr-2"
            />
            {resumeFile && (
              <p className="text-gray-400 text-sm mt-1">Archivo seleccionado: {resumeFile.name}</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <CyberButton variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </CyberButton>
          <CyberButton onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Enviando...' : <><Send size={16} className="mr-2" /> Enviar Mensaje</>}
          </CyberButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}