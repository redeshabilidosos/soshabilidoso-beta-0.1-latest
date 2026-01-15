#!/bin/bash

# Script para instalar dependencias necesarias para la integración

echo "🚀 Instalando dependencias para la integración backend-frontend..."

# Instalar axios para peticiones HTTP
npm install axios

# Instalar tipos de axios
npm install -D @types/axios

echo "✅ Dependencias instaladas correctamente!"
echo ""
echo "📋 Dependencias agregadas:"
echo "- axios: Cliente HTTP para conectar con el backend"
echo "- @types/axios: Tipos TypeScript para axios"
echo ""
echo "🔧 Próximos pasos:"
echo "1. Asegúrate de que el backend esté ejecutándose en http://localhost:8000"
echo "2. Ejecuta 'npm run dev' para iniciar el frontend"
echo "3. La integración estará completa y funcional"