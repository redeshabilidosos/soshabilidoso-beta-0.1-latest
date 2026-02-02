# Guía de Configuración por Entornos

**Fecha:** 28 de Enero de 2026  
**Estado:** Configuración lista para todos los entornos

---

## 🎯 ENTORNOS DISPONIBLES

### 1. Desarrollo Local (ACTUAL)
- Backend y frontend en localhost
- MySQL en localhost
- Solo accesible desde tu PC

### 2. Desarrollo con Xiaomi (WiFi)
- Backend y frontend accesibles por WiFi
- MySQL accesible por WiFi
- Xiaomi puede conectarse

### 3. Producción (Deploy)
- Backend en servidor remoto
- Frontend en servidor remoto
- MySQL en servidor remoto
- Accesible desde internet

---

## 📝 ARCHIVOS DE CONFIGURACIÓN

### backend/.env
Configuración actual del backend Django

### backend/.env.example
Plantilla con todas las opciones comentadas

### capacitor.config.ts
Configuración de Capacitor para la app móvil

---

## 🔄 CAMBIAR ENTRE ENTORNOS

### Entorno 1: Desarrollo Local (ACTUAL)

**backend/.env:**
```env
ALLOWED_HOSTS=127.0.0.1,localhost
BACKEND_URL=http://localhost:8000
DATABASE_HOST=127.0.0.1
DATABASE_PORT=3307
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:4000,http://127.0.0.1:4000
```

**capacitor.config.ts:**
```typescript
server: {
  url: 'http://localhost:4000',
  cleartext: true,
}
```

**Uso:**
- Desarrollo en PC
- Testing en navegador
- No requiere configuración adicional

---

### Entorno 2: Desarrollo con Xiaomi (WiFi)

**backend/.env:**
```env
ALLOWED_HOSTS=127.0.0.1,localhost,192.168.78.173
BACKEND_URL=http://192.168.78.173:8000
DATABASE_HOST=192.168.78.173  # Si quieres acceso a MySQL desde Xiaomi
DATABASE_PORT=3307
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:4000,http://127.0.0.1:4000,http://192.168.78.173:4000
```

**capacitor.config.ts:**
```typescript
server: {
  url: 'http://192.168.78.173:4000',
  cleartext: true,
}
```

**Pasos adicionales:**
1. Configurar firewall: `permitir-conexion-wifi.bat`
2. Si necesitas MySQL remoto: Ver `CONFIGURAR_MYSQL_WIFI.md`
3. Rebuild APK: `build-apk.bat`
4. Instalar en Xiaomi: `instalar-apk-scrcpy.bat`

**Uso:**
- Testing en Xiaomi real
- Desarrollo con hot reload
- Misma red WiFi requerida

---

### Entorno 3: Producción (Deploy)

**backend/.env:**
```env
DJANGO_SETTINGS_MODULE=sos_habilidoso.settings.production
SECRET_KEY=tu-secret-key-super-seguro-generado
DEBUG=false
ALLOWED_HOSTS=tu-dominio.com,www.tu-dominio.com,api.tu-dominio.com
BACKEND_URL=https://api.tu-dominio.com
DATABASE_HOST=tu-servidor-mysql.com
DATABASE_PORT=3306
DATABASE_PASSWORD=tu_password_seguro
CORS_ALLOWED_ORIGINS=https://tu-dominio.com,https://www.tu-dominio.com
```

**capacitor.config.ts:**
```typescript
server: {
  url: 'https://tu-dominio.com',
  cleartext: false,
  androidScheme: 'https',
}
```

**Pasos adicionales:**
1. Desplegar backend a servidor (Railway, DigitalOcean, AWS, etc.)
2. Desplegar frontend a servidor (Vercel, Netlify, etc.)
3. Configurar base de datos remota
4. Configurar SSL/HTTPS
5. Generar APK firmado
6. Publicar en Play Store

**Uso:**
- App en producción
- Usuarios reales
- Disponible 24/7

---

## 🚀 SCRIPTS PARA CAMBIAR ENTORNOS

