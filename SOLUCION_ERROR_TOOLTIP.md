# 🔧 Solución: Error de Tooltip en /messages

## ❌ Error
```
TypeError: Cannot read properties of undefined (reading 'call')
webpack-internal:/(app-pages-browser)/components/ui/tooltip.tsx
```

## 🔍 Causa
Next.js necesita reiniciar después de agregar nuevos imports de componentes shadcn/ui.

## ✅ Solución Rápida

### Opción 1: Reiniciar Servidor (RECOMENDADO)
```bash
# 1. Detener el servidor
Ctrl + C

# 2. Limpiar cache de Next.js
rmdir /s /q .next

# 3. Reiniciar
npm run soshabilidoso
```

### Opción 2: Script Automático
```bash
fix-tooltip-error.bat
```

### Opción 3: Reinstalar Dependencias (Si persiste)
```bash
# 1. Eliminar node_modules y cache
rmdir /s /q node_modules
rmdir /s /q .next

# 2. Reinstalar
npm install

# 3. Iniciar
npm run soshabilidoso
```

## 🎯 Verificación

Después de reiniciar, verifica:

1. **Abre:** `http://localhost:4000/messages`
2. **Debe mostrar:** Chat sin errores
3. **Tooltips funcionan:** Hover sobre botones muestra información
4. **DropdownMenu funciona:** Click en ⋮ muestra menú
5. **Emoji picker funciona:** Click en 😊 muestra emojis

## 📋 Checklist

- [ ] Servidor reiniciado
- [ ] Cache de Next.js limpiado (.next eliminado)
- [ ] Página /messages carga sin errores
- [ ] Tooltips aparecen al hacer hover
- [ ] DropdownMenu se abre correctamente
- [ ] Popover de emojis funciona
- [ ] No hay errores en consola

## 🐛 Si el Error Persiste

### Verificar Dependencias
```bash
npm list @radix-ui/react-tooltip
npm list @radix-ui/react-dropdown-menu
npm list @radix-ui/react-popover
```

Deben mostrar versiones instaladas:
```
@radix-ui/react-tooltip@1.1.2
@radix-ui/react-dropdown-menu@2.1.16
@radix-ui/react-popover@1.1.15
```

### Reinstalar Dependencias Específicas
```bash
npm install @radix-ui/react-tooltip@^1.1.2
npm install @radix-ui/react-dropdown-menu@^2.1.16
npm install @radix-ui/react-popover@^1.1.15
```

## 💡 Nota Importante

Este error es común cuando:
1. Se agregan nuevos imports de componentes
2. Next.js no recarga automáticamente
3. El cache de webpack está desactualizado

**Solución:** Siempre reiniciar el servidor después de agregar nuevos componentes de shadcn/ui.

## 🎉 Después de Solucionar

El chat debe funcionar con:
- ✅ Tooltips en todos los botones
- ✅ DropdownMenu elegante para opciones
- ✅ Popover para emoji picker
- ✅ Patrones animados funcionando
- ✅ Sonidos funcionando
- ✅ WebSocket en tiempo real

---

**Fecha:** 5 de febrero de 2026
**Estado:** 📝 Documentado
**Solución:** Reiniciar servidor y limpiar cache
