#!/usr/bin/env python
"""
Script para poblar las secciones de aprendizaje vacías con contenido de ejemplo
Ejecutar desde el directorio backend: python scripts/populate_empty_learning_sections.py
"""

import os
import sys
import django

# Configurar Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

from apps.learning.models import Seccion, Tema, TemaContenido, TemaPuntoClave


def crear_contenido_escuelas_formacion():
    """Crear contenido para Escuelas de Formación"""
    seccion = Seccion.objects.get(slug='escuelas-formacion')
    
    temas_data = [
        {
            'titulo': 'Metodología de Enseñanza Infantil',
            'slug': 'metodologia-ensenanza-infantil',
            'descripcion': 'Técnicas especializadas para enseñar fútbol a niños de 6-12 años',
            'nivel': 'basico',
            'duracion_minutos': 45,
            'contenidos': [
                {
                    'subtitulo': 'Principios Básicos de la Enseñanza Infantil',
                    'contenido': 'La enseñanza del fútbol a niños requiere un enfoque especial que combine diversión, aprendizaje y desarrollo motor. Los niños aprenden mejor a través del juego y la repetición positiva.'
                },
                {
                    'subtitulo': 'Estructura de una Sesión de Entrenamiento',
                    'contenido': 'Una sesión típica debe incluir: calentamiento lúdico (10 min), ejercicios técnicos básicos (15 min), juegos aplicados (15 min) y vuelta a la calma (5 min).'
                }
            ],
            'puntos_clave': [
                'Priorizar la diversión sobre la competencia',
                'Usar ejercicios con balón desde el primer minuto',
                'Dar instrucciones simples y claras',
                'Reforzar positivamente todos los intentos'
            ]
        },
        {
            'titulo': 'Desarrollo de Academias Juveniles',
            'slug': 'desarrollo-academias-juveniles',
            'descripcion': 'Cómo estructurar y gestionar una academia de fútbol juvenil exitosa',
            'nivel': 'intermedio',
            'duracion_minutos': 60,
            'contenidos': [
                {
                    'subtitulo': 'Planificación Curricular por Edades',
                    'contenido': 'Cada categoría requiere objetivos específicos: Sub-8 (coordinación básica), Sub-10 (técnica individual), Sub-12 (técnica grupal), Sub-14 (táctica básica).'
                },
                {
                    'subtitulo': 'Gestión de Recursos y Personal',
                    'contenido': 'Una academia exitosa necesita: entrenadores certificados, instalaciones adecuadas, material deportivo de calidad y un programa de seguimiento individual.'
                }
            ],
            'puntos_clave': [
                'Definir objetivos claros por categoría',
                'Contratar entrenadores especializados en formación',
                'Mantener comunicación constante con padres',
                'Evaluar progreso individual regularmente'
            ]
        },
        {
            'titulo': 'Psicología Deportiva en Formación',
            'slug': 'psicologia-deportiva-formacion',
            'descripcion': 'Aspectos psicológicos clave en el desarrollo de jóvenes futbolistas',
            'nivel': 'avanzado',
            'duracion_minutos': 50,
            'contenidos': [
                {
                    'subtitulo': 'Motivación y Autoestima',
                    'contenido': 'El desarrollo de la autoestima es fundamental. Los jóvenes necesitan sentirse valorados por su esfuerzo, no solo por sus resultados.'
                },
                {
                    'subtitulo': 'Manejo de la Presión Competitiva',
                    'contenido': 'Enseñar a los jóvenes a manejar la presión de la competencia, enfocándose en el proceso de aprendizaje más que en ganar o perder.'
                }
            ],
            'puntos_clave': [
                'Reforzar el esfuerzo sobre el resultado',
                'Enseñar técnicas de relajación básicas',
                'Fomentar la comunicación abierta',
                'Crear un ambiente de apoyo mutuo'
            ]
        }
    ]
    
    for tema_data in temas_data:
        tema = Tema.objects.create(
            seccion=seccion,
            titulo=tema_data['titulo'],
            slug=tema_data['slug'],
            descripcion=tema_data['descripcion'],
            nivel=tema_data['nivel'],
            duracion_minutos=tema_data['duracion_minutos'],
            orden=len(temas_data)
        )
        
        for i, contenido_data in enumerate(tema_data['contenidos']):
            TemaContenido.objects.create(
                tema=tema,
                subtitulo=contenido_data['subtitulo'],
                contenido=contenido_data['contenido'],
                orden=i + 1
            )
        
        for i, punto in enumerate(tema_data['puntos_clave']):
            TemaPuntoClave.objects.create(
                tema=tema,
                texto=punto,
                orden=i + 1
            )
    
    print(f"✅ Creados {len(temas_data)} temas para Escuelas de Formación")


