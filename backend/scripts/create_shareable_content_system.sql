-- Sistema unificado de contenido compartible para habilidosos_db
-- Cada publicación tendrá un ID único para compartir
-- Ejecutar ANTES de create_cultural_events_tables_fixed.sql

USE habilidosos_db;

-- ================================================================================
-- TABLA CENTRAL DE CONTENIDO COMPARTIBLE
-- ================================================================================

-- Tabla principal que unifica todos los tipos de contenido compartible
CREATE TABLE IF NOT EXISTS shareable_content (
    id CHAR(32) NOT NULL PRIMARY KEY, -- ID único para compartir
    content_type ENUM(
        'cultural_event',     -- Eventos culturales
        'classified',         -- Clasificados/conexiones
        'feed_post',         -- Publicaciones del feed principal
        'community_post',    -- Publicaciones en subcomunidades
        'reel',              -- Videos cortos/clips
        'news_article',      -- Artículos de habil-news
        'live_stream',       -- Transmisiones en vivo
        'learning_topic',    -- Temas de aprendizaje
        'user_profile',      -- Perfiles de usuario
        'enterprise_profile' -- Perfiles de empresas
    ) NOT NULL,
    content_id CHAR(32) NOT NULL,     -- ID del contenido en su tabla específica
    author_id CHAR(32) NOT NULL,      -- Usuario que creó el contenido
    title VARCHAR(255) NOT NULL,      -- Título para compartir
    description TEXT,                 -- Descripción para compartir
    thumbnail_url VARCHAR(500),       -- Imagen para preview al compartir
    share_url VARCHAR(500) NOT NULL,  -- URL completa para compartir
    is_public TINYINT(1) DEFAULT 1,   -- Si es público o privado
    is_active TINYINT(1) DEFAULT 1,   -- Si está activo
    shares_count INT DEFAULT 0,       -- Contador de veces compartido
    views_count INT DEFAULT 0,        -- Contador de visualizaciones
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_content_type_id (content_type, content_id),
    INDEX idx_content_type (content_type),
    INDEX idx_author (author_id),
    INDEX idx_public_active (is_public, is_active),
    INDEX idx_created_at (created_at),
    INDEX idx_shares_count (shares_count),
    INDEX idx_views_count (views_count)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================================
-- TABLA DE COMPARTIDOS (SHARES)
-- ================================================================================

-- Registro de cuando un usuario comparte contenido
CREATE TABLE IF NOT EXISTS content_shares (
    id CHAR(32) NOT NULL PRIMARY KEY,
    shareable_content_id CHAR(32) NOT NULL,
    shared_by_user_id CHAR(32) NOT NULL,
    shared_to_platform ENUM('whatsapp', 'facebook', 'twitter', 'instagram', 'telegram', 'email', 'copy_link', 'internal') NOT NULL,
    shared_to_user_id CHAR(32) NULL, -- Para shares internos entre usuarios
    share_message TEXT,              -- Mensaje personalizado al compartir
    ip_address VARCHAR(45),
    user_agent TEXT,
    shared_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    
    FOREIGN KEY (shareable_content_id) REFERENCES shareable_content(id) ON DELETE CASCADE,
    FOREIGN KEY (shared_by_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (shared_to_user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_shareable_content (shareable_content_id),
    INDEX idx_shared_by (shared_by_user_id),
    INDEX idx_shared_to (shared_to_user_id),
    INDEX idx_platform (shared_to_platform),
    INDEX idx_shared_at (shared_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================================
-- TABLA DE VISUALIZACIONES DE CONTENIDO COMPARTIDO
-- ================================================================================

-- Registro de cuando alguien accede a contenido compartido
CREATE TABLE IF NOT EXISTS content_views (
    id CHAR(32) NOT NULL PRIMARY KEY,
    shareable_content_id CHAR(32) NOT NULL,
    viewer_user_id CHAR(32) NULL,    -- NULL si es usuario anónimo
    referrer_share_id CHAR(32) NULL, -- De qué share vino (si aplica)
    ip_address VARCHAR(45),
    user_agent TEXT,
    device_type ENUM('mobile', 'desktop', 'tablet') DEFAULT 'desktop',
    viewed_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    time_spent_seconds INT DEFAULT 0, -- Tiempo que pasó viendo el contenido
    
    FOREIGN KEY (shareable_content_id) REFERENCES shareable_content(id) ON DELETE CASCADE,
    FOREIGN KEY (viewer_user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (referrer_share_id) REFERENCES content_shares(id) ON DELETE SET NULL,
    INDEX idx_shareable_content (shareable_content_id),
    INDEX idx_viewer (viewer_user_id),
    INDEX idx_referrer_share (referrer_share_id),
    INDEX idx_viewed_at (viewed_at),
    INDEX idx_device_type (device_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================================
-- TABLA DE PUBLICACIONES DEL FEED PRINCIPAL
-- ================================================================================

-- Publicaciones del feed principal de la aplicación
CREATE TABLE IF NOT EXISTS feed_posts (
    id CHAR(32) NOT NULL PRIMARY KEY,
    author_id CHAR(32) NOT NULL,
    content TEXT NOT NULL,
    post_type ENUM('text', 'image', 'video', 'link', 'poll', 'event_share') DEFAULT 'text',
    media_urls LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin CHECK (json_valid(media_urls)), -- Array de URLs de medios
    link_url VARCHAR(500),
    link_title VARCHAR(255),
    link_description TEXT,
    link_thumbnail VARCHAR(500),
    poll_options LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin CHECK (json_valid(poll_options)), -- Para polls
    poll_expires_at DATETIME(6) NULL,
    privacy_level ENUM('public', 'friends', 'private') DEFAULT 'public',
    location VARCHAR(255),
    tags LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin CHECK (json_valid(tags)), -- Array de tags
    mentions LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin CHECK (json_valid(mentions)), -- Array de usuarios mencionados
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    shares_count INT DEFAULT 0,
    views_count INT DEFAULT 0,
    is_pinned TINYINT(1) DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_author (author_id),
    INDEX idx_post_type (post_type),
    INDEX idx_privacy (privacy_level),
    INDEX idx_created_at (created_at),
    INDEX idx_likes_count (likes_count),
    INDEX idx_active (is_active),
    INDEX idx_pinned (is_pinned)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================================
-- TABLA DE PUBLICACIONES EN SUBCOMUNIDADES
-- ================================================================================

-- Publicaciones dentro de subcomunidades específicas
CREATE TABLE IF NOT EXISTS community_posts (
    id CHAR(32) NOT NULL PRIMARY KEY,
    community_id CHAR(32) NOT NULL,   -- ID de la subcomunidad
    author_id CHAR(32) NOT NULL,
    title VARCHAR(255),
    content TEXT NOT NULL,
    post_type ENUM('text', 'image', 'video', 'link', 'poll', 'announcement') DEFAULT 'text',
    media_urls LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin CHECK (json_valid(media_urls)),
    link_url VARCHAR(500),
    link_title VARCHAR(255),
    link_description TEXT,
    poll_options LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin CHECK (json_valid(poll_options)),
    poll_expires_at DATETIME(6) NULL,
    is_announcement TINYINT(1) DEFAULT 0, -- Para posts importantes de moderadores
    is_pinned TINYINT(1) DEFAULT 0,
    tags LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin CHECK (json_valid(tags)),
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    shares_count INT DEFAULT 0,
    views_count INT DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    -- FOREIGN KEY (community_id) REFERENCES communities(id) ON DELETE CASCADE, -- Agregar cuando exista la tabla
    INDEX idx_community (community_id),
    INDEX idx_author (author_id),
    INDEX idx_post_type (post_type),
    INDEX idx_created_at (created_at),
    INDEX idx_announcement (is_announcement),
    INDEX idx_pinned (is_pinned),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================================
-- TABLA DE REELS/CLIPS (VIDEOS CORTOS)
-- ================================================================================

-- Videos cortos estilo TikTok/Instagram Reels
CREATE TABLE IF NOT EXISTS reels (
    id CHAR(32) NOT NULL PRIMARY KEY,
    author_id CHAR(32) NOT NULL,
    title VARCHAR(255),
    description TEXT,
    video_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    duration_seconds INT NOT NULL,
    video_width INT,
    video_height INT,
    audio_track_id CHAR(32) NULL,     -- Para música de fondo
    audio_track_name VARCHAR(255),
    effects LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin CHECK (json_valid(effects)), -- Efectos aplicados
    hashtags LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin CHECK (json_valid(hashtags)),
    mentions LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin CHECK (json_valid(mentions)),
    location VARCHAR(255),
    privacy_level ENUM('public', 'friends', 'private') DEFAULT 'public',
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    shares_count INT DEFAULT 0,
    views_count INT DEFAULT 0,
    play_count INT DEFAULT 0,         -- Reproducciones completas
    is_featured TINYINT(1) DEFAULT 0, -- Para destacar en trending
    is_active TINYINT(1) DEFAULT 1,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_author (author_id),
    INDEX idx_privacy (privacy_level),
    INDEX idx_created_at (created_at),
    INDEX idx_likes_count (likes_count),
    INDEX idx_views_count (views_count),
    INDEX idx_featured (is_featured),
    INDEX idx_active (is_active),
    INDEX idx_duration (duration_seconds)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================================
-- TABLA DE ARTÍCULOS DE NOTICIAS (HABIL-NEWS)
-- ================================================================================

-- Artículos de noticias y contenido editorial
CREATE TABLE IF NOT EXISTS news_articles (
    id CHAR(32) NOT NULL PRIMARY KEY,
    author_id CHAR(32) NOT NULL,
    editor_id CHAR(32) NULL,          -- Editor que aprobó el artículo
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(500),
    slug VARCHAR(255) NOT NULL UNIQUE,
    excerpt TEXT,                     -- Resumen corto
    content LONGTEXT NOT NULL,        -- Contenido completo del artículo
    featured_image VARCHAR(500),
    gallery_images LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin CHECK (json_valid(gallery_images)),
    category ENUM('deportes', 'tecnologia', 'cultura', 'educacion', 'salud', 'entretenimiento', 'negocios', 'general') DEFAULT 'general',
    tags LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin CHECK (json_valid(tags)),
    reading_time_minutes INT DEFAULT 5,
    status ENUM('draft', 'review', 'published', 'archived') DEFAULT 'draft',
    published_at DATETIME(6) NULL,
    views_count INT DEFAULT 0,
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    shares_count INT DEFAULT 0,
    is_featured TINYINT(1) DEFAULT 0, -- Para artículos destacados
    is_breaking TINYINT(1) DEFAULT 0, -- Para noticias de última hora
    seo_title VARCHAR(255),
    seo_description TEXT,
    seo_keywords VARCHAR(500),
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (editor_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_author (author_id),
    INDEX idx_editor (editor_id),
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_published_at (published_at),
    INDEX idx_featured (is_featured),
    INDEX idx_breaking (is_breaking),
    INDEX idx_views_count (views_count)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================================
-- TABLA DE TRANSMISIONES EN VIVO
-- ================================================================================

-- Streams/transmisiones en vivo
CREATE TABLE IF NOT EXISTS live_streams (
    id CHAR(32) NOT NULL PRIMARY KEY,
    streamer_id CHAR(32) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    thumbnail_url VARCHAR(500),
    stream_key VARCHAR(255) NOT NULL UNIQUE, -- Clave para el streaming
    rtmp_url VARCHAR(500),            -- URL del servidor RTMP
    hls_url VARCHAR(500),             -- URL para reproducción HLS
    category ENUM('gaming', 'music', 'sports', 'education', 'talk', 'entertainment', 'news', 'other') DEFAULT 'other',
    tags LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin CHECK (json_valid(tags)),
    max_viewers INT DEFAULT 0,        -- Máximo de viewers simultáneos
    current_viewers INT DEFAULT 0,    -- Viewers actuales
    total_views INT DEFAULT 0,        -- Total de visualizaciones
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    shares_count INT DEFAULT 0,
    status ENUM('scheduled', 'live', 'ended', 'cancelled') DEFAULT 'scheduled',
    scheduled_start DATETIME(6),      -- Hora programada de inicio
    actual_start DATETIME(6),         -- Hora real de inicio
    ended_at DATETIME(6),             -- Hora de finalización
    duration_seconds INT DEFAULT 0,   -- Duración total
    is_recorded TINYINT(1) DEFAULT 1, -- Si se guarda la grabación
    recording_url VARCHAR(500),       -- URL de la grabación
    privacy_level ENUM('public', 'unlisted', 'private') DEFAULT 'public',
    chat_enabled TINYINT(1) DEFAULT 1,
    is_featured TINYINT(1) DEFAULT 0,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    
    FOREIGN KEY (streamer_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_streamer (streamer_id),
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_scheduled_start (scheduled_start),
    INDEX idx_actual_start (actual_start),
    INDEX idx_privacy (privacy_level),
    INDEX idx_featured (is_featured),
    INDEX idx_current_viewers (current_viewers)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================================
-- TABLA DE CLASIFICADOS/CONEXIONES
-- ================================================================================

-- Clasificados y anuncios de conexiones profesionales
CREATE TABLE IF NOT EXISTS classifieds (
    id CHAR(32) NOT NULL PRIMARY KEY,
    author_id CHAR(32) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category ENUM('job_offer', 'job_search', 'service_offer', 'service_search', 'product_sale', 'product_buy', 'collaboration', 'networking', 'other') NOT NULL,
    subcategory VARCHAR(100),
    price_type ENUM('free', 'fixed', 'negotiable', 'hourly', 'monthly') DEFAULT 'negotiable',
    price_amount DECIMAL(12,2) NULL,
    currency VARCHAR(3) DEFAULT 'COP',
    location VARCHAR(255),
    contact_method ENUM('platform', 'email', 'phone', 'whatsapp', 'all') DEFAULT 'platform',
    contact_info LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin CHECK (json_valid(contact_info)),
    images LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin CHECK (json_valid(images)),
    tags LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin CHECK (json_valid(tags)),
    requirements TEXT,                -- Requisitos específicos
    benefits TEXT,                    -- Beneficios ofrecidos
    expires_at DATETIME(6),           -- Fecha de expiración
    status ENUM('active', 'paused', 'expired', 'completed', 'cancelled') DEFAULT 'active',
    priority_level ENUM('normal', 'highlighted', 'featured') DEFAULT 'normal',
    views_count INT DEFAULT 0,
    likes_count INT DEFAULT 0,
    responses_count INT DEFAULT 0,    -- Respuestas/contactos recibidos
    shares_count INT DEFAULT 0,
    is_urgent TINYINT(1) DEFAULT 0,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_author (author_id),
    INDEX idx_category (category),
    INDEX idx_subcategory (subcategory),
    INDEX idx_status (status),
    INDEX idx_priority (priority_level),
    INDEX idx_expires_at (expires_at),
    INDEX idx_created_at (created_at),
    INDEX idx_location (location),
    INDEX idx_urgent (is_urgent)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================================
-- TRIGGERS PARA MANTENER CONTADORES ACTUALIZADOS
-- ================================================================================

-- Trigger para actualizar contador de shares en shareable_content
DELIMITER $
CREATE TRIGGER IF NOT EXISTS update_shares_count_insert
    AFTER INSERT ON content_shares
    FOR EACH ROW
BEGIN
    UPDATE shareable_content 
    SET shares_count = shares_count + 1
    WHERE id = NEW.shareable_content_id;
END$

CREATE TRIGGER IF NOT EXISTS update_shares_count_delete
    AFTER DELETE ON content_shares
    FOR EACH ROW
BEGIN
    UPDATE shareable_content 
    SET shares_count = GREATEST(0, shares_count - 1)
    WHERE id = OLD.shareable_content_id;
END$

-- Trigger para actualizar contador de views en shareable_content
CREATE TRIGGER IF NOT EXISTS update_views_count_insert
    AFTER INSERT ON content_views
    FOR EACH ROW
BEGIN
    UPDATE shareable_content 
    SET views_count = views_count + 1
    WHERE id = NEW.shareable_content_id;
END$
DELIMITER ;

-- ================================================================================
-- FUNCIONES AUXILIARES PARA GENERAR URLs DE COMPARTIR
-- ================================================================================

-- Función para generar URL de compartir basada en el tipo de contenido
DELIMITER $
CREATE FUNCTION IF NOT EXISTS generate_share_url(content_type_param VARCHAR(50), content_id_param CHAR(32))
RETURNS VARCHAR(500)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE base_url VARCHAR(200) DEFAULT 'https://habilidosos.com';
    DECLARE share_url VARCHAR(500);
    
    CASE content_type_param
        WHEN 'cultural_event' THEN
            SET share_url = CONCAT(base_url, '/eventos/', content_id_param);
        WHEN 'classified' THEN
            SET share_url = CONCAT(base_url, '/clasificados/', content_id_param);
        WHEN 'feed_post' THEN
            SET share_url = CONCAT(base_url, '/post/', content_id_param);
        WHEN 'community_post' THEN
            SET share_url = CONCAT(base_url, '/comunidad/post/', content_id_param);
        WHEN 'reel' THEN
            SET share_url = CONCAT(base_url, '/reels/', content_id_param);
        WHEN 'news_article' THEN
            SET share_url = CONCAT(base_url, '/noticias/', content_id_param);
        WHEN 'live_stream' THEN
            SET share_url = CONCAT(base_url, '/live/', content_id_param);
        WHEN 'learning_topic' THEN
            SET share_url = CONCAT(base_url, '/aprender/', content_id_param);
        WHEN 'user_profile' THEN
            SET share_url = CONCAT(base_url, '/perfil/', content_id_param);
        WHEN 'enterprise_profile' THEN
            SET share_url = CONCAT(base_url, '/empresa/', content_id_param);
        ELSE
            SET share_url = CONCAT(base_url, '/contenido/', content_id_param);
    END CASE;
    
    RETURN share_url;
END$
DELIMITER ;

-- ================================================================================
-- VERIFICACIÓN DE TABLAS CREADAS
-- ================================================================================

SELECT 'SISTEMA DE CONTENIDO COMPARTIBLE CREADO' as info;

SELECT 
    table_name as 'Tabla Creada',
    table_rows as 'Filas',
    'LISTO' as estado
FROM information_schema.tables 
WHERE table_schema = 'habilidosos_db' 
AND (
    table_name = 'shareable_content' OR
    table_name = 'content_shares' OR
    table_name = 'content_views' OR
    table_name = 'feed_posts' OR
    table_name = 'community_posts' OR
    table_name = 'reels' OR
    table_name = 'news_articles' OR
    table_name = 'live_streams' OR
    table_name = 'classifieds'
)
ORDER BY table_name;

COMMIT;