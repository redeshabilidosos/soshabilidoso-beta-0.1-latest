# Corrección Modal de Cámara - Stream

## Fecha: 23 de Enero 2026

## Problemas Identificados

### 1. **Modal Desbordado**
- ❌ `max-h-[90vh]` causaba scroll vertical
- ❌ `overflow-y-auto` cortaba los controles de cámara
- ❌ Botón "Iniciar" no visible sin hacer scroll
- ❌ Altura del video variable (`minHeight: 320px` + `aspectRatio: 16/9`)

### 2. **Cámara No Se Activaba**
- ❌ Permisos no se solicitaban correctamente
- ❌ No había feedback visual claro
- ❌ Video no se mostraba después de dar permisos

### 3. 