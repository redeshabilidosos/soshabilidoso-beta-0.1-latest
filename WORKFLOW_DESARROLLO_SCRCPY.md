# Workflow de Desarrollo con Scrcpy

**Fecha:** 28 de Enero de 2026  
**Estado:** ✅ Configurado para desarrollo ágil

---

## 🎯 VENTAJAS DE USAR SCRCPY

### vs Android Studio
- ✅ **Mucho más ligero** - No consume tanta RAM/CPU
- ✅ **Inicio rápido** - Abre en 2-3 segundos
- ✅ **Mejor rendimiento** - PC no se ralentiza
- ✅ **Más simple** - Solo lo necesario

### Características de Scrcpy
- ✅ Espejo de pantalla en tiempo real
- ✅ Control total desde PC (mouse y teclado)
- ✅ Copiar/pegar entre PC y Xiaomi
- ✅ Arrastrar archivos
- ✅ Grabación de pantalla
- ✅ Bajo latencia

---

## 🚀 SCRIPTS CREADOS

### 1. `dev-con-scrcpy.bat` - TODO EN UNO
**Uso diario recomendado**

Hace todo automáticamente:
- ✅ Inicia backend (Django)
- ✅ Inicia frontend (Next.js)
- ✅ Abre scrcpy con tu Xiaomi

```bash
# Ejecutar:
dev-con-scrcpy.bat
```

**Cuándo usar**: Inicio del día, cuando empiezas a trabajar

---

### 2. `scrcpy-solo.bat` - SOLO ESPEJO
**Para ver tu Xiaomi en PC**

Solo abre scrcpy sin iniciar servidores.

```bash
# Ejecutar:
scrcpy-solo.bat
```

**Cuándo usar**: Cuando los servidores ya están corriendo

---

### 3. `instalar-apk-scrcpy.bat` - INSTALAR APK
**Instala APK usando ADB de scrcpy**

Instala el APK en tu Xiaomi sin Android Studio.

```bash
# Ejecutar:
instalar-apk-scrcpy.bat
```

**Cuándo usar**: Después de compilar un nuevo APK

---

### 4. `workflow-desarrollo-completo.bat` - WORKFLOW COMPLETO
**De cero a funcionando**

Hace TODO el proceso:
1. Sincroniza Capacitor
2. Compila APK
3. Instala en Xiaomi
4. Inicia servidores
5. Abre scrcpy

```bash
# Ejecutar:
workflow-desarrollo-completo.bat
```

**Cuándo usar**: 
- Primera vez del día
- Después de cambios en Capacitor
- Después de cambios importantes

---

### 5. `actualizar-app-rapido.bat` - ACTUALIZACIÓN RÁPIDA
**Rebuild e instala rápido**

Para cuando haces cambios y quieres probar:
1. Sincroniza
2. Compila
3. Instala

```bash
# Ejecutar:
actualizar-app-rapido.bat
```

**Cuándo usar**: Después de cambios en código que requieren rebuild

---

## 📋 WORKFLOWS TÍPICOS

### Workflow 1: Inicio del Día

```bash
# Opción A: Todo automático
workflow-desarrollo-completo.bat

# Opción B: Manual
1. build-apk.bat                    # Si hay cambios
2. instalar-apk-scrcpy.bat         # Instalar
3. dev-con-scrcpy.bat              # Iniciar todo
```

---

### Workflow 2: Desarrollo Normal (Hot Reload)

**Para cambios en frontend/backend que NO requieren rebuild:**

1. **Inicia servidores** (solo primera vez):
   ```bash
   npm run soshabilidoso:simple
   ```

2. **Abre scrcpy**:
   ```bash
   scrcpy-solo.bat
   ```

3. **Trabaja normalmente**:
   - Edita código en VS Code
   - Guarda archivos
   - Hot reload automático en navegador
   - En Xiaomi: Cierra y abre la app para ver cambios

**Ventaja**: No necesitas rebuild, cambios se ven inmediatamente

---

### Workflow 3: Cambios que Requieren Rebuild

**Para cambios en:**
- Configuración de Capacitor
- Plugins nativos
- Permisos de Android
- Assets en `public/`

