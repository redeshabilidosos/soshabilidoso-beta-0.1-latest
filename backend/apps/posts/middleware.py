"""
Middleware para autenticación WebSocket
"""
from urllib.parse import parse_qs
from django.contrib.auth.models import AnonymousUser
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from jwt import decode as jwt_decode
from django.conf import settings
from channels.db import database_sync_to_async

User = get_user_model()


@database_sync_to_async
def get_user_from_token(token_string):
    """Obtener usuario desde token JWT"""
    try:
        # Validar el token
        UntypedToken(token_string)
        
        # Decodificar el token
        decoded_data = jwt_decode(
            token_string, 
            settings.SECRET_KEY, 
            algorithms=["HS256"]
        )
        
        # Obtener el usuario
        user_id = decoded_data.get('user_id')
        if user_id:
            user = User.objects.get(id=user_id)
            return user
        
    except (InvalidToken, TokenError, User.DoesNotExist, Exception) as e:
        print(f"Error autenticando WebSocket: {e}")
        pass
    
    return AnonymousUser()


class TokenAuthMiddleware:
    """Middleware para autenticar WebSockets con JWT"""
    
    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        # Obtener token de query parameters
        query_string = scope.get('query_string', b'').decode()
        query_params = parse_qs(query_string)
        token = query_params.get('token', [None])[0]
        
        # Autenticar usuario
        if token:
            scope['user'] = await get_user_from_token(token)
        else:
            scope['user'] = AnonymousUser()
        
        return await self.inner(scope, receive, send)


def TokenAuthMiddlewareStack(inner):
    """Stack de middleware para autenticación"""
    return TokenAuthMiddleware(inner)