# ✅ Cambio de Contraseña Sin OTP - Implementado

## 🎯 CAMBIOS REALIZADOS

### Frontend (`app/settings/page.tsx`)

#### Antes (con OTP):
- 3 pasos: Solicitar OTP → Verificar OTP → Cambiar contraseña
- Requería código de 6 dígitos enviado por email
- Flujo complejo con múltiples estados

#### Ahora (sin OTP):
- 1 paso: Cambiar contraseña directamente
- Solo requiere contraseña actual y nueva contraseña
- Flujo simple y directo

### Backend (`backend/apps/authentication/views.py`)

✅ Ya estaba configurado correctamente sin OTP
- Endpoint: `POST /api/auth/change-password/`
- Requiere autenticación (token JWT)
- Valida contraseña actual
- Cambia la contraseña directamente

## 📋 CAMPOS REQUERIDOS

### Formulario en `/settings` → Tab "Perfil"

1. **Contraseña Actual**
   - Campo: `current_password`
   - Validación: Debe coincidir con la contraseña actual del usuario
   - Tipo: password (con botón para mostrar/ocultar)

2. **Nueva Contraseña**
   - Campo: `new_password`
   - Validación: Mínimo 8 caracteres
   - Tipo: password (con botón para mostrar/ocultar)
   - Mensaje de ayuda: "La contraseña debe tener al menos 8 caracteres"

3. **Confirmar Nueva Contraseña**
   - Campo: `new_password_confirm`
   - Validación: Debe coincidir con `new_password`
   - Tipo: password (con botón para mostrar/ocultar)

## 🔧 ENDPOINT DEL BACKEND

```http
POST http://localhost:8000/api/auth/change-password/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "current_password": "contraseña_actual",
  "new_password": "nueva_contraseña_min_8_chars",
  "new_password_confirm": "nueva_contraseña_min_8_chars"
}
```

### Respuesta Exitosa (200 OK):
```json
{
  "message": "Contraseña cambiada exitosamente"
}
```

### Respuestas de Error:

#### Contraseña actual incorrecta (400 Bad Request):
```json
{
  "current_password": ["La contraseña actual es incorrecta."]
}
```

#### Contraseñas no coinciden (400 Bad Request):
```json
{
  "new_password_confirm": ["Las contraseñas no coinciden."]
}
```

#### Contraseña débil (400 Bad Request):
```json
{
  "new_password": [
    "Esta contraseña es demasiado corta. Debe contener al menos 8 caracteres.",
    "Esta contraseña es demasiado común.",
    "Esta contraseña es completamente numérica."
  ]
}
```

## 🧪 PRUEBA MANUAL

### Paso 1: Iniciar Servidores
```bash
# Terminal 1: Backend
cd backend
call venv312\Scripts\activate.bat
python manage.py runserver

# Terminal 2: Frontend
npm run dev
```

### Paso 2: Navegar a Settings
1. Abrir: `http://localhost:4000/login`
2. Iniciar sesión con cualquier usuario
3. Ir a: `http://localhost:4000/settings`
4. Hacer clic en la tab "Perfil"
5. Desplazarse hasta "Cambiar Contraseña"

### Paso 3: Probar Cambio de Contraseña

#### Caso 1: Cambio Exitoso
```
Contraseña Actual: password123
Nueva Contraseña: nuevapassword123
Confirmar Nueva Contraseña: nuevapassword123

Resultado: ✅ "Contraseña actualizada con éxito."
```

#### Caso 2: Contraseña Actual Incorrecta
```
Contraseña Actual: incorrecta
Nueva Contraseña: nuevapassword123
Confirmar Nueva Contraseña: nuevapassword123

Resultado: ❌ "La contraseña actual es incorrecta."
```

#### Caso 3: Contraseñas No Coinciden
```
Contraseña Actual: password123
Nueva Contraseña: nuevapassword123
Confirmar Nueva Contraseña: diferente123

Resultado: ❌ "Las contraseñas no coinciden."
```

#### Caso 4: Contraseña Muy Corta
```
Contraseña Actual: password123
Nueva Contraseña: 123
Confirmar Nueva Contraseña: 123

Resultado: ❌ "La nueva contraseña debe tener al menos 8 caracteres."
```

## 🎨 INTERFAZ DE USUARIO

### Diseño:
- **Título**: "Cambiar Contraseña"
- **3 campos de entrada**: Contraseña actual, nueva y confirmación
- **Botones de mostrar/ocultar**: Icono de ojo en cada campo
- **Mensaje de ayuda**: "La contraseña debe tener al menos 8 caracteres"
- **Botón de acción**: "Cambiar Contraseña" con icono de candado
- **Estado de carga**: Spinner + "Cambiando..."
- **Validación en tiempo real**: Botón deshabilitado si faltan campos o no coinciden

### Estados del Botón:
```typescript
Deshabilitado cuando:
- Contraseña actual vacía
- Nueva contraseña < 8 caracteres
- Nueva contraseña ≠ Confirmación
- Está cargando

Habilitado cuando:
- Todos los campos completos
- Nueva contraseña ≥ 8 caracteres
- Nueva contraseña = Confirmación
```

