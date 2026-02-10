# Plan Tutorial Guiado - Clasificados

## ✅ IMPLEMENTACIÓN COMPLETADA

### Estado: LISTO PARA PROBAR

---

## Análisis de la Página de Clasificados

### Estructura Principal
La página `/classifieds` tiene 6 pestañas principales:

1. **Explorar y market play** (browse) - Búsqueda y navegación de clasificados vende cosas
2. **Mis Ads** (my-ads) - Gestión de anuncios propios
3. **Empleos** (jobs) - Búsqueda de empleo
4. **Conexión** (enterprises) - Conexión empresarial
5. **Agenda** (cultural-agenda) - Eventos culturales
6. **Publicar** (create) - Crear nuevos anuncios

### Funcionalidades Clave Identificadas

#### 1. Explorar (Tab Principal)
- **Barra de búsqueda** con filtros
- **Categorías**: Todos, Deportes, Tecnología, Música, Moda, Hogar
- **Grid de clasificados** con cards que muestran:
  - Imagen del producto/servicio
  - Título y descripción
  - Precio (con badge "Negociable")
  - Ubicación
  - Estadísticas (vistas, likes)
  - Información del vendedor (avatar, nombre, rating, verificado)
  - Botones: Like y Ver detalles
- **Estados especiales**: Featured (destacado)

#### 2. Publicar
- **3 tipos de publicaciones**:
  1. **Producto Físico** (ShoppingBag icon)
     - Galería de fotos múltiples
     - Estado del producto
     - Precio negociable
     - Ubicación y entrega
     - Categorías específicas
  
  2. **Servicio Marketplace** (Store icon) - POPULAR
     - Tarifas por hora/servicio
     - Disponibilidad horaria
     - Área de cobertura
     - Reseñas y calificaciones
     - Reserva instantánea
  
  3. **Trabajo Freelancer** (Briefcase icon)
     - Portfolio de trabajos
     - Presupuestos personalizados
     - Plazos de entrega
     - Habilidades y certificaciones
     - Comunicación directa

#### 3. Mis Ads
- Vista de anuncios propios
- Estado vacío con CTA para crear primer anuncio

#### 4. Empleos
- Sección de búsqueda de empleo
- CTA para crear oferta de empleo

#### 5. Conexión Empresarial
- Networking empresarial
- CTA para crear proyecto

#### 6. Agenda Cultural
- Eventos culturales
- CTA para crear evento

### Componentes Importantes
- `MainClassifiedFlow` - Flujo principal de creación con pasos
- `PublishMainView` - Vista principal de publicación
- `ClassifiedCard` - Card individual de clasificado
- `PublicationStatsBanner` - Banner de estadísticas
- `QuickPublishCards` - Cards rápidas de publicación

---

## Tutorial Guiado Implementado (14 pasos)

### Paso 0: Bienvenida
- **Tipo**: Modal centro
- **Título**: "¡Bienvenido a Clasificados!"
- **Descripción**: "Descubre cómo comprar, vender e intercambiar con la comunidad SOS-HABILIDOSO. Te guiaremos paso a paso."
- **Botón**: "Comenzar Tour"

### Paso 1: Explorar Tab
- **Elemento**: Tab "Explorar" (`#tab-browse`)
- **Título**: "Explora Clasificados"
- **Descripción**: "Aquí puedes buscar productos, servicios y trabajos freelance publicados por la comunidad."
- **Highlight**: Tab "Explorar"

### Paso 2: Barra de Búsqueda
- **Elemento**: Input de búsqueda (`#search-bar`)
- **Título**: "Busca lo que necesitas"
- **Descripción**: "Usa la barra de búsqueda para encontrar productos o servicios específicos."
- **Highlight**: Barra de búsqueda

### Paso 3: Filtros
- **Elemento**: Botón "Filtros" (`#filters-button`)
- **Título**: "Filtra tus resultados"
- **Descripción**: "Aplica filtros para refinar tu búsqueda por categoría, precio, ubicación y más."
- **Highlight**: Botón de filtros

### Paso 4: Categorías
- **Elemento**: Pills de categorías (`#categories-pills`)
- **Título**: "Navega por categorías"
- **Descripción**: "Selecciona una categoría para ver clasificados específicos. Cada categoría muestra el número de anuncios disponibles."
- **Highlight**: Pills de categorías

### Paso 5: Card de Clasificado
- **Elemento**: Primera card de clasificado (`#first-classified-card`)
- **Título**: "Detalles del anuncio"
- **Descripción**: "Cada card muestra información clave: imagen, título, precio, ubicación, vendedor y estadísticas. Haz click en el ojo para ver más detalles."
- **Highlight**: Primera card

### Paso 6: Botón Like
- **Elemento**: Botón de corazón en la card (`.classified-card-like`)
- **Título**: "Guarda tus favoritos"
- **Descripción**: "Dale like a los anuncios que te interesen para guardarlos y verlos después."
- **Highlight**: Botón de like

### Paso 7: Tab Mis Ads
- **Elemento**: Tab "Mis Ads" (`#tab-my-ads`)
- **Título**: "Gestiona tus anuncios"
- **Descripción**: "Aquí encontrarás todos tus anuncios publicados y podrás editarlos o pausarlos."
- **Highlight**: Tab "Mis Ads"

### Paso 8: Tab Empleos
- **Elemento**: Tab "Empleos" (`#tab-jobs`)
- **Título**: "Busca oportunidades laborales"
- **Descripción**: "Explora ofertas de empleo o publica tu propia oferta para encontrar talento."
- **Highlight**: Tab "Empleos"

