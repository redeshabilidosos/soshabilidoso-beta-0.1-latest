# 🚀 Instrucciones de Prueba PWA - SOS-HABILIDOSO

## ✅ VERIFICACIÓN COMPLETADA

Todos los archivos PWA están correctamente configurados:
- ✅ manifest.json existe
- ✅ start_url: /login
- ✅ index.html con referencias correctas
- ✅ landing-script.js con funcionalidad PWA
- ✅ Todos los iconos presentes
- ✅ Service worker configurado

## 📋 CONFIGURACIÓN ACTUAL

### Dominio Principal
```
www.soshabilidoso.com → index.html (Landing Page)
```

### PWA Instalada
```
App instalada → /login (Página de autenticación)
```

### Botones de Instalación
1. **Header**: "Descargar App" (izquierda del botón Login)
2. **Footer**: "Disponible en Android" (botón verde)
3. **Footer**: "Disponible en iOS" (botón azul)
4. **Navegador**: Botón de instalación en la barra de direcciones

## 🧪 PRUEBA EN LOCALHOST

### Paso 1: Iniciar el Servidor
```bash
npm run dev
```

### Paso 2: Abrir en Navegador
```
http://localhost:4000/index.html
```

### Paso 3: Probar Instalación

#### Opción A: Botón del Header
1. Busca el botón "Descargar App" en el header (izquierda del Login)
2. Haz clic en el botón
3. Aparecerá el prompt de instalación
4. Acepta la instalación
5. La app se instalará en tu dispositivo

#### Opción B: Botones del Footer
1. Desplázate hasta antes del footer
2. Verás dos botones grandes:
   - "Disponible en Android" (verde)
   - "Disponible en iOS" (azul)
3. Haz clic en cualquiera
4. Aparecerá el prompt de instalación
5. Acepta la instalación

#### Opción C: Barra del Navegador (Chrome/Edge)
1. Busca el icono de instalación en la barra de direcciones (⊕)
2. Haz clic en el icono
3. Acepta la instalación

### Paso 4: Verificar Instalación
1. Busca el icono de "SOS Habilidoso" en:
   - **Windows**: Menú Inicio o Escritorio
   - **Android**: Pantalla de inicio
   - **iOS**: Pantalla de inicio
2. Abre la app instalada
3. **IMPORTANTE**: La app debe abrir directamente en `/login`
4. NO debe mostrar la landing page (index.html)

## 🌐 PRUEBA EN PRODUCCIÓN (VPS)

### Requisitos Previos
- VPS configurado en 76.13.122.81
- Dominio apuntando a www.soshabilidoso.com
- HTTPS configurado (requerido para PWA)

### Paso 1: Desplegar Archivos
```bash
# En tu máquina local
git add .
git commit -m "PWA: Configuración completa con botones de instalación"
git push origin main

# En el VPS
ssh usuario@76.13.122.81
cd /var/www/soshabilidoso
git pull origin main
```

### Paso 2: Verificar Archivos
```bash
# Verificar manifest
cat public/manifest.json | grep start_url
# Debe mostrar: "start_url": "/login"

# Verificar index.html
grep "manifest.json" public/index.html
grep "landing-script.js" public/index.html

# Verificar iconos
ls -la public/icon512_rounded.png
ls -la public/icon512_maskable.png
ls -la public/logo-favicon.png
ls -la public/apple-touch-icon.png
```

