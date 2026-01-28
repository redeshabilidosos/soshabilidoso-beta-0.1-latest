'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Sidebar } from '@/components/navigation/sidebar';
import { MobileNav } from '@/components/navigation/mobile-nav';
import { Users, ArrowLeft, Video, Lock, Globe } from 'lucide-react';
import { toast } from 'sonner';

export default function CreateMeetingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isPrivate: false,
    maxParticipants: 10,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Generar ID corto y amigable para la reunión (8 caracteres)
      const meetingId = Math.random().toString(36).substr(2, 8).toUpperCase();
      
      // Guardar datos de la reunión
      const meetingData = {
        id: meetingId,
        type: 'meeting',
        ...formData,
        hostName: 'Usuario Actual', // TODO: Obtener del contexto de auth
        startedAt: new Date().toISOString(),
        participants: [],
      };

      // Guardar en localStorage (temporal)
      const meetings = JSON.parse(localStorage.getItem('active_meetings') || '[]');
      meetings.push(meetingData);
      localStorage.setItem('active_meetings', JSON.stringify(meetings));

      toast.success('Reunión creada exitosamente');
      
      // Redirigir a la sala de reunión
      router.push(`/live/meeting/${meetingId}`);
    } catch (error) {
      console.error('Error creating meeting:', error);
      toast.error('Error al crear la reunión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent">
      <Sidebar />
      <MobileNav />
      
      <main className="pb-24 lg:ml-64 lg:pb-0">
        <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                <Users className="w-7 h-7 text-blue-500" />
                Crear Reunión Virtual
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Configura tu reunión y comparte el enlace con los participantes
              </p>
            </div>
          </div>

          {/* Form Card */}
          <Card className="border-0 bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Detalles de la Reunión</CardTitle>
              <CardDescription>
                Completa la información para crear tu reunión virtual
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Título */}
                <div className="space-y-2">
                  <Label htmlFor="title">Título de la Reunión *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ej: Reunión de Equipo Semanal"
                    required
                    className="bg-gray-800/50"
                  />
                </div>

                {/* Descripción */}
                <div className="space-y-2">
                  <Label htmlFor="description">Descripción (Opcional)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe el propósito de la reunión..."
                    rows={4}
                    className="bg-gray-800/50 resize-none"
                  />
                </div>

                {/* Configuración de Privacidad */}
                <div className="space-y-4">
                  <Label>Configuración de Acceso</Label>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-gray-800/30 border border-gray-700">
                    <div className="flex items-center gap-3">
                      {formData.isPrivate ? (
                        <Lock className="w-5 h-5 text-yellow-500" />
                      ) : (
                        <Globe className="w-5 h-5 text-green-500" />
                      )}
                      <div>
                        <p className="font-medium">
                          {formData.isPrivate ? 'Reunión Privada' : 'Reunión Pública'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formData.isPrivate 
                            ? 'Solo usuarios con el enlace pueden unirse'
                            : 'Cualquiera puede unirse a la reunión'
                          }
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={formData.isPrivate}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, isPrivate: checked })
                      }
                    />
                  </div>
                </div>

                {/* Máximo de Participantes */}
                <div className="space-y-2">
                  <Label htmlFor="maxParticipants">Máximo de Participantes</Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    min="2"
                    max="50"
                    value={formData.maxParticipants}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      maxParticipants: parseInt(e.target.value) || 10 
                    })}
                    className="bg-gray-800/50"
                  />
                  <p className="text-xs text-muted-foreground">
                    Número máximo de personas que pueden unirse (2-50)
                  </p>
                </div>

                {/* Botones de Acción */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="w-full sm:w-auto"
                    disabled={isLoading}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="w-full sm:flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
                    disabled={isLoading || !formData.title}
                  >
                    <Video className="w-4 h-4 mr-2" />
                    {isLoading ? 'Creando...' : 'Crear e Iniciar Reunión'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="border-blue-500/20 bg-blue-500/5">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Users className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Características de las Reuniones</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Video y audio en tiempo real</li>
                    <li>• Chat integrado para mensajes</li>
                    <li>• Compartir pantalla (próximamente)</li>
                    <li>• Grabación de sesiones (próximamente)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
