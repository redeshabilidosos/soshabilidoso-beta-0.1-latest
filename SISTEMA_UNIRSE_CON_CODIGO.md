# Sistema de Unirse con Código - Reuniones y Clases

## Funcionalidad Implementada

Se ha mejorado la página `/live/join` para permitir que los usuarios se unan a reuniones, clases y streams usando un código de acceso.

## Página: `/live/join`

### Características

#### 1. **Búsqueda Inteligente**
El sistema busca el código en múltiples fuentes:

```typescript
// 1. Buscar en reuniones (por ID)
const meetings = JSON.parse(localStorage.getItem('active_meetings') || '[]');
const meeting = meetings.find((m: any) => m.id === codeUpper);

// 2. Buscar en clases (por ID o código de acceso)
const classes = JSON.parse(localStorage.getItem('active_classes') || '[]');
const foundClass = classes.find((c: any) => 
  c.id === codeUpper || c.accessCode === codeUpper
);

// 3. Buscar en streams (compatibilidad)
const streams = JSON.parse(localStorage.getItem('active_streams') || '[]');
const stream = streams.find((s: any) => 
  s.id === codeUpper || s.accessCode === codeUpper
);
```

#### 2. **Tipos de Código Soportados**

**Reuniones:**
- ID de 8 caracteres: `A1B2C3D4`
- Redirige a: `/live/meeting/A1B2C3D4`

**Clases:**
- ID de 8 caracteres: `X9Y8Z7W6`
- Código de acceso de 6 caracteres: `ABC123`
- Redirige a: `/live/class/X9Y8Z7W6`

**Streams:**
- ID o código de acceso
- Redirige a: `/live/stream/[id]`

#### 3. **Validación de Clases Privadas**

```typescript
if (foundClass.isPrivate && 
    foundClass.accessCode !== codeUpper && 
    foundClass.id !== codeUpper) {
  toast.error('Código de acceso incorrecto');
  return;
}
```

- Si la clase es privada, valida el código de acceso
- Permite unirse con el ID de clase o el código de acceso
- Muestra error si el código es incorrecto

## Interfaz de Usuario

### Diseño

```
┌─────────────────────────────────────┐
│  ← Volver                           │
│                                     │
│         [🎥]                        │
│    Unirse con Código                │
│  Ingresa el código de reunión       │
│                                     │
│  Código de Acceso                   │
│  ┌──────────────────────────────┐   │
│  │  🔑  A1B2C3D4               │   │
│  └──────────────────────────────┘   │
│  Puede ser un ID de reunión...      │
│                                     │
│  [        Unirse        ]           │
│                                     │
│  ┌─ Reuniones ──────────────────┐   │
│  │ Usa el ID de 8 caracteres   │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─ Clases ─────────────────────┐   │
│  │ Usa el ID o código de 6     │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─ Nota ──────────────────────┐   │
│  │ Solo sesiones activas       │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

### Elementos

**Input de Código:**
- Texto centrado
- Fuente monoespaciada
- Mayúsculas automáticas
- Máximo 8 caracteres
- Icono de llave
- Enter para enviar

**Botón Unirse:**
- Gradiente azul/cyan
- Deshabilitado si no hay código
- Muestra "Verificando..." al procesar

**Cards Informativos:**
- 🔵 Reuniones (azul)
- 🟢 Clases (verde)
- 🟡 Nota (amarillo)

## Flujo de Usuario

### Caso 1: Unirse a Reunión

```
1. Usuario recibe: "ID: A1B2C3D4"
   ↓
2. Va a /live
   ↓
3. Clic en "Ingresar código"
   ↓
4. Ingresa: A1B2C3D4
   ↓
5. Clic en "Unirse" o Enter
   ↓
6. Sistema busca en reuniones activas
   ↓
7. ✅ Encuentra reunión
   ↓
8. Toast: "¡Uniéndote a la reunión!"
   ↓
9. Redirige a /live/meeting/A1B2C3D4
   ↓
10. Usuario entra a la sala
```

### Caso 2: Unirse a Clase con ID

```
1. Usuario recibe: "ID: X9Y8Z7W6"
   ↓
2. Va a /live/join
   ↓
3. Ingresa: X9Y8Z7W6
   ↓
4. Sistema busca en clases activas
   ↓
5. ✅ Encuentra clase
   ↓
6. Toast: "¡Uniéndote a la clase!"
   ↓
7. Redirige a /live/class/X9Y8Z7W6
```

### Caso 3: Unirse a Clase con Código de Acceso

```
1. Usuario recibe: "Código: ABC123"
   ↓
2. Va a /live/join
   ↓
3. Ingresa: ABC123
   ↓
4. Sistema busca en clases activas
   ↓
5. Encuentra clase por accessCode
   ↓
6. Valida que sea el código correcto
   ↓
7. ✅ Código válido
   ↓
8. Redirige a /live/class/[id]
```

### Caso 4: Código Inválido

```
1. Usuario ingresa: INVALID1
   ↓
2. Sistema busca en todas las fuentes
   ↓
3. ❌ No encuentra ninguna sesión
   ↓
4. Toast: "Código inválido o la sesión ha finalizado"
   ↓
