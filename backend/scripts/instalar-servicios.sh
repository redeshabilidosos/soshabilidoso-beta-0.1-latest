#!/bin/bash
# Script para instalar y configurar servicios de producción

echo "🚀 Instalando servicios de producción..."
echo ""

# Copiar archivos de servicio
echo "📋 Copiando archivos de servicio systemd..."
cp /var/www/soshabilidoso/backend/scripts/gunicorn.service /etc/systemd/system/
cp /var/www/soshabilidoso/backend/scripts/daphne.service /etc/systemd/system/

# Recargar systemd
echo "🔄 Recargando systemd..."
systemctl daemon-reload

# Habilitar servicios
echo "✅ Habilitando servicios..."
systemctl enable gunicorn
systemctl enable daphne

# Iniciar servicios
echo "▶️  Iniciando servicios..."
systemctl start gunicorn
systemctl start daphne

# Verificar estado
echo ""
echo "📊 Estado de servicios:"
systemctl status gunicorn --no-pager
echo ""
systemctl status daphne --no-pager

# Instalar Nginx si no está instalado
echo ""
echo "📦 Verificando Nginx..."
if ! command -v nginx &> /dev/null; then
    echo "Instalando Nginx..."
    apt update
    apt install -y nginx
fi

# Copiar configuración de Nginx
echo "📋 Configurando Nginx..."
cp /var/www/soshabilidoso/backend/scripts/nginx-soshabilidoso.conf /etc/nginx/sites-available/soshabilidoso
ln -sf /etc/nginx/sites-available/soshabilidoso /etc/nginx/sites-enabled/

# Eliminar configuración por defecto
rm -f /etc/nginx/sites-enabled/default

# Probar configuración de Nginx
echo "🧪 Probando configuración de Nginx..."
nginx -t

# Reiniciar Nginx
echo "🔄 Reiniciando Nginx..."
systemctl restart nginx
systemctl enable nginx

echo ""
echo "🎉 ¡Instalación completada!"
echo ""
echo "📝 Comandos útiles:"
echo "   Ver logs de Gunicorn: journalctl -u gunicorn -f"
echo "   Ver logs de Daphne: journalctl -u daphne -f"
echo "   Ver logs de Nginx: tail -f /var/log/nginx/soshabilidoso_error.log"
echo "   Reiniciar servicios: systemctl restart gunicorn daphne nginx"
echo ""
