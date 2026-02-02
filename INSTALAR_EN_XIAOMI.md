# Instalar en Xiaomi por WiFi

**Fecha:** 28 de Enero de 2026  
**Estado:** ✅ APK actualizado con IP local

---

## ✅ CONFIGURACIÓN ACTUAL

### Red WiFi
- **IP de tu PC**: `192.168.78.173`
- **Puerto Frontend**: `4000`
- **URL configurada**: `http://192.168.78.173:4000`

### APK
- **Ubicación**: `android/app/build/outputs/apk/debug/app-debug.apk`
- **Tamaño**: 128 MB
- **Configuración**: Modo Híbrido con IP local

---

## 📱 PASOS PARA INSTALAR EN TU XIAOMI

### Paso 1: Configurar Firewall en PC (IMPORTANTE)

Tu PC necesita permitir conexiones desde tu Xiaomi:

**Opción A: Usar script automático (Recomendado)**
1. Click derecho en `permitir-conexion-wifi.bat`
2. Selecciona "Ejecutar como administrador"
3. Presiona cualquier tecla cuando te lo pida
4. Verás "FIREWALL CONFIGURADO EXITOSAMENTE"

**Opción B: Manual**
1. Abre "Windows Defender Firewall"
2. Click en "Configuración avanzada"
3. Click en "Reglas de entrada"
4. Click en "Nueva regla..."
5. Selecciona "Puerto" → Siguiente
6. TCP, puerto 4000 → Siguiente
7. Permitir la conexión → Siguiente
8. Marca todas las redes → Siguiente
9. Nombre: "SOS Habilidoso" → Finalizar

---

### Paso 2: Verificar que Servidores Estén Corriendo

Asegúrate que tanto backend como frontend estén corriendo:

```bash
# Verificar puertos
netstat -ano | findstr ":4000"
netstat -ano | findstr ":8000"
```

Si no están corriendo:
```bash
npm run soshabilidoso:simple
```

---

### Paso 3: Verificar Conexión desde tu Xiaomi

Antes de instalar el APK, verifica que tu Xiaomi puede acceder al servidor:

1. **Abre el navegador en tu Xiaomi**
2. **Ve a**: `http://192.168.78.173:4000`
3. **Deberías ver**: La página de SOS Habilidoso

Si no carga:
- ✅ Verifica que estén en la misma red WiFi
- ✅ Verifica que el firewall esté configurado
- ✅ Verifica que el frontend esté corriendo
- ✅ Intenta con la otra IP: `http://192.168.56.1:4000`

---

### Paso 4: Transferir APK a tu Xiaomi

**Opción A: Por cable USB**
1. Conecta tu Xiaomi a la PC con cable USB
2. En el Xiaomi, selecciona "Transferencia de archivos"
3. Copia `android/app/build/outputs/apk/debug/app-debug.apk`
4. Pégalo en la carpeta "Descargas" de tu Xiaomi

**Opción B: Por WiFi (usando app)**
1. Instala "Send Anywhere" o "ShareIt" en ambos dispositivos
2. Envía el APK desde PC a Xiaomi

**Opción C: Por Google Drive/Dropbox**
1. Sube el APK a Google Drive desde tu PC
2. Descárgalo en tu Xiaomi

**Opción D: Por WhatsApp**
1. Envíate el APK a ti mismo por WhatsApp
2. Descárgalo en tu Xiaomi

---

### Paso 5: Habilitar Instalación desde Fuentes Desconocidas

En tu Xiaomi (MIUI):

1. **Ve a Ajustes** → **Privacidad**
2. **Protección especial de aplicaciones**
3. **Instalar aplicaciones desconocidas**
4. Selecciona la app desde donde instalarás (ej: "Archivos", "Chrome", "WhatsApp")
5. Activa "Permitir desde esta fuente"

O más simple:
1. Intenta abrir el APK
2. Te pedirá permiso
3. Click en "Configuración"
4. Activa el permiso

---

### Paso 6: Instalar APK

