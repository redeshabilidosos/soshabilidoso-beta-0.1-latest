# Guía Completa - SOS Habilidoso en Modo Híbrido

**Fecha:** 28 de Enero de 2026  
**Modo:** Híbrido (Web + Móvil + Base de Datos Compartida)

---

## 🎯 RESUMEN

Con **un solo comando** inicias toda la aplicación:
- ✅ Backend Django (puerto 8000)
- ✅ Frontend Next.js (puerto 4000)
- ✅ Conexión a MySQL (puerto 3307)
- ✅ Acceso desde navegador web
- ✅ Acceso desde dispositivo móvil Android
- ✅ Panel de administración Django
- ✅ **Misma base de datos para todo**

---

## 🚀 INICIO RÁPIDO

### Comando Principal

```bash
npm run soshabilidoso
```

Este comando inicia:
1. **Backend Django** en `http://127.0.0.1:8000`
2. **Frontend Next.js** en `http://localhost:4000`
3. Conecta a **MySQL** en puerto `3307`

### ¿Qué Puedes Hacer?

#### 1. Acceder desde el Navegador Web
```
http://localhost:4000
```
- Navega la app como siempre
- Login, posts, comunidades, streams, etc.

#### 2. Acceder al Panel de Django Admin
```
http://127.0.0.1:8000/admin/
```
- Usuario: `admin@test.com`
- Password: `admin123`
- Gestiona usuarios, posts, comunidades, etc.

#### 3. Acceder desde Dispositivo Móvil Android
```bash
# En otra terminal (mientras soshabilidoso está corriendo)
npx cap sync android
npx cap open android

# En Android Studio: Run ▶️
```
- La app móvil carga desde `http://localhost:4000`
- **Usa la misma base de datos**
- Cambios en web se ven en móvil y viceversa

---

## 📱 ARQUITECTURA DEL MODO HÍBRIDO

```
┌─────────────────────────────────────────────────────────────┐
│                    NAVEGADOR WEB                            │
│              http://localhost:4000                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTP Requests
                     │
┌────────────────────▼────────────────────────────────────────┐
│                  FRONTEND (Next.js)                         │
│                    Puerto: 4000                             │
│  - React Components                                         │
│  - PWA Service Worker                                       │
│  - API Client                                               │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ API Calls
                     │
┌────────────────────▼────────────────────────────────────────┐
│                  BACKEND (Django)                           │
│                    Puerto: 8000                             │
│  - REST API                                                 │
│  - Django Admin                                             │
│  - WebSockets                                               │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ SQL Queries
                     │
┌────────────────────▼────────────────────────────────────────┐
│              BASE DE DATOS (MySQL)                          │
│                    Puerto: 3307                             │
│  - habilidosos_clean (Reality Show)                         │
│  - habilidosos_db (Django)                                  │
└─────────────────────────────────────────────────────────────┘
                     ▲
                     │
                     │ Misma conexión
                     │
┌────────────────────┴────────────────────────────────────────┐
│                  APP MÓVIL (Android)                        │
│              Capacitor + WebView                            │
│  - Carga: http://localhost:4000                             │
│  - Plugins nativos (cámara, GPS, etc.)                      │
│  - Funciona como PWA                                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 FLUJO DE DATOS

### Ejemplo: Usuario crea un post

1. **Desde Web:**
   ```
   Usuario escribe post → Frontend (localhost:4000)
   → API call a Backend (127.0.0.1:8000/api/posts/)
   → Django guarda en MySQL (puerto 3307)
   → Respuesta a Frontend
   → Post aparece en feed
   ```

2. **Desde Móvil:**
   ```
   Usuario escribe post en app Android
   → WebView carga localhost:4000
   → Mismo flujo que web
   → Guarda en misma base de datos MySQL
   → Post visible en web y móvil
   ```

3. **Desde Django Admin:**
   ```
   Admin edita post en 127.0.0.1:8000/admin/
   → Django actualiza MySQL directamente
   → Cambios visibles en web y móvil al refrescar
   ```

### ✅ Ventaja: Una Sola Base de Datos

- Creas usuario en web → Aparece en móvil
- Publicas post en móvil → Aparece en web
- Admin edita en Django → Se refleja en ambos
- **Todo sincronizado en tiempo real**

---

## 🛠️ CONFIGURACIÓN ACTUAL

### 1. Backend Django (`backend/sos_habilidoso/settings.py`)

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'habilidosos_db',
        'USER': 'root',
        'PASSWORD': '',
        'HOST': '127.0.0.1',
        'PORT': '3307',
    }
}

# CORS para permitir frontend
CORS_ALLOWED_ORIGINS = [
    "http://localhost:4000",
    "http://127.0.0.1:4000",
]
```

