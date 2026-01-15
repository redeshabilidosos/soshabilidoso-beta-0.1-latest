'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { PublicationTypeSelector, PublicationType } from './publication-type-selector';
import { DynamicPublicationForm } from './dynamic-publication-form';
import { toast } from 'sonner';

interface EnhancedCreateClassifiedProps {
  isOpen: boolean;
  onClose: () => void;
  onClassifiedCreated?: (classified: any) => void;
}

type Step = 'select-type' | 'fill-form' | 'success';

export function EnhancedCreateClassified({ 
  isOpen, 
  onClose, 
  onClassifiedCreated 
}: EnhancedCreateClassifiedProps) {
  const [currentStep, setCurrentStep] = useState<Step>('select-type');
  const [selectedType, setSelectedType] = useState<PublicationType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [createdClassified, setCreatedClassified] = useState<any>(null);

  const handleTypeSelect = (type: PublicationType) => {
    setSelectedType(type);
    setCurrentStep('fill-form');
  };

  const handleFormSubmit = async (formData: any) => {
    setIsLoading(true);
    
    try {
      // Simular creación del clasificado
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newClassified = {
        id: Date.now().toString(),
        ...formData,
        type: selectedType?.id,
        seller: {
          id: '1',
          name: 'Usuario Actual',
          avatar: '/logo.png',
          rating: 4.8,
          verified: true
        },
        createdAt: new Date().toISOString(),
        views: 0,
        likes: 0,
        isLiked: false,
        featured: false
      };

      setCreatedClassified(newClassified);
      setCurrentStep('success');
      
      toast.success('¡Clasificado publicado exitosamente!');
      
      if (onClassifiedCreated) {
        onClassifiedCreated(newClassified);
      }
    } catch (error) {
      toast.error('Error al publicar el clasificado');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep === 'fill-form') {
      setCurrentStep('select-type');
      setSelectedType(null);
    }
  };

  const handleClose = () => {
    setCurrentStep('select-type');
    setSelectedType(null);
    setCreatedClassified(null);
    onClose();
  };

  const getStepProgress = () => {
    switch (currentStep) {
      case 'select-type': return 33;
      case 'fill-form': return 66;
      case 'success': return 100;
      default: return 0;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'select-type': return 'Seleccionar Tipo';
      case 'fill-form': return 'Completar Información';
      case 'success': return '¡Publicado!';
      default: return '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900/95 border-white/10">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {currentStep !== 'select-type' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="text-gray-400 hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              <div>
                <h2 className="text-xl font-bold text-white">Crear Publicación</h2>
                <p className="text-gray-400 text-sm">{getStepTitle()}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Progreso</span>
              <span>{getStepProgress()}%</span>
            </div>
            <Progress value={getStepProgress()} className="h-2" />
          </div>
        </DialogHeader>

        <div className="mt-6">
          {currentStep === 'select-type' && (
            <PublicationTypeSelector
              selectedType={selectedType?.id || null}
              onTypeSelect={handleTypeSelect}
            />
          )}

          {currentStep === 'fill-form' && selectedType && (
            <DynamicPublicationForm
              publicationType={selectedType}
              onSubmit={handleFormSubmit}
              onBack={handleBack}
              isLoading={isLoading}
            />
          )}

          {currentStep === 'success' && createdClassified && (
            <div className="text-center space-y-6 py-8">
              <div className="w-20 h-20 bg-neon-green/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-neon-green" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">
                  ¡Publicación Exitosa!
                </h3>
                <p className="text-gray-400">
                  Tu {selectedType?.title.toLowerCase()} ha sido publicado y ya está visible para la comunidad
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-lg p-4 max-w-md mx-auto">
                <h4 className="text-white font-medium mb-2">{createdClassified.title}</h4>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                  {createdClassified.description}
                </p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-neon-green font-bold">
                    ${parseInt(createdClassified.price).toLocaleString()} {createdClassified.currency}
                  </span>
                  <span className="text-gray-400">{createdClassified.location}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-sm text-gray-400 space-y-1">
                  <p>✅ Publicación activa y visible</p>
                  <p>📧 Recibirás notificaciones de interesados</p>
                  <p>📊 Puedes ver estadísticas en "Mis Anuncios"</p>
                </div>
                
                <div className="flex justify-center space-x-3">
                  <Button variant="outline" onClick={handleClose}>
                    Cerrar
                  </Button>
                  <Button 
                    onClick={() => {
                      handleClose();
                      // Aquí podrías navegar a la vista del clasificado
                    }}
                    className="bg-neon-green text-black hover:bg-neon-green/80"
                  >
                    Ver Publicación
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}