1. **Abre el Explorador de Archivos** en tu Xiaomi
2. **Ve a Descargas** (o donde guardaste el APK)
3. **Toca el archivo** `app-debug.apk`
4. **Click en "Instalar"**
5. **Espera** (puede tardar 30-60 segundos)
6. **Click en "Abrir"** cuando termine

---

### Paso 7: Verificar Funcionamiento

Una vez instalada la app:

#### ✅ Primera Apertura
- [ ] La app abre (puede tardar 5-10 segundos la primera vez)
- [ ] Ves el splash screen (logo negro con verde neón)
- [ ] Carga la pantalla de login

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
- [ ] Scroll funciona suave
- [ ] Sidebar visible

#### ✅ Navegación
- [ ] Tap en "Comunidades" funciona
- [ ] Tap en "Perfil" funciona
- [ ] Navegación fluida
- [ ] Botones responden

#### ✅ Funcionalidades
- [ ] Crear post funciona
- [ ] Like funciona
- [ ] Comentarios funcionan
- [ ] Cámara funciona (si la usas)

---

## ⚠️ PROBLEMAS COMUNES

### Problema 1: App muestra pantalla blanca

**Causa**: No puede conectar con el servidor

**Soluciones**:

1. **Verifica que estén en la misma red WiFi**
   - PC y Xiaomi deben estar en la misma red

2. **Verifica que servidores estén corriendo**
   ```bash
   netstat -ano | findstr ":4000"
   ```

3. **Verifica firewall**
   - Ejecuta `permitir-conexion-wifi.bat` como administrador

4. **Prueba en navegador del Xiaomi**
   - Abre `http://192.168.78.173:4000` en Chrome
   - Si no carga, el problema es de red/firewall

5. **Intenta con la otra IP**
   - Edita `capacitor.config.ts`
   - Cambia a `http://192.168.56.1:4000`
   - Ejecuta `build-apk.bat`
   - Reinstala

---

### Problema 2: "No se puede instalar la aplicación"

**Causa**: Permisos o versión anterior

**Soluciones**:

1. **Desinstala versión anterior**
   - Ajustes → Apps → SOS Habilidoso → Desinstalar

2. **Habilita instalación desde fuentes desconocidas**
   - Sigue Paso 5 arriba

3. **Verifica espacio disponible**
   - Necesitas al menos 200 MB libres

---

### Problema 3: App se cierra inmediatamente

**Causa**: Error en la app o permisos

**Soluciones**:

1. **Reinstala la app**
   - Desinstala completamente
   - Instala de nuevo

2. **Verifica permisos**
   - Ajustes → Apps → SOS Habilidoso → Permisos
   - Permite todos los permisos necesarios

3. **Limpia cache**
   - Ajustes → Apps → SOS Habilidoso → Almacenamiento
   - Borrar cache

---

### Problema 4: Imágenes no cargan

**Causa**: Conexión lenta o problema de red

**Soluciones**:

1. **Verifica velocidad de WiFi**
   - Acércate al router

2. **Verifica que backend esté corriendo**
   ```bash
   netstat -ano | findstr ":8000"
   ```

3. **Reinicia la app**

---

### Problema 5: App muy lenta

**Causa**: Primera carga o conexión lenta

**Soluciones**:

1. **Espera la primera carga completa**
   - Primera vez puede tardar 10-20 segundos
   - Después será más rápida

2. **Verifica señal WiFi**
   - Acércate al router
   - Verifica que no haya interferencias

3. **Cierra otras apps**
   - Libera RAM en tu Xiaomi

---

## 🔄 ACTUALIZAR LA APP

Si haces cambios en el código:

### Opción 1: Sin rebuild (cambios en frontend/backend)
1. Los cambios se reflejan automáticamente
2. Solo cierra y abre la app en tu Xiaomi
3. O pull-to-refresh en la app

### Opción 2: Con rebuild (cambios en Capacitor)
1. Ejecuta `build-apk.bat`
2. Transfiere nuevo APK a Xiaomi
3. Instala sobre la versión anterior (no necesitas desinstalar)

---

## 🎯 TESTING COMPLETO

### Checklist de Funcionalidades

#### Autenticación
- [ ] Login funciona
- [ ] Logout funciona
- [ ] Registro funciona (si está habilitado)

