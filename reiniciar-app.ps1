# Script para reiniciar la aplicación SOS Habilidoso
# Uso: .\reiniciar-app.ps1

Write-Host ""
Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                        ║" -ForegroundColor Cyan
Write-Host "║   🔄 REINICIANDO SOS HABILIDOSO       ║" -ForegroundColor Cyan
Write-Host "║                                        ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# 1. Eliminar cache de Next.js
Write-Host "🗑️  Paso 1: Eliminando cache de Next.js..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
    Start-Sleep -Milliseconds 500
    
    if (-not (Test-Path ".next")) {
        Write-Host "   ✅ Cache eliminado correctamente" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Advertencia: No se pudo eliminar completamente" -ForegroundColor Red
    }
} else {
    Write-Host "   ℹ️  No hay cache para eliminar" -ForegroundColor Gray
}

Write-Host ""

# 2. Verificar dependencias
Write-Host "📦 Paso 2: Verificando dependencias..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "   ✅ node_modules existe" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  node_modules no existe. Instalando..." -ForegroundColor Red
    npm install
}

Write-Host ""

# 3. Verificar archivos críticos
Write-Host "🔍 Paso 3: Verificando archivos críticos..." -ForegroundColor Yellow
$criticalFiles = @(
    "package.json",
    "next.config.js",
    "components/messaging/chat-window.tsx",
    "scripts/start-soshabilidoso.js"
)

$allFilesExist = $true
foreach ($file in $criticalFiles) {
    if (Test-Path $file) {
        Write-Host "   ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $file NO ENCONTRADO" -ForegroundColor Red
        $allFilesExist = $false
    }
}

if (-not $allFilesExist) {
    Write-Host ""
    Write-Host "❌ ERROR: Faltan archivos críticos. No se puede continuar." -ForegroundColor Red
    exit 1
}

Write-Host ""

# 4. Iniciar servidor
Write-Host "🚀 Paso 4: Iniciando servidor..." -ForegroundColor Green
Write-Host ""
Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                                        ║" -ForegroundColor Green
Write-Host "║   ✅ LISTO PARA INICIAR               ║" -ForegroundColor Green
Write-Host "║                                        ║" -ForegroundColor Green
Write-Host "║   Frontend: http://localhost:4000     ║" -ForegroundColor Green
Write-Host "║   Backend:  http://localhost:8000     ║" -ForegroundColor Green
Write-Host "║                                        ║" -ForegroundColor Green
Write-Host "║   Presiona Ctrl+C para detener        ║" -ForegroundColor Green
Write-Host "║                                        ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

# Iniciar con npm
npm run soshabilidoso
