-- =====================================================
-- Script SQL para crear las tablas del módulo de Capacitaciones
-- Base de datos: MySQL
-- Aplicación: SOS Habilidoso - Módulo Learning
-- =====================================================

-- Tabla: Secciones de aprendizaje
CREATE TABLE IF NOT EXISTS learning_secciones (
    id CHAR(36) PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT NOT NULL,
    icono VARCHAR(50) DEFAULT '',
    color VARCHAR(20) DEFAULT '#00ff88',
    orden INT UNSIGNED DEFAULT 0,
    imagen VARCHAR(255) DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_seccion_slug (slug),
    INDEX idx_seccion_orden (orden),
    INDEX idx_seccion_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: Temas de aprendizaje
CREATE TABLE IF NOT EXISTS learning_temas (
    id CHAR(36) PRIMARY KEY,
    seccion_id CHAR(36) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT NOT NULL,
    nivel ENUM('basico', 'intermedio', 'avanzado') DEFAULT 'basico',
    duracion_minutos INT UNSIGNED DEFAULT 30,
    imagen_url VARCHAR(500) DEFAULT '',
    video_url VARCHAR(500) DEFAULT '',
    orden INT UNSIGNED DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (seccion_id) REFERENCES learning_secciones(id) ON DELETE CASCADE,
    UNIQUE KEY unique_seccion_slug (seccion_id, slug),
    INDEX idx_tema_seccion (seccion_id),
    INDEX idx_tema_nivel (nivel),
    INDEX idx_tema_orden (orden),
    INDEX idx_tema_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: Contenido de temas (secciones de texto)
CREATE TABLE IF NOT EXISTS learning_tema_contenido (
    id CHAR(36) PRIMARY KEY,
    tema_id CHAR(36) NOT NULL,
    subtitulo VARCHAR(200) NOT NULL,
    contenido TEXT NOT NULL,
    orden INT UNSIGNED DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tema_id) REFERENCES learning_temas(id) ON DELETE CASCADE,
    INDEX idx_contenido_tema (tema_id),
    INDEX idx_contenido_orden (orden)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: Puntos clave de temas
CREATE TABLE IF NOT EXISTS learning_tema_puntos_clave (
    id CHAR(36) PRIMARY KEY,
    tema_id CHAR(36) NOT NULL,
    texto VARCHAR(500) NOT NULL,
    orden INT UNSIGNED DEFAULT 0,
    FOREIGN KEY (tema_id) REFERENCES learning_temas(id) ON DELETE CASCADE,
    INDEX idx_punto_tema (tema_id),
    INDEX idx_punto_orden (orden)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Tabla: Progreso del usuario
CREATE TABLE IF NOT EXISTS learning_progreso_usuario (
    id CHAR(36) PRIMARY KEY,
    usuario_id CHAR(36) NOT NULL,
    tema_id CHAR(36) NOT NULL,
    estado ENUM('no_iniciado', 'en_progreso', 'completado') DEFAULT 'no_iniciado',
    fecha_inicio DATETIME DEFAULT NULL,
    fecha_completado DATETIME DEFAULT NULL,
    tiempo_dedicado_minutos INT UNSIGNED DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES users_user(id) ON DELETE CASCADE,
    FOREIGN KEY (tema_id) REFERENCES learning_temas(id) ON DELETE CASCADE,
    UNIQUE KEY unique_usuario_tema (usuario_id, tema_id),
    INDEX idx_progreso_usuario (usuario_id),
    INDEX idx_progreso_tema (tema_id),
    INDEX idx_progreso_estado (estado),
    INDEX idx_progreso_completado (fecha_completado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: Logros/Insignias
CREATE TABLE IF NOT EXISTS learning_logros (
    id CHAR(36) PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    icono VARCHAR(50) NOT NULL,
    color VARCHAR(20) DEFAULT '#FFD700',
    puntos INT UNSIGNED DEFAULT 10,
    seccion_requerida_id CHAR(36) DEFAULT NULL,
    temas_requeridos INT UNSIGNED DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seccion_requerida_id) REFERENCES learning_secciones(id) ON DELETE SET NULL,
    INDEX idx_logro_slug (slug),
    INDEX idx_logro_active (is_active),
    INDEX idx_logro_seccion (seccion_requerida_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: Logros obtenidos por usuarios
CREATE TABLE IF NOT EXISTS learning_usuario_logros (
    id CHAR(36) PRIMARY KEY,
    usuario_id CHAR(36) NOT NULL,
    logro_id CHAR(36) NOT NULL,
    fecha_obtenido DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES users_user(id) ON DELETE CASCADE,
    FOREIGN KEY (logro_id) REFERENCES learning_logros(id) ON DELETE CASCADE,
    UNIQUE KEY unique_usuario_logro (usuario_id, logro_id),
    INDEX idx_usuario_logro_usuario (usuario_id),
    INDEX idx_usuario_logro_logro (logro_id),
    INDEX idx_usuario_logro_fecha (fecha_obtenido)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- DATOS INICIALES - Secciones
-- =====================================================

INSERT INTO learning_secciones (id, slug, nombre, descripcion, icono, color, orden) VALUES
(UUID(), 'tecnicas-practicas', 'Técnicas y Prácticas', 'Métodos y ejercicios para desarrollar habilidades individuales y colectivas en el fútbol', 'Dumbbell', '#00ff88', 1),
(UUID(), 'escuelas-formacion', 'Escuelas de Formación', 'Centros especializados para jóvenes futbolistas con entrenamiento estructurado', 'GraduationCap', '#3b82f6', 2),
(UUID(), 'reglamentos-fifa', 'Reglamentos FIFA', 'Leyes del Juego establecidas por la FIFA - reglas universales del deporte', 'Scale', '#f59e0b', 3),
(UUID(), 'reglamentos-arbitros', 'Reglamentos de Árbitros', 'Normativas específicas que rigen la labor del cuerpo arbitral', 'UserCheck', '#ef4444', 4),
(UUID(), 'estructura-sede', 'Estructura de Sede Deportiva', 'Infraestructura física necesaria para operar un centro de formación', 'Building2', '#8b5cf6', 5),
(UUID(), 'conferencias-coaches', 'Conferencias para Coaches', 'Sesiones formativas para entrenadores y staff técnico', 'Mic', '#ec4899', 6),
(UUID(), 'representacion-jugadores', 'Representación de Jugadores', 'Gestión de contratos, imagen y carrera de deportistas', 'Users', '#14b8a6', 7),
(UUID(), 'educacion-idiomas', 'Educación de Idiomas', 'Programa de enseñanza de lenguas para futbolistas internacionales', 'Globe', '#f97316', 8);

-- =====================================================
-- DATOS INICIALES - Logros
-- =====================================================

INSERT INTO learning_logros (id, slug, nombre, descripcion, icono, color, puntos, temas_requeridos) VALUES
(UUID(), 'primer-paso', 'Primer Paso', 'Completa tu primer tema de aprendizaje', '🎯', '#00ff88', 10, 1),
(UUID(), 'aprendiz', 'Aprendiz', 'Completa 5 temas de aprendizaje', '📚', '#3b82f6', 25, 5),
(UUID(), 'estudiante', 'Estudiante Dedicado', 'Completa 10 temas de aprendizaje', '🎓', '#8b5cf6', 50, 10),
(UUID(), 'experto', 'Experto', 'Completa 20 temas de aprendizaje', '🏆', '#f59e0b', 100, 20),
(UUID(), 'maestro', 'Maestro del Fútbol', 'Completa todos los temas disponibles', '👑', '#FFD700', 500, 43);

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
