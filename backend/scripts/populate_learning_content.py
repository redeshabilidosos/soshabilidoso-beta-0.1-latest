"""
Script para poblar la base de datos con contenido de capacitaciones
Ejecutar: python manage.py shell < scripts/populate_learning_content.py
O: python manage.py runscript populate_learning_content
"""

import os
import sys
import django

# Configurar Django
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from apps.learning.models import Seccion, Tema, TemaContenido, TemaPuntoClave, Logro

def crear_secciones():
    """Crear las secciones principales de capacitación"""
    secciones_data = [
        {
            'slug': 'tecnicas-practicas',
            'nombre': 'Técnicas y Prácticas',
            'descripcion': 'Aprende las técnicas fundamentales del fútbol: control, pase, tiro, regate y más.',
            'icono': 'Target',
            'color': '#00ff88',
            'orden': 1
        },
        {
            'slug': 'reglamentos-fifa',
            'nombre': 'Reglamentos FIFA',
            'descripcion': 'Conoce las reglas oficiales del fútbol según la FIFA.',
            'icono': 'BookOpen',
            'color': '#3b82f6',
            'orden': 2
        },
        {
            'slug': 'tactica-estrategia',
            'nombre': 'Táctica y Estrategia',
            'descripcion': 'Sistemas de juego, formaciones y estrategias para ganar partidos.',
            'icono': 'Lightbulb',
            'color': '#f59e0b',
            'orden': 3
        },
        {
            'slug': 'preparacion-fisica',
            'nombre': 'Preparación Física',
            'descripcion': 'Ejercicios, rutinas y consejos para mejorar tu condición física.',
            'icono': 'Dumbbell',
            'color': '#ef4444',
            'orden': 4
        },
    ]

    secciones = {}
    for data in secciones_data:
        seccion, created = Seccion.objects.update_or_create(
            slug=data['slug'],
            defaults=data
        )
        secciones[data['slug']] = seccion
        print(f"{'Creada' if created else 'Actualizada'} sección: {seccion.nombre}")
    
    return secciones


