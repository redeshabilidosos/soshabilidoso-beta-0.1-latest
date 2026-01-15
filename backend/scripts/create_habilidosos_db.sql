-- ============================================
-- Script SQL para crear la base de datos completa de SOS-HABILIDOSO
-- Base de datos: habilidosos_db
-- Motor: MySQL 8.0+
-- ============================================

-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS habilidosos_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE habilidosos_db;

-- ============================================
-- TABLA: usuarios (users)
-- Almacena información de usuarios del sistema
-- ============================================
CREATE TABLE IF NOT EXISTS usuarios (
    id CHAR(36) PRIMARY KEY,
    username VARCHAR(30) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    first_name VARCHAR(150),
    last_name VARCHAR(150),
    
    -- Perfil
    avatar VARCHAR(500),
    cover_photo VARCHAR(500),
    bio TEXT,
    
    -- Información deportiva/habilidades
    position VARCHAR(100),
    team VARCHAR(100),
    interests JSON,
    social_links JSON,
    
    -- Contacto
    contact_number VARCHAR(20),
    
    -- Privacidad
    is_private BOOLEAN DEFAULT FALSE,
    show_email BOOLEAN DEFAULT FALSE,
    show_phone BOOLEAN DEFAULT FALSE,
    
    -- Estado
    is_active BOOLEAN DEFAULT TRUE,
    is_staff BOOLEAN DEFAULT FALSE,
    is_superuser BOOLEAN DEFAULT FALSE,
    email_verified BOOLEAN DEFAULT FALSE,
    
    -- Fechas
    date_joined DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: participantes (Reality Show 2026)
-- Almacena participantes del reality "Un Golazo A Tus Sueños"
-- ============================================
CREATE TABLE IF NOT EXISTS participantes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- Información personal
    nombre_completo VARCHAR(200) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    edad INT NOT NULL,
    genero ENUM('masculino', 'femenino', 'otro') NOT NULL,
    documento_identidad VARCHAR(50) UNIQUE NOT NULL,
    
    -- Contacto
    email VARCHAR(255) UNIQUE NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    telefono_emergencia VARCHAR(20),
    
    -- Ubicación
    ciudad VARCHAR(100) NOT NULL,
    departamento VARCHAR(100) NOT NULL,
    direccion TEXT,
    
    -- Información deportiva
    posicion_futbol VARCHAR(50) NOT NULL,
    equipo_actual VARCHAR(100),
    anos_experiencia INT,
    logros_deportivos TEXT,
    
    -- Archivos
    foto_perfil VARCHAR(500),
    video_presentacion VARCHAR(500),
    documento_identidad_archivo VARCHAR(500),
    
    -- Estado de la solicitud
    estado ENUM('pendiente', 'en_revision', 'aprobado', 'rechazado', 'finalista') DEFAULT 'pendiente',
    notas_evaluacion TEXT,
    puntaje_evaluacion DECIMAL(5,2),
    
    -- Fechas
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_estado (estado),
    INDEX idx_email (email),
    INDEX idx_ciudad (ciudad)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: publicaciones (posts)
-- Almacena todas las publicaciones de usuarios
-- ============================================
CREATE TABLE IF NOT EXISTS publicaciones (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    
    -- Contenido
    content TEXT NOT NULL,
    post_type ENUM('text', 'image', 'video', 'highlight', 'podcast', 'streaming') DEFAULT 'text',
    category ENUM('football', 'general_sport', 'culture', 'music', 'dance', 'education', 'gaming', 'food', 'other'),
    
    -- Multimedia
    images JSON,
    video VARCHAR(500),
    thumbnail VARCHAR(500),
    podcast_url VARCHAR(500),
    streaming_url VARCHAR(500),
    
    -- Ubicación
    location VARCHAR(200),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Configuración
    is_pinned BOOLEAN DEFAULT FALSE,
    allow_comments BOOLEAN DEFAULT TRUE,
    is_public BOOLEAN DEFAULT TRUE,
    
    -- Estadísticas
    views_count INT DEFAULT 0,
    shares_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    reactions_count INT DEFAULT 0,
    
    -- Fechas
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_post_type (post_type),
    INDEX idx_category (category),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: reacciones_publicaciones (post_reactions)
-- Almacena reacciones a publicaciones (likes, celebraciones, golazos)
-- ============================================
CREATE TABLE IF NOT EXISTS reacciones_publicaciones (
    id CHAR(36) PRIMARY KEY,
    post_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    reaction_type ENUM('like', 'celebration', 'golazo', 'love', 'fire') NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (post_id) REFERENCES publicaciones(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_post_reaction (user_id, post_id),
    INDEX idx_post_id (post_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: comentarios (comments)
-- Almacena comentarios en publicaciones
-- ============================================
CREATE TABLE IF NOT EXISTS comentarios (
    id CHAR(36) PRIMARY KEY,
    post_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    parent_id CHAR(36),
    content TEXT NOT NULL,
    likes_count INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (post_id) REFERENCES publicaciones(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES comentarios(id) ON DELETE CASCADE,
    INDEX idx_post_id (post_id),
    INDEX idx_user_id (user_id),
    INDEX idx_parent_id (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: comunidades (communities)
-- Almacena comunidades creadas por usuarios
-- ============================================
CREATE TABLE IF NOT EXISTS comunidades (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    category ENUM('deportes', 'musica', 'arte', 'gaming', 'tecnologia', 'lifestyle', 'educacion', 'negocios', 'salud', 'viajes') NOT NULL,
    type ENUM('public', 'private', 'page') DEFAULT 'public',
    
    -- Propietario
    owner_id CHAR(36) NOT NULL,
    
    -- Imágenes
    profile_image VARCHAR(500),
    cover_image VARCHAR(500),
    
    -- Configuración
    is_active BOOLEAN DEFAULT TRUE,
    allow_posts BOOLEAN DEFAULT TRUE,
    require_approval BOOLEAN DEFAULT FALSE,
    
    -- Estadísticas
    members_count INT DEFAULT 0,
    posts_count INT DEFAULT 0,
    
    -- Fechas
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (owner_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_owner_id (owner_id),
    INDEX idx_slug (slug),
    INDEX idx_category (category),
    INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: miembros_comunidad (community_membership)
-- Relación entre usuarios y comunidades
-- ============================================
CREATE TABLE IF NOT EXISTS miembros_comunidad (
    id CHAR(36) PRIMARY KEY,
    community_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    role ENUM('member', 'moderator', 'admin') DEFAULT 'member',
    status ENUM('active', 'banned', 'pending') DEFAULT 'active',
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (community_id) REFERENCES comunidades(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE KEY unique_community_user (community_id, user_id),
    INDEX idx_community_id (community_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: publicaciones_comunidad (community_posts)
-- Publicaciones dentro de comunidades
-- ============================================
CREATE TABLE IF NOT EXISTS publicaciones_comunidad (
    id CHAR(36) PRIMARY KEY,
    community_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    post_type ENUM('text', 'image', 'video', 'poll', 'event') DEFAULT 'text',
    content TEXT NOT NULL,
    
    -- Multimedia
    images JSON,
    video VARCHAR(500),
    
    -- Configuración
    is_pinned BOOLEAN DEFAULT FALSE,
    allow_comments BOOLEAN DEFAULT TRUE,
    
    -- Estadísticas
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    
    -- Fechas
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (community_id) REFERENCES comunidades(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_community_id (community_id),
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: clasificados (classifieds)
-- Anuncios clasificados de usuarios
-- ============================================
CREATE TABLE IF NOT EXISTS clasificados (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category ENUM('venta', 'compra', 'servicio', 'empleo', 'inmuebles', 'vehiculos', 'otros') NOT NULL,
    
    -- Precio
    price DECIMAL(12, 2),
    currency VARCHAR(10) DEFAULT 'COP',
    is_negotiable BOOLEAN DEFAULT TRUE,
    
    -- Ubicación
    location VARCHAR(200),
    city VARCHAR(100),
    department VARCHAR(100),
    
    -- Multimedia
    images JSON,
    
    -- Contacto
    contact_name VARCHAR(100),
    contact_phone VARCHAR(20),
    contact_email VARCHAR(255),
    
    -- Estado
    status ENUM('active', 'sold', 'expired', 'deleted') DEFAULT 'active',
    views_count INT DEFAULT 0,
    
    -- Fechas
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    expires_at DATETIME,
    
    FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_city (city)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: habil_news (noticias)
-- Noticias y artículos publicados
-- ============================================
CREATE TABLE IF NOT EXISTS habil_news (
    id CHAR(36) PRIMARY KEY,
    author_id CHAR(36) NOT NULL,
    title VARCHAR(300) NOT NULL,
    slug VARCHAR(350) UNIQUE NOT NULL,
    content LONGTEXT NOT NULL,
    excerpt TEXT,
    
    -- Categoría
    category ENUM('deportes', 'cultura', 'tecnologia', 'entretenimiento', 'educacion', 'salud', 'negocios', 'otros') NOT NULL,
    tags JSON,
    
    -- Multimedia
    featured_image VARCHAR(500),
    images JSON,
    video_url VARCHAR(500),
    
    -- Estado
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT FALSE,
    
    -- Estadísticas
    views_count INT DEFAULT 0,
    likes_count INT DEFAULT 0,
    shares_count INT DEFAULT 0,
    
    -- SEO
    meta_description TEXT,
    meta_keywords VARCHAR(500),
    
    -- Fechas
    published_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (author_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_author_id (author_id),
    INDEX idx_slug (slug),
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_published_at (published_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: seguidores (follows)
-- Relación de seguimiento entre usuarios
-- ============================================
CREATE TABLE IF NOT EXISTS seguidores (
    id CHAR(36) PRIMARY KEY,
    follower_id CHAR(36) NOT NULL,
    following_id CHAR(36) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (follower_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (following_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE KEY unique_follow (follower_id, following_id),
    INDEX idx_follower_id (follower_id),
    INDEX idx_following_id (following_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: solicitudes_amistad (friend_requests)
-- Solicitudes de amistad entre usuarios
-- ============================================
CREATE TABLE IF NOT EXISTS solicitudes_amistad (
    id CHAR(36) PRIMARY KEY,
    from_user_id CHAR(36) NOT NULL,
    to_user_id CHAR(36) NOT NULL,
    status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (from_user_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (to_user_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE KEY unique_friend_request (from_user_id, to_user_id),
    INDEX idx_from_user_id (from_user_id),
    INDEX idx_to_user_id (to_user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: amistades (friendships)
-- Amistades confirmadas entre usuarios
-- ============================================
CREATE TABLE IF NOT EXISTS amistades (
    id CHAR(36) PRIMARY KEY,
    user1_id CHAR(36) NOT NULL,
    user2_id CHAR(36) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user1_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (user2_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_user1_id (user1_id),
    INDEX idx_user2_id (user2_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: salas_chat (chat_rooms)
-- Salas de chat entre usuarios
-- ============================================
CREATE TABLE IF NOT EXISTS salas_chat (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(200),
    is_group BOOLEAN DEFAULT FALSE,
    created_by_id CHAR(36) NOT NULL,
    avatar VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (created_by_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_created_by_id (created_by_id),
    INDEX idx_is_group (is_group)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: participantes_chat (chat_participants)
-- Participantes de salas de chat
-- ============================================
CREATE TABLE IF NOT EXISTS participantes_chat (
    id CHAR(36) PRIMARY KEY,
    room_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    role ENUM('admin', 'member') DEFAULT 'member',
    is_muted BOOLEAN DEFAULT FALSE,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_read_at DATETIME,
    
    FOREIGN KEY (room_id) REFERENCES salas_chat(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE KEY unique_room_user (room_id, user_id),
    INDEX idx_room_id (room_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: mensajes (messages)
-- Mensajes en salas de chat
-- ============================================
CREATE TABLE IF NOT EXISTS mensajes (
    id CHAR(36) PRIMARY KEY,
    room_id CHAR(36) NOT NULL,
    sender_id CHAR(36) NOT NULL,
    content TEXT NOT NULL,
    message_type ENUM('text', 'image', 'video', 'audio', 'file') DEFAULT 'text',
    
    -- Multimedia
    file_url VARCHAR(500),
    file_name VARCHAR(255),
    file_size INT,
    
    -- Estado
    is_edited BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    
    -- Fechas
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (room_id) REFERENCES salas_chat(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_room_id (room_id),
    INDEX idx_sender_id (sender_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: notificaciones (notifications)
-- Notificaciones para usuarios
-- ============================================
CREATE TABLE IF NOT EXISTS notificaciones (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    type ENUM('like', 'comment', 'follow', 'friend_request', 'mention', 'community_invite', 'message', 'other') NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    
    -- Referencia al objeto relacionado
    related_id CHAR(36),
    related_type VARCHAR(50),
    
    -- Estado
    is_read BOOLEAN DEFAULT FALSE,
    
    -- Fechas
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: archivos_multimedia (media_files)
-- Almacenamiento de archivos multimedia
-- ============================================
CREATE TABLE IF NOT EXISTS archivos_multimedia (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    file_type ENUM('image', 'video', 'audio', 'document') NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size INT,
    mime_type VARCHAR(100),
    
    -- Metadatos
    width INT,
    height INT,
    duration INT,
    
    -- Cloudinary
    cloudinary_public_id VARCHAR(255),
    cloudinary_url VARCHAR(500),
    
    -- Fechas
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_file_type (file_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: guardados (bookmarks)
-- Publicaciones guardadas por usuarios
-- ============================================
CREATE TABLE IF NOT EXISTS guardados (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    post_id CHAR(36) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES publicaciones(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_post_bookmark (user_id, post_id),
    INDEX idx_user_id (user_id),
    INDEX idx_post_id (post_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: reportes (reports)
-- Reportes de contenido inapropiado
-- ============================================
CREATE TABLE IF NOT EXISTS reportes (
    id CHAR(36) PRIMARY KEY,
    reporter_id CHAR(36) NOT NULL,
    reported_type ENUM('post', 'comment', 'user', 'community', 'classified', 'news') NOT NULL,
    reported_id CHAR(36) NOT NULL,
    reason ENUM('spam', 'harassment', 'inappropriate', 'violence', 'hate_speech', 'other') NOT NULL,
    description TEXT,
    status ENUM('pending', 'reviewing', 'resolved', 'dismissed') DEFAULT 'pending',
    
    -- Resolución
    resolved_by_id CHAR(36),
    resolution_notes TEXT,
    resolved_at DATETIME,
    
    -- Fechas
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (reporter_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (resolved_by_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    INDEX idx_reporter_id (reporter_id),
    INDEX idx_reported_type (reported_type),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: streaming_sessions (sesiones de streaming)
-- Sesiones de transmisión en vivo
-- ============================================
CREATE TABLE IF NOT EXISTS streaming_sessions (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category ENUM('football', 'music', 'gaming', 'education', 'other') NOT NULL,
    
    -- URLs
    stream_url VARCHAR(500),
    stream_key VARCHAR(255),
    
    -- Estado
    status ENUM('scheduled', 'live', 'ended', 'cancelled') DEFAULT 'scheduled',
    
    -- Estadísticas
    viewers_count INT DEFAULT 0,
    max_viewers INT DEFAULT 0,
    
    -- Fechas
    scheduled_at DATETIME,
    started_at DATETIME,
    ended_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_scheduled_at (scheduled_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: eventos (events)
-- Eventos creados por usuarios o comunidades
-- ============================================
CREATE TABLE IF NOT EXISTS eventos (
    id CHAR(36) PRIMARY KEY,
    creator_id CHAR(36) NOT NULL,
    community_id CHAR(36),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    
    -- Ubicación
    location VARCHAR(200),
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Multimedia
    cover_image VARCHAR(500),
    
    -- Configuración
    is_online BOOLEAN DEFAULT FALSE,
    online_url VARCHAR(500),
    max_attendees INT,
    
    -- Estado
    status ENUM('draft', 'published', 'cancelled', 'completed') DEFAULT 'draft',
    
    -- Estadísticas
    attendees_count INT DEFAULT 0,
    
    -- Fechas
    event_date DATETIME NOT NULL,
    event_end_date DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (creator_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (community_id) REFERENCES comunidades(id) ON DELETE CASCADE,
    INDEX idx_creator_id (creator_id),
    INDEX idx_community_id (community_id),
    INDEX idx_event_date (event_date),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: asistentes_eventos (event_attendees)
-- Asistentes a eventos
-- ============================================
CREATE TABLE IF NOT EXISTS asistentes_eventos (
    id CHAR(36) PRIMARY KEY,
    event_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    status ENUM('going', 'interested', 'not_going') DEFAULT 'going',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (event_id) REFERENCES eventos(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE KEY unique_event_user (event_id, user_id),
    INDEX idx_event_id (event_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- VISTAS ÚTILES
-- ============================================

-- Vista de estadísticas de usuarios
CREATE OR REPLACE VIEW vista_estadisticas_usuarios AS
SELECT 
    u.id,
    u.username,
    u.display_name,
    COUNT(DISTINCT p.id) as total_publicaciones,
    COUNT(DISTINCT f1.id) as total_seguidores,
    COUNT(DISTINCT f2.id) as total_siguiendo,
    COUNT(DISTINCT cm.id) as total_comunidades
FROM usuarios u
LEFT JOIN publicaciones p ON u.id = p.user_id
LEFT JOIN seguidores f1 ON u.id = f1.following_id
LEFT JOIN seguidores f2 ON u.id = f2.follower_id
LEFT JOIN miembros_comunidad cm ON u.id = cm.user_id
GROUP BY u.id, u.username, u.display_name;

-- Vista de publicaciones populares
CREATE OR REPLACE VIEW vista_publicaciones_populares AS
SELECT 
    p.id,
    p.content,
    p.post_type,
    u.username,
    u.display_name,
    p.reactions_count,
    p.comments_count,
    p.shares_count,
    p.views_count,
    p.created_at
FROM publicaciones p
JOIN usuarios u ON p.user_id = u.id
WHERE p.is_public = TRUE
ORDER BY (p.reactions_count + p.comments_count + p.shares_count) DESC;

-- ============================================
-- PROCEDIMIENTOS ALMACENADOS
-- ============================================

-- Procedimiento para seguir a un usuario
DELIMITER //
CREATE PROCEDURE sp_seguir_usuario(
    IN p_follower_id CHAR(36),
    IN p_following_id CHAR(36)
)
BEGIN
    DECLARE v_follow_id CHAR(36);
    SET v_follow_id = UUID();
    
    INSERT INTO seguidores (id, follower_id, following_id)
    VALUES (v_follow_id, p_follower_id, p_following_id)
    ON DUPLICATE KEY UPDATE created_at = created_at;
    
    -- Crear notificación
    INSERT INTO notificaciones (id, user_id, type, title, message, related_id, related_type)
    VALUES (
        UUID(),
        p_following_id,
        'follow',
        'Nuevo seguidor',
        'Alguien comenzó a seguirte',
        p_follower_id,
        'user'
    );
END //
DELIMITER ;

-- Procedimiento para crear una publicación
DELIMITER //
CREATE PROCEDURE sp_crear_publicacion(
    IN p_id CHAR(36),
    IN p_user_id CHAR(36),
    IN p_content TEXT,
    IN p_post_type VARCHAR(20),
    IN p_images JSON
)
BEGIN
    INSERT INTO publicaciones (id, user_id, content, post_type, images)
    VALUES (p_id, p_user_id, p_content, p_post_type, p_images);
    
    SELECT * FROM publicaciones WHERE id = p_id;
END //
DELIMITER ;

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger para actualizar contador de reacciones
DELIMITER //
CREATE TRIGGER tr_actualizar_reacciones_post
AFTER INSERT ON reacciones_publicaciones
FOR EACH ROW
BEGIN
    UPDATE publicaciones 
    SET reactions_count = reactions_count + 1
    WHERE id = NEW.post_id;
END //
DELIMITER ;

-- Trigger para decrementar contador de reacciones
DELIMITER //
CREATE TRIGGER tr_decrementar_reacciones_post
AFTER DELETE ON reacciones_publicaciones
FOR EACH ROW
BEGIN
    UPDATE publicaciones 
    SET reactions_count = reactions_count - 1
    WHERE id = OLD.post_id;
END //
DELIMITER ;

-- Trigger para actualizar contador de comentarios
DELIMITER //
CREATE TRIGGER tr_actualizar_comentarios_post
AFTER INSERT ON comentarios
FOR EACH ROW
BEGIN
    UPDATE publicaciones 
    SET comments_count = comments_count + 1
    WHERE id = NEW.post_id;
END //
DELIMITER ;

-- Trigger para actualizar contador de miembros en comunidad
DELIMITER //
CREATE TRIGGER tr_actualizar_miembros_comunidad
AFTER INSERT ON miembros_comunidad
FOR EACH ROW
BEGIN
    UPDATE comunidades 
    SET members_count = members_count + 1
    WHERE id = NEW.community_id;
END //
DELIMITER ;

-- ============================================
-- ÍNDICES ADICIONALES PARA OPTIMIZACIÓN
-- ============================================

-- Índices compuestos para búsquedas frecuentes
CREATE INDEX idx_publicaciones_user_created ON publicaciones(user_id, created_at DESC);
CREATE INDEX idx_publicaciones_type_created ON publicaciones(post_type, created_at DESC);
CREATE INDEX idx_comentarios_post_created ON comentarios(post_id, created_at DESC);
CREATE INDEX idx_mensajes_room_created ON mensajes(room_id, created_at DESC);
CREATE INDEX idx_notificaciones_user_read ON notificaciones(user_id, is_read, created_at DESC);

-- Índices de texto completo para búsquedas
CREATE FULLTEXT INDEX idx_fulltext_publicaciones ON publicaciones(content);
CREATE FULLTEXT INDEX idx_fulltext_usuarios ON usuarios(username, display_name, bio);
CREATE FULLTEXT INDEX idx_fulltext_comunidades ON comunidades(name, description);
CREATE FULLTEXT INDEX idx_fulltext_clasificados ON clasificados(title, description);
CREATE FULLTEXT INDEX idx_fulltext_news ON habil_news(title, content, excerpt);

-- ============================================
-- DATOS INICIALES
-- ============================================

-- Insertar usuario administrador por defecto
INSERT INTO usuarios (
    id, 
    username, 
    email, 
    password, 
    display_name, 
    is_staff, 
    is_superuser,
    is_active
) VALUES (
    UUID(),
    'admin',
    'admin@habilidosos.com',
    'pbkdf2_sha256$600000$placeholder',  -- Cambiar por hash real
    'Administrador',
    TRUE,
    TRUE,
    TRUE
) ON DUPLICATE KEY UPDATE username = username;

-- ============================================
-- SCRIPT COMPLETADO
-- ============================================
-- Base de datos: habilidosos_db
-- Total de tablas: 25+
-- Incluye: usuarios, publicaciones, comunidades, clasificados, 
--          noticias, mensajería, notificaciones, eventos, streaming
-- Fecha de creación: 2024
-- ============================================

SELECT 'Base de datos habilidosos_db creada exitosamente!' as mensaje;
