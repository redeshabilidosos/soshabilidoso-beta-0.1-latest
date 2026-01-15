#!/usr/bin/env node
/**
 * Script para verificar que todas las rutas de navegación existan
 */
const fs = require('fs');
const path = require('path');

const routes = [
  { name: 'Inicio', path: 'app/feed/page.tsx' },
  { name: 'Perfil', path: 'app/profile/page.tsx' },
  { name: 'Usuarios', path: 'app/users/page.tsx' },
  { name: 'Notificaciones', path: 'app/notifications/page.tsx' },
  { name: 'Galería', path: 'app/gallery/page.tsx' },
  { name: 'Amigos', path: 'app/friends/page.tsx' },
  { name: 'Comunidades', path: 'app/communities/page.tsx' },
  { name: 'Clasificados', path: 'app/classifieds/page.tsx' },
  { name: 'Habil News', path: 'app/habil-news/page.tsx' },
  { name: 'Mensajes', path: 'app/messages/page.tsx' },
  { name: 'Configuración', path: 'app/settings/page.tsx' }
];

console.log('🔍 Verificando rutas de navegación...');
console.log('=' * 50);

let existingRoutes = 0;
let missingRoutes = [];

routes.forEach(route => {
  const fullPath = path.join(__dirname, route.path);
  
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${route.name}: ${route.path}`);
    existingRoutes++;
  } else {
    console.log(`❌ ${route.name}: ${route.path} - NO EXISTE`);
    missingRoutes.push(route);
  }
});

console.log('\n' + '=' * 50);
console.log(`📊 Resumen: ${existingRoutes}/${routes.length} rutas existen`);

if (missingRoutes.length > 0) {
  console.log('\n🔧 Rutas faltantes:');
  missingRoutes.forEach(route => {
    console.log(`   - ${route.name}: ${route.path}`);
  });
  
  console.log('\n💡 Sugerencias:');
  console.log('1. Crea las páginas faltantes');
  console.log('2. O actualiza la navegación para remover enlaces rotos');
} else {
  console.log('\n🎉 ¡Todas las rutas existen!');
}

console.log('\n✅ Verificación completada');