def crear_temas_tecnicas(seccion):
    """Crear temas de Técnicas y Prácticas"""
    temas_data = [
        {
            'slug': 'control-balon',
            'titulo': 'Control y Dominio del Balón',
            'descripcion': 'Aprende a recibir y controlar el balón con diferentes partes del cuerpo.',
            'nivel': 'basico',
            'duracion_minutos': 45,
            'orden': 1,
            'contenidos': [
                {
                    'subtitulo': 'Introducción al Control del Balón',
                    'contenido': 'El control del balón es la habilidad fundamental que todo futbolista debe dominar. Consiste en la capacidad de recibir, amortiguar y mantener el balón bajo control utilizando diferentes partes del cuerpo. Un buen control te permite ganar tiempo, proteger el balón y preparar tu siguiente acción.',
                    'orden': 1
                },
                {
                    'subtitulo': 'Superficies de Contacto',
                    'contenido': 'Las principales superficies para controlar el balón son: Interior del pie (la más común y segura), Exterior del pie (para controles en movimiento), Empeine (para balones aéreos), Planta del pie (para parar el balón en seco), Pecho (para balones a media altura), Muslo (para amortiguar balones descendentes) y Cabeza (para controles aéreos avanzados).',
                    'orden': 2
                },
                {
                    'subtitulo': 'Técnica de Amortiguación',
                    'contenido': 'La amortiguación consiste en retirar la superficie de contacto en el momento del impacto para reducir la velocidad del balón. Es esencial para mantener el control en recepciones difíciles. Practica recibiendo balones de diferentes alturas y velocidades.',
                    'orden': 3
                },
                {
                    'subtitulo': 'Ejercicios Prácticos',
                    'contenido': '1. Lanza el balón al aire y contrólalo con el pie antes de que toque el suelo. 2. Pide a un compañero que te pase balones a diferentes alturas. 3. Practica contra una pared, controlando el rebote. 4. Realiza circuitos con conos donde debas controlar y girar.',
                    'orden': 4
                }
            ],
            'puntos_clave': [
                'Mantén la vista en el balón hasta el momento del contacto',
                'Relaja la superficie de contacto para amortiguar el impacto',
                'Posiciona tu cuerpo para proteger el balón del rival',
                'Practica con ambos pies para ser más versátil',
                'Anticipa la trayectoria del balón antes de recibirlo'
            ]
        },
        {
            'slug': 'conduccion-regate',
            'titulo': 'Conducción y Regate',
            'descripcion': 'Domina el arte de llevar el balón y superar rivales.',
            'nivel': 'basico',
            'duracion_minutos': 50,
            'orden': 2,
            'contenidos': [
                {
                    'subtitulo': 'Fundamentos de la Conducción',
                    'contenido': 'La conducción es la acción de desplazarse con el balón controlado. Una buena conducción te permite avanzar en el campo manteniendo la posesión. Usa toques suaves y frecuentes, mantén el balón cerca de tu cuerpo y levanta la cabeza para ver el campo.',
                    'orden': 1
                },
                {
                    'subtitulo': 'Tipos de Conducción',
                    'contenido': 'Conducción con interior: Mayor control y precisión. Conducción con exterior: Más velocidad y naturalidad. Conducción con empeine: Para sprints en línea recta. Conducción con planta: Para cambios de dirección rápidos.',
                    'orden': 2
                },
                {
                    'subtitulo': 'El Arte del Regate',
                    'contenido': 'El regate es la habilidad de superar a un rival en el uno contra uno. Requiere velocidad, creatividad y timing. Los regates más efectivos combinan fintas corporales con cambios de ritmo y dirección.',
                    'orden': 3
                },
                {
                    'subtitulo': 'Regates Básicos',
                    'contenido': 'La bicicleta: Pasa el pie por encima del balón de dentro hacia fuera. El recorte: Cambia de dirección bruscamente con el interior del pie. La croqueta: Pasa el balón de un pie al otro rápidamente. El túnel (caño): Pasa el balón entre las piernas del rival.',
                    'orden': 4
                }
            ],
            'puntos_clave': [
                'Mantén el balón cerca de tu cuerpo al conducir',
                'Levanta la cabeza para ver el campo y a tus compañeros',
                'Usa fintas corporales para engañar al rival',
                'Cambia de ritmo: lento-rápido es muy efectivo',
                'Practica regates con ambos pies'
            ]
        },
        {
            'slug': 'pase-precision',
            'titulo': 'El Pase y la Precisión',
            'descripcion': 'Aprende a distribuir el balón con precisión y efectividad.',
            'nivel': 'basico',
            'duracion_minutos': 40,
            'orden': 3,
            'contenidos': [
                {
                    'subtitulo': 'Importancia del Pase',
                    'contenido': 'El pase es el fundamento del juego colectivo. Un equipo que pasa bien el balón controla el partido. El pase conecta a los jugadores, crea espacios y permite avanzar hacia la portería rival de forma organizada.',
                    'orden': 1
                },
                {
                    'subtitulo': 'Tipos de Pase',
                    'contenido': 'Pase corto con interior: El más preciso y seguro. Pase largo con empeine: Para cambiar el juego. Pase con exterior: Para pases con efecto. Pase de tacón: Para sorprender al rival. Pase picado: Para superar líneas defensivas.',
                    'orden': 2
                },
                {
                    'subtitulo': 'Técnica del Pase',
                    'contenido': 'Coloca el pie de apoyo junto al balón apuntando al objetivo. Golpea el balón con la superficie adecuada. Acompaña el movimiento con todo el cuerpo. Mantén el equilibrio durante y después del pase.',
                    'orden': 3
                }
            ],
            'puntos_clave': [
                'El pie de apoyo debe apuntar hacia donde quieres enviar el balón',
                'Golpea el centro del balón para pases rasos',
                'Acompaña el movimiento con la pierna de golpeo',
                'Comunícate con tu compañero antes de pasar',
                'Varía la velocidad del pase según la situación'
            ]
        },
        {
            'slug': 'tiro-porteria',
            'titulo': 'Tiro a Portería',
            'descripcion': 'Técnicas para finalizar las jugadas y marcar goles.',
            'nivel': 'intermedio',
            'duracion_minutos': 55,
            'orden': 4,
            'contenidos': [
                {
                    'subtitulo': 'El Arte de Marcar Goles',
                    'contenido': 'El tiro a portería es el momento culminante del fútbol. Un buen rematador combina técnica, potencia, precisión y sangre fría. La práctica constante y la confianza son claves para ser un goleador.',
                    'orden': 1
                },
                {
                    'subtitulo': 'Tipos de Tiro',
                    'contenido': 'Tiro con empeine: Máxima potencia. Tiro colocado con interior: Precisión sobre potencia. Tiro con exterior: Efecto y sorpresa. Volea: Para balones aéreos. Remate de cabeza: Fundamental en el área.',
                    'orden': 2
                },
                {
                    'subtitulo': 'Dónde Apuntar',
                    'contenido': 'Los mejores lugares para tirar son: Las esquinas inferiores (difíciles de alcanzar para el portero), el palo largo (el portero cubre el corto), y el segundo palo en centros. Observa la posición del portero antes de tirar.',
                    'orden': 3
                }
            ],
            'puntos_clave': [
                'Mantén la cabeza sobre el balón para no elevarlo demasiado',
                'Apunta a las esquinas, son las zonas más difíciles para el portero',
                'No siempre necesitas potencia, a veces la colocación es mejor',
                'Practica con ambos pies para ser impredecible',
                'Mantén la calma frente al portero'
            ]
        },
    ]
    
    return crear_temas_con_contenido(seccion, temas_data)


