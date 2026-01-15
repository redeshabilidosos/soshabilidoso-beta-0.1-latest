# Configuración de MySQL para SOS-HABILIDOSO

## 🚀 Configuración Rápida

### 1. Asegúrate de que MySQL esté corriendo en el puerto 3307

```bash
# Verificar que MySQL esté corriendo
mysql --version

# Conectar a MySQL
mysql -u root -p -P 3307
```

### 2. Crear la base de datos

```sql
CREATE DATABASE IF NOT EXISTS habilidosos_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

O ejecutar el script SQL completo:

```bash
mysql -u root -p -P 3307 < backend/scripts/create_habilidosos_db.sql
```

### 3. Instalar dependencias de Python

```bash
cd backend
pip install mysqlclient pymysql
```

### 4. Configurar variables de entorno

El archivo `.env` ya está configurado con:
```
DATABASE_NAME=habilidosos_db
DATABASE_USER=root
DATABASE_PASSWORD=
DATABASE_HOST=127.0.0.1
DATABASE_PORT=3307
```

### 5. Ejecutar migraciones

```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Crear superusuario

```bash
python manage.py createsuperuser
```

O usar el script automático:
```bash
python create_test_admin.py
```

Credenciales por defecto:
- Email: admin@test.com
- Password: admin123

### 7. Iniciar el servidor

```bash
python manage.py runserver
```

## 📊 Funcionalidades del Panel de Administración

### 1. Gestión de Usuarios
- ✅ Ver todos los usuarios
- 🚫 **Banear/Desbanear usuarios**
- ✓ Verificar emails
- 👤 Convertir en staff
- 📊 Ver estadísticas de usuarios

### 2. Sistema de Publicidad
- 📢 Crear y gestionar anuncios
- 🎯 Segmentación por ubicación, edad, intereses
- 💰 Configurar presupuestos y costos (CPC, CPM)
- 📊 Ver estadísticas (impresiones, clicks, CTR)
- ✅ Aprobar/Rechazar anuncios
- ⏸️ Pausar/Activar campañas

### 3. Sistema Financiero
- 💳 Ver todas las transacciones
- 💰 Gestionar billeteras de usuarios
- 📈 Ver ingresos de la plataforma
- 💵 Gestionar suscripciones
- 📊 Dashboard con estadísticas financieras:
  - Ingresos totales
  - Ingresos del mes
  - Transacciones del día
  - Usuarios activos

### 4. Otras Funcionalidades
- 📝 Gestionar publicaciones
- 👥 Gestionar comunidades
- 💬 Ver mensajes
- 🔔 Gestionar notificaciones
- 📰 Gestionar noticias (Habil News)
- 🏷️ Gestionar clasificados

## 🎨 Acceso al Panel

URL: http://127.0.0.1:8000/admin/

Credenciales:
- Email: admin@test.com
- Password: admin123

## 📊 Dashboard Personalizado

El panel de administración incluye un dashboard con:

- **Ingresos Totales**: Suma de todos los ingresos de la plataforma
- **Ingresos del Mes**: Ingresos del mes actual
- **Usuarios Totales**: Cantidad total de usuarios registrados
- **Usuarios Activos**: Usuarios no baneados
- **Anuncios Activos**: Campañas publicitarias en curso
- **Transacciones del Día**: Transacciones realizadas hoy

## 🔧 Solución de Problemas

### Error: "Can't connect to MySQL server"
```bash
# Verificar que MySQL esté corriendo en el puerto 3307
netstat -an | findstr 3307

# O en Linux/Mac
lsof -i :3307
```

### Error: "Access denied for user 'root'"
- Verifica la contraseña en el archivo `.env`
- Asegúrate de que el usuario root tenga permisos

### Error: "Unknown database 'habilidosos_db'"
```bash
# Crear la base de datos manualmente
mysql -u root -p -P 3307 -e "CREATE DATABASE habilidosos_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### Error: "No module named 'MySQLdb'"
```bash
pip install mysqlclient
# O si falla:
pip install pymysql
```

## 📝 Modelos Creados

### Publicidad (apps.advertising)
- `Advertisement`: Anuncios publicitarios
- `AdClick`: Clicks en anuncios

### Finanzas (apps.finance)
- `Transaction`: Transacciones financieras
- `UserWallet`: Billeteras de usuarios
- `Subscription`: Suscripciones
- `PlatformRevenue`: Ingresos de la plataforma

### Usuarios (apps.users)
- `User`: Usuarios del sistema
- `Follow`: Seguidores
- `FriendRequest`: Solicitudes de amistad
- `Friendship`: Amistades

## 🎯 Próximos Pasos

1. Configurar pasarelas de pago (Stripe, PayPal, etc.)
2. Implementar sistema de notificaciones por email
3. Crear reportes financieros avanzados
4. Implementar sistema de comisiones automáticas
5. Agregar gráficos y visualizaciones en el dashboard

## 📞 Soporte

Para más información, consulta la documentación completa o contacta al equipo de desarrollo.
