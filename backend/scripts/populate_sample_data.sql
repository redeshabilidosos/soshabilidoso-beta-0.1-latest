-- Script para poblar las tablas con datos de prueba
-- Ejecutar después de create_cultural_events_tables_fixed.sql
-- mysql -u root -p habilidosos_db < populate_sample_data.sql

USE habilidosos_db;

-- ================================================================================
-- SECCIÓN 1: DATOS DE PRUEBA PARA LEARNING SYSTEM
-- ================================================================================

-- Insertar secciones de aprendizaje
INSERT INTO learning_seccion (id, nombre, slug, descripcion, icono, color, orden, is_active, imagen) VALUES
('sec1234567890123456789012345678ab', 'Fundamentos del Fútbol', 'fundamentos-futbol', 'Aprende los conceptos básicos y fundamentales del fútbol', 'BookOpen', '#00ff88', 1, 1, '/images/learning/fundamentos.jpg'),
('sec234567890123456789012345678abc', 'Técnicas Avanzadas', 'tecnicas-avanzadas', 'Perfecciona tu técnica con ejercicios avanzados', 'Target', '#3b82f6', 2, 1, '/images/learning/tecnicas.jpg'),
('sec34567890123456789012345678abcd', 'Táctica y Estrategia', 'tactica-estrategia', 'Comprende las tácticas y estrategias del fútbol moderno', 'Users', '#8b5cf6', 3, 1, '/images/learning/tactica.jpg'),
('sec4567890123456789012345678abcde', 'Preparación Física', 'preparacion-fisica', 'Entrena tu cuerpo para el alto rendimiento', 'Activity', '#f59e0b', 4, 1, '/images/learning/fisica.jpg')
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);

-- Insertar temas de aprendizaje
INSERT INTO learning_tema (id, seccion_id, titulo, slug, descripcion, nivel, duracion_minutos, orden, is_active, imagen, video_url) VALUES
-- Fundamentos del Fútbol
('tema123456789012345678901234567ab', 'sec1234567890123456789012345678ab', 'Historia del Fútbol', 'historia-futbol', 'Conoce los orígenes y evolución del fútbol mundial', 'principiante', 30, 1, 1, '/images/temas/historia.jpg', 'https://youtube.com/watch?v=ejemplo1'),
('tema23456789012345678901234567abc', 'sec1234567890123456789012345678ab', 'Reglas Básicas', 'reglas-basicas', 'Aprende las reglas fundamentales del fútbol', 'principiante', 45, 2, 1, '/images/temas/reglas.jpg', 'https://youtube.com/watch?v=ejemplo2'),
('tema3456789012345678901234567abcd', 'sec1234567890123456789012345678ab', 'Posiciones en el Campo', 'posiciones-campo', 'Entiende las diferentes posiciones y sus funciones', 'principiante', 35, 3, 1, '/images/temas/posiciones.jpg', 'https://youtube.com/watch?v=ejemplo3'),

-- Técnicas Avanzadas
('tema456789012345678901234567abcde', 'sec234567890123456789012345678abc', 'Control de Balón', 'control-balon', 'Domina las técnicas de control y recepción', 'intermedio', 40, 1, 1, '/images/temas/control.jpg', 'https://youtube.com/watch?v=ejemplo4'),
('tema56789012345678901234567abcdef', 'sec234567890123456789012345678abc', 'Pases Precisos', 'pases-precisos', 'Perfecciona la precisión en tus pases', 'intermedio', 50, 2, 1, '/images/temas/pases.jpg', 'https://youtube.com/watch?v=ejemplo5'),
('tema6789012345678901234567abcdef1', 'sec234567890123456789012345678abc', 'Técnicas de Disparo', 'tecnicas-disparo', 'Mejora tu efectividad frente al arco', 'avanzado', 45, 3, 1, '/images/temas/disparo.jpg', 'https://youtube.com/watch?v=ejemplo6')
ON DUPLICATE KEY UPDATE titulo = VALUES(titulo);

