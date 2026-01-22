# Script de PowerShell para ejecutar la creación de tablas corregidas
# Compatible con la estructura existente de habilidosos_db

Write-Host "=== CREACIÓN DE TABLAS PARA HABILIDOSOS DB ===" -ForegroundColor Green
Write-Host "Script corregido compatible con estructura existente (IDs char(32))" -ForegroundColor Yellow
Write-Host ""

# Configuración de la base de datos
$DB_NAME = "habilidosos_db"
$DB_USER = "root"
$SQL_FILE = "create_cultural_events_tables_fixed.sql"

# Verificar que el archivo SQL existe
if (-not (Test-Path $SQL_FILE)) {
    Write-Host "ERROR: No se encuentra el archivo $SQL_FILE" -ForegroundColor Red
    Write-Host "Asegúrate de ejecutar este script desde la carpeta backend/scripts/" -ForegroundColor Yellow
    exit 1
}

Write-Host "Archivo SQL encontrado: $SQL_FILE" -ForegroundColor Green

# Solicitar contraseña de MySQL
$DB_PASSWORD = Read-Host "Ingresa la contraseña de MySQL para el usuario $DB_USER" -AsSecureString
$DB_PASSWORD_PLAIN = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($DB_PASSWORD))

Write-Host ""
Write-Host "Conectando a MySQL y ejecutando script..." -ForegroundColor Yellow

try {
    # Ejecutar el script SQL
    $mysqlCommand = "mysql -u $DB_USER -p$DB_PASSWORD_PLAIN $DB_NAME"
    Get-Content $SQL_FILE | & mysql -u $DB_USER -p$DB_PASSWORD_PLAIN $DB_NAME
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ ÉXITO: Script ejecutado correctamente" -ForegroundColor Green
        Write-Host ""
        Write-Host "=== TABLAS CREADAS ===" -ForegroundColor Cyan
        Write-Host "📚 Learning System:" -ForegroundColor Yellow
        Write-Host "  - learning_seccion" -ForegroundColor White
        Write-Host "  - learning_tema" -ForegroundColor White
        Write-Host "  - learning_temacontenido" -ForegroundColor White
        Write-Host "  - learning_temapuntoclave" -ForegroundColor White
        Write-Host "  - learning_logro_adicional" -ForegroundColor White
        Write-Host "  - learning_usuariologro_nuevo" -ForegroundColor White
        Write-Host ""
        Write-Host "📊 User Analytics:" -ForegroundColor Yellow
        Write-Host "  - analytics_usersession" -ForegroundColor White
        Write-Host "  - analytics_useractivity" -ForegroundColor White
        Write-Host "  - analytics_userinteraction" -ForegroundColor White
        Write-Host "  - analytics_userpreferences" -ForegroundColor White
        Write-Host "  - analytics_userlocation" -ForegroundColor White
        Write-Host "  - analytics_usersearchhistory" -ForegroundColor White
        Write-Host "  - analytics_usersocialconnections" -ForegroundColor White
        Write-Host ""
        Write-Host "🎭 Cultural Events:" -ForegroundColor Yellow
        Write-Host "  - cultural_event_categories" -ForegroundColor White
        Write-Host "  - cultural_events" -ForegroundColor White
        Write-Host "  - cultural_event_tags" -ForegroundColor White
        Write-Host "  - cultural_event_tag_relations" -ForegroundColor White
        Write-Host "  - cultural_event_social_links" -ForegroundColor White
        Write-Host "  - cultural_event_attendances" -ForegroundColor White
        Write-Host "  - cultural_event_likes" -ForegroundColor White
        Write-Host "  - cultural_event_views" -ForegroundColor White
        Write-Host ""
        Write-Host "=== CARACTERÍSTICAS IMPLEMENTADAS ===" -ForegroundColor Cyan
        Write-Host "✅ Compatible con estructura existente (IDs char(32))" -ForegroundColor Green
        Write-Host "✅ Foreign keys correctas a tabla users" -ForegroundColor Green
        Write-Host "✅ Usa DATETIME(6) en lugar de TIMESTAMP" -ForegroundColor Green
        Write-Host "✅ Usa TINYINT(1) en lugar de BOOLEAN" -ForegroundColor Green
        Write-Host "✅ Charset utf8mb4 y collation utf8mb4_unicode_ci" -ForegroundColor Green
        Write-Host "✅ Categorías y etiquetas iniciales insertadas" -ForegroundColor Green
        Write-Host "✅ Índices optimizados para consultas" -ForegroundColor Green
        Write-Host "✅ Integridad referencial completa" -ForegroundColor Green
        Write-Host ""
        Write-Host "🔧 PRÓXIMOS PASOS:" -ForegroundColor Magenta
        Write-Host "1. Verificar que las tablas se crearon correctamente" -ForegroundColor White
        Write-Host "2. Poblar las tablas con datos de prueba" -ForegroundColor White
        Write-Host "3. Integrar con el frontend de eventos culturales" -ForegroundColor White
        Write-Host "4. Implementar APIs para learning system" -ForegroundColor White
        Write-Host "5. Configurar analytics y tracking de usuarios" -ForegroundColor White
        
    } else {
        Write-Host ""
        Write-Host "❌ ERROR: Falló la ejecución del script" -ForegroundColor Red
        Write-Host "Revisa los errores de MySQL arriba" -ForegroundColor Yellow
        exit 1
    }
    
} catch {
    Write-Host ""
    Write-Host "❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Verifica que MySQL esté instalado y funcionando" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "=== VERIFICACIÓN RÁPIDA ===" -ForegroundColor Cyan
Write-Host "Para verificar que las tablas se crearon, ejecuta:" -ForegroundColor Yellow
Write-Host "mysql -u $DB_USER -p$DB_PASSWORD_PLAIN $DB_NAME -e 'SHOW TABLES LIKE \"cultural_%\";'" -ForegroundColor White
Write-Host "mysql -u $DB_USER -p$DB_PASSWORD_PLAIN $DB_NAME -e 'SHOW TABLES LIKE \"learning_%\";'" -ForegroundColor White
Write-Host "mysql -u $DB_USER -p$DB_PASSWORD_PLAIN $DB_NAME -e 'SHOW TABLES LIKE \"analytics_%\";'" -ForegroundColor White
Write-Host ""
Write-Host "Script completado exitosamente! 🎉" -ForegroundColor Green