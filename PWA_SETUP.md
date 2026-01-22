# Configuración PWA - SOS Habilidoso

## ✅ Configuración Completada

Tu aplicación ahora es una **Progressive Web App (PWA)** completamente funcional.

## 📋 Características Implementadas

### 1. Service Worker
- ✅ Caché inteligente de recursos estáticos
- ✅ Caché de imágenes, fuentes y estilos
- ✅ Estrategias de caché optimizadas (CacheFirst, StaleWhileRevalidate, NetworkFirst)
- ✅ Soporte offline con página personalizada
- ✅ Actualización automática en segundo plano

### 2. Manifest
- ✅ Configuración completa del manifest.json
- ✅ Iconos en múltiples tamaños (192x192, 512x512)
- ✅ Iconos maskable para Android
- ✅ Shortcuts (accesos rápidos) a Feed, Comunidades y Perfil
- ✅ Tema personalizado (#00ff88)
- ✅ Modo standalone (sin barra del navegador)

### 3. Meta Tags
- ✅ Meta tags para iOS (apple-mobile-web-app)
- ✅ Meta tags para Android
- ✅ Open Graph para redes sociales
- ✅ Twitter Cards
- ✅ Theme color dinámico

### 4. Instalación
- ✅ Prompt de instalación personalizado
- ✅ Detección automática de instalación
- ✅ Botón "Instalar" que aparece después de 3 segundos
- ✅ Opción de "Ahora no" con persistencia

## 🚀 Cómo Probar la PWA

### En Desarrollo (localhost)

1. **Iniciar el servidor:**
   ```bash
   npm run dev
   ```

2. **Abrir en Chrome/Edge:**
   - Ve a `http://localhost:4000`
   - Abre DevTools (F12)
   - Ve a la pestaña "Application" > "Service Workers"
   - Verifica que el service worker esté registrado

3. **Probar instalación:**
   - Después de 3 segundos, aparecerá un prompt de instalación
   - O usa el menú del navegador: ⋮ > "Instalar SOS Habilidoso"

4. **Probar offline:**
   - En DevTools, ve a "Network" > marca "Offline"
   - Recarga la página
   - Deberías ver la página offline personalizada

### En Producción

1. **Build de producción:**
   ```bash
   npm run build
   npm start
   ```

2. **Requisitos para PWA:**
   - ✅ HTTPS (obligatorio en producción)
   - ✅ Service Worker registrado
   - ✅ Manifest válido
   - ✅ Iconos de al menos 192x192 y 512x512

3. **Verificar con Lighthouse:**
   - Abre DevTools > Lighthouse
   - Selecciona "Progressive Web App"
   - Ejecuta el análisis
   - Deberías obtener 90+ puntos

## 📱 Instalación en Dispositivos

### Android (Chrome)
1. Abre la app en Chrome
2. Toca el menú (⋮) > "Instalar app" o "Agregar a pantalla de inicio"
3. Confirma la instalación
4. La app aparecerá en tu cajón de aplicaciones

### iOS (Safari)
1. Abre la app en Safari
2. Toca el botón de compartir (□↑)
3. Selecciona "Agregar a pantalla de inicio"
4. Confirma el nombre y toca "Agregar"
5. La app aparecerá en tu pantalla de inicio

### Desktop (Chrome/Edge)
1. Abre la app en Chrome o Edge
2. Busca el ícono de instalación en la barra de direcciones
3. O usa el menú > "Instalar SOS Habilidoso"
4. La app se abrirá en su propia ventana

## 🔧 Archivos Importantes

```
public/
├── manifest.json          # Configuración de la PWA
├── offline.html          # Página offline personalizada
├── browserconfig.xml     # Configuración para Windows
├── robots.txt           # SEO
├── icon512_rounded.png  # Icono principal
├── icon512_maskable.png # Icono para Android
└── logo.png            # Icono 192x192

app/
├── layout.tsx          # Meta tags y viewport
└── RootLayoutClient.tsx # Componente de instalación

components/ui/
└── install-pwa-prompt.tsx # Prompt de instalación

next.config.js          # Configuración de next-pwa
```

## 🎨 Personalización

### Cambiar colores del tema:
```json
// public/manifest.json
{
  "theme_color": "#00ff88",      // Color de la barra de estado
  "background_color": "#000000"  // Color de fondo al iniciar
}
```

### Modificar shortcuts:
```json
// public/manifest.json
{
  "shortcuts": [
    {
      "name": "Nueva Sección",
      "url": "/nueva-seccion",
      "icons": [...]
    }
  ]
}
```

### Ajustar estrategias de caché:
```javascript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  // Modificar runtimeCaching aquí
});
```

## 🐛 Solución de Problemas

### El botón de instalación no aparece:
1. Verifica que estés en HTTPS (o localhost)
2. Asegúrate de que el manifest.json sea válido
3. Verifica que los iconos existan y sean del tamaño correcto
4. Limpia el caché del navegador
5. Revisa la consola de DevTools por errores

### El service worker no se registra:
1. Verifica que `next-pwa` esté instalado
2. Asegúrate de que `next.config.js` esté configurado correctamente
3. Haz un build de producción: `npm run build`
4. En desarrollo, el SW puede estar deshabilitado (es normal)

### La app no funciona offline:
1. Verifica que el service worker esté activo
2. Navega por la app para que se cacheen los recursos
3. Revisa la pestaña "Cache Storage" en DevTools
4. Asegúrate de que `offline.html` exista

### Lighthouse da puntuación baja:
1. Verifica que todos los iconos existan
2. Asegúrate de estar en HTTPS
3. Revisa que el manifest tenga `start_url` y `display`
4. Verifica que los meta tags estén presentes

## 📊 Métricas de Lighthouse

Objetivos para PWA:
- ✅ Installable: 100%
- ✅ PWA Optimized: 100%
- ✅ Fast and reliable: 90%+
- ✅ Works offline: Sí

## 🔄 Actualización de la PWA

Cuando hagas cambios:
1. Incrementa la versión en `package.json`
2. Haz un nuevo build: `npm run build`
3. El service worker se actualizará automáticamente
4. Los usuarios verán los cambios en la próxima visita

## 📝 Notas Importantes

- **Desarrollo**: El service worker está deshabilitado en modo desarrollo para facilitar el debugging
- **Producción**: El service worker solo funciona en HTTPS (excepto localhost)
- **Caché**: Los recursos se cachean automáticamente según las estrategias definidas
- **Offline**: La app muestra una página personalizada cuando no hay conexión
- **Instalación**: El prompt aparece automáticamente después de 3 segundos (se puede personalizar)

## 🎉 ¡Listo!

Tu app ahora es una PWA completa que puede:
- ✅ Instalarse en cualquier dispositivo
- ✅ Funcionar offline
- ✅ Recibir notificaciones (si se implementa)
- ✅ Actualizarse automáticamente
- ✅ Ofrecer una experiencia nativa

Para más información sobre PWAs, visita:
- [web.dev/progressive-web-apps](https://web.dev/progressive-web-apps/)
- [MDN PWA Guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
