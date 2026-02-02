# 🚀 Plan de Optimización de Rendimiento - Implementación

## 📋 FASE 1: QUICK WINS (Implementar AHORA)

### 1. Optimizar Particle Background
**Archivo:** `hooks/use-particle-background.ts`

**Cambios:**
```typescript
// Reducir partículas
const particleCount = window.innerWidth < 768 ? 0 : 50; // Era 150, 0 en móvil

// Throttle a 30 FPS
let lastFrame = 0;
const FPS_LIMIT = 30;
const FRAME_MIN_TIME = 1000 / FPS_LIMIT;

const animate = (timestamp: number) => {
  if (timestamp - lastFrame < FRAME_MIN_TIME) {
    animationFrameRef.current = requestAnimationFrame(animate);
    return;
  }
  lastFrame = timestamp;
  // ... resto del código
};

// Desactivar en móvil al inicio
if (typeof window !== 'undefined' && window.innerWidth < 768) {
  console.log('🚫 Partículas deshabilitadas en móvil');
  return;
}
```

**Impacto:** -1.5s carga, -500ms navegación

---

### 2. Precargar Menú en RootLayoutClient
**Archivo:** `app/RootLayoutClient.tsx`

**Cambios:**
```typescript
// Precargar inmediatamente, no en idle
useEffect(() => {
  setIsMounted(true);
  sessionStorage.setItem('splashShown', 'true');
  
  // Precargar INMEDIATAMENTE (no esperar idle)
  Promise.all([
    preloadSiteSettings(),
    menuConfigService.preload()
  ]).catch(console.error);
  
  const timer = setTimeout(() => {
    setShowFloatingButtons(true);
  }, 1000);
  
  return () => clearTimeout(timer);
}, []);
```

**Impacto:** -400ms sidebar

---

### 3. Cargar Datos del Feed en Paralelo
**Archivo:** `app/feed/page.tsx`

**Cambios:**
```typescript
// Reemplazar múltiples useEffect por uno solo
useEffect(() => {
  const loadAllData = async () => {
    if (!effectiveUser) return;
    
    // Prevenir cargas duplicadas
    if (postsLoadedRef.current) return;
    postsLoadedRef.current = true;
    adsLoadedRef.current = true;
    storiesLoadedRef.current = true;
    
    try {
      setIsLoadingPosts(true);
      setIsLoadingStories(true);
      setLoadingSuggestions(true);
      
      // CARGAR TODO EN PARALELO
      const [postsData, storiesData, adsData, suggestionsData] = await Promise.allSettled([
        import('@/lib/services/posts.service').then(m => m.postsService.getPosts()),
        import('@/lib/services/stories.service').then(m => m.storiesService.getFriendsStories()),
        import('@/lib/services/advertising.service').then(m => m.advertisingService.getFeedAds(0, 5)),
        loadSuggestionsData() // Nueva función que carga usuarios y comunidades en paralelo
      ]);
      
      // Procesar resultados
      if (postsData.status === 'fulfilled') {
        const mappedPosts = postsData.value.results.map(/* ... */);
        setPosts(mappedPosts);
      }
      
      if (storiesData.status === 'fulfilled') {
        // Mapear historias
        setUserStories(mappedStories);
      }
      
      if (adsData.status === 'fulfilled') {
        setFeedAds(adsData.value.ads.length > 0 ? adsData.value.ads : [demoAd]);
      }
      
      // ... procesar sugerencias
      
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setIsLoadingPosts(false);
      setIsLoadingStories(false);
      setLoadingSuggestions(false);
    }
  };
  
  loadAllData();
}, [effectiveUser]);

// Nueva función para cargar sugerencias en paralelo
const loadSuggestionsData = async () => {
  const token = localStorage.getItem('access_token');
  
  const [usersResponse, communitiesResponse] = await Promise.allSettled([
    fetch('http://127.0.0.1:8000/api/users/suggested/', {
      headers: { 'Authorization': `Bearer ${token}` }
    }),
    fetch('http://127.0.0.1:8000/api/communities/suggested/', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
  ]);
  
  return { usersResponse, communitiesResponse };
};
```

**Impacto:** -1.5s feed

---

### 4. Reducir Lazy Loading Innecesario
**Archivo:** `app/feed/page.tsx`