### Script 1: Cambiar a Local
```bash
# cambiar-a-local.bat
@echo off
echo Configurando para desarrollo local...
copy backend\.env.local backend\.env
echo Listo! Reinicia el backend.
pause
```

### Script 2: Cambiar a WiFi
```bash
# cambiar-a-wifi.bat
@echo off
echo Configurando para desarrollo con Xiaomi...
copy backend\.env.wifi backend\.env
echo Listo! Reinicia el backend y rebuild APK.
pause
```

### Script 3: Cambiar a Producción
```bash
# cambiar-a-produccion.bat
@echo off
echo Configurando para produccion...
copy backend\.env.production backend\.env
echo Listo! Despliega al servidor.
pause
```

---

## 📋 CHECKLIST POR ENTORNO

### Desarrollo Local
- [x] backend/.env configurado
- [x] capacitor.config.ts configurado
- [x] MySQL corriendo en XAMPP
- [x] Servidores corriendo
- [x] App funciona en navegador

### Desarrollo con Xiaomi
- [ ] Firewall configurado
- [ ] backend/.env actualizado con IP
- [ ] capacitor.config.ts actualizado con IP
- [ ] APK rebuildeado
- [ ] APK instalado en Xiaomi
- [ ] App funciona en Xiaomi

### Producción
- [ ] Servidor backend desplegado
- [ ] Servidor frontend desplegado
- [ ] Base de datos remota configurada
- [ ] SSL/HTTPS configurado
- [ ] Dominio configurado
- [ ] APK firmado generado
- [ ] App publicada en Play Store

---

## 💡 TIPS

### Tip 1: Mantén Múltiples .env
Crea archivos separados:
- `.env.local` - Desarrollo local
- `.env.wifi` - Desarrollo con Xiaomi
- `.env.production` - Producción

Copia el que necesites a `.env`

### Tip 2: Variables de Entorno Dinámicas
Usa scripts para detectar IP automáticamente:
```bash
$IP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -like "*Wi-Fi*"}).IPAddress
```

### Tip 3: Git Ignore
Asegúrate que `.env` esté en `.gitignore`:
```
backend/.env
backend/.env.local
backend/.env.wifi
backend/.env.production
```

Pero mantén `.env.example` en el repo.

### Tip 4: Documentación
Documenta cualquier cambio de configuración en:
- `CHANGELOG.md`
- Comentarios en código
- README.md

---

## 🔒 SEGURIDAD

### Desarrollo Local
- ✅ Contraseña vacía OK
- ✅ DEBUG=true OK
- ✅ HTTP OK

### Desarrollo con Xiaomi
- ⚠️ Considera agregar contraseña
- ✅ DEBUG=true OK
- ✅ HTTP OK (solo red local)

### Producción
- ❌ Contraseña vacía NO
- ❌ DEBUG=true NO
- ❌ HTTP NO
- ✅ HTTPS obligatorio
- ✅ Contraseñas seguras
- ✅ SECRET_KEY único y seguro

---

## 📚 DOCUMENTACIÓN RELACIONADA

- `CONFIGURAR_MYSQL_WIFI.md` - Configurar MySQL para WiFi
- `PASOS_RAPIDOS_MYSQL_WIFI.md` - Pasos rápidos MySQL
- `CAPACITOR_MODO_HIBRIDO.md` - Explicación modo híbrido
- `WORKFLOW_DESARROLLO_SCRCPY.md` - Workflow con scrcpy

---

## 🎯 RESUMEN RÁPIDO

### Para usar en local (ACTUAL):
✅ Ya está configurado, no hagas nada

### Para usar con Xiaomi:
1. Descomentar líneas en `backend/.env`
2. Descomentar líneas en `capacitor.config.ts`
3. Ejecutar `build-apk.bat`
4. Instalar en Xiaomi

### Para producción:
1. Configurar servidor remoto
2. Actualizar todas las URLs
3. Configurar SSL
4. Generar APK firmado
5. Publicar

---

**Creado por:** Kiro AI Assistant  
**Estado:** ✅ Configuración lista para todos los entornos  
**Actual:** Desarrollo Local

