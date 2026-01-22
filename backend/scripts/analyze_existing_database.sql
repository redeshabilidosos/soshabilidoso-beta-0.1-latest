-- Script para analizar la estructura existente de habilidosos_db
-- Ejecutar: mysql -u root -p -P 3307 habilidosos_db < analyze_existing_database.sql

USE habilidosos_db;

-- ================================================================================
-- ANÁLISIS COMPLETO DE LA BASE DE DATOS EXISTENTE
-- ================================================================================

SELECT 
    '================================================================================' as separador,
    'ANÁLISIS DE BASE DE DATOS: habilidosos_db' as titulo,
    '================================================================================' as separador2;

-- Mostrar información general de la base de datos
SELECT 
    SCHEMA_NAME as 'Base de Datos',
    DEFAULT_CHARACTER_SET_NAME as 'Charset',
    DEFAULT_COLLATION_NAME as 'Collation'
FROM information_schema.SCHEMATA 
WHERE SCHEMA_NAME = 'habilidosos_db';

-- ================================================================================
-- SECCIÓN 1: TODAS LAS TABLAS EXISTENTES
-- ================================================================================

SELECT 
    '' as separador,
    'LISTADO COMPLETO DE TABLAS EXISTENTES' as seccion,
    '' as separador2;

SELECT 
    table_name as 'Tabla',
    table_rows as 'Filas',
    ROUND(((data_length + index_length) / 1024 / 1024), 2) as 'Tamaño (MB)',
    table_comment as 'Comentario'
FROM information_schema.tables 
WHERE table_schema = 'habilidosos_db'
ORDER BY table_name;

-- Contar total de tablas
SELECT 
    '' as separador,
    CONCAT('TOTAL DE TABLAS: ', COUNT(*)) as resumen
FROM information_schema.tables 
WHERE table_schema = 'habilidosos_db';

-- ================================================================================
-- SECCIÓN 2: ANÁLISIS POR MÓDULOS
-- ================================================================================

SELECT 
    '' as separador,
    'ANÁLISIS POR MÓDULOS/PREFIJOS' as seccion,
    '' as separador2;

-- Contar tablas por prefijo/módulo
SELECT 
    CASE 
        WHEN table_name LIKE 'auth_%' THEN 'Autenticación (auth_)'
        WHEN table_name LIKE 'django_%' THEN 'Django Core (django_)'
        WHEN table_name LIKE 'users_%' OR table_name = 'users' THEN 'Usuarios (users)'
        WHEN table_name LIKE 'posts_%' OR table_name = 'posts' THEN 'Posts/Publicaciones'
        WHEN table_name LIKE 'reels_%' OR table_name = 'reels' THEN 'Reels/Videos'
        WHEN table_name LIKE 'communities_%' OR table_name = 'communities' THEN 'Comunidades'
        WHEN table_name LIKE 'messages_%' OR table_name = 'messages' THEN 'Mensajería'
        WHEN table_name LIKE 'notifications_%' OR table_name = 'notifications' THEN 'Notificaciones'
        WHEN table_name LIKE 'learning_%' THEN 'Sistema Learning'
        WHEN table_name LIKE 'analytics_%' THEN 'Analytics de Usuarios'
        WHEN table_name LIKE 'cultural_%' THEN 'Eventos Culturales'
        WHEN table_name LIKE 'site_%' THEN 'Configuración del Sitio'
        ELSE 'Otras tablas'
    END as 'Módulo',
    COUNT(*) as 'Cantidad de Tablas',
    GROUP_CONCAT(table_name ORDER BY table_name SEPARATOR ', ') as 'Tablas'
