# 🚀 Inicio Rápido con Scrcpy

---

## ⚡ COMANDOS PRINCIPALES

### 1️⃣ Inicio del Día (TODO EN UNO)
```bash
workflow-desarrollo-completo.bat
```
✅ Compila APK → Instala → Inicia servidores → Abre scrcpy

---

### 2️⃣ Desarrollo Normal (Servidores ya corriendo)
```bash
scrcpy-solo.bat
```
✅ Solo abre espejo de Xiaomi

---

### 3️⃣ Actualizar App (Después de cambios)
```bash
actualizar-app-rapido.bat
```
✅ Rebuild → Instala → Listo

---

### 4️⃣ Solo Instalar APK
```bash
instalar-apk-scrcpy.bat
```
✅ Instala APK en Xiaomi

---

## 🎯 WORKFLOW DIARIO

### Opción A: Automático (Recomendado)
```bash
1. Conecta Xiaomi por USB
2. Ejecuta: workflow-desarrollo-completo.bat
3. Espera 2-3 minutos
4. ¡Listo para trabajar!
```

### Opción B: Manual
```bash
1. npm run soshabilidoso:simple    # Inicia servidores
2. scrcpy-solo.bat                 # Abre espejo
3. Trabaja normalmente
```

---

## 💻 DESARROLLO CON HOT RELOAD

### Cambios en Frontend/Backend
```
1. Edita código en VS Code
2. Guarda (Ctrl + S)
3. En Xiaomi: Cierra y abre la app
4. ¡Cambios visibles!
```

**No necesitas rebuild** ✅

### Cambios en Capacitor
```
1. Edita capacitor.config.ts
2. Ejecuta: actualizar-app-rapido.bat
3. Espera 1-2 minutos
4. ¡App actualizada!
```

**Sí necesitas rebuild** ⚠️

---

## ⌨️ CONTROLES SCRCPY

| Atajo | Acción |
|-------|--------|
| `Ctrl + F` | Pantalla completa |
| `Ctrl + O` | Apagar pantalla Xiaomi |
| `Ctrl + P` | Encender pantalla |
| `Ctrl + R` | Rotar |
| `Ctrl + C/V` | Copiar/Pegar |
| `Click derecho` | Volver (back) |

---

## 🔄 ¿CUÁNDO USAR CADA SCRIPT?

| Script | Cuándo Usar |
|--------|-------------|
| `workflow-desarrollo-completo.bat` | Primera vez del día |
| `dev-con-scrcpy.bat` | Inicio rápido con servidores |
| `scrcpy-solo.bat` | Solo ver Xiaomi |
| `actualizar-app-rapido.bat` | Después de cambios |
| `instalar-apk-scrcpy.bat` | Solo instalar APK |

---

## ✅ VENTAJAS vs ANDROID STUDIO

- ✅ **10x más rápido** - Inicia en segundos
- ✅ **90% menos recursos** - PC no se ralentiza
- ✅ **Más simple** - Solo lo necesario
- ✅ **Hot reload** - Cambios instantáneos

---

## 📱 REQUISITOS

- [x] Xiaomi conectado por USB
- [x] Depuración USB activa
- [x] Scrcpy en: `C:\Users\PC\Downloads\scrcpy-win64-v3.3.4`
- [x] Servidores corriendo (puertos 4000 y 8000)

---

## 🆘 PROBLEMAS COMUNES

### Scrcpy no abre
```bash
# Verifica dispositivo:
C:\Users\PC\Downloads\scrcpy-win64-v3.3.4\adb.exe devices
```

### App no actualiza
```bash
# Cierra y abre la app en Xiaomi
# O ejecuta: actualizar-app-rapido.bat
```

### Pantalla negra
```bash
# Presiona: Ctrl + P
# O desbloquea Xiaomi manualmente
```

---

**¡Listo para desarrollar! 🚀**

