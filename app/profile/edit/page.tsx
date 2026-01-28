'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/providers';
import { Sidebar } from '@/components/navigation/sidebar';
import { MobileNav } from '@/components/navigation/mobile-nav';
import { CyberButton } from '@/components/ui/cyber-button';
import { ImageUpload } from '@/components/ui/image-upload';
import { ArrowLeft, Save, User, Mail, MapPin, Users, FileText, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function EditProfilePage() {
  const { user, updateProfile, uploadAvatar, uploadCoverPhoto, isLoading } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    display_name: '',
    bio: '',
    position: '',
    team: '',
    contact_number: '',
    interests: [] as string[],
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/auth');
      return;
    }

    // Inicializar formulario con datos del usuario
    setFormData({
      display_name: user.displayName || '',
      bio: user.bio || '',
      position: user.position || '',
      team: user.team || '',
      contact_number: user.contactNumber || '',
      interests: user.interests || [],
    });
  }, [user, router]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleInterestsChange = (value: string) => {
    const interests = value.split(',').map(interest => interest.trim()).filter(Boolean);
    setFormData(prev => ({
      ...prev,
      interests
    }));
  };

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const success = await updateProfile({
        displayName: formData.display_name,
        bio: formData.bio,
        position: formData.position,
        team: formData.team,
        contactNumber: formData.contact_number,
        interests: formData.interests,
      });

      if (success) {
        // Mostrar modal de éxito
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error al actualizar el perfil');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    try {
      await uploadAvatar(file);
      // El toast de éxito ya se muestra en el ImageUpload component
    } catch (error) {
      // El error ya se maneja en el ImageUpload component
    }
  };

  const handleCoverUpload = async (file: File) => {
    try {
      await uploadCoverPhoto(file);
      // El toast de éxito ya se muestra en el ImageUpload component
    } catch (error) {
      // El error ya se maneja en el ImageUpload component
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    router.push('/profile');
  };

  // Auto-redirigir después de 3 segundos cuando se muestra el modal de éxito
  useEffect(() => {
    if (showSuccessModal) {
      // Bloquear scroll del body
      document.body.style.overflow = 'hidden';
      
      const timer = setTimeout(() => {
        handleModalClose();
      }, 3000);
      
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = 'unset';
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [showSuccessModal]);

  if (!user) return null;

  return (
    <div className="min-h-screen">
      <Sidebar />
      
      <main className="pb-24 xl:ml-64 xl:pb-0">
        <div className="max-w-4xl mx-auto p-4 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <CyberButton
                variant="outline"
                onClick={() => router.back()}
              >
                <ArrowLeft size={16} className="mr-2" />
                Volver
              </CyberButton>
              <h1 className="text-2xl font-bold text-white">Editar Perfil</h1>
            </div>
            
            <CyberButton
              onClick={handleSave}
              disabled={isSaving || isLoading}
            >
              <Save size={16} className="mr-2" />
              {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </CyberButton>
          </div>

          {/* Cover Photo */}
          <div className="glass-card overflow-hidden">
            <ImageUpload
              currentImage={user.coverPhoto}
              onImageUpload={handleCoverUpload}
              type="cover"
            />
          </div>

          {/* Avatar and Basic Info */}
          <div className="glass-card p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8">
              {/* Avatar */}
              <div className="flex justify-center lg:justify-start mb-6 lg:mb-0">
                <ImageUpload
                  currentImage={user.avatar}
                  onImageUpload={handleAvatarUpload}
                  type="avatar"
                />
              </div>

              {/* Basic Info Form */}
              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <User size={16} className="inline mr-2" />
                    Nombre para mostrar
                  </label>
                  <input
                    type="text"
                    value={formData.display_name}
                    onChange={(e) => handleInputChange('display_name', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-neon-green focus:outline-none"
                    placeholder="Tu nombre para mostrar"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Mail size={16} className="inline mr-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">El email no se puede cambiar</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <FileText size={16} className="inline mr-2" />
                    Biografía
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-neon-green focus:outline-none resize-none"
                    placeholder="Cuéntanos sobre ti..."
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.bio.length}/500 caracteres
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sports Info */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-white mb-4">Información Deportiva</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <MapPin size={16} className="inline mr-2" />
                  Posición/Rol
                </label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-neon-green focus:outline-none"
                  placeholder="Ej: Mediocampista, Portero, Delantero"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Users size={16} className="inline mr-2" />
                  Equipo/Grupo
                </label>
                <input
                  type="text"
                  value={formData.team}
                  onChange={(e) => handleInputChange('team', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-neon-green focus:outline-none"
                  placeholder="Ej: Los Tigres FC, Independiente"
                />
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-white mb-4">Información de Contacto</h2>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Número de contacto
              </label>
              <input
                type="tel"
                value={formData.contact_number}
                onChange={(e) => handleInputChange('contact_number', e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-neon-green focus:outline-none"
                placeholder="Ej: +57 300 123 4567"
              />
            </div>
          </div>

          {/* Interests */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-white mb-4">Intereses</h2>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Intereses (separados por comas)
              </label>
              <input
                type="text"
                value={formData.interests.join(', ')}
                onChange={(e) => handleInterestsChange(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-neon-green focus:outline-none"
                placeholder="Ej: fútbol, estrategia, entrenamiento, táctica"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separa tus intereses con comas
              </p>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <CyberButton
              onClick={handleSave}
              disabled={isSaving || isLoading}
              size="lg"
            >
              <Save size={16} className="mr-2" />
              {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </CyberButton>
          </div>
        </div>
      </main>

      <MobileNav />

      {/* Modal de Éxito */}
      {showSuccessModal && (
        <div 
          className="fixed top-0 left-0 right-0 bottom-0 z-[9999] flex items-start justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200 pt-20"
          style={{ margin: 0, padding: '5rem 1rem 1rem 1rem' }}
        >
          <div className="glass-card p-6 max-w-md w-full space-y-4 animate-in fade-in zoom-in slide-in-from-top-4 duration-500 border-2 border-neon-green/50">
            <div className="flex flex-col items-center text-center space-y-3">
              {/* Icono animado */}
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-neon-green/20 flex items-center justify-center animate-in zoom-in duration-700">
                  <CheckCircle className="w-10 h-10 text-neon-green animate-in zoom-in duration-1000" />
                </div>
                {/* Anillo de pulso */}
                <div className="absolute inset-0 rounded-full bg-neon-green/30 animate-ping"></div>
              </div>
              
              <h2 className="text-xl font-bold text-white animate-in slide-in-from-top-2 duration-700">
                ¡Cambios Guardados!
              </h2>
              
              <p className="text-sm text-gray-300 animate-in slide-in-from-top-3 duration-800">
                Tu perfil se ha actualizado exitosamente
              </p>

              {/* Barra de progreso para auto-redirect */}
              <div className="w-full bg-gray-700 rounded-full h-1 overflow-hidden">
                <div 
                  className="h-full bg-neon-green rounded-full transition-all duration-[3000ms] ease-linear"
                  style={{ width: '100%', animation: 'shrink 3s linear forwards' }}
                />
              </div>
              <p className="text-xs text-gray-400">Redirigiendo a tu perfil...</p>
            </div>

            <div className="flex flex-col gap-2 animate-in slide-in-from-top-4 duration-900">
              <CyberButton
                onClick={handleModalClose}
                className="w-full bg-neon-green text-black hover:bg-neon-green/80"
                size="sm"
              >
                Ver mi perfil ahora
              </CyberButton>
              
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full px-3 py-2 text-gray-400 hover:text-white transition-colors text-sm"
              >
                Continuar editando
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}
