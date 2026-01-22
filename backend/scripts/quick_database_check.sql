-- SCRIPT RÁPIDO PARA VERIFICAR ESTADO DE LA BASE DE DATOS
-- Copiar y pegar en phpMyAdmin (puerto 3307) -> habilidosos_db -> SQL

USE habilidosos_db;

-- 1. VERIFICAR TABLA USERS (CRÍTICA)
SELECT 'ESTRUCTURA DE TABLA USERS' as info;
DESCRIBE users;

-- 2. LISTAR TODAS LAS TABLAS
SELECT 'TODAS LAS TABLAS EXISTENTES' as info;
SHOW TABLES;

-- 3. VERIFICAR TABLAS DE LEARNING
SELECT 'VERIFICACIÓN LEARNING SYSTEM' as info;
SELECT 
    'learning_seccion' as tabla,
    CASE WHEN COUNT(*) > 0 THEN '✅ EXISTE' ELSE '❌ NO EXISTE' END as estado
FROM information_schema.tables 
WHERE table_schema = 'habilidosos_db' AND table_name = 'learning_seccion'
UNION ALL
SELECT 
    'learning_tema' as tabla,
    CASE WHEN COUNT(*) > 0 THEN '✅ EXISTE' ELSE '❌ NO EXISTE' END as estado
FROM information_schema.tables 
WHERE table_schema = 'habilidosos_db' AND table_name = 'learning_tema'
UNION ALL
SELECT 
    'learning_progresousuario' as tabla,
    CASE WHEN COUNT(*) > 0 THEN '✅ EXISTE' ELSE '❌ NO EXISTE' END as estado
FROM information_schema.tables 
WHERE table_schema = 'habilidosos_db' AND table_name = 'learning_progresousuario';

-- 4. VERIFICAR TABLAS DE EVENTOS CULTURALES
SELECT 'VERIFICACIÓN EVENTOS CULTURALES' as info;
SELECT 
    'cultural_events' as tabla,
    CASE WHEN COUNT(*) > 0 THEN '✅ EXISTE' ELSE '❌ NO EXISTE' END as estado
FROM information_schema.tables 
WHERE table_schema = 'habilidosos_db' AND table_name = 'cultural_events'
UNION ALL
SELECT 
    'cultural_event_categories' as tabla,
    CASE WHEN COUNT(*) > 0 THEN '✅ EXISTE' ELSE '❌ NO EXISTE' END as estado
FROM information_schema.tables 
WHERE table_schema = 'habilidosos_db' AND table_name = 'cultural_event_categories';

-- 5. CONTAR TABLAS POR MÓDULO
SELECT 'RESUMEN POR MÓDULOS' as info;
SELECT 
    'Learning System' as modulo,
    COUNT(*) as tablas_existentes
FROM information_schema.tables 
WHERE table_schema = 'habilidosos_db' AND table_name LIKE 'learning_%'
UNION ALL
SELECT 
    'Cultural Events' as modulo,
    COUNT(*) as tablas_existentes
FROM information_schema.tables 
WHERE table_schema = 'habilidosos_db' AND table_name LIKE 'cultural_%'
UNION ALL
SELECT 
    'Analytics' as modulo,
    COUNT(*) as tablas_existentes
FROM information_schema.tables 
WHERE table_schema = 'habilidosos_db' AND table_name LIKE 'analytics_%';