/**
 * Google Apps Script para recibir datos de registro del Reality Show
 * y guardarlos en Google Sheets como respaldo
 * 
 * INSTRUCCIONES DE INSTALACIÓN:
 * 1. Abre tu hoja de cálculo en Google Sheets
 * 2. Ve a Extensiones > Apps Script
 * 3. Copia y pega este código
 * 4. Guarda el proyecto
 * 5. Haz clic en "Implementar" > "Nueva implementación"
 * 6. Selecciona "Aplicación web"
 * 7. En "Ejecutar como": selecciona tu cuenta
 * 8. En "Quién tiene acceso": selecciona "Cualquier persona"
 * 9. Haz clic en "Implementar"
 * 10. Copia la URL de la aplicación web y úsala en el backend
 */

// ID de la hoja de cálculo
const SPREADSHEET_ID = '1omFWdUv_aWz2HXqI4NTeiHuRYh1fExqDVYclsDYXh10';
const SHEET_NAME = '2026';

/**
 * Función que maneja las peticiones POST
 */
function doPost(e) {
  try {
    // Parsear los datos recibidos
    const data = JSON.parse(e.postData.contents);
    
    // Abrir la hoja de cálculo
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          message: `No se encontró la hoja "${SHEET_NAME}"`
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Verificar si la hoja tiene encabezados, si no, agregarlos
    if (sheet.getLastRow() === 0) {
      const headers = [
        'ID',
        'Código',
        'UUID Interno',
        'Fecha de Registro',
        'Nombres',
        'Apellidos',
        'Género',
        'Tipo Documento',
        'Número Documento',
        'Fecha Nacimiento',
        'Edad',
        'Tipo Sangre',
        'RH',
        'EPS/SISBEN',
        'Subregión',
        'Municipio',
        'Municipio Residencia',
        'Teléfono Contacto',
        'Email',
        'Nivel Educación',
        'Institución Educativa',
        'Posición',
        'Nombre Acudiente',
        'Tipo Doc Acudiente',
        'Número Doc Acudiente',
        'Teléfono Acudiente',
        'Email Acudiente',
        'Datos Sensibles',
        'Habeas Data'
      ];
      sheet.appendRow(headers);
      
      // Formatear encabezados
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#00ff88');
      headerRange.setFontWeight('bold');
      headerRange.setFontColor('#000000');
    }
    
    // Preparar los datos para insertar
    const timestamp = new Date();
    const rowData = [
      data.id || '',
      data.codigo || '',
      data.uuid_interno || '',
      timestamp,
      data.nombres || '',
      data.apellidos || '',
      data.genero || '',
      data.tipo_documento_participante || '',
      data.documento_participante || '',
      data.fecha_nacimiento || '',
      data.edad || '',
      data.tipo_sangre || '',
      data.rh || '',
      data.eps_sisben || '',
      data.subregion || '',
      data.municipio || '',
      data.municipio_residencia || '',
      data.telefono_contacto || '',
      data.email || '',
      data.nivel_educacion || '',
      data.nombre_ie_educativa || '',
      data.position || '',
      data.nombre_acudiente || '',
      data.tipo_documento_acudiente || '',
      data.numero_documento_acudiente || '',
      data.telefono_acudiente || '',
      data.email_acudiente || '',
      data.sensitive_data ? 'Sí' : 'No',
      data.habeas_data ? 'Sí' : 'No'
    ];
    
    // Insertar la fila
    sheet.appendRow(rowData);
    
    // Formatear la nueva fila
    const lastRow = sheet.getLastRow();
    const range = sheet.getRange(lastRow, 1, 1, rowData.length);
    
    // Alternar colores de fila
    if (lastRow % 2 === 0) {
      range.setBackground('#f3f3f3');
    }
    
    // Auto-ajustar columnas
    sheet.autoResizeColumns(1, rowData.length);
    
    // Enviar correo de confirmación al participante
    try {
      sendConfirmationEmail(data);
    } catch (emailError) {
      Logger.log('Error al enviar correo: ' + emailError.toString());
      // No fallar si el correo falla
    }
    
    // Respuesta exitosa
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Datos guardados exitosamente en Google Sheets',
        row: lastRow,
        timestamp: timestamp.toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Respuesta de error
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'Error al guardar datos',
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Función para enviar correo de confirmación al participante
 */
function sendConfirmationEmail(data) {
  const email = data.email;
  const nombres = data.nombres || '';
  const apellidos = data.apellidos || '';
  const codigo = data.codigo || '';
  
  // Asunto del correo
  const subject = '✅ Confirmación de Registro - Un Golazo a tus Sueños';
  
  // Cuerpo del correo en HTML
  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #00ff88 0%, #00d4ff 100%);
          color: #000;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .content {
          background: #f9f9f9;
          padding: 30px;
          border: 1px solid #ddd;
        }
        .data-section {
          background: white;
          padding: 20px;
          margin: 20px 0;
          border-radius: 8px;
          border-left: 4px solid #00ff88;
        }
        .data-row {
          padding: 8px 0;
          border-bottom: 1px solid #eee;
        }
        .data-row:last-child {
          border-bottom: none;
        }
        .label {
          font-weight: bold;
          color: #555;
          display: inline-block;
          width: 200px;
        }
        .value {
          color: #000;
        }
        .codigo-box {
          background: #00ff88;
          color: #000;
          padding: 15px;
          text-align: center;
          border-radius: 8px;
          margin: 20px 0;
          font-size: 20px;
          font-weight: bold;
        }
        .footer {
          background: #333;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 0 0 10px 10px;
          font-size: 12px;
        }
        .success-icon {
          font-size: 48px;
          text-align: center;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🏆 Un Golazo a tus Sueños</h1>
        <p style="margin: 10px 0 0 0;">Fundación Habilidosos</p>
      </div>
      
      <div class="content">
        <div class="success-icon">✅</div>
        
        <h2 style="color: #00ff88; text-align: center;">¡Registro Exitoso!</h2>
        
        <p>Hola <strong>${nombres} ${apellidos}</strong>,</p>
        
        <p>¡Felicitaciones! Tu registro en el programa <strong>"Un Golazo a tus Sueños"</strong> ha sido completado exitosamente.</p>
        
        <div class="codigo-box">
          Tu código de participante: ${codigo}
        </div>
        
        <p><strong>Guarda este código</strong>, lo necesitarás para futuras consultas sobre tu participación en el programa.</p>
        
        <div class="data-section">
          <h3 style="margin-top: 0; color: #333;">📋 Datos Registrados</h3>
          
          <div class="data-row">
            <span class="label">Nombres:</span>
            <span class="value">${data.nombres || ''}</span>
          </div>
          
          <div class="data-row">
            <span class="label">Apellidos:</span>
            <span class="value">${data.apellidos || ''}</span>
          </div>
          
          <div class="data-row">
            <span class="label">Documento:</span>
            <span class="value">${data.tipo_documento_participante || ''} ${data.documento_participante || ''}</span>
          </div>
          
          <div class="data-row">
            <span class="label">Fecha de Nacimiento:</span>
            <span class="value">${data.fecha_nacimiento || ''}</span>
          </div>
          
          <div class="data-row">
            <span class="label">Edad:</span>
            <span class="value">${data.edad || ''} años</span>
          </div>
          
          <div class="data-row">
            <span class="label">Género:</span>
            <span class="value">${data.genero || ''}</span>
          </div>
          
          <div class="data-row">
            <span class="label">Posición de Juego:</span>
            <span class="value">${data.position || ''}</span>
          </div>
          
          <div class="data-row">
            <span class="label">Municipio:</span>
            <span class="value">${data.municipio || ''}</span>
          </div>
          
          <div class="data-row">
            <span class="label">Subregión:</span>
            <span class="value">${data.subregion || ''}</span>
          </div>
          
          <div class="data-row">
            <span class="label">Teléfono:</span>
            <span class="value">${data.telefono_contacto || ''}</span>
          </div>
          
          <div class="data-row">
            <span class="label">Email:</span>
            <span class="value">${data.email || ''}</span>
          </div>
          
          <div class="data-row">
            <span class="label">Institución Educativa:</span>
            <span class="value">${data.nombre_ie_educativa || ''}</span>
          </div>
          
          <div class="data-row">
            <span class="label">Nivel Educativo:</span>
            <span class="value">${data.nivel_educacion || ''}</span>
          </div>
        </div>
        
        <div class="data-section">
          <h3 style="margin-top: 0; color: #333;">👨‍👩‍👧 Datos del Acudiente</h3>
          
          <div class="data-row">
            <span class="label">Nombre:</span>
            <span class="value">${data.nombre_acudiente || ''}</span>
          </div>
          
          <div class="data-row">
            <span class="label">Documento:</span>
            <span class="value">${data.tipo_documento_acudiente || ''} ${data.numero_documento_acudiente || ''}</span>
          </div>
          
          <div class="data-row">
            <span class="label">Teléfono:</span>
            <span class="value">${data.telefono_acudiente || ''}</span>
          </div>
          
          <div class="data-row">
            <span class="label">Email:</span>
            <span class="value">${data.email_acudiente || ''}</span>
          </div>
        </div>
        
        <h3 style="color: #333;">📌 Próximos Pasos</h3>
        <ul>
          <li>Mantén tu correo y teléfono activos para recibir notificaciones</li>
          <li>Estaremos en contacto contigo con información sobre las siguientes etapas</li>
          <li>Si tienes alguna pregunta, no dudes en contactarnos</li>
        </ul>
        
        <p style="margin-top: 30px;"><strong>¡Mucha suerte en tu camino hacia tus sueños! ⚽🌟</strong></p>
      </div>
      
      <div class="footer">
        <p><strong>Fundación Habilidosos</strong></p>
        <p>Un Golazo a tus Sueños - Reality Show 2026</p>
        <p style="margin-top: 10px; font-size: 10px;">
          Este es un correo automático, por favor no responder a esta dirección.
        </p>
      </div>
    </body>
    </html>
  `;
  
  // Cuerpo del correo en texto plano (fallback)
  const plainBody = `
Un Golazo a tus Sueños - Fundación Habilidosos

¡REGISTRO EXITOSO!

Hola ${nombres} ${apellidos},

¡Felicitaciones! Tu registro en el programa "Un Golazo a tus Sueños" ha sido completado exitosamente.

Tu código de participante: ${codigo}

DATOS REGISTRADOS:
- Nombres: ${data.nombres || ''}
- Apellidos: ${data.apellidos || ''}
- Documento: ${data.tipo_documento_participante || ''} ${data.documento_participante || ''}
- Fecha de Nacimiento: ${data.fecha_nacimiento || ''}
- Edad: ${data.edad || ''} años
- Género: ${data.genero || ''}
- Posición: ${data.position || ''}
- Municipio: ${data.municipio || ''}
- Teléfono: ${data.telefono_contacto || ''}
- Email: ${data.email || ''}

ACUDIENTE:
- Nombre: ${data.nombre_acudiente || ''}
- Documento: ${data.tipo_documento_acudiente || ''} ${data.numero_documento_acudiente || ''}
- Teléfono: ${data.telefono_acudiente || ''}

¡Mucha suerte en tu camino hacia tus sueños!

Fundación Habilidosos
Un Golazo a tus Sueños - Reality Show 2026
  `;
  
  // Enviar el correo
  MailApp.sendEmail({
    to: email,
    subject: subject,
    body: plainBody,
    htmlBody: htmlBody,
    name: 'Fundación Habilidosos'
  });
  
  Logger.log('Correo de confirmación enviado a: ' + email);
}