def crear_contenido_reglamentos_arbitros():
    """Crear contenido para Reglamentos de Árbitros"""
    seccion = Seccion.objects.get(slug='reglamentos-arbitros')
    
    temas_data = [
        {
            'titulo': 'Fundamentos del Arbitraje',
            'slug': 'fundamentos-arbitraje',
            'descripcion': 'Principios básicos y responsabilidades del árbitro de fútbol',
            'nivel': 'basico',
            'duracion_minutos': 40,
            'contenidos': [
                {
                    'subtitulo': 'Rol y Responsabilidades del Árbitro',
                    'contenido': 'El árbitro es la máxima autoridad en el campo. Sus decisiones son finales y debe aplicar las reglas de manera justa e imparcial.'
                },
                {
                    'subtitulo': 'Posicionamiento en el Campo',
                    'contenido': 'El árbitro debe mantener una posición que le permita ver claramente las jugadas, generalmente en diagonal y siguiendo el balón.'
                }
            ],
            'puntos_clave': [
                'Mantener autoridad sin ser autoritario',
                'Comunicarse claramente con jugadores',
                'Posicionarse correctamente en cada jugada',
                'Tomar decisiones con confianza'
            ]
        },
        {
            'titulo': 'Señales y Comunicación',
            'slug': 'senales-comunicacion',
            'descripcion': 'Sistema de señales oficiales y comunicación efectiva en el arbitraje',
            'nivel': 'intermedio',
            'duracion_minutos': 35,
            'contenidos': [
                {
                    'subtitulo': 'Señales Básicas del Árbitro',
                    'contenido': 'Cada decisión debe acompañarse de la señal correspondiente: brazo extendido para faltas, tarjetas mostradas claramente, señalización de córners y saques.'
                },
                {
                    'subtitulo': 'Comunicación con Asistentes',
                    'contenido': 'La coordinación con los árbitros asistentes es crucial. Deben establecer contacto visual y usar señales acordadas previamente.'
                }
            ],
            'puntos_clave': [
                'Usar señales claras y visibles',
                'Mantener comunicación constante con asistentes',
                'Explicar decisiones cuando sea necesario',
                'Ser consistente en las señalizaciones'
            ]
        }
    ]
    
    for tema_data in temas_data:
        tema = Tema.objects.create(
            seccion=seccion,
            titulo=tema_data['titulo'],
            slug=tema_data['slug'],
            descripcion=tema_data['descripcion'],
            nivel=tema_data['nivel'],
            duracion_minutos=tema_data['duracion_minutos'],
            orden=len(temas_data)
        )
        
        for i, contenido_data in enumerate(tema_data['contenidos']):
            TemaContenido.objects.create(
                tema=tema,
                subtitulo=contenido_data['subtitulo'],
                contenido=contenido_data['contenido'],
                orden=i + 1
            )
        
        for i, punto in enumerate(tema_data['puntos_clave']):
            TemaPuntoClave.objects.create(
                tema=tema,
                texto=punto,
                orden=i + 1
            )
    
    print(f"✅ Creados {len(temas_data)} temas para Reglamentos de Árbitros")


