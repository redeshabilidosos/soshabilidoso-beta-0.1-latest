'use client';

import { useState } from 'react';
import { useAuth } from '@/components/providers/providers';
import { CyberButton } from '@/components/ui/cyber-button';
import { toast } from 'sonner';

export function CoverPhotoTest() {
  const { user, uploadCoverPhoto } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const createTestImage = (): File => {
    // Crear un canvas pequeño y convertirlo a blob
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Dibujar un rectángulo de color
      ctx.fillStyle = '#00ff88';
      ctx.fillRect(0, 0, 100, 100);
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.fillText('Test', 35, 55);
    }
    
    // Convertir canvas a blob y luego a File
    const dataURL = canvas.toDataURL('image/png');
    const byteString = atob(dataURL.split(',')[1]);
    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    
    const blob = new Blob([ab], { type: mimeString });
    return new File([blob], 'test-cover.png', { type: 'image/png' });
  };

  const testCoverPhotoUpload = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión');
      return;
    }

    setIsUploading(true);
    setTestResults([]);
    
    try {
      addResult('🧪 Iniciando prueba de foto de portada...');
      addResult(`👤 Usuario actual: ${user.displayName} (${user.email})`);
      addResult(`📷 Cover photo actual: ${user.coverPhoto || 'No definido'}`);
      
      // Crear imagen de prueba
      addResult('🎨 Creando imagen de prueba...');
      const testFile = createTestImage();
      addResult(`✅ Imagen creada: ${testFile.name} (${testFile.size} bytes)`);
      
      // Subir imagen
      addResult('📤 Subiendo imagen...');
      const success = await uploadCoverPhoto(testFile);
      
      if (success) {
        addResult('✅ Subida exitosa según el servicio');
        
        // Verificar usuario actualizado
        setTimeout(() => {
          const updatedUser = JSON.parse(localStorage.getItem('user') || '{}');
          addResult(`📷 Cover photo después: ${updatedUser.coverPhoto || 'No definido'}`);
          addResult(`🔗 Cover photo URL: ${updatedUser.cover_photo_url || 'No definido'}`);
          
          if (updatedUser.coverPhoto !== user.coverPhoto) {
            addResult('✅ La foto de portada se actualizó correctamente');
          } else {
            addResult('❌ La foto de portada NO se actualizó');
          }
        }, 1000);
      } else {
        addResult('❌ Error en la subida');
      }
      
    } catch (error: any) {
      addResult(`❌ Error: ${error.message}`);
      console.error('Test error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  if (!user) {
    return (
      <div className="p-4 bg-gray-900 rounded-lg">
        <p className="text-white">Debes iniciar sesión para probar esta funcionalidad</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 rounded-lg max-w-2xl">
      <h2 className="text-xl font-bold text-white mb-4">Prueba de Foto de Portada</h2>
      
      <div className="mb-4">
        <p className="text-gray-300 mb-2">Usuario: {user.displayName}</p>
        <p className="text-gray-300 mb-2">Cover Photo actual: {user.coverPhoto || 'No definido'}</p>
      </div>

      <CyberButton
        onClick={testCoverPhotoUpload}
        disabled={isUploading}
        className="mb-4"
      >
        {isUploading ? 'Probando...' : 'Probar Subida de Cover Photo'}
      </CyberButton>

      {testResults.length > 0 && (
        <div className="bg-gray-800 rounded p-4 max-h-64 overflow-y-auto">
          <h3 className="text-lg font-semibold text-white mb-2">Resultados:</h3>
          <div className="space-y-1">
            {testResults.map((result, index) => (
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