FROM information_schema.tables 
WHERE table_schema = 'habilidosos_db'
GROUP BY 
    CASE 
        WHEN table_name LIKE 'auth_%' THEN 'Autenticación (auth_)'
        WHEN table_name LIKE 'django_%' THEN 'Django Core (django_)'
        WHEN table_name LIKE 'users_%' OR table_name = 'users' THEN 'Usuarios (users)'
        WHEN table_name LIKE 'posts_%' OR table_name = 'posts' THEN 'Posts/Publicaciones'
        WHEN table_name LIKE 'reels_%' OR table_name = 'reels' THEN 'Reels/Videos'
        WHEN table_name LIKE 'communities_%' OR table_name = 'communities' THEN 'Comunidades'
        WHEN table_name LIKE 'messages_%' OR table_name = 'messages' THEN 'Mensajería'
        WHEN table_name LIKE 'notifications_%' OR table_name = 'notifications' THEN 'Notificaciones'
        WHEN table_name LIKE 'learning_%' THEN 'Sistema Learning'
        WHEN table_name LIKE 'analytics_%' THEN 'Analytics de Usuarios'
        WHEN table_name LIKE 'cultural_%' THEN 'Eventos Culturales'
        WHEN table_name LIKE 'site_%' THEN 'Configuración del Sitio'
        ELSE 'Otras tablas'
    END
ORDER BY COUNT(*) DESC;

-- ================================================================================
-- SECCIÓN 3: ESTRUCTURA DE LA TABLA USERS (CRÍTICA)
-- ================================================================================

SELECT 
    '' as separador,
    'ESTRUCTURA DE LA TABLA USERS (CRÍTICA PARA REFERENCIAS)' as seccion,
    '' as separador2;

-- Verificar si existe la tabla users
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'habilidosos_db' AND table_name = 'users') 
        THEN '✅ TABLA USERS EXISTE' 
        ELSE '❌ TABLA USERS NO EXISTE' 
    END as 'Estado Tabla Users';

-- Mostrar estructura de la tabla users si existe
SELECT 
    column_name as 'Campo',
    data_type as 'Tipo',
    is_nullable as 'Nullable',
    column_default as 'Default',
    extra as 'Extra',
    column_key as 'Key'
FROM information_schema.columns 
WHERE table_schema = 'habilidosos_db' 
AND table_name = 'users'
ORDER BY ordinal_position;

-- ================================================================================
-- SECCIÓN 4: VERIFICACIÓN DE TABLAS DE LEARNING
-- ================================================================================

SELECT 
    '' as separador,
    'VERIFICACIÓN DE TABLAS DE LEARNING SYSTEM' as seccion,
    '' as separador2;

SELECT 
    'learning_seccion' as 'Tabla Requerida',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'habilidosos_db' AND table_name = 'learning_seccion') 
        THEN '✅ EXISTE' 
        ELSE '❌ FALTA' 
    END as 'Estado'

UNION ALL

SELECT 
    'learning_tema' as 'Tabla Requerida',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'habilidosos_db' AND table_name = 'learning_tema') 
        THEN '✅ EXISTE' 
        ELSE '❌ FALTA' 
    END as 'Estado'

UNION ALL

SELECT 
    'learning_temacontenido' as 'Tabla Requerida',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'habilidosos_db' AND table_name = 'learning_temacontenido') 
        THEN '✅ EXISTE' 
        ELSE '❌ FALTA' 
    END as 'Estado'

UNION ALL

SELECT 
    'learning_temapuntoclave' as 'Tabla Requerida',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'habilidosos_db' AND table_name = 'learning_temapuntoclave') 
        THEN '✅ EXISTE' 
        ELSE '❌ FALTA' 
    END as 'Estado'

UNION ALL

SELECT 
    'learning_progresousuario' as 'Tabla Requerida',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'habilidosos_db' AND table_name = 'learning_progresousuario') 
        THEN '✅ EXISTE' 
        ELSE '❌ FALTA' 
    END as 'Estado'

UNION ALL

SELECT 
    'learning_logro' as 'Tabla Requerida',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'habilidosos_db' AND table_name = 'learning_logro') 
        THEN '✅ EXISTE' 
        ELSE '❌ FALTA' 
    END as 'Estado'

UNION ALL

SELECT 
    'learning_usuariologro' as 'Tabla Requerida',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'habilidosos_db' AND table_name = 'learning_usuariologro') 
        THEN '✅ EXISTE' 
        ELSE '❌ FALTA' 
    END as 'Estado'

UNION ALL

