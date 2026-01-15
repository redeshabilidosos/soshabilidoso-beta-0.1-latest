-- ============================================
-- Script de migración para agregar campos faltantes
-- Base de datos: habilidosos_db
-- Fecha: 2025-11-14
-- ============================================

USE habilidosos_db;

-- ============================================
-- TABLA: usuarios
-- Agregar campos faltantes para foto de portada
-- ============================================

-- Verificar si la columna cover_photo existe, si no, agregarla
SET @dbname = DATABASE();
SET @tablename = 'usuarios';
SET @columnname = 'cover_photo';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  "SELECT 1",
  CONCAT("ALTER TABLE ", @tablename, " ADD ", @columnname, " VARCHAR(500) AFTER avatar;")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- ============================================
-- TABLA: publicaciones (posts)
-- Agregar campos faltantes
-- ============================================

-- Agregar campo is_archived si no existe
SET @columnname = 'is_archived';
SET @tablename = 'publicaciones';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  "SELECT 1",
  CONCAT("ALTER TABLE ", @tablename, " ADD ", @columnname, " BOOLEAN DEFAULT FALSE AFTER is_pinned;")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Agregar campos de contadores de reacciones específicas si no existen
SET @columnname = 'likes_count';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  "SELECT 1",
  CONCAT("ALTER TABLE ", @tablename, " ADD ", @columnname, " INT UNSIGNED DEFAULT 0 AFTER reactions_count;")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

SET @columnname = 'celebrations_count';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  "SELECT 1",
  CONCAT("ALTER TABLE ", @tablename, " ADD ", @columnname, " INT UNSIGNED DEFAULT 0 AFTER likes_count;")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

SET @columnname = 'golazos_count';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  "SELECT 1",
  CONCAT("ALTER TABLE ", @tablename, " ADD ", @columnname, " INT UNSIGNED DEFAULT 0 AFTER celebrations_count;")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- ============================================
-- Actualizar tabla posts para usar el nombre correcto
-- ============================================

-- Renombrar tabla si existe publicaciones pero no posts
SET @tablename_old = 'publicaciones';
SET @tablename_new = 'posts';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES
    WHERE
      (table_name = @tablename_old)
      AND (table_schema = @dbname)
  ) > 0 AND (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES
    WHERE
      (table_name = @tablename_new)
      AND (table_schema = @dbname)
  ) = 0,
  CONCAT("RENAME TABLE ", @tablename_old, " TO ", @tablename_new, ";"),
  "SELECT 1"
));
PREPARE renameIfExists FROM @preparedStatement;
EXECUTE renameIfExists;
DEALLOCATE PREPARE renameIfExists;

-- ============================================
-- Actualizar tabla usuarios para usar el nombre correcto
-- ============================================

-- Renombrar tabla si existe usuarios pero no users
SET @tablename_old = 'usuarios';
SET @tablename_new = 'users';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES
    WHERE
      (table_name = @tablename_old)
      AND (table_schema = @dbname)
  ) > 0 AND (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES
    WHERE
      (table_name = @tablename_new)
      AND (table_schema = @dbname)
  ) = 0,
  CONCAT("RENAME TABLE ", @tablename_old, " TO ", @tablename_new, ";"),
  "SELECT 1"
));
PREPARE renameIfExists FROM @preparedStatement;
EXECUTE renameIfExists;
DEALLOCATE PREPARE renameIfExists;

-- ============================================
-- Verificar y crear índices faltantes
-- ============================================

-- Índice para búsqueda de posts por usuario y fecha
SET @index_name = 'idx_user_created';
SET @tablename = 'posts';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (index_name = @index_name)
  ) > 0,
  "SELECT 1",
  CONCAT("CREATE INDEX ", @index_name, " ON ", @tablename, " (user_id, created_at DESC);")
));
PREPARE createIndexIfNotExists FROM @preparedStatement;
EXECUTE createIndexIfNotExists;
DEALLOCATE PREPARE createIndexIfNotExists;

-- Índice para búsqueda de posts públicos
SET @index_name = 'idx_public_created';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (index_name = @index_name)
  ) > 0,
  "SELECT 1",
  CONCAT("CREATE INDEX ", @index_name, " ON ", @tablename, " (is_public, created_at DESC);")
));
PREPARE createIndexIfNotExists FROM @preparedStatement;
EXECUTE createIndexIfNotExists;
DEALLOCATE PREPARE createIndexIfNotExists;

-- ============================================
-- Mensaje de confirmación
-- ============================================
SELECT 'Migración completada exitosamente. Todos los campos faltantes han sido agregados.' AS Resultado;
