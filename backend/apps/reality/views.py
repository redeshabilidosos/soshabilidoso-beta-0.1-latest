"""
Vistas para el registro de participantes del Reality Show
"""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Participante
from .serializers import ParticipanteSerializer
from .google_sheets import send_to_google_sheets
import logging

logger = logging.getLogger(__name__)


@api_view(['POST'])
@permission_classes([])  # Permitir acceso sin autenticación
def register_participante(request):
    """
    Endpoint para registrar un participante en el Reality Show
    Acepta multipart/form-data para subir archivos
    
    POST /api/reality/register/
    
    Body (JSON):
    {
        "names": "Juan",
        "lastnames": "Pérez",
        "gender": "masculino",
        "playingPosition": "Delantero Centro",
        "documentType": "Tarjeta de Identidad",
        "documentNumber": "1234567890",
        "birthDate": "2008-05-15",
        "bloodType": "O",
        "rh": "+",
        "epsSisben": "NUEVA EPS S.A.",
        "epsCertificate": "path/to/certificate.pdf",
        "subregion": "Valle de Aburrá",
        "municipality": "Medellín",
        "contactNumber": "3001234567",
        "email": "juan@example.com",
        "confirmEmail": "juan@example.com",
        "educationLevel": "Secundaria",
        "institutionName": "Colegio XYZ",
        "guardianName": "María Pérez",
        "guardianDocumentType": "Cédula de Ciudadanía",
        "guardianDocumentNumber": "9876543210",
        "guardianContactNumber": "3009876543",
        "guardianEmail": "maria@example.com",
        "residenceMunicipality": "Medellín",
        "acceptSensitiveData": true,
        "acceptHabeasData": true
    }
    """
    try:
        # Mapear campos del frontend a campos del backend
        gender_value = request.data.get('gender', '')
        # Mapear valores de género a los valores ENUM de la BD: 'hombre', 'mujer', 'otro'
        gender_map = {
            'femenino': 'mujer',
            'masculino': 'hombre',
            'otros': 'otro'
        }
        genero_bd = gender_map.get(gender_value.lower(), 'otro')
        
        # Mapear tipos de documento a abreviaturas
        doc_type_value = request.data.get('documentType', '')
        doc_type_map = {
            'cédula de ciudadanía': 'CC',
            'tarjeta de identidad': 'TI',
            'registro civil': 'RC',
            'pasaporte': 'PA',
            'cédula de extranjería': 'CE'
        }
        tipo_doc_bd = doc_type_map.get(doc_type_value.lower(), doc_type_value[:10] if doc_type_value else 'TI')
        
        # Mapear tipo de documento del acudiente
        guardian_doc_type_value = request.data.get('guardianDocumentType', '')
        tipo_doc_acudiente_bd = doc_type_map.get(guardian_doc_type_value.lower(), guardian_doc_type_value[:10] if guardian_doc_type_value else 'CC')
        
        # Manejar archivo del certificado EPS
        certificado_eps_data = None
        if 'epsCertificate' in request.FILES:
            eps_file = request.FILES['epsCertificate']
            # Leer el archivo como bytes para guardarlo en LONGBLOB
            certificado_eps_data = eps_file.read()
        
        data = {
            'nombres': request.data.get('names'),
            'apellidos': request.data.get('lastnames'),
            'genero': genero_bd,
            'position': request.data.get('playingPosition'),
            'tipo_documento_participante': tipo_doc_bd,
            'documento_participante': request.data.get('documentNumber'),
            'fecha_nacimiento': request.data.get('birthDate'),
            'tipo_sangre': request.data.get('bloodType'),
            'rh': request.data.get('rh'),
            'eps_sisben': request.data.get('epsSisben'),
            'certificado_eps': certificado_eps_data,
            'subregion': request.data.get('subregion'),
            'municipio': request.data.get('municipality'),
            'telefono_contacto': request.data.get('contactNumber'),
            'email': request.data.get('email'),
            'confirm_email': request.data.get('confirmEmail'),
            'nivel_educacion': request.data.get('educationLevel'),
            'nombre_ie_educativa': request.data.get('institutionName'),
            'nombre_acudiente': request.data.get('guardianName'),
            'tipo_documento_acudiente': tipo_doc_acudiente_bd,
            'numero_documento_acudiente': request.data.get('guardianDocumentNumber'),
            'telefono_acudiente': request.data.get('guardianContactNumber'),
            'email_acudiente': request.data.get('guardianEmail'),
            'municipio_residencia': request.data.get('residenceMunicipality'),
            'sensitive_data': request.data.get('acceptSensitiveData', False),
            'habeas_data': request.data.get('acceptHabeasData', False),
        }
        
        # Validar y crear participante
        serializer = ParticipanteSerializer(data=data)
        
        if serializer.is_valid():
            participante = serializer.save()
            
            logger.info(f"Participante registrado exitosamente: {participante.id}")
            
            # Enviar datos a Google Sheets como respaldo (no bloqueante)
            try:
                participante_dict = {
                    'id': participante.id,
                    'codigo': participante.codigo,
                    'uuid_interno': participante.uuid_interno,
                    'nombres': participante.nombres,
                    'apellidos': participante.apellidos,
                    'genero': participante.genero,
                    'tipo_documento_participante': participante.tipo_documento_participante,
                    'documento_participante': participante.documento_participante,
                    'fecha_nacimiento': participante.fecha_nacimiento,
                    'edad': participante.edad,
                    'tipo_sangre': participante.tipo_sangre,
                    'rh': participante.rh,
                    'eps_sisben': participante.eps_sisben,
                    'subregion': participante.subregion,
                    'municipio': participante.municipio,
                    'municipio_residencia': participante.municipio_residencia,
                    'telefono_contacto': participante.telefono_contacto,
                    'email': participante.email,
                    'nivel_educacion': participante.nivel_educacion,
                    'nombre_ie_educativa': participante.nombre_ie_educativa,
                    'position': participante.position,
                    'nombre_acudiente': participante.nombre_acudiente,
                    'tipo_documento_acudiente': participante.tipo_documento_acudiente,
                    'numero_documento_acudiente': participante.numero_documento_acudiente,
                    'telefono_acudiente': participante.telefono_acudiente,
                    'email_acudiente': participante.email_acudiente,
                    'sensitive_data': participante.sensitive_data,
                    'habeas_data': participante.habeas_data,
                }
                sheets_success = send_to_google_sheets(participante_dict)
                if sheets_success:
                    logger.info(f"Datos del participante {participante.id} respaldados en Google Sheets")
                else:
                    logger.warning(f"No se pudo respaldar en Google Sheets el participante {participante.id}")
            except Exception as e:
                logger.error(f"Error al enviar a Google Sheets: {str(e)}")
                # No fallar el registro si falla el respaldo
            
            return Response({
                'success': True,
                'message': 'Registro exitoso. ¡Bienvenido al Reality Show!',
                'data': {
                    'id': participante.id,
                    'codigo': participante.codigo,
                    'nombres': participante.nombres,
                    'apellidos': participante.apellidos,
                }
            }, status=status.HTTP_201_CREATED)
        
        else:
            logger.warning(f"Error de validación en registro: {serializer.errors}")
            
            # Verificar si el error es por documento duplicado
            if 'documento_participante' in serializer.errors:
                error_msg = serializer.errors['documento_participante'][0]
                if 'ya está registrado' in str(error_msg):
                    return Response({
                        'success': False,
                        'message': 'Ya estás registrado',
                        'detail': str(error_msg),
                        'errors': serializer.errors
                    }, status=status.HTTP_409_CONFLICT)  # 409 Conflict para duplicados
            
            return Response({
                'success': False,
                'message': 'Error en los datos enviados',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        logger.error(f"Error al registrar participante: {str(e)}")
        return Response({
            'success': False,
            'message': 'Error interno del servidor',
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_registration_status(request):
    """
    Verificar si el usuario ya está registrado en el Reality Show
    
    GET /api/reality/check-status/
    """
    try:
        user_email = request.user.email
        
        # Buscar si existe un registro con este email
        participante = Participante.objects.using('habilidosos_clean').filter(
            email=user_email
        ).first()
        
        if participante:
            return Response({
                'registered': True,
                'data': {
                    'codigo': participante.codigo,
                    'nombres': participante.nombres,
                    'apellidos': participante.apellidos,
                    'fecha_registro': participante.timestamp,
                }
            })
        else:
            return Response({
                'registered': False,
                'message': 'No estás registrado en el Reality Show'
            })
    
    except Exception as e:
        logger.error(f"Error al verificar estado de registro: {str(e)}")
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([])  # Permitir acceso sin autenticación
def register_participante_2026(request):
    """
    Endpoint para registrar un participante en el Reality Show 2026
    Guarda en la tabla participantes_2026_1 de habilidosos_clean
    Acepta multipart/form-data para subir archivos (foto de perfil)
    
    POST /api/reality/register-2026/
    """
    from .models import Participante2026
    from .serializers import Participante2026Serializer
    import os
    from django.conf import settings
    
    try:
        logger.info("=" * 50)
        logger.info("INICIO REGISTRO PARTICIPANTE 2026")
        logger.info(f"Datos recibidos: {dict(request.data)}")
        logger.info(f"Archivos recibidos: {list(request.FILES.keys())}")
        
        # Mapear campos del frontend a campos del backend
        gender_value = request.data.get('gender', '')
        gender_map = {
            'femenino': 'mujer',
            'masculino': 'hombre',
            'otros': 'otro'
        }
        genero_bd = gender_map.get(gender_value.lower(), 'otro')
        logger.info(f"Género mapeado: {gender_value} -> {genero_bd}")
        
        # Mapear tipos de documento a abreviaturas
        doc_type_value = request.data.get('documentType', '')
        doc_type_map = {
            'cédula de ciudadanía': 'CC',
            'tarjeta de identidad': 'TI',
            'registro civil': 'RC',
            'pasaporte': 'PA',
            'cédula de extranjería': 'CE'
        }
        tipo_doc_bd = doc_type_map.get(doc_type_value.lower(), doc_type_value[:10] if doc_type_value else 'TI')
        
        # Mapear tipo de documento del acudiente
        guardian_doc_type_value = request.data.get('guardianDocumentType', '')
        tipo_doc_acudiente_bd = doc_type_map.get(guardian_doc_type_value.lower(), guardian_doc_type_value[:10] if guardian_doc_type_value else 'CC')
        
        # Manejar foto de perfil (avatar)
        avatar_url = None
        if 'avatarPhoto' in request.FILES:
            avatar_file = request.FILES['avatarPhoto']
            # Crear directorio si no existe
            upload_dir = os.path.join(settings.MEDIA_ROOT, 'reality', 'avatars', '2026')
            os.makedirs(upload_dir, exist_ok=True)
            
            # Generar nombre único para el archivo
            import uuid
            file_ext = os.path.splitext(avatar_file.name)[1]
            unique_filename = f"{uuid.uuid4()}{file_ext}"
            file_path = os.path.join(upload_dir, unique_filename)
            
            # Guardar archivo
            with open(file_path, 'wb+') as destination:
                for chunk in avatar_file.chunks():
                    destination.write(chunk)
            
            # URL relativa para guardar en BD
            avatar_url = f"/media/reality/avatars/2026/{unique_filename}"
        
        # Log de campos importantes recibidos
        logger.info(f"documentNumber recibido: {request.data.get('documentNumber')}")
        logger.info(f"documentType recibido: {request.data.get('documentType')}")
        logger.info(f"tipo_doc_bd mapeado: {tipo_doc_bd}")
        logger.info(f"guardianName recibido: {request.data.get('guardianName')}")
        logger.info(f"guardianDocumentNumber recibido: {request.data.get('guardianDocumentNumber')}")
        logger.info(f"avatar_url: {avatar_url}")
        logger.info(f"birthDate recibido: {request.data.get('birthDate')}")
        
        data = {
            'nombres': request.data.get('names'),
            'apellidos': request.data.get('lastnames'),
            'genero': genero_bd,
            'position': request.data.get('playingPosition'),
            'tipo_documento_participante': tipo_doc_bd,
            'documento_participante': request.data.get('documentNumber'),
            'fecha_nacimiento': request.data.get('birthDate') if request.data.get('birthDate') else None,
            'tipo_sangre': request.data.get('bloodType'),
            'subregion': request.data.get('subregion'),
            'municipio': request.data.get('municipality'),
            'municipio_residencia': request.data.get('residenceMunicipality'),
            'telefono_contacto': request.data.get('contactNumber'),
            'email': request.data.get('email'),
            'confirm_email': request.data.get('confirmEmail'),
            'nivel_educacion': request.data.get('educationLevel'),
            'nombre_ie_educativa': request.data.get('institutionName'),
            'nombre_acudiente': request.data.get('guardianName'),
            'tipo_documento_acudiente': tipo_doc_acudiente_bd,
            'numero_documento_acudiente': request.data.get('guardianDocumentNumber'),
            'telefono_acudiente': request.data.get('guardianContactNumber'),
            'email_acudiente': request.data.get('guardianEmail'),
            'sensitive_data': request.data.get('acceptSensitiveData', 'false').lower() == 'true',
            'habeas_data': request.data.get('acceptHabeasData', 'false').lower() == 'true',
            'avatar_url': avatar_url,
        }
        
        logger.info(f"Datos preparados para serializer: {data}")
        logger.info(f"documento_participante en data: {data.get('documento_participante')}")
        logger.info(f"tipo_documento_participante en data: {data.get('tipo_documento_participante')}")
        
        # Validar y crear participante
        serializer = Participante2026Serializer(data=data)
        logger.info(f"Serializer creado, validando...")
        
        if serializer.is_valid():
            participante = serializer.save()
            
            logger.info(f"Participante 2026 registrado exitosamente: {participante.id} - {participante.codigo}")
            
            return Response({
                'success': True,
                'message': '¡Registro exitoso para el Reality Show 2026! Tu foto de perfil ayudará a identificarte mejor.',
                'data': {
                    'id': participante.id,
                    'codigo': participante.codigo,
                    'nombres': participante.nombres,
                    'apellidos': participante.apellidos,
                    'avatar_url': participante.avatar_url,
                }
            }, status=status.HTTP_201_CREATED)
        
        else:
            logger.warning(f"Error de validación en registro 2026: {serializer.errors}")
            
            # Verificar si el error es por documento duplicado
            if 'documento_participante' in serializer.errors:
                error_msg = serializer.errors['documento_participante'][0]
                if 'ya está registrado' in str(error_msg):
                    return Response({
                        'success': False,
                        'message': 'Ya estás registrado',
                        'detail': str(error_msg),
                        'errors': serializer.errors
                    }, status=status.HTTP_409_CONFLICT)
            
            return Response({
                'success': False,
                'message': 'Error en los datos enviados',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        logger.error(f"Error al registrar participante 2026: {str(e)}")
        import traceback
        traceback.print_exc()
        return Response({
            'success': False,
            'message': 'Error interno del servidor',
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
