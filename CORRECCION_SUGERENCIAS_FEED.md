# Corrección: Sugerencias en Feed - Usuarios y Comunidades ✅

## 🐛 Problemas Identificados

### 1. Usuarios Sugeridos Reaparecen Después de Seguir
**Síntoma**: Al darle "Seguir" a un usuario sugerido, desaparece temporalmente pero vuelve a aparecer al recargar la página.

**Causa**: El endpoint `/api/users/suggested/` NO excluía a los usuarios que ya estás siguiendo.

### 2. Comunidades Sugeridas No Aparecen
**Síntoma**: La sección "Comunidades para ti" en el sidebar del feed no muestra comunidades.

**Causa**: El endpoint `/api/communities/suggested/` intentaba ordenar por un campo inexistente (`subscribers_count`).

---

## ✅ Soluciones Implementadas

### 1. Endpoint de Usuarios Sugeridos Corregido

**Archivo**: `backend/apps/users/views.py`

**Cambio Realizado**:
```python
def get_queryset(self):
    user = self.request.user
    
    # Obtener amigos del usuario actual
    user_friends = Friendship.objects.filter(
        Q(user1=user) | Q(user2=user)
    ).values_list('user1_id', 'user2_id')
    
    friend_ids = set()
    for user1_id, user2_id in user_friends:
        if user1_id != user.id:
            friend_ids.add(user1_id)
        if user2_id != user.id:
            friend_ids.add(user2_id)
    
    # ✅ NUEVO: Obtener IDs de usuarios que ya estamos siguiendo
    following_ids = Follow.objects.filter(
        follower=user
    ).values_list('following_id', flat=True)
    
    # Obtener usuarios sugeridos
    suggested = User.objects.filter(
        is_active=True
    ).exclude(
        id=user.id
    ).exclude(
        id__in=friend_ids
    ).exclude(
        id__in=following_ids  # ✅ Excluir usuarios que ya seguimos
    ).order_by('-followers_count', '-posts_count')[:10]
    
    return suggested
```

**Lógica de Filtrado**:
1. ❌ Excluye al usuario actual
2. ❌ Excluye a los amigos
3. ✅ **NUEVO**: Excluye a los usuarios que ya sigue
4. ✅ Ordena por popularidad (followers_count, posts_count)
5. ✅ Retorna máximo 10 usuarios

**Resultado**:
- ✅ Usuarios seguidos NO vuelven a aparecer
- ✅ Siempre muestra usuarios nuevos
- ✅ Persiste después de recargar

---

### 2. Endpoint de Comunidades Sugeridas Corregido

**Archivo**: `backend/apps/communities/views.py`

**Problema Original**:
```python
# ❌ ANTES - Campo inexistente
suggested = Community.objects.filter(
    is_active=True
).exclude(
    id__in=user_communities
).order_by('-subscribers_count', '-created_at')[:10]  # ❌ subscribers_count no existe
```

**Solución**:
```python
# ✅ AHORA - Usa anotación con Count
from django.db.models import Count

@action(detail=False, methods=['get'])
def suggested(self, request):
    """Obtener comunidades sugeridas para el usuario"""
    user = request.user
    
    # Obtener comunidades a las que el usuario ya pertenece
    user_communities = CommunityMembership.objects.filter(
        user=user,
        is_active=True
    ).values_list('community_id', flat=True)
    
    # Sugerir comunidades populares que el usuario no ha unido
    # ✅ Anotar con el conteo de miembros para poder ordenar
    suggested = Community.objects.filter(
        is_active=True
    ).exclude(
        id__in=user_communities
    ).annotate(
        members_count=Count('members', filter=Q(members__is_active=True))
    ).order_by('-members_count', '-created_at')[:10]
    
    serializer = self.get_serializer(suggested, many=True)
    return Response(serializer.data)
```

**Lógica de Filtrado**:
1. ❌ Excluye comunidades a las que ya pertenece
2. ✅ Anota con conteo de miembros activos
3. ✅ Ordena por popularidad (members_count, created_at)
4. ✅ Retorna máximo 10 comunidades

**Resultado**:
- ✅ Comunidades ahora aparecen en el feed
- ✅ Ordenadas por popularidad
- ✅ Excluye comunidades a las que ya pertenece

---

## 🧪 Pruebas Ejecutadas

### Script de Prueba: `test_suggested_endpoints.py`

**Resultados**:

