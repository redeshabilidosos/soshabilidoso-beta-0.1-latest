#!/bin/bash
# Script de despliegue para Ubuntu VPS
# Detecta versión de Ubuntu y ajusta dependencias

set -e  # Salir si hay error

echo "========================================"
echo "DESPLIEGUE EN UBUNTU VPS"
echo "========================================"
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Detectar versión de Ubuntu
echo -e "${YELLOW}[1/10] Detectando versión de Ubuntu...${NC}"
UBUNTU_VERSION=$(lsb_release -rs)
echo "Ubuntu $UBUNTU_VERSION detectado"
echo ""

# Verificar versión de Node.js
echo -e "${YELLOW}[2/10] Verificando Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js no está instalado${NC}"
    echo "Instalando Node.js 18..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

NODE_VERSION=$(node -v)
echo "Node.js $NODE_VERSION"
NPM_VERSION=$(npm -v)
echo "npm $NPM_VERSION"
echo ""

# Ir al directorio del proyecto
cd /var/www/soshabilidoso

# Detener PM2
echo -e "${YELLOW}[3/10] Deteniendo PM2...${NC}"
pm2 stop all || true
echo ""

# Actualizar código desde GitHub
echo -e "${YELLOW}[4/10] Actualizando código desde GitHub...${NC}"
git fetch origin main
git reset --hard origin/main
git clean -fdx
echo -e "${GREEN}✓ Código actualizado${NC}"
echo ""

# Verificar .env.local
echo -e "${YELLOW}[5/10] Verificando .env.local...${NC}"
if [ ! -f .env.local ]; then
    echo -e "${RED}ERROR: .env.local no existe${NC}"
    echo "Creando .env.local con configuración de producción..."
    cat > .env.local << 'EOF'
# Configuración de Producción - SOS Habilidoso
NEXT_PUBLIC_API_URL=https://www.soshabilidoso.com/api
NEXT_PUBLIC_WS_URL=wss://www.soshabilidoso.com/ws
NEXT_PUBLIC_APP_URL=https://www.soshabilidoso.com
NODE_ENV=production
PORT=3000
NEXT_TELEMETRY_DISABLED=1
ANALYZE=false
NODE_OPTIONS=--max-old-space-size=4096
NEXT_PRIVATE_STANDALONE=true
NEXT_PRIVATE_SKIP_VALIDATION=true
NEXT_PRIVATE_DEBUG_CACHE=false
EOF
fi
echo -e "${GREEN}✓ .env.local existe${NC}"
echo ""

# Limpiar archivos antiguos
echo -e "${YELLOW}[6/10] Limpiando archivos antiguos...${NC}"
rm -rf .next node_modules package-lock.json .cache
echo -e "${GREEN}✓ Limpieza completada${NC}"
echo ""

# Limpiar cache de npm
echo -e "${YELLOW}[7/10] Limpiando cache de npm...${NC}"
npm cache clean --force
echo ""

# Instalar dependencias
echo -e "${YELLOW}[8/10] Instalando dependencias (2-3 minutos)...${NC}"
# Usar --legacy-peer-deps para evitar conflictos de dependencias
npm install --legacy-peer-deps --loglevel=error
echo -e "${GREEN}✓ Dependencias instaladas${NC}"
echo ""

# Construir aplicación
echo -e "${YELLOW}[9/10] Construyendo aplicación (3-5 minutos)...${NC}"
# Aumentar memoria para el build
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Build completado exitosamente${NC}"
else
    echo -e "${RED}✗ Build falló${NC}"
    echo ""
    echo "Intentando build con configuración alternativa..."
    # Desactivar optimizaciones si falla
    export NEXT_TELEMETRY_DISABLED=1
    npm run build
fi
echo ""

# Reiniciar PM2
echo -e "${YELLOW}[10/10] Reiniciando PM2...${NC}"
pm2 restart all --update-env
sleep 3
echo ""

# Verificar estado
echo -e "${YELLOW}Verificando estado...${NC}"
pm2 status
echo ""

# Verificar respuesta HTTP
echo -e "${YELLOW}Verificando respuesta HTTP...${NC}"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)

if [ "$HTTP_STATUS" = "200" ]; then
    echo -e "${GREEN}✓ Aplicación respondiendo correctamente (HTTP $HTTP_STATUS)${NC}"
else
    echo -e "${RED}✗ Aplicación con error (HTTP $HTTP_STATUS)${NC}"
    echo ""
    echo "Mostrando logs de PM2:"
    pm2 logs soshabilidoso-frontend --lines 30 --nostream
fi

echo ""
echo "========================================"
echo "DESPLIEGUE COMPLETADO"
echo "========================================"
echo ""
echo "Prueba en tu navegador: https://www.soshabilidoso.com"
echo ""
