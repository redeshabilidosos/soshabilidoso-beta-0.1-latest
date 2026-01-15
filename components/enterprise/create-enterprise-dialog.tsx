'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { CyberButton } from '@/components/ui/cyber-button';
import { Badge } from '@/components/ui/badge';
import { enterprisesService, CreateEnterpriseData } from '@/lib/services/enterprises.service';
import { toast } from 'sonner';
import {
  Building2,
  Globe,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Users,
  Calendar,
  Loader2,
} from 'lucide-react';

interface CreateEnterpriseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (enterprise: any) => void;
}

const CATEGORIES = [
  { value: 'deportes', label: 'Deportes', emoji: '⚽' },
  { value: 'fitness', label: 'Fitness', emoji: '💪' },
  { value: 'nutricion', label: 'Nutrición', emoji: '🥗' },
  { value: 'tecnologia', label: 'Tecnología', emoji: '💻' },
  { value: 'salud', label: 'Salud', emoji: '🏥' },
  { value: 'educacion', label: 'Educación', emoji: '📚' },
  { value: 'entretenimiento', label: 'Entretenimiento', emoji: '🎬' },
  { value: 'moda', label: 'Moda', emoji: '👗' },
  { value: 'alimentos', label: 'Alimentos', emoji: '🍔' },
  { value: 'servicios', label: 'Servicios', emoji: '🛠️' },
  { value: 'otro', label: 'Otro', emoji: '📦' },
];

export function CreateEnterpriseDialog({ isOpen, onClose, onSuccess }: CreateEnterpriseDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<CreateEnterpriseData>({
    name: '',
    username: '',
    tagline: '',
    description: '',
    category: '',
    industry: '',
    location: '',
    website: '',
    email: '',
    phone: '',
    employees_count: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    
    if (!formData.username.trim()) {
      newErrors.username = 'El usuario es requerido';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Solo letras, números y guiones bajos';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Mínimo 3 caracteres';
    }
    
    if (!formData.category) {
      newErrors.category = 'Selecciona una categoría';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const enterprise = await enterprisesService.createEnterprise(formData);
      toast.success('¡Empresa creada exitosamente!');
      onSuccess?.(enterprise);
      onClose();
      router.push(`/enterprise/${enterprise.id}`);
    } catch (error: any) {
      console.error('Error creating enterprise:', error);
      if (error.response?.data?.username) {
        setErrors({ username: 'Este nombre de usuario ya está en uso' });
        setStep(1);
      } else {
        toast.error(error.response?.data?.error || 'Error al crear la empresa');
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      username: '',
      tagline: '',
      description: '',
      category: '',
      industry: '',
      location: '',
      website: '',
      email: '',
      phone: '',
      employees_count: '',
    });
    setStep(1);
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg bg-gray-900 border-purple-500/30 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Building2 className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <span>Crear Mi Empresa</span>
              <p className="text-sm font-normal text-gray-400 mt-1">
                Paso {step} de 2
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        {step === 1 ? (
          <div className="space-y-5 mt-4">
            {/* Nombre de la empresa */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nombre de la empresa *
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ej: Mi Empresa Deportiva"
                className={`bg-white/5 border-white/10 text-white ${errors.name ? 'border-red-500' : ''}`}
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Usuario de empresa *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">@</span>
                <Input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="miempresa"
                  className={`pl-8 bg-white/5 border-white/10 text-white ${errors.username ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username}</p>}
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Categoría *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, category: cat.value }))}
                    className={`p-2 rounded-lg border text-sm transition-all ${
                      formData.category === cat.value
                        ? 'border-purple-500 bg-purple-500/20 text-white'
                        : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/30'
                    }`}
                  >
                    <span className="mr-1">{cat.emoji}</span>
                    {cat.label}
                  </button>
                ))}
              </div>
              {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category}</p>}
            </div>

            {/* Eslogan */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Eslogan (opcional)
              </label>
              <Input
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                placeholder="Ej: Innovación en cada paso"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            <CyberButton onClick={handleNext} className="w-full bg-purple-600 hover:bg-purple-700">
              Continuar
            </CyberButton>
          </div>
        ) : (
          <div className="space-y-4 mt-4">
            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descripción
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe tu empresa..."
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 resize-none focus:border-purple-500/50 focus:outline-none"
              />
            </div>

            {/* Industria y Ubicación */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Briefcase className="w-4 h-4 inline mr-1" />
                  Industria
                </label>
                <Input
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  placeholder="Ej: Equipamiento"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Ubicación
                </label>
                <Input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Ej: Bogotá, Colombia"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>

            {/* Contacto */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email
                </label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contacto@empresa.com"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Teléfono
                </label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+57 300 123 4567"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>

            {/* Website y Empleados */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Globe className="w-4 h-4 inline mr-1" />
                  Sitio web
                </label>
                <Input
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://miempresa.com"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Users className="w-4 h-4 inline mr-1" />
                  Empleados
                </label>
                <select
                  name="employees_count"
                  value={formData.employees_count}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-purple-500/50 focus:outline-none"
                >
                  <option value="" className="bg-gray-900">Seleccionar</option>
                  <option value="1-10" className="bg-gray-900">1-10</option>
                  <option value="11-50" className="bg-gray-900">11-50</option>
                  <option value="51-200" className="bg-gray-900">51-200</option>
                  <option value="201-500" className="bg-gray-900">201-500</option>
                  <option value="500+" className="bg-gray-900">500+</option>
                </select>
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-2">
              <CyberButton
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1"
              >
                Atrás
              </CyberButton>
              <CyberButton
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creando...
                  </>
                ) : (
                  'Crear Empresa'
                )}
              </CyberButton>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