```
============================================================
PRUEBA DE USUARIOS SUGERIDOS
============================================================

👤 Usuario de prueba: sos (ID: f7fb86ab-68ef-47de-a063-0b0284944ad1)
👥 Amigos: 0
➡️  Siguiendo: 7

💡 Usuarios sugeridos: 10
   - admin (Administrador) - Seguidores: 2
   - admin3 (Admin 3) - Seguidores: 1
   - moloworld (M0L0W0RLD) - Seguidores: 1
   - carlos_lopez (Carlos López) - Seguidores: 1
   - abi (Habil) - Seguidores: 1

============================================================

============================================================
PRUEBA DE COMUNIDADES SUGERIDAS
============================================================

👤 Usuario de prueba: sos (ID: f7fb86ab-68ef-47de-a063-0b0284944ad1)
🏘️  Suscrito a: 0 comunidades

💡 Comunidades sugeridas: 10
   - Fotografía Deportiva - Miembros: 5
   - Emprendedores Deportivos - Miembros: 4
   - Música Urbana - Miembros: 4
   - Gamers Unidos - Miembros: 4
   - test - Miembros: 3

📊 Total de comunidades activas: 110

============================================================
```

**Conclusión**: ✅ Ambos endpoints funcionan correctamente

---

## 📊 Comparación: Antes vs Ahora

### Usuarios Sugeridos

| Aspecto | Antes ❌ | Ahora ✅ |
|---------|---------|---------|
| Excluye usuario actual | ✅ | ✅ |
| Excluye amigos | ✅ | ✅ |
| Excluye usuarios seguidos | ❌ | ✅ |
| Persiste después de seguir | ❌ | ✅ |
| Muestra usuarios nuevos | ❌ | ✅ |

### Comunidades Sugeridas

| Aspecto | Antes ❌ | Ahora ✅ |
|---------|---------|---------|
| Endpoint funciona | ❌ Error | ✅ Funciona |
| Aparecen en el feed | ❌ | ✅ |
| Ordenadas por popularidad | ❌ | ✅ |
| Excluye comunidades unidas | ✅ | ✅ |
| Conteo de miembros correcto | ❌ | ✅ |

---

## 🎯 Flujo de Usuario Corregido

### Seguir Usuario:
1. Usuario ve sugerencias en sidebar del feed
2. Hace clic en "Seguir" en un usuario
3. Usuario desaparece de la lista
4. **✅ NUEVO**: Al recargar, el usuario NO vuelve a aparecer
5. **✅ NUEVO**: Aparecen otros usuarios sugeridos

### Ver Comunidades Sugeridas:
1. Usuario abre el feed
2. **✅ NUEVO**: Ve sección "Comunidades para ti" en sidebar
3. **✅ NUEVO**: Muestra hasta 5 comunidades populares
4. Cada comunidad muestra:
   - Avatar/imagen
   - Nombre
   - Descripción
   - Número de miembros
   - Botón "Unirse"
5. Al hacer clic en "Unirse", navega a la comunidad

---

## 📝 Archivos Modificados

### Backend:
1. ✅ `backend/apps/users/views.py` - Endpoint de usuarios sugeridos
2. ✅ `backend/apps/communities/views.py` - Endpoint de comunidades sugeridas
3. ✅ `backend/test_suggested_endpoints.py` - Script de prueba creado

### Frontend:
- ✅ No requiere cambios (ya estaba implementado correctamente)

---

## 🔍 Verificación en Navegador

### Para Usuarios Sugeridos:
1. Ir a `/feed`
2. Ver sidebar derecho "Sugerencias para ti"
3. Hacer clic en "Seguir" en un usuario
4. Recargar la página (F5)
5. ✅ Verificar que el usuario NO vuelve a aparecer

### Para Comunidades Sugeridas:
1. Ir a `/feed`
2. Ver sidebar derecho "Comunidades para ti"
3. ✅ Verificar que aparecen comunidades
4. ✅ Verificar que muestran nombre, descripción y miembros
5. ✅ Verificar que tienen botón "Unirse"

---

## 🎨 Experiencia de Usuario Mejorada

### Antes:
- ❌ Usuarios seguidos reaparecían (confuso)
- ❌ No había comunidades sugeridas
- ❌ Sidebar incompleto

### Ahora:
- ✅ Usuarios seguidos no reaparecen (lógico)
- ✅ Comunidades sugeridas visibles
- ✅ Sidebar completo y funcional
- ✅ Sugerencias siempre frescas
- ✅ Mejor descubrimiento de contenido

---

## ✅ Estado Final

### Usuarios Sugeridos:
- ✅ Endpoint corregido
- ✅ Excluye usuarios seguidos
- ✅ No reaparecen después de seguir
- ✅ Persiste después de recargar
- ✅ Muestra usuarios nuevos

### Comunidades Sugeridas:
- ✅ Endpoint corregido
- ✅ Usa anotación correcta
- ✅ Aparecen en el feed
- ✅ Ordenadas por popularidad
- ✅ Excluye comunidades unidas

### Pruebas:
- ✅ Script de prueba ejecutado
- ✅ 10 usuarios sugeridos encontrados
- ✅ 10 comunidades sugeridas encontradas
- ✅ Ambos endpoints funcionando

---

**Problemas**: Usuarios reaparecían + Comunidades no aparecían
**Soluciones**: Excluir seguidos + Corregir ordenamiento
**Estado**: ✅ Completamente resuelto
**Fecha**: 2 de febrero de 2026
