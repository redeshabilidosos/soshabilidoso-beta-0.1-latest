# 🔗 Guía de Integración Backend-Frontend

## ✅ Integración Completa Implementada

### **🎯 Funcionalidades Integradas:**

1. **🔐 Autenticación completa:**
   - Login/Register con validaciones
   - JWT tokens automáticos
   - Refresh token automático
   - Gestión de sesiones

2. **📝 Posts integrados:**
   - Crear, editar, eliminar posts
   - Reacciones (like, celebration, golazo)
   - Comentarios anidados
   - Compartir y guardar posts
   - Feed personalizado

3. **💬 Chat en tiempo real:**
   - WebSockets para mensajes instantáneos
   - Personalización completa (colores, fondos, apodos)
   - Indicadores de escritura
   - Estados de lectura
   - Reacciones a mensajes

## 🚀 Pasos para Ejecutar

### **1. Backend (Django)**
```bash
cd backend
source venv/bin/activate  # Linux/Mac
# o venv\Scripts\activate  # Windows

# Instalar dependencias
pip install -r requirements/development.txt

# Configurar base de datos
python setup_auth.py
python setup_posts.py
python setup_chat.py

# Ejecutar servidor
python manage.py runserver
```

### **2. Frontend (Next.js)**
```bash
# Instalar dependencias
npm install axios @types/axios

# Ejecutar desarrollo
npm run dev
```

### **3. Verificar Integración**
- Backend: http://localhost:8000/api/docs/
- Frontend: http://localhost:3000
- WebSocket: ws://localhost:8000/ws/

## 📡 Endpoints Integrados

### **Autenticación**
```typescript
// Login
const response = await authService.login({
  email: 'user@example.com',
  password: 'password123'
});

// Register
const response = await authService.register({
  email: 'user@example.com',
  username: 'username',
  display_name: 'Display Name',
  password: 'password123',
  password_confirm: 'password123'
});
```

### **Posts**
```typescript
// Crear post
const post = await postsService.createPost({
  content: 'Mi primer post!',
  post_type: 'text',
  category: 'football'
});

// Reaccionar
await postsService.reactToPost(postId, 'golazo');

// Comentar
await postsService.addComment(postId, {
  content: '¡Increíble!'
});
```

### **Chat**
```typescript
// Crear chat privado
const chat = await chatService.createPrivateChat(userId);

// Enviar mensaje
await chatService.sendMessage(chatId, {
  content: 'Hola!',
  message_type: 'text'
});

// WebSocket en tiempo real
const { sendChatMessage } = useWebSocket(chatId, {
  onMessage: (message) => console.log('Nuevo mensaje:', message)
});
```

## 🎨 Componentes Actualizados

### **1. AuthProvider**
- Integrado con backend Django
- Manejo automático de tokens
- Estados de carga y error

### **2. Chat Interface**
- WebSockets para tiempo real
- Personalización completa
- Persistencia en backend

### **3. Posts System**
- CRUD completo
- Reacciones y comentarios
- Feed personalizado

## 🔧 Configuración

### **Variables de Entorno (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
NEXT_PUBLIC_FRONTEND_URL=http://localhost:4000
```

### **Backend (.env)**
```env
DATABASE_NAME=sos_habilidoso_db
DATABASE_USER=sos_admin
DATABASE_PASSWORD=tu_password
SECRET_KEY=tu_secret_key
CORS_ALLOWED_ORIGINS=http://localhost:4000
```

## 🔄 Flujo de Datos

### **Autenticación**
1. Usuario ingresa credenciales
2. Frontend envía a `/api/auth/login/`
3. Backend valida y retorna JWT
4. Frontend guarda tokens
5. Requests automáticos con Authorization header

### **Posts**
1. Usuario crea post
2. Frontend envía a `/api/posts/`
3. Backend guarda en PostgreSQL
4. Frontend actualiza UI
5. Otros usuarios ven en feed

### **Chat**
1. Usuario abre chat
2. Frontend conecta WebSocket
3. Mensajes en tiempo real
4. Persistencia en backend
5. Personalización sincronizada

## 🛠️ Herramientas de Desarrollo

### **API Documentation**
- Swagger UI: http://localhost:8000/api/docs/
- ReDoc: http://localhost:8000/api/redoc/

### **Database Admin**
- Django Admin: http://localhost:8000/admin/
- Credenciales: admin@soshabilidoso.com / admin123

### **Testing**
```bash
# Backend tests
cd backend
python manage.py test

# Frontend tests
npm run test
```

## 🚨 Troubleshooting

### **CORS Errors**
- Verificar CORS_ALLOWED_ORIGINS en backend
- Asegurar URLs correctas en .env

### **WebSocket Connection Failed**
- Verificar WS_URL en frontend
- Comprobar que Channels esté configurado
- Revisar token de autenticación

### **Database Errors**
- Ejecutar migraciones: `python manage.py migrate`
- Verificar configuración de PostgreSQL
- Comprobar permisos de usuario

## 📱 Funcionalidades Listas

✅ **Autenticación JWT completa**
✅ **Posts con reacciones y comentarios**
✅ **Chat en tiempo real con WebSockets**
✅ **Personalización de chat**
✅ **Feed personalizado**
✅ **Subida de archivos**
✅ **Notificaciones en tiempo real**
✅ **Estados de conexión**
✅ **Manejo de errores**
✅ **Refresh automático de tokens**

## 🎉 ¡Integración Completa!

El sistema está completamente integrado y funcional. Todas las funcionalidades del frontend ahora están conectadas con el backend Django, incluyendo:

- Autenticación segura con JWT
- Posts con todas las interacciones
- Chat en tiempo real con personalización
- Gestión de archivos multimedia
- Notificaciones push
- Estados de conexión en tiempo real

¡Tu red social SOS-HABILIDOSO está lista para usar! 🚀