SELECT 
    'learning_evaluacion' as 'Tabla Requerida',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'habilidosos_db' AND table_name = 'learning_evaluacion') 
        THEN '✅ EXISTE' 
        ELSE '❌ FALTA' 
    END as 'Estado';

-- ================================================================================
-- SECCIÓN 5: VERIFICACIÓN DE TABLAS DE ANALYTICS
-- ================================================================================

SELECT 
    '' as separador,
    'VERIFICACIÓN DE TABLAS DE USER ANALYTICS' as seccion,
    '' as separador2;

SELECT 
    'analytics_usersession' as 'Tabla Requerida',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'habilidosos_db' AND table_name = 'analytics_usersession') 
        THEN '✅ EXISTE' 
        ELSE '❌ FALTA' 
    END as 'Estado'

UNION ALL

SELECT 
    'analytics_useractivity' as 'Tabla Requerida',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'habilidosos_db' AND table_name = 'analytics_useractivity') 
        THEN '✅ EXISTE' 
        ELSE '❌ FALTA' 
    END as 'Estado'

UNION ALL

SELECT 
    'analytics_userinteraction' as 'Tabla Requerida',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'habilidosos_db' AND table_name = 'analytics_userinteraction') 
        THEN '✅ EXISTE' 
        ELSE '❌ FALTA' 
    END as 'Estado'

UNION ALL

SELECT 
    'analytics_userpreferences' as 'Tabla Requerida',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'habilidosos_db' AND table_name = 'analytics_userpreferences') 
        THEN '✅ EXISTE' 
        ELSE '❌ FALTA' 
    END as 'Estado'

UNION ALL

SELECT 
    'analytics_userlocation' as 'Tabla Requerida',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'habilidosos_db' AND table_name = 'analytics_userlocation') 
        THEN '✅ EXISTE' 
        ELSE '❌ FALTA' 
    END as 'Estado'

UNION ALL

SELECT 
    'analytics_usersearchhistory' as 'Tabla Requerida',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'habilidosos_db' AND table_name = 'analytics_usersearchhistory') 
        THEN '✅ EXISTE' 
        ELSE '❌ FALTA' 
    END as 'Estado'

UNION ALL

SELECT 
    'analytics_usersocialconnections' as 'Tabla Requerida',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'habilidosos_db' AND table_name = 'analytics_usersocialconnections') 
        THEN '✅ EXISTE' 
        ELSE '❌ FALTA' 
    END as 'Estado';

-- ================================================================================
-- SECCIÓN 6: VERIFICACIÓN DE TABLAS DE EVENTOS CULTURALES
-- ================================================================================

SELECT 
    '' as separador,
    'VERIFICACIÓN DE TABLAS DE EVENTOS CULTURALES' as seccion,
    '' as separador2;

SELECT 
    'cultural_events' as 'Tabla Requerida',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'habilidosos_db' AND table_name = 'cultural_events') 
        THEN '✅ EXISTE' 
        ELSE '❌ FALTA' 
    END as 'Estado'

UNION ALL

SELECT 
    'cultural_event_categories' as 'Tabla Requerida',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'habilidosos_db' AND table_name = 'cultural_event_categories') 
        THEN '✅ EXISTE' 
        ELSE '❌ FALTA' 
    END as 'Estado'

UNION ALL

SELECT 
    'cultural_event_tags' as 'Tabla Requerida',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'habilidosos_db' AND table_name = 'cultural_event_tags') 
        THEN '✅ EXISTE' 
        ELSE '❌ FALTA' 
    END as 'Estado'

UNION ALL

SELECT 
    'cultural_event_attendances' as 'Tabla Requerida',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'habilidosos_db' AND table_name = 'cultural_event_attendances') 
        THEN '✅ EXISTE' 
        ELSE '❌ FALTA' 
    END as 'Estado'

UNION ALL

SELECT 
    'cultural_event_likes' as 'Tabla Requerida',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'habilidosos_db' AND table_name = 'cultural_event_likes') 
        THEN '✅ EXISTE' 
        ELSE '❌ FALTA' 
    END as 'Estado';

-- ================================================================================
-- SECCIÓN 7: ANÁLISIS DE CLAVES FORÁNEAS EXISTENTES
-- ================================================================================