-- Insertar contenido de temas
INSERT INTO learning_temacontenido (id, tema_id, subtitulo, contenido, orden) VALUES
('cont12345678901234567890123456ab', 'tema123456789012345678901234567ab', 'Orígenes del Fútbol', 'El fútbol moderno nació en Inglaterra en el siglo XIX. Las primeras reglas fueron establecidas en 1863 por la Football Association.', 1),
('cont2345678901234567890123456abc', 'tema123456789012345678901234567ab', 'Expansión Mundial', 'El fútbol se expandió rápidamente por Europa y América, convirtiéndose en el deporte más popular del mundo.', 2),
('cont345678901234567890123456abcd', 'tema23456789012345678901234567abc', 'El Campo de Juego', 'El campo debe ser rectangular, con una longitud entre 90-120 metros y un ancho entre 45-90 metros.', 1),
('cont45678901234567890123456abcde', 'tema23456789012345678901234567abc', 'Duración del Partido', 'Un partido consta de dos tiempos de 45 minutos cada uno, más el tiempo adicional que determine el árbitro.', 2)
ON DUPLICATE KEY UPDATE subtitulo = VALUES(subtitulo);

-- Insertar puntos clave
INSERT INTO learning_temapuntoclave (id, tema_id, texto, orden) VALUES
('punto123456789012345678901234567ab', 'tema123456789012345678901234567ab', 'El fútbol es el deporte más popular del mundo', 1),
('punto23456789012345678901234567abc', 'tema123456789012345678901234567ab', 'Las primeras reglas se establecieron en 1863', 2),
('punto3456789012345678901234567abcd', 'tema23456789012345678901234567abc', 'El campo debe ser rectangular', 1),
('punto456789012345678901234567abcde', 'tema23456789012345678901234567abc', 'Cada tiempo dura 45 minutos', 2)
ON DUPLICATE KEY UPDATE texto = VALUES(texto);

-- Insertar logros adicionales
INSERT INTO learning_logro_adicional (id, nombre, descripcion, icono, condicion, valor_requerido, is_active) VALUES
('logro123456789012345678901234567ab', 'Primer Paso', 'Completa tu primer tema de aprendizaje', 'Trophy', 'temas_completados', 1, 1),
('logro23456789012345678901234567abc', 'Estudiante Dedicado', 'Completa 5 temas de aprendizaje', 'Star', 'temas_completados', 5, 1),
('logro3456789012345678901234567abcd', 'Experto en Fundamentos', 'Completa toda la sección de fundamentos', 'Award', 'seccion_completada', 1, 1),
('logro456789012345678901234567abcde', 'Maestro del Fútbol', 'Completa todos los temas disponibles', 'Crown', 'temas_completados', 20, 1)
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);

-- ================================================================================
-- SECCIÓN 2: DATOS DE PRUEBA PARA EVENTOS CULTURALES
-- ================================================================================

-- Insertar eventos de prueba (usando IDs de usuarios existentes del backup)
INSERT INTO cultural_events (id, title, slug, description, category_id, organizer_id, event_date, start_time, end_time, location, address, price, capacity, image_url, video_url, is_featured) VALUES
('event123456789012345678901234567ab', 'Festival de Música Urbana 2026', 'festival-musica-urbana-2026', 'Un increíble festival que reúne a los mejores artistas de música urbana de Colombia y Latinoamérica. Ven y disfruta de una noche llena de ritmo, baile y buena música.', 'a1b2c3d4e5f6789012345678901234ab', 'bd22ec1c4dbe48f3a018e96b2cd61304', '2026-02-15', '19:00:00', '23:00:00', 'Parque Simón Bolívar', 'Carrera 60 con Calle 53, Bogotá', 'Desde $50.000', 5000, '/images/events/festival-urbano.jpg', 'https://youtube.com/watch?v=festival-urbano', 1),

('event23456789012345678901234567abc', 'Exposición de Arte Contemporáneo', 'exposicion-arte-contemporaneo', 'Muestra de arte contemporáneo que presenta las obras más innovadoras de artistas emergentes colombianos. Una experiencia visual única.', 'b2c3d4e5f6789012345678901234abc1', '4265f3cd6c7a493b9e35efbacd3b3a6b', '2026-02-20', '10:00:00', '18:00:00', 'Museo Nacional', 'Carrera 7 # 28-66, Bogotá', 'Gratis', 200, '/images/events/expo-arte.jpg', NULL, 1),

('event3456789012345678901234567abcd', 'Obra de Teatro: "Sueños de Medianoche"', 'obra-teatro-suenos-medianoche', 'Una obra teatral que explora los sueños y pesadillas de la sociedad moderna. Actuaciones magistrales y una puesta en escena espectacular.', 'c3d4e5f6789012345678901234abc12d', '6f053d432986406289a54b930e90924f', '2026-02-25', '20:00:00', '22:00:00', 'Teatro Colón', 'Calle 10 # 5-32, Bogotá', '$80.000', 800, '/images/events/teatro-suenos.jpg', 'https://youtube.com/watch?v=teatro-trailer', 0),

