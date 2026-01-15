'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CyberButton } from '@/components/ui/cyber-button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Group, Globe, Lock, Users, Camera, Link, Instagram, Twitter, Facebook, Youtube } from 'lucide-react';
import { toast } from 'sonner';

interface SimpleCreateFormProps {
  onCommunityCreated: (community: any) => void;
  onCancel: () => void;
}

const categories = [
  'Deportes', 'Música', 'Arte', 'Gaming', 'Tecnología', 'Lifestyle'
];

const communityTypes = [
  { value: 'public', label: 'Comunidad Pública', icon: Globe, description: 'Cualquiera puede unirse' },
  { value: 'private', label: 'Comunidad Privada', icon: Lock, description: 'Solo por invitación' },
  { value: 'page', label: 'Página Abierta', icon: Users, description: 'Para obtener seguidores' }
];

const socialNetworks = [
  { name: 'instagram', label: 'Instagram', icon: Instagram, placeholder: '@usuario' },
  { name: 'twitter', label: 'Twitter/X', icon: Twitter, placeholder: '@usuario' },
  { name: 'facebook', label: 'Facebook', icon: Facebook, placeholder: 'facebook.com/pagina' },
  { name: 'youtube', label: 'YouTube', icon: Youtube, placeholder: 'youtube.com/c/canal' },
  { name: 'website', label: 'Sitio Web', icon: Link, placeholder: 'https://sitio.com' }
];

export function SimpleCreateForm({ onCommunityCreated, onCancel }: SimpleCreateFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    type: 'public',
    profileImage: null as File | null,
    coverImage: null as File | null,
    socialLinks: {
      instagram: '',
      twitter: '',
      facebook: '',
      youtube: '',
      website: ''
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = (type: 'profile' | 'cover', file: File | null) => {
    setFormData(prev => ({
      ...prev,
      [type === 'profile' ? 'profileImage' : 'coverImage']: file
    }));
  };

  const handleSocialLinkChange = (network: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [network]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.description.trim() || !formData.category) {
      toast.error('Por favor, completa todos los campos obligatorios');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simular creación
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Crear URLs temporales para las imágenes
      const profileImageUrl = formData.profileImage ? URL.createObjectURL(formData.profileImage) : null;
      const coverImageUrl = formData.coverImage ? URL.createObjectURL(formData.coverImage) : null;
      
      const newCommunity = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        category: formData.category,
        type: formData.type,
        members: formData.type === 'page' ? 0 : 1,
        posts: 0,
        isJoined: formData.type !== 'page',
        profileImage: profileImageUrl,
        coverImage: coverImageUrl,
        socialLinks: formData.socialLinks
      };
      
      onCommunityCreated(newCommunity);
      toast.success(`¡${formData.type === 'page' ? 'Página' : 'Comunidad'} creada exitosamente!`);
      
    } catch (error) {
      toast.error('Error al crear la comunidad');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Información Básica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Nombre *
            </label>
            <Input
              placeholder="Ej: Fútbol Profesional Colombia"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="bg-white/10 border-white/20 text-white placeholder-gray-400 h-9"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Categoría *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white h-9 text-sm"
              required
            >
              <option value="">Seleccionar categoría</option>
              {categories.map(category => (
                <option key={category} value={category} className="bg-gray-800">
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Descripción *
          </label>
          <Textarea
            placeholder="Describe de qué trata tu comunidad o página..."
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="bg-white/10 border-white/20 text-white placeholder-gray-400 min-h-[60px] text-sm"
            required
          />
        </div>

        {/* Tipo de Comunidad */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tipo *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {communityTypes.map((type) => (
              <Card 
                key={type.value}
                className={`cursor-pointer transition-all duration-300 ${
                  formData.type === type.value 
                    ? 'glass-card border-neon-green/50 bg-neon-green/10' 
                    : 'glass-card border-white/10 hover:border-white/20'
                }`}
                onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
              >
                <CardContent className="p-2">
                  <div className="flex flex-col items-center text-center space-y-1">
                    <div className={`p-1.5 rounded-lg ${
                      formData.type === type.value 
                        ? 'bg-neon-green/20 text-neon-green' 
                        : 'bg-white/10 text-gray-400'
                    }`}>
                      <type.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-white text-xs">{type.label}</h5>
                      <p className="text-xs text-gray-400">{type.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Imágenes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Foto de Perfil
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload('profile', e.target.files?.[0] || null)}
                className="hidden"
                id="profile-image"
              />
              <label
                htmlFor="profile-image"
                className="flex items-center justify-center w-full h-20 bg-white/10 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-neon-green/50 transition-colors"
              >
                <div className="text-center">
                  <Camera className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                  <span className="text-xs text-gray-400">
                    {formData.profileImage ? formData.profileImage.name : 'Subir imagen'}
                  </span>
                </div>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Foto de Portada
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload('cover', e.target.files?.[0] || null)}
                className="hidden"
                id="cover-image"
              />
              <label
                htmlFor="cover-image"
                className="flex items-center justify-center w-full h-20 bg-white/10 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-neon-green/50 transition-colors"
              >
                <div className="text-center">
                  <Camera className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                  <span className="text-xs text-gray-400">
                    {formData.coverImage ? formData.coverImage.name : 'Subir portada'}
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Redes Sociales */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Enlaces de Redes Sociales (Opcional)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {socialNetworks.map((network) => (
              <div key={network.name} className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-8 h-8 bg-white/10 rounded-lg">
                  <network.icon className="w-4 h-4 text-gray-400" />
                </div>
                <Input
                  placeholder={network.placeholder}
                  value={formData.socialLinks[network.name as keyof typeof formData.socialLinks]}
                  onChange={(e) => handleSocialLinkChange(network.name, e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400 h-8 text-sm flex-1"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-center space-x-3 pt-4">
          <CyberButton
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            size="sm"
          >
            Cancelar
          </CyberButton>
          <CyberButton
            type="submit"
            disabled={isLoading}
            className="min-w-[120px]"
            size="sm"
          >
            {isLoading ? 'Creando...' : `Crear ${formData.type === 'page' ? 'Página' : 'Comunidad'}`}
          </CyberButton>
        </div>
      </form>
    </div>
  );
}