```bash
# Opción A: Rápido (servidores ya corriendo)
actualizar-app-rapido.bat

# Opción B: Completo
workflow-desarrollo-completo.bat
```

---

### Workflow 4: Solo Ver Xiaomi

**Cuando solo quieres ver/controlar tu Xiaomi:**

```bash
scrcpy-solo.bat
```

---

## ⌨️ CONTROLES DE SCRCPY

### Básicos
- **Click izquierdo**: Tap en pantalla
- **Click derecho**: Volver (back)
- **Rueda del mouse**: Scroll
- **Arrastrar**: Swipe

### Atajos de Teclado
- **Ctrl + F**: Pantalla completa
- **Ctrl + G**: Redimensionar ventana a tamaño original
- **Ctrl + R**: Rotar pantalla
- **Ctrl + O**: Apagar pantalla del teléfono (ahorra batería)
- **Ctrl + P**: Encender pantalla
- **Ctrl + C**: Copiar (desde Xiaomi)
- **Ctrl + V**: Pegar (a Xiaomi)
- **Ctrl + Shift + V**: Pegar como texto plano
- **Ctrl + S**: Captura de pantalla
- **Ctrl + I**: Mostrar/ocultar FPS

### Avanzados
- **Arrastrar archivo**: Instalar APK o copiar archivo
- **Ctrl + Shift + O**: Apagar pantalla al cerrar
- **Ctrl + N**: Expandir notificaciones
- **Ctrl + Shift + N**: Colapsar notificaciones

---

## 🔄 TIPOS DE CAMBIOS Y ACCIONES

### Cambios que NO requieren rebuild (Hot Reload)
- ✅ Componentes React/Next.js
- ✅ Estilos CSS/Tailwind
- ✅ Lógica de JavaScript/TypeScript
- ✅ Modelos de Django
- ✅ Vistas de Django
- ✅ APIs de Django

**Acción**: Solo guarda y refresca (cierra/abre app en Xiaomi)

---

### Cambios que SÍ requieren rebuild
- ⚠️ `capacitor.config.ts`
- ⚠️ Plugins de Capacitor
- ⚠️ `AndroidManifest.xml`
- ⚠️ Permisos de Android
- ⚠️ Assets en `public/` (iconos, splash)
- ⚠️ Configuración de build

**Acción**: Ejecuta `actualizar-app-rapido.bat`

---

## 💡 TIPS Y TRUCOS

### Tip 1: Mantén Scrcpy Abierto
- Deja scrcpy abierto mientras trabajas
- Verás cambios en tiempo real
- No consume muchos recursos

### Tip 2: Usa Dos Monitores
- Monitor 1: VS Code
- Monitor 2: Scrcpy + Navegador
- Workflow más eficiente

### Tip 3: Hot Reload en Xiaomi
Para ver cambios sin rebuild:
1. Guarda archivo en VS Code
2. En Xiaomi: Cierra la app (swipe up)
3. Abre la app de nuevo
4. Cambios se cargan del servidor

### Tip 4: Debugging
Para ver errores:
```bash
# En otra terminal:
C:\Users\PC\Downloads\scrcpy-win64-v3.3.4\adb.exe logcat | findstr "Capacitor"
```

### Tip 5: Apagar Pantalla del Xiaomi
- Presiona `Ctrl + O` en scrcpy
- Ahorra batería del teléfono
- Sigue funcionando normalmente

### Tip 6: Copiar/Pegar
- Copia texto en PC → `Ctrl + V` en scrcpy → Se pega en Xiaomi
- Copia texto en Xiaomi → `Ctrl + C` en scrcpy → Disponible en PC

### Tip 7: Instalar APK Arrastrando
- Arrastra el APK a la ventana de scrcpy
- Se instala automáticamente
- Más rápido que usar script

---

## 🎬 EJEMPLO DE SESIÓN DE DESARROLLO

### Mañana (Inicio)
```bash
# 1. Ejecutar workflow completo
workflow-desarrollo-completo.bat

# Esperar a que todo inicie:
# - Backend corriendo en puerto 8000
# - Frontend corriendo en puerto 4000
# - APK instalado en Xiaomi
# - Scrcpy abierto mostrando Xiaomi
```

