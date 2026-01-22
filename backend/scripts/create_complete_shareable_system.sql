-- ================================================================================
-- SCRIPT COMPLETO PARA SISTEMA DE CONTENIDO COMPARTIBLE HABILIDOSOS
-- Ejecutar en phpMyAdmin o cliente MySQL
-- ================================================================================

USE habilidosos_db;

-- ================================================================================
-- PARTE 1: SISTEMA DE CONTENIDO COMPARTIBLE
-- ================================================================================

-- Tabla principal que unifica todos los tipos de contenido compartible
CREATE TABLE IF NOT EXISTS shareable_content (
    id CHAR(32) NOT NULL PRIMARY KEY,
    content_type ENUM(
        'cultural_event',
        'classified',
        'feed_post',
        'community_post',
        'reel',
        'news_article',
        'live_stream',
        'learning_topic',
        'user_profile',
        'enterprise_profile'
    ) NOT NULL,
    content_id CHAR(32) NOT NULL,
    author_id CHAR(32) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    thumbnail_url VARCHAR(500),
    share_url VARCHAR(500) NOT NULL,
    is_public TINYINT(1) DEFAULT 1,
    is_active TINYINT(1) DEFAULT 1,
    shares_count INT DEFAULT 0,
    views_count INT DEFAULT 0,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_content_type_id (content_type, content_id),
    INDEX idx_content_type (content_type),
    INDEX idx_author (author_id),
    INDEX idx_public_active (is_public, is_active),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Registro de cuando un usuario comparte contenido
CREATE TABLE IF NOT EXISTS content_shares (
    id CHAR(32) NOT NULL PRIMARY KEY,
    shareable_content_id CHAR(32) NOT NULL,
    shared_by_user_id CHAR(32) NOT NULL,
    shared_to_platform ENUM('whatsapp', 'facebook', 'twitter', 'instagram', 'telegram', 'email', 'copy_link', 'internal') NOT NULL,
    shared_to_user_id CHAR(32) NULL,
    share_message TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    shared_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    
    FOREIGN KEY (shareable_content_id) REFERENCES shareable_content(id) ON DELETE CASCADE,
    FOREIGN KEY (shared_by_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (shared_to_user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_shareable_content (shareable_content_id),
    INDEX idx_shared_by (shared_by_user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Registro de visualizaciones de contenido compartido
CREATE TABLE IF NOT EXISTS content_views (
    id CHAR(32) NOT NULL PRIMARY KEY,
    shareable_content_id CHAR(32) NOT NULL,
    viewer_user_id CHAR(32) NULL,
    referrer_share_id CHAR(32) NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    device_type ENUM('mobile', 'desktop', 'tablet') DEFAULT 'desktop',
    viewed_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    time_spent_seconds INT DEFAULT 0,
    
    FOREIGN KEY (shareable_content_id) REFERENCES shareable_content(id) ON DELETE CASCADE,
    FOREIGN KEY (viewer_user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_shareable_content (shareable_content_id),
    INDEX idx_viewer (viewer_user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Publicaciones del feed principal
CREATE TABLE IF NOT EXISTS feed_posts (
    id CHAR(32) NOT NULL PRIMARY KEY,
    author_id CHAR(32) NOT NULL,
    content TEXT NOT NULL,
    post_type ENUM('text', 'image', 'video', 'link', 'poll', 'event_share') DEFAULT 'text',
    media_urls LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin CHECK (json_valid(media_urls)),
    link_url VARCHAR(500),
    privacy_level ENUM('public', 'friends', 'private') DEFAULT 'public',
    location VARCHAR(255),
    tags LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin CHECK (json_valid(tags)),
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    shares_count INT DEFAULT 0,
    views_count INT DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_author (author_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Videos cortos estilo TikTok/Instagram Reels
CREATE TABLE IF NOT EXISTS reels (
    id CHAR(32) NOT NULL PRIMARY KEY,
    author_id CHAR(32) NOT NULL,
    title VARCHAR(255),
    description TEXT,
    video_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    duration_seconds INT NOT NULL,
    hashtags LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin CHECK (json_valid(hashtags)),
    privacy_level ENUM('public', 'friends', 'private') DEFAULT 'public',
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    shares_count INT DEFAULT 0,
    views_count INT DEFAULT 0,
    play_count INT DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_author (author_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Artículos de noticias
CREATE TABLE IF NOT EXISTS news_articles (
    id CHAR(32) NOT NULL PRIMARY KEY,
    author_id CHAR(32) NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    excerpt TEXT,
    content LONGTEXT NOT NULL,
    featured_image VARCHAR(500),
    category ENUM('deportes', 'tecnologia', 'cultura', 'educacion', 'salud', 'entretenimiento', 'negocios', 'general') DEFAULT 'general',
    status ENUM('draft', 'review', 'published', 'archived') DEFAULT 'draft',
    published_at DATETIME(6) NULL,
    views_count INT DEFAULT 0,
    likes_count INT DEFAULT 0,
    shares_count INT DEFAULT 0,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_author (author_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Transmisiones en vivo
CREATE TABLE IF NOT EXISTS live_streams (
    id CHAR(32) NOT NULL PRIMARY KEY,
    streamer_id CHAR(32) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    stream_key VARCHAR(255) NOT NULL UNIQUE,
    category ENUM('gaming', 'music', 'sports', 'education', 'talk', 'entertainment', 'news', 'other') DEFAULT 'other',
    max_viewers INT DEFAULT 0,
    current_viewers INT DEFAULT 0,
    total_views INT DEFAULT 0,
    status ENUM('scheduled', 'live', 'ended', 'cancelled') DEFAULT 'scheduled',
    scheduled_start DATETIME(6),
    actual_start DATETIME(6),
    ended_at DATETIME(6),
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    
    FOREIGN KEY (streamer_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_streamer (streamer_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Clasificados y anuncios
CREATE TABLE IF NOT EXISTS classifieds (
    id CHAR(32) NOT NULL PRIMARY KEY,
    author_id CHAR(32) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category ENUM('job_offer', 'job_search', 'service_offer', 'service_search', 'product_sale', 'product_buy', 'collaboration', 'networking', 'other') NOT NULL,
    price_type ENUM('free', 'fixed', 'negotiable', 'hourly', 'monthly') DEFAULT 'negotiable',
    location VARCHAR(255),
    status ENUM('active', 'paused', 'expired', 'completed', 'cancelled') DEFAULT 'active',
    views_count INT DEFAULT 0,
    likes_count INT DEFAULT 0,
    shares_count INT DEFAULT 0,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_author (author_id),
    INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================================
-- PARTE 2: EVENTOS CULTURALES
-- ================================================================================

-- Categorías de eventos culturales
CREATE TABLE IF NOT EXISTS cultural_event_categories (
    id CHAR(32) NOT NULL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(50) NOT NULL DEFAULT 'CalendarDays',
    color_class VARCHAR(100) NOT NULL DEFAULT 'bg-purple-500/20 text-purple-400 border-purple-400/30',
    description TEXT,
    is_active TINYINT(1) DEFAULT 1,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Eventos culturales principales
CREATE TABLE IF NOT EXISTS cultural_events (
    id CHAR(32) NOT NULL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    category_id CHAR(32) NOT NULL,
    organizer_id CHAR(32) NOT NULL,
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
    
    INDEX idx_event_date (event_date),
    INDEX idx_organizer (organizer_id),
    INDEX idx_category (category_id),
    CONSTRAINT fk_cultural_events_category FOREIGN KEY (category_id) REFERENCES cultural_event_categories(id) ON DELETE CASCADE,
    CONSTRAINT fk_cultural_events_organizer FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================================
-- PARTE 3: LEARNING SYSTEM
-- ================================================================================

-- Secciones de aprendizaje
CREATE TABLE IF NOT EXISTS learning_seccion (
    id CHAR(32) NOT NULL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    descripcion TEXT,
    icono VARCHAR(50) DEFAULT 'BookOpen',
    color VARCHAR(7) DEFAULT '#00ff88',
    orden INT DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Temas de aprendizaje
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
    imagen_url VARCHAR(500),
    video_url VARCHAR(500),
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    
    FOREIGN KEY (seccion_id) REFERENCES learning_seccion(id) ON DELETE CASCADE,
    INDEX idx_seccion (seccion_id),
    INDEX idx_orden (orden)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================================
-- PARTE 4: USER ANALYTICS
-- ================================================================================

-- Sesiones de usuario
CREATE TABLE IF NOT EXISTS analytics_usersession (
    id CHAR(32) NOT NULL PRIMARY KEY,
    usuario_id CHAR(32) NOT NULL,
    fecha_inicio DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    fecha_fin DATETIME(6) NULL,
    duracion_minutos INT DEFAULT 0,
    dispositivo ENUM('mobile', 'desktop', 'tablet') DEFAULT 'desktop',
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    
    FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_usuario (usuario_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Preferencias de usuario
CREATE TABLE IF NOT EXISTS analytics_userpreferences (
    id CHAR(32) NOT NULL PRIMARY KEY,
    usuario_id CHAR(32) NOT NULL,
    categoria_interes VARCHAR(100) NOT NULL,
    nivel_interes INT DEFAULT 5,
    tiempo_dedicado INT DEFAULT 0,
    
    FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_usuario_categoria (usuario_id, categoria_interes)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================================
-- PARTE 5: DATOS DE PRUEBA
-- ================================================================================

-- Insertar categorías de eventos
INSERT INTO cultural_event_categories (id, name, slug, icon, color_class, description) VALUES
('a1b2c3d4e5f6789012345678901234ab', 'Música', 'musica', 'Music', 'bg-blue-500/20 text-blue-400 border-blue-400/30', 'Conciertos, festivales, recitales y eventos musicales'),
('b2c3d4e5f6789012345678901234abc1', 'Arte', 'arte', 'Palette', 'bg-purple-500/20 text-purple-400 border-purple-400/30', 'Exposiciones, galerías, muestras artísticas'),
('c3d4e5f6789012345678901234abc12d', 'Teatro', 'teatro', 'Theater', 'bg-red-500/20 text-red-400 border-red-400/30', 'Obras teatrales, performances, monólogos')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Insertar secciones de learning
INSERT INTO learning_seccion (id, nombre, slug, descripcion, orden) VALUES
('sec1234567890123456789012345678ab', 'Fundamentos del Fútbol', 'fundamentos-futbol', 'Aprende los conceptos básicos del fútbol', 1),
('sec234567890123456789012345678abc', 'Técnicas Avanzadas', 'tecnicas-avanzadas', 'Perfecciona tu técnica con ejercicios avanzados', 2)
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);

-- Insertar temas de learning
INSERT INTO learning_tema (id, seccion_id, titulo, slug, descripcion, orden) VALUES
('tema123456789012345678901234567ab', 'sec1234567890123456789012345678ab', 'Historia del Fútbol', 'historia-futbol', 'Conoce los orígenes del fútbol mundial', 1),
('tema23456789012345678901234567abc', 'sec1234567890123456789012345678ab', 'Reglas Básicas', 'reglas-basicas', 'Aprende las reglas fundamentales', 2)
ON DUPLICATE KEY UPDATE titulo = VALUES(titulo);

-- Insertar eventos culturales
INSERT INTO cultural_events (id, title, slug, description, category_id, organizer_id, event_date, start_time, location, price) VALUES
('event123456789012345678901234567ab', 'Festival de Música Urbana 2026', 'festival-musica-urbana-2026', 'Un increíble festival de música urbana', 'a1b2c3d4e5f6789012345678901234ab', 'bd22ec1c4dbe48f3a018e96b2cd61304', '2026-02-15', '19:00:00', 'Parque Simón Bolívar', 'Desde $50.000'),
('event23456789012345678901234567abc', 'Exposición de Arte Contemporáneo', 'exposicion-arte-contemporaneo', 'Muestra de arte contemporáneo', 'b2c3d4e5f6789012345678901234abc1', '4265f3cd6c7a493b9e35efbacd3b3a6b', '2026-02-20', '10:00:00', 'Museo Nacional', 'Gratis')
ON DUPLICATE KEY UPDATE title = VALUES(title);

-- Insertar publicaciones del feed
INSERT INTO feed_posts (id, author_id, content, post_type, likes_count, views_count) VALUES
('post123456789012345678901234567ab', 'bd22ec1c4dbe48f3a018e96b2cd61304', '¡Increíble entrenamiento de hoy! 💪 #Fútbol #Entrenamiento', 'text', 15, 45),
('post23456789012345678901234567abc', '4265f3cd6c7a493b9e35efbacd3b3a6b', 'Compartiendo fotos del último partido ⚽', 'image', 28, 89)
ON DUPLICATE KEY UPDATE content = VALUES(content);

-- Insertar reels
INSERT INTO reels (id, author_id, title, description, video_url, duration_seconds, likes_count, views_count) VALUES
('reel123456789012345678901234567ab', 'bd22ec1c4dbe48f3a018e96b2cd61304', 'Técnica de Control', 'Aprende esta técnica básica', 'https://example.com/video1.mp4', 45, 156, 1240),
('reel23456789012345678901234567abc', '4265f3cd6c7a493b9e35efbacd3b3a6b', 'Gol Espectacular', 'No vas a creer este gol', 'https://example.com/video2.mp4', 30, 89, 567)
ON DUPLICATE KEY UPDATE title = VALUES(title);

-- Insertar artículos de noticias
INSERT INTO news_articles (id, author_id, title, slug, content, status, published_at, views_count) VALUES
('news123456789012345678901234567ab', 'bd22ec1c4dbe48f3a018e96b2cd61304', 'La Revolución del Fútbol Digital', 'revolucion-futbol-digital', 'El fútbol está experimentando una revolución digital...', 'published', '2026-01-15 10:00:00', 234)
ON DUPLICATE KEY UPDATE title = VALUES(title);

-- Insertar clasificados
INSERT INTO classifieds (id, author_id, title, description, category, location, views_count) VALUES
('clas123456789012345678901234567ab', 'bd22ec1c4dbe48f3a018e96b2cd61304', 'Busco Compañero de Entrenamiento', 'Busco alguien para entrenar fútbol los fines de semana', 'collaboration', 'Bogotá, Colombia', 67)
ON DUPLICATE KEY UPDATE title = VALUES(title);

-- ================================================================================
-- PARTE 6: CREAR ENTRADAS EN SHAREABLE_CONTENT
-- ================================================================================

-- Crear entradas compartibles para eventos
INSERT INTO shareable_content (id, content_type, content_id, author_id, title, description, share_url, is_public, is_active) VALUES
('event123456789012345678901234567ab', 'cultural_event', 'event123456789012345678901234567ab', 'bd22ec1c4dbe48f3a018e96b2cd61304', 'Festival de Música Urbana 2026', 'Un increíble festival de música urbana', 'https://habilidosos.com/eventos/event123456789012345678901234567ab', 1, 1),
('event23456789012345678901234567abc', 'cultural_event', 'event23456789012345678901234567abc', '4265f3cd6c7a493b9e35efbacd3b3a6b', 'Exposición de Arte Contemporáneo', 'Muestra de arte contemporáneo', 'https://habilidosos.com/eventos/event23456789012345678901234567abc', 1, 1)
ON DUPLICATE KEY UPDATE title = VALUES(title);

-- Crear entradas compartibles para posts
INSERT INTO shareable_content (id, content_type, content_id, author_id, title, description, share_url, is_public, is_active) VALUES
('share_post123456789012345678901234ab', 'feed_post', 'post123456789012345678901234567ab', 'bd22ec1c4dbe48f3a018e96b2cd61304', 'Entrenamiento de Fútbol', '¡Increíble entrenamiento de hoy!', 'https://habilidosos.com/post/post123456789012345678901234567ab', 1, 1),
('share_post23456789012345678901234abc', 'feed_post', 'post23456789012345678901234567abc', '4265f3cd6c7a493b9e35efbacd3b3a6b', 'Fotos del Partido', 'Compartiendo fotos del último partido', 'https://habilidosos.com/post/post23456789012345678901234567abc', 1, 1)
ON DUPLICATE KEY UPDATE title = VALUES(title);

-- Crear entradas compartibles para reels
INSERT INTO shareable_content (id, content_type, content_id, author_id, title, description, share_url, is_public, is_active) VALUES
('share_reel123456789012345678901234ab', 'reel', 'reel123456789012345678901234567ab', 'bd22ec1c4dbe48f3a018e96b2cd61304', 'Técnica de Control', 'Aprende esta técnica básica', 'https://habilidosos.com/reels/reel123456789012345678901234567ab', 1, 1),
('share_reel23456789012345678901234abc', 'reel', 'reel23456789012345678901234567abc', '4265f3cd6c7a493b9e35efbacd3b3a6b', 'Gol Espectacular', 'No vas a creer este gol', 'https://habilidosos.com/reels/reel23456789012345678901234567abc', 1, 1)
ON DUPLICATE KEY UPDATE title = VALUES(title);

-- ================================================================================
-- VERIFICACIÓN FINAL
-- ================================================================================

SELECT 'INSTALACION COMPLETADA' as status;

SELECT 
    'Verificacion del Sistema' as info,
    (SELECT COUNT(*) FROM shareable_content) as contenido_compartible,
    (SELECT COUNT(*) FROM cultural_events) as eventos,
    (SELECT COUNT(*) FROM feed_posts) as posts,
    (SELECT COUNT(*) FROM reels) as reels,
    (SELECT COUNT(*) FROM news_articles) as noticias,
    (SELECT COUNT(*) FROM classifieds) as clasificados,
    (SELECT COUNT(*) FROM learning_tema) as temas_learning;

SELECT 'Sistema de contenido compartible creado exitosamente!' as mensaje;