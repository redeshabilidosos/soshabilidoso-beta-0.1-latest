'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { CyberButton } from '@/components/ui/cyber-button';
import { Plus, Briefcase, DollarSign, HelpCircle, MapPin, Mail, Phone, Image as ImageIcon, CalendarDays, Clock, Zap, Wallet } from 'lucide-react';
import { useAuth } from '@/components/providers/providers';
import { toast } from 'sonner';
import { Classified } from '@/types/user';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface NewClassifiedDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onClassifiedCreated: (newClassified: Classified) => void;
}

export function NewClassifiedDialog({ isOpen, onClose, onClassifiedCreated }: NewClassifiedDialogProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<Classified['type']>('other');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [price, setPrice] = useState('');
  // Nuevos estados para los campos adicionales
  const [workingHours, setWorkingHours] = useState('');
  const [availability, setAvailability] = useState('');
  const [urgency, setUrgency] = useState<Classified['urgency'] | ''>('');
  const [salaryEstimate, setSalaryEstimate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión para crear un clasificado.');
      return;
    }
    if (!title.trim() || !description.trim() || !type || !category.trim() || !contactInfo.trim()) {
      toast.error('Por favor, completa todos los campos obligatorios.');
      return;
    }

    setIsLoading(true);
    try {
      const newClassified: Classified = {
        id: Date.now().toString(),
        userId: user.id,
        user: user,
        title: title.trim(),
        description: description.trim(),
        type: type,
        category: category.trim(),
        location: location.trim() || undefined,
        contactInfo: contactInfo.trim(),
        imageUrl: imageUrl.trim() || undefined,
        price: price ? parseFloat(price) : undefined,
        createdAt: new Date().toISOString(),
        // Añadir los nuevos campos condicionalmente
        ...(type === 'job' || type === 'help' ? {
          workingHours: workingHours.trim() || undefined,
          availability: availability.trim() || undefined,
          urgency: urgency || undefined,
          salaryEstimate: salaryEstimate.trim() || undefined,
        } : {}),
      };

      onClassifiedCreated(newClassified);
      toast.success('Clasificado publicado con éxito!');
      
      // Reset form
      setTitle('');
      setDescription('');
      setType('other');
      setCategory('');
      setLocation('');
      setContactInfo('');
      setImageUrl('');
      setPrice('');
      setWorkingHours('');
      setAvailability('');
      setUrgency('');
      setSalaryEstimate('');
      onClose();
    } catch (error) {
      console.error('Error creating classified:', error);
      toast.error('Error al crear el clasificado.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] glass-card border-neon-green/20">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center space-x-2">
            <Plus size={20} className="text-neon-green" />
            <span>Crear Nuevo Clasificado</span>
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Publica tu anuncio para la comunidad.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Título del Anuncio</label>
            <Input
              placeholder="Ej: Busco diseñador gráfico freelance, Vendo balón de fútbol nuevo"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-neon-green/50"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Descripción</label>
            <Textarea
              placeholder="Detalla tu anuncio..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px] bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-neon-green/50"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tipo de Anuncio</label>
              <Select onValueChange={(value: Classified['type']) => setType(value)} value={type} required>
                <SelectTrigger className="w-full bg-white/10 border-white/20 text-white focus:ring-neon-green/50">
                  <SelectValue placeholder="Selecciona el tipo" />
                </SelectTrigger>
                <SelectContent className="bg-popover text-popover-foreground border-border">
                  <SelectItem value="job">Trabajo / Freelance</SelectItem>
                  <SelectItem value="sale">Venta de Artículos</SelectItem>
                  <SelectItem value="help">Ayuda / Servicio</SelectItem>
                  <SelectItem value="event">Evento</SelectItem>
                  <SelectItem value="other">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Categoría</label>
              <Input
                placeholder="Ej: Diseño Gráfico, Equipamiento Deportivo, Clases de Música"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-neon-green/50"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Ubicación (Opcional)</label>
              <Input
                placeholder="Ej: Medellín, Online"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-neon-green/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Información de Contacto</label>
              <Input
                placeholder="Tu email o número de teléfono"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-neon-green/50"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">URL de Imagen (Opcional)</label>
            <Input
              placeholder="URL de una imagen para tu anuncio"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-neon-green/50"
            />
            {imageUrl && <img src={imageUrl} alt="Preview" className="mt-2 w-full h-32 object-cover rounded-lg" />}
          </div>

          {type === 'sale' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Precio (COP)</label>
              <Input
                type="number"
                placeholder="Ej: 150000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-neon-green/50"
              />
            </div>
          )}

          {(type === 'job' || type === 'help') && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center space-x-2">
                    <Clock size={16} className="text-gray-400" />
                    <span>Horas de Trabajo / Dedicación</span>
                  </label>
                  <Input
                    placeholder="Ej: Tiempo completo, Medio tiempo, Por horas"
                    value={workingHours}
                    onChange={(e) => setWorkingHours(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-neon-green/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center space-x-2">
                    <CalendarDays size={16} className="text-gray-400" />
                    <span>Disponibilidad</span>
                  </label>
                  <Input
                    placeholder="Ej: Lunes a Viernes, Fines de semana, Flexible"
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-neon-green/50"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center space-x-2">
                    <Zap size={16} className="text-gray-400" />
                    <span>Necesidad / Urgencia</span>
                  </label>
                  <Select onValueChange={(value: string) => setUrgency(value as Classified['urgency'])} value={urgency}>
                    <SelectTrigger className="w-full bg-white/10 border-white/20 text-white focus:ring-neon-green/50">
                      <SelectValue placeholder="Selecciona la urgencia" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover text-popover-foreground border-border">
                      <SelectItem value="inmediata">Inmediata</SelectItem>
                      <SelectItem value="corto_plazo">Corto Plazo</SelectItem>
                      <SelectItem value="largo_plazo">Largo Plazo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center space-x-2">
                    <Wallet size={16} className="text-gray-400" />
                    <span>Estimación de Salario / Compensación</span>
                  </label>
                  <Input
                    placeholder="Ej: $500.000 - $800.000 COP/mes, $20.000 COP/hora"
                    value={salaryEstimate}
                    onChange={(e) => setSalaryEstimate(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-neon-green/50"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <CyberButton variant="outline" onClick={onClose}>
            Cancelar
          </CyberButton>
          <CyberButton onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Publicando...' : 'Publicar Clasificado'}
          </CyberButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}