def crear_temas_reglamentos(seccion):
    """Crear temas de Reglamentos FIFA"""
    temas_data = [
        {
            'slug': 'reglas-basicas',
            'titulo': 'Reglas Fundamentales del Fútbol',
            'descripcion': 'Las reglas básicas que todo jugador debe conocer.',
            'nivel': 'basico',
            'duracion_minutos': 30,
            'orden': 1,
            'contenidos': [
                {
                    'subtitulo': 'Composición del Equipo',
                    'contenido': 'Cada equipo está compuesto por 11 jugadores, incluyendo un portero. El partido no puede comenzar ni continuar si un equipo tiene menos de 7 jugadores. Se permiten hasta 3 sustituciones en partidos oficiales (5 en algunas competiciones).',
                    'orden': 1
                },
                {
                    'subtitulo': 'Duración del Partido',
                    'contenido': 'Un partido consta de dos tiempos de 45 minutos cada uno, con un descanso de 15 minutos entre ellos. El árbitro añade tiempo adicional por interrupciones (lesiones, sustituciones, celebraciones). En eliminatorias puede haber prórroga de 2x15 minutos.',
                    'orden': 2
                },
                {
                    'subtitulo': 'El Gol',
                    'contenido': 'Un gol se marca cuando el balón cruza completamente la línea de meta entre los postes y bajo el travesaño, siempre que no se haya cometido una infracción previa. El equipo que marca más goles gana el partido.',
                    'orden': 3
                }
            ],
            'puntos_clave': [
                '11 jugadores por equipo (mínimo 7 para jugar)',
                'Dos tiempos de 45 minutos con 15 de descanso',
                'Solo el portero puede usar las manos en su área',
                'El gol vale cuando el balón cruza completamente la línea',
                'El árbitro es la máxima autoridad en el campo'
            ]
        },
        {
            'slug': 'fuera-de-juego',
            'titulo': 'La Regla del Fuera de Juego',
            'descripcion': 'Entiende una de las reglas más complejas del fútbol.',
            'nivel': 'intermedio',
            'duracion_minutos': 35,
            'orden': 2,
            'contenidos': [
                {
                    'subtitulo': '¿Qué es el Fuera de Juego?',
                    'contenido': 'Un jugador está en posición de fuera de juego si está más cerca de la línea de meta rival que el balón Y el penúltimo adversario (normalmente el último defensor, ya que el portero suele ser el último). Estar en fuera de juego no es infracción por sí mismo.',
                    'orden': 1
                },
                {
                    'subtitulo': 'Cuándo se Sanciona',
                    'contenido': 'Se sanciona fuera de juego cuando un jugador en posición adelantada participa activamente en el juego: jugando el balón, interfiriendo con un adversario, o ganando ventaja de su posición. No hay fuera de juego en saque de banda, saque de esquina o saque de meta.',
                    'orden': 2
                },
                {
                    'subtitulo': 'El VAR y el Fuera de Juego',
                    'contenido': 'El VAR (Video Assistant Referee) revisa las jugadas de fuera de juego en competiciones profesionales. Se trazan líneas virtuales para determinar con precisión milimétrica si hay posición adelantada.',
                    'orden': 3
                }
            ],
            'puntos_clave': [
                'Debes estar detrás del penúltimo defensor cuando se juega el balón',
                'No hay fuera de juego en tu propio campo',
                'No hay fuera de juego en saques de banda, esquina o meta',
                'Estar en fuera de juego no es infracción hasta que participas en el juego',
                'El VAR puede revisar y corregir decisiones de fuera de juego'
            ]
        },
        {
            'slug': 'faltas-tarjetas',
            'titulo': 'Faltas y Tarjetas',
            'descripcion': 'Conoce las infracciones y sus sanciones.',
            'nivel': 'basico',
            'duracion_minutos': 40,
            'orden': 3,
            'contenidos': [
                {
                    'subtitulo': 'Tipos de Faltas',
                    'contenido': 'Las faltas directas incluyen: patear, zancadillear, empujar, cargar, golpear o escupir a un rival, y tocar el balón con la mano (excepto el portero en su área). Las faltas indirectas incluyen juego peligroso, obstrucción y faltas técnicas del portero.',
                    'orden': 1
                },
                {
                    'subtitulo': 'Tarjeta Amarilla',
                    'contenido': 'Se muestra por: conducta antideportiva, discutir con el árbitro, entrar o salir del campo sin permiso, no respetar la distancia en saques, retrasar el reinicio del juego, o quitarse la camiseta al celebrar. Dos amarillas = expulsión.',
                    'orden': 2
                },
                {
                    'subtitulo': 'Tarjeta Roja',
                    'contenido': 'Se muestra por: falta grave, conducta violenta, escupir, impedir un gol con la mano (no siendo portero), impedir una ocasión clara de gol con falta, lenguaje ofensivo, o recibir dos amarillas. El jugador expulsado no puede ser reemplazado.',
                    'orden': 3
                }
            ],
            'puntos_clave': [
                'Las faltas dentro del área se sancionan con penalti',
                'Dos tarjetas amarillas equivalen a una roja',
                'La tarjeta roja significa expulsión inmediata',
                'El equipo juega con un jugador menos tras una expulsión',
                'Algunas faltas pueden ser revisadas por el VAR'
            ]
        },
    ]
    
    return crear_temas_con_contenido(seccion, temas_data)