#### Feed
- [ ] Posts se cargan
- [ ] Scroll infinito funciona
- [ ] Pull-to-refresh funciona
- [ ] Imágenes cargan
- [ ] Videos cargan (si hay)

#### Interacciones
- [ ] Like funciona
- [ ] Comentar funciona
- [ ] Compartir funciona
- [ ] Reacciones funcionan

#### Navegación
- [ ] Sidebar funciona
- [ ] Bottom navigation funciona (si hay)
- [ ] Transiciones suaves
- [ ] Back button funciona

#### Perfil
- [ ] Ver perfil propio
- [ ] Ver perfil de otros
- [ ] Editar perfil funciona
- [ ] Cambiar foto funciona

#### Comunidades
- [ ] Lista de comunidades carga
- [ ] Entrar a comunidad funciona
- [ ] Posts de comunidad cargan
- [ ] Crear post en comunidad funciona

#### Clips/Reels
- [ ] Videos cargan
- [ ] Reproducción funciona
- [ ] Scroll vertical funciona
- [ ] Comentarios funcionan

#### Chat/Mensajes
- [ ] Lista de chats carga
- [ ] Abrir chat funciona
- [ ] Enviar mensaje funciona
- [ ] Recibir mensaje funciona

#### Notificaciones
- [ ] Lista de notificaciones carga
- [ ] Tap en notificación funciona
- [ ] Marcar como leída funciona

#### Cámara (si usas)
- [ ] Abrir cámara funciona
- [ ] Tomar foto funciona
- [ ] Subir foto funciona

#### Performance
- [ ] App responde rápido
- [ ] Scroll suave
- [ ] Transiciones fluidas
- [ ] No hay lag notable

---

## 📊 MÉTRICAS DE ÉXITO

### ✅ Todo Funciona Si:
- App abre en menos de 10 segundos
- Login funciona correctamente
- Feed carga posts
- Navegación es fluida
- Imágenes cargan en menos de 3 segundos
- Interacciones responden inmediatamente
- No hay crashes

### ⚠️ Revisar Si:
- App tarda más de 15 segundos en abrir
- Imágenes no cargan
- Navegación es lenta
- Hay crashes frecuentes
- Funcionalidades no responden

---

## 🚀 PRÓXIMOS PASOS

### Después de Testing Exitoso

1. **Personalización**
   - [ ] Cambiar icono de la app
   - [ ] Cambiar splash screen
   - [ ] Ajustar colores

2. **Optimización**
   - [ ] Reducir tamaño de APK
   - [ ] Optimizar imágenes
   - [ ] Mejorar performance

3. **Producción**
   - [ ] Desplegar backend a servidor
   - [ ] Configurar dominio
   - [ ] Generar APK firmado
   - [ ] Publicar en Play Store

---

## 💡 TIPS PARA XIAOMI (MIUI)

### Optimización de Batería
MIUI es agresivo con apps en background:

1. **Ajustes** → **Batería y rendimiento**
2. **Ahorro de batería**
3. **Aplicaciones**
4. Busca "SOS Habilidoso"
5. Selecciona "Sin restricciones"

### Permisos de Autostart
Para que la app funcione bien:

1. **Ajustes** → **Apps**
2. **Administrar apps**
3. Busca "SOS Habilidoso"
4. **Autostart** → Activar
5. **Otras permisos** → Permitir todos

### Notificaciones
Si usas notificaciones:

1. **Ajustes** → **Notificaciones**
2. Busca "SOS Habilidoso"
3. Activa todas las notificaciones
4. Prioridad: Alta

---

## 📞 COMANDOS ÚTILES

### Verificar servidores corriendo
```bash
netstat -ano | findstr ":4000"
netstat -ano | findstr ":8000"
```

### Iniciar servidores
```bash
npm run soshabilidoso:simple
```

### Rebuild APK
```bash
build-apk.bat
```

### Verificar IP actual
```bash
ipconfig | findstr "IPv4"
```

---

**Creado por:** Kiro AI Assistant  
**Estado:** ✅ Listo para instalar en Xiaomi  
**IP configurada**: `192.168.78.173:4000`

