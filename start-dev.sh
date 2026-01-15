#!/bin/bash

# Script para ejecutar Django y Next.js simultáneamente en Linux/Mac
# Hacer ejecutable: chmod +x start-dev.sh
# Ejecutar con: ./start-dev.sh

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Iniciando SOS-HABILIDOSO - Backend y Frontend${NC}"
echo -e "${GREEN}==================================================${NC}"

# Función para verificar si un puerto está en uso
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${YELLOW}⚠️  Puerto $1 ya está en uso${NC}"
        return 0
    else
        return 1
    fi
}

# Verificar puertos
check_port 8000 && echo -e "${YELLOW}   Django podría estar ejecutándose${NC}"
check_port 4000 && echo -e "${YELLOW}   Next.js podría estar ejecutándose${NC}"

echo ""
echo -e "${CYAN}📦 Verificando dependencias...${NC}"

# Verificar si existe el entorno virtual de Python
if [ ! -d "backend/venv" ]; then
    echo -e "${RED}❌ No se encontró el entorno virtual de Python${NC}"
    echo -e "${YELLOW}Ejecuta primero: cd backend && python -m venv venv${NC}"
    exit 1
fi

# Verificar si existen node_modules
if [ ! -d "node_modules" ]; then
    echo -e "${RED}❌ No se encontraron node_modules${NC}"
    echo -e "${YELLOW}Ejecuta primero: npm install${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Dependencias verificadas${NC}"
echo ""

# Función para limpiar procesos al salir
cleanup() {
    echo -e "\n${YELLOW}🛑 Deteniendo servidores...${NC}"
    kill $DJANGO_PID $NEXT_PID 2>/dev/null
    wait $DJANGO_PID $NEXT_PID 2>/dev/null
    echo -e "${GREEN}✅ Servidores detenidos${NC}"
    exit 0
}

# Registrar función de limpieza para Ctrl+C
trap cleanup SIGINT SIGTERM

# Iniciar Django en background
echo -e "${BLUE}🐍 Iniciando Django (Backend)...${NC}"
cd backend
source venv/bin/activate
python manage.py runserver 8000 > ../django.log 2>&1 &
DJANGO_PID=$!
cd ..

# Esperar un poco para que Django inicie
sleep 3

# Iniciar Next.js en background
echo -e "${BLUE}⚛️  Iniciando Next.js (Frontend)...${NC}"
npm run dev > next.log 2>&1 &
NEXT_PID=$!

# Esperar un poco más
sleep 2

echo ""
echo -e "${GREEN}🎉 ¡Servidores iniciados!${NC}"
echo -e "${CYAN}📱 Frontend: http://localhost:4000${NC}"
echo -e "${CYAN}🔧 Backend API: http://localhost:8000/api/${NC}"
echo -e "${CYAN}📚 Documentación: http://localhost:8000/api/docs/${NC}"
echo -e "${CYAN}⚙️  Admin: http://localhost:8000/admin/${NC}"
echo ""
echo -e "${YELLOW}💡 Presiona Ctrl+C para detener ambos servidores${NC}"
echo -e "${YELLOW}📋 Logs en tiempo real:${NC}"
echo ""

# Mostrar logs en tiempo real
tail -f django.log next.log &
TAIL_PID=$!

# Esperar indefinidamente (hasta Ctrl+C)
wait $DJANGO_PID $NEXT_PID

# Limpiar al salir
kill $TAIL_PID 2>/dev/null
cleanup