def crear_temas_tactica(seccion):
    """Crear temas de Táctica y Estrategia"""
    temas_data = [
        {
            'slug': 'formaciones-basicas',
            'titulo': 'Formaciones y Sistemas de Juego',
            'descripcion': 'Conoce las formaciones más utilizadas en el fútbol moderno.',
            'nivel': 'intermedio',
            'duracion_minutos': 45,
            'orden': 1,
            'contenidos': [
                {
                    'subtitulo': 'Qué es una Formación',
                    'contenido': 'Una formación es la disposición táctica de los jugadores en el campo. Se representa con números que indican defensas-centrocampistas-delanteros (ej: 4-3-3). La formación define las responsabilidades y zonas de cada jugador.',
                    'orden': 1
                },
                {
                    'subtitulo': 'Formaciones Populares',
                    'contenido': '4-4-2: Clásica y equilibrada. 4-3-3: Ofensiva con amplitud. 4-2-3-1: Control del mediocampo. 3-5-2: Dominio del centro. 5-3-2: Defensiva y contraataque. Cada formación tiene ventajas y desventajas según el rival.',
                    'orden': 2
                },
                {
                    'subtitulo': 'Elegir la Formación Correcta',
                    'contenido': 'La formación debe adaptarse a: las características de tus jugadores, el estilo de juego del rival, el resultado que necesitas, y las condiciones del partido. Los mejores equipos son flexibles y pueden cambiar de formación durante el juego.',
                    'orden': 3
                }
            ],
            'puntos_clave': [
                'No existe una formación perfecta, cada una tiene pros y contras',
                'La formación debe adaptarse a los jugadores disponibles',
                'Es importante poder cambiar de sistema durante el partido',
                'El 4-3-3 y 4-4-2 son las formaciones más equilibradas',
                'La comunicación entre jugadores es clave en cualquier sistema'
            ]
        },
        {
            'slug': 'pressing-presion',
            'titulo': 'Pressing y Presión Alta',
            'descripcion': 'Aprende a recuperar el balón mediante presión organizada.',
            'nivel': 'avanzado',
            'duracion_minutos': 50,
            'orden': 2,
            'contenidos': [
                {
                    'subtitulo': 'Qué es el Pressing',
                    'contenido': 'El pressing es una estrategia defensiva que busca recuperar el balón lo más cerca posible de la portería rival. Requiere coordinación, intensidad física y disciplina táctica. Equipos como el Liverpool de Klopp o el Barcelona de Guardiola son maestros del pressing.',
                    'orden': 1
                },
                {
                    'subtitulo': 'Tipos de Pressing',
                    'contenido': 'Pressing alto: Se presiona en campo rival, ideal para equipos dominantes. Pressing medio: Se espera al rival en el centro del campo. Pressing bajo: Se defiende cerca del área propia, útil para contraataques.',
                    'orden': 2
                },
                {
                    'subtitulo': 'Claves del Pressing Efectivo',
                    'contenido': 'Triggers (disparadores): Momentos para iniciar la presión (pase hacia atrás, mal control). Coberturas: Los compañeros deben cubrir las líneas de pase. Intensidad: Todos deben presionar al mismo tiempo. Recuperación: Saber cuándo replegar si la presión falla.',
                    'orden': 3
                }
            ],
            'puntos_clave': [
                'El pressing requiere que todo el equipo participe',
                'Identifica los "triggers" para iniciar la presión',
                'Cierra las líneas de pase mientras presionas',
                'El pressing alto desgasta físicamente, úsalo con inteligencia',
                'Si la presión falla, repliega rápidamente'
            ]
        },
    ]
    
    return crear_temas_con_contenido(seccion, temas_data)


