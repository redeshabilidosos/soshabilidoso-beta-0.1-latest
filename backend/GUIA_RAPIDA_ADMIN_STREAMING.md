# 🚀 GUÍA RÁPIDA - ADMIN PANEL DE STREAMING

## ✅ ESTADO ACTUAL

El sistema de administración de streaming está **COMPLETAMENTE IMPLEMENTADO** con todas las funcionalidades solicitadas.

---

## 📦 CONFIGURACIÓN INICIAL

### 1. Registrar la App (✅ YA HECHO)

La app `apps.streaming` ya está registrada en:
- ✅ `backend/sos_habilidoso/settings.py` → INSTALLED_APPS
- ✅ `backend/sos_habilidoso/urls.py` → urlpatterns

### 2. Crear las Tablas en la Base de Datos

Ejecuta estos comandos en el directorio `backend/`:

```bash
# Opción 1: Script automático (RECOMENDADO)
python setup_streaming_system.py

# Opción 2: Comandos manuales
python manage.py makemigrations streaming
python manage.py migrate streaming
python manage.py migrate
```

### 3. Verificar la Instalación

```bash
python verify_streaming_admin.py
```

Este script verifica:
- ✅ Modelos registrados en el admin
- ✅ Características del admin configuradas
- ✅ Tablas creadas en la base de datos
- ✅ Relaciones entre modelos

---

## 🌐 ACCESO AL PANEL

### URL del Admin:
```
http://localhost:8000/admin/streaming/
```

### Secciones Disponibles:

1. **Stream sessions** → `/admin/streaming/streamsession/`
   - Ver todos los streams (live, ended, banned)
   - Estadísticas detalladas por stream
   - Análisis de audiencia
   - Resumen de ganancias

2. **Stream gifts** → `/admin/streaming/streamgift/`
   - Ver todos los regalos enviados
   - Filtrar por tipo y fecha
   - Ver montos y remitentes

3. **Stream viewers** → `/admin/streaming/streamviewer/`
   - Ver espectadores por stream
   - Banear/desbanear espectadores
   - Ver tiempos de entrada/salida

4. **Stream chat messages** → `/admin/streaming/streamchatmessage/`
   - Ver mensajes del chat
   - Moderar contenido
   - Eliminar mensajes inapropiados

5. **Stream reports** → `/admin/streaming/streamreport/`
   - Ver reportes de usuarios
   - Gestionar reportes (revisar, tomar acción, descartar)
   - Ver tipos de reportes

6. **Stream earnings** → `/admin/streaming/streamearnings/`
   - Ver ganancias por stream
   - Marcar pagos como completados
   - Ver comisiones de la plataforma

---

## 📊 MÉTRICAS DISPONIBLES

### Por cada Stream puedes ver:

#### 📈 Estadísticas Básicas:
- ✅ Duración del stream (en tiempo real si está live)
- ✅ Pico de espectadores simultáneos
- ✅ Total de espectadores únicos
- ✅ Total de mensajes del chat
- ✅ Total de regalos recibidos ($)

#### 🎁 Regalos Detallados:
- Cantidad por tipo (Corazón, Estrella, Rayo, Corona, Diamante, Regalo)
- Monto total por tipo
- Top 5 donadores

#### 👥 Análisis de Audiencia:
- Espectadores nuevos vs recurrentes
- Tiempo promedio de visualización
- Tasa de retención (%)
- Mensajes por espectador
- Regalos por espectador

#### 💬 Actividad del Chat:
- Total de mensajes
- Mensajes eliminados
- Tasa de moderación (%)

#### ⚠️ Reportes:
- Total de reportes
- Reportes pendientes
- Tipos de reportes

#### 💰 Ganancias:
- Total bruto
- Comisión de la plataforma (20%)
- Neto para el streamer
- Estado de pago

---

## 🎯 ACCIONES DISPONIBLES

### StreamSession (Sesiones):
- 🚫 **Banear streams** (múltiples)
- ✅ **Desbanear streams**
- ⏹️ **Finalizar streams** manualmente

### StreamViewer (Espectadores):
- 🚫 **Banear espectadores** (múltiples)
- ✅ **Desbanear espectadores**

### StreamChatMessage (Chat):
- 🗑️ **Eliminar mensajes** (moderación)

### StreamReport (Reportes):
- 👁️ **Marcar como revisado**
- ✅ **Marcar acción tomada**
- ❌ **Descartar reportes**

### StreamEarnings (Ganancias):
- 💰 **Marcar como pagado**

---

## 🔍 FILTROS Y BÚSQUEDAS

