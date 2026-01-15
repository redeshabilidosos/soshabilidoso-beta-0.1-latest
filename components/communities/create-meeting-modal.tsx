'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CyberButton } from '@/components/ui/cyber-button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  Users, 
  Video,
  Repeat,
  Settings,
  Plus,
  X
} from 'lucide-react';

interface CreateMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateMeeting: (meetingData: any) => void;
  communityId: string;
}

export function CreateMeetingModal({ 
  isOpen, 
  onClose, 
  onCreateMeeting, 
  communityId 
}: CreateMeetingModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    scheduledDate: '',
    scheduledTime: '',
    duration: 60,
    maxParticipants: 50,
    isRecurring: false,
    recurringType: 'weekly',
    tags: [] as string[],
    requiresApproval: false,
    allowRecording: true,
    enableChat: true,
    enableScreenShare: true
  });

  const [newTag, setNewTag] = useState('');

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const meetingData = {
      ...formData,
      id: Date.now().toString(),
      communityId,
      scheduledAt: `${formData.scheduledDate}T${formData.scheduledTime}:00Z`,
      hostId: 'current-user',
      hostName: 'Usuario Actual',
      hostAvatar: '/api/placeholder/40/40',
      participants: 0,
      status: 'scheduled' as const
    };

    onCreateMeeting(meetingData);
    onClose();
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      scheduledDate: '',
      scheduledTime: '',
      duration: 60,
      maxParticipants: 50,
      isRecurring: false,
      recurringType: 'weekly',
      tags: [],
      requiresApproval: false,
      allowRecording: true,
      enableChat: true,
      enableScreenShare: true
    });
  };

  const durationOptions = [
    { value: 30, label: '30 minutos' },
    { value: 60, label: '1 hora' },
    { value: 90, label: '1.5 horas' },
    { value: 120, label: '2 horas' },
    { value: 180, label: '3 horas' }
  ];

  const participantOptions = [
    { value: 10, label: '10 participantes' },
    { value: 25, label: '25 participantes' },
    { value: 50, label: '50 participantes' },
    { value: 100, label: '100 participantes' },
    { value: 200, label: '200 participantes' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-white">
            <Video className="w-5 h-5" />
            <span>Crear Nueva Reunión</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="glass-card">
            <CardContent className="p-4 space-y-4">
              <h3 className="text-lg font-semibold text-white mb-3">Información Básica</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Título de la reunión *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-600 focus:border-neon-blue focus:outline-none"
                  placeholder="Ej: Introducción a React Hooks"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-600 focus:border-neon-blue focus:outline-none"
                  placeholder="Describe de qué tratará la reunión..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Etiquetas
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="flex items-center space-x-1">
                      <span>{tag}</span>
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
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 bg-gray-800 text-white px-3 py-2 rounded border border-gray-600 focus:border-neon-blue focus:outline-none"
                    placeholder="Agregar etiqueta"
                  />
                  <CyberButton type="button" onClick={addTag} size="sm">
                    <Plus className="w-4 h-4" />
                  </CyberButton>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card className="glass-card">
            <CardContent className="p-4 space-y-4">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Programación</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Fecha *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.scheduledDate}
                    onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-600 focus:border-neon-blue focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Hora *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.scheduledTime}
                    onChange={(e) => handleInputChange('scheduledTime', e.target.value)}
                    className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-600 focus:border-neon-blue focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Duración
                  </label>
                  <select
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                    className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-600 focus:border-neon-blue focus:outline-none"
                  >
                    {durationOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Máximo de participantes
                  </label>
                  <select
                    value={formData.maxParticipants}
                    onChange={(e) => handleInputChange('maxParticipants', parseInt(e.target.value))}
                    className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-600 focus:border-neon-blue focus:outline-none"
                  >
                    {participantOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isRecurring"
                  checked={formData.isRecurring}
                  onChange={(e) => handleInputChange('isRecurring', e.target.checked)}
                  className="w-4 h-4 text-neon-blue bg-gray-800 border-gray-600 rounded focus:ring-neon-blue"
                />
                <label htmlFor="isRecurring" className="text-sm text-gray-300">
                  Reunión recurrente
                </label>
                {formData.isRecurring && (
                  <select
                    value={formData.recurringType}
                    onChange={(e) => handleInputChange('recurringType', e.target.value)}
                    className="bg-gray-800 text-white px-2 py-1 rounded border border-gray-600 text-sm"
                  >
                    <option value="daily">Diaria</option>
                    <option value="weekly">Semanal</option>
                    <option value="monthly">Mensual</option>
                  </select>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card className="glass-card">
            <CardContent className="p-4 space-y-4">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Configuración</span>
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-300">
                    Requiere aprobación para unirse
                  </label>
                  <input
                    type="checkbox"
                    checked={formData.requiresApproval}
                    onChange={(e) => handleInputChange('requiresApproval', e.target.checked)}
                    className="w-4 h-4 text-neon-blue bg-gray-800 border-gray-600 rounded focus:ring-neon-blue"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-300">
                    Permitir grabación
                  </label>
                  <input
                    type="checkbox"
                    checked={formData.allowRecording}
                    onChange={(e) => handleInputChange('allowRecording', e.target.checked)}
                    className="w-4 h-4 text-neon-blue bg-gray-800 border-gray-600 rounded focus:ring-neon-blue"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-300">
                    Habilitar chat
                  </label>
                  <input
                    type="checkbox"
                    checked={formData.enableChat}
                    onChange={(e) => handleInputChange('enableChat', e.target.checked)}
                    className="w-4 h-4 text-neon-blue bg-gray-800 border-gray-600 rounded focus:ring-neon-blue"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-300">
                    Permitir compartir pantalla
                  </label>
                  <input
                    type="checkbox"
                    checked={formData.enableScreenShare}
                    onChange={(e) => handleInputChange('enableScreenShare', e.target.checked)}
                    className="w-4 h-4 text-neon-blue bg-gray-800 border-gray-600 rounded focus:ring-neon-blue"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <CyberButton
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancelar
            </CyberButton>
            <CyberButton type="submit">
              Crear Reunión
            </CyberButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}