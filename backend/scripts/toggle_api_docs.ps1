# Script PowerShell para habilitar/deshabilitar la documentación API
param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("enable", "disable")]
    [string]$Action
)

# Obtener el directorio del backend
$BackendDir = Split-Path -Parent $PSScriptRoot
$EnvFile = Join-Path $BackendDir ".env"

$EnableDocs = $Action -eq "enable"

# Leer el archivo .env actual
$EnvLines = @()
if (Test-Path $EnvFile) {
    $EnvLines = Get-Content $EnvFile
}

# Buscar y actualizar la línea ENABLE_API_DOCS
$Found = $false
for ($i = 0; $i -lt $EnvLines.Count; $i++) {
    if ($EnvLines[$i] -match "^ENABLE_API_DOCS=") {
        $EnvLines[$i] = "ENABLE_API_DOCS=$($EnableDocs.ToString().ToLower())"
        $Found = $true
        break
    }
}

# Si no se encontró, agregar la línea
if (-not $Found) {
    $EnvLines += "ENABLE_API_DOCS=$($EnableDocs.ToString().ToLower())"
}

# Escribir el archivo .env actualizado
$EnvLines | Out-File -FilePath $EnvFile -Encoding UTF8

if ($EnableDocs) {
    Write-Host "✅ Documentación API HABILITADA" -ForegroundColor Green
    Write-Host ""
    Write-Host "La documentación estará disponible en:"
    Write-Host "  • Swagger UI: http://127.0.0.1:8000/api/docs/" -ForegroundColor Cyan
    Write-Host "  • ReDoc:     http://127.0.0.1:8000/api/redoc/" -ForegroundColor Cyan
    Write-Host "  • Schema:    http://127.0.0.1:8000/api/schema/" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "⚠️  Reinicia el servidor Django para aplicar los cambios:" -ForegroundColor Yellow
    Write-Host "   python manage.py runserver" -ForegroundColor White
} else {
    Write-Host "❌ Documentación API DESHABILITADA" -ForegroundColor Red
    Write-Host ""
    Write-Host "La documentación no estará disponible hasta que la habilites nuevamente."
    Write-Host ""
    Write-Host "⚠️  Reinicia el servidor Django para aplicar los cambios:" -ForegroundColor Yellow
    Write-Host "   python manage.py runserver" -ForegroundColor White
}