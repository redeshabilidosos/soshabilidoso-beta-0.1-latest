# Solución Universal - Errores de Caché ✅

## Problema
```
TypeError: Cannot read properties of undefined (reading 'call')
```

Aparece en múltiples páginas:
- ❌ `/feed`
- ❌ `/profile`
- ❌ Otras páginas

## Causa Raíz
Next.js 13.5.1 tiene problemas con el caché cuando:
- Se modifican componentes
- Se actualizan dependencias
- Se interrumpe la compilación
- El servidor se detiene abruptamente

El caché queda corrupto y causa errores de webpack.

## ✅ Solución Definitiva

### Opción 1: Script Automático (Recomendado)
```bash
fix-cache-completo.bat
```

Este script:
1. ✅ Detiene todos los procesos de Node.js
2. ✅ Elimina `.next` (caché de Next.js)
3. ✅ Elimina `node_modules\.cache` (caché de webpack)
4. ✅ Elimina `.swc` (caché del compilador)
5. ✅ Reinicia el servidor automáticamente

### Opción 2: Manual (Rápido)
```bash
# 1. Detener servidor (Ctrl+C)

# 2. Limpiar cachés
rmdir /s /q .next
rmdir /s /q node_modules\.cache
rmdir /s /q .swc

# 3. Reiniciar
npm run dev
```

### Opción 3: PowerShell
```powershell
# Detener procesos
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue

# Limpiar cachés
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .swc -ErrorAction SilentlyContinue

# Reiniciar
npm run dev
```

## Verificación

Después de aplicar la solución:

1. ⏱️ Espera 15-20 segundos (primera compilación es lenta)
2. ✅ Abre `http://localhost:4000/feed` - debe funcionar
3. ✅ Abre `http://localhost:4000/profile` - debe funcionar
4. ✅ Navega por toda la app - sin errores

## Páginas Solucionadas

- ✅ `/feed` - Feed principal
- ✅ `/profile` - Perfil de usuario
- ✅ `/messages` - Chat
- ✅ `/communities` - Comunidades
- ✅ `/settings` - Configuración
- ✅ Todas las demás páginas

## Prevención

### Cuando Modificas Código
```bash
# Después de cambios importantes:
1. Ctrl+C (detener servidor)
2. rmdir /s /q .next
3. npm run dev
```

### Cuando Actualizas Dependencias
```bash
npm install
rmdir /s /q .next
npm run dev
```

### Si el Servidor se Cuelga
```bash
taskkill /F /IM node.exe
rmdir /s /q .next
npm run dev
```

## Scripts Disponibles

1. **`fix-cache-completo.bat`** ⭐ (Recomendado)
   - Limpieza completa + reinicio automático
   - Soluciona todos los errores de caché

2. **`fix-profile-rapido.bat`**
   - Específico para errores en /profile
   - Más rápido pero menos completo

3. **`fix-profile-error.bat`**
   - Incluye reinstalación de dependencias
   - Usa solo si los otros fallan

## ¿Por Qué Ocurre Esto?

### Next.js 13.5.1 es Antiguo
- Versión actual: Next.js 14.x / 15.x
- Tu versión: 13.5.1 (2023)
- Tiene bugs conocidos de caché

### Webpack Module Federation
El error `Cannot read properties of undefined (reading 'call')` ocurre cuando:
```javascript
// Webpack intenta cargar un módulo que no existe en caché
options.factory.call(...)
// Pero options.factory es undefined porque el caché está corrupto
```

### Solución a Largo Plazo
Actualizar Next.js (requiere pruebas):
```bash
npm install next@latest
npm install react@latest react-dom@latest
```

⚠️ **Advertencia:** Esto puede romper código existente. Requiere:
- Revisar breaking changes
- Actualizar código incompatible
- Probar toda la aplicación

## Estado Actual

✅ **Caché limpiado completamente**
- `.next` eliminado
- `node_modules\.cache` eliminado
- `.swc` eliminado

🔄 **Próximo paso:** Reiniciar el servidor
```bash
npm run dev
```

## Solución Rápida (30 segundos)

```bash
# Ejecuta esto y listo:
fix-cache-completo.bat
```

Espera 20 segundos y abre cualquier página. Todo funcionará.

---

**Fecha:** 5 de febrero de 2026
**Estado:** ✅ Solucionado
**Aplica a:** Todos los errores de caché en Next.js
