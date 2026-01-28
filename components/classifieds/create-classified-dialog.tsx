'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CyberButton } from '@/components/ui/cyber-button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Upload, 
  X, 
  DollarSign, 
  MapPin, 
  Tag,
  Camera,
  AlertCircle,
  CheckCircle,
  Info,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

interface CreateClassifiedDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onClassifiedCreated: (classified: any) => void;
}

const categories = [
  'Deportes', 'Tecnología', 'Música', 'Moda', 'Hogar', 'Vehículos', 
  'Libros', 'Juegos', 'Arte', 'Instrumentos', 'Electrónicos', 'Otros'
];

const conditions = [
  'Nuevo', 'Usado - Como Nuevo', 'Usado - Buen Estado', 
  'Usado - Estado Regular', 'Para Reparar'
];

export function CreateClassifiedDialog({ 
  isOpen, 
  onClose, 
  onClassifiedCreated 
}: CreateClassifiedDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: '',
    location: '',
    negotiable: false,
    tags: '',
    contactPhone: '',
    contactEmail: '',
    whatsapp: ''
  });
  
  const [images, setImages] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 5) {
      toast.error('Máximo 5 imágenes permitidas');
      return;
    }
    
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} es muy grande. Máximo 5MB por imagen.`);
        return false;
      }
      return true;
    });
    
    setImages(prev => [...prev, ...validFiles]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = 'El título es requerido';
    if (!formData.description.trim()) newErrors.description = 'La descripción es requerida';
    if (!formData.price.trim()) newErrors.price = 'El precio es requerido';
    if (!formData.category) newErrors.category = 'La categoría es requerida';
    if (!formData.condition) newErrors.condition = 'El estado es requerido';
    if (!formData.location.trim()) newErrors.location = 'La ubicación es requerida';
    
    // Validar precio
    if (formData.price && isNaN(Number(formData.price))) {
      newErrors.price = 'El precio debe ser un número válido';
    }
    
    // Validar al menos un método de contacto
    if (!formData.contactPhone && !formData.contactEmail && !formData.whatsapp) {
      newErrors.contact = 'Debe proporcionar al menos un método de contacto';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Por favor, completa todos los campos requeridos');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simular creación del clasificado
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newClassified = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        currency: 'COP',
        category: formData.category,
        condition: formData.condition,
        location: formData.location,
        negotiable: formData.negotiable,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        contact: {
          phone: formData.contactPhone,
          email: formData.contactEmail,
          whatsapp: formData.whatsapp
        },
        images: images.map(img => URL.createObjectURL(img)),
        seller: {
          id: '1',
          name: 'Usuario Actual',
          avatar: '/api/placeholder/40/40',
          rating: 5.0,
          verified: true
        },
        createdAt: new Date().toISOString(),
        views: 0,
        likes: 0,
        isLiked: false,
        featured: false
      };
      
      onClassifiedCreated(newClassified);
      toast.success('¡Clasificado publicado exitosamente!');
      
      // Resetear formulario
      setFormData({
        title: '',
        description: '',
        price: '',
        category: '',
        condition: '',
        location: '',
        negotiable: false,
        tags: '',
        contactPhone: '',
        contactEmail: '',
        whatsapp: ''
      });
      setImages([]);
      setErrors({});
      onClose();
      
    } catch (error) {
      toast.error('Error al publicar el clasificado');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] glass-card border-neon-green/20 max-h-[90vh] overflow-y-auto backdrop-blur-xl">
        <DialogHeader className="border-b border-white/10 pb-4">
          <DialogTitle className="text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-green/20 to-neon-green/10 flex items-center justify-center border border-neon-green/30">
              <Tag className="w-5 h-5 text-neon-green" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">Publicar Clasificado</span>
                <Badge variant="outline" className="text-xs border-neon-green/30 text-neon-green">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Rápido
                </Badge>
              </div>
              <p className="text-sm text-gray-400 font-normal mt-1">
                Completa el formulario para publicar tu anuncio
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Información básica mejorada */}
          <Card className="glass-card border-white/10 hover:border-neon-green/30 transition-all duration-300">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-neon-green/20 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-neon-green" />
                </div>
                <h3 className="text-base font-semibold text-white">Información del Producto</h3>
              </div>
            
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  Título *
                  <Badge variant="outline" className="text-[10px] border-blue-400/30 text-blue-400">
                    Requerido
                  </Badge>
                </Label>
                <Input
                  id="title"
                  placeholder="Ej: iPhone 13 Pro Max 256GB"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-neon-green/50 transition-colors"
                />
                {errors.title && (
                  <p className="text-red-400 text-xs flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.title}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  Descripción *
                  <Badge variant="outline" className="text-[10px] border-blue-400/30 text-blue-400">
                    Requerido
                  </Badge>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe tu producto, incluye detalles importantes como estado, características, razón de venta, etc."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400 min-h-[100px] focus:border-neon-green/50 transition-colors resize-none"
                />
                {errors.description && (
                  <p className="text-red-400 text-xs flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-medium text-gray-300">
                    Categoría *
                  </Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-neon-green/50 focus:ring-1 focus:ring-neon-green/50 transition-colors"
                  >
                    <option value="" className="bg-gray-900">Seleccionar categoría</option>
                    {categories.map(category => (
                      <option key={category} value={category} className="bg-gray-900">
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-400 text-xs flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.category}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condition" className="text-sm font-medium text-gray-300">
                    Estado *
                  </Label>
                  <select
                    id="condition"
                    value={formData.condition}
                    onChange={(e) => handleInputChange('condition', e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-neon-green/50 focus:ring-1 focus:ring-neon-green/50 transition-colors"
                  >
                    <option value="" className="bg-gray-900">Seleccionar estado</option>
                    {conditions.map(condition => (
                      <option key={condition} value={condition} className="bg-gray-900">
                        {condition}
                      </option>
                    ))}
                  </select>
                  {errors.condition && (
                    <p className="text-red-400 text-xs flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.condition}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Precio y ubicación mejorado */}
          <Card className="glass-card border-white/10 hover:border-yellow-500/30 transition-all duration-300">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-yellow-400" />
                </div>
                <h3 className="text-base font-semibold text-white">Precio y Ubicación</h3>
              </div>
            
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-sm font-medium text-gray-300">
                    Precio (COP) *
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="price"
                      type="number"
                      placeholder="150000"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-yellow-400/50 transition-colors"
                    />
                  </div>
                  {errors.price && (
                    <p className="text-red-400 text-xs flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.price}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm font-medium text-gray-300">
                    Ubicación *
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="location"
                      placeholder="Bogotá, Colombia"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-yellow-400/50 transition-colors"
                    />
                  </div>
                  {errors.location && (
                    <p className="text-red-400 text-xs flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.location}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2 p-3 rounded-lg bg-white/5 border border-white/10 hover:border-neon-green/30 transition-colors">
                <input
                  type="checkbox"
                  id="negotiable"
                  checked={formData.negotiable}
                  onChange={(e) => handleInputChange('negotiable', e.target.checked)}
                  className="rounded border-white/20 bg-white/10 text-neon-green focus:ring-neon-green w-4 h-4"
                />
                <label htmlFor="negotiable" className="text-sm text-gray-300 cursor-pointer flex-1">
                  Precio negociable
                </label>
                <Badge variant="outline" className="text-[10px] border-neon-green/30 text-neon-green">
                  Recomendado
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Imágenes mejorado */}
          <Card className="glass-card border-white/10 hover:border-purple-500/30 transition-all duration-300">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Camera className="w-4 h-4 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-white">Imágenes</h3>
                  <p className="text-xs text-gray-400">Máximo 5 imágenes, 5MB cada una</p>
                </div>
              </div>
            
              <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:border-purple-400/50 hover:bg-white/5 transition-all">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mx-auto mb-3 border border-purple-400/30">
                    <Camera className="w-7 h-7 text-purple-400" />
                  </div>
                  <p className="text-white mb-2 font-medium">Subir imágenes</p>
                  <p className="text-xs text-gray-400">
                    Arrastra archivos o haz clic para seleccionar
                  </p>
                </label>
              </div>

              {images.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-300 font-medium">
                      {images.length} imagen{images.length !== 1 ? 'es' : ''} seleccionada{images.length !== 1 ? 's' : ''}
                    </p>
                    <Badge variant="outline" className="text-xs border-purple-400/30 text-purple-400">
                      {images.length}/5
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-white/10 group-hover:border-purple-400/50 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        {index === 0 && (
                          <Badge className="absolute bottom-2 left-2 text-[10px] bg-neon-green text-black">
                            Principal
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Información de contacto mejorada */}
          <Card className="glass-card border-white/10 hover:border-blue-500/30 transition-all duration-300">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Info className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-white">Información de Contacto</h3>
                  <p className="text-xs text-gray-400">Al menos un método de contacto es requerido</p>
                </div>
              </div>
            
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactPhone" className="text-sm font-medium text-gray-300">
                    Teléfono
                  </Label>
                  <Input
                    id="contactPhone"
                    placeholder="+57 300 123 4567"
                    value={formData.contactPhone}
                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-blue-400/50 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactEmail" className="text-sm font-medium text-gray-300">
                    Email
                  </Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-blue-400/50 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsapp" className="text-sm font-medium text-gray-300">
                    WhatsApp
                  </Label>
                  <Input
                    id="whatsapp"
                    placeholder="+57 300 123 4567"
                    value={formData.whatsapp}
                    onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-blue-400/50 transition-colors"
                  />
                </div>
              </div>

              {errors.contact && (
                <div className="flex items-center space-x-2 text-red-400 text-xs p-3 rounded-lg bg-red-500/10 border border-red-400/30">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errors.contact}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tags mejorado */}
          <Card className="glass-card border-white/10 hover:border-green-500/30 transition-all duration-300">
            <CardContent className="p-4 space-y-2">
              <Label htmlFor="tags" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                Etiquetas (separadas por comas)
                <Badge variant="outline" className="text-[10px] border-gray-400/30 text-gray-400">
                  Opcional
                </Badge>
              </Label>
              <Input
                id="tags"
                placeholder="nike, zapatillas, fútbol, talla 42"
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-green-400/50 transition-colors"
              />
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <Info className="w-3 h-3" />
                Las etiquetas ayudan a que tu anuncio sea más fácil de encontrar
              </p>
            </CardContent>
          </Card>

          {/* Botones mejorados */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-white/10">
            <CyberButton
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="border-white/20 hover:border-red-400/50 hover:bg-red-500/10 hover:text-red-400"
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </CyberButton>
            <CyberButton
              type="submit"
              disabled={isLoading}
              className="min-w-[140px] hover:scale-105 transition-transform"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Publicando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Publicar
                </>
              )}
            </CyberButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}