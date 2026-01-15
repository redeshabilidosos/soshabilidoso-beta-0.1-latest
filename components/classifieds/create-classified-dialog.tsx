'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
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
  AlertCircle
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
      <DialogContent className="sm:max-w-[600px] glass-card border-neon-green/20 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center space-x-2">
            <Tag className="w-5 h-5 text-neon-green" />
            <span>Publicar Clasificado</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Información del Producto</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Título *
              </label>
              <Input
                placeholder="Ej: iPhone 13 Pro Max 256GB"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder-gray-400"
              />
              {errors.title && (
                <p className="text-red-400 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descripción *
              </label>
              <Textarea
                placeholder="Describe tu producto, incluye detalles importantes como estado, características, razón de venta, etc."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder-gray-400 min-h-[100px]"
              />
              {errors.description && (
                <p className="text-red-400 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                  Estado *
                </label>
                <select
                  value={formData.condition}
                  onChange={(e) => handleInputChange('condition', e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                >
                  <option value="">Seleccionar estado</option>
                  {conditions.map(condition => (
                    <option key={condition} value={condition} className="bg-gray-800">
                      {condition}
                    </option>
                  ))}
                </select>
                {errors.condition && (
                  <p className="text-red-400 text-sm mt-1">{errors.condition}</p>
                )}
              </div>
            </div>
          </div>

          {/* Precio y ubicación */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Precio y Ubicación</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Precio (COP) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="number"
                    placeholder="150000"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
                  />
                </div>
                {errors.price && (
                  <p className="text-red-400 text-sm mt-1">{errors.price}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ubicación *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Bogotá, Colombia"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
                  />
                </div>
                {errors.location && (
                  <p className="text-red-400 text-sm mt-1">{errors.location}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="negotiable"
                checked={formData.negotiable}
                onChange={(e) => handleInputChange('negotiable', e.target.checked)}
                className="rounded border-white/20 bg-white/10 text-neon-green focus:ring-neon-green"
              />
              <label htmlFor="negotiable" className="text-sm text-gray-300">
                Precio negociable
              </label>
            </div>
          </div>

          {/* Imágenes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Imágenes</h3>
            
            <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-white mb-2">Subir imágenes</p>
                <p className="text-sm text-gray-400">
                  Máximo 5 imágenes, 5MB cada una
                </p>
              </label>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Información de contacto */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Información de Contacto</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Teléfono
                </label>
                <Input
                  placeholder="+57 300 123 4567"
                  value={formData.contactPhone}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  WhatsApp
                </label>
                <Input
                  placeholder="+57 300 123 4567"
                  value={formData.whatsapp}
                  onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
              </div>
            </div>

            {errors.contact && (
              <div className="flex items-center space-x-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.contact}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Etiquetas (separadas por comas)
            </label>
            <Input
              placeholder="nike, zapatillas, fútbol, talla 42"
              value={formData.tags}
              onChange={(e) => handleInputChange('tags', e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder-gray-400"
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-4 pt-4">
            <CyberButton
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </CyberButton>
            <CyberButton
              type="submit"
              disabled={isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? 'Publicando...' : 'Publicar'}
            </CyberButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}