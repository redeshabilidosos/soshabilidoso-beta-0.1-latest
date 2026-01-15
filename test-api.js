// Script para probar la conexión con la API
const axios = require('axios');

const API_BASE_URL = 'http://localhost:8000/api';

async function testAPI() {
  console.log('🧪 Probando conexión con la API...');
  console.log('=' .repeat(50));

  try {
    // Probar endpoint raíz
    console.log('1. Probando endpoint raíz...');
    const rootResponse = await axios.get('http://localhost:8000/');
    console.log('✅ Endpoint raíz funciona:', rootResponse.data.message);

    // Probar login
    console.log('\n2. Probando login...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login/`, {
      email: 'molo@molo.com',
      password: 'molo123456'
    });
    console.log('✅ Login exitoso');
    console.log('Usuario:', loginResponse.data.user.display_name);
    console.log('Token recibido:', loginResponse.data.access ? 'Sí' : 'No');

    // Probar registro
    console.log('\n3. Probando registro...');
    try {
      const registerResponse = await axios.post(`${API_BASE_URL}/auth/register/`, {
        email: 'test@test.com',
        username: 'testuser',
        display_name: 'Usuario de Prueba',
        password: 'testpassword123',
        password_confirm: 'testpassword123',
        position: 'Jugador',
        team: 'Equipo Test'
      });
      console.log('✅ Registro exitoso');
      console.log('Usuario creado:', registerResponse.data.user.display_name);
    } catch (registerError) {
      if (registerError.response?.status === 400) {
        console.log('⚠️ Usuario ya existe (normal en pruebas)');
      } else {
        console.log('❌ Error en registro:', registerError.response?.data);
      }
    }

    console.log('\n🎉 Todas las pruebas completadas');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

// Ejecutar pruebas
testAPI();