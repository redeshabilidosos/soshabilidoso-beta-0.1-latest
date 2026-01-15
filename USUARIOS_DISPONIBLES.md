# Usuarios Disponibles para Login

## Credenciales Generales
- **Contraseña para todos los usuarios:** `Password123!`

## Usuarios en MySQL (Base de datos actual)

| Username | Email | Display Name |
|----------|-------|--------------|
| `redes.habilidosos` | redes.habilidosos@gmail.com | Sos Habilidosos |
| `test2` | molo@molo.com | - |
| `juanse444` | jgautos48@gmail.com | - |
| `jazmin` | jazmin@pinzon.com | - |
| `testmolo` | malditomolo@gmail.com | - |
| `molo` | camilogezdeveloper@gmail.com | - |
| `admin` | admin@test.com | - |

## Cómo Probar el Login

### Desde el navegador
1. Accede a `http://localhost:4000/login`
2. Ingresa cualquier usuario de la tabla anterior
3. Contraseña: `Password123!`
4. Haz clic en "Iniciar Sesión"

### Desde cURL
```bash
curl -X POST http://127.0.0.1:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"login": "redes.habilidosos", "password": "Password123!"}'
```

### Desde Python
```python
import requests

response = requests.post(
    "http://127.0.0.1:8000/api/auth/login/",
    json={
        "login": "redes.habilidosos",
        "password": "Password123!"
    }
)

print(response.json())
```

## Respuesta Esperada

```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "407807e7-b8a7-4710-9722-23db1c26ba39",
    "email": "redes.habilidosos@gmail.com",
    "username": "redes.habilidosos",
    "display_name": "Sos Habilidosos",
    ...
  }
}
```

## Notas Importantes

- El campo `login` acepta tanto **username** como **email**
- Las contraseñas se han reseteado a `Password123!` para todos los usuarios
- Los tokens JWT tienen una duración de 1 hora (access) y 7 días (refresh)
- El token se almacena automáticamente en `localStorage` después del login