def crear_temas_fisica(seccion):
    """Crear temas de Preparación Física"""
    temas_data = [
        {
            'slug': 'calentamiento',
            'titulo': 'Calentamiento y Prevención de Lesiones',
            'descripcion': 'Rutinas de calentamiento para preparar tu cuerpo.',
            'nivel': 'basico',
            'duracion_minutos': 25,
            'orden': 1,
            'contenidos': [
                {
                    'subtitulo': 'Importancia del Calentamiento',
                    'contenido': 'El calentamiento prepara tu cuerpo para el esfuerzo físico. Aumenta la temperatura muscular, mejora la elasticidad, activa el sistema cardiovascular y reduce el riesgo de lesiones. Nunca juegues sin calentar.',
                    'orden': 1
                },
                {
                    'subtitulo': 'Fases del Calentamiento',
                    'contenido': '1. Activación cardiovascular (5-10 min): Trote suave, skipping. 2. Movilidad articular (5 min): Rotaciones de tobillos, rodillas, cadera. 3. Estiramientos dinámicos (5 min): Zancadas, balanceos. 4. Ejercicios específicos (5 min): Pases, controles, sprints cortos.',
                    'orden': 2
                },
                {
                    'subtitulo': 'Errores Comunes',
                    'contenido': 'No calentar lo suficiente, hacer estiramientos estáticos antes del ejercicio (mejor después), no incluir ejercicios con balón, y no adaptar el calentamiento a las condiciones climáticas.',
                    'orden': 3
                }
            ],
            'puntos_clave': [
                'Dedica al menos 15-20 minutos al calentamiento',
                'Incluye ejercicios cardiovasculares, de movilidad y específicos',
                'Los estiramientos estáticos son mejores después del partido',
                'Adapta el calentamiento al clima (más largo en frío)',
                'Incluye ejercicios con balón para activar la coordinación'
            ]
        },
        {
            'slug': 'resistencia-velocidad',
            'titulo': 'Resistencia y Velocidad',
            'descripcion': 'Mejora tu capacidad aeróbica y explosividad.',
            'nivel': 'intermedio',
            'duracion_minutos': 40,
            'orden': 2,
            'contenidos': [
                {
                    'subtitulo': 'Resistencia en el Fútbol',
                    'contenido': 'Un futbolista recorre entre 10-13 km por partido. Necesitas resistencia aeróbica para mantener el ritmo durante 90 minutos y resistencia anaeróbica para esfuerzos intensos repetidos (sprints, saltos, duelos).',
                    'orden': 1
                },
                {
                    'subtitulo': 'Entrenamiento de Resistencia',
                    'contenido': 'Carrera continua: 20-40 minutos a ritmo moderado. Intervalos: Alternar alta y baja intensidad. Fartlek: Cambios de ritmo durante la carrera. Circuitos: Combinar ejercicios con poco descanso.',
                    'orden': 2
                },
                {
                    'subtitulo': 'Velocidad y Explosividad',
                    'contenido': 'La velocidad en fútbol incluye: velocidad de reacción, aceleración, velocidad máxima y velocidad con balón. Entrena con sprints cortos (10-30m), ejercicios de agilidad y cambios de dirección.',
                    'orden': 3
                }
            ],
            'puntos_clave': [
                'Combina entrenamiento aeróbico y anaeróbico',
                'Los intervalos son muy efectivos para el fútbol',
                'La velocidad se entrena con descansos completos entre repeticiones',
                'Incluye ejercicios de agilidad y cambios de dirección',
                'No descuides la recuperación entre sesiones intensas'
            ]
        },
    ]
    
    return crear_temas_con_contenido(seccion, temas_data)


