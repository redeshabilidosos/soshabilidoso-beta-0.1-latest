# Script para ejecutar después de actualizar MariaDB
# Ejecutar como Administrador

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  CONFIGURACIÓN POST-ACTUALIZACIÓN MARIADB" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$mysqlPath = "C:\Program Files\MariaDB 11.5\bin\mysql.exe"

# Verificar si existe la nueva versión
if (-not (Test-Path $mysqlPath)) {
    Write-Host "No se encontró MariaDB 11.5 en la ruta esperada" -ForegroundColor Red
    $mysqlPath = Read-Host "Ingresa la ruta completa a mysql.exe de la nueva versión"
}

# 1. Verificar nueva versión
Write-Host "[1/6] Verificando nueva versión de MariaDB..." -ForegroundColor Yellow
try {
    $version = & $mysqlPath --version
    Write-Host "Nueva versión instalada: $version" -ForegroundColor Green
} catch {
    Write-Host "Error al verificar versión: $_" -ForegroundColor Red
    exit 1
}
Write-Host ""

# 2. Verificar conexión
Write-Host "[2/6] Verificando conexión a MariaDB..." -ForegroundColor Yellow
try {
    & $mysqlPath -u root -P 3307 -e "SELECT 1;" | Out-Null
    Write-Host "✓ Conexión exitosa" -ForegroundColor Green
} catch {
    Write-Host "⚠ Error de conexión. Verifica que el servicio esté corriendo" -ForegroundColor Red
    Write-Host "Ejecuta: net start MariaDB" -ForegroundColor Yellow
}
Write-Host ""

# 3. Crear base de datos habilidosos_db
Write-Host "[3/6] Creando base de datos habilidosos_db..." -ForegroundColor Yellow
try {
    & $mysqlPath -u root -P 3307 -e "CREATE DATABASE IF NOT EXISTS habilidosos_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    Write-Host "✓ Base de datos habilidosos_db creada" -ForegroundColor Green
} catch {
    Write-Host "⚠ Error al crear base de datos: $_" -ForegroundColor Red
}
Write-Host ""

# 4. Verificar bases de datos
Write-Host "[4/6] Verificando bases de datos existentes..." -ForegroundColor Yellow
try {
    $databases = & $mysqlPath -u root -P 3307 -e "SHOW DATABASES;"
    Write-Host $databases -ForegroundColor Cyan
} catch {
    Write-Host "⚠ Error al listar bases de datos: $_" -ForegroundColor Red
}
Write-Host ""

# 5. Ejecutar migraciones de Django
Write-Host "[5/6] Ejecutando migraciones de Django..." -ForegroundColor Yellow
Write-Host "Cambiando al directorio backend..." -ForegroundColor Gray

Push-Location backend

try {
    Write-Host "Creando migraciones..." -ForegroundColor Gray
    python manage.py makemigrations
    
    Write-Host "Aplicando migraciones..." -ForegroundColor Gray
    python manage.py migrate
    
    Write-Host "✓ Migraciones completadas" -ForegroundColor Green
} catch {
    Write-Host "⚠ Error en migraciones: $_" -ForegroundColor Red
    Write-Host "Puedes ejecutar manualmente:" -ForegroundColor Yellow
    Write-Host "  cd backend" -ForegroundColor Cyan
    Write-Host "  python manage.py makemigrations" -ForegroundColor Cyan
    Write-Host "  python manage.py migrate" -ForegroundColor Cyan
}

Pop-Location
Write-Host ""

# 6. Verificar tablas creadas
Write-Host "[6/6] Verificando tablas en habilidosos_db..." -ForegroundColor Yellow
try {
    $tables = & $mysqlPath -u root -P 3307 -e "USE habilidosos_db; SHOW TABLES;"
    Write-Host $tables -ForegroundColor Cyan
    
    $tableCount = ($tables -split "`n").Count - 1
    Write-Host "✓ Total de tablas creadas: $tableCount" -ForegroundColor Green
} catch {
    Write-Host "⚠ Error al verificar tablas: $_" -ForegroundColor Red
}
Write-Host ""

# Resumen final
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  CONFIGURACIÓN COMPLETADA" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✓ MariaDB actualizado y funcionando" -ForegroundColor Green
Write-Host "✓ Base de datos habilidosos_db creada" -ForegroundColor Green
Write-Host "✓ Migraciones de Django aplicadas" -ForegroundColor Green
Write-Host ""
Write-Host "Próximos pasos:" -ForegroundColor White
Write-Host ""
Write-Host "1. Iniciar servidor Django:" -ForegroundColor White
Write-Host "   cd backend" -ForegroundColor Cyan
Write-Host "   python manage.py runserver" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Acceder al panel de administración:" -ForegroundColor White
Write-Host "   http://127.0.0.1:8000/admin/" -ForegroundColor Cyan
Write-Host "   Usuario: admin@test.com" -ForegroundColor Yellow
Write-Host "   Password: admin123" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. Configurar phpMyAdmin:" -ForegroundColor White
Write-Host "   Ver: backend\scripts\verificar_y_actualizar_mariadb.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Presiona cualquier tecla para salir..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
