# Script maestro para configurar el sistema completo de contenido compartible
# Usa la ruta completa de MySQL

Write-Host "=== CONFIGURACION COMPLETA DEL SISTEMA COMPARTIBLE HABILIDOSOS ===" -ForegroundColor Green
Write-Host "Este script creara el sistema unificado de contenido compartible" -ForegroundColor Yellow
Write-Host ""

# Configuracion
$DB_NAME = "habilidosos_db"
$DB_USER = "root"
$MYSQL_PATH = "C:\Program Files\MySQL\MySQL Workbench 8.0 CE\mysql.exe"
$SCRIPTS = @(
    "create_shareable_content_system.sql",
    "create_cultural_events_tables_fixed.sql",
    "populate_sample_data.sql"
)

# Verificar que MySQL existe
if (-not (Test-Path $MYSQL_PATH)) {
    Write-Host "ERROR: No se encuentra MySQL en $MYSQL_PATH" -ForegroundColor Red
    Write-Host "Buscando MySQL en otras ubicaciones..." -ForegroundColor Yellow
    
    # Buscar en ubicaciones comunes
    $commonPaths = @(
        "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe",
        "C:\Program Files\MySQL\MySQL Server 5.7\bin\mysql.exe",
        "C:\xampp\mysql\bin\mysql.exe",
        "C:\wamp64\bin\mysql\mysql8.0.31\bin\mysql.exe"
    )
    
    $found = $false
    foreach ($path in $commonPaths) {
        if (Test-Path $path) {
            $MYSQL_PATH = $path
            $found = $true
            Write-Host "MySQL encontrado en: $MYSQL_PATH" -ForegroundColor Green
            break
        }
    }
    
    if (-not $found) {
        Write-Host "ERROR: No se pudo encontrar MySQL. Instala MySQL o agrega mysql.exe al PATH" -ForegroundColor Red
        exit 1
    }
}