### Filtros Disponibles:
- Por estado (live/ended/banned)
- Por estado de ban
- Por fecha de inicio/envío/creación
- Por tipo de regalo
- Por tipo de reporte
- Por estado de pago

### Búsquedas:
- Por nombre de usuario (streamer, espectador, remitente)
- Por título del stream
- Por contenido del mensaje
- Por descripción del reporte

---

## 🎨 CARACTERÍSTICAS VISUALES

### Badges de Estado:
- 🔴 **LIVE** - Stream en vivo (rojo)
- ⚫ **BANNED** - Stream baneado (negro)
- ⚪ **ENDED** - Stream finalizado (gris)
- 🟢 **Activo** - Sin ban (verde)
- 🔴 **BANEADO** - Con ban (rojo)

### Iconos de Regalos:
- ❤️ Corazón - $1
- ⭐ Estrella - $5
- ⚡ Rayo - $10
- 👑 Corona - $25
- 💎 Diamante - $50
- 🎁 Regalo - $100

### Iconos de Reportes:
- 😡 Contenido Ofensivo
- 📧 Spam
- ⚠️ Acoso
- 🚫 Contenido Inapropiado
- ❓ Otro

---

## 🔧 SOLUCIÓN DE PROBLEMAS

### Error: "No such table: streaming_sessions"

**Solución:**
```bash
cd backend
python manage.py makemigrations streaming
python manage.py migrate streaming
```

### Error: "streaming is not a registered namespace"

**Solución:**
Verifica que `apps.streaming` esté en INSTALLED_APPS:
```python
# backend/sos_habilidoso/settings.py
INSTALLED_APPS = [
    # ...
    'apps.streaming',  # ← Debe estar aquí
    # ...
]
```

### Error: "No module named 'apps.streaming'"

**Solución:**
Verifica que exista el archivo `backend/apps/streaming/__init__.py`

### No aparece la sección "Streaming" en el admin

**Solución:**
1. Verifica que los modelos estén registrados:
   ```bash
   python verify_streaming_admin.py
   ```
2. Reinicia el servidor Django
3. Limpia la caché del navegador

---

## 📚 DOCUMENTACIÓN COMPLETA

Para más detalles, consulta:
- `backend/ADMIN_STREAMING_MONITOREO_COMPLETO.md` - Documentación completa
- `backend/apps/streaming/models.py` - Modelos de datos
- `backend/apps/streaming/admin.py` - Configuración del admin
- `backend/apps/streaming/views.py` - API endpoints
- `backend/apps/streaming/serializers.py` - Serializadores

---

## 🎯 ENDPOINTS API

### Sesiones de Stream:
```
GET    /api/streaming/sessions/          # Listar streams
POST   /api/streaming/sessions/          # Crear stream
GET    /api/streaming/sessions/{id}/     # Detalle de stream
PUT    /api/streaming/sessions/{id}/     # Actualizar stream
DELETE /api/streaming/sessions/{id}/     # Eliminar stream
```

### Regalos:
```
GET    /api/streaming/gifts/             # Listar regalos
POST   /api/streaming/gifts/             # Enviar regalo
```

### Espectadores:
```
GET    /api/streaming/viewers/           # Listar espectadores
POST   /api/streaming/viewers/           # Registrar espectador
```

### Chat:
```
GET    /api/streaming/chat/              # Listar mensajes
POST   /api/streaming/chat/              # Enviar mensaje
```

### Reportes:
```
GET    /api/streaming/reports/           # Listar reportes
POST   /api/streaming/reports/           # Crear reporte
```

### Ganancias:
```
GET    /api/streaming/earnings/          # Listar ganancias
```

---

## ✅ CHECKLIST DE VERIFICACIÓN

Antes de usar el sistema, verifica:

- [ ] App registrada en INSTALLED_APPS
- [ ] URLs registradas en urls.py
- [ ] Migraciones creadas (`makemigrations`)
- [ ] Migraciones aplicadas (`migrate`)
- [ ] Tablas creadas en la base de datos
- [ ] Admin accesible en `/admin/streaming/`
- [ ] Modelos visibles en el admin
- [ ] API endpoints funcionando

---

## 🎉 ¡LISTO PARA USAR!

Una vez completados los pasos de configuración, el sistema está listo para:

1. **Monitorear streams en tiempo real**
2. **Analizar audiencia y engagement**
3. **Gestionar ganancias y pagos**
4. **Moderar contenido y chat**
5. **Gestionar reportes de usuarios**
6. **Banear/desbanear usuarios y streams**

---

**Fecha:** 24 de Enero de 2026  
**Versión:** 1.0  
**Estado:** ✅ COMPLETADO