def crear_temas_con_contenido(seccion, temas_data):
    """Función auxiliar para crear temas con sus contenidos y puntos clave"""
    temas_creados = []
    
    for tema_data in temas_data:
        contenidos = tema_data.pop('contenidos', [])
        puntos_clave = tema_data.pop('puntos_clave', [])
        
        tema, created = Tema.objects.update_or_create(
            seccion=seccion,
            slug=tema_data['slug'],
            defaults={**tema_data, 'seccion': seccion}
        )
        print(f"  {'Creado' if created else 'Actualizado'} tema: {tema.titulo}")
        
        # Eliminar contenidos y puntos clave existentes
        TemaContenido.objects.filter(tema=tema).delete()
        TemaPuntoClave.objects.filter(tema=tema).delete()
        
        # Crear contenidos
        for contenido_data in contenidos:
            TemaContenido.objects.create(tema=tema, **contenido_data)
        
        # Crear puntos clave
        for i, punto in enumerate(puntos_clave):
            TemaPuntoClave.objects.create(tema=tema, texto=punto, orden=i+1)
        
        temas_creados.append(tema)
    
    return temas_creados


def crear_logros():
    """Crear logros/insignias"""
    logros_data = [
        {
            'slug': 'primer-tema',
            'nombre': 'Primer Paso',
            'descripcion': 'Completaste tu primer tema de aprendizaje',
            'icono': '🎯',
            'color': '#00ff88',
            'puntos': 10,
            'temas_requeridos': 1
        },
        {
            'slug': 'tecnico-basico',
            'nombre': 'Técnico Básico',
            'descripcion': 'Completaste todos los temas de Técnicas y Prácticas',
            'icono': '⚽',
            'color': '#00ff88',
            'puntos': 50,
            'temas_requeridos': 0
        },
        {
            'slug': 'conocedor-reglas',
            'nombre': 'Conocedor de Reglas',
            'descripcion': 'Completaste todos los temas de Reglamentos FIFA',
            'icono': '📚',
            'color': '#3b82f6',
            'puntos': 50,
            'temas_requeridos': 0
        },
        {
            'slug': 'estratega',
            'nombre': 'Estratega',
            'descripcion': 'Completaste todos los temas de Táctica y Estrategia',
            'icono': '🧠',
            'color': '#f59e0b',
            'puntos': 50,
            'temas_requeridos': 0
        },
        {
            'slug': 'atleta',
            'nombre': 'Atleta Completo',
            'descripcion': 'Completaste todos los temas de Preparación Física',
            'icono': '💪',
            'color': '#ef4444',
            'puntos': 50,
            'temas_requeridos': 0
        },
        {
            'slug': 'maestro-futbol',
            'nombre': 'Maestro del Fútbol',
            'descripcion': 'Completaste todas las secciones de capacitación',
            'icono': '🏆',
            'color': '#FFD700',
            'puntos': 200,
            'temas_requeridos': 0
        },
    ]
    
    for data in logros_data:
        logro, created = Logro.objects.update_or_create(
            slug=data['slug'],
            defaults=data
        )
        print(f"{'Creado' if created else 'Actualizado'} logro: {logro.nombre}")