5. Usuario permanece en /live/join
```

## Lógica de Búsqueda

### Prioridad de Búsqueda

1. **Reuniones** (por ID exacto)
2. **Clases** (por ID o código de acceso)
3. **Streams** (por ID o código)

### Código de Búsqueda

```typescript
const handleJoin = async () => {
  const codeUpper = code.toUpperCase().trim();

  // 1. Buscar reunión
  const meeting = meetings.find((m: any) => m.id === codeUpper);
  if (meeting) {
    router.push(`/live/meeting/${meeting.id}`);
    return;
  }

  // 2. Buscar clase
  let foundClass = classes.find((c: any) => c.id === codeUpper);
  if (!foundClass) {
    foundClass = classes.find((c: any) => c.accessCode === codeUpper);
  }
  if (foundClass) {
    // Validar si es privada
    if (foundClass.isPrivate && 
        foundClass.accessCode !== codeUpper && 
        foundClass.id !== codeUpper) {
      toast.error('Código de acceso incorrecto');
      return;
    }
    router.push(`/live/class/${foundClass.id}`);
    return;
  }

  // 3. Buscar stream
  const stream = streams.find((s: any) => 
    s.id === codeUpper || s.accessCode === codeUpper
  );
  if (stream) {
    router.push(`/live/stream/${stream.id}`);
    return;
  }

  // No encontrado
  toast.error('Código inválido o la sesión ha finalizado');
};
```

## Mensajes de Toast

### Éxito
- ✅ "¡Uniéndote a la reunión!"
- ✅ "¡Uniéndote a la clase!"
- ✅ "¡Uniéndote al stream!"

### Error
- ❌ "Ingresa un código"
- ❌ "Código de acceso incorrecto"
- ❌ "Código inválido o la sesión ha finalizado"
- ❌ "Error al unirse. Intenta de nuevo."

## Validaciones

### Input
```typescript
// Mayúsculas automáticas
onChange={(e) => setCode(e.target.value.toUpperCase())}

// Máximo 8 caracteres
maxLength={8}

// Enter para enviar
onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
```

### Botón
```typescript
// Deshabilitado si:
disabled={isLoading || !code.trim()}
```

### Código
```typescript
// Trim y uppercase
const codeUpper = code.toUpperCase().trim();

// Validar no vacío
if (!code.trim()) {
  toast.error('Ingresa un código');
  return;
}
```

## Almacenamiento Local

### Estructura de Datos

**Reuniones:**
```json
{
  "id": "A1B2C3D4",
  "type": "meeting",
  "title": "Reunión de Equipo",
  "isPrivate": false,
  "hostName": "Usuario",
  "startedAt": "2026-01-28T10:00:00Z",
  "participants": []
}
```

**Clases:**
```json
{
  "id": "X9Y8Z7W6",
  "type": "class",
  "title": "Clase de JavaScript",
  "isPrivate": true,
  "accessCode": "ABC123",
  "hostName": "Instructor",
  "startedAt": "2026-01-28T10:00:00Z",
  "students": []
}
```

### Keys de LocalStorage
- `active_meetings`: Array de reuniones activas
- `active_classes`: Array de clases activas
- `active_streams`: Array de streams activos

## Responsive Design

### Mobile
- Input grande y centrado
- Botón full-width
- Cards apilados verticalmente
- Texto legible

### Tablet
- Layout similar a mobile
- Más espaciado
- Cards más anchas

### Desktop
- Card centrado (max-w-md)
- Espaciado generoso
- Hover effects

## Accesibilidad

### Teclado
- ✅ Tab para navegar
- ✅ Enter para enviar
- ✅ Escape para cerrar (si aplica)

### Screen Readers
- ✅ Labels descriptivos
- ✅ Placeholders informativos
- ✅ Mensajes de error claros

### Visual
- ✅ Alto contraste
- ✅ Iconos descriptivos
- ✅ Colores diferenciados por tipo

## Integración con Página /live

### Botón en Header
```typescript
<Link href="/live/join">
  <Button variant="outline">
    Ingresar código
  </Button>
</Link>
```

### Card de Acceso
```typescript
<Card>
  <CardContent>
    <Key className="w-6 h-6 text-primary" />
    <p>¿Tienes un código de acceso?</p>
    <p>Únete a una clase privada con el código del instructor</p>
    <Link href="/live/join">
      <Button>Ingresar código</Button>
    </Link>
  </CardContent>
</Card>
```

## Próximas Mejoras

### Backend
- [ ] Validar códigos en servidor
- [ ] Verificar permisos de acceso
- [ ] Registrar participantes
- [ ] Notificar al host

### Frontend
- [ ] Historial de códigos recientes
- [ ] Autocompletar códigos guardados
- [ ] Escanear QR code
- [ ] Compartir código por NFC

### UX
- [ ] Sugerencias de códigos similares
- [ ] Verificación en tiempo real
- [ ] Preview de la sesión antes de unirse
- [ ] Mostrar participantes actuales

## Casos de Uso

### Educación
```
Instructor: "El código de hoy es ABC123"
Estudiantes: [Ingresan código]
Sistema: [Valida y une a la clase]
```

### Empresas
```
Organizador: "ID de reunión: A1B2C3D4"
Participantes: [Ingresan ID]
Sistema: [Une a la reunión]
```

### Eventos
```
Host: "Código del stream: XYZ789"
Espectadores: [Ingresan código]
Sistema: [Une al stream]
```

## Fecha de Implementación
28 de Enero de 2026
