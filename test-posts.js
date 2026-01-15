// Script para probar la creación de posts desde el frontend
console.log('🧪 Probando sistema de posts...');

// Simular datos de post
const testPostData = {
  content: "Este es un post de prueba desde el frontend",
  post_type: "text",
  category: "general_sport",
  is_public: true
};

console.log('📝 Datos del post:', testPostData);

// En el navegador, puedes ejecutar esto en la consola:
/*
// 1. Obtener token de autenticación
const token = localStorage.getItem('access_token');

// 2. Crear post
fetch('http://127.0.0.1:8000/api/posts/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    content: "Post de prueba desde consola",
    post_type: "text",
    category: "general_sport",
    is_public: true
  })
})
.then(response => response.json())
.then(data => console.log('✅ Post creado:', data))
.catch(error => console.error('❌ Error:', error));

// 3. Obtener posts
fetch('http://127.0.0.1:8000/api/posts/', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(response => response.json())
.then(data => console.log('📋 Posts:', data))
.catch(error => console.error('❌ Error:', error));
*/

console.log('💡 Ejecuta el código comentado en la consola del navegador para probar la API');