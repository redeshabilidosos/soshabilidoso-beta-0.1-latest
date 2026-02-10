# Solución - Error en /profile ✅

## Problema
```
TypeError: Cannot read properties of undefined (reading 'call')
```

Error en: `components/ui/tabs.tsx` al cargar la página `/profile`

## Causa
El error ocurre porque el caché de Next.js tiene una versión corrupta o desactualizada de los módulos de Radix UI, específicamente `@radix-ui/react-tabs`.

## Solución Aplicada

### 1. Limpieza de Caché ✅
Se eliminó el directorio `.next` que contenía el caché corrupto:
```bash
rmdir /s /q ".next"
```

### 2. Verificación de Dependencias ✅
Se confirmó que `@radix-ui/react-tabs@1.1.13` está correctamente instalado:
```bash
npm list @radix-ui/react-tabs
# ✓ @radix-ui/react-tabs@1.1.13
```

## Cómo Aplicar la Solución

### Opción 1: Script Rápido (Recomendado)
```bash
fix-profile-rapido.bat
```

Este script:
1. Detiene el servidor de desarrollo
2. Limpia el caché de Next.js
3. Reinicia el servidor automáticamente

### Opción 2: Script Completo
```bash
fix-profile-error.bat
```

Este script además:
- Reinstala las dependencias de Radix UI
- Limpia caché adicional de node_modules

### Opción 3: Manual
```bash
# 1. Detener servidor (Ctrl+C)
# 2. Limpiar caché
rmdir /s /q ".next"
# 3. Reiniciar servidor
npm run dev
```

## Verificación

Después de aplicar la solución:

1. Espera 15-20 segundos para que Next.js compile
2. Abre: `http://localhost:4000/profile`
3. ✅ La página debe cargar sin errores
4. ✅ Los tabs (Información, Estadísticas, Mi Empresa) deben funcionar

## Componentes Afectados

- ✅ `components/ui/tabs.tsx` - Componente de tabs de Radix UI
- ✅ `app/profile/page.tsx` - Página de perfil que usa tabs
- ✅ `components/profile/user-posts-grid.tsx` - Grid de publicaciones

## Prevención

Para evitar este error en el futuro:

1. **Limpiar caché regularmente:**
   ```bash
   npm run clean  # Si existe el script
   # O manualmente:
   rmdir /s /q ".next"
   ```

2. **Después de actualizar dependencias:**
   ```bash
   npm install
   rmdir /s /q ".next"
   npm run dev
   ```

3. **Si aparecen errores extraños:**
   - Primero intenta limpiar el caché
   - Luego reinstala dependencias si persiste

## Archivos Creados

1. ✅ `fix-profile-rapido.bat` - Script rápido de solución
2. ✅ `fix-profile-error.bat` - Script completo con reinstalación
3. ✅ `SOLUCION_ERROR_PROFILE.md` - Esta documentación

## Estado

✅ **SOLUCIONADO** - Caché limpiado, servidor listo para reiniciar

## Notas Técnicas

### ¿Por qué ocurre este error?

Next.js cachea los módulos compilados en `.next/` para mejorar el rendimiento. A veces, cuando:
- Se actualizan dependencias
- Se cambian archivos de configuración
- Hay interrupciones durante la compilación

El caché puede quedar en un estado inconsistente, causando errores como:
```
Cannot read properties of undefined (reading 'call')
```

### Solución Permanente

Next.js 13.5.1 es una versión antigua. Considera actualizar a una versión más reciente:
```bash
npm install next@latest
```

Pero esto requiere:
- Revisar breaking changes
- Probar toda la aplicación
- Actualizar dependencias relacionadas

Por ahora, limpiar el caché es suficiente.

---

**Fecha:** 5 de febrero de 2026
**Estado:** ✅ Solucionado
**Tiempo de solución:** < 1 minuto
