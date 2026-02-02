-- ========================================
-- Crear Usuario MySQL para Acceso Remoto
-- ========================================
-- 
-- Ejecutar en phpMyAdmin o MySQL client
-- http://localhost/phpmyadmin
--

-- Opción 1: Usuario para tu red local (RECOMENDADO)
-- Solo permite conexiones desde 192.168.78.x
CREATE USER IF NOT EXISTS 'root'@'192.168.78.%' IDENTIFIED BY '';
GRANT ALL PRIVILEGES ON habilidosos_db.* TO 'root'@'192.168.78.%';

-- Opción 2: Usuario para cualquier IP (MENOS SEGURO)
-- Descomentar solo si necesitas acceso desde cualquier red
-- CREATE USER IF NOT EXISTS 'root'@'%' IDENTIFIED BY '';
-- GRANT ALL PRIVILEGES ON habilidosos_db.* TO 'root'@'%';

-- Aplicar cambios
FLUSH PRIVILEGES;

-- Verificar usuarios creados
SELECT user, host FROM mysql.user WHERE user = 'root';

-- ========================================
-- RESULTADO ESPERADO:
-- ========================================
-- user | host
-- -----|----------------
-- root | localhost
-- root | 127.0.0.1
-- root | 192.168.78.%  <-- NUEVO
-- ========================================

-- NOTAS:
-- 1. Contraseña vacía ('') - Cambiar en producción
-- 2. 192.168.78.% permite toda tu red local
-- 3. Ejecutar FLUSH PRIVILEGES es obligatorio