# Verificar archivos SQL
foreach ($script in $SCRIPTS) {
    if (-not (Test-Path $script)) {
        Write-Host "ERROR: No se encuentra el archivo $script" -ForegroundColor Red
        Write-Host "Asegurate de ejecutar este script desde la carpeta backend/scripts/" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host "Todos los archivos SQL encontrados" -ForegroundColor Green
Write-Host "Usando MySQL en: $MYSQL_PATH" -ForegroundColor Green

# Solicitar contraseña
$DB_PASSWORD = Read-Host "Ingresa la contraseña de MySQL para el usuario $DB_USER"

Write-Host ""
Write-Host "INICIANDO CONFIGURACION DEL SISTEMA COMPARTIBLE..." -ForegroundColor Cyan

try {
    # Paso 1: Crear sistema de contenido compartible
    Write-Host ""
    Write-Host "Paso 1: Creando sistema de contenido compartible..." -ForegroundColor Yellow
    
    $mysqlArgs = @("-u", $DB_USER, "-p$DB_PASSWORD", $DB_NAME)
    Get-Content $SCRIPTS[0] | & $MYSQL_PATH $mysqlArgs
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Fallo la creacion del sistema compartible" -ForegroundColor Red
        Write-Host "Codigo de salida: $LASTEXITCODE" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "Sistema de contenido compartible creado exitosamente" -ForegroundColor Green
    
    # Paso 2: Crear tablas de eventos culturales y learning
    Write-Host ""
    Write-Host "Paso 2: Creando tablas de eventos culturales y learning..." -ForegroundColor Yellow
    Get-Content $SCRIPTS[1] | & $MYSQL_PATH $mysqlArgs
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Fallo la creacion de tablas de eventos" -ForegroundColor Red
        Write-Host "Codigo de salida: $LASTEXITCODE" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "Tablas de eventos culturales y learning creadas exitosamente" -ForegroundColor Green
    
    # Paso 3: Poblar con datos de prueba
    Write-Host ""
    Write-Host "Paso 3: Poblando con datos de prueba..." -ForegroundColor Yellow
    Get-Content $SCRIPTS[2] | & $MYSQL_PATH $mysqlArgs
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Fallo la poblacion de datos" -ForegroundColor Red
        Write-Host "Codigo de salida: $LASTEXITCODE" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "Datos de prueba insertados exitosamente" -ForegroundColor Green
    
    # Verificacion final
    Write-Host ""
    Write-Host "Verificando instalacion completa..." -ForegroundColor Yellow
    
    $verificationQuery = "SELECT 'Verificacion del Sistema Compartible' as status, (SELECT COUNT(*) FROM shareable_content) as contenido_compartible, (SELECT COUNT(*) FROM cultural_events) as eventos_culturales, (SELECT COUNT(*) FROM feed_posts) as publicaciones_feed, (SELECT COUNT(*) FROM reels) as reels_videos, (SELECT COUNT(*) FROM news_articles) as articulos_noticias, (SELECT COUNT(*) FROM live_streams) as transmisiones_vivo, (SELECT COUNT(*) FROM classifieds) as clasificados, (SELECT COUNT(*) FROM learning_tema) as temas_learning;"
    
    & $MYSQL_PATH $mysqlArgs -e $verificationQuery
    
    Write-Host ""
    Write-Host "SISTEMA COMPARTIBLE CONFIGURADO EXITOSAMENTE!" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "=== RESUMEN DEL SISTEMA COMPARTIBLE ===" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "CONTENIDO COMPARTIBLE UNIFICADO:" -ForegroundColor Yellow
    Write-Host "  - Tabla central shareable_content" -ForegroundColor White
    Write-Host "  - Sistema de shares y tracking" -ForegroundColor White
    Write-Host "  - Analytics de visualizaciones" -ForegroundColor White
    Write-Host "  - URLs unicas para cada tipo de contenido" -ForegroundColor White
    Write-Host ""
    Write-Host "TIPOS DE CONTENIDO SOPORTADOS:" -ForegroundColor Yellow
    Write-Host "  - Eventos culturales (/eventos/ID)" -ForegroundColor White
    Write-Host "  - Clasificados/conexiones (/clasificados/ID)" -ForegroundColor White
    Write-Host "  - Publicaciones del feed (/post/ID)" -ForegroundColor White
    Write-Host "  - Posts de subcomunidades (/comunidad/post/ID)" -ForegroundColor White
    Write-Host "  - Reels/clips (/reels/ID)" -ForegroundColor White
    Write-Host "  - Articulos de noticias (/noticias/ID)" -ForegroundColor White
    Write-Host "  - Transmisiones en vivo (/live/ID)" -ForegroundColor White
    Write-Host "  - Temas de aprendizaje (/aprender/ID)" -ForegroundColor White
    Write-Host "  - Perfiles de usuario (/perfil/ID)" -ForegroundColor White
    Write-Host "  - Perfiles de empresas (/empresa/ID)" -ForegroundColor White
    Write-Host ""
    Write-Host "CARACTERISTICAS TECNICAS:" -ForegroundColor Magenta
    Write-Host "  - IDs unicos char(32) para cada publicacion" -ForegroundColor Green
    Write-Host "  - URLs automaticas para compartir" -ForegroundColor Green
    Write-Host "  - Triggers automaticos para sincronizacion" -ForegroundColor Green
    Write-Host "  - Contadores de shares, views y likes" -ForegroundColor Green
    Write-Host "  - Soporte para multiples plataformas de share" -ForegroundColor Green
    Write-Host "  - Analytics detallados por contenido" -ForegroundColor Green
    Write-Host ""
    Write-Host "PROXIMOS PASOS:" -ForegroundColor Cyan
    Write-Host "1. Implementar APIs para cada tipo de contenido" -ForegroundColor White
    Write-Host "2. Crear componentes React para sharing" -ForegroundColor White
    Write-Host "3. Configurar Open Graph meta tags" -ForegroundColor White
    Write-Host "4. Implementar deep linking en la app" -ForegroundColor White
    Write-Host "5. Configurar notificaciones de shares" -ForegroundColor White
    Write-Host ""
    Write-Host "EJEMPLOS DE USO:" -ForegroundColor Cyan
    Write-Host "Compartir evento: https://habilidosos.com/eventos/event123456789012345678901234567ab" -ForegroundColor Gray
    Write-Host "Compartir reel: https://habilidosos.com/reels/reel123456789012345678901234567ab" -ForegroundColor Gray
    Write-Host "Compartir post: https://habilidosos.com/post/post123456789012345678901234567ab" -ForegroundColor Gray
    
} catch {
    Write-Host ""
    Write-Host "ERROR CRITICO: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Verifica que MySQL este funcionando y que tengas permisos" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Sistema de contenido compartible listo para usar!" -ForegroundColor Green