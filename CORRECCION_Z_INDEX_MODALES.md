# Corrección de Z-Index para Modales Dialog

## Problema Identificado
Los modales Dialog estaban apareciendo detrás de otros elementos debido a conflictos de z-index. Varios componentes tenían z-index altos que interferían con la visualización correcta de los modales.

## Solución Implementada

### 1. Actualización de Componentes Base de UI

#### Dialog Component (`components/ui/dialog.tsx`)
- **DialogOverlay**: Actualizado de `z-50` a `z-[9999]`
- **DialogContent**: Actualizado de `z-50` (clase) a `z-index: 10000` (inline style)
- **DialogClose**: Actualizado de `z-50` a `z-[10001]`

#### AlertDialog Component (`components/ui/alert-dialog.tsx`)
- **AlertDialogOverlay**: Actualizado de `z-50` a `z-[9999]`
- **AlertDialogContent**: Actualizado de `z-50` a `z-[10000]`

#### Sheet Component (`components/ui/sheet.tsx`)
- **SheetOverlay**: Actualizado de `z-50` a `z-[9998]`
- **SheetVariants**: Actualizado de `z-50` a `z-[9999]`

### 2. Estilos Globales CSS (`app/globals.css`)

Se agregaron reglas CSS globales para asegurar que todos los componentes de Radix UI tengan el z-index correcto:

```css
/* Overlays de Radix UI */
[data-radix-dialog-overlay],
[data-radix-alert-dialog-overlay],
[data-radix-sheet-overlay] {
  z-index: 9999 !important;
}

/* Contenidos de modales */
[data-radix-dialog-content],
[data-radix-alert-dialog-content],
[data-radix-sheet-content] {
  z-index: 10000 !important;
}

/* Portales de Radix UI */
[data-radix-portal] {
  z-index: 9998 !important;
}

/* Dropdowns, popovers y tooltips dentro de modales */
[data-radix-dropdown-menu-content],
[data-radix-popover-content],
[data-radix-tooltip-content],
[data-radix-select-content],
[data-radix-context-menu-content] {
  z-index: 10001 !important;
}
```

### 3. Ajuste de Componentes Específicos

#### Live Streams Dropdown (`components/navigation/live-streams-dropdown.tsx`)
- Modal actualizado de `z-[9999]` a `z-[9998]` para no interferir con los Dialog

## Jerarquía de Z-Index Establecida

```
10001 - Dropdowns, Popovers, Tooltips (dentro de modales)
10000 - Contenido de Modales (Dialog, AlertDialog, Sheet)
9999  - Overlays de Modales
9998  - Portales y otros modales secundarios
...
50    - Componentes UI estándar (Select, Tooltip, etc.)
```

## Beneficios

1. **Consistencia**: Todos los modales ahora siguen la misma jerarquía de z-index
2. **Compatibilidad**: Los estilos globales aseguran que incluso componentes no actualizados funcionen correctamente
3. **Mantenibilidad**: La jerarquía clara facilita futuras actualizaciones
4. **Accesibilidad**: Los modales siempre están visibles y accesibles para el usuario

## Componentes Afectados

- ✅ Dialog (todos los modales de diálogo)
- ✅ AlertDialog (diálogos de confirmación)
- ✅ Sheet (paneles laterales)
- ✅ Live Streams Dropdown
- ✅ Todos los componentes que usan Radix UI primitives

## Pruebas Recomendadas

1. Abrir modales de creación de posts
2. Abrir diálogos de confirmación
3. Abrir modales de perfil de usuario
4. Verificar que los dropdowns dentro de modales funcionen correctamente
5. Probar en diferentes páginas (feed, comunidades, perfil, etc.)

## Fecha de Implementación
28 de Enero de 2026