## 📱 NOTIFICACIONES

### Éxito:
```
✅ Contraseña actualizada con éxito.
```

### Errores:
```
❌ Por favor, introduce tu contraseña actual.
❌ La nueva contraseña debe tener al menos 8 caracteres.
❌ Las contraseñas no coinciden.
❌ La contraseña actual es incorrecta.
❌ La nueva contraseña no cumple los requisitos.
❌ Error de conexión. Verifica que el servidor esté corriendo.
```

## 🔒 SEGURIDAD

### Validaciones del Backend:
1. **Autenticación requerida**: Token JWT válido
2. **Contraseña actual**: Verificada con `user.check_password()`
3. **Contraseña nueva**: Validada con `validate_password()` de Django
4. **Coincidencia**: `new_password` debe ser igual a `new_password_confirm`

### Validaciones del Frontend:
1. **Longitud mínima**: 8 caracteres
2. **Coincidencia**: Verificada antes de enviar
3. **Campos requeridos**: No se puede enviar con campos vacíos
4. **Feedback visual**: Botón deshabilitado si no cumple requisitos

## 🚀 VENTAJAS DE ESTA IMPLEMENTACIÓN

### Sin OTP:
✅ Más rápido para el usuario
✅ No requiere configuración de email
✅ Menos pasos en el flujo
✅ Menos puntos de fallo
✅ Mejor experiencia de usuario

### Con Seguridad:
✅ Requiere contraseña actual (autenticación)
✅ Validación de fortaleza de contraseña
✅ Token JWT requerido
✅ Validación en frontend y backend

## 📝 CÓDIGO CLAVE

### Frontend - Función de Cambio:
```typescript
const handleChangePassword = async () => {
  // Validaciones
  if (!currentPasswordInput.trim()) {
    toast.error('Por favor, introduce tu contraseña actual.');
    return;
  }
  if (newPasswordInput.length < 8) {
    toast.error('La nueva contraseña debe tener al menos 8 caracteres.');
    return;
  }
  if (newPasswordInput !== confirmNewPasswordInput) {
    toast.error('Las contraseñas no coinciden.');
    return;
  }

  setIsPasswordChangeLoading(true);
  try {
    const response = await fetch('http://localhost:8000/api/auth/change-password/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({
        current_password: currentPasswordInput,
        new_password: newPasswordInput,
        new_password_confirm: confirmNewPasswordInput,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      toast.success('Contraseña actualizada con éxito.');
      // Resetear campos
      setCurrentPasswordInput('');
      setNewPasswordInput('');
      setConfirmNewPasswordInput('');
    } else {
      // Manejar errores
      if (data.current_password) {
        toast.error(data.current_password[0]);
      } else if (data.new_password) {
        toast.error(data.new_password[0]);
      } else {
        toast.error('Error al cambiar la contraseña.');
      }
    }
  } catch (error) {
    toast.error('Error de conexión.');
  } finally {
    setIsPasswordChangeLoading(false);
  }
};
```

### Backend - Vista:
```python
class ChangePasswordView(APIView):
    """Vista para cambiar contraseña"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = PasswordChangeSerializer(
            data=request.data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            user = request.user
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            
            return Response({
                'message': 'Contraseña cambiada exitosamente'
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
```

### Backend - Serializer:
```python
class PasswordChangeSerializer(serializers.Serializer):
    """Serializer para cambio de contraseña"""
    
    current_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=8)
    new_password_confirm = serializers.CharField(required=True)
    
    def validate_current_password(self, value):
        """Validar contraseña actual"""
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("La contraseña actual es incorrecta.")
        return value
    
    def validate(self, attrs):
        """Validar que las nuevas contraseñas coincidan"""
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError({
                'new_password_confirm': 'Las contraseñas no coinciden.'
            })
        
        # Validar fortaleza de la nueva contraseña
        try:
            validate_password(attrs['new_password'])
        except ValidationError as e:
            raise serializers.ValidationError({
                'new_password': list(e.messages)
            })
        
        return attrs
```

## ✅ CHECKLIST DE VERIFICACIÓN

- [x] Endpoint del backend funcional
- [x] Serializer con validaciones
- [x] Frontend simplificado sin OTP
- [x] UI con 3 campos de contraseña
- [x] Botones de mostrar/ocultar contraseña
- [x] Validaciones en frontend
- [x] Validaciones en backend
- [x] Mensajes de error claros
- [x] Notificaciones de éxito
- [x] Reseteo de campos después de éxito
- [x] Estado de carga visual
- [x] Botón deshabilitado cuando corresponde

## 🎉 RESULTADO FINAL

El cambio de contraseña ahora funciona de forma simple y directa:
1. Usuario va a `/settings` → Tab "Perfil"
2. Introduce contraseña actual
3. Introduce nueva contraseña (mínimo 8 caracteres)
4. Confirma nueva contraseña
5. Hace clic en "Cambiar Contraseña"
6. ✅ Contraseña actualizada exitosamente

**Sin necesidad de OTP, códigos por email, o pasos adicionales.**
