'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

import { CyberButton } from '@/components/ui/cyber-button';
import { 
  Upload, 
  Users, 
  Globe,
  Crown,
  Lock,
  Camera,
  X,
  CheckCircle,
  Shield
} from 'lucide-react';
import { communitiesService, CommunityCategory } from '@/lib/services/communities.service';

interface FormData {
  name: string;
  description: string;
  category: string;
  rules: string;
  profileImage: File | null;
  coverImage: File | null;
  // Campos específicos para premium
  subscriptionPrice?: string;
  currency: 'COP' | 'USD';
  // Campos específicos para privada
  inviteOnly?: boolean;
  maxMembers?: string;
  // Campos específicos para página
  website?: string;
  contactEmail?: string;
  businessType?: string;
  // Campo para subcomunidad
  parentCommunityId?: string;
}

interface ParentCommunity {
  id: string;
  name: string;
}

interface DynamicCommunityFormProps {
  communityType: 'public' | 'private' | 'premium' | 'page';
  onSubmit: (data: FormData) => void;
  onBack: () => void;
  isLoading?: boolean;
  parentCommunities?: ParentCommunity[];
  isSubcommunity?: boolean;
  categories?: CommunityCategory[];
}

const businessTypes = [
  'Empresa', 'Marca Personal', 'Organización', 'Institución Educativa',
  'ONG', 'Gobierno', 'Medio de Comunicación', 'Entretenimiento'
];

const typeConfig = {
  public: {
    title: 'Comunidad Abierta',
    icon: Users,
    color: 'text-green-400',
    bgGradient: 'from-green-500/20 to-emerald-500/20'
  },
  private: {
    title: 'Comunidad Privada',
    icon: Lock,
    color: 'text-blue-400',
    bgGradient: 'from-blue-500/20 to-cyan-500/20'
  },
  premium: {
    title: 'Comunidad Premium',
    icon: Crown,
    color: 'text-yellow-400',
    bgGradient: 'from-yellow-500/20 to-orange-500/20'
  },
  page: {
    title: 'Página Pública',
    icon: Globe,
    color: 'text-purple-400',
    bgGradient: 'from-purple-500/20 to-pink-500/20'
  }
};

