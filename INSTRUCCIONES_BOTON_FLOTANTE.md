# Control del Botón Flotante de Registro Reality

## 📋 Descripción

Sistema completo para controlar la visibilidad del botón flotante "Regístrate al Reality acá" desde el panel de administración de Django.

## 🎯 Características

- ✅ **Panel de control mejorado** con botones grandes y claros
- 🔄 **Actualización automática** cada 5 segundos en el frontend
- 🔒 **Protección de ruta** - Bloquea acceso a `/register-habilidosos` cuando está deshabilitado
- 🎨 **Interfaz visual** con emojis y colores distintivos
- 🔒 **Configuración centralizada** en una sola instancia

## 🚀 Cómo Usar

### Acceder al Panel de Control

1. Inicia sesión en el admin de Django:
   ```
   http://127.0.0.1:8000/admin/
   ```

2. Ve a la sección de configuraciones:
   ```
   http://127.0.0.1:8000/admin/site_settings/sitesettings/1/change/
   ```

### Controlar el Botón Flotante

En el panel verás dos botones grandes:

#### ✅ Habilitar Botón y Formulario
- **Color:** Verde
- **Acción:** Activa el botón flotante de registro y el formulario del Reality Show
- **Efecto:** Los usuarios verán el botón flotante en todas las páginas

#### 🚫 Deshabilitar Botón y Formulario
- **Color:** Rojo
- **Acción:** Oculta el botón flotante y desactiva el formulario del Reality Show
- **Efecto:** 
  - El botón flotante desaparece de la aplicación (máximo 5 segundos)
  - La página `/register-habilidosos` muestra mensaje de "Registro Cerrado"
  - Los usuarios son redirigidos automáticamente al feed
  - No se puede acceder al formulario por URL directa

### Actualización en Tiempo Real

- Los cambios se reflejan automáticamente en el frontend
- El sistema consulta la configuración cada 5 segundos
- No es necesario recargar la página manualmente
- El botón flotante desaparece inmediatamente cuando se deshabilita
- La página `/register-habilidosos` se bloquea y redirige al feed

## 🔧 Componentes Técnicos

### Backend (Django)

1. **Modelo:** `apps/site_settings/models.py`
   - Campo: `show_register_habilidosos_button`
   - Campo: `reality_form_enabled`

2. **Admin:** `apps/site_settings/admin.py`
   - Botones personalizados para habilitar/deshabilitar
   - URLs personalizadas para las acciones

3. **API:** `apps/site_settings/views.py`
   - Endpoint: `GET /api/site-settings/`
   - Respuesta JSON con configuraciones actuales

4. **Template:** `templates/admin/site_settings/change_form.html`
   - Interfaz visual mejorada con botones grandes

### Frontend (Next.js)

1. **Servicio:** `lib/services/site-settings.ts`
   - Función: `getSiteSettings()`
   - Consulta el endpoint del backend

2. **Componente:** `components/ui/floating-logo-and-menu-button.tsx`
   - Consulta la configuración al montar
   - Actualiza cada 30 segundos
   - Oculta el botón si está deshabilitado

## 📊 Flujo de Datos

```
Admin Django (Botón Click)
    ↓
Actualiza Base de Datos
    ↓
API Endpoint (/api/site-settings/)
    ↓
Frontend consulta cada 30s
    ↓
Componente FloatingLogoAndMenuButton
    ↓
Muestra/Oculta botón flotante
```

## 🧪 Pruebas

### Probar el Backend

```bash
cd backend
python test_site_settings.py
```

### Probar el API Endpoint

```bash
curl http://127.0.0.1:8000/api/site-settings/
```

Respuesta esperada:
```json
{
  "show_register_habilidosos_button": true,
  "reality_form_enabled": true,
  "updated_at": "2026-01-16T14:33:29.467735"
}
```

## 📝 Notas Importantes

- Solo existe una instancia de configuración (ID: 1)
- Los cambios son inmediatos en el backend
- El frontend puede tardar hasta 30 segundos en reflejar cambios
- Si hay error en la consulta, el botón se muestra por defecto

## 🎨 Personalización

Para cambiar el intervalo de actualización, edita el componente:

```typescript
// En components/ui/floating-logo-and-menu-button.tsx
const interval = setInterval(fetchSettings, 5000); // 5 segundos (recomendado)

// En app/register-habilidosos/page.tsx
// La página verifica el acceso al cargar y bloquea si está deshabilitado
```

## 🔗 Enlaces Útiles

- Panel Admin: http://127.0.0.1:8000/admin/site_settings/sitesettings/1/change/
- API Endpoint: http://127.0.0.1:8000/api/site-settings/
- Documentación Django Admin: https://docs.djangoproject.com/en/stable/ref/contrib/admin/
