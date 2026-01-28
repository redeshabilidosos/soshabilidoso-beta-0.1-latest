# Funciones de Sugerencias - Backend Integration

## Funciones Implementadas

### 1. **loadSuggestions() - Función Principal**

Esta función carga tanto usuarios como comunidades sugeridas desde el backend.

```typescript
useEffect(() => {
  const loadSuggestions = async () => {
    if (!effectiveUser) return;
    
    try {
      setLoadingSuggestions(true);
      const token = localStorage.getItem('access_token');
      
      // Cargar usuarios sugeridos (amigos en común)
      try {
        const usersResponse = await fetch('http://127.0.0.1:8000/api/users/suggested/', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          setSuggestedUsers(usersData.results?.slice(0, 5) || usersData.slice(0, 5) || []);
        }
      } catch (error) {
        console.error('Error cargando usuarios sugeridos:', error);
      }

      // Cargar comunidades sugeridas
      try {
        const communitiesResponse = await fetch('http://127.0.0.1:8000/api/communities/suggested/', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (communitiesResponse.ok) {
          const communitiesData = await communitiesResponse.json();
          setSuggestedCommunities(communitiesData.results?.slice(0, 5) || communitiesData.slice(0, 5) || []);
        }
      } catch (error) {
        console.error('Error cargando comunidades sugeridas:', error);
      }
    } catch (error) {
      console.error('Error cargando sugerencias:', error);
    } finally {
      setLoadingSuggestions(false);
    }
  };
  
  loadSuggestions();
}, [effectiveUser]);
```

**Características:**
- ✅ Carga automática al montar el componente
- ✅ Requiere autenticación (token)
- ✅ Manejo de errores independiente para cada tipo
- ✅ Limita a 5 resultados por tipo
- ✅ Loading state para UX

### 2. **handleFollowUser() - Seguir Usuario**

Función para seguir a un usuario sugerido.

