#!/usr/bin/env node

/**
 * Script para iniciar SOS-HABILIDOSO completo
 * - Frontend (Next.js en puerto 4000)
 * - Backend (Django en puerto 8000)
 * - Base de datos MySQL (puerto 3307)
 */

const { spawn } = require('child_process');
const os = require('os');

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
  magenta: '\x1b[35m'
};

// Banner de inicio
console.log('\n' + colors.cyan + colors.bright + '╔════════════════════════════════════════════════════════════╗' + colors.reset);
console.log(colors.cyan + colors.bright + '║                                                            ║' + colors.reset);
console.log(colors.cyan + colors.bright + '║' + colors.green + '              🚀 SOS-HABILIDOSO 🚀                      ' + colors.cyan + '║' + colors.reset);
console.log(colors.cyan + colors.bright + '║' + colors.green + '         La Red Social de las Habilidades               ' + colors.cyan + '║' + colors.reset);
console.log(colors.cyan + colors.bright + '║                                                            ║' + colors.reset);
console.log(colors.cyan + colors.bright + '╚════════════════════════════════════════════════════════════╝' + colors.reset);
console.log('');

// Función para imprimir con color
function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

// Verificar sistema operativo
const isWindows = os.platform() === 'win32';

log('📋 Iniciando servicios...', 'yellow');
log('', 'reset');

// 1. Verificar MySQL
log('[1/3] 🗄️  Verificando MySQL en puerto 3307...', 'cyan');

const mysqlCheck = spawn(isWindows ? 'cmd' : 'sh', 
  isWindows 
    ? ['/c', 'netstat -ano | findstr :3307'] 
    : ['-c', 'lsof -i :3307'],
  { shell: true }
);

mysqlCheck.on('close', (code) => {
  if (code === 0) {
    log('   ✓ MySQL está corriendo en puerto 3307', 'green');
    log('   ✓ Base de datos: habilidosos_clean', 'green');
    log('   ✓ Base de datos: habilidosos_db', 'green');
  } else {
    log('   ⚠️  MySQL no detectado en puerto 3307', 'yellow');
    log('   💡 Asegúrate de que MariaDB esté corriendo', 'yellow');
  }
  log('', 'reset');
  
  // 2. Iniciar Backend (Django con Daphne para WebSockets)
  log('[2/3] 🐍 Iniciando Backend Django con Daphne (ASGI)...', 'cyan');
  log('   Puerto: 8000', 'blue');
  log('   Base de datos: habilidosos_clean (MySQL)', 'blue');
  log('   WebSockets: ✅ Habilitados (Chat y Notificaciones en tiempo real)', 'green');
  log('', 'reset');
  
  const path = require('path');
  const backendDir = path.join(__dirname, '..', 'backend');
  
  let backend;
  
  if (isWindows) {
    // En Windows, usar Daphne para soporte de WebSockets
    const pythonPath = path.join(backendDir, 'venv312', 'Scripts', 'python.exe');
    backend = spawn(pythonPath, ['-m', 'daphne', '-b', '0.0.0.0', '-p', '8000', 'sos_habilidoso.asgi:application'], {
      cwd: backendDir,
      stdio: 'inherit'
    });
  } else {
    // En Unix/Linux/Mac
    const pythonPath = path.join(backendDir, 'venv312', 'bin', 'python');
    backend = spawn(pythonPath, ['-m', 'daphne', '-b', '0.0.0.0', '-p', '8000', 'sos_habilidoso.asgi:application'], {
      cwd: backendDir,
      stdio: 'inherit'
    });
  }
  
  // Esperar un poco antes de iniciar el frontend
  setTimeout(() => {
    // 3. Iniciar Frontend (Next.js)
    log('[3/3] ⚛️  Iniciando Frontend Next.js...', 'cyan');
    log('   Puerto: 4000', 'blue');
    log('', 'reset');
    
    const rootDir = path.join(__dirname, '..');
    const frontend = spawn('npx', ['next', 'dev', '-p', '4000'], {
      cwd: rootDir,
      stdio: 'inherit',
      shell: true
    });
    
    // Mostrar información después de 3 segundos
    setTimeout(() => {
      console.log('');
      log('╔════════════════════════════════════════════════════════════╗', 'green');
      log('║                                                            ║', 'green');
      log('║              ✅ SOS-HABILIDOSO INICIADO                    ║', 'green');
      log('║                                                            ║', 'green');
      log('╚════════════════════════════════════════════════════════════╝', 'green');
      console.log('');
      log('🌐 ACCESOS:', 'bright');
      console.log('');
      log('   Frontend (Next.js):', 'cyan');
      log('   → http://localhost:4000', 'blue');
      log('   → Landing: http://localhost:4000/landing.html', 'blue');
      console.log('');
      log('   Backend (Django + Daphne ASGI):', 'cyan');
      log('   → API: http://127.0.0.1:8000/api/', 'blue');
      log('   → Admin: http://127.0.0.1:8000/admin/', 'blue');
      log('   → WebSockets: ws://127.0.0.1:8000/ws/', 'green');
      log('   → Usuario: admin@test.com', 'yellow');
      log('   → Password: admin123', 'yellow');
      console.log('');
      log('   🔔 Notificaciones en tiempo real: ✅', 'green');
      log('   💬 Chat en tiempo real: ✅', 'green');
      log('   📡 Feed en tiempo real: ✅', 'green');
      console.log('');
      log('   Base de Datos (MySQL):', 'cyan');
      log('   → Puerto: 3307', 'blue');
      log('   → habilidosos_clean (Reality Show)', 'blue');
      log('   → habilidosos_db (Django)', 'blue');
      console.log('');
      log('📝 COMANDOS:', 'bright');
      log('   Ctrl+C para detener todos los servicios', 'yellow');
      console.log('');
      log('════════════════════════════════════════════════════════════', 'green');
      console.log('');
    }, 3000);
    
    // Manejar cierre
    const cleanup = () => {
      log('\n🛑 Deteniendo servicios...', 'yellow');
      backend.kill();
      frontend.kill();
      process.exit(0);
    };
    
    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
    
    frontend.on('close', (code) => {
      log('Frontend cerrado', 'red');
      backend.kill();
      process.exit(code);
    });
    
    backend.on('close', (code) => {
      log('Backend cerrado', 'red');
      frontend.kill();
      process.exit(code);
    });
    
  }, 2000);
});
