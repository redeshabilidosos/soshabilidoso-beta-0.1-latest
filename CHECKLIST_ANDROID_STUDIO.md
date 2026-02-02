# Checklist - Testing en Android Studio

**Fecha:** 28 de Enero de 2026  
**Estado:** ✅ Capacitor sincronizado - Android Studio abierto

---

## ✅ ESTADO ACTUAL

### Servidores Corriendo
- ✅ **Frontend (Next.js)**: `http://localhost:4000` (PID 21788)
- ✅ **Backend (Django)**: `http://127.0.0.1:8000` (PID 20500)

### Capacitor
- ✅ Sincronizado con Android
- ✅ 13 plugins registrados
- ✅ Android Studio abierto

---

## 📱 PASOS EN ANDROID STUDIO

### 1. Esperar Gradle Sync (Primera Vez)
Android Studio necesita descargar dependencias la primera vez:

- ⏳ Verás "Gradle Sync" en la parte inferior
- ⏳ Puede tardar 2-5 minutos
- ⏳ Espera a que termine antes de continuar

**Indicador:** Barra de progreso en la parte inferior desaparecerá

---

### 2. Configurar Emulador (Si no tienes uno)

**Opción A: Crear Nuevo Emulador**
1. Click en "Device Manager" (icono de teléfono en la barra lateral derecha)
2. Click en "Create Device"
3. Selecciona un dispositivo (recomendado: Pixel 5)
4. Selecciona una imagen del sistema:
   - **Recomendado**: Android 13 (API 33) o Android 14 (API 34)
   - Si no está descargada, click en "Download"
5. Click "Next" → "Finish"

**Opción B: Usar Dispositivo Físico**
1. Conecta tu teléfono por USB
2. Habilita "Depuración USB" en tu teléfono:
   - Ajustes → Acerca del teléfono
   - Toca "Número de compilación" 7 veces
   - Vuelve → Opciones de desarrollador
   - Activa "Depuración USB"
3. Autoriza la conexión en tu teléfono

---

### 3. Ejecutar la App

1. **Selecciona el dispositivo:**
   - En la barra superior, verás un dropdown con dispositivos
   - Selecciona tu emulador o dispositivo físico

2. **Presiona Run (▶️):**
   - Click en el botón verde "Run" (▶️) en la barra superior
   - O presiona `Shift + F10`

3. **Espera a que compile:**
   - Primera vez puede tardar 2-3 minutos
   - Verás progreso en "Build" (parte inferior)

4. **El emulador se abrirá:**
   - Si es primera vez, el emulador tardará ~1 minuto en iniciar
   - La app se instalará automáticamente
   - La app se abrirá automáticamente

---

### 4. Verificar Funcionamiento

Una vez que la app abra, verifica:

#### ✅ Pantalla de Login
- [ ] La app carga correctamente
- [ ] Se ve el logo de SOS Habilidoso
- [ ] Formulario de login visible
- [ ] Botones funcionan

#### ✅ Login
Usa estas credenciales:
```
Usuario: molo
Contraseña: molo123
```

- [ ] Login funciona
- [ ] Redirige al feed

#### ✅ Feed
- [ ] Posts se cargan
- [ ] Imágenes se muestran
- [ ] Scroll funciona
- [ ] Sidebar visible

#### ✅ Navegación
- [ ] Click en "Comunidades" funciona
- [ ] Click en "Perfil" funciona
- [ ] Navegación fluida
- [ ] No hay errores

#### ✅ Funcionalidades
- [ ] Crear post funciona
- [ ] Like funciona
- [ ] Comentarios funcionan
- [ ] Compartir funciona

---

## 🔍 VER LOGS (Si hay problemas)

### En Android Studio:

1. **Abrir Logcat:**
   - Click en "Logcat" en la parte inferior
   - O presiona `Alt + 6`

2. **Filtrar logs:**
   - En el campo de búsqueda, escribe: `Capacitor`
   - O filtra por nivel: "Error" o "Warn"

3. **Buscar errores:**
   - Errores de red: `Failed to connect`
   - Errores de Capacitor: `Capacitor Plugin`
   - Errores de JavaScript: `Console`

---

## ⚠️ PROBLEMAS COMUNES

### Problema 1: App muestra pantalla blanca

**Causa:** No puede conectar con el servidor

**Solución:**
1. Verifica que frontend esté corriendo:
   ```bash
   curl http://localhost:4000
   ```

2. Verifica configuración en `capacitor.config.ts`:
   ```typescript
   server: {
     url: 'http://localhost:4000',
     cleartext: true,
   }
   ```

