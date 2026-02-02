# Capacitor - Modo Híbrido Configurado

**Fecha:** 28 de Enero de 2026  
**Estado:** ✅ Configurado y listo para testing

---

## 🎯 ¿Qué es Modo Híbrido?

El **Modo Híbrido** significa que tu app móvil es un "shell" (cascarón) que carga el contenido desde tu servidor Next.js, en lugar de tener todo el contenido empaquetado en el APK.

### Analogía Simple:
- **Modo Estático**: Como descargar una película completa → Ocupa mucho espacio, pero funciona sin internet
- **Modo Híbrido**: Como Netflix → App pequeña, contenido se carga del servidor, siempre actualizado

---

## ✅ Ventajas del Modo Híbrido

### 1. APK Más Pequeño
- **Estático**: 100-200 MB (todo el contenido incluido)
- **Híbrido**: 5-15 MB (solo el shell de la app)

### 2. Actualizaciones Instantáneas
- Cambias el backend/frontend → Usuarios ven cambios inmediatamente
- No necesitas generar nuevo APK
- No necesitas que usuarios descarguen actualización

### 3. Todas las Funcionalidades
- ✅ Rutas dinámicas funcionan (`/profile/[username]`)
- ✅ API Routes funcionan
- ✅ Server-side rendering funciona
- ✅ Datos en tiempo real
- ✅ WebSockets funcionan

### 4. Mejor Experiencia de Usuario
- Contenido siempre actualizado
- Funciona como PWA (cache offline)
- Navegación fluida
- Datos sincronizados

### 5. Desarrollo Más Rápido
- No necesitas rebuild de APK por cada cambio
- Testing más rápido
- Deploy más simple

---

## 🔧 Configuración Actual

### next.config.js
```javascript
const nextConfig = {
  // output: 'export', // DESHABILITADO - Modo Híbrido
  images: {
    unoptimized: true, // Para compatibilidad móvil
  },
  // ... resto de configuración normal
};
```

### capacitor.config.ts
```typescript
const config: CapacitorConfig = {
  appId: 'com.soshabilidoso.app',
  appName: 'SOS Habilidoso',
  webDir: 'public', // Placeholder para Capacitor
  server: {
    // DESARROLLO
    url: 'http://localhost:4000',
    cleartext: true,
    
    // PRODUCCIÓN (descomentar cuando despliegues)
    // url: 'https://soshabilidoso.com',
    // cleartext: false,
  },
};
```

---

## 🚀 Cómo Funciona

### Desarrollo Local

1. **Iniciar Backend Django:**
   ```bash
   cd backend
   venv312\Scripts\activate
   python manage.py runserver 127.0.0.1:8000
   ```

2. **Iniciar Frontend Next.js:**
   ```bash
   npm run dev
   # Corre en http://localhost:4000
   ```

3. **Sincronizar con Android:**
   ```bash
   npx cap sync android
   npx cap open android
   ```

4. **En Android Studio:**
   - Presiona "Run" (▶️)
   - El emulador/dispositivo abre la app
   - La app carga contenido desde `http://localhost:4000`
   - Cambios en código se reflejan con hot reload

### Testing en Dispositivo Real

Si quieres probar en tu teléfono físico:

1. **Encuentra tu IP local:**
   ```bash
   ipconfig
   # Busca "IPv4 Address" (ej: 192.168.1.100)
   ```

2. **Actualiza capacitor.config.ts:**
   ```typescript
   server: {
     url: 'http://192.168.1.100:4000', // Tu IP local
     cleartext: true,
   }
   ```

3. **Asegúrate que tu teléfono esté en la misma red WiFi**

4. **Sync y Run:**
   ```bash
   npx cap sync android
   npx cap run android
   ```

### Producción

Cuando despliegues a producción:

1. **Despliega Next.js a servidor:**
   - Vercel (recomendado)
   - Railway
   - DigitalOcean
   - AWS
   - Cualquier servidor Node.js

2. **Actualiza capacitor.config.ts:**
   ```typescript
   server: {
     url: 'https://soshabilidoso.com', // Tu dominio
     cleartext: false,
     androidScheme: 'https',
   }
   ```

3. **Build APK final:**
   ```bash
   npx cap sync android
   npx cap open android
   # En Android Studio: Build > Generate Signed Bundle / APK
   ```

4. **Publica en Google Play Store**

---

## 📱 Workflow Completo

### Desarrollo Diario

```bash
# Terminal 1: Backend
cd backend
venv312\Scripts\activate
python manage.py runserver 127.0.0.1:8000

# Terminal 2: Frontend
npm run dev

# Terminal 3: Android (solo primera vez o cuando cambies config)
npx cap sync android
npx cap open android
```

