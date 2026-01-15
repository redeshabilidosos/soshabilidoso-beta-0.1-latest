'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CyberButton } from '@/components/ui/cyber-button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Group, 
  Users, 
  Lock, 
  Globe, 
  CreditCard,
  Camera,
  X,
  AlertCircle,
  Settings,
  MessageSquare,
  Video,
  Mic,
  Radio,
  Hash
} from 'lucide-react';
import { toast } from 'sonner';

interface CreateCommunityDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCommunityCreated: (community: any) => void;
}

const categories = [
  'Deportes', 'Música', 'Arte', 'Gaming', 'Tecnología', 'Lifestyle',
  'Educación', 'Negocios', 'Entretenimiento', 'Salud', 'Viajes', 'Otros'
];

const communityTypes = [
  {
    value: 'public',
    label: 'Comunidad Pública',
    description: 'Cualquiera puede unirse y ver el contenido',
    icon: Globe,
    features: ['Acceso libre', 'Contenido público', 'Búsqueda visible']
  },
  {
    value: 'private',
    label: 'Grupo Privado',
    description: 'Solo miembros invitados pueden ver y participar',
    icon: Lock,
    features: ['Solo por invitación', 'Contenido privado', 'Moderación estricta']
  },
  {
    value: 'premium',
    label: 'Página Premium',
    description: 'Acceso de pago con contenido exclusivo',
    icon: CreditCard,
    features: ['Suscripción mensual', 'Contenido exclusivo', 'Sin anuncios']
  }
];

const contentTypes = [
  { value: 'text', label: 'Texto', icon: MessageSquare, description: 'Publicaciones de texto y discusiones' },
  { value: 'images', label: 'Imágenes', icon: Camera, description: 'Fotos y contenido visual' },
  { value: 'videos', label: 'Videos', icon: Video, description: 'Contenido audiovisual' },
  { value: 'podcasts', label: 'Podcasts', icon: Mic, description: 'Audio y podcasts' },
  { value: 'streaming', label: 'Streaming', icon: Radio, description: 'Transmisiones en vivo' }
];