**Cambios:**
```typescript
// Importar directamente componentes pequeños
import { Sidebar } from '@/components/navigation/sidebar';
import { MobileNav } from '@/components/navigation/mobile-nav';
import { PostCard } from '@/components/ui/post-card';
import { RealtimeIndicator } from '@/components/ui/realtime-indicator';

// Mantener lazy solo para componentes pesados
const MeetingNotifications = lazy(() => import('@/components/communities/meeting-notifications'));
const NewPostDialog = lazy(() => import('@/components/ui/new-post-dialog'));
const AdCard = lazy(() => import('@/components/advertising/ad-card'));
const StoriesSlider = lazy(() => import('@/components/ui/stories-slider'));
const NewStoryDialog = lazy(() => import('@/components/ui/new-story-dialog'));
```

**Impacto:** -300ms chunks

---

### 5. Optimizar Auth Provider
**Archivo:** `components/providers/auth-provider.tsx`

**Cambios:**
```typescript
import { startTransition } from 'react';

// En initAuth, usar startTransition para actualizaciones no urgentes
const initAuth = async () => {
  if (isInitializedRef.current && user) {
    if (!verificationDoneRef.current) {
      verificationDoneRef.current = true;
      // Verificar en background SIN bloquear UI
      startTransition(() => {
        refreshUser().catch(console.warn);
      });
    }
    return;
  }
  
  // ... resto del código
  
  // Actualizar perfil en background con startTransition
  startTransition(() => {
    authService.getProfile()
      .then(freshUser => {
        const mappedUser = { /* ... */ };
        updateUser(mappedUser);
        localStorage.setItem('user', JSON.stringify(mappedUser));
      })
      .catch(() => {
        // Silenciosamente fallar
      });
  });
};
```

**Impacto:** -300ms re-renders

---

## 📊 RESUMEN FASE 1

**Tiempo de implementación:** 1-2 horas  
**Impacto total:** -3.5s en carga inicial, -1s en navegación  
**Esfuerzo:** Bajo  
**Riesgo:** Mínimo

---

## 🔧 COMANDOS PARA VALIDAR

```bash
# 1. Medir antes de optimizar
npm run build
npm run start

# 2. Abrir Chrome DevTools > Performance
# 3. Grabar carga de página
# 4. Anotar métricas:
#    - FCP (First Contentful Paint)
#    - LCP (Largest Contentful Paint)
#    - TTI (Time to Interactive)

# 5. Implementar cambios

# 6. Medir después
npm run build
npm run start

# 7. Comparar métricas
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### Particle Background
- [ ] Reducir partículas a 50
- [ ] Desactivar en móvil (< 768px)
- [ ] Throttle a 30 FPS
- [ ] Probar en desktop
- [ ] Probar en móvil
- [ ] Validar CPU usage < 10%

### Menú Sidebar
- [ ] Mover precarga a RootLayoutClient
- [ ] Eliminar requestIdleCallback
- [ ] Probar carga del menú
- [ ] Validar caché funciona

### Feed Data Loading
- [ ] Consolidar useEffects
- [ ] Implementar Promise.all
- [ ] Crear loadSuggestionsData
- [ ] Probar carga paralela
- [ ] Validar todos los datos cargan

### Lazy Loading
- [ ] Identificar componentes pequeños
- [ ] Convertir a imports directos
- [ ] Mantener lazy solo en pesados
- [ ] Probar navegación
- [ ] Validar chunks reducidos

### Auth Provider
- [ ] Importar startTransition
- [ ] Envolver actualizaciones no urgentes
- [ ] Probar login
- [ ] Validar re-renders reducidos

---

## 📈 MÉTRICAS ESPERADAS

### Antes
```
FCP: 2.5s - 4s
LCP: 3s - 4.5s
TTI: 3.5s - 5.5s
Navegación: 0.8s - 1.8s
```

### Después (Fase 1)
```
FCP: 1s - 1.5s  ✅ -60%
LCP: 1.5s - 2s  ✅ -55%
TTI: 1.5s - 2.5s  ✅ -55%
Navegación: 0.3s - 0.8s  ✅ -60%
```

---

## 🚨 NOTAS IMPORTANTES

1. **Probar en móvil:** Las optimizaciones de partículas son críticas para móvil
2. **Caché del navegador:** Limpiar caché entre pruebas para mediciones precisas
3. **Network throttling:** Probar con "Fast 3G" en DevTools
4. **Lighthouse:** Ejecutar después de cada cambio
5. **Rollback plan:** Hacer commit antes de cada optimización

---

## 🎯 PRÓXIMOS PASOS

Después de completar Fase 1:
1. Medir mejoras con Lighthouse
2. Documentar resultados
3. Si mejora > 50%, continuar con Fase 2
4. Si mejora < 50%, revisar implementación

**Fase 2 incluirá:**
- React Query para caché
- WebSocket global
- Route prefetching
- Bundle optimization