### 2. Frontend Next.js (`lib/api-client.ts`)

```typescript
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Todas las llamadas van al backend Django
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### 3. Capacitor Config (`capacitor.config.ts`)

```typescript
const config: CapacitorConfig = {
  appId: 'com.soshabilidoso.app',
  appName: 'SOS Habilidoso',
  webDir: 'public',
  server: {
    // MODO HÍBRIDO: App carga desde servidor local
    url: 'http://localhost:4000',
    cleartext: true,
  },
};
```

### 4. MySQL (MariaDB/XAMPP)

```
Puerto: 3307
Bases de datos:
  - habilidosos_db (Django)
  - habilidosos_clean (Reality Show)
```

---

## 📋 WORKFLOW COMPLETO

### Desarrollo Diario

#### Paso 1: Iniciar Servicios
```bash
# Desde la raíz del proyecto
npm run soshabilidoso
```

Esto inicia:
- ✅ Backend Django en puerto 8000
- ✅ Frontend Next.js en puerto 4000
- ✅ Conexión a MySQL en puerto 3307

#### Paso 2: Verificar en Navegador
```
http://localhost:4000
```
- Login con usuario existente
- Navega la app
- Crea posts, comenta, etc.

#### Paso 3: Verificar Django Admin
```
http://127.0.0.1:8000/admin/
```
- Login: `admin@test.com` / `admin123`
- Ve usuarios, posts, comunidades
- Edita datos si necesitas

#### Paso 4: Probar en Android (Primera vez)
```bash
# En otra terminal (mientras soshabilidoso corre)
npx cap sync android
npx cap open android
```

En Android Studio:
1. Espera que cargue el proyecto
2. Presiona "Run" (▶️)
3. Selecciona emulador o dispositivo
4. La app se instala y abre
5. Carga contenido desde `http://localhost:4000`

#### Paso 5: Desarrollo Continuo

**Cambios en Frontend:**
```bash
# Editas archivo en components/ o app/
# Hot reload automático en navegador
# Refresca app en emulador (Ctrl+R)
```

**Cambios en Backend:**
```bash
# Editas archivo en backend/apps/
# Django recarga automáticamente
# Cambios disponibles inmediatamente
```

**Cambios en Base de Datos:**
```bash
# Editas en Django Admin
# O ejecutas migraciones
cd backend
venv312\Scripts\activate
python manage.py makemigrations
python manage.py migrate
```

---

## 🌐 ACCESOS RÁPIDOS

### Frontend (Next.js)
| URL | Descripción |
|-----|-------------|
| `http://localhost:4000` | App principal |
| `http://localhost:4000/login` | Login |
| `http://localhost:4000/feed` | Feed de posts |
| `http://localhost:4000/communities` | Comunidades |
| `http://localhost:4000/live` | Transmisiones |
| `http://localhost:4000/landing.html` | Landing page |

### Backend (Django)
| URL | Descripción |
|-----|-------------|
| `http://127.0.0.1:8000/admin/` | Panel admin |
| `http://127.0.0.1:8000/api/` | API REST |
| `http://127.0.0.1:8000/api/schema/` | Documentación API |
| `http://127.0.0.1:8000/api/posts/` | Posts endpoint |
| `http://127.0.0.1:8000/api/users/` | Users endpoint |

### Base de Datos (MySQL)
```bash
# Conectar con MySQL Workbench o phpMyAdmin
Host: 127.0.0.1
Port: 3307
User: root
Password: (vacío)
Database: habilidosos_db
```

---

## 📱 TESTING EN DISPOSITIVO MÓVIL

### Opción 1: Emulador Android (Recomendado para desarrollo)

```bash
# 1. Asegúrate que soshabilidoso esté corriendo
npm run soshabilidoso

# 2. En otra terminal
npx cap sync android
npx cap open android

# 3. En Android Studio: Run ▶️
```

**Ventajas:**
- ✅ Rápido para testing
- ✅ No necesitas dispositivo físico
- ✅ Fácil debugging
- ✅ Hot reload funciona

### Opción 2: Dispositivo Real (Para testing final)

#### Preparación:
1. **Encuentra tu IP local:**
   ```bash
   ipconfig
   # Busca "IPv4 Address" (ej: 192.168.1.100)
   ```

2. **Actualiza `capacitor.config.ts`:**
   ```typescript
   server: {
     url: 'http://192.168.1.100:4000', // Tu IP
     cleartext: true,
   }
   ```

3. **Habilita depuración USB en tu teléfono:**
   - Ajustes → Acerca del teléfono
   - Toca "Número de compilación" 7 veces
   - Ajustes → Opciones de desarrollador
   - Activa "Depuración USB"

