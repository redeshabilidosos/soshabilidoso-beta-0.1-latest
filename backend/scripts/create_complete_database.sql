-- SCRIPT COMPLETO PARA CREAR TODA LA ESTRUCTURA DE habilidosos_db
-- INCLUYE: Usuarios, Learning, Analytics y Cultural Events
-- Ejecutar en phpMyAdmin: habilidosos_db -> SQL

USE habilidosos_db;

-- ================================================================================
-- SECCIÓN 0: TABLA DE USUARIOS (DJANGO COMPATIBLE)
-- ================================================================================

-- Tabla de usuarios principal (compatible con Django)
CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    password VARCHAR(128) NOT NULL,
    last_login TIMESTAMP NULL,
    is_superuser BOOLEAN DEFAULT FALSE,
    username VARCHAR(150) NOT NULL UNIQUE,
    first_name VARCHAR(150) DEFAULT '',
    last_name VARCHAR(150) DEFAULT '',
    email VARCHAR(254) NOT NULL,
    is_staff BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    date_joined TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Campos adicionales para SOS-HABILIDOSO
    display_name VARCHAR(100),
    bio TEXT,
    avatar VARCHAR(500),
    phone VARCHAR(20),
    birth_date DATE,
    gender ENUM('M', 'F', 'O') DEFAULT 'O',
    location VARCHAR(100),
    website VARCHAR(200),
    is_verified BOOLEAN DEFAULT FALSE,
    is_private BOOLEAN DEFAULT FALSE,
    followers_count INT DEFAULT 0,
    following_count INT DEFAULT 0,
    posts_count INT DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Índices
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_is_active (is_active),
    INDEX idx_created_at (created_at)
);

-- Tabla de grupos de Django
CREATE TABLE IF NOT EXISTS auth_group (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE
);

-- Tabla de permisos de Django
CREATE TABLE IF NOT EXISTS auth_permission (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    content_type_id INT NOT NULL,
    codename VARCHAR(100) NOT NULL,
    UNIQUE KEY unique_content_type_codename (content_type_id, codename)
);

-- Tabla de tipos de contenido de Django
CREATE TABLE IF NOT EXISTS django_content_type (
    id INT AUTO_INCREMENT PRIMARY KEY,
    app_label VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    UNIQUE KEY unique_app_label_model (app_label, model)
);

-- Tabla de relación usuarios-grupos
CREATE TABLE IF NOT EXISTS users_groups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    group_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES auth_group(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_group (user_id, group_id)
);

-- Tabla de relación usuarios-permisos
CREATE TABLE IF NOT EXISTS users_user_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    permission_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES auth_permission(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_permission (user_id, permission_id)
);

-- ================================================================================
-- SECCIÓN 1: TABLAS DE LEARNING SYSTEM
-- ================================================================================

-- Tabla de secciones de aprendizaje
CREATE TABLE IF NOT EXISTS learning_seccion (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    nombre VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    descripcion TEXT,
    icono VARCHAR(50) DEFAULT 'BookOpen',
    color VARCHAR(7) DEFAULT '#00ff88',
    orden INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    imagen VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_seccion_active (is_active),
    INDEX idx_seccion_orden (orden)
);

-- Tabla de temas de aprendizaje
CREATE TABLE IF NOT EXISTS learning_tema (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    seccion_id CHAR(36) NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL,
    descripcion TEXT,
    nivel ENUM('principiante', 'intermedio', 'avanzado') DEFAULT 'principiante',
    duracion_minutos INT DEFAULT 30,
    orden INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    imagen VARCHAR(500),
    video VARCHAR(500),
    imagen_url VARCHAR(500),
    video_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (seccion_id) REFERENCES learning_seccion(id) ON DELETE CASCADE,
    UNIQUE KEY unique_seccion_slug (seccion_id, slug),
    INDEX idx_tema_seccion (seccion_id),
    INDEX idx_tema_active (is_active),
    INDEX idx_tema_orden (orden)
);

-- Tabla de contenido de temas
CREATE TABLE IF NOT EXISTS learning_temacontenido (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    tema_id CHAR(36) NOT NULL,
    subtitulo VARCHAR(200) NOT NULL,
    contenido TEXT NOT NULL,
    orden INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tema_id) REFERENCES learning_tema(id) ON DELETE CASCADE,
    INDEX idx_contenido_tema (tema_id),
    INDEX idx_contenido_orden (orden)
);

