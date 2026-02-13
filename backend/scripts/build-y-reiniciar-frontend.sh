#!/bin/bash

# Script para hacer build del frontend y reiniciarlo en producción
# Ejecutar desde: /var/www/soshabilidoso

echo "=========================================="
echo "BUILD Y REINICIO DEL FRONTEND"
echo "=========================================="
echo ""

# Detener el frontend actual
echo "1. Deteniendo frontend..."
pm2 stop soshabilidoso-frontend

# Hacer el build
echo ""
echo "2. Construyendo aplicación Next.js..."
echo "   (Esto puede tomar varios minutos)"
npm run build

# Verificar que el build se completó
if [ ! -f ".next/BUILD_ID" ]; then
    echo ""
    echo "❌ ERROR: El build falló. No se encontró .next/BUILD_ID"
    echo "   Revisa los errores arriba."
    exit 1
fi

echo ""
echo "✅ Build completado exitosamente"

# Reiniciar el frontend
echo ""
echo "3. Reiniciando frontend con PM2..."
pm2 restart soshabilidoso-frontend

# Esperar un momento
sleep 3

# Ver el estado
echo ""
echo "4. Estado actual:"
pm2 status

echo ""
echo "5. Últimos logs (presiona Ctrl+C para salir):"
pm2 logs soshabilidoso-frontend --lines 20
