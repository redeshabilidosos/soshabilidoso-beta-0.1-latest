#!/bin/bash

# Script de configuración inicial completa
# Ejecutar con: ./setup-project.sh

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${GREEN}🚀 Configuración inicial de SOS-HABILIDOSO${NC}"
echo -e "${GREEN}===========================================${NC}"

# 1. Instalar dependencias de Node.js
echo -e "${BLUE}📦 Instalando dependencias de Node.js...${NC}"
npm install concurrently axios @types/axios

# 2. Configurar backend
echo -e "${BLUE}🐍 Configurando backend Django...${NC}"
cd backend

# Crear entorno virtual si no existe
if [ ! -d "venv" ]; then
    echo -e "${CYAN}Creando entorno virtual...${NC}"
    python -m venv venv
fi

# Activar entorno virtual
source venv/bin/activate

# Instalar dependencias de Python
echo -e "${CYAN}Instalando dependencias de Python...${NC}"
pip install -r requirements/development.txt

# Configurar base de datos
echo -e "${CYAN}Configurando base de datos...${NC}"
python setup_auth.py
python setup_posts.py
python setup_chat.py

cd ..

echo ""
echo -e "${GREEN}✅ ¡Configuración completada!${NC}"
echo ""
echo -e "${YELLOW}🚀 Para ejecutar el proyecto:${NC}"
echo -e "${CYAN}   Opción 1: npm run dev:both${NC}"
echo -e "${CYAN}   Opción 2: ./start-dev.sh${NC}"
echo -e "${CYAN}   Opción 3: .\\start-dev.ps1 (Windows)${NC}"
echo ""
echo -e "${YELLOW}📱 URLs importantes:${NC}"
echo -e "${CYAN}   Frontend: http://localhost:3000${NC}"
echo -e "${CYAN}   Backend API: http://localhost:8000/api/docs/${NC}"
echo -e "${CYAN}   Admin: http://localhost:8000/admin/${NC}"