-- Script para verificar tablas existentes en habilidosos_db
-- Ejecutar: mysql -u root -p habilidosos_db < check_existing_tables.sql

USE habilidosos_db;

-- Mostrar todas las tablas existentes
SELECT 
    'TABLAS EXISTENTES EN LA BASE DE DATOS' as info,
    '' as separador;

SELECT 
    table_name as 'Tabla Existente',
    table_rows as 'Filas',
    ROUND(((data_length + index_length) / 1024 / 1024), 2) as 'Tamaño (MB)'
FROM information_schema.tables 
WHERE table_schema = 'habilidosos_db'
ORDER BY table_name;

-- Verificar específicamente las tablas de learning
SELECT 
    '' as separador,
    'VERIFICACIÓN DE TABLAS DE LEARNING' as info;

SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'habilidosos_db' AND table_name = 'learning_seccion') 
        THEN '✅ EXISTE' 
        ELSE '❌ FALTA' 
    END as 'learning_seccion',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'habilidosos_db' AND table_name = 'learning_tema') 
        THEN '✅ EXISTE' 
        ELSE '❌ FALTA' 
    END as 'learning_tema',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'habilidosos_db' AND table_name = 'learning_temacontenido') 
        THEN '✅ EXISTE' 
        ELSE '❌ FALTA' 
    END as 'learning_temacontenido',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'habilidosos_db' AND table_name = 'learning_temapuntoclave') 
        THEN '✅ EXISTE' 
        ELSE '❌ FALTA' 
    END as 'learning_temapuntoclave';

SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'habilidosos_db' AND table_name = 'learning_progresousuario') 
        THEN '✅ EXISTE' 
        ELSE '❌ FALTA' 
    END as 'learning_progresousuario',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'habilidosos_db' AND table_name = 'learning_logro') 
        THEN '✅ EXISTE' 
        ELSE '❌ FALTA' 
    END as 'learning_logro',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'habilidosos_db' AND table_name = 'learning_usuariologro') 
        THEN '✅ EXISTE' 
        ELSE '❌ FALTA' 
    END as 'learning_usuariologro',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'habilidosos_db' AND table_name = 'learning_evaluacion') 
        THEN '✅ EXISTE' 
        ELSE '❌ FALTA' 
    END as 'learning_evaluacion';

-- Verificar tablas de analytics de usuarios
SELECT 
    '' as separador,
    'VERIFICACIÓN DE TABLAS DE USER ANALYTICS' as info;

SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'habilidosos_db' AND table_name = 'analytics_usersession') 
        THEN '✅ EXISTE' 
        ELSE '❌ FALTA' 
    END as 'analytics_usersession',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'habilidosos_db' AND table_name = 'analytics_useractivity') 
        THEN '✅ EXISTE' 
        ELSE '❌ FALTA' 
    END as 'analytics_useractivity',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'habilidosos_db' AND table_name = 'analytics_userinteraction') 
        THEN '✅ EXISTE' 
        ELSE '❌ FALTA' 
    END as 'analytics_userinteraction',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'habilidosos_db' AND table_name = 'analytics_userpreferences') 
        THEN '✅ EXISTE' 
        ELSE '❌ FALTA' 
    END as 'analytics_userpreferences';

SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'habilidosos_db' AND table_name = 'analytics_userlocation') 
        THEN '✅ EXISTE' 
        ELSE '❌ FALTA' 
    END as 'analytics_userlocation',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'habilidosos_db' AND table_name = 'analytics_usersearchhistory') 
        THEN '✅ EXISTE' 
        ELSE '❌ FALTA' 
    END as 'analytics_usersearchhistory',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'habilidosos_db' AND table_name = 'analytics_usersocialconnections') 
        THEN '✅ EXISTE' 
        ELSE '❌ FALTA' 
    END as 'analytics_usersocialconnections';

-- Verificar tablas de eventos culturales
SELECT 
    '' as separador,
    'VERIFICACIÓN DE TABLAS DE EVENTOS CULTURALES' as info;

SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'habilidosos_db' AND table_name = 'cultural_events') 
        THEN '✅ EXISTE' 
        ELSE '❌ FALTA' 
    END as 'cultural_events',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'habilidosos_db' AND table_name = 'cultural_event_categories') 
        THEN '✅ EXISTE' 
        ELSE '❌ FALTA' 
    END as 'cultural_event_categories',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'habilidosos_db' AND table_name = 'cultural_event_tags') 
        THEN '✅ EXISTE' 
        ELSE '❌ FALTA' 
    END as 'cultural_event_tags',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'habilidosos_db' AND table_name = 'cultural_event_attendances') 
        THEN '✅ EXISTE' 
        ELSE '❌ FALTA' 
    END as 'cultural_event_attendances';

-- Contar total de tablas por módulo
SELECT 
    '' as separador,
    'RESUMEN POR MÓDULOS' as info;

SELECT 
    'Learning' as modulo,
    COUNT(*) as tablas_existentes
FROM information_schema.tables 
WHERE table_schema = 'habilidosos_db' 
AND table_name LIKE 'learning_%'

UNION ALL

SELECT 
    'Analytics' as modulo,
    COUNT(*) as tablas_existentes
FROM information_schema.tables 
WHERE table_schema = 'habilidosos_db' 
AND table_name LIKE 'analytics_%'

UNION ALL

SELECT 
    'Cultural Events' as modulo,
    COUNT(*) as tablas_existentes
FROM information_schema.tables 
WHERE table_schema = 'habilidosos_db' 
AND table_name LIKE 'cultural_%'

UNION ALL

SELECT 
    'TOTAL' as modulo,
    COUNT(*) as tablas_existentes
FROM information_schema.tables 
WHERE table_schema = 'habilidosos_db';