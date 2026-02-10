# 🔧 Comandos PowerShell Correctos

## ❌ Error Común en PowerShell

Cuando intentas usar comandos de CMD en PowerShell, obtienes errores:

```powershell
# ❌ INCORRECTO (comando de CMD)
rmdir /s /q .next

# Error:
# Remove-Item : No se encuentra ningún parámetro de posición que acepte el argumento '/q'.
```

## ✅ Comandos Correctos para PowerShell

### 1. Eliminar Carpeta .next
```powershell
# ✅ CORRECTO (comando de PowerShell)
Remove-Item -Recurse -Force .next
```

### 2. Reiniciar Servidor
```powershell
# Después de eliminar .next, reiniciar:
npm run soshabilidoso
```

## 📋 Diferencias CMD vs PowerShell

| Acción | CMD | PowerShell |
|--------|-----|------------|
| Eliminar carpeta | `rmdir /s /q carpeta` | `Remove-Item -Recurse -Force carpeta` |
| Listar archivos | `dir` | `Get-ChildItem` o `ls` |
| Copiar archivo | `copy origen destino` | `Copy-Item origen destino` |
| Mover archivo | `move origen destino` | `Move-Item origen destino` |
| Crear carpeta | `mkdir carpeta` | `New-Item -ItemType Directory carpeta` |
| Ver contenido | `type archivo.txt` | `Get-Content archivo.txt` o `cat archivo.txt` |

## 🚀 Workflow Completo para Reiniciar

### Opción 1: Comandos Individuales
```powershell
# 1. Detener servidor (Ctrl + C)

# 2. Eliminar cache
Remove-Item -Recurse -Force .next

# 3. Reiniciar
npm run soshabilidoso
```

### Opción 2: Script Automático
Crea un archivo `reiniciar-app.ps1`:

```powershell
Write-Host "🔄 Reiniciando aplicación..." -ForegroundColor Cyan

# Eliminar cache
Write-Host "🗑️ Eliminando cache..." -ForegroundColor Yellow
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue

# Verificar
if (-not (Test-Path ".next")) {
    Write-Host "✅ Cache eliminado" -ForegroundColor Green
} else {
    Write-Host "⚠️ No se pudo eliminar cache" -ForegroundColor Red
    exit 1
}

# Reiniciar servidor
Write-Host "🚀 Iniciando servidor..." -ForegroundColor Green
npm run soshabilidoso
```

Ejecutar:
```powershell
.\reiniciar-app.ps1
```

## 🎯 Para el Error de Tooltip

### Problema
```
TypeError: Cannot read properties of undefined (reading 'call')
webpack-internal:/(app-pages-browser)/components/ui/tooltip.tsx
```

### Solución
```powershell
# 1. Detener servidor (Ctrl + C)

# 2. Limpiar cache
Remove-Item -Recurse -Force .next

# 3. Reiniciar
npm run soshabilidoso

# 4. Esperar a que compile
# 5. Abrir: http://localhost:4000/messages
```

## 📊 Verificación

Después de reiniciar, verifica:

```powershell
# Ver procesos de Node.js
Get-Process node -ErrorAction SilentlyContinue

# Ver puertos en uso
netstat -ano | findstr "4000"
netstat -ano | findstr "8000"
```

## 💡 Tips PowerShell

### Alias Útiles
PowerShell tiene alias que funcionan como en Linux:

```powershell
ls          # = Get-ChildItem
cd          # = Set-Location
pwd         # = Get-Location
cat         # = Get-Content
rm          # = Remove-Item
cp          # = Copy-Item
mv          # = Move-Item
```

### Eliminar con Alias
```powershell
# También funciona (más corto):
rm -r -force .next
```

### Verificar Tipo de Shell
```powershell
# Ver versión de PowerShell
$PSVersionTable.PSVersion

# Ver shell actual
$SHELL
```

## 🔄 Comandos de Desarrollo Comunes

### Limpiar Todo
```powershell
# Eliminar node_modules y cache
Remove-Item -Recurse -Force node_modules, .next -ErrorAction SilentlyContinue

# Reinstalar
npm install

# Iniciar
npm run soshabilidoso
```

### Ver Logs en Tiempo Real
```powershell
# Seguir logs del backend
Get-Content backend/logs/server.log -Wait -Tail 50
```

### Matar Procesos
```powershell
# Matar proceso por puerto
$port = 4000
$process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
if ($process) {
    Stop-Process -Id $process -Force
    Write-Host "✅ Proceso en puerto $port terminado" -ForegroundColor Green
}
```

## 🎉 Resultado Esperado

Después de ejecutar los comandos correctos:

```
╔════════════════════════════════════════╗
║                                        ║
║    ✅ CACHE ELIMINADO                 ║
║    ✅ SERVIDOR REINICIADO             ║
║    ✅ FRONTEND: http://localhost:4000 ║
║    ✅ BACKEND: http://localhost:8000  ║
║                                        ║
║    🎯 CHAT FUNCIONANDO                ║
║    🎯 TOOLTIPS FUNCIONANDO            ║
║    🎯 MENSAJES RENDERIZANDO           ║
║                                        ║
╚════════════════════════════════════════╝
```

---

**Fecha:** 5 de febrero de 2026
**Shell:** PowerShell
**Estado:** ✅ Documentado
