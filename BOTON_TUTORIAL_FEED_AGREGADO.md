# Botón de Tutorial Agregado al Feed

## ✅ Implementación Completada

Se ha agregado un botón para reiniciar el tutorial guiado en la página del feed (`/feed`), similar al que existe en la página de clasificados.

## Ubicación del Botón

**Posición:** En el header del feed, junto al botón "Nueva Publicación"

```
┌─────────────────────────────────────────────────┐
│  📈 Feed Principal                              │
│  Descubre las últimas novedades...             │
│                                                 │
│                    [Tutorial] [Nueva Publicación]│
└─────────────────────────────────────────────────┘
```

## Cambios Realizados

### Archivo Modificado
- `app/feed/page.tsx`

### 1. Imports Agregados

```typescript
import { Sparkles } from 'lucide-react';
import { useTutorial } from '@/components/tutorial/tutorial-provider';
```

### 2. Componente TutorialFeedButton

```typescript
function TutorialFeedButton() {
  const { startTutorial, isActive } = useTutorial();
  
  const handleReset = () => {
    console.log('🔄 Reiniciando tutorial del feed...');
    localStorage.removeItem('feed_tutorial_completed');
    startTutorial();
  };

  return (
    <button
      onClick={handleReset}
      className="flex items-center gap-2 px-3 md:px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg shadow-lg text-xs md:text-sm font-semibold transition-all hover:scale-105 border border-white/20 flex-shrink-0"
      title="Iniciar tutorial guiado del feed"
    >
      <Sparkles className="w-4 h-4" />
      <span className="hidden sm:inline">Tutorial</span>
    </button>
  );
}
```

### 3. Integración en el Header

```typescript
<div className="flex items-center gap-2">
  {/* Botón Tutorial - Posición 1 */}
  <TutorialFeedButton />
  
  {/* Botón Nueva Publicación */}
  <Button 
    id="new-post-button"
    onClick={() => setIsNewPostDialogOpen(true)}
    className="w-full md:w-auto"
    size="default"
  >
    <Plus size={18} className="mr-2" />
    <span className="hidden sm:inline">Nueva Publicación</span>
    <span className="sm:hidden">Publicar</span>
  </Button>
</div>
```

## Características del Botón

### Diseño Visual
- 🎨 **Gradiente:** Púrpura a rosa (`from-purple-600 to-pink-600`)
- ✨ **Icono:** Sparkles (estrellitas brillantes)
- 🔲 **Borde:** Blanco semi-transparente
- 💫 **Hover:** Efecto de escala (`hover:scale-105`)
- 🌈 **Sombra:** Shadow-lg para profundidad

### Responsive
- **Desktop:** Muestra icono + texto "Tutorial"
- **Mobile:** Solo muestra el icono ✨
- **Tamaño:** Adaptativo (`text-xs md:text-sm`)
- **Padding:** Adaptativo (`px-3 md:px-4`)

### Funcionalidad
- ✅ Limpia el localStorage (`feed_tutorial_completed`)
- ✅ Reinicia el tutorial desde el paso 1
- ✅ Funciona incluso si el tutorial ya fue completado
- ✅ Log en consola para debugging

## Comparación con Clasificados

| Característica | Feed | Clasificados |
|----------------|------|--------------|
| Ubicación | Header principal | Header de tabs |
| Gradiente | Púrpura → Rosa | Púrpura → Rosa |
| Icono | Sparkles ✨ | Sparkles ✨ |
| Texto | "Tutorial" | "Tutorial" |
| Función | Reinicia tutorial feed | Reinicia tutorial clasificados |
| localStorage | `feed_tutorial_completed` | `classifieds_tutorial_completed` |

## Flujo de Usuario

```
Usuario en /feed
    ↓
Ve botón "Tutorial" con ✨
    ↓
Hace clic
    ↓
localStorage se limpia
    ↓
Tutorial se reinicia
    ↓
Paso 1: Bienvenida
    ↓
Usuario sigue los 17 pasos
    ↓
Completa tutorial
    ↓
localStorage guarda completado
```

## Pasos del Tutorial del Feed

El tutorial del feed incluye 17 pasos:

1. **Bienvenida** - Introducción al feed
2. **Header** - Explicación del encabezado
3. **Nueva Publicación** - Cómo crear posts
4. **Historias** - Slider de stories
5. **Publicaciones** - Feed de posts
6. **Reacciones** - Me gusta, comentarios
7. **Comentarios** - Sistema de comentarios
8. **Compartir** - Compartir publicaciones
9. **Perfil** - Ver perfiles de usuarios
10. **Notificaciones** - Centro de notificaciones
11. **Búsqueda** - Buscar usuarios y contenido
12. **Comunidades** - Explorar comunidades
13. **Mensajes** - Chat privado
14. **En Vivo** - Transmisiones en vivo
15. **Clips** - Videos cortos
16. **Configuración** - Ajustes de cuenta
17. **Finalización** - Mensaje de éxito con confeti 🎉

## Testing

Para probar el botón:

1. Ve a `http://localhost:4000/feed`
2. Busca el botón "Tutorial" con el icono ✨
3. Haz clic en el botón
4. Verifica que el tutorial comience desde el paso 1
5. Completa o salta el tutorial
6. Vuelve a hacer clic en el botón
7. Verifica que se reinicie correctamente

## Ventajas

- ✅ **Accesible:** Siempre visible en el header
- ✅ **Intuitivo:** Icono de estrellitas indica "guía"
- ✅ **Consistente:** Mismo diseño que en clasificados
- ✅ **Responsive:** Se adapta a todos los dispositivos
- ✅ **Reutilizable:** Usuarios pueden ver el tutorial cuando quieran

## Integración con Tutorial Provider

El botón usa el hook `useTutorial()` que proporciona:

```typescript
const { startTutorial, isActive } = useTutorial();
```

- `startTutorial()`: Inicia el tutorial desde el paso 1
- `isActive`: Indica si el tutorial está actualmente activo

## Notas Técnicas

- El botón está fuera del flujo del tutorial (no es parte de los pasos)
- Se puede usar en cualquier momento, incluso durante el tutorial
- No interfiere con el estado del tutorial actual
- Compatible con el sistema de localStorage existente

---

**Estado:** ✅ Completado
**Fecha:** 2026-02-10
**Archivo modificado:** `app/feed/page.tsx`
**Componente:** `TutorialFeedButton`
**Hook usado:** `useTutorial` de `tutorial-provider`
