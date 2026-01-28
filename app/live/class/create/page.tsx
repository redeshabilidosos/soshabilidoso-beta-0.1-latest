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
import { GraduationCap, ArrowLeft, Video, Lock, Globe, Key } from 'lucide-react';
import { toast } from 'sonner';

export default function CreateClassPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    isPrivate: true,
    accessCode: '',
    maxStudents: 30,
  });

  const generateAccessCode = () => {
    const code = Math.random().toString(36).substr(2, 6).toUpperCase();
    setFormData({ ...formData, accessCode: code });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Generar ID corto y amigable para la clase (8 caracteres)
      const classId = Math.random().toString(36).substr(2, 8).toUpperCase();
      
      // Generar código de acceso si es privado y no tiene uno
      let accessCode = formData.accessCode;
      if (formData.isPrivate && !accessCode) {
        accessCode = Math.random().toString(36).substr(2, 6).toUpperCase();
      }

      // Guardar datos de la clase
      const classData = {
        id: classId,
        type: 'class',
        ...formData,
        accessCode: formData.isPrivate ? accessCode : undefined,
        hostName: 'Usuario Actual', // TODO: Obtener del contexto de auth
        startedAt: new Date().toISOString(),
        students: [],
      };

      // Guardar en localStorage (temporal)
      const classes = JSON.parse(localStorage.getItem('active_classes') || '[]');
      classes.push(classData);
      localStorage.setItem('active_classes', JSON.stringify(classes));

      toast.success(
        formData.isPrivate 
          ? `Clase creada. Código: ${accessCode}` 
          : 'Clase creada exitosamente'
      );
      
      // Redirigir a la sala de clase
      router.push(`/live/class/${classId}`);
    } catch (error) {
      console.error('Error creating class:', error);
      toast.error('Error al crear la clase');
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
                <GraduationCap className="w-7 h-7 text-green-500" />
                Crear Clase Virtual
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Configura tu clase y comparte el código con tus estudiantes
              </p>
            </div>
          </div>

          {/* Form Card */}
          <Card className="border-0 bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Detalles de la Clase</CardTitle>
              <CardDescription>
                Completa la información para crear tu clase virtual
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Título */}
                <div className="space-y-2">
                  <Label htmlFor="title">Título de la Clase *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ej: Introducción a JavaScript"
                    required
                    className="bg-gray-800/50"
                  />
                </div>

                {/* Categoría */}
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Ej: Programación, Diseño, Marketing..."
                    className="bg-gray-800/50"
                  />
                </div>

                {/* Descripción */}
                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe el contenido de la clase..."
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
                          {formData.isPrivate ? 'Clase Privada' : 'Clase Pública'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formData.isPrivate 
                            ? 'Requiere código de acceso para unirse'
                            : 'Cualquiera puede unirse a la clase'
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

                  {/* Código de Acceso */}
                  {formData.isPrivate && (
                    <div className="space-y-2">
                      <Label htmlFor="accessCode">Código de Acceso</Label>
                      <div className="flex gap-2">
                        <Input
                          id="accessCode"
                          value={formData.accessCode}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            accessCode: e.target.value.toUpperCase() 
                          })}
                          placeholder="Ej: ABC123"
                          maxLength={6}
                          className="bg-gray-800/50 font-mono text-lg"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={generateAccessCode}
                          className="flex-shrink-0"
                        >
                          <Key className="w-4 h-4 mr-2" />
                          Generar
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Los estudiantes necesitarán este código para unirse
                      </p>
                    </div>
                  )}
                </div>

                {/* Máximo de Estudiantes */}
                <div className="space-y-2">
                  <Label htmlFor="maxStudents">Máximo de Estudiantes</Label>
                  <Input
                    id="maxStudents"
                    type="number"
                    min="5"
                    max="100"
                    value={formData.maxStudents}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      maxStudents: parseInt(e.target.value) || 30 
                    })}
                    className="bg-gray-800/50"
                  />
                  <p className="text-xs text-muted-foreground">
                    Número máximo de estudiantes que pueden unirse (5-100)
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
                    className="w-full sm:flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    disabled={isLoading || !formData.title}
                  >
                    <Video className="w-4 h-4 mr-2" />
                    {isLoading ? 'Creando...' : 'Crear e Iniciar Clase'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="border-green-500/20 bg-green-500/5">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <GraduationCap className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Características de las Clases</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Video del instructor siempre visible</li>
                    <li>• Control de micrófono para estudiantes</li>
                    <li>• Chat para preguntas y respuestas</li>
                    <li>• Pizarra virtual (próximamente)</li>
                    <li>• Compartir archivos y recursos</li>
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
