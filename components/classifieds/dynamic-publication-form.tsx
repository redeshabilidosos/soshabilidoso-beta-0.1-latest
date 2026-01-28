'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  CheckCircle,
  Sparkles,
  Info
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
      {/* Header mejorado */}
      <Card className="glass-card border-white/10 hover:border-neon-green/30 transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${publicationType.bgGradient} flex items-center justify-center border border-white/10`}>
                <Icon className={`w-6 h-6 ${publicationType.color}`} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  {publicationType.title}
                  <Badge variant="outline" className="text-xs border-neon-green/30 text-neon-green">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Nuevo
                  </Badge>
                </h2>
                <p className="text-gray-400 text-sm">{publicationType.subtitle}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={onBack} 
              size="sm" 
              className="text-xs border-white/20 hover:border-neon-green/50 hover:bg-neon-green/10"
            >
              Cambiar Tipo
            </Button>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Información Básica mejorada */}
        <Card className="glass-card border-white/10 hover:border-neon-green/30 transition-all duration-300 group">
          <CardHeader className="pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-neon-green/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckCircle className="w-4 h-4 text-neon-green" />
              </div>
              <div>
                <CardTitle className="text-white text-base">Información Básica</CardTitle>
                <CardDescription className="text-xs text-gray-400">
                  Completa los datos principales de tu publicación
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                Título *
                <Badge variant="outline" className="text-[10px] border-blue-400/30 text-blue-400">
                  Requerido
                </Badge>
              </Label>
              <Input
                id="title"
                placeholder={
                  publicationType.id === 'product' ? 'Ej: iPhone 13 Pro Max 256GB' :
                  publicationType.id === 'marketplace' ? 'Ej: Servicio de limpieza doméstica' :
                  'Ej: Diseño de logotipo profesional'
                }
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="bg-white/5 border-white/10 text-white focus:border-neon-green/50 transition-colors"
                required
              />
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <Info className="w-3 h-3" />
                Usa un título claro y descriptivo
              </p>
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
                placeholder={
                  publicationType.id === 'product' ? 'Describe tu producto, incluye detalles importantes como estado, características, razón de venta, etc.' :
                  publicationType.id === 'marketplace' ? 'Describe tu servicio, experiencia, área de cobertura, horarios disponibles, etc.' :
                  'Describe tu experiencia, proyectos anteriores, metodología de trabajo, etc.'
                }
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="bg-white/5 border-white/10 text-white min-h-[120px] focus:border-neon-green/50 transition-colors resize-none"
                required
              />
              <p className="text-xs text-gray-400">
                {formData.description.length}/500 caracteres
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium text-gray-300">
                  Categoría *
                </Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-neon-green/50 focus:ring-1 focus:ring-neon-green/50 transition-colors"
                  required
                >
                  <option value="" className="bg-gray-900">Seleccionar categoría</option>
                  {getCategories().map(cat => (
                    <option key={cat} value={cat} className="bg-gray-900">{cat}</option>
                  ))}
                </select>
              </div>

              {publicationType.id === 'product' && (
                <div className="space-y-2">
                  <Label htmlFor="condition" className="text-sm font-medium text-gray-300">
                    Estado *
                  </Label>
                  <select
                    id="condition"
                    value={formData.condition}
                    onChange={(e) => handleInputChange('condition', e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-neon-green/50 focus:ring-1 focus:ring-neon-green/50 transition-colors"
                    required
                  >
                    {conditions.map(condition => (
                      <option key={condition} value={condition} className="bg-gray-900">
                        {condition}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Precio y Ubicación mejorado */}
        <Card className="glass-card border-white/10 hover:border-yellow-500/30 transition-all duration-300 group">
          <CardHeader className="pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <DollarSign className="w-4 h-4 text-yellow-400" />
              </div>
              <div>
                <CardTitle className="text-white text-base">Precio y Ubicación</CardTitle>
                <CardDescription className="text-xs text-gray-400">
                  Define el precio y dónde se encuentra
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm font-medium text-gray-300">
                  {publicationType.id === 'freelancer' ? 'Precio desde *' : 'Precio *'}
                </Label>
                <div className="flex gap-2">
                  <select
                    value={formData.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                    className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-neon-green/50 focus:ring-1 focus:ring-neon-green/50 transition-colors w-24"
                  >
                    <option value="COP" className="bg-gray-900">COP</option>
                    <option value="USD" className="bg-gray-900">USD</option>
                  </select>
                  <Input
                    id="price"
                    type="number"
                    placeholder="150000"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className="bg-white/5 border-white/10 text-white focus:border-neon-green/50 transition-colors flex-1"
                    required
                  />
                </div>
                {publicationType.id !== 'product' && (
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    {publicationType.id === 'marketplace' ? 'Precio por hora o servicio' : 'Precio base del proyecto'}
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
                    className="bg-white/5 border-white/10 text-white pl-10 focus:border-neon-green/50 transition-colors"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 p-3 rounded-lg bg-white/5 border border-white/10 hover:border-neon-green/30 transition-colors">
              <input
                type="checkbox"
                id="negotiable"
                checked={formData.negotiable}
                onChange={(e) => handleInputChange('negotiable', e.target.checked)}
                className="rounded border-white/20 bg-white/5 text-neon-green focus:ring-neon-green w-4 h-4"
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

        {/* Campos específicos para freelancer mejorado */}
        {publicationType.id === 'freelancer' && (
          <Card className="glass-card border-white/10 hover:border-blue-500/30 transition-all duration-300 group">
            <CardHeader className="pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Briefcase className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-white text-base">Información Profesional</CardTitle>
                  <CardDescription className="text-xs text-gray-400">
                    Destaca tus habilidades y experiencia
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="skills" className="text-sm font-medium text-gray-300">
                  Habilidades
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="skills"
                    placeholder="Ej: Photoshop, Illustrator..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    className="bg-white/5 border-white/10 text-white focus:border-blue-400/50 transition-colors"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  />
                  <Button 
                    type="button" 
                    onClick={addSkill} 
                    size="sm"
                    className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-400/30"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 min-h-[40px] p-3 rounded-lg bg-white/5 border border-white/10">
                  {formData.skills && formData.skills.length > 0 ? (
                    formData.skills.map(skill => (
                      <Badge key={skill} variant="secondary" className="bg-blue-500/20 text-blue-400 border border-blue-400/30 hover:bg-blue-500/30 transition-colors">
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="ml-2 hover:text-red-400 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400 italic">Agrega habilidades relevantes para tu trabajo</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="deliveryTime" className="text-sm font-medium text-gray-300">
                    Tiempo de entrega
                  </Label>
                  <select
                    id="deliveryTime"
                    value={formData.deliveryTime}
                    onChange={(e) => handleInputChange('deliveryTime', e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/50 transition-colors"
                  >
                    <option value="" className="bg-gray-900">Seleccionar tiempo</option>
                    <option value="1-3 días" className="bg-gray-900">1-3 días</option>
                    <option value="1 semana" className="bg-gray-900">1 semana</option>
                    <option value="2 semanas" className="bg-gray-900">2 semanas</option>
                    <option value="1 mes" className="bg-gray-900">1 mes</option>
                    <option value="Más de 1 mes" className="bg-gray-900">Más de 1 mes</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="portfolio" className="text-sm font-medium text-gray-300">
                    Portfolio/Website
                  </Label>
                  <Input
                    id="portfolio"
                    placeholder="https://mi-portfolio.com"
                    value={formData.portfolio}
                    onChange={(e) => handleInputChange('portfolio', e.target.value)}
                    className="bg-white/5 border-white/10 text-white focus:border-blue-400/50 transition-colors"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Campos específicos para marketplace mejorado */}
        {publicationType.id === 'marketplace' && (
          <Card className="glass-card border-white/10 hover:border-green-500/30 transition-all duration-300 group">
            <CardHeader className="pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Clock className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <CardTitle className="text-white text-base">Disponibilidad del Servicio</CardTitle>
                  <CardDescription className="text-xs text-gray-400">
                    Define cuándo y cómo ofreces tu servicio
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="availability" className="text-sm font-medium text-gray-300">
                    Horarios disponibles
                  </Label>
                  <Input
                    id="availability"
                    placeholder="Lun-Vie 8AM-6PM"
                    value={formData.availability}
                    onChange={(e) => handleInputChange('availability', e.target.value)}
                    className="bg-white/5 border-white/10 text-white focus:border-green-400/50 transition-colors"
                  />
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    Especifica tus horarios de trabajo
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-sm font-medium text-gray-300">
                    Duración típica
                  </Label>
                  <select
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-green-400/50 focus:ring-1 focus:ring-green-400/50 transition-colors"
                  >
                    <option value="" className="bg-gray-900">Seleccionar duración</option>
                    <option value="30 min" className="bg-gray-900">30 minutos</option>
                    <option value="1 hora" className="bg-gray-900">1 hora</option>
                    <option value="2-3 horas" className="bg-gray-900">2-3 horas</option>
                    <option value="Medio día" className="bg-gray-900">Medio día</option>
                    <option value="Día completo" className="bg-gray-900">Día completo</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Imágenes mejorado */}
        <Card className="glass-card border-white/10 hover:border-purple-500/30 transition-all duration-300 group">
          <CardHeader className="pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Camera className="w-4 h-4 text-purple-400" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-white text-base flex items-center gap-2">
                  Imágenes
                  {publicationType.id === 'product' ? (
                    <Badge variant="outline" className="text-[10px] border-red-400/30 text-red-400">
                      Requeridas
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px] border-gray-400/30 text-gray-400">
                      Opcionales
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="text-xs text-gray-400">
                  Máximo 5 imágenes, JPG o PNG hasta 5MB cada una
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div
              className={`
                border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300
                ${dragActive 
                  ? 'border-neon-green bg-neon-green/10 scale-[1.02]' 
                  : 'border-white/20 hover:border-neon-green/50 hover:bg-white/5'
                }
              `}
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                handleImageUpload(e.dataTransfer.files);
              }}
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mx-auto mb-4 border border-purple-400/30">
                <Upload className="w-8 h-8 text-purple-400" />
              </div>
              <p className="text-white mb-2 font-medium">Arrastra imágenes aquí o haz clic para seleccionar</p>
              <p className="text-gray-400 text-sm mb-4">
                Sube hasta 5 imágenes de alta calidad para mostrar tu {publicationType.id === 'product' ? 'producto' : publicationType.id === 'marketplace' ? 'servicio' : 'trabajo'}
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files)}
                className="hidden"
                id="image-upload"
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => document.getElementById('image-upload')?.click()}
                className="border-purple-400/30 hover:border-purple-400 hover:bg-purple-500/10 text-purple-400"
              >
                <Camera className="w-4 h-4 mr-2" />
                Seleccionar Imágenes
              </Button>
            </div>

            {formData.images.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-300 font-medium">
                    {formData.images.length} imagen{formData.images.length !== 1 ? 'es' : ''} seleccionada{formData.images.length !== 1 ? 's' : ''}
                  </p>
                  <Badge variant="outline" className="text-xs border-purple-400/30 text-purple-400">
                    {formData.images.length}/5
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden border border-white/10 group-hover:border-purple-400/50 transition-all">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 hover:scale-110 shadow-lg"
                      >
                        <X className="w-4 h-4 text-white" />
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

        {/* Botones de acción mejorados */}
        <div className="flex justify-between items-center pt-4 border-t border-white/10">
          <Button 
            variant="outline" 
            onClick={onBack} 
            type="button"
            className="border-white/20 hover:border-red-400/50 hover:bg-red-500/10 hover:text-red-400 transition-all"
          >
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
          <CyberButton 
            type="submit" 
            disabled={isLoading} 
            className="min-w-[160px] hover:scale-105 transition-transform"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Publicando...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Publicar Ahora
              </>
            )}
          </CyberButton>
        </div>
      </form>
    </div>
  );
}