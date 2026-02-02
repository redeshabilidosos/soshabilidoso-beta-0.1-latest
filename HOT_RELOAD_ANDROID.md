# 🔥 Hot Reload en Android - Guía Completa

**Fecha:** 28 de Enero de 2026  
**Estado:** ✅ Configurado

---

## 🎯 ¿QUÉ ES HOT RELOAD?

Hot Reload permite ver cambios en tu código **inmediatamente** sin necesidad de:
- ❌ Recompilar APK
- ❌ Reinstalar app
- ❌ Perder estado de la app

Similar a Expo en React Native.

---

## ⚡ CÓMO FUNCIONA

### En Next.js (Web)
```
1. Editas archivo .tsx
2. Guardas (Ctrl + S)
3. Next.js detecta cambio
4. Recompila automáticamente
5. Navegador se actualiza solo
```

### En Android (Modo Híbrido)
```
1. Editas archivo .tsx
2. Guardas (Ctrl + S)
3. Next.js detecta cambio
4. Recompila automáticamente
5. En Android: Cierra y abre app
6. App carga nueva versión
```

**Ventaja**: No necesitas rebuild de APK, solo reabrir la app.

---

## 🚀 COMANDO ÚNICO

### Iniciar Todo con Hot Reload
```bash
npm run soshabilidoso
```

Este comando inicia:
1. ✅ Backend Django (puerto 8000)
2. ✅ Frontend Next.js (puerto 4000) con hot reload
3. ✅ Scrcpy (espejo de Xiaomi)
4. ✅ Todo listo para desarrollo

---

## 💻 WORKFLOW DE DESARROLLO

### Paso 1: Iniciar (Solo una vez)
```bash
npm run soshabilidoso
```

Espera a que todo inicie (~15 segundos):
- Backend corriendo
- Frontend corriendo
- Scrcpy mostrando Xiaomi

### Paso 2: Desarrollar con Hot Reload

**Cambios en Componentes React:**
```typescript
// components/ui/post-card.tsx
export function PostCard() {
  return (
    <div className="bg-black"> {/* Cambias a bg-red-500 */}
      ...
    </div>
  )
}
```

1. Guardas archivo (Ctrl + S)
2. En navegador: Se actualiza automáticamente
3. En Android: Cierra y abre la app
4. ¡Cambio visible!

**Cambios en Estilos:**
```typescript
// Cambias className
<div className="text-white"> → <div className="text-green-500">
```

1. Guardas
2. Navegador: Actualización automática
3. Android: Cierra/abre app
4. ¡Nuevo color visible!

**Cambios en Lógica:**
```typescript
// Cambias función
const handleClick = () => {
  console.log("Old") // → console.log("New")
}
```

1. Guardas
2. Navegador: Actualización automática
3. Android: Cierra/abre app
4. ¡Nueva lógica funciona!

---

## 📱 REFRESCAR EN ANDROID

### Método 1: Cierra y Abre (Recomendado)
```
1. Swipe up desde abajo (cerrar app)
2. Tap en icono de SOS Habilidoso
3. App carga con cambios
```

**Tiempo**: 2-3 segundos

### Método 2: Forzar Recarga
```
1. En scrcpy: Click derecho (back)
2. Vuelve a entrar a la sección
3. Cambios visibles
```

**Tiempo**: 1-2 segundos

### Método 3: Pull to Refresh (Si está implementado)
```
1. En la app, desliza hacia abajo
2. Suelta para refrescar
3. Cambios visibles
```

**Tiempo**: Instantáneo

---

## 🔄 TIPOS DE CAMBIOS

### ✅ Hot Reload Funciona (Sin rebuild)

