# 🏢 Configuración para Trabajo Híbrido

**Escenario:** Trabajas desde casa Y desde la oficina

---

## 🎯 PROBLEMA

La configuración `'root'@'192.168.78.%'` solo funciona en tu red de casa (192.168.78.x).

Cuando estés en la oficina (ejemplo: 192.168.1.x), no podrás conectar.

---

## ✅ SOLUCIÓN RECOMENDADA

### Opción A: Acceso Universal (Más Simple)

**Configuración MySQL:**
```sql
-- Permite acceso desde cualquier red
CREATE USER 'root'@'%' IDENTIFIED BY 'password_segura';
GRANT ALL PRIVILEGES ON habilidosos_db.* TO 'root'@'%';
FLUSH PRIVILEGES;
```

**Ventajas:**
- ✅ Funciona en casa
- ✅ Funciona en oficina
- ✅ Funciona en cualquier WiFi
- ✅ Una sola configuración

**Seguridad:**
- ⚠️ Usa contraseña fuerte
- ⚠️ Firewall protege el puerto
- ⚠️ Solo tu red local puede acceder

---

### Opción B: Múltiples Redes (Más Seguro)

**Configuración MySQL:**
```sql
-- Casa
CREATE USER 'root'@'192.168.78.%' IDENTIFIED BY '';
GRANT ALL PRIVILEGES ON habilidosos_db.* TO 'root'@'192.168.78.%';

-- Oficina (ajusta según tu red de oficina)
CREATE USER 'root'@'192.168.1.%' IDENTIFIED BY '';
GRANT ALL PRIVILEGES ON habilidosos_db.* TO 'root'@'192.168.1.%';

-- Localhost
CREATE USER 'root'@'127.0.0.1' IDENTIFIED BY '';
GRANT ALL PRIVILEGES ON habilidosos_db.* TO 'root'@'127.0.0.1';

FLUSH PRIVILEGES;
```

**Ventajas:**
- ✅ Más seguro (solo redes específicas)
- ✅ Control granular

**Desventajas:**
- ⚠️ Necesitas saber IP de cada red
- ⚠️ Más configuración

---

## 🚀 IMPLEMENTACIÓN RÁPIDA

### Paso 1: Ejecutar SQL

**En phpMyAdmin** (`http://localhost/phpmyadmin`):

```sql
-- Opción Simple (Recomendada)
CREATE USER IF NOT EXISTS 'root'@'%' IDENTIFIED BY 'MiPass2024';
GRANT ALL PRIVILEGES ON habilidosos_db.* TO 'root'@'%';
FLUSH PRIVILEGES;
```

### Paso 2: Actualizar .env

**backend/.env:**
```env
DATABASE_HOST=127.0.0.1
DATABASE_PASSWORD=MiPass2024
```

**Nota:** Usa `127.0.0.1` cuando trabajes en tu PC directamente.

### Paso 3: Para Xiaomi

Cuando uses la app en Xiaomi, el backend se conecta a MySQL usando la IP de tu PC:

**Casa:**
- IP PC: `192.168.78.173`
- Xiaomi conecta a: `http://192.168.78.173:4000`
- Backend conecta a MySQL: `127.0.0.1:3307` (local)

**Oficina:**
- IP PC: `192.168.1.XXX` (la que tenga en oficina)
- Xiaomi conecta a: `http://192.168.1.XXX:4000`
- Backend conecta a MySQL: `127.0.0.1:3307` (local)

---

## 🔄 WORKFLOW HÍBRIDO

### En Casa

1. **Conecta tu PC a WiFi de casa**
2. **Verifica tu IP:**
   ```bash
   ipconfig | findstr "IPv4"
   # Ejemplo: 192.168.78.173
   ```
3. **Actualiza capacitor.config.ts:**
   ```typescript
   server: {
     url: 'http://192.168.78.173:4000',
   }
   ```
4. **Rebuild APK:**
   ```bash
   actualizar-app-rapido.bat
   ```

### En Oficina

1. **Conecta tu PC a WiFi de oficina**
2. **Verifica tu IP:**
   ```bash
   ipconfig | findstr "IPv4"
   # Ejemplo: 192.168.1.105
   ```
3. **Actualiza capacitor.config.ts:**
   ```typescript
   server: {
     url: 'http://192.168.1.105:4000',
   }
   ```
4. **Rebuild APK:**
   ```bash
   actualizar-app-rapido.bat
   ```

---

## 💡 SOLUCIÓN AUTOMÁTICA

Para evitar cambiar la IP manualmente, crea un script:

<function_calls>
<invoke name="fsWrite">
<parameter name="path">actualizar-ip-automatica.batff
title Actualizar IP Automatica
color 0A

echo ========================================
echo   Detectar IP y Actualizar Config
echo ========================================
echo.

REM Detectar IP de WiFi
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4" ^| findstr /v "127.0.0.1"') do (
    set IP=%%a
    goto :found
)

:found
REM Limpiar espacios
set IP=%IP: =%

echo IP detectada: %IP%
echo.

REM Actualizar capacitor.config.ts
echo Actualizando capacitor.config.ts...
powershell -Command "(Get-Content capacitor.config.ts) -replace 'url: ''http://[0-9.]+:4000''', 'url: ''http://%IP%:4000''' | Set-Content capacitor.config.ts"

REM Actualizar .env
echo Actualizando backend/.env...
powershell -Command "(Get-Content backend\.env) -replace 'BACKEND_URL=http://[0-9.]+:8000', 'BACKEND_URL=http://%IP%:8000' | Set-Content backend\.env"
powershell -Command "(Get-Content backend\.env) -replace 'ALLOWED_HOSTS=.*', 'ALLOWED_HOSTS=127.0.0.1,localhost,%IP%' | Set-Content backend\.env"

echo.
echo ========================================
echo   CONFIGURACION ACTUALIZADA
echo ========================================
echo.
echo IP: %IP%
echo Frontend: http://%IP%:4000
echo Backend: http://%IP%:8000
echo.
echo Siguiente paso:
echo 1. Ejecuta: actualizar-app-rapido.bat
echo 2. Reinicia backend
echo.
pause
