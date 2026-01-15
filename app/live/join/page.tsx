'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { CyberButton } from '@/components/ui/cyber-button';
import { Key, Video, ArrowLeft, Users, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';
import Link from 'next/link';

export default function JoinLivePage() {
  const router = useRouter();
  const [accessCode, setAccessCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleJoin = async () => {
    if (!accessCode.trim()) {
      toast.error('Ingresa el código de acceso');
      return;
    }

    setIsLoading(true);

    // Check if stream exists in localStorage
    const streams = JSON.parse(localStorage.getItem('active_streams') || '[]');
    const stream = streams.find((s: any) => s.accessCode === accessCode.toUpperCase());

    if (stream) {
      toast.success('¡Código válido! Uniéndote a la clase...');
      router.push(`/meeting/${stream.id}?code=${accessCode.toUpperCase()}`);
    } else {
      toast.error('Código de acceso inválido o la transmisión ha finalizado');
    }

    setIsLoading(false);
  };

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md glass-card border-neon-green/20">
          <CardContent className="p-8">
            <Link href="/live" className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Link>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="w-8 h-8 text-neon-green" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Unirse a una Clase</h1>
              <p className="text-gray-400">Ingresa el código de acceso proporcionado por el instructor</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Código de acceso
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                    onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white text-center text-xl tracking-widest font-mono focus:border-neon-green focus:outline-none uppercase"
                    placeholder="ABC123"
                    maxLength={6}
                  />
                </div>
              </div>

              <CyberButton onClick={handleJoin} disabled={isLoading} className="w-full py-3">
                {isLoading ? 'Verificando...' : 'Unirse a la clase'}
              </CyberButton>
            </div>

            <div className="mt-8 p-4 bg-gray-800/50 rounded-lg">
              <div className="flex items-start space-x-3">
                <Lock className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-400">
                  <p className="font-medium text-gray-300 mb-1">Acceso restringido</p>
                  <p>Solo los miembros de la comunidad que emite la clase pueden unirse con el código de acceso.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
