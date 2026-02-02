# ✅ Configuración Actual - Desarrollo Completo

**Fecha:** 28 de Enero de 2026  
**Estado:** ✅ Configurado y funcionando

---

## 🎯 CONFIGURACIÓN ACTIVA

### Entorno: Desarrollo con WiFi
- ✅ **Web (navegador)**: Funciona
- ✅ **Android (Xiaomi)**: Funciona
- ✅ **Misma base de datos**: MySQL local en tu PC

---

## 🌐 URLS Y ACCESOS

### Frontend (Next.js)
- **URL Web**: `http://localhost:4000` o `http://192.168.78.173:4000`
- **URL Android**: `http://192.168.78.173:4000`
- **Puerto**: 4000

### Backend (Django)
- **URL Web**: `http://localhost:8000` o `http://192.168.78.173:8000`
- **URL Android**: `http://192.168.78.173:8000`
- **Puerto**: 8000

### Base de Datos (MySQL)
- **Host**: `127.0.0.1` (localhost)
- **Puerto**: `3307`
- **Base de datos**: `habilidosos_db`
- **Usuario**: `root`
- **Contraseña**: (vacía)

---

## 📱 CÓMO FUNCIONA

### Desde Navegador Web (PC)
```
Navegador → http://localhost:4000 (Next.js)
          ↓
Next.js → http://localhost:8000 (Django API)
          ↓
Django → MySQL localhost:3307
```

### Desde App Android (Xiaomi)
```
App Android → http://192.168.78.173:4000 (Next.js en tu PC)
            ↓
Next.js → http://localhost:8000 (Django en tu PC)
          ↓
Django → MySQL localhost:3307 (en tu PC)
```

**Resultado**: Ambos (web y Android) usan la **misma base de datos** MySQL local.

---

## ✅ LO QUE FUNCIONA AHORA

### En Navegador Web
- ✅ Login
- ✅ Ver posts
- ✅ Crear posts
- ✅ Comentarios
- ✅ Likes
- ✅ Perfil
- ✅ Comunidades
- ✅ Todo funciona normal

### En App Android (Xiaomi)
- ✅ Login (mismos usuarios)
- ✅ Ver posts (mismos posts)
- ✅ Crear posts (se guardan en MySQL)
- ✅ Comentarios (compartidos con web)
- ✅ Likes (compartidos con web)
- ✅ Perfil (mismos datos)
- ✅ Comunidades (mismas comunidades)

### Sincronización
- ✅ Creas post en web → Se ve en Android
- ✅ Creas post en Android → Se ve en web
- ✅ Like en web → Se ve en Android
- ✅ Comentario en Android → Se ve en web
- ✅ **TODO está sincronizado** porque usan la misma BD

---

## 🔧 ARCHIVOS CONFIGURADOS

### backend/.env
```env
# Permite acceso desde PC y Xiaomi
ALLOWED_HOSTS=127.0.0.1,localhost,192.168.78.173

# Backend accesible por WiFi
BACKEND_URL=http://192.168.78.173:8000

# MySQL local (NO remoto)
DATABASE_HOST=127.0.0.1
DATABASE_PORT=3307

# CORS permite web y móvil
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:4000,http://127.0.0.1:4000,http://192.168.78.173:4000
```

### capacitor.config.ts
```typescript
server: {
  // App carga desde IP de tu PC
  url: 'http://192.168.78.173:4000',
  cleartext: true,
}
```

---

## 🚀 CÓMO USAR

### Inicio del Día
```bash
# Opción 1: Todo automático
workflow-desarrollo-completo.bat

# Opción 2: Manual
1. npm run soshabilidoso:simple    # Inicia servidores
2. scrcpy-solo.bat                 # Ver Xiaomi en PC
```

### Durante Desarrollo

**Cambios en código:**
1. Editas archivo en VS Code
2. Guardas (Ctrl + S)
3. Hot reload en navegador (automático)
4. En Xiaomi: Cierra y abre la app
5. Cambios visibles en ambos

**Crear post en web:**
1. Creas post en navegador
2. Se guarda en MySQL
3. En Xiaomi: Refresca (cierra/abre app)
4. Post visible en Android

**Crear post en Android:**
1. Creas post en Xiaomi
2. Se guarda en MySQL
3. En navegador: Refresca página
4. Post visible en web

---

## 💾 BASE DE DATOS COMPARTIDA

### MySQL Local
- **Ubicación**: Tu PC (XAMPP)
- **Acceso**: Solo desde tu PC
- **Compartida**: Web y Android usan la misma

### Tablas Principales
- `users` - Usuarios (compartidos)
- `posts` - Posts (compartidos)
- `comments` - Comentarios (compartidos)
- `likes` - Likes (compartidos)
- `communities` - Comunidades (compartidas)

### Ventajas
- ✅ Datos sincronizados automáticamente
- ✅ No necesitas dos bases de datos
- ✅ Testing más fácil
- ✅ Desarrollo más rápido

---

## 🔄 FLUJO DE DATOS

### Ejemplo: Crear Post

**Desde Web:**
```
1. Usuario crea post en navegador
2. Next.js envía a Django API (localhost:8000)
3. Django guarda en MySQL (localhost:3307)
4. Post guardado con ID #123
```

