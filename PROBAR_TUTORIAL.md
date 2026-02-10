# 🧪 CÓMO PROBAR EL TUTORIAL GUIADO

## 🚀 INICIO RÁPIDO

### Opción 1: Usuario Nuevo (Automático)
1. Crear una cuenta nueva o usar una cuenta que nunca haya visto el tutorial
2. Iniciar sesión
3. Esperar 2 segundos
4. El tutorial se iniciará automáticamente

### Opción 2: Reiniciar Tutorial (Manual)
1. Iniciar sesión con cualquier cuenta
2. Ir a **Configuración** (⚙️)
3. Scroll hasta la sección **Ayuda**
4. Expandir el accordion **"Tutorial Guiado"**
5. Click en el botón **"🚀 Reiniciar Tutorial"**
6. Serás redirigido al feed y el tutorial se iniciará

### Opción 3: Limpiar localStorage (Desarrollador)
1. Abrir DevTools (F12)
2. Ir a la pestaña **Application** (Chrome) o **Storage** (Firefox)
3. En el panel izquierdo, expandir **Local Storage**
4. Click en tu dominio (ej: `http://localhost:3000`)
5. Buscar la key `tutorial_seen_{userId}` y eliminarla
6. Recargar la página
7. El tutorial se iniciará automáticamente

---

## 🎯 QUÉ PROBAR

### 1. Navegación con Botones
- ✅ Click en **"Siguiente"** para avanzar
- ✅ Click en **"Atrás"** para retroceder
- ✅ Click en **"Saltar Tutorial"** para omitir
- ✅ Click en **"X"** para cerrar
- ✅ Click en **"¡Comenzar!"** en el último paso

### 2. Navegación con Teclado
- ✅ Presionar **→** o **↓** para avanzar
- ✅ Presionar **←** o **↑** para retroceder
- ✅ Presionar **Escape** para salir

### 3. Elementos Destacados
Verificar que el spotlight aparece correctamente en:
- ✅ Paso 1: Modal central (Bienvenida)
- ✅ Paso 2: Header del feed
- ✅ Paso 3: Stories slider
- ✅ Paso 4: Botón "Nueva Publicación"
- ✅ Paso 5: Botones de reacciones (en una publicación)
- ✅ Paso 6: Sección de comentarios (en una publicación)
- ✅ Paso 7: Sidebar derecho (solo desktop)
- ✅ Paso 8: Sidebar izquierdo
- ✅ Paso 9: Navegar a /profile
- ✅ Paso 10: Navegar a /communities
- ✅ Paso 11: Navegar a /clips
- ✅ Paso 12: Navegar a /messages
- ✅ Paso 13: Navegar a /notifications
- ✅ Paso 14: Navegar a /settings
- ✅ Paso 15: Botón flotante "+" (solo móvil)
- ✅ Paso 16: Modal central (Finalización)

### 4. Animaciones
- ✅ Fade in/out al cambiar de paso
- ✅ Spotlight con blur alrededor del elemento
- ✅ Tooltip con glass effect
- ✅ Barra de progreso animada
- ✅ Confetti en el paso final
- ✅ Punto pulsante en el elemento destacado

### 5. Responsive
- ✅ Desktop: Tooltips a los lados
- ✅ Móvil: Tooltips adaptados
- ✅ Tablet: Tooltips adaptados
- ✅ Botones más grandes en móvil

### 6. Persistencia
- ✅ Completar el tutorial
- ✅ Cerrar sesión
- ✅ Iniciar sesión nuevamente
- ✅ Verificar que el tutorial NO se muestra
- ✅ Ir a Configuración → Ayuda → Reiniciar Tutorial
- ✅ Verificar que el tutorial se muestra nuevamente

---

## 🐛 PROBLEMAS COMUNES

### El tutorial no se inicia automáticamente
**Solución:**
1. Verificar que el usuario es nuevo o que se limpió el localStorage
2. Verificar que el usuario está autenticado
3. Esperar 2 segundos después del inicio de sesión
4. Verificar la consola del navegador por errores

