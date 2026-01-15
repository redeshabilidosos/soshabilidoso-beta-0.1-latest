#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Iniciando servidores de desarrollo...');
console.log('=' .repeat(50));

// Función para crear un proceso con colores
function createColoredProcess(command, args, color, name, cwd = process.cwd()) {
  const colors = {
    blue: '\x1b[34m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    reset: '\x1b[0m'
  };

  const proc = spawn(command, args, {
    cwd,
    stdio: 'pipe',
    shell: true
  });

  const prefix = `${colors[color]}[${name}]${colors.reset}`;

  proc.stdout.on('data', (data) => {
    const lines = data.toString().split('\n').filter(line => line.trim());
    lines.forEach(line => {
      console.log(`${prefix} ${line}`);
    });
  });

  proc.stderr.on('data', (data) => {
    const lines = data.toString().split('\n').filter(line => line.trim());
    lines.forEach(line => {
      console.log(`${prefix} ${colors.red}${line}${colors.reset}`);
    });
  });

  proc.on('close', (code) => {
    console.log(`${prefix} Proceso terminado con código ${code}`);
  });

  return proc;
}

// Iniciar Django
console.log('🐍 Iniciando Django backend...');
const djangoProcess = createColoredProcess(
  'python',
  ['manage.py', 'runserver', '8000'],
  'blue',
  '🐍Django',
  path.join(process.cwd(), 'backend')
);

// Esperar un poco antes de iniciar Next.js
setTimeout(() => {
  console.log('⚛️  Iniciando Next.js frontend...');
  const nextProcess = createColoredProcess(
    'npm',
    ['run', 'dev'],
    'green',
    '⚛️Next.js'
  );

  // Manejar Ctrl+C
  process.on('SIGINT', () => {
    console.log('\n🛑 Deteniendo servidores...');
    djangoProcess.kill('SIGTERM');
    nextProcess.kill('SIGTERM');
    
    setTimeout(() => {
      process.exit(0);
    }, 1000);
  });

  console.log('\n🌐 Servidores disponibles en:');
  console.log('   • Django API: http://localhost:8000');
  console.log('   • Next.js App: http://localhost:4000');
  console.log('\n📋 Credenciales de prueba:');
  console.log('   • Email: molo@molo.com');
  console.log('   • Password: molo123456');
  console.log('\n⌨️  Presiona Ctrl+C para detener ambos servidores\n');

}, 2000);

// Manejar errores
djangoProcess.on('error', (err) => {
  console.error('❌ Error iniciando Django:', err.message);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Error no capturado:', err.message);
  process.exit(1);
});