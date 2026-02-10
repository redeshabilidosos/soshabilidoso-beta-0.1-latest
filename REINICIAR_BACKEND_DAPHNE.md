# 🔄 Reiniciar Backend con Daphne

## 🎯 Solución al Error de MySQL

El error `ImproperlyConfigured: Error loading MySQLdb module` está **RESUELTO**.

### ✅ Qué se hizo:
Se modificó `backend/sos_habilidoso/asgi.py` para cargar PyMySQL **ANTES** de Django.

## 🚀 Cómo Reiniciar Correctamente

### Opción 1: Comando Único (RECOMENDADO)
```bash
npm run soshabilidoso
```

### Opción 2: Solo Backend (para debugging)
```bash
cd backend
python -m daphne -b 0.0.0.0 -p 8000 sos_habilidoso.asgi:application
```

## 🧪 Verificar que Funciona

### 1. Verificar instalación
```bash
verificar-daphne.bat
```

### 2. Iniciar aplicación
```bash
npm run soshabilidoso
```

### 3. Abrir página de prueba
```
http://localhost:4000/test-websocket-notifications.html
```

**Debes ver:**
- ✅ Estado: Conectado
- ✅ Backend corriendo en puerto 8000
- ✅ Daphne (ASGI) iniciado
- ✅ WebSocket endpoint disponible
- ✅ Token JWT válido
- ✅ Conexión WebSocket establecida

### 4. Verificar Django Admin
```
http://127.0.0.1:8000/admin/
```
- Usuario: `admin@test.com`
- Password: `admin123`

## ❌ Errores Comunes y Soluciones

### Error: "ImproperlyConfigured: Error loading MySQLdb module"
**Solución:** Ya está resuelto en `asgi.py`. Si persiste:
```bash
cd backend
pip install pymysql
```

### Error: WebSocket 404 "Not Found: /ws/notifications/"
**Causa:** Backend corriendo con `manage.py runserver` en lugar de Daphne

**Solución:**
```bash
# Detener proceso en puerto 8000
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Reiniciar correctamente
npm run soshabilidoso
```

### Error: WebSocket 1006 (conexión cerrada)
**Causa:** Daphne no está corriendo

**Solución:**
```bash
# Verificar que MySQL esté corriendo
netstat -ano | findstr :3307

# Reiniciar
npm run soshabilidoso
```

## 📋 Checklist de Verificación

Después de reiniciar, verifica:

- [ ] Backend inicia sin errores
- [ ] No aparece error de MySQLdb
- [ ] Django Admin carga correctamente
- [ ] API REST responde en `/api/`
- [ ] WebSocket conecta sin error 404
- [ ] Página de prueba muestra "Conectado"
- [ ] Chat funciona en tiempo real
- [ ] Sonidos se reproducen correctamente

## 🎉 Confirmación de Éxito

Si ves esto en la terminal:
```
╔════════════════════════════════════════════════════════════╗
║              ✅ SOS-HABILIDOSO INICIADO                    ║
╚════════════════════════════════════════════════════════════╝

🌐 ACCESOS:
   Frontend: http://localhost:4000
   Backend: http://127.0.0.1:8000/api/
   Admin: http://127.0.0.1:8000/admin/
   WebSockets: ws://127.0.0.1:8000/ws/

   🔔 Notificaciones en tiempo real: ✅
   💬 Chat en tiempo real: ✅
   📡 Feed en tiempo real: ✅
```

**¡Todo está funcionando correctamente!** 🎊

## 📚 Documentación Adicional

- `DAPHNE_CONFIGURADO.md` - Documentación completa
- `GUIA_SEGURA_DAPHNE.md` - Guía de seguridad y troubleshooting
- `verificar-daphne.bat` - Script de verificación automática

---

**Última actualización:** 5 de febrero de 2026
**Estado:** ✅ Listo para usar