-- Tabla de puntos clave de temas
CREATE TABLE IF NOT EXISTS learning_temapuntoclave (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    tema_id CHAR(36) NOT NULL,
    texto VARCHAR(300) NOT NULL,
    orden INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tema_id) REFERENCES learning_tema(id) ON DELETE CASCADE,
    INDEX idx_punto_tema (tema_id),
    INDEX idx_punto_orden (orden)
);

-- Tabla de progreso de usuarios
CREATE TABLE IF NOT EXISTS learning_progresousuario (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    usuario_id CHAR(36) NOT NULL,
    tema_id CHAR(36) NOT NULL,
    completado BOOLEAN DEFAULT FALSE,
    fecha_completado TIMESTAMP NULL,
    tiempo_dedicado INT DEFAULT 0,
    tiempo_inicio_sesion TIMESTAMP NULL,
    tiempo_fin_sesion TIMESTAMP NULL,
    intentos_evaluacion INT DEFAULT 0,
    puntuacion_evaluacion DECIMAL(5,2) DEFAULT 0.00,
    tiempo_total_tema INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tema_id) REFERENCES learning_tema(id) ON DELETE CASCADE,
    UNIQUE KEY unique_usuario_tema (usuario_id, tema_id),
    INDEX idx_progreso_usuario (usuario_id),
    INDEX idx_progreso_tema (tema_id),
    INDEX idx_progreso_completado (completado)
);

-- Tabla de logros
CREATE TABLE IF NOT EXISTS learning_logro (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    icono VARCHAR(50) DEFAULT 'Trophy',
    condicion VARCHAR(100) NOT NULL,
    valor_requerido INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_logro_active (is_active)
);

-- Tabla de logros de usuarios
CREATE TABLE IF NOT EXISTS learning_usuariologro (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    usuario_id CHAR(36) NOT NULL,
    logro_id CHAR(36) NOT NULL,
    fecha_obtenido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (logro_id) REFERENCES learning_logro(id) ON DELETE CASCADE,
    UNIQUE KEY unique_usuario_logro (usuario_id, logro_id),
    INDEX idx_usuario_logros (usuario_id),
    INDEX idx_logro_usuarios (logro_id)
);

-- Tabla de evaluaciones
CREATE TABLE IF NOT EXISTS learning_evaluacion (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    tema_id CHAR(36) NOT NULL,
    pregunta TEXT NOT NULL,
    opciones JSON NOT NULL,
    respuesta_correcta VARCHAR(10) NOT NULL,
    puntos INT DEFAULT 10,
    orden INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tema_id) REFERENCES learning_tema(id) ON DELETE CASCADE,
    INDEX idx_evaluacion_tema (tema_id),
    INDEX idx_evaluacion_active (is_active)
);

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
    organizer_id CHAR(36) NOT NULL,
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
    platform VARCHAR(50) NOT NULL,
    url VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES cultural_events(id) ON DELETE CASCADE,
    UNIQUE KEY unique_event_platform (event_id, platform)
);

-- Tabla de asistencia a eventos
CREATE TABLE IF NOT EXISTS cultural_event_attendances (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    user_id CHAR(36) NOT NULL,
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
    user_id CHAR(36) NOT NULL,
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
    user_id CHAR(36) NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES cultural_events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_event_views (event_id),
    INDEX idx_user_views (user_id),
    INDEX idx_viewed_date (viewed_at)
);

-- ================================================================================
-- SECCIÓN 4: DATOS INICIALES
-- ================================================================================

-- Insertar categorías de eventos culturales
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

-- Insertar etiquetas comunes
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

-- ================================================================================
-- SECCIÓN 5: VERIFICACIÓN FINAL
-- ================================================================================

-- Mostrar resumen de tablas creadas
SELECT 'RESUMEN DE CREACIÓN DE TABLAS' as info;

SELECT 
    'Usuarios y Auth' as modulo,
    COUNT(*) as tablas_creadas
FROM information_schema.tables 
WHERE table_schema = 'habilidosos_db' 
AND (table_name = 'users' OR table_name LIKE 'auth_%' OR table_name LIKE 'django_%' OR table_name LIKE 'users_%')

UNION ALL

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

SELECT 'CREACIÓN COMPLETADA - TODAS LAS TABLAS LISTAS' as resultado;