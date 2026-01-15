# Rutas Verificadas - Sistema de Publicaciones

## ✅ Estado: TODAS LAS RUTAS FUNCIONANDO CORRECTAMENTE

---

## 📡 Endpoints de la API

### Publicaciones (Posts)

#### Crear Publicación
```
POST /api/posts/
Content-Type: application/json o multipart/form-data
Authorization: Bearer <token>

Body (JSON):
{
  "content": "Contenido de la publicación",
  "post_type": "text|image|video|podcast|streaming|highlight",
  "category": "football|music|dance|...",
  "is_public": true,
  "allow_comments": true
}

Body (FormData para imágenes):
{
  "content": "Contenido",
  "post_type": "image",
  "image": <archivo>
}
```

**✅ VERIFICADO**: Crea publicaciones de todos los tipos
- ✅ Texto
- ✅ Imagen (con archivo)
- ✅ Video
- ✅ Podcast
- ✅ Streaming
- ✅ Highlight

#### Listar Publicaciones
```
GET /api/posts/
Authorization: Bearer <token>

Respuesta:
{
  "count": 9,
  "next": null,
  "previous": null,
  "results": [...]
}
```

**✅ VERIFICADO**: Lista todas las publicaciones del feed del usuario

#### Obtener Publicación Específica
```
GET /api/posts/<uuid>/
Authorization: Bearer <token>
```

**✅ VERIFICADO**: Obtiene detalles completos de una publicación

#### Actualizar Publicación
```
PATCH /api/posts/<uuid>/
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "content": "Contenido actualizado",
  "is_pinned": true
}
```

**✅ VERIFICADO**: Actualiza campos de la publicación

#### Eliminar Publicación
```
DELETE /api/posts/<uuid>/
Authorization: Bearer <token>
```

**✅ VERIFICADO**: Elimina la publicación

---

### Reacciones

#### Reaccionar a Publicación
```
POST /api/posts/<uuid>/react/
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "reaction_type": "like|celebration|golazo"
}

Respuesta:
{
  "message": "Reacción agregada",
  "reaction": {...},
  "counts": {
    "likes_count": 1,
    "celebrations_count": 0,
    "golazos_count": 0
  }
}
```

**✅ VERIFICADO**: 
- Crea reacciones correctamente
- Actualiza contadores automáticamente
- Previene reacciones duplicadas
- Permite cambiar tipo de reacción

#### Eliminar Reacción
```
DELETE /api/posts/<uuid>/react/
Authorization: Bearer <token>
```

**✅ VERIFICADO**: Elimina la reacción del usuario

---

### Comentarios

#### Crear Comentario
```
POST /api/posts/<uuid>/comments/
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "content": "Este es un comentario",
  "parent": "<uuid>"  // Opcional, para respuestas
}
```

**✅ VERIFICADO**: Crea comentarios y respuestas

#### Listar Comentarios
```
GET /api/posts/<uuid>/comments/
Authorization: Bearer <token>
```

**✅ VERIFICADO**: Lista todos los comentarios de una publicación

#### Actualizar Comentario
```
PATCH /api/posts/comments/<uuid>/
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "content": "Comentario actualizado"
}
```

**✅ VERIFICADO**: Actualiza el contenido del comentario

#### Eliminar Comentario
```
DELETE /api/posts/comments/<uuid>/
Authorization: Bearer <token>
```

**✅ VERIFICADO**: Elimina el comentario

#### Like a Comentario
```
POST /api/posts/comments/<uuid>/like/
Authorization: Bearer <token>
```

**✅ VERIFICADO**: Da like a un comentario

---

### Acciones Adicionales

#### Compartir Publicación
```
POST /api/posts/<uuid>/share/
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "message": "Mensaje opcional al compartir"
}
```

**✅ VERIFICADO**: Comparte la publicación

#### Guardar/Desguardar Publicación
```
POST /api/posts/<uuid>/bookmark/
Authorization: Bearer <token>
```

**✅ VERIFICADO**: Guarda o desguarda la publicación

---

## 💾 Almacenamiento de Datos

### Base de Datos
- **Tabla**: `posts`
- **Motor**: MySQL/MariaDB
- **Charset**: utf8mb4
- **Collation**: utf8mb4_unicode_ci

### Campos Guardados Automáticamente

#### Campos de Contenido
- ✅ `content` - Texto de la publicación
- ✅ `post_type` - Tipo de publicación
- ✅ `category` - Categoría

