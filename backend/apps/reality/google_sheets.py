"""
Utilidad para enviar datos a Google Sheets como respaldo
"""
import requests
import logging
from django.conf import settings

logger = logging.getLogger(__name__)

# URL del Web App de Google Apps Script
# IMPORTANTE: Reemplaza esta URL con la URL de tu implementación de Apps Script
GOOGLE_SHEETS_WEBHOOK_URL = getattr(
    settings, 
    'GOOGLE_SHEETS_WEBHOOK_URL', 
    None  # Configurar en settings
)


def send_to_google_sheets(participante_data):
    """
    Envía los datos del participante a Google Sheets como respaldo
    
    Args:
        participante_data (dict): Diccionario con los datos del participante
        
    Returns:
        bool: True si se envió exitosamente, False en caso contrario
    """
    if not GOOGLE_SHEETS_WEBHOOK_URL:
        logger.warning("Google Sheets webhook URL no configurada. Saltando respaldo.")
        return False
    
    try:
        # Preparar los datos para enviar
        data_to_send = {
            'id': participante_data.get('id'),
            'codigo': participante_data.get('codigo'),
            'uuid_interno': participante_data.get('uuid_interno'),
            'nombres': participante_data.get('nombres'),
            'apellidos': participante_data.get('apellidos'),
            'genero': participante_data.get('genero'),
            'tipo_documento_participante': participante_data.get('tipo_documento_participante'),
            'documento_participante': participante_data.get('documento_participante'),
            'fecha_nacimiento': str(participante_data.get('fecha_nacimiento', '')),
            'edad': participante_data.get('edad'),
            'tipo_sangre': participante_data.get('tipo_sangre'),
            'rh': participante_data.get('rh'),
            'eps_sisben': participante_data.get('eps_sisben'),
            'subregion': participante_data.get('subregion'),
            'municipio': participante_data.get('municipio'),
            'municipio_residencia': participante_data.get('municipio_residencia'),
            'telefono_contacto': participante_data.get('telefono_contacto'),
            'email': participante_data.get('email'),
            'nivel_educacion': participante_data.get('nivel_educacion'),
            'nombre_ie_educativa': participante_data.get('nombre_ie_educativa'),
            'position': participante_data.get('position'),
            'nombre_acudiente': participante_data.get('nombre_acudiente'),
            'tipo_documento_acudiente': participante_data.get('tipo_documento_acudiente'),
            'numero_documento_acudiente': participante_data.get('numero_documento_acudiente'),
            'telefono_acudiente': participante_data.get('telefono_acudiente'),
            'email_acudiente': participante_data.get('email_acudiente'),
            'sensitive_data': participante_data.get('sensitive_data', False),
            'habeas_data': participante_data.get('habeas_data', False),
        }
        
        # Enviar petición POST a Google Sheets
        response = requests.post(
            GOOGLE_SHEETS_WEBHOOK_URL,
            json=data_to_send,
            timeout=10  # Timeout de 10 segundos
        )
        
        if response.status_code == 200:
            result = response.json()
            if result.get('success'):
                logger.info(f"Datos enviados exitosamente a Google Sheets. Fila: {result.get('row')}")
                return True
            else:
                logger.error(f"Error al guardar en Google Sheets: {result.get('message')}")
                return False
        else:
            logger.error(f"Error HTTP al enviar a Google Sheets: {response.status_code}")
            return False
            
    except requests.exceptions.Timeout:
        logger.error("Timeout al enviar datos a Google Sheets")
        return False
    except requests.exceptions.RequestException as e:
        logger.error(f"Error de conexión al enviar a Google Sheets: {str(e)}")
        return False
    except Exception as e:
        logger.error(f"Error inesperado al enviar a Google Sheets: {str(e)}")
        return False
