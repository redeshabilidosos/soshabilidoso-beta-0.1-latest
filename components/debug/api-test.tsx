'use client';

import { useState } from 'react';
import { authService } from '@/lib/services/auth.service';
import { toast } from 'sonner';

export function APITest() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setResults(prev => [...prev, message]);
  };

  const testAPI = async () => {
    setIsLoading(true);
    setResults([]);
    
    try {
      addResult('🧪 Iniciando pruebas de API...');
      
      // Probar login
      addResult('1. Probando login...');
      try {
        const loginResult = await authService.login({
          login: 'molo@molo.com', // Puede ser email o username
          password: 'molo123456'
        });
        addResult('✅ Login exitoso: ' + loginResult.user.displayName);
      } catch (error: any) {
        addResult('❌ Error en login: ' + (error.message || 'Error desconocido'));
        console.error('Login error:', error);
      }

      // Probar registro
      addResult('2. Probando registro...');
      try {
        const registerResult = await authService.register({
          email: 'test' + Date.now() + '@test.com',
          username: 'testuser' + Date.now(),
          display_name: 'Usuario de Prueba',
          password: 'testpassword123',
          password_confirm: 'testpassword123',
          position: 'Jugador',
          team: 'Equipo Test'
        });
        addResult('✅ Registro exitoso: ' + registerResult.user.displayName);
      } catch (error: any) {
        addResult('❌ Error en registro: ' + (error.message || 'Error desconocido'));
        console.error('Register error:', error);
      }

      addResult('🎉 Pruebas completadas');
      
    } catch (error) {
      addResult('❌ Error general: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-900 rounded-lg">
      <h2 className="text-xl font-bold text-white mb-4">Prueba de API</h2>
      
      <button
        onClick={testAPI}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Probando...' : 'Probar API'}
      </button>

      {results.length > 0 && (
        <div className="mt-4 p-4 bg-gray-800 rounded">
          <h3 className="text-lg font-semibold text-white mb-2">Resultados:</h3>
          <div className="space-y-1">
            {results.map((result, index) => (
              <div key={index} className="text-sm text-gray-300 font-mono">
                {result}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}