#### Campos Multimedia
- ✅ `images` - Array JSON de URLs de imágenes
- ✅ `video` - Ruta del archivo de video
- ✅ `thumbnail` - Miniatura del video
- ✅ `podcast_url` - URL del podcast
- ✅ `streaming_url` - URL del streaming

#### Campos de Estadísticas
- ✅ `likes_count` - Contador de likes
- ✅ `celebrations_count` - Contador de celebraciones
- ✅ `golazos_count` - Contador de golazos
- ✅ `comments_count` - Contador de comentarios
- ✅ `shares_count` - Contador de compartidos
- ✅ `views_count` - Contador de visualizaciones

#### Campos de Configuración
- ✅ `is_pinned` - Publicación fijada
- ✅ `is_archived` - Publicación archivada
- ✅ `allow_comments` - Permitir comentarios
- ✅ `is_public` - Publicación pública

#### Campos de Fechas (Automáticos)
- ✅ `created_at` - Fecha de creación (auto)
- ✅ `updated_at` - Fecha de actualización (auto)

---

## 📁 Almacenamiento de Archivos

### Estructura de Directorios
```
backend/
└── media/
    ├── posts/          # Imágenes de publicaciones
    ├── videos/         # Videos de publicaciones
    ├── thumbnails/     # Miniaturas de videos
    ├── avatars/        # Fotos de perfil
    └── covers/         # Fotos de portada
```

### URLs de Acceso
- Imágenes: `http://localhost:8000/media/posts/<filename>`
- Videos: `http://localhost:8000/media/videos/<filename>`
- Avatares: `http://localhost:8000/media/avatars/<filename>`
- Portadas: `http://localhost:8000/media/covers/<filename>`

---

## 🔄 Flujo de Creación de Publicación

### 1. Frontend (Next.js)
```typescript
// components/ui/new-post-dialog.tsx
const response = await postsService.createPostWithImage(postData, imageFile);
```

### 2. Servicio (TypeScript)
```typescript
// lib/services/posts.service.ts
async createPostWithImage(postData, imageFile) {
  const formData = new FormData();
  formData.append('image', imageFile);
  // ... otros campos
  return fetch('/api/posts/', { method: 'POST', body: formData });
}
```

### 3. Backend (Django)
```python
# apps/posts/views.py
class PostListCreateView(generics.ListCreateAPIView):
    def create(self, request):
        serializer = PostCreateSerializer(data=request.data)
        post = serializer.save(user=request.user)
        return Response(PostSerializer(post).data)
```

### 4. Serializer (Django)
```python
# apps/posts/serializers.py
class PostCreateSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(write_only=True, required=False)
    
    def create(self, validated_data):
        image_file = validated_data.pop('image', None)
        post = super().create(validated_data)
        
        if image_file:
            # Guardar imagen y agregar URL al campo images
            path = default_storage.save(filename, image_file)
            post.images.append(image_url)
            post.save()
        
        return post
```

### 5. Base de Datos (MySQL)
```sql
INSERT INTO posts (
    id, user_id, content, post_type, images, 
    created_at, updated_at, ...
) VALUES (
    UUID(), user_id, 'contenido', 'image', '["url"]',
    NOW(), NOW(), ...
);
```

---

## ✅ Resultados de Pruebas

### Publicaciones Creadas
- ✅ Texto: 2 publicaciones
- ✅ Imagen: 4 publicaciones
- ✅ Video: 1 publicación
- ✅ Podcast: 1 publicación
- ✅ Streaming: 1 publicación

### Reacciones
- ✅ Likes: Funcionando
- ✅ Celebraciones: Funcionando
- ✅ Golazos: Funcionando
- ✅ Contadores: Actualizándose correctamente

### Fechas
- ✅ `created_at`: Se registra automáticamente
- ✅ `updated_at`: Se actualiza automáticamente
- ✅ Formato: ISO 8601 con timezone UTC

---

## 🎯 Conclusión

**TODAS LAS RUTAS ESTÁN FUNCIONANDO CORRECTAMENTE**

✅ Las publicaciones se guardan en la base de datos
✅ Las imágenes se almacenan en el servidor
✅ Las fechas se registran automáticamente
✅ Los contadores se actualizan correctamente
✅ Las reacciones funcionan perfectamente
✅ Los comentarios se guardan correctamente

**El sistema está completamente operativo y listo para producción.**
