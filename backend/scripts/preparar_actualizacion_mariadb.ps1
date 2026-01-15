# Script para preparar la actualización de MariaDB
# Ejecutar como Administrador

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  PREPARACIÓN PARA ACTUALIZAR MARIADB" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar versión actual
Write-Host "[1/5] Verificando versión actual de MariaDB..." -ForegroundColor Yellow
$mysqlPath = "C:\Program Files\MariaDB 12.0\bin\mysql.exe"

if (Test-Path $mysqlPath) {
    $version = & $mysqlPath --version
    Write-Host "Versión actual: $version" -ForegroundColor Green
} else {
    Write-Host "No se encontró MySQL en la ruta esperada" -ForegroundColor Red
    $mysqlPath = Read-Host "Ingresa la ruta completa a mysql.exe"
}

Write-Host ""

# 2. Crear carpeta de backups
Write-Host "[2/5] Creando carpeta de backups..." -ForegroundColor Yellow
$backupFolder = ".\backups_mariadb_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
New-Item -ItemType Directory -Path $backupFolder -Force | Out-Null
Write-Host "Carpeta creada: $backupFolder" -ForegroundColor Green
Write-Host ""

# 3. Hacer backup de habilidosos_clean
Write-Host "[3/5] Haciendo backup de habilidosos_clean..." -ForegroundColor Yellow
$mysqldumpPath = $mysqlPath.Replace("mysql.exe", "mysqldump.exe")

try {
    & $mysqldumpPath -u root -P 3307 habilidosos_clean > "$backupFolder\habilidosos_clean_backup.sql"
    Write-Host "✓ Backup de habilidosos_clean completado" -ForegroundColor Green
} catch {
    Write-Host "⚠ Error al hacer backup de habilidosos_clean: $_" -ForegroundColor Red
}

Write-Host ""

# 4. Hacer backup de todas las bases de datos
Write-Host "[4/5] Haciendo backup de todas las bases de datos..." -ForegroundColor Yellow

try {
    & $mysqldumpPath -u root -P 3307 --all-databases > "$backupFolder\all_databases_backup.sql"
    Write-Host "✓ Backup completo realizado" -ForegroundColor Green
} catch {
    Write-Host "⚠ Error al hacer backup completo: $_" -ForegroundColor Red
}

Write-Host ""

# 5. Mostrar instrucciones
Write-Host "[5/5] Backups completados!" -ForegroundColor Green
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  PRÓXIMOS PASOS" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Descargar MariaDB 11.x desde:" -ForegroundColor White
Write-Host "   https://mariadb.org/download/" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Durante la instalación:" -ForegroundColor White
Write-Host "   - Puerto: 3307" -ForegroundColor Yellow
Write-Host "   - Root password: (dejar vacío o establecer uno)" -ForegroundColor Yellow
Write-Host "   - Charset: UTF8" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. Después de instalar, restaurar backups:" -ForegroundColor White
Write-Host "   mysql -u root -P 3307 < $backupFolder\all_databases_backup.sql" -ForegroundColor Cyan
Write-Host ""
Write-Host "4. Crear base de datos habilidosos_db:" -ForegroundColor White
Write-Host "   mysql -u root -P 3307 -e `"CREATE DATABASE habilidosos_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`"" -ForegroundColor Cyan
Write-Host ""
Write-Host "5. Ejecutar migraciones de Django:" -ForegroundColor White
Write-Host "   cd backend" -ForegroundColor Cyan
Write-Host "   python manage.py migrate" -ForegroundColor Cyan
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backups guardados en: $backupFolder" -ForegroundColor Green
Write-Host ""
Write-Host "Presiona cualquier tecla para continuar..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
