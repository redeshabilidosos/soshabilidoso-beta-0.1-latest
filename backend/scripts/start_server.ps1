# Script PowerShell para iniciar el servidor Django de SOS-HABILIDOSO

Write-Host "🚀 Iniciando servidor Django de SOS-HABILIDOSO..." -ForegroundColor Green
Write-Host ""

# Cambiar al directorio del backend
$BackendDir = Split-Path -Parent $PSScriptRoot
Set-Location $BackendDir

# Verificar configuración
$EnvFile = Join-Path $BackendDir ".env"
if (-not (Test-Path $EnvFile)) {
    Write-Host "⚠️  Archivo .env no encontrado. Creando desde .env.example..." -ForegroundColor Yellow
    $ExampleFile = Join-Path $BackendDir ".env.example"
    if (Test-Path $ExampleFile) {
        Copy-Item $ExampleFile $EnvFile
        Write-Host "✅ Archivo .env creado. Revisa la configuración antes de continuar." -ForegroundColor Green
    } else {
        Write-Host "❌ Archivo .env.example no encontrado." -ForegroundColor Red
        exit 1
    }
}

# Verificar estado de la documentación API
$EnableDocs = $false
if (Test-Path $EnvFile) {
    $EnvContent = Get-Content $EnvFile
    foreach ($line in $EnvContent) {
        if ($line -match "^ENABLE_API_DOCS=(.+)$") {
            $EnableDocs = $matches[1] -eq "true"
            break
        }
    }
}

if ($EnableDocs) {
    Write-Host "📚 Documentación API: HABILITADA" -ForegroundColor Green
    Write-Host "   • Swagger UI: http://127.0.0.1:8000/api/docs/" -ForegroundColor Cyan
    Write-Host "   • ReDoc:     http://127.0.0.1:8000/api/redoc/" -ForegroundColor Cyan
} else {
    Write-Host "📚 Documentación API: DESHABILITADA" -ForegroundColor Yellow
    Write-Host "   • Para habilitar: python scripts/toggle_api_docs.py enable" -ForegroundColor White
}

Write-Host ""
Write-Host "🔗 URLs disponibles:" -ForegroundColor Blue
Write-Host "   • API Root:    http://127.0.0.1:8000/" -ForegroundColor Cyan
Write-Host "   • Health:      http://127.0.0.1:8000/health/" -ForegroundColor Cyan
Write-Host "   • Admin:       http://127.0.0.1:8000/admin/" -ForegroundColor Cyan
Write-Host "   • API:         http://127.0.0.1:8000/api/" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 Bases de datos configuradas:" -ForegroundColor Blue
Write-Host "   • habilidosos_db    - Base de datos principal" -ForegroundColor White
Write-Host "   • habilidosos_clean - Solo para formularios reality" -ForegroundColor White
Write-Host ""
Write-Host "🔄 Iniciando servidor en http://127.0.0.1:8000..." -ForegroundColor Green
Write-Host "   Presiona Ctrl+C para detener" -ForegroundColor Yellow
Write-Host ""

try {
    # Iniciar el servidor
    python manage.py runserver 127.0.0.1:8000
} catch {
    Write-Host ""
    Write-Host "❌ Error al iniciar el servidor: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}