def crear_contenido_estructura_sede():
    """Crear contenido para Estructura de Sede Deportiva"""
    seccion = Seccion.objects.get(slug='estructura-sede')
    
    temas_data = [
        {
            'titulo': 'Diseño de Instalaciones Deportivas',
            'slug': 'diseno-instalaciones',
            'descripcion': 'Planificación y diseño de complejos deportivos modernos',
            'nivel': 'intermedio',
            'duracion_minutos': 55,
            'contenidos': [
                {
                    'subtitulo': 'Requisitos Básicos de una Sede',
                    'contenido': 'Una sede deportiva debe incluir: campos reglamentarios, vestuarios, área médica, estacionamiento, cafetería y oficinas administrativas.'
                },
                {
                    'subtitulo': 'Consideraciones de Seguridad',
                    'contenido': 'La seguridad es prioritaria: salidas de emergencia, iluminación adecuada, sistemas contra incendios y control de acceso.'
                }
            ],
            'puntos_clave': [
                'Cumplir normativas locales de construcción',
                'Diseñar pensando en la accesibilidad',
                'Incluir áreas de esparcimiento familiar',
                'Planificar el crecimiento futuro'
            ]
        },
        {
            'titulo': 'Gestión y Mantenimiento',
            'slug': 'gestion-mantenimiento',
            'descripcion': 'Administración eficiente de instalaciones deportivas',
            'nivel': 'avanzado',
            'duracion_minutos': 45,
            'contenidos': [
                {
                    'subtitulo': 'Mantenimiento Preventivo',
                    'contenido': 'El mantenimiento regular previene problemas mayores: revisión de césped, sistemas eléctricos, plomería y estructuras.'
                },
                {
                    'subtitulo': 'Gestión de Recursos',
                    'contenido': 'Optimizar el uso de instalaciones mediante horarios eficientes, tarifas competitivas y servicios adicionales.'
                }
            ],
            'puntos_clave': [
                'Crear calendarios de mantenimiento',
                'Capacitar al personal en procedimientos',
                'Mantener inventario de repuestos',
                'Documentar todas las actividades'
            ]
        }
    ]
    
    for tema_data in temas_data:
        tema = Tema.objects.create(
            seccion=seccion,
            titulo=tema_data['titulo'],
            slug=tema_data['slug'],
            descripcion=tema_data['descripcion'],
            nivel=tema_data['nivel'],
            duracion_minutos=tema_data['duracion_minutos'],
            orden=len(temas_data)
        )
        
        for i, contenido_data in enumerate(tema_data['contenidos']):
            TemaContenido.objects.create(
                tema=tema,
                subtitulo=contenido_data['subtitulo'],
                contenido=contenido_data['contenido'],
                orden=i + 1
            )
        
        for i, punto in enumerate(tema_data['puntos_clave']):
            TemaPuntoClave.objects.create(
                tema=tema,
                texto=punto,
                orden=i + 1
            )
    
    print(f"✅ Creados {len(temas_data)} temas para Estructura de Sede Deportiva")


def crear_contenido_conferencias_coaches():
    """Crear contenido para Conferencias para Coaches"""
    seccion = Seccion.objects.get(slug='conferencias-coaches')
    
    temas_data = [
        {
            'titulo': 'Liderazgo en el Fútbol Moderno',
            'slug': 'liderazgo-futbol-moderno',
            'descripcion': 'Desarrollo de habilidades de liderazgo para entrenadores contemporáneos',
            'nivel': 'avanzado',
            'duracion_minutos': 60,
            'contenidos': [
                {
                    'subtitulo': 'Estilos de Liderazgo Efectivos',
                    'contenido': 'Los entrenadores modernos deben adaptar su estilo: democrático para decisiones grupales, autocrático para situaciones críticas.'
                },
                {
                    'subtitulo': 'Comunicación Inspiradora',
                    'contenido': 'La comunicación debe motivar y educar. Usar ejemplos concretos, mantener mensajes claros y adaptar el lenguaje a cada jugador.'
                }
            ],
            'puntos_clave': [
                'Adaptar el liderazgo a cada situación',
                'Inspirar confianza en momentos difíciles',
                'Fomentar la responsabilidad individual',
                'Crear una cultura de equipo sólida'
            ]
        },
        {
            'titulo': 'Innovación Táctica Contemporánea',
            'slug': 'innovacion-tactica',
            'descripcion': 'Tendencias actuales en táctica y estrategia futbolística',
            'nivel': 'avanzado',
            'duracion_minutos': 70,
            'contenidos': [
                {
                    'subtitulo': 'Evolución de los Sistemas de Juego',
                    'contenido': 'El fútbol moderno ha evolucionado hacia sistemas más fluidos: 4-3-3 falso 9, 3-5-2 con carrileros, pressing alto coordinado.'
                },
                {
                    'subtitulo': 'Análisis de Video y Datos',
                    'contenido': 'El uso de tecnología para análisis táctico: software de video, métricas de rendimiento, mapas de calor y análisis de oponentes.'
                }
            ],
            'puntos_clave': [
                'Mantenerse actualizado con tendencias globales',
                'Usar tecnología para mejorar análisis',
                'Adaptar tácticas al personal disponible',
                'Equilibrar innovación con fundamentos'
            ]
        }
    ]
    
    for tema_data in temas_data:
        tema = Tema.objects.create(
            seccion=seccion,
            titulo=tema_data['titulo'],
            slug=tema_data['slug'],
            descripcion=tema_data['descripcion'],
            nivel=tema_data['nivel'],
            duracion_minutos=tema_data['duracion_minutos'],
            orden=len(temas_data)
        )
        
        for i, contenido_data in enumerate(tema_data['contenidos']):
            TemaContenido.objects.create(
                tema=tema,
                subtitulo=contenido_data['subtitulo'],
                contenido=contenido_data['contenido'],
                orden=i + 1
            )
        
        for i, punto in enumerate(tema_data['puntos_clave']):
            TemaPuntoClave.objects.create(
                tema=tema,
                texto=punto,
                orden=i + 1
            )
    
    print(f"✅ Creados {len(temas_data)} temas para Conferencias para Coaches")


