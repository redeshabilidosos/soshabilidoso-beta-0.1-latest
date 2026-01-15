'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { InitialActionSelector } from './initial-action-selector';
import { SellOptionsSelector } from './sell-options-selector';
import { HireOptionsSelector } from './hire-options-selector';
import { DynamicPublicationForm } from './dynamic-publication-form';
import { PublicationType } from './publication-type-selector';
import { toast } from 'sonner';

interface MainClassifiedFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onClassifiedCreated?: (classified: any) => void;
  onBrowseRequested?: () => void;
}

type FlowStep = 
  | 'initial-action'
  | 'sell-options' 
  | 'hire-options'
  | 'create-form'
  | 'success';

type ActionType = 'sell' | 'hire';
type SellType = 'product' | 'marketplace' | 'freelancer';
type HireType = 'browse' | 'post-request';

const publicationTypeMap: Record<SellType, PublicationType> = {
  product: {
    id: 'product',
    title: 'Producto Físico',
    subtitle: 'Vende artículos tangibles',
    description: 'Perfecto para vender objetos físicos como electrónicos, ropa, deportes, etc.',
    icon: require('lucide-react').ShoppingBag,
    color: 'text-blue-400',
    bgGradient: 'from-blue-500/20 to-cyan-500/20',
    features: [
      'Galería de fotos múltiples',
      'Estado del producto',
      'Precio negociable',
      'Ubicación y entrega',
      'Categorías específicas'
    ]
  },
  marketplace: {
    id: 'marketplace',
    title: 'Servicio Marketplace',
    subtitle: 'Ofrece servicios locales',
    description: 'Ideal para servicios como reparaciones, limpieza, delivery, tutorías, etc.',
    icon: require('lucide-react').Store,
    color: 'text-green-400',
    bgGradient: 'from-green-500/20 to-emerald-500/20',
    features: [
      'Tarifas por hora/servicio',
      'Disponibilidad horaria',
      'Área de cobertura',
      'Reseñas y calificaciones',
      'Reserva instantánea'
    ],
    popular: true
  },
  freelancer: {
    id: 'freelancer',
    title: 'Trabajo Freelancer',
    subtitle: 'Proyectos profesionales',
    description: 'Para trabajos remotos como diseño, programación, marketing, escritura, etc.',
    icon: require('lucide-react').Briefcase,
    color: 'text-purple-400',
    bgGradient: 'from-purple-500/20 to-pink-500/20',
    features: [
      'Portfolio de trabajos',
      'Presupuestos personalizados',
      'Plazos de entrega',
      'Habilidades y certificaciones',
      'Comunicación directa'
    ]
  }
};

export function MainClassifiedFlow({ 
  isOpen, 
  onClose, 
  onClassifiedCreated,
  onBrowseRequested 
}: MainClassifiedFlowProps) {
  const [currentStep, setCurrentStep] = useState<FlowStep>('initial-action');
  const [selectedAction, setSelectedAction] = useState<ActionType | null>(null);
  const [selectedSellType, setSelectedSellType] = useState<SellType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [createdClassified, setCreatedClassified] = useState<any>(null);

  const handleInitialAction = (action: ActionType) => {
    setSelectedAction(action);
    if (action === 'sell') {
      setCurrentStep('sell-options');
    } else {
      setCurrentStep('hire-options');
    }
  };

  const handleSellOption = (option: SellType) => {
    setSelectedSellType(option);
    setCurrentStep('create-form');
  };

  const handleHireOption = (option: HireType) => {
    if (option === 'browse') {
      // Cerrar el modal y navegar a la vista de exploración
      handleClose();
      if (onBrowseRequested) {
        onBrowseRequested();
      }
    } else {
      // TODO: Implementar formulario de solicitud
      toast.info('Función de solicitudes próximamente disponible');
      handleClose();
    }
  };

  const handleFormSubmit = async (formData: any) => {
    setIsLoading(true);
    
    try {
      // Simular creación del clasificado
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newClassified = {
        id: Date.now().toString(),
        ...formData,
        type: selectedSellType,
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
    switch (currentStep) {
      case 'sell-options':
      case 'hire-options':
        setCurrentStep('initial-action');
        setSelectedAction(null);
        break;
      case 'create-form':
        setCurrentStep('sell-options');
        setSelectedSellType(null);
        break;
      default:
        break;
    }
  };

  const handleClose = () => {
    setCurrentStep('initial-action');
    setSelectedAction(null);
    setSelectedSellType(null);
    setCreatedClassified(null);
    onClose();
  };

  const getStepProgress = () => {
    switch (currentStep) {
      case 'initial-action': return 25;
      case 'sell-options':
      case 'hire-options': return 50;
      case 'create-form': return 75;
      case 'success': return 100;
      default: return 0;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'initial-action': return 'Seleccionar Acción';
      case 'sell-options': return 'Tipo de Venta';
      case 'hire-options': return 'Opciones de Contratación';
      case 'create-form': return 'Completar Información';
      case 'success': return '¡Publicado!';
      default: return '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-gray-900/95 border-white/10">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {currentStep !== 'initial-action' && currentStep !== 'success' && (
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
                <h2 className="text-xl font-bold text-white">SOS-HABILIDOSO Clasificados</h2>
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
          {currentStep !== 'initial-action' && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-400">
                <span>Progreso</span>
                <span>{getStepProgress()}%</span>
              </div>
              <Progress value={getStepProgress()} className="h-2" />
            </div>
          )}
        </DialogHeader>

        <div className="mt-6">
          {currentStep === 'initial-action' && (
            <InitialActionSelector onActionSelect={handleInitialAction} />
          )}

          {currentStep === 'sell-options' && (
            <SellOptionsSelector 
              onOptionSelect={handleSellOption}
              onBack={handleBack}
            />
          )}

          {currentStep === 'hire-options' && (
            <HireOptionsSelector 
              onOptionSelect={handleHireOption}
              onBack={handleBack}
            />
          )}

          {currentStep === 'create-form' && selectedSellType && (
            <DynamicPublicationForm
              publicationType={publicationTypeMap[selectedSellType]}
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
                  Tu {publicationTypeMap[selectedSellType!]?.title.toLowerCase()} ha sido publicado y ya está visible para la comunidad
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
                    onClick={handleClose}
                    className="bg-neon-green text-black hover:bg-neon-green/80"
                  >
                    Ver Mis Publicaciones
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