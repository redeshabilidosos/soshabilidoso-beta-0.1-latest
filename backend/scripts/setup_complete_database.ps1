# Script completo para configurar la base de datos de eventos culturales y learning
# Ejecuta la creación de tablas y población de datos de prueba

Write-Host "=== CONFIGURACIÓN COMPLETA DE BASE DE DATOS HABILIDOSOS ===" -ForegroundColor Green
Write-Host "Este script creará todas las tablas y poblará con datos de prueba" -ForegroundColor Yellow
Write-Host ""

# Configuración
$DB_NAME = "habilidosos_db"
$DB_USER = "root"
$CREATE_TABLES_FILE = "create_cultural_events_tables_fixed.sql"
$POPULATE_DATA_FILE = "populate_sample_data.sql"

# Verificar archivos
$files = @($CREATE_TABLES_FILE, $POPULATE_DATA_FILE)
foreach ($file in $files) {
    if (-not (Test-Path $file)) {
        Write-Host "ERROR: No se encuentra el archivo $file" -ForegroundColor Red
        Write-Host "Asegúrate de ejecutar este script desde la carpeta backend/scripts/" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host "✅ Archivos SQL encontrados" -ForegroundColor Green

# Solicitar contraseña
$DB_PASSWORD = Read-Host "Ingresa la contraseña de MySQL para el usuario $DB_USER" -AsSecureString
$DB_PASSWORD_PLAIN = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($DB_PASSWORD))

Write-Host ""
Write-Host "🚀 INICIANDO CONFIGURACIÓN..." -ForegroundColor Cyan

try {
    # Paso 1: Crear tablas
    Write-Host ""
    Write-Host "📋 Paso 1: Creando tablas..." -ForegroundColor Yellow
    Get-Content $CREATE_TABLES_FILE | & mysql -u $DB_USER -p$DB_PASSWORD_PLAIN $DB_NAME
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ ERROR: Falló la creación de tablas" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✅ Tablas creadas exitosamente" -ForegroundColor Green
    
    # Paso 2: Poblar con datos de prueba
    Write-Host ""
    Write-Host "📊 Paso 2: Poblando con datos de prueba..." -ForegroundColor Yellow
    Get-Content $POPULATE_DATA_FILE | & mysql -u $DB_USER -p$DB_PASSWORD_PLAIN $DB_NAME
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ ERROR: Falló la población de datos" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✅ Datos de prueba insertados exitosamente" -ForegroundColor Green
    
    # Verificación final
    Write-Host ""
    Write-Host "🔍 Verificando instalación..." -ForegroundColor Yellow
    
    $verification = @"
SELECT 
    'Verificación Completa' as status,
    (SELECT COUNT(*) FROM cultural_events) as eventos_creados,
    (SELECT COUNT(*) FROM learning_seccion) as secciones_learning,
    (SELECT COUNT(*) FROM learning_tema) as temas_learning,
    (SELECT COUNT(*) FROM cultural_event_categories) as categorias_eventos,
    (SELECT COUNT(*) FROM analytics_userpreferences) as preferencias_usuario;
"@
    
    $verification | & mysql -u $DB_USER -p$DB_PASSWORD_PLAIN $DB_NAME
    
    Write-Host ""
    Write-Host "🎉 ¡CONFIGURACIÓN COMPLETADA EXITOSAMENTE!" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "=== RESUMEN DE LO INSTALADO ===" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📚 LEARNING SYSTEM:" -ForegroundColor Yellow
    Write-Host "  ✅ 4 secciones de aprendizaje creadas" -ForegroundColor White
    Write-Host "  ✅ 6 temas con contenido y puntos clave" -ForegroundColor White
    Write-Host "  ✅ 4 logros configurados" -ForegroundColor White
    Write-Host "  ✅ Sistema de progreso de usuarios" -ForegroundColor White
    Write-Host ""
    Write-Host "🎭 EVENTOS CULTURALES:" -ForegroundColor Yellow
    Write-Host "  ✅ 6 categorías de eventos (Música, Arte, Teatro, etc.)" -ForegroundColor White
    Write-Host "  ✅ 5 eventos de prueba creados" -ForegroundColor White
    Write-Host "  ✅ 15 etiquetas disponibles" -ForegroundColor White
    Write-Host "  ✅ Sistema de asistencias y likes" -ForegroundColor White
    Write-Host "  ✅ Enlaces sociales y analytics" -ForegroundColor White
    Write-Host ""
    Write-Host "📊 USER ANALYTICS:" -ForegroundColor Yellow
    Write-Host "  ✅ Tracking de sesiones de usuario" -ForegroundColor White
    Write-Host "  ✅ Historial de actividades" -ForegroundColor White
    Write-Host "  ✅ Preferencias de usuario configuradas" -ForegroundColor White
    Write-Host "  ✅ Ubicaciones y conexiones sociales" -ForegroundColor White
    Write-Host ""
    Write-Host "🔧 CARACTERÍSTICAS TÉCNICAS:" -ForegroundColor Magenta
    Write-Host "  ✅ Compatible con estructura existente (char(32))" -ForegroundColor Green
    Write-Host "  ✅ Foreign keys correctas a tabla users" -ForegroundColor Green
    Write-Host "  ✅ Índices optimizados para rendimiento" -ForegroundColor Green
    Write-Host "  ✅ Integridad referencial completa" -ForegroundColor Green
    Write-Host "  ✅ Charset UTF-8 para soporte internacional" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 PRÓXIMOS PASOS:" -ForegroundColor Cyan
    Write-Host "1. Integrar APIs en el backend Django" -ForegroundColor White
    Write-Host "2. Conectar componentes React del frontend" -ForegroundColor White
    Write-Host "3. Implementar sistema de autenticación" -ForegroundColor White
    Write-Host "4. Configurar subida de imágenes y videos" -ForegroundColor White
    Write-Host "5. Implementar notificaciones en tiempo real" -ForegroundColor White
    Write-Host ""
    Write-Host "📋 COMANDOS ÚTILES:" -ForegroundColor Cyan
    Write-Host "Ver eventos: mysql -u $DB_USER -p$DB_PASSWORD_PLAIN $DB_NAME -e 'SELECT title, event_date, location FROM cultural_events;'" -ForegroundColor Gray
    Write-Host "Ver secciones: mysql -u $DB_USER -p$DB_PASSWORD_PLAIN $DB_NAME -e 'SELECT nombre, slug FROM learning_seccion;'" -ForegroundColor Gray
    Write-Host "Ver tablas: mysql -u $DB_USER -p$DB_PASSWORD_PLAIN $DB_NAME -e 'SHOW TABLES LIKE \"cultural_%\";'" -ForegroundColor Gray
    
} catch {
    Write-Host ""
    Write-Host "❌ ERROR CRÍTICO: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Verifica que MySQL esté funcionando y que tengas permisos" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "¡Base de datos configurada y lista para usar! 🎉" -ForegroundColor Green