### Paso 9: Tab Conexión
- **Elemento**: Tab "Conexión" (`#tab-enterprises`)
- **Título**: "Conecta con empresas"
- **Descripción**: "Networking empresarial para proyectos y colaboraciones profesionales."
- **Highlight**: Tab "Conexión"

### Paso 10: Tab Agenda
- **Elemento**: Tab "Agenda" (`#tab-cultural-agenda`)
- **Título**: "Eventos culturales"
- **Descripción**: "Descubre y publica eventos culturales, deportivos y comunitarios."
- **Highlight**: Tab "Agenda"

### Paso 11: Tab Publicar
- **Elemento**: Tab "Publicar" (`#tab-create`)
- **Título**: "Crea tu primera publicación"
- **Descripción**: "¡Es hora de publicar! Elige entre producto físico, servicio o trabajo freelancer."
- **Highlight**: Tab "Publicar"

### Paso 12: Tipos de Publicación
- **Elemento**: Cards de tipos de publicación (`#publication-types`)
- **Título**: "Elige el tipo de anuncio"
- **Descripción**: "Selecciona el tipo que mejor se adapte a lo que quieres ofrecer. Cada tipo tiene características específicas."
- **Highlight**: Las 3 cards de tipos

### Paso 13: Finalización
- **Tipo**: Modal centro
- **Título**: "¡Tutorial completado!"
- **Descripción**: "Ya conoces todas las funcionalidades de Clasificados. ¡Comienza a explorar y publicar!"
- **Botones**: "Explorar Ahora" / "Crear Anuncio"

---

## ✅ Elementos Implementados (IDs agregados)

### En la página principal:
1. ✅ `#tab-browse` - Tab Explorar
2. ✅ `#tab-my-ads` - Tab Mis Ads
3. ✅ `#tab-jobs` - Tab Empleos
4. ✅ `#tab-enterprises` - Tab Conexión
5. ✅ `#tab-cultural-agenda` - Tab Agenda
6. ✅ `#tab-create` - Tab Publicar
7. ✅ `#search-bar` - Barra de búsqueda
8. ✅ `#filters-button` - Botón de filtros
9. ✅ `#categories-pills` - Contenedor de categorías
10. ✅ `#first-classified-card` - Primera card (para ejemplo)
11. ✅ `#publication-types` - Contenedor de tipos de publicación

### En las cards:
- ✅ `.classified-card-like` - Botón de like

---

## ✅ Implementación Técnica Completada

### 1. ✅ IDs agregados a los elementos
Modificado `app/classifieds/page.tsx` con todos los IDs necesarios

### 2. ✅ TutorialProvider para Clasificados creado
- `TutorialClassifiedsProvider` - Context provider con 14 pasos
- Detección automática de primera visita
- Persistencia en localStorage

### 3. ✅ Componentes creados:
- `TutorialClassifiedsProvider` - Context provider ✅
- `TutorialClassifiedsOverlay` - Overlay flotante con card animada ✅
- `TutorialClassifiedsHighlight` - Highlight de elementos con borde neon ✅

### 4. ✅ Integración completada
- Provider agregado en `app/classifieds/page.tsx` ✅
- Overlay y Highlight renderizados ✅
- Detección de primera visita con localStorage ✅
- Tutorial se muestra automáticamente ✅

---

## Características del Tutorial

- **Colores**: Esquema neon-green consistente con la app
- **Animaciones**: Suaves y no intrusivas
- **Responsive**: Funcional en mobile, tablet y desktop
- **Accesibilidad**: Navegación con teclado (flechas, ESC)
- **Persistencia**: Guarda progreso en localStorage (`classifieds_tutorial_completed`)
- **Auto-inicio**: Se inicia automáticamente 1 segundo después de cargar la página (solo primera vez)
- **Scroll suave**: Centra elementos automáticamente sin mover el layout
- **Overlay oscuro**: Resalta el elemento actual con fondo oscuro en el resto

---

## Archivos Modificados/Creados

### Creados:
1. ✅ `components/tutorial/tutorial-classifieds-provider.tsx`
2. ✅ `components/tutorial/tutorial-classifieds-overlay.tsx`
3. ✅ `components/tutorial/tutorial-classifieds-highlight.tsx`

### Modificados:
1. ✅ `app/classifieds/page.tsx` - Agregados IDs, provider y componentes

---

## 🎯 Estado Final: LISTO PARA PROBAR

### Para probar el tutorial:
1. Navegar a `/classifieds`
2. El tutorial se iniciará automáticamente (primera vez)
3. Usar flechas ← → para navegar
4. Presionar ESC para saltar el tutorial
5. Para volver a ver el tutorial, borrar `classifieds_tutorial_completed` de localStorage

### Para resetear el tutorial:
```javascript
localStorage.removeItem('classifieds_tutorial_completed');
```

---

## Notas de Diseño

- **Colores**: Usar el esquema de colores existente (neon-green, blue, purple, etc.)
- **Animaciones**: Suaves y no intrusivas
- **Responsive**: Funcional en mobile, tablet y desktop
- **Accesibilidad**: Navegación con teclado (flechas, ESC)
- **Persistencia**: Guardar progreso en localStorage

---

## ✅ Checklist Final

- [x] Análisis completado
- [x] IDs agregados a elementos en la página
- [x] Componentes del tutorial creados
- [x] Lógica de pasos implementada
- [x] Provider integrado
- [x] Overlay y Highlight renderizados
- [x] Sin errores de TypeScript
- [x] Listo para testing

---

## 🚀 PRÓXIMO PASO: PROBAR EN EL NAVEGADOR
