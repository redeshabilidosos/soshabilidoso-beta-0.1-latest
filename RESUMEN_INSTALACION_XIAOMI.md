# ✅ Resumen - Instalar en Xiaomi

**Fecha:** 28 de Enero de 2026  
**Estado:** Todo listo para instalar

---

## 📱 PASOS RÁPIDOS

### 1. Configurar Firewall (SOLO PRIMERA VEZ)
```
Click derecho en: permitir-conexion-wifi.bat
→ Ejecutar como administrador
```

### 2. Verificar Servidores Corriendo
```bash
netstat -ano | findstr ":4000"
netstat -ano | findstr ":8000"
```

Si no están corriendo:
```bash
npm run soshabilidoso:simple
```

### 3. Probar Conexión desde Xiaomi
Abre el navegador en tu Xiaomi y ve a:
```
http://192.168.78.173:4000
```

Deberías ver la página de SOS Habilidoso.

### 4. Transferir APK a Xiaomi

**El APK está en tu escritorio**: `SOS-Habilidoso.apk`

**Opciones para transferir**:
- USB: Conecta Xiaomi → Copia APK a Descargas
- WhatsApp: Envíate el APK a ti mismo
- Google Drive: Sube y descarga
- ShareIt/Send Anywhere

### 5. Instalar en Xiaomi

1. Abre el APK en tu Xiaomi
2. Permite "Instalar desde fuentes desconocidas"
3. Instala
4. Abre la app

### 6. Login

```
Usuario: molo
Contraseña: molo123
```

---

## ✅ VERIFICACIÓN RÁPIDA

- [ ] Firewall configurado
- [ ] Servidores corriendo (puertos 4000 y 8000)
- [ ] Navegador del Xiaomi carga `http://192.168.78.173:4000`
- [ ] APK transferido a Xiaomi
- [ ] APK instalado
- [ ] App abre correctamente
- [ ] Login funciona
- [ ] Feed carga posts

---

## 🔧 CONFIGURACIÓN ACTUAL

### Red
- **IP PC**: `192.168.78.173`
- **Puerto**: `4000`
- **URL**: `http://192.168.78.173:4000`

### APK
- **Ubicación Desktop**: `C:\Users\PC\Desktop\SOS-Habilidoso.apk`
- **Ubicación Original**: `android\app\build\outputs\apk\debug\app-debug.apk`
- **Tamaño**: 128 MB
- **Modo**: Híbrido (carga desde servidor)

### Credenciales
- **Usuario**: `molo`
- **Contraseña**: `molo123`

---

## ⚠️ SI NO FUNCIONA

### Pantalla Blanca
1. Verifica que navegador del Xiaomi cargue `http://192.168.78.173:4000`
2. Si no carga, ejecuta `permitir-conexion-wifi.bat` como admin
3. Verifica que estén en la misma red WiFi

### No Instala
1. Desinstala versión anterior si existe
2. Habilita "Instalar desde fuentes desconocidas"
3. Verifica espacio disponible (necesitas 200 MB)

### Se Cierra
1. Reinstala la app
2. Permite todos los permisos
3. Desactiva optimización de batería para la app

---

## 📚 DOCUMENTACIÓN COMPLETA

- `INSTALAR_EN_XIAOMI.md` - Guía detallada paso a paso
- `APK_GENERADO_EXITOSAMENTE.md` - Info del APK
- `CAPACITOR_MODO_HIBRIDO.md` - Explicación del modo híbrido

---

## 🚀 SCRIPTS ÚTILES

- `build-apk.bat` - Rebuild APK
- `permitir-conexion-wifi.bat` - Configurar firewall
- `copiar-apk-a-escritorio.bat` - Copiar APK al escritorio

---

## 💡 TIPS XIAOMI (MIUI)

### Después de instalar:

1. **Desactiva optimización de batería**:
   - Ajustes → Batería → Apps → SOS Habilidoso → Sin restricciones

2. **Activa Autostart**:
   - Ajustes → Apps → SOS Habilidoso → Autostart → ON

3. **Permite notificaciones**:
   - Ajustes → Notificaciones → SOS Habilidoso → Activar todo

---

**¡Listo para probar!** 🎉

