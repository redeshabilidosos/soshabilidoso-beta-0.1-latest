-- Script para crear las tablas de eventos culturales, learning y analytics en habilidosos_db
-- Compatible con la estructura existente de la BD (IDs char(32))
-- Ejecutar desde MySQL: mysql -u root -p habilidosos_db < create_cultural_events_tables.sql

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

-- Tabla de logros (compatible con la existente learning_logros)
CREATE TABLE IF NOT EXISTS learning_logro_nuevo (
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
CREATE TABLE IF NOT EXISTS learning_usuariologro (
    id CHAR(32) NOT NULL PRIMARY KEY,
    usuario_id CHAR(32) NOT NULL,
    logro_id CHAR(32) NOT NULL,
    fecha_obtenido DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    -- Nota: Sin FK a users hasta confirmar nombre de tabla
    FOREIGN KEY (logro_id) REFERENCES learning_logro_nuevo(id) ON DELETE CASCADE,
    UNIQUE KEY unique_usuario_logro (usuario_id, logro_id),
    INDEX idx_usuario_logros (usuario_id),
    INDEX idx_logro_usuarios (logro_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Nota: La tabla learning_evaluacion ya existe en la BD, no la recreamos

-- ================================================================================
-- SECCIÓN 2: TABLAS DE USER ANALYTICS
-- ================================================================================

-- Tabla de sesiones de usuario
CREATE TABLE IF NOT EXISTS analytics_usersession (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    usuario_id CHAR(36) NOT NULL,
    fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_fin TIMESTAMP NULL,
    duracion_minutos INT DEFAULT 0,
    dispositivo ENUM('mobile', 'desktop', 'tablet') DEFAULT 'desktop',
    navegador VARCHAR(100),
    ip_address VARCHAR(45),
    ubicacion_pais VARCHAR(100),
    ubicacion_ciudad VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_session_usuario (usuario_id),
    INDEX idx_session_fecha (fecha_inicio),
    INDEX idx_session_dispositivo (dispositivo)
);

-- Tabla de actividades de usuario
CREATE TABLE IF NOT EXISTS analytics_useractivity (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    usuario_id CHAR(36) NOT NULL,
    accion VARCHAR(100) NOT NULL,
    pagina VARCHAR(255) NOT NULL,
    elemento VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSON,
    FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_activity_usuario (usuario_id),
    INDEX idx_activity_accion (accion),
    INDEX idx_activity_pagina (pagina),
    INDEX idx_activity_timestamp (timestamp)
);

-- Tabla de interacciones de usuario
CREATE TABLE IF NOT EXISTS analytics_userinteraction (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    usuario_id CHAR(36) NOT NULL,
    tipo_interaccion ENUM('like', 'comment', 'share', 'follow', 'view') NOT NULL,
    objeto_tipo VARCHAR(50) NOT NULL,
    objeto_id VARCHAR(100) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_interaction_usuario (usuario_id),
    INDEX idx_interaction_tipo (tipo_interaccion),
    INDEX idx_interaction_objeto (objeto_tipo, objeto_id),
    INDEX idx_interaction_timestamp (timestamp)
);

-- Tabla de preferencias de usuario
CREATE TABLE IF NOT EXISTS analytics_userpreferences (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    usuario_id CHAR(36) NOT NULL,
    categoria_interes VARCHAR(100) NOT NULL,
    nivel_interes INT DEFAULT 5 CHECK (nivel_interes BETWEEN 1 AND 10),
    tiempo_dedicado INT DEFAULT 0,
    ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_usuario_categoria (usuario_id, categoria_interes),
    INDEX idx_preferences_usuario (usuario_id),
    INDEX idx_preferences_categoria (categoria_interes)
);

-- Tabla de ubicación de usuario
CREATE TABLE IF NOT EXISTS analytics_userlocation (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    usuario_id CHAR(36) NOT NULL,
    pais VARCHAR(100),
    departamento VARCHAR(100),
    ciudad VARCHAR(100),
    barrio VARCHAR(100),
    latitud DECIMAL(10, 8),
    longitud DECIMAL(11, 8),
    precision_metros INT,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_usuario_location (usuario_id),
    INDEX idx_location_pais (pais),
    INDEX idx_location_ciudad (ciudad)
);

-- Tabla de historial de búsquedas
CREATE TABLE IF NOT EXISTS analytics_usersearchhistory (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    usuario_id CHAR(36) NOT NULL,
    termino_busqueda VARCHAR(255) NOT NULL,
    categoria VARCHAR(100),
    resultados_encontrados INT DEFAULT 0,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_search_usuario (usuario_id),
    INDEX idx_search_termino (termino_busqueda),
    INDEX idx_search_timestamp (timestamp)
);

-- Tabla de conexiones sociales
CREATE TABLE IF NOT EXISTS analytics_usersocialconnections (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    usuario_id CHAR(36) NOT NULL,
    amigo_id CHAR(36) NOT NULL,
    tipo_conexion ENUM('friend', 'follow', 'block') DEFAULT 'follow',
    fecha_conexion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    interacciones_comunes INT DEFAULT 0,
    FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (amigo_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_connection (usuario_id, amigo_id),
    INDEX idx_connections_usuario (usuario_id),
    INDEX idx_connections_amigo (amigo_id),
    INDEX idx_connections_tipo (tipo_conexion)
);

-- ================================================================================
-- SECCIÓN 3: TABLAS DE EVENTOS CULTURALES
-- ================================================================================

-- Tabla de categorías de eventos culturales
CREATE TABLE IF NOT EXISTS cultural_event_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(50) NOT NULL DEFAULT 'CalendarDays',
    color_class VARCHAR(100) NOT NULL DEFAULT 'bg-purple-500/20 text-purple-400 border-purple-400/30',
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla principal de eventos culturales
CREATE TABLE IF NOT EXISTS cultural_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    category_id INT NOT NULL,
    organizer_id CHAR(36) NOT NULL, -- FK a users table (UUID)
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
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    views_count INT DEFAULT 0,
    likes_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES cultural_event_categories(id) ON DELETE CASCADE,
    FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_event_date (event_date),
    INDEX idx_category (category_id),
    INDEX idx_organizer (organizer_id),
    INDEX idx_featured (is_featured),
    INDEX idx_active (is_active)
);

-- Tabla de etiquetas para eventos
CREATE TABLE IF NOT EXISTS cultural_event_tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    usage_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de relación muchos a muchos entre eventos y etiquetas
CREATE TABLE IF NOT EXISTS cultural_event_tag_relations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    tag_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES cultural_events(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES cultural_event_tags(id) ON DELETE CASCADE,
    UNIQUE KEY unique_event_tag (event_id, tag_id)
);

-- Tabla de enlaces sociales de eventos
CREATE TABLE IF NOT EXISTS cultural_event_social_links (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    platform VARCHAR(50) NOT NULL, -- 'instagram', 'facebook', 'twitter', 'website'
    url VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES cultural_events(id) ON DELETE CASCADE,
    UNIQUE KEY unique_event_platform (event_id, platform)
);

-- Tabla de asistencia a eventos
CREATE TABLE IF NOT EXISTS cultural_event_attendances (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    user_id CHAR(36) NOT NULL, -- FK a users table (UUID)
    status ENUM('confirmed', 'maybe', 'cancelled') DEFAULT 'confirmed',
    confirmed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cancelled_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES cultural_events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_event (user_id, event_id),
    INDEX idx_event_status (event_id, status),
    INDEX idx_user_events (user_id)
);

-- Tabla de likes/me gusta en eventos
CREATE TABLE IF NOT EXISTS cultural_event_likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    user_id CHAR(36) NOT NULL, -- FK a users table (UUID)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES cultural_events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_event_like (user_id, event_id),
    INDEX idx_event_likes (event_id),
    INDEX idx_user_likes (user_id)
);

-- Tabla de vistas de eventos (para analytics)
CREATE TABLE IF NOT EXISTS cultural_event_views (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    user_id CHAR(36) NULL, -- Puede ser NULL para usuarios no autenticados (UUID)
    ip_address VARCHAR(45), -- Para rastrear vistas únicas
    user_agent TEXT,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES cultural_events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_event_views (event_id),
    INDEX idx_user_views (user_id),
    INDEX idx_viewed_date (viewed_at)
);

-- Insertar categorías por defecto
INSERT INTO cultural_event_categories (name, slug, icon, color_class, description) VALUES
('Música', 'musica', 'Music', 'bg-blue-500/20 text-blue-400 border-blue-400/30', 'Conciertos, festivales, recitales y eventos musicales'),
('Arte', 'arte', 'Palette', 'bg-purple-500/20 text-purple-400 border-purple-400/30', 'Exposiciones, galerías, muestras artísticas'),
('Teatro', 'teatro', 'Theater', 'bg-red-500/20 text-red-400 border-red-400/30', 'Obras teatrales, performances, monólogos'),
('Educación', 'educacion', 'Camera', 'bg-green-500/20 text-green-400 border-green-400/30', 'Talleres, cursos, conferencias educativas'),
('Danza', 'danza', 'Users', 'bg-pink-500/20 text-pink-400 border-pink-400/30', 'Espectáculos de danza, clases, competencias'),
('Literatura', 'literatura', 'CalendarDays', 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30', 'Presentaciones de libros, lecturas, clubes literarios')
ON DUPLICATE KEY UPDATE 
    icon = VALUES(icon),
    color_class = VALUES(color_class),
    description = VALUES(description);

-- Insertar algunas etiquetas comunes
INSERT INTO cultural_event_tags (name, slug) VALUES
('festival', 'festival'),
('música en vivo', 'musica-en-vivo'),
('arte contemporáneo', 'arte-contemporaneo'),
('teatro', 'teatro'),
('taller', 'taller'),
('educativo', 'educativo'),
('familia', 'familia'),
('gratis', 'gratis'),
('internacional', 'internacional'),
('local', 'local'),
('profesional', 'profesional'),
('principiantes', 'principiantes'),
('certificado', 'certificado'),
('masterclass', 'masterclass'),
('competencia', 'competencia')
ON DUPLICATE KEY UPDATE 
    name = VALUES(name);

-- Crear triggers para mantener contadores actualizados

-- Trigger para actualizar contador de likes
DELIMITER $$
CREATE TRIGGER IF NOT EXISTS update_likes_count_insert
    AFTER INSERT ON cultural_event_likes
    FOR EACH ROW
BEGIN
    UPDATE cultural_events 
    SET likes_count = (
        SELECT COUNT(*) 
        FROM cultural_event_likes 
        WHERE event_id = NEW.event_id
    )
    WHERE id = NEW.event_id;
END$$

CREATE TRIGGER IF NOT EXISTS update_likes_count_delete
    AFTER DELETE ON cultural_event_likes
    FOR EACH ROW
BEGIN
    UPDATE cultural_events 
    SET likes_count = (
        SELECT COUNT(*) 
        FROM cultural_event_likes 
        WHERE event_id = OLD.event_id
    )
    WHERE id = OLD.event_id;
END$$

-- Trigger para actualizar contador de asistentes
CREATE TRIGGER IF NOT EXISTS update_attendees_count_insert
    AFTER INSERT ON cultural_event_attendances
    FOR EACH ROW
BEGIN
    IF NEW.status = 'confirmed' THEN
        UPDATE cultural_events 
        SET current_attendees = (
            SELECT COUNT(*) 
            FROM cultural_event_attendances 
            WHERE event_id = NEW.event_id AND status = 'confirmed'
        )
        WHERE id = NEW.event_id;
    END IF;
END$$

CREATE TRIGGER IF NOT EXISTS update_attendees_count_update
    AFTER UPDATE ON cultural_event_attendances
    FOR EACH ROW
BEGIN
    UPDATE cultural_events 
    SET current_attendees = (
        SELECT COUNT(*) 
        FROM cultural_event_attendances 
        WHERE event_id = NEW.event_id AND status = 'confirmed'
    )
    WHERE id = NEW.event_id;
END$$

CREATE TRIGGER IF NOT EXISTS update_attendees_count_delete
    AFTER DELETE ON cultural_event_attendances
    FOR EACH ROW
BEGIN
    UPDATE cultural_events 
    SET current_attendees = (
        SELECT COUNT(*) 
        FROM cultural_event_attendances 
        WHERE event_id = OLD.event_id AND status = 'confirmed'
    )
    WHERE id = OLD.event_id;
END$$

-- Trigger para actualizar contador de uso de etiquetas
CREATE TRIGGER IF NOT EXISTS update_tag_usage_insert
    AFTER INSERT ON cultural_event_tag_relations
    FOR EACH ROW
BEGIN
    UPDATE cultural_event_tags 
    SET usage_count = (
        SELECT COUNT(*) 
        FROM cultural_event_tag_relations 
        WHERE tag_id = NEW.tag_id
    )
    WHERE id = NEW.tag_id;
END$$

CREATE TRIGGER IF NOT EXISTS update_tag_usage_delete
    AFTER DELETE ON cultural_event_tag_relations
    FOR EACH ROW
BEGIN
    UPDATE cultural_event_tags 
    SET usage_count = (
        SELECT COUNT(*) 
        FROM cultural_event_tag_relations 
        WHERE tag_id = OLD.tag_id
    )
    WHERE id = OLD.tag_id;
END$$

DELIMITER ;

-- ================================================================================
-- SECCIÓN 4: TRIGGERS Y VISTAS PARA LEARNING SYSTEM
-- ================================================================================

-- Trigger para actualizar estadísticas de progreso
DELIMITER $
CREATE TRIGGER IF NOT EXISTS update_learning_stats_insert
    AFTER INSERT ON learning_progresousuario
    FOR EACH ROW
BEGIN
    -- Actualizar tiempo total si se completa un tema
    IF NEW.completado = TRUE AND NEW.fecha_completado IS NOT NULL THEN
        UPDATE learning_progresousuario 
        SET tiempo_total_tema = COALESCE(tiempo_total_tema, 0) + COALESCE(tiempo_dedicado, 0)
        WHERE id = NEW.id;
    END IF;
END$

CREATE TRIGGER IF NOT EXISTS update_learning_stats_update
    AFTER UPDATE ON learning_progresousuario
    FOR EACH ROW
BEGIN
    -- Si se marca como completado, actualizar fecha
    IF NEW.completado = TRUE AND OLD.completado = FALSE THEN
        UPDATE learning_progresousuario 
        SET fecha_completado = CURRENT_TIMESTAMP
        WHERE id = NEW.id;
    END IF;
END$
DELIMITER ;

-- Vista para estadísticas de learning por usuario
CREATE OR REPLACE VIEW learning_user_stats AS
SELECT 
    u.id as usuario_id,
    u.username,
    u.display_name,
    COUNT(DISTINCT p.tema_id) as temas_completados,
    COUNT(DISTINCT t.seccion_id) as secciones_iniciadas,
    SUM(p.tiempo_dedicado) as tiempo_total_minutos,
    AVG(p.puntuacion_evaluacion) as puntuacion_promedio,
    COUNT(DISTINCT ul.logro_id) as logros_obtenidos,
    MAX(p.fecha_completado) as ultima_actividad
FROM users u
LEFT JOIN learning_progresousuario p ON u.id = p.usuario_id AND p.completado = TRUE
LEFT JOIN learning_tema t ON p.tema_id = t.id
LEFT JOIN learning_usuariologro ul ON u.id = ul.usuario_id
GROUP BY u.id, u.username, u.display_name;

-- Vista para estadísticas de temas
CREATE OR REPLACE VIEW learning_tema_stats AS
SELECT 
    t.id as tema_id,
    t.titulo,
    t.slug,
    s.nombre as seccion_nombre,
    COUNT(DISTINCT p.usuario_id) as usuarios_completaron,
    AVG(p.tiempo_dedicado) as tiempo_promedio_minutos,
    AVG(p.puntuacion_evaluacion) as puntuacion_promedio,
    COUNT(DISTINCT e.id) as total_evaluaciones
FROM learning_tema t
JOIN learning_seccion s ON t.seccion_id = s.id
LEFT JOIN learning_progresousuario p ON t.id = p.tema_id AND p.completado = TRUE
LEFT JOIN learning_evaluacion e ON t.id = e.tema_id
WHERE t.is_active = TRUE
GROUP BY t.id, t.titulo, t.slug, s.nombre;

-- ================================================================================
-- SECCIÓN 5: ÍNDICES ADICIONALES Y OPTIMIZACIONES
-- ================================================================================

-- Crear índices adicionales para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_events_date_active ON cultural_events(event_date, is_active);
CREATE INDEX IF NOT EXISTS idx_events_featured_active ON cultural_events(is_featured, is_active);
CREATE INDEX IF NOT EXISTS idx_events_category_date ON cultural_events(category_id, event_date);
CREATE INDEX IF NOT EXISTS idx_attendances_user_status ON cultural_event_attendances(user_id, status);
CREATE INDEX IF NOT EXISTS idx_views_event_date ON cultural_event_views(event_id, viewed_at);

-- Crear vista para estadísticas de eventos
CREATE OR REPLACE VIEW cultural_events_stats AS
SELECT 
    e.id,
    e.title,
    e.slug,
    e.event_date,
    e.location,
    c.name as category_name,
    u.username as organizer_username,
    u.display_name as organizer_name,
    e.capacity,
    e.current_attendees,
    e.likes_count,
    e.views_count,
    ROUND((e.current_attendees / e.capacity) * 100, 2) as attendance_percentage,
    e.is_featured,
    e.is_active,
    e.created_at
FROM cultural_events e
JOIN cultural_event_categories c ON e.category_id = c.id
JOIN users u ON e.organizer_id = u.id
WHERE e.is_active = TRUE;

-- Crear vista para eventos populares
CREATE OR REPLACE VIEW popular_cultural_events AS
SELECT 
    e.*,
    c.name as category_name,
    c.icon as category_icon,
    c.color_class as category_color,
    u.username as organizer_username,
    u.display_name as organizer_name,
    u.avatar as organizer_avatar,
    (e.likes_count * 0.3 + e.views_count * 0.1 + e.current_attendees * 0.6) as popularity_score
FROM cultural_events e
JOIN cultural_event_categories c ON e.category_id = c.id
JOIN users u ON e.organizer_id = u.id
WHERE e.is_active = TRUE
ORDER BY popularity_score DESC;

COMMIT;

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