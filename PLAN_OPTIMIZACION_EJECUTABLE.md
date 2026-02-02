# Plan de Optimización Ejecutable - SOS Habilidoso

**Fecha:** 28 de Enero de 2026  
**Objetivo:** Reducir tiempo de carga a < 2 segundos  
**Estado:** Listo para ejecutar

---

## 🚀 FASE 1: LIMPIEZA INMEDIATA (EJECUTAR AHORA)

### Tiempo Estimado: 30 minutos
### Impacto: Alto - Reducción de ~40 MB
### Riesgo: Bajo - Sin afectar funcionalidad

---

### PASO 1: Desinstalar Dependencias No Usadas

```bash
# Ejecutar estos comandos en orden:

# 1. FontAwesome (no se usa, se usa lucide-react)
npm uninstall @fortawesome/fontawesome-svg-core @fortawesome/free-brands-svg-icons @fortawesome/free-solid-svg-icons

# 2. Librerías de virtualización no usadas
npm uninstall react-virtualized-auto-sizer react-window

# 3. Critters (no se usa)
npm uninstall critters

# 4. Types redundantes
npm uninstall @types/axios

# 5. Reinstalar para limpiar package-lock.json
npm install
```

**Verificación:**
```bash
# Verificar que la app sigue funcionando
npm run dev
# Abrir http://localhost:4000 y probar navegación
```

---

### PASO 2: Eliminar Archivos Duplicados

```bash
# Crear carpeta de backup primero
mkdir -p .backup/obsolete-files

# Mover archivos duplicados de communities
move app\communities\page-broken.tsx .backup\obsolete-files\
move app\communities\page-complex.tsx .backup\obsolete-files\
move app\communities\page-new.tsx .backup\obsolete-files\
move app\communities\[id]\page-fixed.tsx .backup\obsolete-files\
move app\communities\[id]\page-test.tsx .backup\obsolete-files\

# Mover componente duplicado
move components\ui\post-card-improved.tsx .backup\obsolete-files\
```

**Verificación:**
```bash
# Verificar que no hay errores de compilación
npm run build
```

---

### PASO 3: Organizar Archivos de Prueba

```bash
# Crear carpeta de tests
mkdir -p tests\html
mkdir -p tests\python
mkdir -p tests\javascript

# Mover archivos HTML de prueba
move create-admin-user.html tests\html\
move invalidate-menu-cache.html tests\html\
move simple-cover-test.html tests\html\
move test-admin-login.html tests\html\
move test-api.html tests\html\
move test-login-browser.html tests\html\
move test-performance.html tests\html\
move test-story-image-url.html tests\html\
move test-websocket.html tests\html\

# Mover scripts Python de prueba
move check-system.py tests\python\
move check_db.py tests\python\
move debug-django.py tests\python\
move quick-db-test.py tests\python\
move quick-start.py tests\python\
move test-*.py tests\python\

# Mover scripts JS de prueba
move test-api.js tests\javascript\
move test-communities.tsx tests\javascript\
move test-frontend-cover.js tests\javascript\
move test-posts.js tests\javascript\
move check-routes.js tests\javascript\
```

---

### PASO 4: Consolidar Documentación

```bash
# Crear estructura de documentación
mkdir -p docs\setup
mkdir -p docs\features
mkdir -p docs\optimizations
mkdir -p docs\fixes
mkdir -p docs\changelog

# Mover documentación de setup
move *INSTALACION*.md docs\setup\
move *CONFIGURACION*.md docs\setup\
move *SETUP*.md docs\setup\
move GUIA_*.md docs\setup\
move INSTRUCCIONES_*.md docs\setup\

# Mover documentación de features
move *SISTEMA_*.md docs\features\
move *IMPLEMENTADO*.md docs\features\
move REUNION*.md docs\features\
move TRANSMISION*.md docs\features\

# Mover documentación de optimizaciones
move OPTIMIZACION*.md docs\optimizations\
move MEJORA*.md docs\optimizations\
move PERFORMANCE*.md docs\optimizations\
move ANALISIS_*.md docs\optimizations\

# Mover documentación de fixes
move CORRECCION_*.md docs\fixes\
move SOLUCION_*.md docs\fixes\
move FIX_*.md docs\fixes\

# Mover changelog
move CHANGELOG*.md docs\changelog\
move RELEASE_*.md docs\changelog\
move PUSH_*.md docs\changelog\
```

---

### PASO 5: Crear Índice de Documentación

Crear archivo `docs/README.md`:

```markdown
# Documentación SOS Habilidoso

## 📁 Estructura

### /setup - Guías de Instalación y Configuración
- Instrucciones de instalación
- Configuración de base de datos
- Setup de desarrollo

### /features - Documentación de Características
- Sistema de reuniones virtuales
- Sistema de transmisiones en vivo
- Sistema de stories
- Sistema de notificaciones

### /optimizations - Historial de Optimizaciones
- Optimizaciones de rendimiento
- Mejoras de UI/UX
- Análisis de arquitectura

### /fixes - Soluciones y Correcciones
- Correcciones de bugs
- Soluciones implementadas
- Fixes de compatibilidad

### /changelog - Historial de Cambios
- Notas de versión
- Changelog detallado
- Historial de commits

## 🚀 Inicio Rápido

Ver [setup/INICIO_RAPIDO.md](setup/INICIO_RAPIDO.md)

## 📚 Documentación Completa

Ver [DOCUMENTACION_APLICACION.txt](../public/DOCUMENTACION_APLICACION.txt)
```

---

### PASO 6: Verificación Final