**Frontend (Next.js):**
- ✅ Componentes React (.tsx, .jsx)
- ✅ Estilos (Tailwind, CSS)
- ✅ Páginas (app/*.tsx)
- ✅ Hooks (hooks/*.ts)
- ✅ Utilidades (lib/*.ts)
- ✅ Servicios (lib/services/*.ts)

**Backend (Django):**
- ✅ Vistas (views.py)
- ✅ Modelos (models.py) - con migrate
- ✅ Serializers (serializers.py)
- ✅ URLs (urls.py)
- ✅ APIs (viewsets)

**Acción**: Solo guarda y refresca

---

### ⚠️ Requiere Rebuild (Cambios en Capacitor)

**Configuración:**
- ⚠️ capacitor.config.ts
- ⚠️ Plugins de Capacitor
- ⚠️ AndroidManifest.xml
- ⚠️ Permisos de Android
- ⚠️ Iconos/Splash screen

**Acción**: Ejecuta `actualizar-app-rapido.bat`

---

## 🎬 EJEMPLO PRÁCTICO

### Cambiar Color de un Botón

**Antes:**
```typescript
// components/ui/button.tsx
<button className="bg-blue-500">
  Click me
</button>
```

**Cambio:**
```typescript
<button className="bg-green-500">
  Click me
</button>
```

**Proceso:**
1. Editas archivo
2. Guardas (Ctrl + S)
3. Terminal muestra: "✓ Compiled in 234ms"
4. Navegador: Botón verde automáticamente
5. Android: Cierras/abres app
6. Android: Botón verde visible

**Tiempo total**: 5 segundos

---

### Agregar Nuevo Campo a Post

**Cambio:**
```typescript
// components/ui/post-card.tsx
<div className="post-card">
  <h2>{post.title}</h2>
  <p>{post.content}</p>
  <span className="text-gray-500">{post.author}</span> {/* NUEVO */}
</div>
```

**Proceso:**
1. Editas archivo
2. Guardas
3. Terminal: "✓ Compiled"
4. Navegador: Campo autor visible
5. Android: Cierras/abres
6. Android: Campo autor visible

**Tiempo total**: 5 segundos

---

## 💡 TIPS PARA HOT RELOAD EFICIENTE

### Tip 1: Mantén Scrcpy Abierto
- Deja scrcpy corriendo mientras desarrollas
- Verás cambios en tiempo real
- No necesitas desconectar Xiaomi

### Tip 2: Usa Dos Monitores
```
Monitor 1: VS Code (código)
Monitor 2: Navegador + Scrcpy (preview)
```

Workflow:
1. Editas en Monitor 1
2. Guardas
3. Ves cambios en Monitor 2 (ambos)

### Tip 3: Atajos de Teclado
```
Ctrl + S: Guardar (trigger hot reload)
Ctrl + Shift + R: Hard refresh en navegador
Alt + Tab: Cambiar entre ventanas
```

### Tip 4: Terminal Visible
- Mantén terminal visible
- Verás errores inmediatamente
- Sabrás cuando compilación termina

### Tip 5: Errores de Compilación
Si hay error:
1. Terminal muestra error
2. Arregla error
3. Guarda
4. Compilación automática
5. Cambios visibles

---

## 🔍 DEBUGGING

### Ver Logs en Tiempo Real

**Frontend (Next.js):**
```bash
# En terminal donde corre Next.js
# Verás:
✓ Compiled in 234ms
⚠ Warning: ...
✖ Error: ...
```

**Backend (Django):**
```bash
# En terminal donde corre Django
# Verás:
[28/Jan/2026 10:30:45] "GET /api/posts/ HTTP/1.1" 200 1234
```

**Android (Capacitor):**
```bash
# En nueva terminal
C:\Users\PC\Downloads\scrcpy-win64-v3.3.4\adb.exe logcat | findstr "Capacitor"
```

---

## 📊 COMPARACIÓN

### Sin Hot Reload (Tradicional)
```
1. Editar código: 1 min
2. Compilar APK: 2 min
3. Instalar APK: 30 seg
4. Abrir app: 10 seg
5. Probar cambio: 10 seg
---
Total: ~4 minutos por cambio
```

### Con Hot Reload (Actual)
```
1. Editar código: 1 min
2. Guardar: 1 seg
3. Compilación: 2 seg
4. Cerrar/abrir app: 2 seg
5. Probar cambio: 10 seg
---
Total: ~1 minuto por cambio
```

**Ahorro**: 75% de tiempo

---

## 🆘 TROUBLESHOOTING

### Cambios no se ven en Android

**Causa 1**: Cache
```
Solución:
1. Cierra app completamente (swipe up)
2. Espera 2 segundos
3. Abre app de nuevo
```

**Causa 2**: Compilación no terminó
```
Solución:
1. Mira terminal de Next.js
2. Espera a ver "✓ Compiled"
3. Luego refresca Android
```

**Causa 3**: Error de compilación
```
Solución:
1. Revisa terminal
2. Arregla error
3. Guarda de nuevo
4. Espera "✓ Compiled"
```

---

### Hot Reload no funciona

**Causa**: Servidores no corriendo
```
Solución:
1. Verifica puertos:
   netstat -ano | findstr ":4000"
   netstat -ano | findstr ":8000"