### El spotlight no aparece en el elemento correcto
**Solución:**
1. Verificar que el elemento tiene el ID correcto
2. Verificar que el elemento está visible en el DOM
3. Esperar a que la página cargue completamente
4. Verificar que no hay errores en la consola

### El tutorial se queda en un paso
**Solución:**
1. Presionar **Escape** para salir
2. Limpiar el localStorage
3. Recargar la página
4. Reiniciar el tutorial desde Configuración

### El confetti no aparece en el último paso
**Solución:**
1. Verificar que estás en el paso 16 (último)
2. Verificar que la librería `canvas-confetti` está instalada
3. Verificar la consola por errores
4. Recargar la página y volver a intentar

---

## 📊 CHECKLIST DE TESTING

### Funcionalidad Básica
- [ ] Tutorial se inicia automáticamente para usuarios nuevos
- [ ] Tutorial se puede reiniciar desde Configuración
- [ ] Navegación con botones funciona correctamente
- [ ] Navegación con teclado funciona correctamente
- [ ] Tutorial se puede omitir
- [ ] Tutorial se puede cerrar con X
- [ ] Tutorial se guarda en localStorage al completar

### Elementos Visuales
- [ ] Spotlight aparece en todos los elementos
- [ ] Tooltips se posicionan correctamente
- [ ] Barra de progreso se actualiza
- [ ] Confetti aparece en el último paso
- [ ] Animaciones son suaves
- [ ] Punto pulsante es visible

### Navegación entre Páginas
- [ ] Tutorial navega correctamente a /profile
- [ ] Tutorial navega correctamente a /communities
- [ ] Tutorial navega correctamente a /clips
- [ ] Tutorial navega correctamente a /messages
- [ ] Tutorial navega correctamente a /notifications
- [ ] Tutorial navega correctamente a /settings
- [ ] Tutorial regresa correctamente a /feed

### Responsive
- [ ] Desktop: Tooltips a los lados
- [ ] Móvil: Tooltips adaptados
- [ ] Tablet: Tooltips adaptados
- [ ] Botones son clickeables en todos los dispositivos
- [ ] Texto es legible en todos los tamaños

### Persistencia
- [ ] Tutorial no se muestra después de completarlo
- [ ] Tutorial se puede reiniciar manualmente
- [ ] localStorage se guarda correctamente
- [ ] localStorage se limpia al reiniciar

---

## 🎥 GRABACIÓN DE PRUEBAS

Para documentar las pruebas, se recomienda:
1. Grabar un video del tutorial completo
2. Capturar screenshots de cada paso
3. Documentar cualquier bug encontrado
4. Anotar sugerencias de mejora

---

## 📝 REPORTE DE BUGS

Si encuentras un bug, reporta:
1. **Descripción:** ¿Qué pasó?
2. **Pasos para reproducir:** ¿Cómo llegaste ahí?
3. **Comportamiento esperado:** ¿Qué debería pasar?
4. **Comportamiento actual:** ¿Qué está pasando?
5. **Screenshots/Video:** Evidencia visual
6. **Navegador:** Chrome, Firefox, Safari, etc.
7. **Dispositivo:** Desktop, móvil, tablet
8. **Consola:** Errores en la consola del navegador

---

## ✅ CRITERIOS DE ACEPTACIÓN

El tutorial está listo para producción cuando:
- ✅ Se inicia automáticamente para usuarios nuevos
- ✅ Se puede reiniciar manualmente desde Configuración
- ✅ Todos los 16 pasos funcionan correctamente
- ✅ La navegación con botones y teclado funciona
- ✅ El spotlight aparece en todos los elementos
- ✅ Las animaciones son suaves
- ✅ El confetti aparece en el último paso
- ✅ Es responsive en todos los dispositivos
- ✅ Se guarda correctamente en localStorage
- ✅ No hay errores en la consola

---

**¡Buena suerte con las pruebas!** 🚀

