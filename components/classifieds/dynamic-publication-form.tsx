'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CyberButton } from '@/components/ui/cyber-button';
import { 
  Upload, 
  MapPin, 
  DollarSign, 
  Clock, 
  Calendar,
  Star,
  Briefcase,
  Camera,
  Plus,
  X,
  CheckCircle
} from 'lucide-react';
import { PublicationType } from './publication-type-selector';

interface FormData {
  title: string;
  description: string;
  price: string;
  currency: 'COP' | 'USD';
  location: string;
  category: string;
  condition?: string;
  negotiable: boolean;
  images: File[];
  // Campos específicos para servicios
  serviceType?: string;
  availability?: string;
  duration?: string;
  // Campos específicos para freelancer
  skills?: string[];
  portfolio?: string;
  deliveryTime?: string;
  projectType?: string;
}

interface DynamicPublicationFormProps {
  publicationType: PublicationType;
  onSubmit: (data: FormData) => void;
  onBack: () => void;
  isLoading?: boolean;
}

const productCategories = [
  'Electrónicos', 'Ropa y Accesorios', 'Deportes', 'Música', 'Libros',
  'Hogar y Jardín', 'Vehículos', 'Mascotas', 'Juguetes', 'Otros'
];

const serviceCategories = [
  'Limpieza', 'Reparaciones', 'Delivery', 'Tutorías', 'Cuidado Personal',
  'Jardinería', 'Transporte', 'Eventos', 'Mascotas', 'Otros Servicios'
];

const freelancerCategories = [
  'Diseño Gráfico', 'Desarrollo Web', 'Marketing Digital', 'Redacción',
  'Traducción', 'Fotografía', 'Video Edición', 'Consultoría', 'Música', 'Otros'
];

const conditions = ['Nuevo', 'Usado - Como Nuevo', 'Usado - Buen Estado', 'Usado - Regular'];