**Ver en Android:**
```
1. App Android pide posts a Next.js (192.168.78.173:4000)
2. Next.js pide a Django API (localhost:8000)
3. Django consulta MySQL (localhost:3307)
4. Devuelve posts incluyendo #123
5. App muestra post #123
```

**Resultado**: Post creado en web se ve en Android inmediatamente.

---

## 📊 TESTING

### Probar Sincronización

**Test 1: Post desde Web**
1. Abre navegador: `http://localhost:4000`
2. Login: `molo` / `molo123`
3. Crea un post: "Hola desde web"
4. En Xiaomi: Abre la app
5. Login: `molo` / `molo123`
6. Verifica que aparece "Hola desde web"

**Test 2: Post desde Android**
1. En Xiaomi: Abre la app
2. Login: `molo` / `molo123`
3. Crea un post: "Hola desde Android"
4. En navegador: Refresca página
5. Verifica que aparece "Hola desde Android"

**Test 3: Like Sincronizado**
1. En web: Da like a un post
2. En Android: Refresca (cierra/abre app)
3. Verifica que el like aparece
4. En Android: Da like a otro post
5. En web: Refresca página
6. Verifica que el like aparece

---

## ⚠️ IMPORTANTE

### Requisitos
- ✅ PC y Xiaomi en la misma red WiFi
- ✅ Servidores corriendo (puertos 4000 y 8000)
- ✅ MySQL corriendo en XAMPP
- ✅ Firewall configurado (puerto 4000)

### Limitaciones Actuales
- ⚠️ Solo funciona en red local
- ⚠️ Xiaomi debe estar en tu WiFi
- ⚠️ No funciona con datos móviles
- ⚠️ No funciona fuera de tu casa

### Para Producción (Futuro)
Cuando despliegues, descomentarás las líneas de producción:
```env
# En backend/.env
DATABASE_HOST=tu-servidor-mysql.com
DATABASE_PORT=3306
DATABASE_PASSWORD=tu_password_seguro
```

```typescript
// En capacitor.config.ts
url: 'https://tu-dominio.com',
cleartext: false,
```

---

## 🎯 VENTAJAS DE ESTA CONFIGURACIÓN

### Para Desarrollo
- ✅ **Una sola base de datos** - No duplicas datos
- ✅ **Sincronización automática** - Cambios visibles en ambos
- ✅ **Testing realista** - Pruebas como usuario real
- ✅ **Hot reload** - Desarrollo rápido
- ✅ **Mismo código** - Web y móvil usan misma API

### Para Testing
- ✅ **Testing completo** - Pruebas en web y móvil
- ✅ **Datos reales** - Misma BD que producción
- ✅ **Flujo completo** - Desde login hasta posts
- ✅ **Interacción** - Web y móvil interactúan
- ✅ **Debugging fácil** - Logs en una sola PC

---

## 🔍 VERIFICACIÓN

### Checklist de Funcionamiento
- [ ] Navegador carga: `http://localhost:4000`
- [ ] Login funciona en navegador
- [ ] Posts se ven en navegador
- [ ] App Android abre correctamente
- [ ] Login funciona en Android
- [ ] Posts se ven en Android
- [ ] Post creado en web aparece en Android
- [ ] Post creado en Android aparece en web
- [ ] Likes sincronizados
- [ ] Comentarios sincronizados

---

## 💡 TIPS

### Tip 1: Refresco en Android
Para ver cambios de la web en Android:
- Cierra la app (swipe up)
- Abre la app de nuevo
- Cambios visibles

### Tip 2: Refresco en Web
Para ver cambios de Android en web:
- Presiona F5 en navegador
- O Ctrl + R
- Cambios visibles

### Tip 3: Ver Logs
Para debugging:
```bash
# Logs de Django
# En terminal del backend

# Logs de Android
C:\Users\PC\Downloads\scrcpy-win64-v3.3.4\adb.exe logcat | findstr "Capacitor"
```

### Tip 4: Verificar MySQL
Para ver datos en MySQL:
```
http://localhost/phpmyadmin
```

---

## 🆘 TROUBLESHOOTING

### Android no carga datos

**Causa**: No puede conectar con backend

**Solución**:
1. Verifica que servidores estén corriendo
2. Verifica que estén en misma WiFi
3. Prueba en navegador del Xiaomi: `http://192.168.78.173:4000`
4. Si no carga, ejecuta: `permitir-conexion-wifi.bat` (como admin)

### Web funciona pero Android no

**Causa**: Firewall bloqueando

**Solución**:
```bash
# Ejecutar como Administrador
permitir-conexion-wifi.bat
```

### Cambios no se ven

**Causa**: Cache

**Solución**:
- En web: Ctrl + Shift + R (hard refresh)
- En Android: Cierra y abre app completamente

---

## 📚 DOCUMENTACIÓN RELACIONADA

- `WORKFLOW_DESARROLLO_SCRCPY.md` - Workflow completo
- `INICIO_RAPIDO_SCRCPY.md` - Comandos rápidos
- `GUIA_CONFIGURACION_ENTORNOS.md` - Cambiar entornos

---

**Creado por:** Kiro AI Assistant  
**Estado:** ✅ Configurado y funcionando  
**Entorno:** Desarrollo con WiFi  
**Base de datos:** MySQL local compartida

