-- Script para crear las tablas de eventos culturales, learning y analytics en habilidosos_db
-- Compatible con la estructura existente de la BD (IDs char(32))
-- Ejecutar desde MySQL: mysql -u root -p habilidosos_db < create_cultural_events_tables_fixed.sql

USE habilidosos_db;

-- ================================================================================
-- SECCIÓN 1: TABLAS DE LEARNING SYSTEM (COMPATIBLES CON ESTRUCTURA EXISTENTE)
-- ================================================================================

-- Tabla de secciones de aprendizaje
CREATE TABLE IF NOT EXISTS learning_seccion (
    id CHAR(32) NOT NULL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    descripcion TEXT,
    icono VARCHAR(50) DEFAULT 'BookOpen',
    color VARCHAR(7) DEFAULT '#00ff88',
    orden INT DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    imagen VARCHAR(500),
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    INDEX idx_seccion_active (is_active),
    INDEX idx_seccion_orden (orden)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de temas de aprendizaje
CREATE TABLE IF NOT EXISTS learning_tema (
    id CHAR(32) NOT NULL PRIMARY KEY,
    seccion_id CHAR(32) NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL,
    descripcion TEXT,
    nivel ENUM('principiante', 'intermedio', 'avanzado') DEFAULT 'principiante',
    duracion_minutos INT DEFAULT 30,
    orden INT DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    imagen VARCHAR(500),
    video VARCHAR(500),
    imagen_url VARCHAR(500),
    video_url VARCHAR(500),
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    FOREIGN KEY (seccion_id) REFERENCES learning_seccion(id) ON DELETE CASCADE,
    UNIQUE KEY unique_seccion_slug (seccion_id, slug),
    INDEX idx_tema_seccion (seccion_id),
    INDEX idx_tema_active (is_active),
    INDEX idx_tema_orden (orden)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Trigger para crear entrada en shareable_content cuando se crea un tema de learning
DELIMITER $
CREATE TRIGGER IF NOT EXISTS create_shareable_learning_topic
    AFTER INSERT ON learning_tema
    FOR EACH ROW
BEGIN
    INSERT INTO shareable_content (
        id,
        content_type,
        content_id,
        author_id,
        title,
        description,
        thumbnail_url,
        share_url,
        is_public,
        is_active
    ) VALUES (
        CONCAT('learn_', NEW.id),
        'learning_topic',
        NEW.id,
        'bd22ec1c4dbe48f3a018e96b2cd61304', -- ID del sistema/admin por defecto
        NEW.titulo,
        NEW.descripcion,
        NEW.imagen_url,
        generate_share_url('learning_topic', NEW.id),
        1,
        NEW.is_active
    );
END$

-- Trigger para actualizar shareable_content cuando se actualiza un tema
CREATE TRIGGER IF NOT EXISTS update_shareable_learning_topic
    AFTER UPDATE ON learning_tema
    FOR EACH ROW
BEGIN
    UPDATE shareable_content 
    SET 
        title = NEW.titulo,
        description = NEW.descripcion,
        thumbnail_url = NEW.imagen_url,
        is_active = NEW.is_active,
        updated_at = CURRENT_TIMESTAMP(6)
    WHERE content_type = 'learning_topic' AND content_id = NEW.id;
END$
DELIMITER ;

-- Tabla de contenido de temas
CREATE TABLE IF NOT EXISTS learning_temacontenido (
    id CHAR(32) NOT NULL PRIMARY KEY,
    tema_id CHAR(32) NOT NULL,
    subtitulo VARCHAR(200) NOT NULL,
    contenido TEXT NOT NULL,
    orden INT DEFAULT 0,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (tema_id) REFERENCES learning_tema(id) ON DELETE CASCADE,
    INDEX idx_contenido_tema (tema_id),
    INDEX idx_contenido_orden (orden)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de puntos clave de temas
CREATE TABLE IF NOT EXISTS learning_temapuntoclave (
    id CHAR(32) NOT NULL PRIMARY KEY,
    tema_id CHAR(32) NOT NULL,
    texto VARCHAR(300) NOT NULL,
    orden INT DEFAULT 0,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (tema_id) REFERENCES learning_tema(id) ON DELETE CASCADE,
    INDEX idx_punto_tema (tema_id),
    INDEX idx_punto_orden (orden)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Nota: La tabla learning_progresousuario ya existe en la BD, no la recreamos

-- Tabla de logros adicionales (compatible con la existente learning_logros)
CREATE TABLE IF NOT EXISTS learning_logro_adicional (
    id CHAR(32) NOT NULL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    icono VARCHAR(50) DEFAULT 'Trophy',
    condicion VARCHAR(100) NOT NULL,
    valor_requerido INT NOT NULL,
    is_active TINYINT(1) DEFAULT 1,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    INDEX idx_logro_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de logros de usuarios
CREATE TABLE IF NOT EXISTS learning_usuariologro_nuevo (
    id CHAR(32) NOT NULL PRIMARY KEY,
    usuario_id CHAR(32) NOT NULL,
    logro_id CHAR(32) NOT NULL,
    fecha_obtenido DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (logro_id) REFERENCES learning_logro_adicional(id) ON DELETE CASCADE,
    UNIQUE KEY unique_usuario_logro (usuario_id, logro_id),
    INDEX idx_usuario_logros (usuario_id),
    INDEX idx_logro_usuarios (logro_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================================
-- SECCIÓN 2: TABLAS DE USER ANALYTICS (COMPATIBLES CON ESTRUCTURA EXISTENTE)
-- ================================================================================

-- Tabla de sesiones de usuario
CREATE TABLE IF NOT EXISTS analytics_usersession (
    id CHAR(32) NOT NULL PRIMARY KEY,
    usuario_id CHAR(32) NOT NULL,
    fecha_inicio DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    fecha_fin DATETIME(6) NULL,
    duracion_minutos INT DEFAULT 0,
    dispositivo ENUM('mobile', 'desktop', 'tablet') DEFAULT 'desktop',
    navegador VARCHAR(100),
    ip_address VARCHAR(45),
    ubicacion_pais VARCHAR(100),
    ubicacion_ciudad VARCHAR(100),
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_session_usuario (usuario_id),
    INDEX idx_session_fecha (fecha_inicio),
    INDEX idx_session_dispositivo (dispositivo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de actividades de usuario
CREATE TABLE IF NOT EXISTS analytics_useractivity (
    id CHAR(32) NOT NULL PRIMARY KEY,
    usuario_id CHAR(32) NOT NULL,
    accion VARCHAR(100) NOT NULL,
    pagina VARCHAR(255) NOT NULL,
    elemento VARCHAR(255),
    timestamp DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    metadata LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin CHECK (json_valid(metadata)),
    FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_activity_usuario (usuario_id),
    INDEX idx_activity_accion (accion),
    INDEX idx_activity_pagina (pagina),
    INDEX idx_activity_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de interacciones de usuario
CREATE TABLE IF NOT EXISTS analytics_userinteraction (
    id CHAR(32) NOT NULL PRIMARY KEY,
    usuario_id CHAR(32) NOT NULL,
    tipo_interaccion ENUM('like', 'comment', 'share', 'follow', 'view') NOT NULL,
    objeto_tipo VARCHAR(50) NOT NULL,
    objeto_id VARCHAR(100) NOT NULL,
    timestamp DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_interaction_usuario (usuario_id),
    INDEX idx_interaction_tipo (tipo_interaccion),
    INDEX idx_interaction_objeto (objeto_tipo, objeto_id),
    INDEX idx_interaction_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de preferencias de usuario
CREATE TABLE IF NOT EXISTS analytics_userpreferences (
    id CHAR(32) NOT NULL PRIMARY KEY,
    usuario_id CHAR(32) NOT NULL,
    categoria_interes VARCHAR(100) NOT NULL,
    nivel_interes INT DEFAULT 5 CHECK (nivel_interes BETWEEN 1 AND 10),
    tiempo_dedicado INT DEFAULT 0,
    ultima_actualizacion DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_usuario_categoria (usuario_id, categoria_interes),
    INDEX idx_preferences_usuario (usuario_id),
    INDEX idx_preferences_categoria (categoria_interes)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de ubicación de usuario
CREATE TABLE IF NOT EXISTS analytics_userlocation (
    id CHAR(32) NOT NULL PRIMARY KEY,
    usuario_id CHAR(32) NOT NULL,
    pais VARCHAR(100),
    departamento VARCHAR(100),
    ciudad VARCHAR(100),
    barrio VARCHAR(100),
    latitud DECIMAL(10, 8),
    longitud DECIMAL(11, 8),
    precision_metros INT,
    fecha_actualizacion DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_usuario_location (usuario_id),
    INDEX idx_location_pais (pais),
    INDEX idx_location_ciudad (ciudad)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de historial de búsquedas
CREATE TABLE IF NOT EXISTS analytics_usersearchhistory (
    id CHAR(32) NOT NULL PRIMARY KEY,
    usuario_id CHAR(32) NOT NULL,
    termino_busqueda VARCHAR(255) NOT NULL,
    categoria VARCHAR(100),
    resultados_encontrados INT DEFAULT 0,
    timestamp DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_search_usuario (usuario_id),
    INDEX idx_search_termino (termino_busqueda),
    INDEX idx_search_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de conexiones sociales
CREATE TABLE IF NOT EXISTS analytics_usersocialconnections (
    id CHAR(32) NOT NULL PRIMARY KEY,
    usuario_id CHAR(32) NOT NULL,
    amigo_id CHAR(32) NOT NULL,
    tipo_conexion ENUM('friend', 'follow', 'block') DEFAULT 'follow',
    fecha_conexion DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    interacciones_comunes INT DEFAULT 0,
    FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (amigo_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_connection (usuario_id, amigo_id),
    INDEX idx_connections_usuario (usuario_id),
    INDEX idx_connections_amigo (amigo_id),
    INDEX idx_connections_tipo (tipo_conexion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================================
-- SECCIÓN 3: TABLAS DE EVENTOS CULTURALES (COMPATIBLES CON ESTRUCTURA EXISTENTE)
-- ================================================================================

-- Tabla de categorías de eventos culturales
CREATE TABLE IF NOT EXISTS cultural_event_categories (
    id CHAR(32) NOT NULL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(50) NOT NULL DEFAULT 'CalendarDays',
    color_class VARCHAR(100) NOT NULL DEFAULT 'bg-purple-500/20 text-purple-400 border-purple-400/30',
    description TEXT,
    is_active TINYINT(1) DEFAULT 1,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla principal de eventos culturales
CREATE TABLE IF NOT EXISTS cultural_events (
    id CHAR(32) NOT NULL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    category_id CHAR(32) NOT NULL,
    organizer_id CHAR(32) NOT NULL, -- FK a tabla users (char(32))
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME,
    location VARCHAR(255) NOT NULL,
    address TEXT,
    price VARCHAR(100) DEFAULT 'Gratis',
    capacity INT DEFAULT 100,
    current_attendees INT DEFAULT 0,
    image_url VARCHAR(500),
    video_url VARCHAR(500),
    is_featured TINYINT(1) DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    views_count INT DEFAULT 0,
    likes_count INT DEFAULT 0,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    FOREIGN KEY (category_id) REFERENCES cultural_event_categories(id) ON DELETE CASCADE,
    FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_event_date (event_date),
    INDEX idx_category (category_id),
    INDEX idx_organizer (organizer_id),
    INDEX idx_featured (is_featured),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Trigger para crear entrada en shareable_content cuando se crea un evento
DELIMITER $
CREATE TRIGGER IF NOT EXISTS create_shareable_cultural_event
    AFTER INSERT ON cultural_events
    FOR EACH ROW
BEGIN
    INSERT INTO shareable_content (
        id,
        content_type,
        content_id,
        author_id,
        title,
        description,
        thumbnail_url,
        share_url,
        is_public,
        is_active
    ) VALUES (
        NEW.id,
        'cultural_event',
        NEW.id,
        NEW.organizer_id,
        NEW.title,
        NEW.description,
        NEW.image_url,
        generate_share_url('cultural_event', NEW.id),
        1,
        NEW.is_active
    );
END$

-- Trigger para actualizar shareable_content cuando se actualiza un evento
CREATE TRIGGER IF NOT EXISTS update_shareable_cultural_event
    AFTER UPDATE ON cultural_events
    FOR EACH ROW
BEGIN
    UPDATE shareable_content 
    SET 
        title = NEW.title,
        description = NEW.description,
        thumbnail_url = NEW.image_url,
        is_active = NEW.is_active,
        updated_at = CURRENT_TIMESTAMP(6)
    WHERE content_type = 'cultural_event' AND content_id = NEW.id;
END$
DELIMITER ;

-- Tabla de etiquetas para eventos
CREATE TABLE IF NOT EXISTS cultural_event_tags (
    id CHAR(32) NOT NULL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    usage_count INT DEFAULT 0,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de relación muchos a muchos entre eventos y etiquetas
CREATE TABLE IF NOT EXISTS cultural_event_tag_relations (
    id CHAR(32) NOT NULL PRIMARY KEY,
    event_id CHAR(32) NOT NULL,
    tag_id CHAR(32) NOT NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (event_id) REFERENCES cultural_events(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES cultural_event_tags(id) ON DELETE CASCADE,
    UNIQUE KEY unique_event_tag (event_id, tag_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de enlaces sociales de eventos
CREATE TABLE IF NOT EXISTS cultural_event_social_links (
    id CHAR(32) NOT NULL PRIMARY KEY,
    event_id CHAR(32) NOT NULL,
    platform VARCHAR(50) NOT NULL, -- 'instagram', 'facebook', 'twitter', 'website'
    url VARCHAR(500) NOT NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (event_id) REFERENCES cultural_events(id) ON DELETE CASCADE,
    UNIQUE KEY unique_event_platform (event_id, platform)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de asistencia a eventos
CREATE TABLE IF NOT EXISTS cultural_event_attendances (
    id CHAR(32) NOT NULL PRIMARY KEY,
    event_id CHAR(32) NOT NULL,
    user_id CHAR(32) NOT NULL, -- FK a tabla users (char(32))
    status ENUM('confirmed', 'maybe', 'cancelled') DEFAULT 'confirmed',
    confirmed_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    cancelled_at DATETIME(6) NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    FOREIGN KEY (event_id) REFERENCES cultural_events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_event (user_id, event_id),
    INDEX idx_event_status (event_id, status),
    INDEX idx_user_events (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de likes/me gusta en eventos
CREATE TABLE IF NOT EXISTS cultural_event_likes (
    id CHAR(32) NOT NULL PRIMARY KEY,
    event_id CHAR(32) NOT NULL,
    user_id CHAR(32) NOT NULL, -- FK a tabla users (char(32))
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (event_id) REFERENCES cultural_events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_event_like (user_id, event_id),
    INDEX idx_event_likes (event_id),
    INDEX idx_user_likes (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de vistas de eventos (para analytics)
CREATE TABLE IF NOT EXISTS cultural_event_views (
    id CHAR(32) NOT NULL PRIMARY KEY,
    event_id CHAR(32) NOT NULL,
    user_id CHAR(32) NULL, -- Puede ser NULL para usuarios no autenticados (char(32))
    ip_address VARCHAR(45), -- Para rastrear vistas únicas
    user_agent TEXT,
    viewed_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (event_id) REFERENCES cultural_events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_event_views (event_id),
    INDEX idx_user_views (user_id),
    INDEX idx_viewed_date (viewed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================================
-- SECCIÓN 4: DATOS INICIALES
-- ================================================================================

-- Insertar categorías por defecto (usando IDs char(32) generados)
INSERT INTO cultural_event_categories (id, name, slug, icon, color_class, description) VALUES
('a1b2c3d4e5f6789012345678901234ab', 'Música', 'musica', 'Music', 'bg-blue-500/20 text-blue-400 border-blue-400/30', 'Conciertos, festivales, recitales y eventos musicales'),
('b2c3d4e5f6789012345678901234abc1', 'Arte', 'arte', 'Palette', 'bg-purple-500/20 text-purple-400 border-purple-400/30', 'Exposiciones, galerías, muestras artísticas'),
('c3d4e5f6789012345678901234abc12d', 'Teatro', 'teatro', 'Theater', 'bg-red-500/20 text-red-400 border-red-400/30', 'Obras teatrales, performances, monólogos'),
('d4e5f6789012345678901234abc12de3', 'Educación', 'educacion', 'Camera', 'bg-green-500/20 text-green-400 border-green-400/30', 'Talleres, cursos, conferencias educativas'),
('e5f6789012345678901234abc12de34f', 'Danza', 'danza', 'Users', 'bg-pink-500/20 text-pink-400 border-pink-400/30', 'Espectáculos de danza, clases, competencias'),
('f6789012345678901234abc12de34f45', 'Literatura', 'literatura', 'CalendarDays', 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30', 'Presentaciones de libros, lecturas, clubes literarios')
ON DUPLICATE KEY UPDATE 
    icon = VALUES(icon),
    color_class = VALUES(color_class),
    description = VALUES(description);

-- Insertar algunas etiquetas comunes (usando IDs char(32) generados)
INSERT INTO cultural_event_tags (id, name, slug) VALUES
('tag1234567890123456789012345678ab', 'festival', 'festival'),
('tag234567890123456789012345678abc', 'música en vivo', 'musica-en-vivo'),
('tag34567890123456789012345678abcd', 'arte contemporáneo', 'arte-contemporaneo'),
('tag4567890123456789012345678abcde', 'teatro', 'teatro'),
('tag567890123456789012345678abcdef', 'taller', 'taller'),
('tag67890123456789012345678abcdef1', 'educativo', 'educativo'),
('tag7890123456789012345678abcdef12', 'familia', 'familia'),
('tag890123456789012345678abcdef123', 'gratis', 'gratis'),
('tag90123456789012345678abcdef1234', 'internacional', 'internacional'),
('tag0123456789012345678abcdef12345', 'local', 'local'),
('tag123456789012345678abcdef123456', 'profesional', 'profesional'),
('tag23456789012345678abcdef1234567', 'principiantes', 'principiantes'),
('tag3456789012345678abcdef12345678', 'certificado', 'certificado'),
('tag456789012345678abcdef123456789', 'masterclass', 'masterclass'),
('tag56789012345678abcdef12345678ab', 'competencia', 'competencia')
ON DUPLICATE KEY UPDATE 
    name = VALUES(name);

-- ================================================================================
-- SECCIÓN 5: ÍNDICES ADICIONALES Y OPTIMIZACIONES
-- ================================================================================

-- Crear índices adicionales para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_events_date_active ON cultural_events(event_date, is_active);
CREATE INDEX IF NOT EXISTS idx_events_featured_active ON cultural_events(is_featured, is_active);
CREATE INDEX IF NOT EXISTS idx_events_category_date ON cultural_events(category_id, event_date);
CREATE INDEX IF NOT EXISTS idx_attendances_user_status ON cultural_event_attendances(user_id, status);
CREATE INDEX IF NOT EXISTS idx_views_event_date ON cultural_event_views(event_id, viewed_at);

-- ================================================================================
-- SECCIÓN 6: VERIFICACIÓN Y RESUMEN
-- ================================================================================

-- Mostrar resumen de tablas creadas por módulo
SELECT 
    'RESUMEN DE TABLAS CREADAS' as info,
    '' as separador;

SELECT 
    'Learning System' as modulo,
    COUNT(*) as tablas_creadas
FROM information_schema.tables 
WHERE table_schema = 'habilidosos_db' 
AND table_name LIKE 'learning_%'

UNION ALL

SELECT 
    'User Analytics' as modulo,
    COUNT(*) as tablas_creadas
FROM information_schema.tables 
WHERE table_schema = 'habilidosos_db' 
AND table_name LIKE 'analytics_%'

UNION ALL

SELECT 
    'Cultural Events' as modulo,
    COUNT(*) as tablas_creadas
FROM information_schema.tables 
WHERE table_schema = 'habilidosos_db' 
AND table_name LIKE 'cultural_%';

-- Verificar tablas específicas de learning
SELECT 
    '' as separador,
    'VERIFICACIÓN DE TABLAS DE LEARNING' as info;

SELECT 
    table_name as 'Tabla Learning',
    table_rows as 'Filas',
    'CREADA' as estado
FROM information_schema.tables 
WHERE table_schema = 'habilidosos_db' 
AND table_name LIKE 'learning_%'
ORDER BY table_name;

-- Verificar tablas de analytics
SELECT 
    '' as separador,
    'VERIFICACIÓN DE TABLAS DE ANALYTICS' as info;

SELECT 
    table_name as 'Tabla Analytics',
    table_rows as 'Filas',
    'CREADA' as estado
FROM information_schema.tables 
WHERE table_schema = 'habilidosos_db' 
AND table_name LIKE 'analytics_%'
ORDER BY table_name;

-- Verificar tablas de eventos culturales
SELECT 
    '' as separador,
    'VERIFICACIÓN DE TABLAS DE EVENTOS CULTURALES' as info;

SELECT 
    table_name as 'Tabla Cultural',
    table_rows as 'Filas',
    'CREADA' as estado
FROM information_schema.tables 
WHERE table_schema = 'habilidosos_db' 
AND table_name LIKE 'cultural_%'
ORDER BY table_name;

-- Mostrar total general
SELECT 
    '' as separador,
    'RESUMEN GENERAL' as info;

SELECT 
    COUNT(*) as 'Total Tablas en BD',
    SUM(CASE WHEN table_name LIKE 'learning_%' THEN 1 ELSE 0 END) as 'Learning',
    SUM(CASE WHEN table_name LIKE 'analytics_%' THEN 1 ELSE 0 END) as 'Analytics',
    SUM(CASE WHEN table_name LIKE 'cultural_%' THEN 1 ELSE 0 END) as 'Cultural Events'
FROM information_schema.tables 
WHERE table_schema = 'habilidosos_db';

COMMIT;