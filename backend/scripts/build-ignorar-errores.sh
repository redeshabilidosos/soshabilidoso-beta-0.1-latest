#!/bin/bash

echo "========================================"
echo "BUILD RÁPIDO - IGNORANDO ERRORES TS"
echo "========================================"
echo ""
echo "ADVERTENCIA: Este build ignora errores de TypeScript"
echo "Solo usar para despliegue de emergencia"
echo ""

# Ir al directorio del proyecto
cd /var/www/soshabilidoso

# Hacer backup del config original
cp next.config.js next.config.js.backup

# Crear config temporal que ignora errores
cat > next.config.temp.js << 'EOF'
/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig = {
  // IGNORAR ERRORES TEMPORALMENTE
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  reactStrictMode: false,
  swcMinify: true,
  
  images: {
    unoptimized: true,
    domains: ['images.pexels.com', 'localhost', '127.0.0.1', 'ui-avatars.com'],
  },
  
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  experimental: {
    optimizeCss: true,
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

module.exports = withPWA(nextConfig);
EOF

# Usar el config temporal
mv next.config.js next.config.js.original
mv next.config.temp.js next.config.js

# Detener el frontend
echo "Deteniendo frontend..."
pm2 stop soshabilidoso-frontend

# Hacer el build
echo ""
echo "Construyendo aplicación (esto tomará varios minutos)..."
npm run build

BUILD_SUCCESS=$?

# Restaurar el config original
mv next.config.js.original next.config.js
rm -f next.config.js.backup

if [ $BUILD_SUCCESS -eq 0 ] && [ -f ".next/BUILD_ID" ]; then
    echo ""
    echo "✅ BUILD COMPLETADO EXITOSAMENTE"
    echo ""
    echo "Reiniciando frontend..."
    pm2 restart soshabilidoso-frontend
    sleep 3
    pm2 status
    echo ""
    echo "Frontend reiniciado. Verifica en: http://76.13.122.81/"
else
    echo ""
    echo "❌ BUILD FALLÓ"
    echo "Revisa los errores arriba"
    exit 1
fi
