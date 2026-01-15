'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { DynamicPublicationForm } from './dynamic-publication-form';
import { PublicationType } from './publication-type-selector';
import { classifiedsService } from '@/lib/services/classifieds';
import { toast } from 'sonner';

interface PublicationFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  publicationType: PublicationType;
  onClassifiedCreated?: (classified: any) => void;
}

// Mapeo de categorías del frontend al backend
const categoryMapping: Record<string, Record<string, string>> = {
  product: {
    'Electrónicos': 'electronics',
    'Ropa y Accesorios': 'clothing',
    'Deportes': 'sports',
    'Música': 'music',
    'Libros': 'books',
    'Hogar y Jardín': 'home',
    'Vehículos': 'vehicles',
    'Mascotas': 'pets',
    'Juguetes': 'toys',
    'Otros': 'other',
  },
  marketplace: {
    'Limpieza': 'cleaning',
    'Reparaciones': 'repairs',
    'Delivery': 'delivery',
    'Tutorías': 'tutoring',
    'Cuidado Personal': 'personal_care',
    'Jardinería': 'gardening',
    'Transporte': 'transport',
    'Eventos': 'events',
    'Mascotas': 'pets',
    'Otros Servicios': 'other',
  },
  freelancer: {
    'Diseño Gráfico': 'graphic_design',
    'Desarrollo Web': 'web_development',
    'Marketing Digital': 'digital_marketing',
    'Redacción': 'writing',
    'Traducción': 'translation',
    'Fotografía': 'photography',
    'Video Edición': 'video_editing',
    'Consultoría': 'consulting',
    'Música': 'music',
    'Otros': 'other',
  },
};

const conditionMapping: Record<string, string> = {
  'Nuevo': 'new',
  'Usado - Como Nuevo': 'like_new',
  'Usado - Buen Estado': 'good',
  'Usado - Regular': 'fair',
};

const durationMapping: Record<string, string> = {
  '30 min': '30min',
  '1 hora': '1hour',
  '2-3 horas': '2-3hours',
  'Medio día': 'half_day',
  'Día completo': 'full_day',
};

const deliveryTimeMapping: Record<string, string> = {
  '1-3 días': '1-3days',
  '1 semana': '1week',
  '2 semanas': '2weeks',
  '1 mes': '1month',
  'Más de 1 mes': 'more',
};

export function PublicationFormDialog({ 
  isOpen, 
  onClose, 
  publicationType,
  onClassifiedCreated 
}: PublicationFormDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (formData: any) => {
    setIsLoading(true);
    try {
      let result;
      const typeId = publicationType.id;
      
      // Preparar datos base
      const baseData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        currency: formData.currency as 'COP' | 'USD',
        negotiable: formData.negotiable,
        location: formData.location,
        images: [], // TODO: Implementar subida de imágenes
        tags: [],
      };

      if (typeId === 'product') {
        result = await classifiedsService.createProduct({
          ...baseData,
          category: categoryMapping.product[formData.category] || 'other',
          condition: conditionMapping[formData.condition] || 'new',
          brand: formData.brand || '',
          model: formData.model || '',
          delivery_available: false,
          pickup_available: true,
        });
      } else if (typeId === 'marketplace') {
        result = await classifiedsService.createService({
          ...baseData,
          category: categoryMapping.marketplace[formData.category] || 'other',
          availability: formData.availability || '',
          typical_duration: durationMapping[formData.duration] || 'custom',
          coverage_area: formData.location,
          price_type: 'service',
          instant_booking: false,
        });
      } else if (typeId === 'freelancer') {
        result = await classifiedsService.createFreelancerAd({
          ...baseData,
          category: categoryMapping.freelancer[formData.category] || 'other',
          skills: formData.skills || [],
          portfolio_url: formData.portfolio || '',
          portfolio_images: [],
          delivery_time: deliveryTimeMapping[formData.deliveryTime] || 'custom',
          project_type: 'both',
          years_experience: 0,
        });
      }

      if (result) {
        toast.success('¡Publicación creada exitosamente!');
        if (onClassifiedCreated) {
          onClassifiedCreated(result);
        }
        onClose();
      }
    } catch (error: any) {
      console.error('Error creando clasificado:', error);
      toast.error(error.response?.data?.detail || 'Error al crear la publicación');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900/95 border-white/10">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h2 className="text-xl font-bold text-white">Crear {publicationType.title}</h2>
                <p className="text-gray-400 text-sm">{publicationType.subtitle}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </Button>
          </div>
        </DialogHeader>

        <div className="mt-6">
          <DynamicPublicationForm
            publicationType={publicationType}
            onSubmit={handleFormSubmit}
            onBack={onClose}
            isLoading={isLoading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}