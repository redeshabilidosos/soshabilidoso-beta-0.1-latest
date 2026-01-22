-- Script para verificar las tablas actuales en habilidosos_db
-- Ejecutar: mysql -u root -p habilidosos_db < verify_current_tables.sql

USE habilidosos_db;

-- Mostrar todas las tablas existentes
SELECT 
    'TODAS LAS TABLAS EN LA BASE DE DATOS' as info,
    '' as separador;

SELECT 
    table_name as 'Tabla',
    table_rows as 'Filas Aprox',
    ROUND(((data_length + index_length) / 1024 / 1024), 2) as 'Tamaño MB'
FROM information_schema.tables 
WHERE table_schema = 'habilidosos_db'
ORDER BY table_name;

-- Contar tablas por categoría
SELECT 
    '' as separador,
    'RESUMEN POR CATEGORÍAS' as info;

SELECT 
    'Total tablas' as categoria,
    COUNT(*) as cantidad
FROM information_schema.tables 
WHERE table_schema = 'habilidosos_db'

UNION ALL

SELECT 
    'Tablas learning_*' as categoria,
    COUNT(*) as cantidad
FROM information_schema.tables 
WHERE table_schema = 'habilidosos_db' 
AND table_name LIKE 'learning_%'

UNION ALL

SELECT 
    'Tablas analytics_*' as categoria,
    COUNT(*) as cantidad
FROM information_schema.tables 
WHERE table_schema = 'habilidosos_db' 
AND table_name LIKE 'analytics_%'

UNION ALL

SELECT 
    'Tablas cultural_*' as categoria,
    COUNT(*) as cantidad
FROM information_schema.tables 
WHERE table_schema = 'habilidosos_db' 
AND table_name LIKE 'cultural_%'

UNION ALL

SELECT 
    'Tablas auth_*' as categoria,
    COUNT(*) as cantidad
FROM information_schema.tables 
WHERE table_schema = 'habilidosos_db' 
AND table_name LIKE 'auth_%'

UNION ALL

SELECT 
    'Tablas django_*' as categoria,
    COUNT(*) as cantidad
FROM information_schema.tables 
WHERE table_schema = 'habilidosos_db' 
AND table_name LIKE 'django_%';

-- Buscar tablas que puedan contener usuarios
SELECT 
    '' as separador,
    'POSIBLES TABLAS DE USUARIOS' as info;

SELECT 
    table_name as 'Tabla',
    table_comment as 'Comentario'
FROM information_schema.tables 
WHERE table_schema = 'habilidosos_db' 
AND (
    table_name LIKE '%user%' 
    OR table_name LIKE '%usuario%'
    OR table_name LIKE '%auth%'
    OR table_name LIKE '%account%'
    OR table_name LIKE '%profile%'
)
ORDER BY table_name;

-- Mostrar estructura de tablas que contengan user_id
SELECT 
    '' as separador,
    'TABLAS CON COLUMNA user_id' as info;

SELECT DISTINCT
    table_name as 'Tabla con user_id',
    column_name as 'Columna',
    data_type as 'Tipo',
    character_maximum_length as 'Longitud'
FROM information_schema.columns 
WHERE table_schema = 'habilidosos_db' 
AND column_name LIKE '%user_id%'
ORDER BY table_name;

-- Verificar si existen las tablas que queremos crear
SELECT 
    '' as separador,
    'VERIFICACIÓN DE TABLAS A CREAR' as info;

SELECT 
    'cultural_events' as tabla_objetivo,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'habilidosos_db' AND table_name = 'cultural_events')
        THEN 'YA EXISTE' 
        ELSE 'NO EXISTE - SE PUEDE CREAR' 
    END as estado

UNION ALL

SELECT 
    'learning_seccion' as tabla_objetivo,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'habilidosos_db' AND table_name = 'learning_seccion')
        THEN 'YA EXISTE' 
        ELSE 'NO EXISTE - SE PUEDE CREAR' 
    END as estado

UNION ALL

SELECT 
    'analytics_usersession' as tabla_objetivo,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'habilidosos_db' AND table_name = 'analytics_usersession')
        THEN 'YA EXISTE' 
        ELSE 'NO EXISTE - SE PUEDE CREAR' 
    END as estado;