SELECT 
    '' as separador,
    'ANÁLISIS DE CLAVES FORÁNEAS EXISTENTES' as seccion,
    '' as separador2;

SELECT 
    kcu.table_name as 'Tabla',
    kcu.column_name as 'Columna',
    kcu.referenced_table_name as 'Tabla Referenciada',
    kcu.referenced_column_name as 'Columna Referenciada',
    rc.update_rule as 'Regla Update',
    rc.delete_rule as 'Regla Delete'
FROM information_schema.key_column_usage kcu
JOIN information_schema.referential_constraints rc 
    ON kcu.constraint_name = rc.constraint_name 
    AND kcu.table_schema = rc.constraint_schema
WHERE kcu.table_schema = 'habilidosos_db'
AND kcu.referenced_table_name IS NOT NULL
ORDER BY kcu.table_name, kcu.column_name;

-- ================================================================================
-- SECCIÓN 8: ANÁLISIS DE ÍNDICES EXISTENTES
-- ================================================================================

SELECT 
    '' as separador,
    'ANÁLISIS DE ÍNDICES EXISTENTES' as seccion,
    '' as separador2;

SELECT 
    table_name as 'Tabla',
    index_name as 'Índice',
    column_name as 'Columna',
    non_unique as 'No Único',
    index_type as 'Tipo'
FROM information_schema.statistics 
WHERE table_schema = 'habilidosos_db'
AND index_name != 'PRIMARY'
ORDER BY table_name, index_name, seq_in_index;

-- ================================================================================
-- SECCIÓN 9: RESUMEN FINAL Y RECOMENDACIONES
-- ================================================================================

SELECT 
    '' as separador,
    'RESUMEN FINAL Y ESTADO DE LA BASE DE DATOS' as seccion,
    '' as separador2;

-- Resumen por módulos
SELECT 
    'RESUMEN POR MÓDULOS' as tipo,
    '' as detalle

UNION ALL

SELECT 
    'Learning System' as tipo,
    CONCAT(
        SUM(CASE WHEN table_name LIKE 'learning_%' THEN 1 ELSE 0 END), 
        ' de 8 tablas requeridas'
    ) as detalle
FROM information_schema.tables 
WHERE table_schema = 'habilidosos_db'

UNION ALL

SELECT 
    'User Analytics' as tipo,
    CONCAT(
        SUM(CASE WHEN table_name LIKE 'analytics_%' THEN 1 ELSE 0 END), 
        ' de 7 tablas requeridas'
    ) as detalle
FROM information_schema.tables 
WHERE table_schema = 'habilidosos_db'

UNION ALL

SELECT 
    'Cultural Events' as tipo,
    CONCAT(
        SUM(CASE WHEN table_name LIKE 'cultural_%' THEN 1 ELSE 0 END), 
        ' de 8 tablas requeridas'
    ) as detalle
FROM information_schema.tables 
WHERE table_schema = 'habilidosos_db';

-- Estado final
SELECT 
    '' as separador,
    'ESTADO FINAL DE LA BASE DE DATOS' as titulo,
    '' as separador2;

SELECT 
    COUNT(*) as 'Total Tablas Existentes',
    SUM(CASE WHEN table_name LIKE 'learning_%' THEN 1 ELSE 0 END) as 'Learning',
    SUM(CASE WHEN table_name LIKE 'analytics_%' THEN 1 ELSE 0 END) as 'Analytics',
    SUM(CASE WHEN table_name LIKE 'cultural_%' THEN 1 ELSE 0 END) as 'Cultural Events',
    SUM(CASE WHEN table_name NOT LIKE 'learning_%' 
             AND table_name NOT LIKE 'analytics_%' 
             AND table_name NOT LIKE 'cultural_%' THEN 1 ELSE 0 END) as 'Otras Tablas'
FROM information_schema.tables 
WHERE table_schema = 'habilidosos_db';

SELECT 
    '================================================================================' as separador,
    'FIN DEL ANÁLISIS - EJECUTAR SCRIPT DE CREACIÓN SEGÚN NECESIDADES' as conclusion,
    '================================================================================' as separador2;