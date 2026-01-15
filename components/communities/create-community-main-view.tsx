'use client';

import { useState } from 'react';
import { CommunityTypeSelector } from './community-type-selector';
import { DynamicCommunityForm } from './dynamic-community-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { toast } from 'sonner';

interface CreateCommunityMainViewProps {
  onCommunityCreated: (community: any) => void;
}

type CommunityType = 'public' | 'private' | 'premium' | 'page';

export function CreateCommunityMainView({ onCommunityCreated }: CreateCommunityMainViewProps) {
  const [selectedType, setSelectedType] = useState<CommunityType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleTypeSelect = (type: CommunityType) => {
    setSelectedType(type);
    setIsFormOpen(true);
  };

  const handleBack = () => {
    setSelectedType(null);
    setIsFormOpen(false);
  };

  const handleCloseModal = () => {
    if (!isLoading) {
      setIsFormOpen(false);
      setSelectedType(null);
    }
  };

  const handleFormSubmit = async (formData: any) => {
    console.log('🚀 Iniciando creación de comunidad...', formData);
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('access_token');
      console.log('🔑 Token:', token ? 'Presente' : 'No encontrado');
      
      if (!token) {
        toast.error('Debes iniciar sesión para crear una comunidad');
        setIsLoading(false);
        return;
      }

      // Preparar FormData para enviar archivos
      const apiFormData = new FormData();
      apiFormData.append('name', formData.name);
      apiFormData.append('description', formData.description);
      apiFormData.append('category', formData.category);
      apiFormData.append('type', selectedType || 'public');
      
      console.log('📦 Datos a enviar:', {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        type: selectedType
      });
      
      if (formData.location) {
        apiFormData.append('location', formData.location);
      }
      
      if (formData.profileImage) {
        apiFormData.append('profile_image', formData.profileImage);
      }
      
      if (formData.coverImage) {
        apiFormData.append('cover_image', formData.coverImage);
      }

      // Enviar a la API
      console.log('📡 Enviando petición a la API...');
      const response = await fetch('http://127.0.0.1:8000/api/communities/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: apiFormData
      });

      console.log('📥 Respuesta recibida:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Error de la API:', errorData);
        throw new Error(errorData.detail || 'Error al crear la comunidad');
      }

      const newCommunity = await response.json();
      console.log('✅ Comunidad creada:', newCommunity);

      // Transformar la respuesta del backend al formato esperado por el frontend
      const formattedCommunity = {
        ...newCommunity,
        members: newCommunity.member_count || 0,
        posts: newCommunity.post_count || 0,
        isJoined: true,
        slug: newCommunity.slug || newCommunity.id
      };

      toast.success(`¡${selectedType === 'page' ? 'Página' : 'Comunidad'} creada exitosamente!`);
      onCommunityCreated(formattedCommunity);
      
      // Reset form
      setSelectedType(null);
      setIsFormOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Error al crear la comunidad');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CommunityTypeSelector onTypeSelect={handleTypeSelect} />
      
      {/* Modal del Formulario */}
      <Dialog open={isFormOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto glass-card border-neon-green/20 p-0">
          <button
            onClick={handleCloseModal}
            disabled={isLoading}
            className="absolute top-4 right-4 p-2 bg-black/50 rounded-lg text-white hover:bg-black/70 transition-colors z-10 disabled:opacity-50"
          >
            <X size={20} />
          </button>
          
          <div className="p-6">
            {selectedType && (
              <DynamicCommunityForm
                communityType={selectedType}
                onSubmit={handleFormSubmit}
                onBack={handleBack}
                isLoading={isLoading}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}