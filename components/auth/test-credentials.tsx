'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Eye, EyeOff, User, Shield } from 'lucide-react';
import { toast } from 'sonner';

export function TestCredentials() {
  const [isVisible, setIsVisible] = useState(false);

  const credentials = [
    {
      type: 'Usuario Regular',
      icon: User,
      login: 'usuario_prueba',
      email: 'prueba@test.com',
      password: '123456',
      description: 'Usuario estándar para pruebas'
    },
    {
      type: 'Administrador',
      icon: Shield,
      login: 'admin',
      email: 'admin@test.com',
      password: 'admin123',
      description: 'Cuenta de administrador'
    }
  ];

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copiado al portapapeles`);
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsVisible(true)}
          variant="outline"
          size="sm"
          className="bg-black/80 border-neon-green/50 text-neon-green hover:bg-neon-green/10"
        >
          <User className="w-4 h-4 mr-2" />
          Usuarios de Prueba
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80">
      <Card className="bg-black/90 border-neon-green/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-neon-green text-sm">Usuarios de Prueba</CardTitle>
            <Button
              onClick={() => setIsVisible(false)}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-gray-400 hover:text-white"
            >
              <EyeOff className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {credentials.map((cred, index) => {
            const Icon = cred.icon;
            return (
              <div key={index} className="space-y-2 p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-neon-blue" />
                  <span className="text-white font-medium text-sm">{cred.type}</span>
                </div>
                <p className="text-gray-400 text-xs">{cred.description}</p>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-xs">Usuario:</span>
                    <div className="flex items-center gap-1">
                      <code className="text-neon-green text-xs bg-black/50 px-1 rounded">
                        {cred.login}
                      </code>
                      <Button
                        onClick={() => copyToClipboard(cred.login, 'Usuario')}
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 p-0"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-xs">Email:</span>
                    <div className="flex items-center gap-1">
                      <code className="text-neon-blue text-xs bg-black/50 px-1 rounded">
                        {cred.email}
                      </code>
                      <Button
                        onClick={() => copyToClipboard(cred.email, 'Email')}
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 p-0"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-xs">Contraseña:</span>
                    <div className="flex items-center gap-1">
                      <code className="text-yellow-400 text-xs bg-black/50 px-1 rounded">
                        {cred.password}
                      </code>
                      <Button
                        onClick={() => copyToClipboard(cred.password, 'Contraseña')}
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 p-0"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          
          <div className="text-center pt-2">
            <p className="text-gray-500 text-xs">
              💡 Puedes usar el usuario o email para iniciar sesión
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}