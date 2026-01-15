// Script para probar la subida de cover photo desde el frontend
// Ejecutar en la consola del navegador

async function testCoverPhotoFrontend() {
    console.log('🧪 Probando cover photo desde frontend...');
    
    // 1. Verificar usuario actual
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('👤 Usuario actual:', currentUser.displayName);
    console.log('📷 Cover photo actual:', currentUser.coverPhoto);
    console.log('🔗 Cover photo URL actual:', currentUser.cover_photo_url);
    
    // 2. Crear imagen de prueba
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    
    // Dibujar algo
    ctx.fillStyle = '#ff6b6b';
    ctx.fillRect(0, 0, 200, 100);
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.fillText('Test Cover', 60, 55);
    
    // Convertir a blob
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    const file = new File([blob], 'test-cover-frontend.png', { type: 'image/png' });
    
    console.log('🎨 Imagen creada:', file.name, file.size, 'bytes');
    
    // 3. Obtener token
    const token = localStorage.getItem('access_token');
    if (!token) {
        console.error('❌ No hay token de acceso');
        return;
    }
    
    // 4. Subir imagen
    console.log('📤 Subiendo imagen...');
    
    const formData = new FormData();
    formData.append('cover_photo', file);
    
    try {
        const response = await fetch('http://localhost:8000/api/auth/upload-cover/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        
        console.log('📊 Status:', response.status);
        
        if (response.ok) {
            const result = await response.json();
            console.log('✅ Respuesta del servidor:', result);
            
            // 5. Verificar si el usuario se actualizó
            if (result.user) {
                console.log('👤 Usuario actualizado del servidor:');
                console.log('  - cover_photo:', result.user.cover_photo);
                console.log('  - cover_photo_url:', result.user.cover_photo_url);
                
                // Actualizar localStorage manualmente para probar
                localStorage.setItem('user', JSON.stringify(result.user));
                console.log('💾 Usuario guardado en localStorage');
                
                // Verificar localStorage
                const updatedUser = JSON.parse(localStorage.getItem('user') || '{}');
                console.log('📱 Usuario desde localStorage:');
                console.log('  - coverPhoto:', updatedUser.coverPhoto);
                console.log('  - cover_photo:', updatedUser.cover_photo);
                console.log('  - cover_photo_url:', updatedUser.cover_photo_url);
            }
        } else {
            const error = await response.text();
            console.error('❌ Error del servidor:', error);
        }
        
    } catch (error) {
        console.error('❌ Error en la petición:', error);
    }
}

// Ejecutar la prueba
testCoverPhotoFrontend();