export function DynamicPublicationForm({ 
  publicationType, 
  onSubmit, 
  onBack, 
  isLoading = false 
}: DynamicPublicationFormProps) {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    price: '',
    currency: 'COP',
    location: '',
    category: '',
    condition: publicationType.id === 'product' ? 'Nuevo' : undefined,
    negotiable: false,
    images: [],
    skills: [],
    availability: '',
    duration: '',
    portfolio: '',
    deliveryTime: '',
    projectType: '',
    serviceType: ''
  });

  const [dragActive, setDragActive] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (files: FileList | null) => {
    if (files) {
      const newImages = Array.from(files).slice(0, 5 - formData.images.length);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills?.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...(prev.skills || []), newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills?.filter(s => s !== skill) || []
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const getCategories = () => {
    switch (publicationType.id) {
      case 'product': return productCategories;
      case 'marketplace': return serviceCategories;
      case 'freelancer': return freelancerCategories;
      default: return [];
    }
  };

  const Icon = publicationType.icon;

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${publicationType.bgGradient} flex items-center justify-center`}>
            <Icon className={`w-4 h-4 ${publicationType.color}`} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{publicationType.title}</h2>
            <p className="text-gray-400 text-xs">{publicationType.subtitle}</p>
          </div>
        </div>
        <Button variant="outline" onClick={onBack} size="sm" className="text-xs">
          Cambiar Tipo
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Información Básica */}
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center space-x-2 text-sm">
              <CheckCircle className="w-4 h-4 text-neon-green" />
              <span>Información Básica</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Título *
              </label>
              <Input
                placeholder={
                  publicationType.id === 'product' ? 'Ej: iPhone 13 Pro Max 256GB' :
                  publicationType.id === 'marketplace' ? 'Ej: Servicio de limpieza doméstica' :
                  'Ej: Diseño de logotipo profesional'
                }
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="bg-white/5 border-white/10 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descripción *
              </label>
              <Textarea
                placeholder={
                  publicationType.id === 'product' ? 'Describe tu producto, incluye detalles importantes como estado, características, razón de venta, etc.' :
                  publicationType.id === 'marketplace' ? 'Describe tu servicio, experiencia, área de cobertura, horarios disponibles, etc.' :
                  'Describe tu experiencia, proyectos anteriores, metodología de trabajo, etc.'
                }
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="bg-white/5 border-white/10 text-white min-h-[100px]"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Categoría *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white"
                  required
                >
                  <option value="">Seleccionar categoría</option>
                  {getCategories().map(cat => (
                    <option key={cat} value={cat} className="bg-gray-800">{cat}</option>
                  ))}
                </select>
              </div>

              {publicationType.id === 'product' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Estado *
                  </label>
                  <select
                    value={formData.condition}
                    onChange={(e) => handleInputChange('condition', e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white"
                    required
                  >
                    {conditions.map(condition => (
                      <option key={condition} value={condition} className="bg-gray-800">
                        {condition}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Precio y Ubicación */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-neon-green" />
              <span>Precio y Ubicación</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {publicationType.id === 'freelancer' ? 'Precio desde *' : 'Precio *'}
                </label>
                <div className="flex">
                  <select
                    value={formData.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                    className="px-3 py-2 bg-white/5 border border-white/10 rounded-l-md text-white border-r-0"
                  >
                    <option value="COP" className="bg-gray-800">COP</option>
                    <option value="USD" className="bg-gray-800">USD</option>
                  </select>
                  <Input
                    type="number"
                    placeholder="150000"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className="bg-white/5 border-white/10 text-white rounded-l-none"
                    required
                  />
                </div>
                {publicationType.id !== 'product' && (
                  <p className="text-xs text-gray-400 mt-1">
                    {publicationType.id === 'marketplace' ? 'Precio por hora o servicio' : 'Precio base del proyecto'}
                  </p>
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
                    className="bg-white/5 border-white/10 text-white pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="negotiable"
                checked={formData.negotiable}
                onChange={(e) => handleInputChange('negotiable', e.target.checked)}
                className="rounded border-white/20 bg-white/5 text-neon-green focus:ring-neon-green"
              />
              <label htmlFor="negotiable" className="text-sm text-gray-300">
                Precio negociable
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Campos específicos por tipo */}
        {publicationType.id === 'freelancer' && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-neon-green" />
                <span>Información Profesional</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Habilidades
                </label>
                <div className="flex space-x-2 mb-2">
                  <Input
                    placeholder="Ej: Photoshop, Illustrator..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  />
                  <Button type="button" onClick={addSkill} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills?.map(skill => (
                    <Badge key={skill} variant="secondary" className="bg-neon-green/20 text-neon-green">
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-2 hover:text-red-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tiempo de entrega
                  </label>
                  <select
                    value={formData.deliveryTime}
                    onChange={(e) => handleInputChange('deliveryTime', e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white"
                  >
                    <option value="">Seleccionar tiempo</option>
                    <option value="1-3 días" className="bg-gray-800">1-3 días</option>
                    <option value="1 semana" className="bg-gray-800">1 semana</option>
                    <option value="2 semanas" className="bg-gray-800">2 semanas</option>
                    <option value="1 mes" className="bg-gray-800">1 mes</option>
                    <option value="Más de 1 mes" className="bg-gray-800">Más de 1 mes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Portfolio/Website
                  </label>
                  <Input
                    placeholder="https://mi-portfolio.com"
                    value={formData.portfolio}
                    onChange={(e) => handleInputChange('portfolio', e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {publicationType.id === 'marketplace' && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Clock className="w-5 h-5 text-neon-green" />
                <span>Disponibilidad del Servicio</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Horarios disponibles
                  </label>
                  <Input
                    placeholder="Lun-Vie 8AM-6PM"
                    value={formData.availability}
                    onChange={(e) => handleInputChange('availability', e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Duración típica
                  </label>
                  <select
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white"
                  >
                    <option value="">Seleccionar duración</option>
                    <option value="30 min" className="bg-gray-800">30 minutos</option>
                    <option value="1 hora" className="bg-gray-800">1 hora</option>
                    <option value="2-3 horas" className="bg-gray-800">2-3 horas</option>
                    <option value="Medio día" className="bg-gray-800">Medio día</option>
                    <option value="Día completo" className="bg-gray-800">Día completo</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Imágenes */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Camera className="w-5 h-5 text-neon-green" />
              <span>Imágenes {publicationType.id === 'product' ? '(Requeridas)' : '(Opcionales)'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className={`
                border-2 border-dashed rounded-lg p-8 text-center transition-colors
                ${dragActive ? 'border-neon-green bg-neon-green/5' : 'border-white/20'}
              `}
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                handleImageUpload(e.dataTransfer.files);
              }}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-white mb-2">Arrastra imágenes aquí o haz clic para seleccionar</p>
              <p className="text-gray-400 text-sm mb-4">Máximo 5 imágenes, JPG o PNG</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files)}
                className="hidden"
                id="image-upload"
              />
              <Button type="button" variant="outline" onClick={() => document.getElementById('image-upload')?.click()}>
                Seleccionar Imágenes
              </Button>
            </div>

            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square bg-gray-700 rounded-lg overflow-hidden">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Botones de acción */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack} type="button">
            Volver
          </Button>
          <CyberButton type="submit" disabled={isLoading} className="min-w-[120px]">
            {isLoading ? 'Publicando...' : 'Publicar'}
          </CyberButton>
        </div>
      </form>
    </div>
  );
}