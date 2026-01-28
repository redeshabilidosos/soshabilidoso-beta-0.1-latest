'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Key, Video, ArrowLeft, Users, GraduationCap, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Sidebar } from '@/components/navigation/sidebar';
import { MobileNav } from '@/components/navigation/mobile-nav';
import Link from 'next/link';

export default function JoinLivePage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleJoin = async () => {
    if (!code.trim()) {
      toast.error('Ingresa un código');
      return;
    }

    setIsLoading(true);

    try {
      const codeUpper = code.toUpperCase().trim();

      // Buscar en reuniones activas
      const meetings = JSON.parse(localStorage.getItem('active_meetings') || '[]');
      const meeting = meetings.find((m: any) => m.id === codeUpper);

      if (meeting) {
        toast.success('¡Uniéndote a la reunión!');
        router.push(`/live/meeting/${meeting.id}`);
        return;
      }

      // Buscar en clases activas
      const classes = JSON.parse(localStorage.getItem('active_classes') || '[]');
      
      // Buscar por ID de clase
      let foundClass = classes.find((c: any) => c.id === codeUpper);
      
      // Si no se encuentra por ID, buscar por código de acceso
      if (!foundClass) {
        foundClass = classes.find((c: any) => c.accessCode === codeUpper);
      }

      if (foundClass) {
        // Si la clase es privada y se ingresó el código de acceso, validar
        if (foundClass.isPrivate && foundClass.accessCode !== codeUpper && foundClass.id !== codeUpper) {
          toast.error('Código de acceso incorrecto');
          setIsLoading(false);
          return;
        }
        
        toast.success('¡Uniéndote a la clase!');
        router.push(`/live/class/${foundClass.id}`);
        return;
      }

      // Buscar en streams activos (compatibilidad con código anterior)
      const streams = JSON.parse(localStorage.getItem('active_streams') || '[]');
      const stream = streams.find((s: any) => 
        s.id === codeUpper || s.accessCode === codeUpper
      );

      if (stream) {
        toast.success('¡Uniéndote al stream!');
        router.push(`/live/stream/${stream.id}`);
        return;
      }

      // No se encontró ninguna sesión
      toast.error('Código inválido o la sesión ha finalizado');
    } catch (error) {
      console.error('Error joining:', error);
      toast.error('Error al unirse. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent">
      <Sidebar />
      <MobileNav />
      
      <main className="pb-24 lg:ml-64 lg:pb-0">
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md border-0 bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl">
            <CardContent className="p-6 md:p-8">
              <Link 
                href="/live" 
                className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Link>

              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
                  <Video className="w-8 h-8 text-blue-400" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  Unirse con Código
                </h1>
                <p className="text-gray-400 text-sm">
                  Ingresa el código de reunión o clase
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="code" className="text-gray-300">
                    Código de Acceso
                  </Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="code"
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
                      className="pl-10 text-center text-xl tracking-widest font-mono uppercase bg-gray-800/50 border-gray-700 focus:border-blue-500"
                      placeholder="A1B2C3D4"
                      maxLength={8}
                      autoFocus
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Puede ser un ID de reunión (8 caracteres) o código de clase (6 caracteres)
                  </p>
                </div>

                <Button 
                  onClick={handleJoin} 
                  disabled={isLoading || !code.trim()}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
                  size="lg"
                >
                  {isLoading ? 'Verificando...' : 'Unirse'}
                </Button>
              </div>

              {/* Info Cards */}
              <div className="mt-8 space-y-3">
                <Card className="bg-blue-500/5 border-blue-500/20">
                  <CardContent className="p-3 flex items-start gap-3">
                    <Users className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-gray-400">
                      <p className="font-medium text-gray-300 mb-1">Reuniones</p>
                      <p>Usa el ID de 8 caracteres para unirte a reuniones virtuales</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-green-500/5 border-green-500/20">
                  <CardContent className="p-3 flex items-start gap-3">
                    <GraduationCap className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-gray-400">
                      <p className="font-medium text-gray-300 mb-1">Clases</p>
                      <p>Usa el ID de clase o el código de acceso de 6 caracteres</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-yellow-500/5 border-yellow-500/20">
                  <CardContent className="p-3 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-gray-400">
                      <p className="font-medium text-gray-300 mb-1">Nota</p>
                      <p>Solo puedes unirte a sesiones activas en este momento</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