('event456789012345678901234567abcde', 'Taller de Fotografía Digital', 'taller-fotografia-digital', 'Aprende las técnicas básicas y avanzadas de fotografía digital. Incluye práctica con modelos y edición profesional.', 'd4e5f6789012345678901234abc12de3', 'e3702132b6cb45d2a390e6b1b5f254ab', '2026-03-01', '14:00:00', '17:00:00', 'Centro Cultural Gabriel García Márquez', 'Calle 11 # 5-60, Bogotá', '$120.000', 30, '/images/events/taller-foto.jpg', NULL, 0),

('event56789012345678901234567abcdef', 'Espectáculo de Danza Folclórica', 'espectaculo-danza-folklorica', 'Celebra la riqueza cultural de Colombia con un espectáculo de danza folclórica que recorre todas las regiones del país.', 'e5f6789012345678901234abc12de34f', '4cccc11a7e634423bf92808272ad4b52', '2026-03-05', '19:30:00', '21:30:00', 'Teatro Mayor Julio Mario Santo Domingo', 'Calle 170 # 67-51, Bogotá', '$60.000', 1200, '/images/events/danza-folklorica.jpg', 'https://youtube.com/watch?v=danza-preview', 1)
ON DUPLICATE KEY UPDATE title = VALUES(title);

-- Insertar relaciones de etiquetas para eventos
INSERT INTO cultural_event_tag_relations (id, event_id, tag_id) VALUES
('rel1234567890123456789012345678ab', 'event123456789012345678901234567ab', 'tag1234567890123456789012345678ab'), -- festival
('rel234567890123456789012345678abc', 'event123456789012345678901234567ab', 'tag234567890123456789012345678abc'), -- música en vivo
('rel34567890123456789012345678abcd', 'event123456789012345678901234567ab', '0123456789012345678abcdef12345'), -- local
('rel4567890123456789012345678abcde', 'event23456789012345678901234567abc', 'tag34567890123456789012345678abcd'), -- arte contemporáneo
('rel567890123456789012345678abcdef', 'event23456789012345678901234567abc', 'tag890123456789012345678abcdef123'), -- gratis
('rel67890123456789012345678abcdef1', 'event3456789012345678901234567abcd', 'tag4567890123456789012345678abcde'), -- teatro
('rel7890123456789012345678abcdef12', 'event456789012345678901234567abcde', 'tag567890123456789012345678abcdef'), -- taller
('rel890123456789012345678abcdef123', 'event456789012345678901234567abcde', 'tag67890123456789012345678abcdef1'), -- educativo
('rel90123456789012345678abcdef1234', 'event56789012345678901234567abcdef', '0123456789012345678abcdef12345') -- local
ON DUPLICATE KEY UPDATE event_id = VALUES(event_id);

-- Insertar enlaces sociales para eventos
INSERT INTO cultural_event_social_links (id, event_id, platform, url) VALUES
('social123456789012345678901234567ab', 'event123456789012345678901234567ab', 'instagram', 'https://instagram.com/festival_urbano_2026'),
('social23456789012345678901234567abc', 'event123456789012345678901234567ab', 'facebook', 'https://facebook.com/festivalurbano2026'),
('social3456789012345678901234567abcd', 'event23456789012345678901234567abc', 'website', 'https://museonacional.gov.co/exposicion-contemporaneo'),
('social456789012345678901234567abcde', 'event3456789012345678901234567abcd', 'instagram', 'https://instagram.com/teatro_colon_oficial'),
('social56789012345678901234567abcdef', 'event456789012345678901234567abcde', 'website', 'https://tallerfotografia.com')
ON DUPLICATE KEY UPDATE platform = VALUES(platform);

-- ================================================================================
-- SECCIÓN 4: DATOS DE PRUEBA PARA CONTENIDO COMPARTIBLE
-- ================================================================================