3. Re-sincroniza:
   ```bash
   npx cap sync android
   ```

4. Rebuild en Android Studio:
   - Build → Clean Project
   - Build → Rebuild Project

---

### Problema 2: "ERR_CONNECTION_REFUSED"

**Causa:** Emulador no puede acceder a localhost

**Solución:**

**Para Emulador Android:**
- Usa `http://10.0.2.2:4000` en lugar de `http://localhost:4000`

**Actualiza `capacitor.config.ts`:**
```typescript
server: {
  url: 'http://10.0.2.2:4000', // IP especial para emulador
  cleartext: true,
}
```

**Re-sincroniza:**
```bash
npx cap sync android
```

---

### Problema 3: Gradle Sync falla

**Causa:** Problemas con dependencias de Android

**Solución:**
1. File → Invalidate Caches → Invalidate and Restart
2. Espera a que reinicie
3. Build → Clean Project
4. Build → Rebuild Project

---

### Problema 4: App se cierra inmediatamente

**Causa:** Error en código o permisos

**Solución:**
1. Revisa Logcat para ver el error
2. Busca líneas rojas con "FATAL EXCEPTION"
3. Copia el error y analízalo

---

## 🎯 TESTING EN DISPOSITIVO REAL

Si quieres probar en tu teléfono físico:

### Paso 1: Encuentra tu IP local
```bash
ipconfig
# Busca "IPv4 Address" (ej: 192.168.1.100)
```

### Paso 2: Actualiza capacitor.config.ts
```typescript
server: {
  url: 'http://192.168.1.100:4000', // Tu IP
  cleartext: true,
}
```

### Paso 3: Asegúrate que estén en la misma red WiFi
- Tu PC y tu teléfono deben estar en la misma red

### Paso 4: Re-sincroniza y ejecuta
```bash
npx cap sync android
```

Luego en Android Studio: Run ▶️

---

## 📊 MÉTRICAS DE ÉXITO

### ✅ Todo Funciona Si:
- App abre sin errores
- Login funciona
- Feed carga posts
- Navegación fluida
- Imágenes se cargan
- Interacciones funcionan (like, comentar, etc.)

### ⚠️ Revisar Si:
- App tarda mucho en cargar
- Imágenes no se cargan
- Navegación lenta
- Errores en consola

---

## 🚀 PRÓXIMOS PASOS (Después de Testing Exitoso)

### 1. Personalización
- [ ] Cambiar icono de la app
- [ ] Cambiar splash screen
- [ ] Ajustar colores de status bar

### 2. Permisos
- [ ] Configurar permisos de cámara
- [ ] Configurar permisos de ubicación
- [ ] Configurar permisos de almacenamiento

### 3. Optimización
- [ ] Reducir tamaño de APK
- [ ] Optimizar carga inicial
- [ ] Configurar cache

### 4. Producción
- [ ] Desplegar backend a servidor
- [ ] Actualizar URL en capacitor.config.ts
- [ ] Generar APK firmado
- [ ] Publicar en Play Store

---

## 💡 TIPS

### Hot Reload
- Cambios en código Next.js se reflejan automáticamente
- Solo refresca la app en el emulador (Ctrl+R)
- No necesitas rebuild

### Debugging
- Usa Chrome DevTools para debugging:
  - Chrome → `chrome://inspect`
  - Click en "inspect" bajo tu app
  - Consola de JavaScript disponible

### Performance
- Primera carga siempre es más lenta
- Después de cache, carga es instantánea
- Usa Logcat para ver tiempos de carga

---

## 📞 COMANDOS ÚTILES

### Ver dispositivos conectados
```bash
adb devices
```

### Instalar APK manualmente
```bash
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

### Ver logs en tiempo real
```bash
adb logcat | findstr "Capacitor"
```

### Limpiar y rebuild
```bash
cd android
gradlew clean
cd ..
npx cap sync android
```

---

## ✅ CHECKLIST FINAL

Antes de considerar el testing completo:

- [ ] App abre correctamente
- [ ] Login funciona
- [ ] Feed carga posts
- [ ] Navegación entre páginas funciona
- [ ] Imágenes se cargan
- [ ] Crear post funciona
- [ ] Like funciona
- [ ] Comentarios funcionan
- [ ] Perfil se carga
- [ ] Comunidades se cargan
- [ ] No hay errores en Logcat
- [ ] Performance aceptable

---

**Creado por:** Kiro AI Assistant  
**Estado:** ✅ Listo para testing en Android Studio  
**Siguiente:** Ejecutar app en emulador y verificar funcionamiento