def main():
    """Función principal para poblar todo el contenido"""
    print("=" * 50)
    print("POBLANDO CONTENIDO DE CAPACITACIONES")
    print("=" * 50)
    
    # Crear secciones
    print("\n📁 Creando secciones...")
    secciones = crear_secciones()
    
    # Crear temas por sección
    print("\n📝 Creando temas de Técnicas y Prácticas...")
    crear_temas_tecnicas(secciones['tecnicas-practicas'])
    
    print("\n📝 Creando temas de Reglamentos FIFA...")
    crear_temas_reglamentos(secciones['reglamentos-fifa'])
    
    print("\n📝 Creando temas de Táctica y Estrategia...")
    crear_temas_tactica(secciones['tactica-estrategia'])
    
    print("\n📝 Creando temas de Preparación Física...")
    crear_temas_fisica(secciones['preparacion-fisica'])
    
    # Crear logros
    print("\n🏆 Creando logros...")
    crear_logros()
    
    # Resumen
    print("\n" + "=" * 50)
    print("✅ CONTENIDO POBLADO EXITOSAMENTE")
    print("=" * 50)
    print(f"Secciones: {Seccion.objects.count()}")
    print(f"Temas: {Tema.objects.count()}")
    print(f"Contenidos: {TemaContenido.objects.count()}")
    print(f"Puntos Clave: {TemaPuntoClave.objects.count()}")
    print(f"Logros: {Logro.objects.count()}")


if __name__ == '__main__':
    main()