-- Insertar publicaciones del feed principal
INSERT INTO feed_posts (id, author_id, content, post_type, media_urls, privacy_level, tags, likes_count, comments_count, views_count) VALUES
('post123456789012345678901234567ab', 'bd22ec1c4dbe48f3a018e96b2cd61304', '¡Increíble entrenamiento de hoy! 💪 Trabajamos técnicas de control de balón y pases precisos. El progreso es evidente y la motivación está por las nubes. #Fútbol #Entrenamiento #Progreso', 'text', '[]', 'public', '["futbol", "entrenamiento", "progreso", "motivacion"]', 15, 3, 45),
('post23456789012345678901234567abc', '4265f3cd6c7a493b9e35efbacd3b3a6b', 'Compartiendo algunas fotos del último partido. ¡Qué experiencia tan increíble! 📸⚽', 'image', '["https://example.com/images/partido1.jpg", "https://example.com/images/partido2.jpg"]', 'public', '["futbol", "partido", "fotos", "experiencia"]', 28, 7, 89),
('post3456789012345678901234567abcd', '6f053d432986406289a54b930e90924f', '¿Cuál creen que es la mejor estrategia para mejorar la precisión en los pases? Estoy trabajando en mi técnica y me gustaría escuchar sus consejos. 🤔', 'text', '[]', 'public', '["futbol", "consejos", "tecnica", "pases"]', 12, 8, 34)
ON DUPLICATE KEY UPDATE content = VALUES(content);

-- Insertar reels/clips de video
INSERT INTO reels (id, author_id, title, description, video_url, thumbnail_url, duration_seconds, hashtags, likes_count, views_count, play_count) VALUES
('reel123456789012345678901234567ab', 'bd22ec1c4dbe48f3a018e96b2cd61304', 'Técnica de Control de Balón', 'Aprende esta técnica básica para mejorar tu control 🔥', 'https://example.com/videos/control-balon.mp4', 'https://example.com/thumbnails/control-balon.jpg', 45, '["futbol", "tecnica", "control", "tutorial", "habilidosos"]', 156, 1240, 890),
('reel23456789012345678901234567abc', '4265f3cd6c7a493b9e35efbacd3b3a6b', 'Gol Espectacular', 'No vas a creer este gol que metí en el entrenamiento 😱', 'https://example.com/videos/gol-espectacular.mp4', 'https://example.com/thumbnails/gol-espectacular.jpg', 30, '["futbol", "gol", "espectacular", "entrenamiento"]', 89, 567, 445),
('reel3456789012345678901234567abcd', '6f053d432986406289a54b930e90924f', 'Ejercicio de Agilidad', 'Rutina de agilidad que cambió mi juego completamente 💪', 'https://example.com/videos/agilidad.mp4', 'https://example.com/thumbnails/agilidad.jpg', 60, '["futbol", "agilidad", "ejercicio", "rutina", "fitness"]', 67, 423, 312)
ON DUPLICATE KEY UPDATE title = VALUES(title);

-- Insertar artículos de noticias
INSERT INTO news_articles (id, author_id, title, subtitle, slug, excerpt, content, featured_image, category, tags, status, published_at, views_count, likes_count) VALUES
('news123456789012345678901234567ab', 'bd22ec1c4dbe48f3a018e96b2cd61304', 'La Revolución del Fútbol Digital', 'Cómo la tecnología está transformando el deporte rey', 'revolucion-futbol-digital', 'Descubre cómo las nuevas tecnologías están cambiando la forma en que entrenamos y jugamos fútbol.', 'El fútbol está experimentando una revolución digital sin precedentes. Desde aplicaciones de entrenamiento hasta análisis de datos en tiempo real, la tecnología está transformando cada aspecto del deporte rey...', 'https://example.com/images/futbol-digital.jpg', 'deportes', '["futbol", "tecnologia", "digital", "innovacion"]', 'published', '2026-01-15 10:00:00', 234, 45),
('news23456789012345678901234567abc', '4265f3cd6c7a493b9e35efbacd3b3a6b', 'Nuevas Técnicas de Entrenamiento', 'Métodos innovadores para mejorar tu rendimiento', 'nuevas-tecnicas-entrenamiento', 'Conoce las últimas tendencias en entrenamiento deportivo que están revolucionando el fútbol.', 'Los entrenadores modernos están adoptando nuevas metodologías que combinan ciencia del deporte, psicología y tecnología para maximizar el rendimiento de los jugadores...', 'https://example.com/images/entrenamiento-moderno.jpg', 'deportes', '["entrenamiento", "tecnicas", "rendimiento", "ciencia"]', 'published', '2026-01-18 14:30:00', 189, 32)
ON DUPLICATE KEY UPDATE title = VALUES(title);

