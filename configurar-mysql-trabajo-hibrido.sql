-- ========================================
-- MySQL para Trabajo Híbrido (Casa + Oficina)
-- ========================================

-- PASO 1: Crear usuario con acceso desde cualquier IP
-- Esto permite conectar desde casa, oficina, o cualquier red
CREATE USER IF NOT EXISTS 'root'@'%' IDENTIFIED BY 'tu_password_segura';
GRANT ALL PRIVILEGES ON habilidosos_db.* TO 'root'@'%';

-- PASO 2: Mantener usuario local (más rápido para desarrollo local)
CREATE USER IF NOT EXISTS 'root'@'localhost' IDENTIFIED BY '';
GRANT ALL PRIVILEGES ON habilidosos_db.* TO 'root'@'localhost';

CREATE USER IF NOT EXISTS 'root'@'127.0.0.1' IDENTIFIED BY '';
GRANT ALL PRIVILEGES ON habilidosos_db.* TO 'root'@'127.0.0.1';

-- PASO 3: Aplicar cambios
FLUSH PRIVILEGES;

-- PASO 4: Verificar usuarios creados
SELECT user, host FROM mysql.user WHERE user = 'root';

-- ========================================
-- RESULTADO ESPERADO:
-- ========================================
-- user | host
-- -----|----------------
-- root | localhost      <-- Desarrollo local (sin password)
-- root | 127.0.0.1      <-- Desarrollo local (sin password)
-- root | %              <-- Remoto (con password)
-- ========================================

-- ========================================
-- IMPORTANTE: SEGURIDAD
-- ========================================
-- 
-- 1. CAMBIAR 'tu_password_segura' por una contraseña real
--    Ejemplo: 'MiPass2024$Seguro'
--
-- 2. Actualizar backend/.env con la contraseña:
--    DATABASE_PASSWORD=MiPass2024$Seguro
--
-- 3. El firewall de Windows protege el puerto 3307
--    Solo dispositivos en tu red pueden conectar
--
-- 4. Para mayor seguridad, usa VPN cuando estés en oficina
--
-- ========================================

-- ========================================
-- ALTERNATIVA: Múltiples Redes Específicas
-- ========================================
-- Si prefieres limitar a redes específicas:

-- Casa (ejemplo: 192.168.78.x)
-- CREATE USER IF NOT EXISTS 'root'@'192.168.78.%' IDENTIFIED BY '';
-- GRANT ALL PRIVILEGES ON habilidosos_db.* TO 'root'@'192.168.78.%';

-- Oficina (ejemplo: 192.168.1.x - ajusta según tu oficina)
-- CREATE USER IF NOT EXISTS 'root'@'192.168.1.%' IDENTIFIED BY '';
-- GRANT ALL PRIVILEGES ON habilidosos_db.* TO 'root'@'192.168.1.%';

-- Otra red (ejemplo: 10.0.0.x)
-- CREATE USER IF NOT EXISTS 'root'@'10.0.0.%' IDENTIFIED BY '';
-- GRANT ALL PRIVILEGES ON habilidosos_db.* TO 'root'@'10.0.0.%';

-- FLUSH PRIVILEGES;

-- ========================================
-- NOTAS IMPORTANTES
-- ========================================
--
-- 1. El símbolo '%' significa "cualquier IP"
-- 2. '192.168.78.%' significa "cualquier IP que empiece con 192.168.78"
-- 3. Localhost siempre debe tener acceso sin password para desarrollo
-- 4. Acceso remoto debe tener password por seguridad
--
-- ========================================