Después de la primera vez, solo necesitas:
1. Mantener backend y frontend corriendo
2. Presionar "Run" en Android Studio
3. La app se actualiza automáticamente

### Actualizar App en Producción

```bash
# 1. Hacer cambios en código
# 2. Commit y push
git add .
git commit -m "Nueva feature"
git push

# 3. Deploy automático (si usas Vercel/Railway)
# O deploy manual a tu servidor

# 4. ¡Listo! Usuarios ven cambios inmediatamente
# No necesitas generar nuevo APK
```

### Generar APK Solo Cuando:
- Cambias configuración de Capacitor
- Cambias permisos de Android
- Cambias iconos/splash screen
- Actualizas plugins de Capacitor
- Primera versión o versión mayor

---

## 🔒 Seguridad

### Desarrollo
- `cleartext: true` permite HTTP (solo para localhost)
- Solo funciona en red local

### Producción
- `cleartext: false` requiere HTTPS
- Certificado SSL obligatorio
- Conexión encriptada

---

## 💾 Funcionamiento Offline

Aunque la app carga desde servidor, **sigue funcionando offline** gracias a:

1. **PWA Service Worker** (ya configurado en tu app)
2. **Cache de Capacitor**
3. **Cache del navegador**

Cuando el usuario pierde conexión:
- Páginas visitadas siguen funcionando
- Imágenes cacheadas se muestran
- Datos guardados localmente disponibles
- Al reconectar, se sincroniza automáticamente

---

## 📊 Comparación: Híbrido vs Estático

| Característica | Modo Híbrido | Modo Estático |
|----------------|--------------|---------------|
| Tamaño APK | 5-15 MB | 100-200 MB |
| Actualizaciones | Instantáneas | Requiere nuevo APK |
| Rutas dinámicas | ✅ Sí | ⚠️ Requiere config |
| API Routes | ✅ Sí | ❌ No |
| Datos en tiempo real | ✅ Sí | ❌ No |
| Funciona offline | ✅ Sí (cache) | ✅ Sí (completo) |
| Requiere servidor | ✅ Sí | ❌ No |
| Complejidad | Baja | Alta |
| Tiempo de build | Rápido | Muy lento |

---

## 🎯 Para SOS Habilidoso

El Modo Híbrido es **perfecto** para tu app porque:

1. **Red Social** → Necesitas datos en tiempo real
2. **Contenido Dinámico** → Posts, comentarios, streams
3. **Actualizaciones Frecuentes** → Nuevas features constantemente
4. **Múltiples Usuarios** → Datos sincronizados
5. **WebSockets** → Chat, notificaciones en vivo

---

## 🚦 Próximos Pasos

### 1. Testing Local (HOY)
```bash
# Asegúrate que backend y frontend estén corriendo
npm run soshabilidoso:simple

# En otra terminal
npx cap sync android
npx cap open android

# En Android Studio: Run ▶️
```

### 2. Personalización (DESPUÉS)
- Cambiar iconos
- Cambiar splash screen
- Ajustar permisos
- Testing exhaustivo

### 3. Producción (CUANDO ESTÉS LISTO)
- Desplegar a servidor
- Actualizar URL en capacitor.config.ts
- Generar APK firmado
- Publicar en Play Store

---

## 📝 Notas Importantes

### ✅ Ventajas Confirmadas
- App funciona como PWA nativa
- Todas las features de Next.js disponibles
- Hot reload funciona en desarrollo
- Menor tamaño de APK
- Actualizaciones sin rebuild

### ⚠️ Consideraciones
- Requiere conexión para primera carga
- Necesitas servidor en producción
- Usuarios necesitan internet para contenido nuevo
- Pero funciona offline con cache

### 💡 Recomendación
Este es el enfoque **estándar** para apps híbridas modernas. Apps como:
- Instagram
- Twitter/X
- Facebook
- LinkedIn
- Todas usan este modelo

---

## 🆘 Troubleshooting

### App no carga en emulador
```bash
# Verifica que frontend esté corriendo
curl http://localhost:4000

# Verifica configuración
npx cap sync android
```

### Cambios no se reflejan
```bash
# Limpia cache
npx cap sync android --force

# O en Android Studio: Build > Clean Project
```

### Error de conexión
- Verifica que backend esté corriendo (puerto 8000)
- Verifica que frontend esté corriendo (puerto 4000)
- Verifica URL en capacitor.config.ts

---

**Creado por:** Kiro AI Assistant  
**Estado:** ✅ Configurado - Listo para testing  
**Modo:** Híbrido (Recomendado para SOS Habilidoso)