-- Insertar transmisiones en vivo
INSERT INTO live_streams (id, streamer_id, title, description, stream_key, category, status, scheduled_start, max_viewers, total_views) VALUES
('live123456789012345678901234567ab', 'bd22ec1c4dbe48f3a018e96b2cd61304', 'Entrenamiento en Vivo - Técnicas Básicas', 'Únete a nuestra sesión de entrenamiento en vivo donde practicaremos técnicas básicas de fútbol', 'stream_key_123456', 'sports', 'scheduled', '2026-02-01 16:00:00', 0, 0),
('live23456789012345678901234567abc', '6f053d432986406289a54b930e90924f', 'Análisis Táctico del Partido', 'Analizaremos las tácticas utilizadas en el último partido de la liga', 'stream_key_789012', 'sports', 'ended', '2026-01-20 20:00:00', 145, 1250)
ON DUPLICATE KEY UPDATE title = VALUES(title);

-- Insertar clasificados
INSERT INTO classifieds (id, author_id, title, description, category, subcategory, price_type, location, tags, status, views_count, responses_count) VALUES
('clas123456789012345678901234567ab', 'bd22ec1c4dbe48f3a018e96b2cd61304', 'Busco Compañero de Entrenamiento', 'Busco alguien para entrenar fútbol los fines de semana en Bogotá. Nivel intermedio, enfoque en mejorar técnica y condición física.', 'collaboration', 'entrenamiento', 'free', 'Bogotá, Colombia', '["futbol", "entrenamiento", "compañero", "bogota"]', 'active', 67, 8),
('clas23456789012345678901234567abc', '4265f3cd6c7a493b9e35efbacd3b3a6b', 'Clases Particulares de Fútbol', 'Ofrezco clases particulares de fútbol para niños y jóvenes. Experiencia de 5 años como entrenador certificado.', 'service_offer', 'clases', 'hourly', 'Medellín, Colombia', '["futbol", "clases", "entrenador", "niños"]', 'active', 123, 15),
('clas3456789012345678901234567abcd', '6f053d432986406289a54b930e90924f', 'Vendo Equipamiento de Fútbol', 'Vendo equipamiento completo de fútbol: guayos, canilleras, balones y más. Todo en excelente estado.', 'product_sale', 'equipamiento', 'negotiable', 'Cali, Colombia', '["futbol", "equipamiento", "venta", "guayos"]', 'active', 89, 12)
ON DUPLICATE KEY UPDATE title = VALUES(title);

-- Insertar publicaciones en subcomunidades
INSERT INTO community_posts (id, community_id, author_id, title, content, post_type, tags, likes_count, comments_count, views_count) VALUES
('comm123456789012345678901234567ab', 'comm_futbol_bogota_123456789012ab', 'bd22ec1c4dbe48f3a018e96b2cd61304', 'Torneo Local en Bogotá', 'Se viene el torneo local de fútbol en Bogotá. ¿Quién se apunta? Necesitamos formar equipos y definir fechas.', 'text', '["torneo", "bogota", "futbol", "local"]', 23, 12, 78),
('comm23456789012345678901234567abc', 'comm_futbol_medellin_23456789012bc', '4265f3cd6c7a493b9e35efbacd3b3a6b', 'Nuevo Campo de Entrenamiento', 'Encontré un campo excelente para entrenar en Medellín. Comparto la ubicación y horarios disponibles.', 'text', '["medellin", "campo", "entrenamiento", "ubicacion"]', 18, 7, 45)
ON DUPLICATE KEY UPDATE title = VALUES(title);

-- ================================================================================
-- SECCIÓN 5: DATOS DE PRUEBA PARA ANALYTICS
-- ================================================================================

-- Insertar preferencias de usuario de ejemplo
INSERT INTO analytics_userpreferences (id, usuario_id, categoria_interes, nivel_interes, tiempo_dedicado) VALUES
('pref12345678901234567890123456ab', 'bd22ec1c4dbe48f3a018e96b2cd61304', 'música', 9, 120),
('pref2345678901234567890123456abc', 'bd22ec1c4dbe48f3a018e96b2cd61304', 'arte', 7, 80),
('pref345678901234567890123456abcd', '4265f3cd6c7a493b9e35efbacd3b3a6b', 'teatro', 8, 95),
('pref45678901234567890123456abcde', '6f053d432986406289a54b930e90924f', 'educación', 10, 200),
('pref5678901234567890123456abcdef', 'e3702132b6cb45d2a390e6b1b5f254ab', 'fotografía', 9, 150)
ON DUPLICATE KEY UPDATE nivel_interes = VALUES(nivel_interes);