export function CreateCommunityDialog({ 
  isOpen, 
  onClose, 
  onCommunityCreated 
}: CreateCommunityDialogProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    type: 'public',
    tags: '',
    rules: '',
    welcomeMessage: '',
    allowedContentTypes: ['text'],
    membershipFee: '',
    moderationLevel: 'medium'
  });
  
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleContentTypeToggle = (contentType: string) => {
    setFormData(prev => ({
      ...prev,
      allowedContentTypes: prev.allowedContentTypes.includes(contentType)
        ? prev.allowedContentTypes.filter(type => type !== contentType)
        : [...prev.allowedContentTypes, contentType]
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('La imagen es muy grande. Máximo 5MB.');
        return;
      }
      setCoverImage(file);
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.description.trim()) newErrors.description = 'La descripción es requerida';
    if (!formData.category) newErrors.category = 'La categoría es requerida';
    if (!formData.type) newErrors.type = 'El tipo de comunidad es requerido';
    
    if (formData.name.length < 3) newErrors.name = 'El nombre debe tener al menos 3 caracteres';
    if (formData.description.length < 10) newErrors.description = 'La descripción debe tener al menos 10 caracteres';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (formData.allowedContentTypes.length === 0) {
      newErrors.contentTypes = 'Debe seleccionar al menos un tipo de contenido';
    }
    
    if (formData.type === 'premium' && !formData.membershipFee) {
      newErrors.membershipFee = 'El precio de membresía es requerido para páginas premium';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;
    
    setIsLoading(true);
    
    try {
      // Simular creación de la comunidad
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newCommunity = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        category: formData.category,
        type: formData.type,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        rules: formData.rules,
        welcomeMessage: formData.welcomeMessage,
        allowedContentTypes: formData.allowedContentTypes,
        membershipFee: formData.type === 'premium' ? Number(formData.membershipFee) : 0,
        moderationLevel: formData.moderationLevel,
        coverImage: coverImage ? URL.createObjectURL(coverImage) : null,
        members: 1,
        posts: 0,
        isPublic: formData.type === 'public',
        isJoined: true,
        lastActivity: 'Ahora',
        moderators: 1,
        owner: {
          id: '1',
          name: 'Usuario Actual',
          avatar: '/api/placeholder/40/40'
        },
        createdAt: new Date().toISOString()
      };
      
      onCommunityCreated(newCommunity);
      toast.success('¡Comunidad creada exitosamente!');
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        category: '',
        type: 'public',
        tags: '',
        rules: '',
        welcomeMessage: '',
        allowedContentTypes: ['text'],
        membershipFee: '',
        moderationLevel: 'medium'
      });
      setCoverImage(null);
      setErrors({});
      setStep(1);
      onClose();
      
    } catch (error) {
      toast.error('Error al crear la comunidad');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedType = communityTypes.find(type => type.value === formData.type);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] glass-card border-neon-green/20 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center space-x-2">
            <Group className="w-5 h-5 text-neon-green" />
            <span>Crear Nueva Comunidad</span>
          </DialogTitle>
          
          {/* Progress indicator */}
          <div className="flex items-center space-x-2 mt-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber 
                    ? 'bg-neon-green text-black' 
                    : 'bg-white/10 text-gray-400'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-12 h-0.5 mx-2 ${
                    step > stepNumber ? 'bg-neon-green' : 'bg-white/10'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step 1: Información básica */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Información Básica</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Nombre de la Comunidad *
                    </label>
                    <Input
                      placeholder="Ej: Fútbol Profesional Colombia"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    />
                    {errors.name && (
                      <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Descripción *
                    </label>
                    <Textarea
                      placeholder="Describe de qué trata tu comunidad, qué tipo de contenido se compartirá y qué pueden esperar los miembros..."
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400 min-h-[100px]"
                    />
                    {errors.description && (
                      <p className="text-red-400 text-sm mt-1">{errors.description}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Categoría *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    >
                      <option value="">Seleccionar categoría</option>
                      {categories.map(category => (
                        <option key={category} value={category} className="bg-gray-800">
                          {category}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-red-400 text-sm mt-1">{errors.category}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Etiquetas (separadas por comas)
                    </label>
                    <Input
                      placeholder="fútbol, deportes, colombia, liga"
                      value={formData.tags}
                      onChange={(e) => handleInputChange('tags', e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>

              {/* Tipo de comunidad */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">Tipo de Comunidad *</h4>
                <div className="grid grid-cols-1 gap-4">
                  {communityTypes.map((type) => (
                    <Card 
                      key={type.value}
                      className={`cursor-pointer transition-all duration-300 ${
                        formData.type === type.value 
                          ? 'glass-card border-neon-green/50 bg-neon-green/10' 
                          : 'glass-card border-white/10 hover:border-white/20'
                      }`}
                      onClick={() => handleInputChange('type', type.value)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${
                            formData.type === type.value 
                              ? 'bg-neon-green/20 text-neon-green' 
                              : 'bg-white/10 text-gray-400'
                          }`}>
                            <type.icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <h5 className="font-semibold text-white mb-1">{type.label}</h5>
                            <p className="text-sm text-gray-400 mb-2">{type.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {type.features.map((feature, index) => (
                                <Badge key={index} variant="outline" className="text-xs bg-white/5 border-white/10 text-gray-300">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {errors.type && (
                  <p className="text-red-400 text-sm mt-1">{errors.type}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Configuración de contenido */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Configuración de Contenido</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Tipos de Contenido Permitidos *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {contentTypes.map((contentType) => (
                        <Card 
                          key={contentType.value}
                          className={`cursor-pointer transition-all duration-300 ${
                            formData.allowedContentTypes.includes(contentType.value)
                              ? 'glass-card border-neon-green/50 bg-neon-green/10' 
                              : 'glass-card border-white/10 hover:border-white/20'
                          }`}
                          onClick={() => handleContentTypeToggle(contentType.value)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center space-x-2">
                              <contentType.icon className={`w-4 h-4 ${
                                formData.allowedContentTypes.includes(contentType.value)
                                  ? 'text-neon-green' 
                                  : 'text-gray-400'
                              }`} />
                              <div>
                                <p className="text-sm font-medium text-white">{contentType.label}</p>
                                <p className="text-xs text-gray-400">{contentType.description}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    {errors.contentTypes && (
                      <p className="text-red-400 text-sm mt-1">{errors.contentTypes}</p>
                    )}
                  </div>

                  {formData.type === 'premium' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Precio de Membresía Mensual (COP) *
                      </label>
                      <Input
                        type="number"
                        placeholder="15000"
                        value={formData.membershipFee}
                        onChange={(e) => handleInputChange('membershipFee', e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                      />
                      {errors.membershipFee && (
                        <p className="text-red-400 text-sm mt-1">{errors.membershipFee}</p>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Nivel de Moderación
                    </label>
                    <select
                      value={formData.moderationLevel}
                      onChange={(e) => handleInputChange('moderationLevel', e.target.value)}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    >
                      <option value="low" className="bg-gray-800">Baja - Libertad total</option>
                      <option value="medium" className="bg-gray-800">Media - Moderación equilibrada</option>
                      <option value="high" className="bg-gray-800">Alta - Moderación estricta</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Configuración final */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Configuración Final</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Imagen de Portada
                    </label>
                    <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="cover-upload"
                      />
                      <label htmlFor="cover-upload" className="cursor-pointer">
                        {coverImage ? (
                          <div className="space-y-2">
                            <img
                              src={URL.createObjectURL(coverImage)}
                              alt="Preview"
                              className="w-full h-32 object-cover rounded-lg mx-auto"
                            />
                            <p className="text-sm text-gray-400">Haz clic para cambiar</p>
                          </div>
                        ) : (
                          <div>
                            <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-white mb-2">Subir imagen de portada</p>
                            <p className="text-sm text-gray-400">Recomendado: 1200x400px, máximo 5MB</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Mensaje de Bienvenida
                    </label>
                    <Textarea
                      placeholder="¡Bienvenido a nuestra comunidad! Aquí puedes..."
                      value={formData.welcomeMessage}
                      onChange={(e) => handleInputChange('welcomeMessage', e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Reglas de la Comunidad
                    </label>
                    <Textarea
                      placeholder="1. Respeta a todos los miembros&#10;2. No spam o contenido inapropiado&#10;3. Mantén las discusiones relevantes al tema..."
                      value={formData.rules}
                      onChange={(e) => handleInputChange('rules', e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400 min-h-[100px]"
                    />
                  </div>
                </div>
              </div>

              {/* Resumen */}
              <Card className="glass-card">
                <CardContent className="p-4">
                  <h4 className="text-lg font-semibold text-white mb-3">Resumen</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Nombre:</span>
                      <span className="text-white">{formData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tipo:</span>
                      <span className="text-white">{selectedType?.label}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Categoría:</span>
                      <span className="text-white">{formData.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Contenido:</span>
                      <span className="text-white">{formData.allowedContentTypes.length} tipos</span>
                    </div>
                    {formData.type === 'premium' && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Precio:</span>
                        <span className="text-neon-green">${Number(formData.membershipFee).toLocaleString()} COP/mes</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between pt-4">
            <div>
              {step > 1 && (
                <CyberButton
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  disabled={isLoading}
                >
                  Anterior
                </CyberButton>
              )}
            </div>
            
            <div className="flex space-x-2">
              <CyberButton
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancelar
              </CyberButton>
              
              {step < 3 ? (
                <CyberButton onClick={handleNext}>
                  Siguiente
                </CyberButton>
              ) : (
                <CyberButton
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="min-w-[120px]"
                >
                  {isLoading ? 'Creando...' : 'Crear Comunidad'}
                </CyberButton>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}