def crear_contenido_representacion_jugadores():
    """Crear contenido para Representación de Jugadores"""
    seccion = Seccion.objects.get(slug='representacion-jugadores')
    
    temas_data = [
        {
            'titulo': 'Fundamentos de la Representación Deportiva',
            'slug': 'fundamentos-representacion',
            'descripcion': 'Principios básicos del trabajo como agente de jugadores',
            'nivel': 'intermedio',
            'duracion_minutos': 50,
            'contenidos': [
                {
                    'subtitulo': 'Marco Legal y Regulatorio',
                    'contenido': 'Los agentes deben estar licenciados por FIFA, conocer regulaciones locales y mantener ética profesional en todas las negociaciones.'
                },
                {
                    'subtitulo': 'Desarrollo de Carrera del Jugador',
                    'contenido': 'Un buen agente planifica la carrera a largo plazo: desarrollo técnico, oportunidades de crecimiento, estabilidad financiera.'
                }
            ],
            'puntos_clave': [
                'Obtener licencia oficial de agente FIFA',
                'Priorizar intereses del jugador siempre',
                'Mantener red de contactos profesional',
                'Conocer mercados internacionales'
            ]
        },
        {
            'titulo': 'Negociación de Contratos',
            'slug': 'negociacion-contratos',
            'descripcion': 'Técnicas y estrategias para negociar contratos exitosos',
            'nivel': 'avanzado',
            'duracion_minutos': 65,
            'contenidos': [
                {
                    'subtitulo': 'Estructura de Contratos Profesionales',
                    'contenido': 'Los contratos incluyen: salario base, bonos por rendimiento, cláusulas de rescisión, derechos de imagen y beneficios adicionales.'
                },
                {
                    'subtitulo': 'Estrategias de Negociación',
                    'contenido': 'Preparación exhaustiva, conocimiento del mercado, flexibilidad en términos no esenciales y firmeza en puntos clave.'
                }
            ],
            'puntos_clave': [
                'Investigar valor de mercado del jugador',
                'Preparar alternativas antes de negociar',
                'Mantener relaciones cordiales con clubes',
                'Documentar todos los acuerdos'
            ]
        }
    ]
    
    for tema_data in temas_data:
        tema = Tema.objects.create(
            seccion=seccion,
            titulo=tema_data['titulo'],
            slug=tema_data['slug'],
            descripcion=tema_data['descripcion'],
            nivel=tema_data['nivel'],
            duracion_minutos=tema_data['duracion_minutos'],
            orden=len(temas_data)
        )
        
        for i, contenido_data in enumerate(tema_data['contenidos']):
            TemaContenido.objects.create(
                tema=tema,
                subtitulo=contenido_data['subtitulo'],
                contenido=contenido_data['contenido'],
                orden=i + 1
            )
        
        for i, punto in enumerate(tema_data['puntos_clave']):
            TemaPuntoClave.objects.create(
                tema=tema,
                texto=punto,
                orden=i + 1
            )
    
    print(f"✅ Creados {len(temas_data)} temas para Representación de Jugadores")