-- Insertar ubicaciones de usuario de ejemplo
INSERT INTO analytics_userlocation (id, usuario_id, pais, departamento, ciudad, barrio, latitud, longitud) VALUES
('loc123456789012345678901234567ab', 'bd22ec1c4dbe48f3a018e96b2cd61304', 'Colombia', 'Cundinamarca', 'Bogotá', 'Chapinero', 4.6097100, -74.0817500),
('loc23456789012345678901234567abc', '4265f3cd6c7a493b9e35efbacd3b3a6b', 'Colombia', 'Antioquia', 'Medellín', 'El Poblado', 6.2442400, -75.5812100),
('loc3456789012345678901234567abcd', '6f053d432986406289a54b930e90924f', 'Colombia', 'Valle del Cauca', 'Cali', 'Granada', 3.4516500, -76.5319900)
ON DUPLICATE KEY UPDATE ciudad = VALUES(ciudad);

-- ================================================================================
-- SECCIÓN 6: VERIFICACIÓN DE DATOS INSERTADOS
-- ================================================================================

-- Mostrar resumen de datos insertados
SELECT 'RESUMEN DE DATOS DE PRUEBA INSERTADOS' as info;

SELECT 
    'Learning - Secciones' as tabla,
    COUNT(*) as registros_insertados
FROM learning_seccion

UNION ALL

SELECT 
    'Learning - Temas' as tabla,
    COUNT(*) as registros_insertados
FROM learning_tema

UNION ALL

SELECT 
    'Cultural - Eventos' as tabla,
    COUNT(*) as registros_insertados
FROM cultural_events

UNION ALL

SELECT 
    'Cultural - Categorías' as tabla,
    COUNT(*) as registros_insertados
FROM cultural_event_categories

UNION ALL

SELECT 
    'Cultural - Etiquetas' as tabla,
    COUNT(*) as registros_insertados
FROM cultural_event_tags

UNION ALL

SELECT 
    'Feed - Publicaciones' as tabla,
    COUNT(*) as registros_insertados
FROM feed_posts

UNION ALL

SELECT 
    'Reels - Videos' as tabla,
    COUNT(*) as registros_insertados
FROM reels

UNION ALL

SELECT 
    'Noticias - Artículos' as tabla,
    COUNT(*) as registros_insertados
FROM news_articles

UNION ALL

SELECT 
    'Live - Transmisiones' as tabla,
    COUNT(*) as registros_insertados
FROM live_streams

UNION ALL

SELECT 
    'Clasificados' as tabla,
    COUNT(*) as registros_insertados
FROM classifieds

UNION ALL

SELECT 
    'Contenido Compartible' as tabla,
    COUNT(*) as registros_insertados
FROM shareable_content

UNION ALL

SELECT 
    'Analytics - Preferencias' as tabla,
    COUNT(*) as registros_insertados
FROM analytics_userpreferences;

-- Mostrar contenido compartible creado automáticamente
SELECT 
    '' as separador,
    'CONTENIDO COMPARTIBLE GENERADO AUTOMÁTICAMENTE' as info;

SELECT 
    content_type as 'Tipo',
    title as 'Título',
    share_url as 'URL para Compartir',
    shares_count as 'Shares',
    views_count as 'Views'
FROM shareable_content
ORDER BY content_type, created_at;

-- Mostrar eventos creados
SELECT 
    '' as separador,
    'EVENTOS CULTURALES CREADOS' as info;

SELECT 
    title as 'Evento',
    event_date as 'Fecha',
    location as 'Lugar',
    price as 'Precio',
    capacity as 'Capacidad'
FROM cultural_events
ORDER BY event_date;

-- Mostrar secciones de learning
SELECT 
    '' as separador,
    'SECCIONES DE LEARNING CREADAS' as info;

SELECT 
    nombre as 'Sección',
    slug as 'Slug',
    orden as 'Orden',
    (SELECT COUNT(*) FROM learning_tema WHERE seccion_id = learning_seccion.id) as 'Temas'
FROM learning_seccion
ORDER BY orden;

-- Mostrar publicaciones del feed
SELECT 
    '' as separador,
    'PUBLICACIONES DEL FEED CREADAS' as info;

SELECT 
    LEFT(content, 50) as 'Contenido (preview)',
    post_type as 'Tipo',
    likes_count as 'Likes',
    comments_count as 'Comentarios',
    views_count as 'Views'
FROM feed_posts
ORDER BY created_at DESC;

-- Mostrar reels creados
SELECT 
    '' as separador,
    'REELS/CLIPS CREADOS' as info;

SELECT 
    title as 'Título',
    duration_seconds as 'Duración (seg)',
    likes_count as 'Likes',
    views_count as 'Views',
    play_count as 'Reproducciones'
FROM reels
ORDER BY created_at DESC;

COMMIT;