4. **Conecta por USB y ejecuta:**
   ```bash
   npx cap sync android
   npx cap run android
   ```

**Ventajas:**
- ✅ Testing en hardware real
- ✅ Pruebas de cámara, GPS, sensores
- ✅ Performance real
- ✅ Testing de gestos táctiles

---

## 🔧 COMANDOS ÚTILES

### Iniciar Aplicación
```bash
npm run soshabilidoso              # Inicia todo (recomendado)
npm run soshabilidoso:simple       # Versión simple con concurrently
npm run soshabilidoso:js           # Versión con Node.js script
```

### Capacitor
```bash
npx cap sync                       # Sincronizar cambios
npx cap sync android               # Solo Android
npx cap open android               # Abrir en Android Studio
npx cap run android                # Build y ejecutar en dispositivo
```

### Backend
```bash
cd backend
venv312\Scripts\activate
python manage.py runserver         # Iniciar solo backend
python manage.py makemigrations    # Crear migraciones
python manage.py migrate           # Aplicar migraciones
python manage.py createsuperuser   # Crear admin
```

### Frontend
```bash
npm run dev                        # Iniciar solo frontend
npm run build                      # Build para producción
npm run lint                       # Verificar código
```

### Base de Datos
```bash
# Backup
mysqldump -u root -P 3307 habilidosos_db > backup.sql

# Restore
mysql -u root -P 3307 habilidosos_db < backup.sql
```

---

## 🎨 PERSONALIZACIÓN DE APP MÓVIL

### Cambiar Iconos

1. **Prepara tus iconos:**
   - `icon.png` (1024x1024)
   - `icon-foreground.png` (432x432)
   - `icon-background.png` (432x432)

2. **Colócalos en:**
   ```
   android/app/src/main/res/
   ├── mipmap-hdpi/
   ├── mipmap-mdpi/
   ├── mipmap-xhdpi/
   ├── mipmap-xxhdpi/
   └── mipmap-xxxhdpi/
   ```

3. **O usa herramienta:**
   ```bash
   npx capacitor-assets generate
   ```

### Cambiar Splash Screen

1. **Prepara imagen:**
   - `splash.png` (2732x2732)
   - Fondo oscuro con logo centrado

2. **Coloca en:**
   ```
   android/app/src/main/res/drawable/
   ```

3. **Configura en `capacitor.config.ts`:**
   ```typescript
   SplashScreen: {
     launchShowDuration: 2000,
     backgroundColor: "#000000",
     androidSplashResourceName: "splash",
   }
   ```

---

## 🚀 PREPARAR PARA PRODUCCIÓN

### Paso 1: Desplegar Backend

**Opción A: Railway**
```bash
# 1. Crea cuenta en railway.app
# 2. Conecta repositorio
# 3. Configura variables de entorno
# 4. Deploy automático
```

**Opción B: DigitalOcean**
```bash
# 1. Crea droplet Ubuntu
# 2. Instala Python, MySQL, Nginx
# 3. Clona repositorio
# 4. Configura gunicorn + nginx
```

### Paso 2: Desplegar Frontend

**Opción A: Vercel (Recomendado)**
```bash
# 1. Instala Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Obtén URL (ej: soshabilidoso.vercel.app)
```

**Opción B: Netlify**
```bash
# 1. Conecta repositorio en netlify.com
# 2. Configura build: npm run build
# 3. Deploy automático
```

### Paso 3: Actualizar Capacitor Config

```typescript
// capacitor.config.ts
const config: CapacitorConfig = {
  appId: 'com.soshabilidoso.app',
  appName: 'SOS Habilidoso',
  webDir: 'public',
  server: {
    // PRODUCCIÓN
    url: 'https://soshabilidoso.vercel.app',
    cleartext: false,
    androidScheme: 'https',
  },
};
```

### Paso 4: Generar APK Firmado

```bash
# 1. Sincronizar
npx cap sync android

# 2. Abrir Android Studio
npx cap open android

# 3. En Android Studio:
# Build → Generate Signed Bundle / APK
# Sigue el wizard para crear keystore
# Genera APK firmado
```

### Paso 5: Publicar en Play Store

1. Crea cuenta de desarrollador ($25 USD)
2. Crea nueva aplicación
3. Sube APK firmado
4. Completa información de la app
5. Publica

---

## 🔒 SEGURIDAD

### Desarrollo (Actual)
```typescript
// Permite HTTP para localhost
server: {
  url: 'http://localhost:4000',
  cleartext: true,
}
```

### Producción (Futuro)
```typescript
// Requiere HTTPS
server: {
  url: 'https://soshabilidoso.com',
  cleartext: false,
  androidScheme: 'https',
}
```

