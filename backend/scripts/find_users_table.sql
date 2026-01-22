-- SCRIPT PARA ENCONTRAR LA TABLA REAL DE USUARIOS
-- Ejecutar en phpMyAdmin: habilidosos_db -> SQL

USE habilidosos_db;

-- 1. MOSTRAR TODAS LAS TABLAS (104 tablas)
SELECT 'TOTAL DE TABLAS EN LA BASE DE DATOS' as info;
SELECT COUNT(*) as total_tablas FROM information_schema.tables WHERE table_schema = 'habilidosos_db';

-- 2. BUSCAR TABLAS QUE CONTENGAN 'USER' EN EL NOMBRE
SELECT 'TABLAS QUE CONTIENEN USER' as info;
SELECT table_name as 'Posibles tablas de usuarios'
FROM information_schema.tables 
WHERE table_schema = 'habilidosos_db' 
AND table_name LIKE '%user%'
ORDER BY table_name;

-- 3. BUSCAR TABLAS DE AUTENTICACIÓN
SELECT 'TABLAS DE AUTENTICACIÓN' as info;
SELECT table_name as 'Tablas de auth'
FROM information_schema.tables 
WHERE table_schema = 'habilidosos_db' 
AND (table_name LIKE '%auth%' OR table_name LIKE '%account%' OR table_name LIKE '%profile%')
ORDER BY table_name;

-- 4. BUSCAR TABLAS CON CAMPOS TÍPICOS DE USUARIOS
SELECT 'TABLAS CON CAMPOS DE USUARIOS' as info;
SELECT DISTINCT table_name as 'Tablas con campos de usuario'
FROM information_schema.columns 
WHERE table_schema = 'habilidosos_db' 
AND (column_name IN ('username', 'email', 'password', 'first_name', 'last_name', 'display_name'))
ORDER BY table_name;

-- 5. MOSTRAR ESTRUCTURA DE TABLAS CANDIDATAS
-- Verificar si existe auth_user (Django estándar)
SELECT 'ESTRUCTURA DE auth_user (si existe)' as info;
SELECT 
    column_name as 'Campo',
    data_type as 'Tipo',
    is_nullable as 'Nullable',
    column_key as 'Key',
    extra as 'Extra'
FROM information_schema.columns 
WHERE table_schema = 'habilidosos_db' 
AND table_name = 'auth_user'
ORDER BY ordinal_position;

-- 6. VERIFICAR OTRAS POSIBLES TABLAS DE USUARIOS
SELECT 'VERIFICANDO OTRAS POSIBLES TABLAS' as info;

-- Verificar accounts_user
SELECT 'accounts_user' as tabla, COUNT(*) as existe
FROM information_schema.tables 
WHERE table_schema = 'habilidosos_db' AND table_name = 'accounts_user'
UNION ALL
-- Verificar users_user  
SELECT 'users_user' as tabla, COUNT(*) as existe
FROM information_schema.tables 
WHERE table_schema = 'habilidosos_db' AND table_name = 'users_user'
UNION ALL
-- Verificar user_profile
SELECT 'user_profile' as tabla, COUNT(*) as existe
FROM information_schema.tables 
WHERE table_schema = 'habilidosos_db' AND table_name = 'user_profile'
UNION ALL
-- Verificar custom_user
SELECT 'custom_user' as tabla, COUNT(*) as existe
FROM information_schema.tables 
WHERE table_schema = 'habilidosos_db' AND table_name = 'custom_user';

-- 7. LISTAR PRIMERAS 20 TABLAS PARA VER PATRONES
SELECT 'PRIMERAS 20 TABLAS PARA VER PATRONES' as info;
SELECT table_name as 'Tabla', table_rows as 'Filas'
FROM information_schema.tables 
WHERE table_schema = 'habilidosos_db'
ORDER BY table_name
LIMIT 20;

-- 8. BUSCAR TABLAS CON MÁS FILAS (probablemente usuarios)
SELECT 'TABLAS CON MÁS DATOS (posibles usuarios)' as info;
SELECT table_name as 'Tabla', table_rows as 'Filas'
FROM information_schema.tables 
WHERE table_schema = 'habilidosos_db'
AND table_rows > 0
ORDER BY table_rows DESC
LIMIT 10;