### Durante el Día (Desarrollo)
```bash
# Trabajas en VS Code:
1. Editas components/ui/post-card.tsx
2. Guardas (Ctrl + S)
3. Hot reload en navegador (automático)
4. En Xiaomi: Cierras y abres app
5. Ves cambios inmediatamente

# Si cambias capacitor.config.ts:
1. Ejecutas: actualizar-app-rapido.bat
2. Esperas 1-2 minutos
3. App se actualiza en Xiaomi
```

### Tarde (Testing)
```bash
# Pruebas en Xiaomi vía scrcpy:
1. Login
2. Navegación
3. Crear post
4. Subir imagen
5. Chat
6. Etc.

# Si encuentras bug:
1. Arreglas en VS Code
2. Guardas
3. Cierras/abres app en Xiaomi
4. Verificas fix
```

---

## 📊 COMPARACIÓN DE TIEMPOS

### Con Android Studio
- Inicio: 2-3 minutos
- Rebuild: 3-5 minutos
- Consumo RAM: 4-6 GB
- Consumo CPU: 50-70%

### Con Scrcpy
- Inicio: 10-15 segundos
- Rebuild: 1-2 minutos
- Consumo RAM: 100-200 MB
- Consumo CPU: 5-10%

**Ahorro de tiempo**: ~70%
**Ahorro de recursos**: ~90%

---

## 🔧 CONFIGURACIÓN DE SCRCPY

### Configuración Actual
```bash
scrcpy.exe 
  --window-title "SOS Habilidoso - Xiaomi"
  --window-width 400
  --window-height 800
  --stay-awake
```

### Opciones Adicionales (Opcional)

**Mayor calidad**:
```bash
--bit-rate 8M
--max-fps 60
```

**Menor latencia**:
```bash
--display-buffer 50
```

**Grabar pantalla**:
```bash
--record archivo.mp4
```

**Sin control (solo ver)**:
```bash
--no-control
```

---

## 🆘 TROUBLESHOOTING

### Scrcpy no encuentra dispositivo
```bash
# Verificar conexión:
C:\Users\PC\Downloads\scrcpy-win64-v3.3.4\adb.exe devices

# Si no aparece:
1. Desconecta y reconecta USB
2. Autoriza en Xiaomi
3. Verifica que "Depuración USB" esté activa
```

### Pantalla negra en scrcpy
```bash
# Presiona Ctrl + P para encender pantalla
# O desbloquea el Xiaomi manualmente
```

### Lag en scrcpy
```bash
# Reduce calidad:
scrcpy.exe --bit-rate 2M --max-size 1024
```

### APK no instala
```bash
# Desinstala versión anterior:
C:\Users\PC\Downloads\scrcpy-win64-v3.3.4\adb.exe uninstall com.soshabilidoso.app

# Luego instala de nuevo:
instalar-apk-scrcpy.bat
```

---

## 📚 DOCUMENTACIÓN RELACIONADA

- `RESUMEN_INSTALACION_XIAOMI.md` - Instalación inicial
- `CAPACITOR_MODO_HIBRIDO.md` - Explicación del modo híbrido
- `APK_GENERADO_EXITOSAMENTE.md` - Info del APK

---

## ✅ CHECKLIST DIARIO

### Al Iniciar
- [ ] Xiaomi conectado por USB
- [ ] Depuración USB activa
- [ ] Ejecutar `workflow-desarrollo-completo.bat`
- [ ] Verificar que todo funciona

### Durante Desarrollo
- [ ] Scrcpy abierto
- [ ] Servidores corriendo
- [ ] Hot reload funcionando
- [ ] Testing continuo en Xiaomi

### Al Terminar
- [ ] Commit cambios
- [ ] Cerrar servidores
- [ ] Cerrar scrcpy
- [ ] Desconectar Xiaomi (opcional)

---

**Creado por:** Kiro AI Assistant  
**Estado:** ✅ Workflow optimizado para desarrollo ágil  
**Herramienta**: Scrcpy (ligero y rápido)