### Variables de Entorno

**Backend (.env):**
```bash
SECRET_KEY=tu-secret-key-segura
DEBUG=False
ALLOWED_HOSTS=soshabilidoso.com,www.soshabilidoso.com
DATABASE_URL=mysql://user:pass@host:3306/db
```

**Frontend (.env.local):**
```bash
NEXT_PUBLIC_API_URL=https://api.soshabilidoso.com
NEXT_PUBLIC_WS_URL=wss://api.soshabilidoso.com
```

---

## 🆘 TROUBLESHOOTING

### App móvil no carga

**Problema:** Pantalla blanca en emulador

**Solución:**
```bash
# 1. Verifica que soshabilidoso esté corriendo
npm run soshabilidoso

# 2. Verifica que frontend responda
curl http://localhost:4000

# 3. Sincroniza de nuevo
npx cap sync android --force

# 4. Limpia proyecto en Android Studio
Build → Clean Project
Build → Rebuild Project
```

### Cambios no se reflejan

**Problema:** Editas código pero no ves cambios

**Solución:**
```bash
# Frontend: Hot reload automático
# Solo guarda el archivo y espera

# Backend: Reinicia servidor
# Ctrl+C y npm run soshabilidoso de nuevo

# Móvil: Refresca app
# En emulador: Ctrl+R o Cmd+R
```

### Error de base de datos

**Problema:** Django no conecta a MySQL

**Solución:**
```bash
# 1. Verifica que MySQL esté corriendo
netstat -ano | findstr :3307

# 2. Verifica credenciales en backend/.env
DB_NAME=habilidosos_db
DB_USER=root
DB_PASSWORD=
DB_HOST=127.0.0.1
DB_PORT=3307

# 3. Prueba conexión
cd backend
venv312\Scripts\activate
python manage.py dbshell
```

### Error en Android Studio

**Problema:** Gradle build failed

**Solución:**
```bash
# 1. Limpia cache de Gradle
cd android
./gradlew clean

# 2. Sincroniza de nuevo
npx cap sync android

# 3. En Android Studio:
File → Invalidate Caches / Restart
```

---

## 📊 MONITOREO

### Ver Logs en Tiempo Real

**Frontend:**
```bash
# En la terminal donde corre npm run soshabilidoso
# Verás logs de Next.js en verde
```

**Backend:**
```bash
# En la misma terminal
# Verás logs de Django en azul
```

**Móvil:**
```bash
# En Android Studio: Logcat (parte inferior)
# O desde terminal:
adb logcat | grep -i capacitor
```

### Verificar Estado

```bash
# Puertos en uso
netstat -ano | findstr :4000  # Frontend
netstat -ano | findstr :8000  # Backend
netstat -ano | findstr :3307  # MySQL

# Procesos
tasklist | findstr python     # Django
tasklist | findstr node       # Next.js
```

---

## 🎯 RESUMEN FINAL

### ✅ Lo Que Tienes Ahora

1. **Un solo comando** inicia todo: `npm run soshabilidoso`
2. **Tres formas de acceso:**
   - Navegador web: `http://localhost:4000`
   - Django admin: `http://127.0.0.1:8000/admin/`
   - App móvil Android: Emulador o dispositivo
3. **Una sola base de datos** compartida por todos
4. **Modo Híbrido** configurado y funcionando
5. **Hot reload** en desarrollo
6. **PWA** con cache offline

### 🚀 Próximos Pasos

1. **HOY:** Probar en emulador Android
   ```bash
   npm run soshabilidoso
   # En otra terminal:
   npx cap open android
   ```

2. **ESTA SEMANA:** Testing exhaustivo
   - Todas las funcionalidades
   - Web y móvil
   - Crear, editar, eliminar datos

3. **PRÓXIMA SEMANA:** Personalización
   - Cambiar iconos
   - Cambiar splash screen
   - Ajustar permisos

4. **CUANDO ESTÉS LISTO:** Producción
   - Desplegar a servidor
   - Generar APK firmado
   - Publicar en Play Store

---

## 📚 DOCUMENTACIÓN ADICIONAL

- `CAPACITOR_MODO_HIBRIDO.md` - Explicación del modo híbrido
- `INTEGRACION_CAPACITOR_GUIA_COMPLETA.md` - Guía de integración
- `PROGRESO_INTEGRACION_CAPACITOR.md` - Estado actual
- `CAPACITOR_QUICK_START.md` - Inicio rápido

---

**Creado por:** Kiro AI Assistant  
**Fecha:** 28 de Enero de 2026  
**Estado:** ✅ Configurado y documentado  
**Comando principal:** `npm run soshabilidoso`

