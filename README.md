# 🚀 SOS-HABILIDOSO

<div align="center">

![SOS-HABILIDOSO Logo](public/logo%20sos@3x.png)

**La Red Social de las Habilidades**

*Plataforma completa para compartir talento, monetizar habilidades y conectar con miles de personas en todo el mundo.*

[![Next.js](https://img.shields.io/badge/Next.js-13.5.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Django](https://img.shields.io/badge/Django-4.2-green?style=for-the-badge&logo=django)](https://djangoproject.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue?style=for-the-badge&logo=typescript)](https://typescriptlang.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange?style=for-the-badge&logo=mysql)](https://mysql.com/)

</div>

---

## ⚡ Inicio Rápido

```bash
# Comando único para iniciar toda la aplicación
npm run soshabilidoso
```

Este comando inicia **automáticamente**:
- ✅ **Frontend** (Next.js) en http://localhost:4000
- ✅ **Backend** (Django) en http://127.0.0.1:8000
- ✅ **Verificación** de MySQL en puerto 3307

---

## 🌐 Accesos Principales

### 🎨 Frontend
| Servicio | URL | Descripción |
|----------|-----|-------------|
| **Aplicación Principal** | http://localhost:4000 | Dashboard y feed principal |
| **Landing Page** | http://localhost:4000/landing.html | Página de presentación |
| **Registro Reality** | http://localhost:4000/register-habilidosos | Formulario Reality Show 2026 |

### 🔧 Backend
| Servicio | URL | Credenciales |
|----------|-----|--------------|
| **API REST** | http://127.0.0.1:8000/api/ | - |
| **Panel Admin** | http://127.0.0.1:8000/admin/ | `admin@test.com` / `admin123` |

---

## 🛠️ Stack Tecnológico

### Frontend
- **Framework**: Next.js 13.5.1 con App Router
- **Lenguaje**: TypeScript 5.2.2
- **Estilos**: Tailwind CSS + Radix UI
- **Animaciones**: Framer Motion
- **HTTP Client**: Axios
- **Formularios**: React Hook Form + Zod
- **Iconos**: Lucide React + Font Awesome

### Backend
- **Framework**: Django 4.2 + Django REST Framework
- **Autenticación**: JWT (Simple JWT)
- **Base de Datos**: MySQL 8.0 (Puerto 3307)
- **CORS**: Django CORS Headers
- **Media**: Django Media Storage

### Bases de Datos
- **habilidosos_db** (27 tablas): Aplicación principal Django
- **habilidosos_clean** (15 tablas): Reality Show "Un Golazo A Tus Sueños"

---

## 🎯 Características Principales

### 👥 Para Usuarios
- � **sPublicaciones**: Texto, imágenes, videos con reacciones (like, celebration, golazo)
- 🎬 **Reels**: Videos cortos estilo TikTok/Instagram
- �  **Mensajería**: Chat privado con reacciones a mensajes y fondos animados
- �  **Amistades**: Sistema completo de seguimiento y solicitudes
- 👥 **Comunidades**: Grupos temáticos por habilidades
- 🔔 **Notificaciones**: En tiempo real para todas las interacciones
- �️ **Garlería**: Contenido multimedia organizado
- � **Habial News**: Noticias y artículos de la comunidad

### � sMarketplace y Clasificados
- �️ **Próoductos**: Compra/venta de artículos físicos
- 💼 **Servicios**: Marketplace de servicios profesionales
- 💻 **Freelance**: Ofertas de trabajo independiente
- 🏢 **Empleos**: Búsqueda de trabajo tiempo completo/parcial
- � *B*Startups**: Proyectos buscando financiamiento e inversores

### � Monetización
- 🎁 **Donaciones**: Apoyo económico a deportistas y streamers
- 📢 **Publicidad**: Sistema completo para empresas anunciantes
- 📺 **Streaming**: Transmisiones en vivo (clases y entretenimiento)
- 🎓 **Capacitaciones**: Cursos y formación online

### 🏆 Reality Show 2026
- ⚽ **"Un Golazo A Tus Sueños"**: Reality de fútbol para jóvenes 13-19 años
- 📝 **Registro**: Formulario dedicado con base de datos separada
- 📺 **Transmisión**: Win Sports, Canal Uno, Telemedellín, Teleantioquia

### 🔧 Para Administradores
- � **Modperación**: Banear/desbanear usuarios
- 📊 **Analytics**: Dashboard con estadísticas completas
- 💰 **Finanzas**: Sistema de transacciones y billeteras
- 📢 **Publicidad**: Gestión de campañas y anuncios
- 👥 **Usuarios**: Gestión completa de cuentas

---

## 📦 Instalación Completa

### 1. Clonar Repositorio
```bash
git clone https://github.com/redeshabilidosos/soshabilidoso.git
cd SOS-HABILIDOSO
```

### 2. Configurar Backend
```bash
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# Windows:
venv\Scripts\activate.bat
# Linux/Mac:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar base de datos MySQL (Puerto 3307)
# Crear bases de datos: habilidosos_db y habilidosos_clean

# Ejecutar migraciones
python manage.py migrate

# Crear superusuario
python crear_admin_mysql.py
```

### 3. Configurar Frontend
```bash
cd ..

# Instalar dependencias
npm install

# Crear archivo .env.local
echo "NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api" > .env.local
echo "NEXT_PUBLIC_WS_URL=ws://127.0.0.1:8000/ws" >> .env.local
```

### 4. Iniciar Aplicación
```bash
# Opción 1: Comando único (recomendado)
npm run soshabilidoso

# Opción 2: Servidores separados
# Terminal 1:
cd backend && python manage.py runserver 8000

# Terminal 2:
npm run dev
```

---

## 🔧 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run soshabilidoso` | 🚀 Inicia toda la aplicación (recomendado) |
| `npm run dev` | ⚛️ Solo frontend (puerto 4000) |
| `npm run dev:backend` | 🐍 Solo backend (puerto 8000) |
| `npm run dev:both` | 🔄 Ambos con concurrently |
| `npm run build` | 📦 Build para producción |
| `npm run start` | 🌐 Servidor de producción |

---

## 📁 Estructura del Proyecto

```
SOS-HABILIDOSO/
├── 📱 Frontend (Next.js - Puerto 4000)
│   ├── app/                     # App Router de Next.js
│   │   ├── auth/               # Autenticación
│   │   ├── feed/               # Feed principal
│   │   ├── profile/            # Perfiles de usuario
│   │   ├── messages/           # Sistema de mensajería
│   │   ├── communities/        # Comunidades
│   │   ├── classifieds/        # Marketplace y clasificados
│   │   ├── donations/          # Sistema de donaciones
│   │   ├── live/               # Transmisiones en vivo
│   │   ├── reels/              # Videos cortos
│   │   └── register-habilidosos/ # Reality Show
│   ├── components/             # Componentes reutilizables
│   ├── lib/                    # Utilidades y servicios
│   └── public/                 # Archivos estáticos
│
├── 🔧 Backend (Django - Puerto 8000)
│   ├── sos_habilidoso/         # Configuración principal
│   ├── apps/                   # Aplicaciones Django
│   │   ├── users/              # Gestión de usuarios
│   │   ├── posts/              # Publicaciones y feed
│   │   ├── messaging/          # Chat y mensajería
│   │   ├── communities/        # Comunidades
│   │   ├── classifieds/        # Marketplace
│   │   ├── donations/          # Sistema de donaciones
│   │   ├── advertising/        # Publicidad
│   │   ├── reality/            # Reality Show
│   │   ├── reels/              # Videos cortos
│   │   ├── notifications/      # Notificaciones
│   │   └── enterprises/        # Proyectos empresariales
│   └── media/                  # Archivos subidos
│
└── 📄 Documentación
    ├── README.md               # Este archivo
    ├── INICIO_RAPIDO.md        # Guía de inicio
    ├── START.md                # Guía visual
    └── public/DOCUMENTACION_APLICACION.txt
```

---

## 🌟 Funcionalidades Destacadas

### 💬 Sistema de Mensajería Avanzado
- **Reacciones a mensajes**: ❤️ 😂 👍 👎
- **Fondos animados**: Estrellas, corazones, partículas
- **Colores personalizables**: 6 esquemas de color
- **Respuestas anidadas**: Reply a mensajes específicos
- **Archivos multimedia**: Imágenes, videos, documentos

### 📝 Publicaciones Interactivas
- **3 tipos de reacciones**: Like, Celebration, Golazo ⚽
- **Comentarios anidados**: Respuestas y menciones @usuario
- **Multimedia**: Soporte completo para imágenes y videos
- **Compartir**: Sistema de shares entre usuarios

### 🛒 Marketplace Completo
- **5 secciones**: Explorar, Mis Anuncios, Empleos, Empresas, Publicar
- **Filtros avanzados**: Por categoría, precio, ubicación
- **Sistema de ratings**: Calificaciones de vendedores
- **Proyectos de inversión**: Startups buscando financiamiento

### 🎬 Contenido Multimedia
- **Reels**: Videos cortos con controles de reproducción
- **Streaming**: Transmisiones en vivo con chat
- **Galería**: Organización de contenido multimedia

---

## 🗄️ Base de Datos

### habilidosos_db (27 tablas)
```sql
-- Usuarios y autenticación
users, user_profiles, user_settings

-- Contenido social
posts, comments, post_reactions, reels

-- Mensajería
chat_rooms, messages, message_reactions

-- Comunidades
communities, community_members, community_posts

-- Marketplace
classifieds, enterprise_projects

-- Donaciones y publicidad
donations, athletes, advertisements

-- Notificaciones
notifications
```

### habilidosos_clean (15 tablas)
```sql
-- Reality Show "Un Golazo A Tus Sueños"
participantes  -- Formulario de registro del reality
```

---

## 🔐 Autenticación

### Sistema JWT
- **Access Token**: 1 hora de duración
- **Refresh Token**: 7 días de duración
- **Endpoints**: Login, registro, refresh, logout
- **Protección**: Middleware automático en rutas protegidas

### Flujo de Autenticación
1. **Registro** → Validación → JWT Tokens
2. **Login** → Verificación → JWT Tokens
3. **Navegación** → Verificación automática de tokens
4. **Expiración** → Refresh automático o redirect a login

---

## 🌐 API Endpoints

### Principales Endpoints
```
🔐 Autenticación
POST /api/auth/login/
POST /api/auth/register/
POST /api/auth/refresh/

👥 Usuarios
GET  /api/users/search/
GET  /api/users/profile/<username>/
POST /api/users/follow/<username>/

📝 Publicaciones
GET  /api/posts/
POST /api/posts/
POST /api/posts/<id>/react/
GET  /api/posts/<id>/comments/

💬 Mensajería
GET  /api/messaging/chats/
POST /api/messaging/chats/<id>/send_message/
POST /api/messaging/chats/<id>/messages/<id>/react/

🛒 Clasificados
GET  /api/classifieds/products/
POST /api/classifieds/products/
GET  /api/classifieds/marketplace/

💰 Donaciones
GET  /api/donations/athletes/
POST /api/donations/athletes/<id>/donate/

📢 Publicidad
GET  /api/advertising/ads/get_feed_ads/
POST /api/advertising/ads/<id>/record_impression/
```

---

## 🎨 Características Visuales

### Landing Page Dinámica
- **Background animado**: Partículas verdes/azules conectadas
- **300 estrellas**: Parpadeando con diferentes tamaños
- **Navbar fijo**: Responsive en todos los dispositivos
- **Cuenta regresiva**: 30 días dinámicos hasta el lanzamiento
- **Menú hamburguesa**: Funcional en móviles y tablets

### Interfaz Moderna
- **Tailwind CSS**: Diseño responsive y moderno
- **Radix UI**: Componentes accesibles y profesionales
- **Framer Motion**: Animaciones fluidas
- **Tema oscuro**: Diseño futurista con gradientes neón

---

## 🆘 Solución de Problemas

### Problemas Comunes

**❌ Error de conexión a MySQL**
```bash
# Verificar que MySQL esté corriendo en puerto 3307
mysql -u root -P 3307 -e "SHOW DATABASES;"

# Crear bases de datos si no existen
mysql -u root -P 3307 -e "CREATE DATABASE habilidosos_db;"
mysql -u root -P 3307 -e "CREATE DATABASE habilidosos_clean;"
```

**❌ CORS Error**
```bash
# Verificar configuración en backend/.env
CORS_ALLOWED_ORIGINS=http://localhost:4000,http://127.0.0.1:4000

# Reiniciar backend
cd backend && python manage.py runserver 8000
```

**❌ JWT Token Expirado**
- El frontend automáticamente intenta refrescar el token
- Si falla, redirige al login
- Limpiar localStorage: `localStorage.clear()`

**❌ Archivos media no cargan**
```bash
# Verificar configuración de media en Django
# Crear carpeta media si no existe
mkdir backend/media

# Verificar permisos de escritura
chmod 755 backend/media
```

---

## 📚 Documentación Adicional

| Archivo | Descripción |
|---------|-------------|
| [START.md](START.md) | 🎯 Guía visual de inicio rápido |
| [INICIO_RAPIDO.md](INICIO_RAPIDO.md) | 📖 Guía completa de instalación |
| [backend/CONFIGURACION_COMPLETADA.md](backend/CONFIGURACION_COMPLETADA.md) | ⚙️ Configuración de base de datos |
| [public/DOCUMENTACION_APLICACION.txt](public/DOCUMENTACION_APLICACION.txt) | 📋 Documentación técnica completa |

---

## 🚀 Próximas Características

### En Desarrollo
- 💳 **Sistema de pagos**: Integración con pasarelas de pago
- 📱 **App móvil**: React Native para iOS y Android
- 🤖 **IA**: Recomendaciones personalizadas
- 📞 **Videollamadas**: Integración en el chat
- 🔔 **Push notifications**: Notificaciones en tiempo real
- 📊 **Analytics avanzados**: Dashboard de métricas

### Roadmap 2026
- 🌍 **Internacionalización**: Múltiples idiomas
- 🎮 **Gamificación**: Sistema de puntos y logros
- 🔐 **Blockchain**: NFTs y criptomonedas
- 🎯 **IA Avanzada**: Matching inteligente de usuarios

---

## 👥 Contribuir

### Desarrollo Local
1. Fork del repositorio
2. Crear rama feature: `git checkout -b feature/nueva-caracteristica`
3. Commit cambios: `git commit -m 'Agregar nueva característica'`
4. Push a la rama: `git push origin feature/nueva-caracteristica`
5. Crear Pull Request

### Estándares de Código
- **Frontend**: ESLint + Prettier
- **Backend**: PEP 8 + Black
- **Commits**: Conventional Commits
- **Testing**: Jest (Frontend) + pytest (Backend)

---

## 📞 Soporte y Contacto

### Canales de Soporte
- 📧 **Email**: soporte@sos-habilidoso.com
- 💬 **Discord**: [Servidor de la comunidad]
- 📱 **WhatsApp**: +57 XXX XXX XXXX
- 🌐 **Web**: https://www.fundahabilidosos.com/

### Reportar Bugs
- 🐛 **GitHub Issues**: Para bugs técnicos
- 📝 **Formulario**: Para sugerencias de características
- 📞 **Soporte directo**: Para problemas críticos

---

## 📄 Licencia y Derechos

```
© 2025 SOS-HABILIDOSO - Fundación Habilidosos
Todos los derechos reservados.

Este proyecto es propiedad de la Fundación Habilidosos.
Uso restringido bajo licencia propietaria.
```

---

## 🏆 Reconocimientos

### Tecnologías Utilizadas
- [Next.js](https://nextjs.org/) - Framework de React
- [Django](https://djangoproject.com/) - Framework de Python
- [Tailwind CSS](https://tailwindcss.com/) - Framework de CSS
- [Radix UI](https://radix-ui.com/) - Componentes primitivos
- [Framer Motion](https://framer.com/motion/) - Librería de animaciones

### Equipo de Desarrollo
- 👨‍💻 **Desarrollo Full Stack**: Equipo SOS-HABILIDOSO
- 🎨 **Diseño UI/UX**: Equipo de Diseño
- 📊 **Product Management**: Fundación Habilidosos
- 🔧 **DevOps**: Equipo de Infraestructura

---

<div align="center">

**🚀 ¡Únete a la revolución de las habilidades! 🚀**

*Conecta, comparte y monetiza tu talento en SOS-HABILIDOSO*

[![Fundación Habilidosos](https://img.shields.io/badge/Fundación-Habilidosos-green?style=for-the-badge)](https://www.fundahabilidosos.com/)

</div>