### Paso 3: Configurar Nginx
```nginx
# /etc/nginx/sites-available/soshabilidoso

server {
    listen 443 ssl http2;
    server_name www.soshabilidoso.com soshabilidoso.com;

    # Certificados SSL
    ssl_certificate /etc/letsencrypt/live/soshabilidoso.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/soshabilidoso.com/privkey.pem;

    # Raíz del sitio
    root /var/www/soshabilidoso/public;
    index index.html;

    # Manifest con tipo MIME correcto
    location /manifest.json {
        add_header Content-Type application/manifest+json;
        add_header Cache-Control "public, max-age=604800";
    }

    # Service Worker
    location /sw.js {
        add_header Content-Type application/javascript;
        add_header Cache-Control "no-cache";
    }

    # Iconos PWA
    location ~* \.(png|ico)$ {
        add_header Cache-Control "public, max-age=2592000";
    }

    # Archivos estáticos
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API Backend
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Paso 4: Reiniciar Servicios
```bash
sudo nginx -t
sudo systemctl restart nginx
```

### Paso 5: Probar en Producción
1. Abre Chrome o Edge en tu móvil/PC
2. Ve a: https://www.soshabilidoso.com
3. Verás la landing page (index.html)
4. Haz clic en cualquier botón "Descargar App"
5. Acepta la instalación
6. Abre la app instalada
7. Debe abrir en `/login`

## 📱 PRUEBA EN DISPOSITIVOS MÓVILES

### Android (Chrome)
1. Abre Chrome en tu Android
2. Ve a: http://localhost:4000/index.html (o www.soshabilidoso.com)
3. Haz clic en "Descargar App"
4. Aparecerá: "Agregar SOS Habilidoso a la pantalla de inicio"
5. Toca "Agregar"
6. El icono aparecerá en tu pantalla de inicio
7. Abre la app → Debe abrir en `/login`

### iOS (Safari)
1. Abre Safari en tu iPhone/iPad
2. Ve a: http://localhost:4000/index.html (o www.soshabilidoso.com)
3. Haz clic en "Descargar App"
4. Aparecerá un modal con instrucciones:
   - Paso 1: Toca el botón compartir (⬆️)
   - Paso 2: Selecciona "Agregar a pantalla de inicio"
   - Paso 3: Toca "Agregar"
5. El icono aparecerá en tu pantalla de inicio
6. Abre la app → Debe abrir en `/login`

### Desktop (Chrome/Edge)
1. Abre Chrome o Edge en tu PC
2. Ve a: http://localhost:4000/index.html (o www.soshabilidoso.com)
3. Haz clic en "Descargar App" o en el icono ⊕ de la barra
4. Aparecerá: "Instalar SOS Habilidoso"
5. Haz clic en "Instalar"
6. La app se abrirá en una ventana independiente
7. Debe abrir en `/login`

## 🔍 DEBUGGING

### Consola del Navegador
Abre DevTools (F12) y verifica estos logs:
```javascript
PWA: Installation script loaded
PWA: Install buttons: { header: button, android: button, ios: button }
PWA: Is standalone: false
PWA: beforeinstallprompt event fired
PWA: Install button clicked from header/android/ios
PWA: User response: accepted
PWA: App installed successfully
```

### Chrome DevTools - Application Tab
1. Abre DevTools (F12)
2. Ve a la pestaña "Application"
3. Sección "Manifest":
   - Verifica que `start_url` sea `/login`
   - Verifica que los iconos se carguen correctamente
4. Sección "Service Workers":
   - Verifica que el SW esté activo
5. Botón "Install": Prueba instalación manual

### Verificar App Instalada
```bash
# Windows
# Busca en: C:\Users\[TuUsuario]\AppData\Local\Google\Chrome\User Data\Default\Web Applications

# Android
# Configuración → Apps → SOS Habilidoso

# iOS
# Pantalla de inicio → Mantén presionado el icono → Información de la app
```

## ❌ SOLUCIÓN DE PROBLEMAS

### Problema: Botones no funcionan
**Causa**: Script no cargado
**Solución**:
```bash
# Verificar que landing-script.js esté cargado
grep "landing-script.js" public/index.html
```

### Problema: App abre en index.html en vez de /login
**Causa**: start_url incorrecto
**Solución**:
```bash
# Verificar manifest.json
cat public/manifest.json | grep start_url
# Debe mostrar: "start_url": "/login"
```

### Problema: Prompt de instalación no aparece
**Causa**: PWA ya instalada o navegador no compatible
**Solución**:
1. Desinstala la app si ya está instalada
2. Limpia caché del navegador
3. Recarga la página (Ctrl+Shift+R)
4. Usa Chrome o Edge (navegadores compatibles)

### Problema: Iconos no aparecen
**Causa**: Archivos de iconos faltantes
**Solución**:
```bash
# Verificar que existan
ls -la public/icon512_rounded.png
ls -la public/icon512_maskable.png
ls -la public/logo-favicon.png
ls -la public/apple-touch-icon.png
```

### Problema: Service Worker no se registra
**Causa**: HTTPS requerido en producción
**Solución**:
- En localhost: Funciona con HTTP
- En producción: Requiere HTTPS obligatoriamente

## ✅ CHECKLIST DE VERIFICACIÓN

Antes de desplegar a producción, verifica:

- [ ] `manifest.json` tiene `start_url: "/login"`
- [ ] `index.html` tiene referencia a `manifest.json`
- [ ] `index.html` carga `landing-script.js`
- [ ] Los 3 botones están visibles en index.html
- [ ] Todos los iconos PWA existen
- [ ] Service worker está configurado
- [ ] HTTPS configurado en producción
- [ ] Nginx sirve manifest.json con tipo MIME correcto
- [ ] Probado en Chrome/Edge
- [ ] Probado en Android
- [ ] Probado en iOS (si aplica)
- [ ] App instalada abre en `/login`

## 📞 SOPORTE

Si encuentras problemas:
1. Ejecuta: `verificar-pwa.bat`
2. Revisa los logs en la consola del navegador
3. Verifica que el servidor esté corriendo
4. Asegúrate de usar HTTPS en producción

## 🎉 RESULTADO ESPERADO

### Flujo Completo Exitoso:
1. ✅ Usuario visita www.soshabilidoso.com
2. ✅ Ve la landing page (index.html) con información del proyecto
3. ✅ Ve los botones "Descargar App" claramente visibles
4. ✅ Hace clic en cualquier botón
5. ✅ Aparece prompt de instalación nativo
6. ✅ Acepta la instalación
7. ✅ App se instala en el dispositivo
8. ✅ Icono aparece en pantalla de inicio/escritorio
9. ✅ Abre la app instalada
10. ✅ **App inicia directamente en `/login`** ← CRÍTICO
11. ✅ Usuario puede iniciar sesión o registrarse
12. ✅ App funciona como aplicación nativa

¡Listo para probar! 🚀
