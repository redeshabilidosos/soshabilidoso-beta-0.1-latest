# Botones de Instalación PWA - SOS-HABILIDOSO

## Descripción

Se han agregado 3 botones de instalación PWA (Progressive Web App) en la landing page (`localhost:4000/index.html`):

1. **Botón en el Header**: "Descargar App" - Ubicado a la izquierda del botón Login
2. **Botón Android**: En la sección de descarga antes del footer
3. **Botón iOS**: En la sección de descarga antes del footer

## ⚠️ IMPORTANTE: Configuración de URLs

### Landing Page (index.html)
- **URL**: `www.soshabilidoso.com` o `localhost:4000/index.html`
- **Propósito**: Página de presentación con botones de instalación

### PWA Instalada
- **Start URL**: `/login`
- **Comportamiento**: Al instalar la PWA, la app abre directamente en `/login`
- **Razón**: Los usuarios que instalan la app quieren usarla directamente, no ver la landing page

### Flujo:
1. Usuario visita `www.soshabilidoso.com` → Ve `index.html`
2. Usuario hace clic en "Descargar App" → Instala PWA
3. Usuario abre app instalada → Inicia en `/login`

## Ubicaciones

### 1. Header (Navbar)
El botón "Descargar App" aparece en el header, justo donde marcaste con el "1", a la izquierda del botón de Login.

### 2. Sección de Descarga (Antes del Footer)
Dos botones grandes estilo tienda de apps:
- **Disponible en Android** (con icono de Android verde)
- **Disponible en iOS** (con icono de Apple azul)

## Características

### Diseño Visual

#### Botón del Header:
- **Estilo**: Gradiente verde-azul con efecto neón
- **Icono**: Ícono de descarga animado (rebote)
- **Texto**: "Descargar App" (se oculta en móviles, solo muestra icono)
- **Hover**: Elevación y sombra brillante

#### Botones de Tienda:
- **Estilo**: Botones grandes estilo App Store/Play Store
- **Iconos**: Android (verde) e iOS (azul)
- **Texto**: "Disponible en Android/iOS"
- **Hover**: Elevación, borde de color y sombra brillante
- **Responsive**: Se apilan verticalmente en móviles

### Comportamiento Inteligente

1. **Detección Automática del Sistema**:
   - Detecta si es Android, iOS o Desktop
   - Muestra instrucciones específicas según el dispositivo

2. **Para Android/Desktop (Chrome, Edge)**:
   - Muestra el prompt nativo del navegador
   - Instalación directa con un clic

3. **Para iOS (Safari)**:
   - Muestra modal con instrucciones paso a paso
   - Explica cómo agregar a pantalla de inicio
   - Incluye iconos visuales para cada paso

4. **Si ya está instalada**:
   - Muestra notificación informativa
   - No permite reinstalar

### Notificaciones

- **Éxito**: Notificación verde con animación
- **Info**: Notificación azul para instrucciones
- **Advertencia**: Notificación naranja para incompatibilidades
- **Auto-cierre**: Desaparecen después de 5 segundos

## Archivos Modificados

### 1. `public/index.html`

**Botón en Header**:
```html
<button class="btn-download-app" id="btn-download-app-header">
    <i class="fas fa-download"></i>
    <span>Descargar App</span>
</button>
```

**Sección de Descarga**:
```html
<section class="download-apps">
    <div class="container">
        <div class="download-content">
            <div class="download-text">
                <h2 class="download-title">Descarga la App</h2>
                <p class="download-subtitle">Disponible para todos tus dispositivos</p>
            </div>
            <div class="download-buttons">
                <button class="btn-store android" id="btn-download-android">
                    <!-- Botón Android -->
                </button>
                <button class="btn-store ios" id="btn-download-ios">
                    <!-- Botón iOS -->
                </button>
            </div>
        </div>
    </div>
</section>
```

### 2. `public/landing-styles.css`

**Estilos del botón del header**:
- Gradiente verde-azul
- Animación de rebote en el icono
- Responsive: solo icono en móviles

**Estilos de la sección de descarga**:
- Layout flex con texto e imágenes
- Botones estilo tienda de apps
- Iconos grandes de Android e iOS
- Efectos hover con colores específicos
- Responsive: columna en móviles

**Estilos responsive**:
- Botón header: solo icono en móviles
- Sección descarga: columna vertical en móviles
- Botones tienda: ancho completo en móviles

### 3. `public/landing-script.js`

**Funcionalidad completa**:
- Detección de `beforeinstallprompt`
- Manejo de 3 botones diferentes
- Detección del sistema operativo
- Modal de instrucciones para iOS
- Notificaciones personalizadas
- Logs de debugging

## Compatibilidad

### Android:
✅ Chrome, Edge, Samsung Internet, Firefox
- Instalación directa con prompt nativo
- Funciona en todos los botones

### iOS:
✅ Safari (iOS 16.4+)
- Modal con instrucciones paso a paso
- Instalación manual desde menú compartir

### Desktop:
✅ Chrome, Edge, Opera
- Instalación directa con prompt nativo
- Funciona como app de escritorio

## Flujo de Instalación

### Android/Desktop:
1. Usuario hace clic en cualquier botón
2. Aparece prompt nativo del navegador
3. Usuario acepta
4. Notificación de éxito
5. App instalada

### iOS:
1. Usuario hace clic en cualquier botón
2. Aparece modal con instrucciones
3. Usuario sigue los pasos:
   - Toca botón compartir
   - Selecciona "Agregar a pantalla de inicio"
   - Toca "Agregar"
4. App instalada

## Pruebas

### En localhost:4000:

1. **Botón Header**:
   - Visible siempre en la parte superior
   - Texto "Descargar App" en desktop
   - Solo icono en móviles

2. **Botones de Tienda**:
   - Visibles antes del footer
   - Dos botones grandes lado a lado
   - Se apilan en móviles

3. **Funcionalidad**:
   - Hacer clic en cualquier botón
   - En Android/Desktop: prompt nativo
   - En iOS: modal con instrucciones
   - Notificación de éxito al instalar

## Debugging

Logs en consola:
```javascript
PWA: Installation script loaded
PWA: Install buttons: { header: button, android: button, ios: button }
PWA: Is standalone: false
PWA: Install button clicked from header/android/ios
PWA: User response: accepted/dismissed
PWA: App installed successfully
```

## Ventajas de esta Implementación

1. **3 Puntos de Entrada**: Header + 2 botones de tienda
2. **Diseño Profesional**: Botones estilo App Store/Play Store
3. **Instrucciones iOS**: Modal educativo para usuarios de iPhone
4. **Notificaciones**: Feedback visual claro
5. **Responsive**: Funciona perfecto en todos los dispositivos
6. **Detección Inteligente**: Adapta el comportamiento según el dispositivo

## Notas Importantes

- Los botones están **siempre visibles** (no se ocultan)
- Funcionan en **todos los navegadores compatibles**
- En iOS requiere **Safari** y **iOS 16.4+**
- Las instrucciones de iOS son **claras y visuales**
- Las notificaciones se **auto-cierran** después de 5 segundos

## Próximos Pasos

✅ Botón en header agregado
✅ Botones de tienda agregados
✅ Modal de instrucciones iOS
✅ Notificaciones personalizadas
✅ Responsive completo
⏳ Agregar iconos de preview de la app (opcional)
⏳ Agregar screenshots en la sección de descarga (opcional)