export function DynamicCommunityForm({ 
  communityType, 
  onSubmit, 
  onBack, 
  isLoading = false,
  parentCommunities = [],
  isSubcommunity = false,
  categories: propCategories = []
}: DynamicCommunityFormProps) {
  const [categories, setCategories] = useState<CommunityCategory[]>(propCategories);
  const [loadingCategories, setLoadingCategories] = useState(propCategories.length === 0);
  
  // Cargar categorías del backend si no se proporcionan
  useEffect(() => {
    if (propCategories.length === 0) {
      loadCategories();
    }
  }, [propCategories]);
  
  const loadCategories = async () => {
    try {
      const cats = await communitiesService.getCategories();
      setCategories(cats);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoadingCategories(false);
    }
  };
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    category: '',
    rules: '',
    profileImage: null,
    coverImage: null,
    currency: 'COP',
    inviteOnly: true,
    subscriptionPrice: '',
    maxMembers: '',
    website: '',
    contactEmail: '',
    businessType: '',
    parentCommunityId: ''
  });

  const [dragActive, setDragActive] = useState({ profile: false, cover: false });

  const config = typeConfig[communityType];
  const Icon = config.icon;

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (type: 'profile' | 'cover', files: FileList | null) => {
    if (files && files[0]) {
      const field = type === 'profile' ? 'profileImage' : 'coverImage';
      setFormData(prev => ({ ...prev, [field]: files[0] }));
    }
  };

  const removeImage = (type: 'profile' | 'cover') => {
    const field = type === 'profile' ? 'profileImage' : 'coverImage';
    setFormData(prev => ({ ...prev, [field]: null }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${config.bgGradient} flex items-center justify-center`}>
            <Icon className={`w-3.5 h-3.5 ${config.color}`} />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">{config.title}</h2>
            <p className="text-gray-400 text-xs">Completa la información de tu {communityType === 'page' ? 'página' : 'comunidad'}</p>
          </div>
        </div>
        <Button variant="outline" onClick={onBack} size="sm" className="text-xs h-7 px-2">
          Cambiar Tipo
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Información Básica */}
        <Card className="glass-card">
          <CardHeader className="pb-2 pt-3">
            <CardTitle className="text-white flex items-center space-x-2 text-xs">
              <CheckCircle className="w-3.5 h-3.5 text-neon-green" />
              <span>Información Básica</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 pt-0 pb-3">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Nombre {communityType === 'page' ? 'de la página' : 'de la comunidad'} *
              </label>
              <Input
                placeholder={
                  communityType === 'page' ? 'Ej: Mi Empresa S.A.S' :
                  communityType === 'premium' ? 'Ej: Curso Premium de Marketing' :
                  'Ej: Amantes del Fútbol Bogotá'
                }
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="bg-white/5 border-white/10 text-white text-sm h-9"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Descripción *
              </label>
              <Textarea
                placeholder={
                  communityType === 'page' ? 'Describe tu empresa, marca o proyecto...' :
                  communityType === 'premium' ? 'Explica qué contenido exclusivo ofrecerás a tus suscriptores...' :
                  communityType === 'private' ? 'Describe el propósito exclusivo de esta comunidad...' :
                  'Describe de qué trata tu comunidad, qué temas se discuten...'
                }
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="bg-white/5 border-white/10 text-white text-sm min-h-[70px] resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Categoría *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-2 py-2 bg-white/5 border border-white/10 rounded-md text-white text-sm h-9"
                  required
                  disabled={loadingCategories}
                >
                  <option value="">{loadingCategories ? 'Cargando...' : 'Seleccionar categoría'}</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.slug} className="bg-gray-800">
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {communityType === 'page' && (
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Tipo de negocio
                  </label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => handleInputChange('businessType', e.target.value)}
                    className="w-full px-2 py-2 bg-white/5 border border-white/10 rounded-md text-white text-sm h-9"
                  >
                    <option value="">Seleccionar tipo</option>
                    {businessTypes.map(type => (
                      <option key={type} value={type} className="bg-gray-800">{type}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Opción de Subcomunidad */}
            {isSubcommunity && parentCommunities.length > 0 && (
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Comunidad padre *
                </label>
                <select
                  value={formData.parentCommunityId}
                  onChange={(e) => handleInputChange('parentCommunityId', e.target.value)}
                  className="w-full px-2 py-2 bg-white/5 border border-white/10 rounded-md text-white text-sm h-9"
                  required={isSubcommunity}
                >
                  <option value="">Seleccionar comunidad padre</option>
                  {parentCommunities.map(comm => (
                    <option key={comm.id} value={comm.id} className="bg-gray-800">{comm.name}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-400 mt-1">
                  Esta subcomunidad pertenecerá a la comunidad seleccionada
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Configuración Específica */}
        {(communityType === 'premium' || communityType === 'private' || communityType === 'page') && (
          <Card className="glass-card">
            <CardHeader className="pb-2 pt-3">
              <CardTitle className="text-white flex items-center space-x-2 text-xs">
                <Shield className="w-3.5 h-3.5 text-neon-green" />
                <span>
                  {communityType === 'premium' && 'Configuración de Suscripción'}
                  {communityType === 'private' && 'Configuración de Privacidad'}
                  {communityType === 'page' && 'Información de Contacto'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 pt-0 pb-3">
              {communityType === 'premium' && (
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Precio de suscripción mensual *
                  </label>
                  <div className="flex max-w-xs">
                    <select
                      value={formData.currency}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                      className="px-2 py-2 bg-white/5 border border-white/10 rounded-l-md text-white border-r-0 text-sm h-9"
                    >
                      <option value="COP" className="bg-gray-800">COP</option>
                      <option value="USD" className="bg-gray-800">USD</option>
                    </select>
                    <Input
                      type="number"
                      placeholder="15000"
                      value={formData.subscriptionPrice}
                      onChange={(e) => handleInputChange('subscriptionPrice', e.target.value)}
                      className="bg-white/5 border-white/10 text-white rounded-l-none text-sm h-9"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Los miembros pagarán esta cantidad mensualmente
                  </p>
                </div>
              )}

              {communityType === 'private' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Límite de miembros (opcional)
                    </label>
                    <Input
                      type="number"
                      placeholder="100"
                      value={formData.maxMembers}
                      onChange={(e) => handleInputChange('maxMembers', e.target.value)}
                      className="bg-white/5 border-white/10 text-white text-sm h-9 max-w-xs"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Deja vacío para sin límite
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="inviteOnly"
                      checked={formData.inviteOnly}
                      onChange={(e) => handleInputChange('inviteOnly', e.target.checked)}
                      className="rounded border-white/20 bg-white/5 text-neon-green focus:ring-neon-green"
                    />
                    <label htmlFor="inviteOnly" className="text-xs text-gray-300">
                      Solo por invitación
                    </label>
                  </div>
                </div>
              )}

              {communityType === 'page' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Sitio web
                    </label>
                    <Input
                      type="url"
                      placeholder="https://mi-empresa.com"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="bg-white/5 border-white/10 text-white text-sm h-9"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Email de contacto
                    </label>
                    <Input
                      type="email"
                      placeholder="contacto@mi-empresa.com"
                      value={formData.contactEmail}
                      onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                      className="bg-white/5 border-white/10 text-white text-sm h-9"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Reglas y Normas */}
        <Card className="glass-card">
          <CardHeader className="pb-2 pt-3">
            <CardTitle className="text-white flex items-center space-x-2 text-xs">
              <Shield className="w-3.5 h-3.5 text-neon-green" />
              <span>Reglas y Normas</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 pb-3">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Reglas de la {communityType === 'page' ? 'página' : 'comunidad'}
              </label>
              <Textarea
                placeholder={
                  communityType === 'page' ? 
                  'Ej: 1. Contenido profesional únicamente\n2. No spam o autopromoción\n3. Respeto hacia todos los seguidores' :
                  'Ej: 1. Mantén el respeto hacia todos los miembros\n2. No spam o contenido irrelevante\n3. Usa los canales apropiados para cada tema'
                }
                value={formData.rules}
                onChange={(e) => handleInputChange('rules', e.target.value)}
                className="bg-white/5 border-white/10 text-white text-sm min-h-[70px] resize-none"
              />
              <p className="text-xs text-gray-400 mt-1">
                Estas reglas serán visibles para todos los {communityType === 'page' ? 'seguidores' : 'miembros'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Imágenes */}
        <Card className="glass-card">
          <CardHeader className="pb-2 pt-3">
            <CardTitle className="text-white flex items-center space-x-2 text-xs">
              <Camera className="w-3.5 h-3.5 text-neon-green" />
              <span>Imágenes</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-0 pb-3">
            {/* Imagen de Perfil */}
            <div>
              <h4 className="text-white font-medium mb-1.5 text-xs">Imagen de perfil</h4>
              <div
                className={`
                  border-2 border-dashed rounded-lg p-4 text-center transition-colors
                  ${dragActive.profile ? 'border-neon-green bg-neon-green/5' : 'border-white/20'}
                `}
                onDragOver={(e) => { e.preventDefault(); setDragActive(prev => ({ ...prev, profile: true })); }}
                onDragLeave={() => setDragActive(prev => ({ ...prev, profile: false }))}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragActive(prev => ({ ...prev, profile: false }));
                  handleImageUpload('profile', e.dataTransfer.files);
                }}
              >
                {formData.profileImage ? (
                  <div className="relative inline-block">
                    <img
                      src={URL.createObjectURL(formData.profileImage)}
                      alt="Profile preview"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage('profile')}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                    <p className="text-white mb-1 text-sm">Imagen de perfil (recomendado)</p>
                    <p className="text-gray-400 text-xs mb-2">JPG o PNG, máximo 5MB</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload('profile', e.target.files)}
                      className="hidden"
                      id="profile-upload"
                    />
                    <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById('profile-upload')?.click()}>
                      Seleccionar Imagen
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Imagen de Portada */}
            <div>
              <h4 className="text-white font-medium mb-1.5 text-xs">Imagen de portada</h4>
              <div
                className={`
                  border-2 border-dashed rounded-lg p-4 text-center transition-colors
                  ${dragActive.cover ? 'border-neon-green bg-neon-green/5' : 'border-white/20'}
                `}
                onDragOver={(e) => { e.preventDefault(); setDragActive(prev => ({ ...prev, cover: true })); }}
                onDragLeave={() => setDragActive(prev => ({ ...prev, cover: false }))}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragActive(prev => ({ ...prev, cover: false }));
                  handleImageUpload('cover', e.dataTransfer.files);
                }}
              >
                {formData.coverImage ? (
                  <div className="relative">
                    <img
                      src={URL.createObjectURL(formData.coverImage)}
                      alt="Cover preview"
                      className="w-full h-24 rounded-lg mx-auto object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage('cover')}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                    <p className="text-white mb-1 text-sm">Imagen de portada (opcional)</p>
                    <p className="text-gray-400 text-xs mb-2">JPG o PNG, máximo 10MB, 1200x400px recomendado</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload('cover', e.target.files)}
                      className="hidden"
                      id="cover-upload"
                    />
                    <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById('cover-upload')?.click()}>
                      Seleccionar Imagen
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Espaciador para el footer fijo */}
        <div className="h-16"></div>
      </form>
      
      {/* Botones de acción - Footer fijo */}
      <div className="sticky bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-white/10 p-3 -mx-4 mt-3">
        <div className="flex justify-between max-w-3xl mx-auto">
          <Button variant="outline" onClick={onBack} type="button" size="sm" className="h-9 text-sm">
            Volver
          </Button>
          <CyberButton 
            type="submit" 
            disabled={isLoading} 
            size="sm" 
            className="min-w-[120px] h-9 text-sm"
            onClick={handleSubmit}
          >
            {isLoading ? 'Creando...' : `Crear ${communityType === 'page' ? 'Página' : 'Comunidad'}`}
          </CyberButton>
        </div>
      </div>
    </div>
  );
}