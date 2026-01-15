#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

function colorLog(message, color = 'white') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function showBanner() {
  console.clear();
  colorLog('\n╔══════════════════════════════════════════════════════════════╗', 'cyan');
  colorLog('║                    SOS-HABILIDOSO                            ║', 'cyan');
  colorLog('║                 Sistema de Mensajería                        ║', 'cyan');
  colorLog('╚══════════════════════════════════════════════════════════════╝', 'cyan');
  
  colorLog('\n🚀 INICIANDO APLICACIÓN...', 'green');
  colorLog('\n📋 CONFIGURACIÓN DE SERVICIOS:', 'yellow');
  colorLog('   🔧 Backend Django:  http://127.0.0.1:8000', 'blue');
  colorLog('   🌐 Frontend Next.js: http://localhost:3000', 'blue');
  colorLog('   🗄️  Base de Datos:   PostgreSQL', 'blue');
  
  colorLog('\n📖 ENDPOINTS DISPONIBLES:', 'yellow');
  colorLog('   🔗 API:             http://127.0.0.1:8000/api/', 'magenta');
  colorLog('   👤 Usuarios:        http://127.0.0.1:8000/api/users/', 'magenta');
  colorLog('   💬 Mensajería:      http://127.0.0.1:8000/api/messaging/', 'magenta');
  colorLog('   📝 Posts:           http://127.0.0.1:8000/api/posts/', 'magenta');
  colorLog('   🔐 Admin:           http://127.0.0.1:8000/admin/', 'magenta');
  
  colorLog('\n⚡ INICIANDO SERVICIOS...', 'green');
  console.log('');
}

function startBackend() {
  return new Promise((resolve, reject) => {
    colorLog('🔧 Iniciando Backend Django...', 'blue');
    
    const backendProcess = spawn('cmd', ['/c', 'cd backend && call venv\\Scripts\\activate.bat && python manage.py runserver 8000'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true
    });
    
    backendProcess.stdout.on('data', (data) => {
      const output = data.toString();
      if (output.includes('Starting development server')) {
        colorLog('✅ Backend Django iniciado correctamente en puerto 8000', 'green');
        resolve(backendProcess);
      }
      // Mostrar output del backend con prefijo
      process.stdout.write(`${colors.blue}[Django]${colors.reset} ${output}`);
    });
    
    backendProcess.stderr.on('data', (data) => {
      process.stderr.write(`${colors.red}[Django Error]${colors.reset} ${data}`);
    });
    
    backendProcess.on('error', (error) => {
      colorLog(`❌ Error iniciando backend: ${error.message}`, 'red');
      reject(error);
    });
    
    // Timeout para resolver si no se detecta el mensaje
    setTimeout(() => {
      resolve(backendProcess);
    }, 10000);
  });
}

function startFrontend() {
  return new Promise((resolve, reject) => {
    colorLog('🌐 Iniciando Frontend Next.js...', 'cyan');
    
    const frontendProcess = spawn('npm', ['run', 'dev'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true
    });
    
    frontendProcess.stdout.on('data', (data) => {
      const output = data.toString();
      if (output.includes('Ready in') || output.includes('Local:')) {
        colorLog('✅ Frontend Next.js iniciado correctamente', 'green');
        
        // Extraer el puerto del output
        const portMatch = output.match(/localhost:(\d+)/);
        if (portMatch) {
          const port = portMatch[1];
          colorLog(`🌐 Frontend disponible en: http://localhost:${port}`, 'cyan');
        }
        
        resolve(frontendProcess);
      }
      // Mostrar output del frontend con prefijo
      process.stdout.write(`${colors.cyan}[Next.js]${colors.reset} ${output}`);
    });
    
    frontendProcess.stderr.on('data', (data) => {
      process.stderr.write(`${colors.red}[Next.js Error]${colors.reset} ${data}`);
    });
    
    frontendProcess.on('error', (error) => {
      colorLog(`❌ Error iniciando frontend: ${error.message}`, 'red');
      reject(error);
    });
  });
}

async function main() {
  try {
    showBanner();
    
    // Iniciar backend primero
    const backendProcess = await startBackend();
    
    // Esperar un poco antes de iniciar el frontend
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Iniciar frontend
    const frontendProcess = await startFrontend();
    
    colorLog('\n🎉 ¡APLICACIÓN INICIADA CORRECTAMENTE!', 'green');
    colorLog('\n📱 ACCEDE A LA APLICACIÓN:', 'yellow');
    colorLog('   🌐 Frontend: http://localhost:3000', 'cyan');
    colorLog('   🔧 Backend:  http://127.0.0.1:8000', 'blue');
    
    colorLog('\n💡 Para detener la aplicación, presiona Ctrl+C', 'yellow');
    
    // Manejar cierre graceful
    process.on('SIGINT', () => {
      colorLog('\n🛑 Deteniendo servicios...', 'yellow');
      backendProcess.kill();
      frontendProcess.kill();
      process.exit(0);
    });
    
  } catch (error) {
    colorLog(`❌ Error: ${error.message}`, 'red');
    process.exit(1);
  }
}

main();