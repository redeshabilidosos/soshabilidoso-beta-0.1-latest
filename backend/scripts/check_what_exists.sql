-- SCRIPT PARA VERIFICAR QUÉ EXISTE EN LA BASE DE DATOS
-- Ejecutar en phpMyAdmin: habilidosos_db -> SQL

USE habilidosos_db;

-- 1. MOSTRAR TODAS LAS TABLAS QUE EXISTEN
SELECT 'TODAS LAS TABLAS EXISTENTES EN habilidosos_db' as info;
SHOW TABLES;

-- 2. CONTAR TOTAL DE TABLAS
SELECT 'TOTAL DE TABLAS' as info, COUNT(*) as cantidad
FROM information_schema.tables 
WHERE table_schema = 'habilidosos_db';

-- 3. BUSCAR TABLAS DE USUARIOS (diferentes nombres posibles)
SELECT 'BUSCANDO TABLAS DE USUARIOS' as info;
SELECT table_name as 'Posibles tablas de usuarios'
FROM information_schema.tables 
WHERE table_schema = 'habilidosos_db' 
AND (table_name LIKE '%user%' OR table_name LIKE '%auth%' OR table_name LIKE '%account%');

-- 4. VERIFICAR TABLAS DE DJANGO (si existe)
SELECT 'TABLAS DE DJANGO' as info;
SELECT table_name as 'Tablas Django'
FROM information_schema.tables 
WHERE table_schema = 'habilidosos_db' 
AND table_name LIKE 'django_%';

-- 5. VERIFICAR TABLAS DE AUTH (si existe)
SELECT 'TABLAS DE AUTENTICACIÓN' as info;
SELECT table_name as 'Tablas Auth'
FROM information_schema.tables 
WHERE table_schema = 'habilidosos_db' 
AND table_name LIKE 'auth_%';

-- 6. VERIFICAR SI EXISTEN NUESTRAS TABLAS OBJETIVO
SELECT 'VERIFICACIÓN DE NUESTRAS TABLAS OBJETIVO' as info;

-- Learning System
SELECT 
    'LEARNING SYSTEM' as modulo,
    COUNT(*) as tablas_existentes,
    '8 requeridas' as tablas_requeridas
FROM information_schema.tables 
WHERE table_schema = 'habilidosos_db' AND table_name LIKE 'learning_%'

UNION ALL

-- Analytics
SELECT 
    'USER ANALYTICS' as modulo,
    COUNT(*) as tablas_existentes,
    '7 requeridas' as tablas_requeridas
FROM information_schema.tables 
WHERE table_schema = 'habilidosos_db' AND table_name LIKE 'analytics_%'

UNION ALL

-- Cultural Events
SELECT 
    'CULTURAL EVENTS' as modulo,
    COUNT(*) as tablas_existentes,
    '8 requeridas' as tablas_requeridas
FROM information_schema.tables 
WHERE table_schema = 'habilidosos_db' AND table_name LIKE 'cultural_%';

-- 7. LISTAR TABLAS POR PREFIJO PARA ENTENDER LA ESTRUCTURA
SELECT 'ANÁLISIS POR PREFIJOS' as info;
SELECT 
    SUBSTRING_INDEX(table_name, '_', 1) as prefijo,
    COUNT(*) as cantidad,
    GROUP_CONCAT(table_name SEPARATOR ', ') as tablas
FROM information_schema.tables 
WHERE table_schema = 'habilidosos_db'
GROUP BY SUBSTRING_INDEX(table_name, '_', 1)
ORDER BY cantidad DESC;

-- 8. MOSTRAR INFORMACIÓN DETALLADA DE CADA TABLA
SELECT 'INFORMACIÓN DETALLADA DE TABLAS' as info;
SELECT 
    table_name as 'Tabla',
    table_rows as 'Filas',
    ROUND(((data_length + index_length) / 1024 / 1024), 2) as 'Tamaño_MB',
    engine as 'Motor',
    table_collation as 'Collation'
FROM information_schema.tables 
WHERE table_schema = 'habilidosos_db'
ORDER BY table_name;