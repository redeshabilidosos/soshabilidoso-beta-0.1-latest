# Script de PowerShell para ejecutar el análisis de la base de datos
# Ejecutar: .\backend\scripts\run_database_analysis.ps1

Write-Host "🔍 Analizando estructura de la base de datos habilidosos_db..." -ForegroundColor Green
Write-Host "Puerto: 3307" -ForegroundColor Yellow
Write-Host "================================================================================" -ForegroundColor Cyan

# Ejecutar el análisis de la base de datos
$mysqlCommand = "mysql"
$arguments = @(
    "-u", "root",
    "-p",
    "-P", "3307",
    "habilidosos_db"
)

# Leer el contenido del archivo SQL
$sqlContent = Get-Content "backend/scripts/analyze_existing_database.sql" -Raw

# Ejecutar el comando MySQL con el contenido SQL
try {
    Write-Host "Conectando a MySQL en puerto 3307..." -ForegroundColor Yellow
    $sqlContent | & $mysqlCommand @arguments
    Write-Host "✅ Análisis completado exitosamente!" -ForegroundColor Green
} catch {
    Write-Host "❌ Error al ejecutar el análisis:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Alternativas:" -ForegroundColor Yellow
    Write-Host "1. Ejecutar manualmente en MySQL Workbench o phpMyAdmin" -ForegroundColor White
    Write-Host "2. Usar el comando: Get-Content backend/scripts/analyze_existing_database.sql | mysql -u root -p -P 3307 habilidosos_db" -ForegroundColor White
    Write-Host "3. Copiar el contenido del archivo SQL y ejecutarlo directamente en phpMyAdmin" -ForegroundColor White
}

Write-Host ""
Write-Host "================================================================================" -ForegroundColor Cyan
Write-Host "📋 Archivo de análisis creado en: backend/scripts/analyze_existing_database.sql" -ForegroundColor Green
Write-Host "🌐 Puedes ejecutarlo directamente en phpMyAdmin (puerto 3307)" -ForegroundColor Green