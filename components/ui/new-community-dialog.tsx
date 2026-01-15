'use client';

import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { CyberButton } from '@/components/ui/cyber-button';
import { Plus, Users, Image as ImageIcon, Upload } from 'lucide-react';
import { useAuth } from '@/components/providers/providers';
import { toast } from 'sonner';
import { Community } from '@/types/user';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';

interface NewCommunityDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCommunityCreated: (newCommunity: Community) => void;
}

export function NewCommunityDialog({ isOpen, onClose, onCommunityCreated }: NewCommunityDialogProps) {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'football' | 'music' | 'art' | 'tech' | 'gaming' | 'social' | 'education' | 'travel' | 'food' | 'health' | 'people' | 'other'>('other');
  const [type, setType] = useState<'community' | 'page' | 'group'>('community');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [uploadedFilePreview, setUploadedFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const forbiddenKeywords = [
    "sexo", "sexual", "violencia", "violento", "drogas", "droga", "armas", "odio",
    "racismo", "discriminación", "pornografía", "desnudos", "ilegal", "matar",
    "asesinar", "terrorismo", "extremismo", "abuso", "explotación", "suicidio",
    "autolesión", "amenaza", "acoso", "contenido explícito"
  ];

  const checkForbiddenContent = (text: string): boolean => {
    const lowerCaseText = text.toLowerCase();
    return forbiddenKeywords.some(keyword => lowerCaseText.includes(keyword));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedFilePreview(reader.result as string);
        setCoverImageUrl('');
      };
      reader.readAsDataURL(file);
    } else {
      setUploadedFilePreview(null);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCoverImageUrl(e.target.value);
    setUploadedFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión para crear una comunidad.');
      return;
    }
    if (!name.trim() || !description.trim() || !category || !type) {
      toast.error('Por favor, completa todos los campos obligatorios.');
      return;
    }

    if (checkForbiddenContent(name) || checkForbiddenContent(description)) {
      toast.error('El nombre o la descripción contienen contenido no permitido. Por favor, revisa tu texto.');
      return;
    }

    setIsLoading(true);
    try {
      const finalCoverImage = uploadedFilePreview || coverImageUrl.trim() || 'https://images.pexels.com/photos/159775/library-books-read-stack-159775.jpeg?auto=compress&cs=tinysrgb&w=800';

      const newCommunity: Community = {
        id: Date.now().toString(),
        name: name.trim(),
        description: description.trim(),
        category: category,
        type: type,
        coverImage: finalCoverImage,
        creatorId: user.id,
        creator: user,
        memberIds: [user.id],
        membersCount: 1,
        createdAt: new Date().toISOString(),
      };

      onCommunityCreated(newCommunity);
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} creada con éxito!`);
      
      setName('');
      setDescription('');
      setCategory('other');
      setType('community');
      setCoverImageUrl('');
      setUploadedFilePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onClose();
    } catch (error) {
      console.error('Error creating community:', error);
      toast.error('Error al crear la comunidad.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] glass-card border-neon-green/20">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center space-x-2">
            <Plus size={20} className="text-neon-green" />
            <span>Crear Nueva Comunidad / Página / Grupo</span>
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Crea un espacio para compartir intereses y conectar con otros.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nombre de la Comunidad / Página / Grupo
            </label>
            <Input
              placeholder="Ej: Fans del Fútbol Sala, Club de Lectura Sci-Fi"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-neon-green/50"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Descripción
            </label>
            <Textarea
              placeholder="Describe de qué trata tu comunidad..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px] bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-neon-green/50"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tipo de Entidad
            </label>
            <Select value={type} onValueChange={(value: 'community' | 'page' | 'group') => setType(value)}>
              <SelectTrigger className="w-full bg-white/10 border-white/20 text-white focus:ring-neon-green/50">
                <SelectValue placeholder="Selecciona el tipo" />
              </SelectTrigger>
              <SelectContent className="bg-popover text-popover-foreground border-border">
                <SelectItem value="community">Comunidad</SelectItem>
                <SelectItem value="page">Página</SelectItem>
                <SelectItem value="group">Grupo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Categoría
            </label>
            <Select value={category} onValueChange={(value: 'football' | 'music' | 'art' | 'tech' | 'gaming' | 'social' | 'education' | 'travel' | 'food' | 'health' | 'people' | 'other') => setCategory(value)}>
              <SelectTrigger className="w-full bg-white/10 border-white/20 text-white focus:ring-neon-green/50">
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent className="bg-popover text-popover-foreground border-border">
                <SelectItem value="football">Fútbol</SelectItem>
                <SelectItem value="music">Música</SelectItem>
                <SelectItem value="art">Arte</SelectItem>
                <SelectItem value="tech">Tecnología</SelectItem>
                <SelectItem value="gaming">Gaming</SelectItem>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="education">Educación</SelectItem>
                <SelectItem value="travel">Viajes</SelectItem>
                <SelectItem value="food">Comida</SelectItem>
                <SelectItem value="health">Salud y Bienestar</SelectItem>
                <SelectItem value="people">Conocer Personas</SelectItem>
                <SelectItem value="other">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Imagen de Portada (Opcional)
            </label>
            <div className="flex items-center space-x-2 mb-2">
              <Input
                placeholder="URL de la imagen de portada"
                value={coverImageUrl}
                onChange={handleUrlChange}
                className="flex-1 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-neon-green/50"
              />
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <CyberButton 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-2"
              >
                <Upload size={16} />
                <span>Subir Imagen</span>
              </CyberButton>
            </div>
            {(uploadedFilePreview || coverImageUrl) && (
              <div className="mt-2 w-full h-32 relative rounded-lg overflow-hidden">
                <Image 
                  src={uploadedFilePreview || coverImageUrl} 
                  alt="Vista previa de portada" 
                  fill 
                  style={{ objectFit: 'cover' }} 
                />
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <CyberButton variant="outline" onClick={onClose}>
            Cancelar
          </CyberButton>
          <CyberButton onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Creando...' : 'Crear'}
          </CyberButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}