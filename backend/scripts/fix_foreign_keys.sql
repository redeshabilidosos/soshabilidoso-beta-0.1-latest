-- ================================================================================
-- SCRIPT PARA CORREGIR CLAVES FORÁNEAS EN EVENTOS CULTURALES
-- ================================================================================

USE habilidosos_db;

-- Verificar si la tabla cultural_events existe y eliminarla si tiene problemas
DROP TABLE IF EXISTS cultural_events;

-- Verificar si la tabla cultural_event_categories existe
DROP TABLE IF EXISTS cultural_event_categories;

-- Recrear la tabla de categorías primero
CREATE TABLE cultural_event_categories (
    id CHAR(32) NOT NULL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(50) NOT NULL DEFAULT 'CalendarDays',
    color_class VARCHAR(100) NOT NULL DEFAULT 'bg-purple-500/20 text-purple-400 border-purple-400/30',
    description TEXT,
    is_active TINYINT(1) DEFAULT 1,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar categorías básicas
INSERT INTO cultural_event_categories (id, name, slug, icon, color_class, description) VALUES
('a1b2c3d4e5f6789012345678901234ab', 'Música', 'musica', 'Music', 'bg-blue-500/20 text-blue-400 border-blue-400/30', 'Conciertos, festivales, recitales y eventos musicales'),
('b2c3d4e5f6789012345678901234abc1', 'Arte', 'arte', 'Palette', 'bg-purple-500/20 text-purple-400 border-purple-400/30', 'Exposiciones, galerías, muestras artísticas'),
('c3d4e5f6789012345678901234abc12d', 'Teatro', 'teatro', 'Theater', 'bg-red-500/20 text-red-400 border-red-400/30', 'Obras teatrales, performances, monólogos'),
('d4e5f6789012345678901234abc12de3', 'Danza', 'danza', 'Users', 'bg-green-500/20 text-green-400 border-green-400/30', 'Espectáculos de danza y baile'),
('e5f6789012345678901234abc12de34f', 'Literatura', 'literatura', 'BookOpen', 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30', 'Presentaciones de libros, recitales de poesía'),
('f6789012345678901234abc12de34f45', 'Cine', 'cine', 'Film', 'bg-indigo-500/20 text-indigo-400 border-indigo-400/30', 'Proyecciones, festivales de cine');

-- Ahora crear la tabla de eventos con las claves foráneas correctas
CREATE TABLE cultural_events (
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

-- Insertar algunos eventos de ejemplo
INSERT INTO cultural_events (id, title, slug, description, category_id, organizer_id, event_date, start_time, location, price) VALUES
('event123456789012345678901234567ab', 'Festival de Música Urbana 2026', 'festival-musica-urbana-2026', 'Un increíble festival de música urbana con los mejores artistas locales', 'a1b2c3d4e5f6789012345678901234ab', 'bd22ec1c4dbe48f3a018e96b2cd61304', '2026-02-15', '19:00:00', 'Parque Simón Bolívar', 'Desde $50.000'),
('event23456789012345678901234567abc', 'Exposición de Arte Contemporáneo', 'exposicion-arte-contemporaneo', 'Muestra de arte contemporáneo de artistas emergentes', 'b2c3d4e5f6789012345678901234abc1', '4265f3cd6c7a493b9e35efbacd3b3a6b', '2026-02-20', '10:00:00', 'Museo Nacional', 'Gratis'),
('event34567890123456789012345678abc', 'Obra de Teatro: Romeo y Julieta', 'romeo-y-julieta', 'Adaptación moderna del clásico de Shakespeare', 'c3d4e5f6789012345678901234abc12d', 'bd22ec1c4dbe48f3a018e96b2cd61304', '2026-02-25', '20:00:00', 'Teatro Colón', '$35.000');

SELECT 'Tablas de eventos culturales creadas correctamente' as status;
SELECT COUNT(*) as total_categorias FROM cultural_event_categories;
SELECT COUNT(*) as total_eventos FROM cultural_events;