```bash
# 1. Verificar que no hay errores
npm run build

# 2. Verificar tamaño del bundle
# Debería ser menor que antes

# 3. Probar la aplicación
npm run dev

# 4. Probar rutas principales:
# - http://localhost:4000/
# - http://localhost:4000/feed
# - http://localhost:4000/communities
# - http://localhost:4000/live
# - http://localhost:4000/profile

# 5. Verificar que todo funciona correctamente
```

---

## 📊 RESULTADOS ESPERADOS FASE 1

### Antes
- node_modules: ~457 MB
- Dependencias: 68 paquetes
- Archivos raíz: 150+ archivos
- Documentación: 100 archivos dispersos

### Después
- node_modules: ~417 MB (-40 MB) ✅
- Dependencias: 62 paquetes (-6) ✅
- Archivos raíz: ~50 archivos (-100) ✅
- Documentación: Organizada en /docs ✅

### Mejora de Performance
- Bundle size: -5% estimado
- Tiempo de instalación: -10% estimado
- Tiempo de build: -5% estimado

---

## 🎯 FASE 2: LAZY LOADING AVANZADO (PRÓXIMA SEMANA)

### Componentes a Optimizar

#### 1. Chart Component
```typescript
// components/ui/chart.tsx
// Cambiar de import directo a lazy load

// ANTES
import * as RechartsPrimitive from 'recharts';

// DESPUÉS
const RechartsPrimitive = lazy(() => import('recharts'));
```

#### 2. Carousel Component
```typescript
// components/ui/carousel.tsx
const useEmblaCarousel = lazy(() => 
  import('embla-carousel-react').then(m => ({ default: m.default }))
);
```

#### 3. Calendar Component
```typescript
// components/ui/calendar.tsx
const DayPicker = lazy(() => 
  import('react-day-picker').then(m => ({ default: m.DayPicker }))
);
```

#### 4. Emoji Picker
```typescript
// components/ui/emoji-picker-button.tsx
const EmojiPicker = lazy(() => import('emoji-picker-react'));
```

---

## 🔧 FASE 3: OPTIMIZACIÓN DE IMÁGENES (2 SEMANAS)

### Tareas

1. **Convertir imágenes a WebP/AVIF**
```bash
# Instalar herramienta
npm install -g sharp-cli

# Convertir imágenes
sharp -i public/*.png -o public/optimized/ -f webp
```

2. **Implementar blur placeholders**
```typescript
// Usar plaiceholder para generar blur
import { getPlaiceholder } from 'plaiceholder';
```

3. **Lazy load de imágenes**
```typescript
// Usar loading="lazy" en todas las imágenes
<Image src="..." loading="lazy" />
```

---

## 📈 MÉTRICAS A MONITOREAR

### Herramientas

1. **Lighthouse**
```bash
npx lighthouse http://localhost:4000 --view
```

2. **Bundle Analyzer**
```bash
npm install -D @next/bundle-analyzer
# Agregar a next.config.js
ANALYZE=true npm run build
```

3. **Performance Monitoring**
```typescript
// Agregar en app/layout.tsx
export function reportWebVitals(metric) {
  console.log(metric);
}
```

### KPIs Objetivo

- **FCP (First Contentful Paint):** < 1.0s
- **LCP (Largest Contentful Paint):** < 2.0s
- **TTI (Time to Interactive):** < 2.5s
- **Bundle Size:** < 200 KB inicial
- **Total Requests:** < 20

---

## ✅ CHECKLIST DE EJECUCIÓN

### Fase 1 - Limpieza Inmediata
- [ ] Desinstalar dependencias no usadas
- [ ] Eliminar archivos duplicados
- [ ] Organizar archivos de prueba
- [ ] Consolidar documentación
- [ ] Crear índice de docs
- [ ] Verificar build exitoso
- [ ] Probar funcionalidad completa
- [ ] Commit cambios a Git
- [ ] Documentar resultados

### Fase 2 - Lazy Loading (Próxima)
- [ ] Identificar componentes pesados
- [ ] Implementar lazy loading
- [ ] Probar carga diferida
- [ ] Medir mejora de performance
- [ ] Documentar cambios

### Fase 3 - Optimización Assets (Futura)
- [ ] Convertir imágenes a WebP
- [ ] Implementar blur placeholders
- [ ] Optimizar videos
- [ ] Configurar CDN
- [ ] Medir mejora de carga

---

## 🚨 PLAN DE ROLLBACK

### Si algo sale mal:

```bash
# 1. Restaurar package.json
git checkout package.json package-lock.json

# 2. Reinstalar dependencias
npm install

# 3. Restaurar archivos eliminados
# (están en .backup/obsolete-files)

# 4. Verificar que funciona
npm run dev
```

---

## 📞 SOPORTE

### Si encuentras problemas:

1. **Verificar logs de error**
```bash
npm run dev
# Revisar consola para errores
```

2. **Verificar dependencias**
```bash
npm list
# Verificar que todas las dependencias necesarias están instaladas
```

3. **Limpiar cache**
```bash
rm -rf .next node_modules
npm install
npm run dev
```

---

## 🎉 SIGUIENTE PASO

**Ejecutar Fase 1 ahora mismo:**

```bash
# Copiar y pegar estos comandos uno por uno:

# 1. Desinstalar dependencias
npm uninstall @fortawesome/fontawesome-svg-core @fortawesome/free-brands-svg-icons @fortawesome/free-solid-svg-icons react-virtualized-auto-sizer react-window critters @types/axios

# 2. Reinstalar
npm install

# 3. Verificar
npm run build

# 4. Si todo está bien, hacer commit
git add .
git commit -m "chore: remove unused dependencies and organize files"
```

---

**Documento creado por:** Kiro AI Assistant  
**Fecha:** 28 de Enero de 2026  
**Estado:** Listo para ejecutar  
**Próxima Revisión:** Después de completar Fase 1
