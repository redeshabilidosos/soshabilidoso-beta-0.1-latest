# Script para reiniciar forzadamente el servidor SOS Habilidoso
# Mata todos los procesos y reinicia desde cero

Write-Host ""
Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Red
Write-Host "║                                        ║" -ForegroundColor Red
Write-Host "║   🔴 REINICIO FORZADO DEL SERVIDOR    ║" -ForegroundColor Red
Write-Host "║                                        ║" -ForegroundColor Red
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Red
Write-Host ""

# 1. Matar procesos de Node.js
Write-Host "🔪 Paso 1: Deteniendo procesos de Node.js..." -ForegroundColor Yellow
$nodeProcesses = Get-Process node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    $nodeProcesses | Stop-Process -Force -ErrorAction SilentlyContinue
    Write-Host "   ✅ $($nodeProcesses.Count) proceso(s) de Node.js detenido(s)" -ForegroundColor Green
} else {
    Write-Host "   ℹ️  No hay procesos de Node.js corriendo" -ForegroundColor Gray
}

Write-Host ""

# 2. Matar procesos de Python (Daphne)
Write-Host "🔪 Paso 2: Deteniendo procesos de Python..." -ForegroundColor Yellow
$pythonProcesses = Get-Process python -ErrorAction SilentlyContinue
if ($pythonProcesses) {
    $pythonProcesses | Stop-Process -Force -ErrorAction SilentlyContinue
    Write-Host "   ✅ $($pythonProcesses.Count) proceso(s) de Python detenido(s)" -ForegroundColor Green
} else {
    Write-Host "   ℹ️  No hay procesos de Python corriendo" -ForegroundColor Gray
}

Write-Host ""

# 3. Verificar puertos
Write-Host "🔍 Paso 3: Verificando puertos..." -ForegroundColor Yellow

# Puerto 4000 (Frontend)
$port4000 = Get-NetTCPConnection -LocalPort 4000 -ErrorAction SilentlyContinue
if ($port4000) {
    $pid = $port4000.OwningProcess
    Write-Host "   ⚠️  Puerto 4000 aún ocupado por proceso $pid, matando..." -ForegroundColor Red
    Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
    Start-Sleep -Milliseconds 500
}

# Puerto 8000 (Backend)
$port8000 = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue
if ($port8000) {
    $pid = $port8000.OwningProcess
    Write-Host "   ⚠️  Puerto 8000 aún ocupado por proceso $pid, matando..." -ForegroundColor Red
    Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
    Start-Sleep -Milliseconds 500
}

Write-Host "   ✅ Puertos liberados" -ForegroundColor Green
Write-Host ""

# 4. Esperar un momento
Write-Host "⏳ Paso 4: Esperando 2 segundos..." -ForegroundColor Yellow
Start-Sleep -Seconds 2
Write-Host "   ✅ Listo" -ForegroundColor Green
Write-Host ""

# 5. Limpiar cache de Next.js
Write-Host "🗑️  Paso 5: Limpiando cache de Next.js..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
    Write-Host "   ✅ Cache eliminado" -ForegroundColor Green
} else {
    Write-Host "   ℹ️  No hay cache para eliminar" -ForegroundColor Gray
}
Write-Host ""

# 6. Verificar archivos críticos
Write-Host "🔍 Paso 6: Verificando archivos críticos..." -ForegroundColor Yellow
$criticalFiles = @(
    "backend/apps/messaging/routing.py",
    "backend/sos_habilidoso/asgi.py",
    "hooks/use-chat-websocket.ts"
)

$allFilesOk = $true
foreach ($file in $criticalFiles) {
    if (Test-Path $file) {
        Write-Host "   ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $file NO ENCONTRADO" -ForegroundColor Red
        $allFilesOk = $false
    }
}

if (-not $allFilesOk) {
    Write-Host ""
    Write-Host "❌ ERROR: Faltan archivos críticos" -ForegroundColor Red
    exit 1
}

Write-Host ""

# 7. Verificar routing.py
Write-Host "📝 Paso 7: Verificando routing.py..." -ForegroundColor Yellow
$routingContent = Get-Content "backend/apps/messaging/routing.py" -Raw
if ($routingContent -match "re_path\(r'ws/chat/\(\?P<chat_room_id>\[0-9a-f-\]\+\)/\$'") {
    Write-Host "   ✅ Routing correcto" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Routing puede tener problemas" -ForegroundColor Yellow
}
Write-Host ""

# 8. Iniciar servidor
Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                                        ║" -ForegroundColor Green
Write-Host "║   🚀 INICIANDO SERVIDOR               ║" -ForegroundColor Green
Write-Host "║                                        ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend: http://localhost:4000" -ForegroundColor Cyan
Write-Host "Backend:  http://localhost:8000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Presiona Ctrl+C para detener" -ForegroundColor Gray
Write-Host ""

# Iniciar
npm run soshabilidoso
