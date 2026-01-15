from django.core.management.base import BaseCommand
from apps.learning.models import Seccion, Tema, TemaContenido, TemaPuntoClave, Logro


class Command(BaseCommand):
    help = 'Poblar la base de datos con contenido de capacitaciones'

    def handle(self, *args, **options):
        self.stdout.write('Poblando contenido de capacitaciones...')
        
        # Crear secciones
        secciones = self.crear_secciones()
        
        # Crear temas
        self.crear_temas_tecnicas(secciones['tecnicas-practicas'])
        self.crear_temas_reglamentos(secciones['reglamentos-fifa'])
        self.crear_temas_tactica(secciones['tactica-estrategia'])
        self.crear_temas_fisica(secciones['preparacion-fisica'])
        
        # Crear logros
        self.crear_logros()
        
        self.stdout.write(self.style.SUCCESS('Contenido poblado exitosamente!'))
        self.stdout.write(f'Secciones: {Seccion.objects.count()}')
        self.stdout.write(f'Temas: {Tema.objects.count()}')
        self.stdout.write(f'Contenidos: {TemaContenido.objects.count()}')
        self.stdout.write(f'Puntos Clave: {TemaPuntoClave.objects.count()}')

    def crear_secciones(self):
        secciones_data = [
            {'slug': 'tecnicas-practicas', 'nombre': 'Tecnicas y Practicas',
             'descripcion': 'Aprende las tecnicas fundamentales del futbol.',
             'icono': 'Target', 'color': '#00ff88', 'orden': 1},
            {'slug': 'reglamentos-fifa', 'nombre': 'Reglamentos FIFA',
             'descripcion': 'Conoce las reglas oficiales del futbol.',
             'icono': 'BookOpen', 'color': '#3b82f6', 'orden': 2},
            {'slug': 'tactica-estrategia', 'nombre': 'Tactica y Estrategia',
             'descripcion': 'Sistemas de juego y estrategias.',
             'icono': 'Lightbulb', 'color': '#f59e0b', 'orden': 3},
            {'slug': 'preparacion-fisica', 'nombre': 'Preparacion Fisica',
             'descripcion': 'Ejercicios para mejorar tu condicion fisica.',
             'icono': 'Dumbbell', 'color': '#ef4444', 'orden': 4},
        ]
        secciones = {}
        for data in secciones_data:
            s, _ = Seccion.objects.update_or_create(slug=data['slug'], defaults=data)
            secciones[data['slug']] = s
            self.stdout.write(f'  Seccion: {s.nombre}')
        return secciones

    def crear_tema(self, seccion, slug, titulo, desc, nivel, duracion, orden, contenidos, puntos):
        tema, _ = Tema.objects.update_or_create(
            seccion=seccion, slug=slug,
            defaults={'titulo': titulo, 'descripcion': desc, 'nivel': nivel,
                      'duracion_minutos': duracion, 'orden': orden}
        )
        TemaContenido.objects.filter(tema=tema).delete()
        TemaPuntoClave.objects.filter(tema=tema).delete()
        for i, c in enumerate(contenidos):
            TemaContenido.objects.create(tema=tema, subtitulo=c[0], contenido=c[1], orden=i+1)
        for i, p in enumerate(puntos):
            TemaPuntoClave.objects.create(tema=tema, texto=p, orden=i+1)
        self.stdout.write(f'    Tema: {titulo}')
        return tema

    def crear_temas_tecnicas(self, seccion):
        self.crear_tema(seccion, 'control-balon', 'Control y Dominio del Balon',
            'Aprende a recibir y controlar el balon.', 'basico', 45, 1,
            [('Introduccion', 'El control del balon es la habilidad fundamental. Consiste en recibir, amortiguar y mantener el balon bajo control.'),
             ('Superficies de Contacto', 'Interior del pie, exterior, empeine, planta, pecho, muslo y cabeza.'),
             ('Tecnica de Amortiguacion', 'Retira la superficie de contacto en el momento del impacto para reducir la velocidad.'),
             ('Ejercicios', 'Lanza el balon al aire y controlalo. Practica contra una pared.')],
            ['Manten la vista en el balon', 'Relaja la superficie de contacto', 'Posiciona tu cuerpo para proteger', 'Practica con ambos pies'])
        
        self.crear_tema(seccion, 'conduccion-regate', 'Conduccion y Regate',
            'Domina el arte de llevar el balon y superar rivales.', 'basico', 50, 2,
            [('Fundamentos', 'La conduccion es desplazarse con el balon controlado. Usa toques suaves y frecuentes.'),
             ('Tipos de Conduccion', 'Con interior (control), exterior (velocidad), empeine (sprints), planta (cambios).'),
             ('El Arte del Regate', 'Superar al rival en el uno contra uno. Combina fintas con cambios de ritmo.'),
             ('Regates Basicos', 'La bicicleta, el recorte, la croqueta, el tunel (cano).')],
            ['Manten el balon cerca', 'Levanta la cabeza', 'Usa fintas corporales', 'Cambia de ritmo', 'Practica con ambos pies'])
        
        self.crear_tema(seccion, 'pase-precision', 'El Pase y la Precision',
            'Aprende a distribuir el balon con precision.', 'basico', 40, 3,
            [('Importancia', 'El pase es el fundamento del juego colectivo. Conecta jugadores y crea espacios.'),
             ('Tipos de Pase', 'Corto con interior, largo con empeine, con exterior, de tacon, picado.'),
             ('Tecnica', 'Pie de apoyo junto al balon apuntando al objetivo. Golpea con la superficie adecuada.')],
            ['El pie de apoyo apunta al objetivo', 'Golpea el centro del balon', 'Acompana el movimiento', 'Comunicate con tu companero'])
        
        self.crear_tema(seccion, 'tiro-porteria', 'Tiro a Porteria',
            'Tecnicas para finalizar y marcar goles.', 'intermedio', 55, 4,
            [('El Arte de Marcar', 'El tiro es el momento culminante. Combina tecnica, potencia y precision.'),
             ('Tipos de Tiro', 'Con empeine (potencia), colocado con interior, con exterior, volea, cabeza.'),
             ('Donde Apuntar', 'Esquinas inferiores, palo largo, segundo palo en centros.')],
            ['Cabeza sobre el balon', 'Apunta a las esquinas', 'No siempre necesitas potencia', 'Practica con ambos pies', 'Manten la calma'])

    def crear_temas_reglamentos(self, seccion):
        self.crear_tema(seccion, 'reglas-basicas', 'Reglas Fundamentales',
            'Las reglas basicas que todo jugador debe conocer.', 'basico', 30, 1,
            [('Composicion del Equipo', '11 jugadores por equipo incluyendo portero. Minimo 7 para jugar.'),
             ('Duracion del Partido', 'Dos tiempos de 45 minutos con 15 de descanso. El arbitro anade tiempo adicional.'),
             ('El Gol', 'Se marca cuando el balon cruza completamente la linea de meta.')],
            ['11 jugadores (minimo 7)', 'Dos tiempos de 45 min', 'Solo el portero usa las manos en su area', 'El arbitro es la maxima autoridad'])
        
        self.crear_tema(seccion, 'fuera-de-juego', 'La Regla del Fuera de Juego',
            'Entiende una de las reglas mas complejas.', 'intermedio', 35, 2,
            [('Que es', 'Estar mas cerca de la linea de meta que el penultimo adversario cuando se juega el balon.'),
             ('Cuando se Sanciona', 'Cuando participas activamente: jugando el balon o interfiriendo.'),
             ('El VAR', 'Revisa las jugadas con lineas virtuales para precision milimetrica.')],
            ['Detras del penultimo defensor', 'No hay fuera de juego en tu campo', 'No en saques de banda/esquina/meta', 'El VAR puede corregir'])
        
        self.crear_tema(seccion, 'faltas-tarjetas', 'Faltas y Tarjetas',
            'Conoce las infracciones y sus sanciones.', 'basico', 40, 3,
            [('Tipos de Faltas', 'Directas: patear, zancadillear, empujar, mano. Indirectas: juego peligroso, obstruccion.'),
             ('Tarjeta Amarilla', 'Conducta antideportiva, discutir, no respetar distancia. Dos amarillas = expulsion.'),
             ('Tarjeta Roja', 'Falta grave, conducta violenta, impedir gol con mano, lenguaje ofensivo.')],
            ['Faltas en el area = penalti', 'Dos amarillas = roja', 'Roja = expulsion inmediata', 'El VAR puede revisar'])

    def crear_temas_tactica(self, seccion):
        self.crear_tema(seccion, 'formaciones-basicas', 'Formaciones y Sistemas',
            'Conoce las formaciones mas utilizadas.', 'intermedio', 45, 1,
            [('Que es una Formacion', 'Disposicion tactica de jugadores. Se representa con numeros: defensas-centrocampistas-delanteros.'),
             ('Formaciones Populares', '4-4-2 clasica, 4-3-3 ofensiva, 4-2-3-1 control, 3-5-2 dominio centro, 5-3-2 defensiva.'),
             ('Elegir la Correcta', 'Adaptar a tus jugadores, al rival, al resultado que necesitas.')],
            ['No existe formacion perfecta', 'Adaptar a los jugadores', 'Poder cambiar durante el partido', '4-3-3 y 4-4-2 son equilibradas'])
        
        self.crear_tema(seccion, 'pressing-presion', 'Pressing y Presion Alta',
            'Aprende a recuperar el balon mediante presion.', 'avanzado', 50, 2,
            [('Que es el Pressing', 'Estrategia defensiva para recuperar el balon cerca de la porteria rival.'),
             ('Tipos de Pressing', 'Alto (campo rival), medio (centro), bajo (cerca del area propia).'),
             ('Claves del Pressing', 'Triggers para iniciar, coberturas de companeros, intensidad coordinada.')],
            ['Todo el equipo debe participar', 'Identifica los triggers', 'Cierra lineas de pase', 'Desgasta fisicamente', 'Repliega si falla'])

    def crear_temas_fisica(self, seccion):
        self.crear_tema(seccion, 'calentamiento', 'Calentamiento y Prevencion',
            'Rutinas de calentamiento para preparar tu cuerpo.', 'basico', 25, 1,
            [('Importancia', 'Prepara tu cuerpo, aumenta temperatura muscular, reduce riesgo de lesiones.'),
             ('Fases', '1. Activacion cardiovascular (5-10 min). 2. Movilidad articular (5 min). 3. Estiramientos dinamicos (5 min). 4. Ejercicios especificos (5 min).'),
             ('Errores Comunes', 'No calentar suficiente, estiramientos estaticos antes del ejercicio.')],
            ['15-20 minutos minimo', 'Cardiovascular + movilidad + especificos', 'Estaticos despues del partido', 'Adaptar al clima'])
        
        self.crear_tema(seccion, 'resistencia-velocidad', 'Resistencia y Velocidad',
            'Mejora tu capacidad aerobica y explosividad.', 'intermedio', 40, 2,
            [('Resistencia', 'Un futbolista recorre 10-13 km por partido. Necesitas aerobica y anaerobica.'),
             ('Entrenamiento', 'Carrera continua 20-40 min, intervalos, fartlek, circuitos.'),
             ('Velocidad', 'Reaccion, aceleracion, maxima, con balon. Sprints cortos 10-30m.')],
            ['Combina aerobico y anaerobico', 'Intervalos muy efectivos', 'Descansos completos para velocidad', 'Incluye agilidad', 'No descuides recuperacion'])

    def crear_logros(self):
        logros = [
            {'slug': 'primer-tema', 'nombre': 'Primer Paso', 'descripcion': 'Completaste tu primer tema',
             'icono': 'Target', 'color': '#00ff88', 'puntos': 10, 'temas_requeridos': 1},
            {'slug': 'maestro-futbol', 'nombre': 'Maestro del Futbol', 'descripcion': 'Completaste todas las secciones',
             'icono': 'Trophy', 'color': '#FFD700', 'puntos': 200, 'temas_requeridos': 0},
        ]
        for data in logros:
            Logro.objects.update_or_create(slug=data['slug'], defaults=data)
            self.stdout.write(f'  Logro: {data["nombre"]}')
