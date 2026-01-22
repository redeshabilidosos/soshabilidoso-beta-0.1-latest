'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CyberButton } from '@/components/ui/cyber-button';
import { 
  CalendarDays, 
  MapPin, 
  Clock, 
  Users, 
  Music, 
  Palette, 
  Theater, 
  Camera,
  Plus,
  X,
  Instagram,
  Facebook,
  Twitter,
  Globe,
  Upload,
  Tag,
  DollarSign,
  Info
} from 'lucide-react';
import { toast } from 'sonner';

interface CreateEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated: (event: any) => void;
}

const eventCategories = [
  { id: 'musica', name: 'Música', icon: Music, color: 'bg-blue-500/20 text-blue-400 border-blue-400/30' },
  { id: 'arte', name: 'Arte', icon: Palette, color: 'bg-purple-500/20 text-purple-400 border-purple-400/30' },
  { id: 'teatro', name: 'Teatro', icon: Theater, color: 'bg-red-500/20 text-red-400 border-red-400/30' },
  { id: 'educacion', name: 'Educación', icon: Camera, color: 'bg-green-500/20 text-green-400 border-green-400/30' },
  { id: 'danza', name: 'Danza', icon: Users, color: 'bg-pink-500/20 text-pink-400 border-pink-400/30' },
  { id: 'literatura', name: 'Literatura', icon: CalendarDays, color: 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30' }
];

export function CreateEventDialog({ isOpen, onClose, onEventCreated }: CreateEventDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    endTime: '',
    location: '',
    address: '',
    category: '',
    price: '',
    capacity: '',
    video: '',
    tags: [] as string[],
    socialLinks: {
      instagram: '',
      facebook: '',
      twitter: '',
      website: ''
    }
  });
  const [currentTag, setCurrentTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim().toLowerCase())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim().toLowerCase()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const validateForm = () => {
    const required = ['title', 'description', 'date', 'time', 'location', 'category'];
    const missing = required.filter(field => !formData[field as keyof typeof formData]);
    
    if (missing.length > 0) {
      toast.error(`Por favor completa los campos requeridos: ${missing.join(', ')}`);
      return false;
    }

    if (formData.endTime && formData.endTime <= formData.time) {
      toast.error('La hora de finalización debe ser posterior a la hora de inicio');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simular creación del evento
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newEvent = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        endTime: formData.endTime || formData.time,
        location: formData.location,
        address: formData.address,
        category: eventCategories.find(cat => cat.id === formData.category)?.name || 'Otro',
        tags: formData.tags,
        price: formData.price || 'Gratis',
        capacity: parseInt(formData.capacity) || 100,
        attendees: 0,
        image: '/api/placeholder/400/250',
        video: formData.video || null,
        organizer: {
          id: '1',
          name: 'Usuario Actual',
          avatar: '/logo.png',
          verified: true,
          rating: 4.8
        },
        socialLinks: formData.socialLinks,
        featured: false,
        likes: 0,
        isLiked: false,
        views: 0,
        createdAt: new Date().toISOString()
      };

      onEventCreated(newEvent);
      toast.success('¡Evento creado exitosamente!');
      handleClose();
    } catch (error) {
      toast.error('Error al crear el evento');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      endTime: '',
      location: '',
      address: '',
      category: '',
      price: '',
      capacity: '',
      video: '',
      tags: [],
      socialLinks: {
        instagram: '',
        facebook: '',
        twitter: '',
        website: ''
      }
    });
    setCurrentTag('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900/95 border-purple-400/30">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center space-x-2">
            <CalendarDays className="w-6 h-6 text-purple-400" />
            <span>Crear Evento Cultural</span>
          </DialogTitle>
          <p className="text-gray-400 text-sm">
            Comparte tu evento con la comunidad SOS-HABILIDOSO
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Información Básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <Info className="w-5 h-5 text-purple-400" />
              <span>Información Básica</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="title" className="text-white">Título del Evento *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Ej: Festival de Jazz en el Parque"
                  className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="description" className="text-white">Descripción *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe tu evento, qué pueden esperar los asistentes..."
                  className="bg-white/5 border-white/10 text-white placeholder-gray-400 min-h-[100px]"
                  required
                />
              </div>

              <div>
                <Label htmlFor="category" className="text-white">Categoría *</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {eventCategories.map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => handleInputChange('category', category.id)}
                        className={`p-3 rounded-lg border transition-all flex items-center space-x-2 text-sm ${
                          formData.category === category.id
                            ? category.color
                            : 'border-white/10 text-gray-400 hover:border-purple-400/50'
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                        <span>{category.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <Label htmlFor="price" className="text-white">Precio</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="price"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="Gratis, $15.000, $20.000 - $50.000"
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Fecha y Hora */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <Clock className="w-5 h-5 text-purple-400" />
              <span>Fecha y Hora</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="date" className="text-white">Fecha *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                  required
                />
              </div>

              <div>
                <Label htmlFor="time" className="text-white">Hora de Inicio *</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                  required
                />
              </div>

              <div>
                <Label htmlFor="endTime" className="text-white">Hora de Finalización</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>
          </div>

          {/* Ubicación */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-purple-400" />
              <span>Ubicación</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location" className="text-white">Lugar *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Ej: Parque Simón Bolívar, Bogotá"
                  className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                  required
                />
              </div>

              <div>
                <Label htmlFor="address" className="text-white">Dirección Completa</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Ej: Calle 63 # 68-95, Bogotá"
                  className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                />
              </div>

              <div>
                <Label htmlFor="capacity" className="text-white">Capacidad de Asistentes</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => handleInputChange('capacity', e.target.value)}
                    placeholder="100"
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Multimedia */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <Upload className="w-5 h-5 text-purple-400" />
              <span>Multimedia</span>
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="video" className="text-white">Video Promocional (URL)</Label>
                <div className="relative">
                  <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="video"
                    value={formData.video}
                    onChange={(e) => handleInputChange('video', e.target.value)}
                    placeholder="https://youtube.com/watch?v=... o https://vimeo.com/..."
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-400"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Agrega un video de YouTube, Vimeo o cualquier plataforma para promocionar tu evento
                </p>
              </div>
            </div>
          </div>

          {/* Etiquetas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <Tag className="w-5 h-5 text-purple-400" />
              <span>Etiquetas</span>
            </h3>
            
            <div className="space-y-3">
              <div className="flex space-x-2">
                <Input
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Agregar etiqueta (ej: jazz, música en vivo)"
                  className="flex-1 bg-white/5 border-white/10 text-white placeholder-gray-400"
                />
                <CyberButton
                  type="button"
                  onClick={addTag}
                  variant="outline"
                  size="sm"
                  className="border-purple-400/50 hover:bg-purple-500/20"
                >
                  <Plus className="w-4 h-4" />
                </CyberButton>
              </div>

              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      className="bg-purple-500/20 text-purple-300 border-purple-400/30 flex items-center space-x-1"
                    >
                      <span>#{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-red-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Redes Sociales */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <Globe className="w-5 h-5 text-purple-400" />
              <span>Enlaces de Redes Sociales</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="instagram" className="text-white flex items-center space-x-2">
                  <Instagram className="w-4 h-4 text-pink-400" />
                  <span>Instagram</span>
                </Label>
                <Input
                  id="instagram"
                  value={formData.socialLinks.instagram}
                  onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                  placeholder="https://instagram.com/tu_evento"
                  className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                />
              </div>

              <div>
                <Label htmlFor="facebook" className="text-white flex items-center space-x-2">
                  <Facebook className="w-4 h-4 text-blue-400" />
                  <span>Facebook</span>
                </Label>
                <Input
                  id="facebook"
                  value={formData.socialLinks.facebook}
                  onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
                  placeholder="https://facebook.com/tu_evento"
                  className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                />
              </div>

              <div>
                <Label htmlFor="twitter" className="text-white flex items-center space-x-2">
                  <Twitter className="w-4 h-4 text-blue-300" />
                  <span>Twitter</span>
                </Label>
                <Input
                  id="twitter"
                  value={formData.socialLinks.twitter}
                  onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                  placeholder="https://twitter.com/tu_evento"
                  className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                />
              </div>

              <div>
                <Label htmlFor="website" className="text-white flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-green-400" />
                  <span>Sitio Web</span>
                </Label>
                <Input
                  id="website"
                  value={formData.socialLinks.website}
                  onChange={(e) => handleSocialLinkChange('website', e.target.value)}
                  placeholder="https://tu-evento.com"
                  className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-white/10">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancelar
            </Button>
            <CyberButton
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Creando...
                </>
              ) : (
                <>
                  <CalendarDays className="w-4 h-4 mr-2" />
                  Crear Evento
                </>
              )}
            </CyberButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}