def crear_contenido_educacion_idiomas():
    """Crear contenido para Educación de Idiomas"""
    seccion = Seccion.objects.get(slug='educacion-idiomas')
    
    temas_data = [
        {
            'titulo': 'Inglés para Futbolistas',
            'slug': 'ingles-futbolistas',
            'descripcion': 'Vocabulario y comunicación en inglés específico para el fútbol',
            'nivel': 'basico',
            'duracion_minutos': 40,
            'contenidos': [
                {
                    'subtitulo': 'Vocabulario Técnico Básico',
                    'contenido': 'Términos esenciales: pass (pase), shoot (disparar), tackle (entrada), offside (fuera de juego), corner kick (córner).'
                },
                {
                    'subtitulo': 'Comunicación en el Campo',
                    'contenido': 'Frases útiles durante el juego: "Man on!" (¡tienes marca!), "Time!" (¡tienes tiempo!), "Switch play!" (¡cambia el juego!).'
                }
            ],
            'puntos_clave': [
                'Practicar pronunciación de términos técnicos',
                'Aprender frases de comunicación rápida',
                'Estudiar reglamento en inglés',
                'Practicar con compañeros de equipo'
            ]
        },
        {
            'titulo': 'Español para Futbolistas Internacionales',
            'slug': 'espanol-futbolistas',
            'descripcion': 'Comunicación efectiva en español para jugadores extranjeros',
            'nivel': 'basico',
            'duracion_minutos': 40,
            'contenidos': [
                {
                    'subtitulo': 'Vocabulario Futbolístico en Español',
                    'contenido': 'Términos clave: pelota, gol, pase, tiro, falta, córner, fuera de juego, tarjeta amarilla, tarjeta roja.'
                },
                {
                    'subtitulo': 'Instrucciones del Entrenador',
                    'contenido': 'Comprender órdenes: "¡Presiona!", "¡Marca!", "¡Corre!", "¡Pasa!", "¡Dispara!", "¡Defiende!".'
                }
            ],
            'puntos_clave': [
                'Memorizar vocabulario básico del fútbol',
                'Practicar escucha de instrucciones',
                'Aprender números y tiempo en español',
                'Comunicarse con aficionados locales'
            ]
        },
        {
            'titulo': 'Portugués para Ligas Sudamericanas',
            'slug': 'portugues-ligas-sudamericanas',
            'descripcion': 'Preparación lingüística para jugar en Brasil y Portugal',
            'nivel': 'intermedio',
            'duracion_minutos': 45,
            'contenidos': [
                {
                    'subtitulo': 'Diferencias entre Portugués Brasileño y Europeo',
                    'contenido': 'Aunque similares, hay diferencias en pronunciación y vocabulario futbolístico entre Brasil y Portugal.'
                },
                {
                    'subtitulo': 'Cultura Futbolística Lusófona',
                    'contenido': 'Entender la pasión por el fútbol en países de habla portuguesa y las tradiciones locales.'
                }
            ],
            'puntos_clave': [
                'Distinguir acentos brasileño y portugués',
                'Aprender jerga futbolística local',
                'Comprender cultura de cada país',
                'Practicar con hablantes nativos'
            ]
        }
    ]
    
    for tema_data in temas_data:
        tema = Tema.objects.create(
            seccion=seccion,
            titulo=tema_data['titulo'],
            slug=tema_data['slug'],
            descripcion=tema_data['descripcion'],
            nivel=tema_data['nivel'],
            duracion_minutos=tema_data['duracion_minutos'],
            orden=len(temas_data)
        )
        
        for i, contenido_data in enumerate(tema_data['contenidos']):
            TemaContenido.objects.create(
                tema=tema,
                subtitulo=contenido_data['subtitulo'],
                contenido=contenido_data['contenido'],
                orden=i + 1
            )
        
        for i, punto in enumerate(tema_data['puntos_clave']):
            TemaPuntoClave.objects.create(
                tema=tema,
                texto=punto,
                orden=i + 1
            )
    
    print(f"✅ Creados {len(temas_data)} temas para Educación de Idiomas")


def main():
    """Función principal para ejecutar la población de contenido"""
    print("🚀 Iniciando población de secciones de aprendizaje vacías...")
    print("=" * 60)
    
    try:
        crear_contenido_escuelas_formacion()
        crear_contenido_reglamentos_arbitros()
        crear_contenido_estructura_sede()
        crear_contenido_conferencias_coaches()
        crear_contenido_representacion_jugadores()
        crear_contenido_educacion_idiomas()
        
        print("=" * 60)
        print("✅ ¡Población completada exitosamente!")
        print("\n📊 Resumen final:")
        
        # Mostrar estadísticas finales
        from apps.learning.models import Seccion, Tema, TemaContenido, TemaPuntoClave
        
        total_secciones = Seccion.objects.count()
        total_temas = Tema.objects.count()
        total_contenidos = TemaContenido.objects.count()
        total_puntos = TemaPuntoClave.objects.count()
        
        print(f"📚 Secciones totales: {total_secciones}")
        print(f"📖 Temas totales: {total_temas}")
        print(f"📝 Contenidos totales: {total_contenidos}")
        print(f"💡 Puntos clave totales: {total_puntos}")
        
        print("\n🌐 Accede al admin de Django en:")
        print("http://127.0.0.1:8000/admin/learning/seccion/")
        
    except Exception as e:
        print(f"❌ Error durante la población: {str(e)}")
        sys.exit(1)


if __name__ == '__main__':
    main()