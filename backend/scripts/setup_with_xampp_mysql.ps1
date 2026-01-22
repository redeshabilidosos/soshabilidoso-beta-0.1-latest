# Script para configurar el sistema compartible usando XAMPP MySQL

Write-Host "=== CONFIGURACION CON XAMPP MYSQL ===" -ForegroundColor Green
Write-Host "Usando MySQL de XAMPP para crear el sistema compartible" -ForegroundColor Yellow
Write-Host ""

# Configuracion
$DB_NAME = "habilidosos_db"
$DB_USER = "root"
$MYSQL_PATH = "C:\xampp\mysql\bin\mysql.exe"
$SCRIPTS = @(
    "create_shareable_content_system.sql",
    "create_cultural_events_tables_fixed.sql",
    "populate_sample_data.sql"
)

# Verificar que XAMPP MySQL existe
if (-not (Test-Path $MYSQL_PATH)) {
    Write-Host "ERROR: No se encuentra MySQL de XAMPP en $MYSQL_PATH" -ForegroundColor Red
    Write-Host "Asegurate de que XAMPP este instalado" -ForegroundColor Yellow
    exit 1
}

# Verificar archivos SQL
foreach ($script in $SCRIPTS) {
    if (-not (Test-Path $script)) {
        Write-Host "ERROR: No se encuentra el archivo $script" -ForegroundColor Red
        exit 1
    }
}

Write-Host "Archivos SQL verificados" -ForegroundColor Green
Write-Host "Usando XAMPP MySQL: $MYSQL_PATH" -ForegroundColor Green

# Solicitar contraseña (XAMPP por defecto no tiene contraseña)
$DB_PASSWORD = Read-Host "Ingresa la contraseña de MySQL (presiona Enter si no hay contraseña)"
if ([string]::IsNullOrEmpty($DB_PASSWORD)) {
    $passwordArg = ""
    Write-Host "Usando conexion sin contraseña (XAMPP default)" -ForegroundColor Yellow
} else {
    $passwordArg = "-p$DB_PASSWORD"
}

Write-Host ""
Write-Host "INICIANDO CONFIGURACION..." -ForegroundColor Cyan

try {
    # Paso 1: Crear sistema de contenido compartible
    Write-Host ""
    Write-Host "Paso 1: Creando sistema de contenido compartible..." -ForegroundColor Yellow
    
    if ([string]::IsNullOrEmpty($passwordArg)) {
        Get-Content $SCRIPTS[0] | & $MYSQL_PATH -u $DB_USER $DB_NAME
    } else {
        Get-Content $SCRIPTS[0] | & $MYSQL_PATH -u $DB_USER $passwordArg $DB_NAME
    }
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR en paso 1. Codigo: $LASTEXITCODE" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "Sistema compartible creado exitosamente" -ForegroundColor Green
    
    # Paso 2: Crear tablas de eventos y learning
    Write-Host ""
    Write-Host "Paso 2: Creando tablas de eventos y learning..." -ForegroundColor Yellow
    
    if ([string]::IsNullOrEmpty($passwordArg)) {
        Get-Content $SCRIPTS[1] | & $MYSQL_PATH -u $DB_USER $DB_NAME
    } else {
        Get-Content $SCRIPTS[1] | & $MYSQL_PATH -u $DB_USER $passwordArg $DB_NAME
    }
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR en paso 2. Codigo: $LASTEXITCODE" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "Tablas de eventos y learning creadas exitosamente" -ForegroundColor Green
    
    # Paso 3: Poblar con datos
    Write-Host ""
    Write-Host "Paso 3: Poblando con datos de prueba..." -ForegroundColor Yellow
    
    if ([string]::IsNullOrEmpty($passwordArg)) {
        Get-Content $SCRIPTS[2] | & $MYSQL_PATH -u $DB_USER $DB_NAME
    } else {
        Get-Content $SCRIPTS[2] | & $MYSQL_PATH -u $DB_USER $passwordArg $DB_NAME
    }
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR en paso 3. Codigo: $LASTEXITCODE" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "Datos insertados exitosamente" -ForegroundColor Green
    
    # Verificacion
    Write-Host ""
    Write-Host "Verificando instalacion..." -ForegroundColor Yellow
    
    $query = "SELECT 'SISTEMA INSTALADO' as status, (SELECT COUNT(*) FROM shareable_content) as contenido_compartible, (SELECT COUNT(*) FROM cultural_events) as eventos, (SELECT COUNT(*) FROM feed_posts) as posts, (SELECT COUNT(*) FROM reels) as reels;"
    
    if ([string]::IsNullOrEmpty($passwordArg)) {
        & $MYSQL_PATH -u $DB_USER $DB_NAME -e $query
    } else {
        & $MYSQL_PATH -u $DB_USER $passwordArg $DB_NAME -e $query
    }
    
    Write-Host ""
    Write-Host "INSTALACION COMPLETADA EXITOSAMENTE!" -ForegroundColor Green
    Write-Host ""
    Write-Host "=== SISTEMA COMPARTIBLE CREADO ===" -ForegroundColor Cyan
    Write-Host "- Sistema unificado de contenido compartible" -ForegroundColor White
    Write-Host "- URLs unicas para cada publicacion" -ForegroundColor White
    Write-Host "- Tracking de shares y visualizaciones" -ForegroundColor White
    Write-Host "- Soporte para 10 tipos de contenido" -ForegroundColor White
    Write-Host "- Analytics completos" -ForegroundColor White
    Write-Host ""
    Write-Host "TIPOS DE CONTENIDO:" -ForegroundColor Yellow
    Write-Host "- Eventos culturales" -ForegroundColor White
    Write-Host "- Publicaciones del feed" -ForegroundColor White
    Write-Host "- Reels/videos cortos" -ForegroundColor White
    Write-Host "- Articulos de noticias" -ForegroundColor White
    Write-Host "- Transmisiones en vivo" -ForegroundColor White
    Write-Host "- Clasificados" -ForegroundColor White
    Write-Host "- Temas de aprendizaje" -ForegroundColor White
    Write-Host "- Posts de comunidades" -ForegroundColor White
    Write-Host ""
    
} catch {
    Write-Host ""
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "Sistema listo para usar!" -ForegroundColor Green