2. Si no aparecen, reinicia:
   npm run soshabilidoso
```

---

### Android muestra pantalla blanca

**Causa**: No puede conectar con servidor
```
Solución:
1. Verifica WiFi (misma red)
2. Verifica firewall:
   permitir-conexion-wifi.bat (como admin)
3. Prueba en navegador del Xiaomi:
   http://192.168.78.173:4000
```

---

## 🎯 WORKFLOW ÓPTIMO

### Desarrollo de Feature Nueva

```bash
# 1. Iniciar todo (una vez)
npm run soshabilidoso

# 2. Crear componente
# Editar: components/features/nueva-feature.tsx

# 3. Guardar (Ctrl + S)
# Ver en navegador: Cambio automático
# Ver en Android: Cerrar/abrir app

# 4. Ajustar estilos
# Editar: Cambiar className

# 5. Guardar
# Ver cambios en ambos

# 6. Agregar lógica
# Editar: Agregar funciones

# 7. Guardar
# Probar en ambos

# 8. Testing
# Probar flujo completo en Android

# 9. Commit
git add .
git commit -m "Nueva feature"
```

**Tiempo total**: 15-30 minutos (vs 1-2 horas sin hot reload)

---

## 📚 COMANDOS ÚTILES

### Desarrollo
```bash
# Iniciar todo
npm run soshabilidoso

# Solo servidores (sin scrcpy)
npm run soshabilidoso:simple

# Solo backend
npm run dev:backend

# Solo frontend
npm run dev
```

### Debugging
```bash
# Ver logs de Android
C:\Users\PC\Downloads\scrcpy-win64-v3.3.4\adb.exe logcat

# Ver dispositivos conectados
C:\Users\PC\Downloads\scrcpy-win64-v3.3.4\adb.exe devices

# Reiniciar app en Android
C:\Users\PC\Downloads\scrcpy-win64-v3.3.4\adb.exe shell am force-stop com.soshabilidoso.app
C:\Users\PC\Downloads\scrcpy-win64-v3.3.4\adb.exe shell am start -n com.soshabilidoso.app/.MainActivity
```

---

## ✅ CHECKLIST DE HOT RELOAD

- [ ] `npm run soshabilidoso` ejecutado
- [ ] Backend corriendo (puerto 8000)
- [ ] Frontend corriendo (puerto 4000)
- [ ] Scrcpy mostrando Xiaomi
- [ ] App abierta en Xiaomi
- [ ] Cambio en código
- [ ] Guardado (Ctrl + S)
- [ ] Terminal muestra "✓ Compiled"
- [ ] Navegador actualizado automáticamente
- [ ] Android: Cerrar/abrir app
- [ ] Cambio visible en Android

---

**Creado por:** Kiro AI Assistant  
**Estado:** ✅ Hot Reload configurado  
**Comando principal:** `npm run soshabilidoso`