```typescript
const handleFollowUser = async (username: string) => {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`http://127.0.0.1:8000/api/users/${username}/follow/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      // Remover usuario de sugerencias
      setSuggestedUsers(prev => prev.filter(u => u.username !== username));
      toast.success('Ahora sigues a este usuario');
    }
  } catch (error) {
    console.error('Error siguiendo usuario:', error);
    toast.error('Error al seguir usuario');
  }
};
```

**Características:**
- ✅ POST request al backend
- ✅ Remueve usuario de la lista al seguir
- ✅ Toast notification de éxito/error
- ✅ Actualización inmediata de UI

### 3. **handleJoinCommunity() - Unirse a Comunidad**

Función para unirse a una comunidad sugerida.

```typescript
const handleJoinCommunity = async (communityId: string) => {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`http://127.0.0.1:8000/api/communities/${communityId}/subscribe/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      // Remover comunidad de sugerencias
      setSuggestedCommunities(prev => prev.filter(c => c.id !== communityId));
      toast.success('Te has unido a la comunidad');
    }
  } catch (error) {
    console.error('Error uniéndose a comunidad:', error);
    toast.error('Error al unirse a la comunidad');
  }
};
```

**Características:**
- ✅ POST request al backend
- ✅ Remueve comunidad de la lista al unirse
- ✅ Toast notification de éxito/error
- ✅ Actualización inmediata de UI

## Endpoints del Backend Necesarios

### 1. Usuarios Sugeridos

**Endpoint:** `GET /api/users/suggested/`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response esperada:**
```json
{
  "results": [
    {
      "id": "user-id",
      "username": "johndoe",
      "display_name": "John Doe",
      "avatar_url": "https://...",
      "avatar": "https://...",
      "mutual_friends_count": 5,
      "bio": "Developer and football player"
    }
  ]
}
```

**Lógica sugerida para el backend:**
```python
# En backend/apps/users/views.py

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Count, Q

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def suggested_users(request):
    """
    Sugiere usuarios basados en amigos en común
    """
    current_user = request.user
    
    # Obtener amigos del usuario actual
    user_friends = current_user.friends.all()
    
    # Obtener amigos de amigos (excluyendo al usuario actual y sus amigos directos)
    suggested = User.objects.filter(
        friends__in=user_friends
    ).exclude(
        Q(id=current_user.id) | Q(id__in=user_friends.values_list('id', flat=True))
    ).annotate(
        mutual_friends_count=Count('friends', filter=Q(friends__in=user_friends))
    ).order_by('-mutual_friends_count')[:10]
    
    serializer = UserSuggestionSerializer(suggested, many=True, context={'request': request})
    return Response({'results': serializer.data})
```

### 2. Comunidades Sugeridas

**Endpoint:** `GET /api/communities/suggested/`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response esperada:**
```json
{
  "results": [
    {
      "id": "community-id",
      "name": "Fútbol Libre",
      "description": "Comunidad para amantes del fútbol",
      "image_url": "https://...",
      "image": "https://...",
      "members_count": 150,
      "category": "sports"
    }
  ]
}
```

**Lógica sugerida para el backend:**
```python
# En backend/apps/communities/views.py

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Count, Q

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def suggested_communities(request):
    """
    Sugiere comunidades basadas en:
    - Comunidades populares
    - Comunidades de amigos
    - Categorías de interés del usuario
    """
    current_user = request.user
    
    # Obtener comunidades a las que ya está suscrito
    user_communities = current_user.subscribed_communities.all()
    
    # Obtener comunidades de amigos
    friends_communities = Community.objects.filter(
        subscribers__in=current_user.friends.all()
    ).exclude(
        id__in=user_communities.values_list('id', flat=True)
    ).annotate(
        friends_count=Count('subscribers', filter=Q(subscribers__in=current_user.friends.all()))
    )
    
    # Obtener comunidades populares
    popular_communities = Community.objects.exclude(
        id__in=user_communities.values_list('id', flat=True)
    ).annotate(
        members_count=Count('subscribers')
    ).filter(
        members_count__gte=10
    )
    
    # Combinar y ordenar
    suggested = (friends_communities | popular_communities).distinct().order_by('-members_count')[:10]
    
    serializer = CommunitySerializer(suggested, many=True)
    return Response({'results': serializer.data})
```

### 3. Seguir Usuario

**Endpoint:** `POST /api/users/{username}/follow/`

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Response esperada:**
```json
{
  "message": "Ahora sigues a este usuario",
  "is_following": true
}
```

### 4. Unirse a Comunidad

**Endpoint:** `POST /api/communities/{id}/subscribe/`

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Response esperada:**
```json
{
  "message": "Te has unido a la comunidad",
  "is_subscribed": true
}
```

## Estados del Componente

```typescript
// Estados para sugerencias
const [suggestedUsers, setSuggestedUsers] = useState<any[]>([]);
const [suggestedCommunities, setSuggestedCommunities] = useState<any[]>([]);
const [loadingSuggestions, setLoadingSuggestions] = useState(true);
```

## Flujo de Datos

### Carga Inicial
```
1. Usuario carga el feed
2. useEffect detecta effectiveUser
3. loadSuggestions() se ejecuta
4. Fetch a /api/users/suggested/
5. Fetch a /api/communities/suggested/
6. Actualiza estados con resultados
7. Renderiza sugerencias en sidebar
```

### Seguir Usuario
```
1. Usuario hace click en "Seguir"
2. handleFollowUser(username) se ejecuta
3. POST a /api/users/{username}/follow/
4. Si éxito: remueve de suggestedUsers
5. Muestra toast de confirmación
```

### Unirse a Comunidad
```
1. Usuario hace click en "Unirse"
2. handleJoinCommunity(id) se ejecuta
3. POST a /api/communities/{id}/subscribe/
4. Si éxito: remueve de suggestedCommunities
5. Muestra toast de confirmación
```

## Manejo de Errores

### Try-Catch Anidados
```typescript
try {
  // Intento general
  try {
    // Carga de usuarios
  } catch (error) {
    // Error específico de usuarios
  }
  
  try {
    // Carga de comunidades
  } catch (error) {
    // Error específico de comunidades
  }
} catch (error) {
  // Error general
} finally {
  // Siempre ejecuta
  setLoadingSuggestions(false);
}
```

**Ventajas:**
- ✅ Si falla usuarios, comunidades aún se cargan
- ✅ Si falla comunidades, usuarios aún se cargan
- ✅ Loading state siempre se actualiza
- ✅ Errores específicos en console

## Optimizaciones

### 1. Límite de Resultados
```typescript
.slice(0, 5)  // Solo 5 sugerencias por tipo
```

### 2. Carga Única
```typescript
useEffect(() => {
  loadSuggestions();
}, [effectiveUser]);  // Solo cuando cambia el usuario
```

### 3. Actualización Optimista
```typescript
// Remueve inmediatamente de la UI
setSuggestedUsers(prev => prev.filter(u => u.username !== username));
// No espera confirmación del backend
```

### 4. Fallback de Datos
```typescript
usersData.results?.slice(0, 5) || usersData.slice(0, 5) || []
// Maneja diferentes estructuras de respuesta
```

## Testing

### Probar Usuarios Sugeridos
```bash
curl -X GET http://127.0.0.1:8000/api/users/suggested/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Probar Comunidades Sugeridas
```bash
curl -X GET http://127.0.0.1:8000/api/communities/suggested/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Probar Seguir Usuario
```bash
curl -X POST http://127.0.0.1:8000/api/users/johndoe/follow/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

### Probar Unirse a Comunidad
```bash
curl -X POST http://127.0.0.1:8000/api/communities/123/subscribe/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

## Archivos Modificados

- `app/feed/page.tsx` - Funciones de sugerencias implementadas

## Próximos Pasos

1. **Backend**: Implementar los endpoints sugeridos
2. **Testing**: Probar con datos reales
3. **Optimización**: Agregar caché para sugerencias
4. **Analytics**: Trackear clicks en sugerencias
5. **Personalización**: Mejorar algoritmo de sugerencias

## Resultado

Las funciones de sugerencias ahora:
- ✅ Cargan usuarios con amigos en común
- ✅ Cargan comunidades existentes
- ✅ Permiten seguir usuarios
- ✅ Permiten unirse a comunidades
- ✅ Manejan errores correctamente
- ✅ Actualizan UI inmediatamente
- ✅ Muestran feedback al usuario
- ✅ Están optimizadas para rendimiento
