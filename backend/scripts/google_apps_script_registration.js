/**
 * Google Apps Script para enviar correos de confirmación de registro
 * de usuarios en la plataforma SOS-HABILIDOSO
 * 
 * INSTRUCCIONES DE INSTALACIÓN:
 * 1. Abre tu hoja de cálculo en Google Sheets (ID: 1-zBfqMIun71LO9xpDDseDGbDz28GRCuSH9HlzvML-04)
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

// ID de la hoja de cálculo para registros de usuarios
const SPREADSHEET_ID = '1-zBfqMIun71LO9xpDDseDGbDz28GRCuSH9HlzvML-04';
const SHEET_NAME = 'Hoja 1';

/**
 * Función que maneja las peticiones POST
 */
function doPost(e) {
  try {
    // Parsear los datos recibidos
    const data = JSON.parse(e.postData.contents);
    
    // Validar que tenga los datos necesarios
    if (!data.email || !data.username || !data.display_name) {
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          message: 'Faltan datos requeridos: email, username, display_name'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
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
        'Fecha de Registro',
        'Email',
        'Nombre de Usuario',
        'Nombre Completo',
        'Posición/Habilidad',
        'Equipo/Grupo',
        'Intereses',
        'Teléfono',
        'Estado'
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
      timestamp,
      data.email || '',
      data.username || '',
      data.display_name || '',
      data.position || '',
      data.team || '',
      data.interests || '',
      data.contact_number || '',
      'Activo'
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
    
    // Enviar correo de confirmación al usuario
    try {
      sendRegistrationConfirmationEmail(data);
    } catch (emailError) {
      Logger.log('Error al enviar correo: ' + emailError.toString());
      // No fallar si el correo falla
    }
    
    // Respuesta exitosa
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Registro guardado exitosamente en Google Sheets',
        row: lastRow,
        timestamp: timestamp.toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Respuesta de error
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'Error al guardar registro',
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Función para enviar correo de confirmación de registro
 */
function sendRegistrationConfirmationEmail(data) {
  const email = data.email;
  const displayName = data.display_name || '';
  const username = data.username || '';
  
  // Asunto del correo
  const subject = '✅ Bienvenido a SOS-HABILIDOSO - Confirmación de Registro';
  
  // Cuerpo del correo en HTML
  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background: #f5f5f5;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #00ff88 0%, #00d4ff 100%);
          color: #000;
          padding: 40px 30px;
          text-align: center;
        }
        .header h1 {
          font-size: 28px;
          margin-bottom: 10px;
          font-weight: 700;
        }
        .header p {
          font-size: 14px;
          opacity: 0.9;
        }
        .content {
          padding: 40px 30px;
        }
        .greeting {
          font-size: 18px;
          margin-bottom: 20px;
          color: #333;
        }
        .greeting strong {
          color: #00ff88;
        }
        .success-message {
          background: #f0fdf4;
          border-left: 4px solid #00ff88;
          padding: 20px;
          margin: 20px 0;
          border-radius: 6px;
        }
        .success-message p {
          color: #166534;
          font-weight: 500;
        }
        .user-info {
          background: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          border: 1px solid #e0e0e0;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #e0e0e0;
        }
        .info-row:last-child {
          border-bottom: none;
        }
        .info-label {
          font-weight: 600;
          color: #555;
          min-width: 150px;
        }
        .info-value {
          color: #000;
          text-align: right;
          word-break: break-word;
        }
        .username-box {
          background: linear-gradient(135deg, #00ff88 0%, #00d4ff 100%);
          color: #000;
          padding: 20px;
          text-align: center;
          border-radius: 8px;
          margin: 20px 0;
          font-size: 18px;
          font-weight: bold;
        }
        .username-label {
          font-size: 12px;
          opacity: 0.8;
          margin-bottom: 5px;
        }
        .next-steps {
          background: #f0f9ff;
          border-left: 4px solid #00d4ff;
          padding: 20px;
          margin: 20px 0;
          border-radius: 6px;
        }
        .next-steps h3 {
          color: #0369a1;
          margin-bottom: 10px;
          font-size: 16px;
        }
        .next-steps ul {
          list-style: none;
          padding-left: 0;
        }
        .next-steps li {
          padding: 8px 0;
          color: #0c4a6e;
          padding-left: 25px;
          position: relative;
        }
        .next-steps li:before {
          content: "✓";
          position: absolute;
          left: 0;
          color: #00ff88;
          font-weight: bold;
        }
        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #00ff88 0%, #00d4ff 100%);
          color: #000;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          margin: 20px 0;
          text-align: center;
          width: 100%;
          box-sizing: border-box;
        }
        .cta-button:hover {
          opacity: 0.9;
        }
        .footer {
          background: #1a1a1a;
          color: #fff;
          padding: 30px;
          text-align: center;
          font-size: 12px;
        }
        .footer p {
          margin: 5px 0;
        }
        .footer-logo {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .divider {
          height: 1px;
          background: #e0e0e0;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎯 SOS-HABILIDOSO</h1>
          <p>Conecta, Comparte, Descubre</p>
        </div>
        
        <div class="content">
          <div class="greeting">
            ¡Hola <strong>${displayName}</strong>! 👋
          </div>
          
          <div class="success-message">
            <p>✅ ¡Tu cuenta ha sido creada exitosamente!</p>
          </div>
          
          <p>Bienvenido a <strong>SOS-HABILIDOSO</strong>, la plataforma más avanzada para conectar con personas de todo el mundo, compartir tus pasiones y descubrir nuevos talentos.</p>
          
          <div class="divider"></div>
          
          <h3 style="color: #333; margin: 20px 0 15px 0;">📋 Información de tu Cuenta</h3>
          
          <div class="user-info">
            <div class="info-row">
              <span class="info-label">Nombre Completo:</span>
              <span class="info-value">${displayName}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Nombre de Usuario:</span>
              <span class="info-value">@${username}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Email:</span>
              <span class="info-value">${email}</span>
            </div>
            ${data.position ? `
            <div class="info-row">
              <span class="info-label">Habilidad:</span>
              <span class="info-value">${data.position}</span>
            </div>
            ` : ''}
            ${data.team ? `
            <div class="info-row">
              <span class="info-label">Equipo/Grupo:</span>
              <span class="info-value">${data.team}</span>
            </div>
            ` : ''}
          </div>
          
          <div class="username-box">
            <div class="username-label">Tu nombre de usuario es:</div>
            @${username}
          </div>
          
          <div class="next-steps">
            <h3>🚀 Próximos Pasos</h3>
            <ul>
              <li>Completa tu perfil con una foto de perfil</li>
              <li>Agrega tus intereses y habilidades</li>
              <li>Comienza a seguir a otros usuarios</li>
              <li>Comparte tu primer post o reel</li>
              <li>Únete a comunidades que te interesen</li>
            </ul>
          </div>
          
          <a href="http://localhost:3000/feed" class="cta-button">
            Ir a mi Perfil
          </a>
          
          <div class="divider"></div>
          
          <h3 style="color: #333; margin: 20px 0 15px 0;">❓ ¿Necesitas Ayuda?</h3>
          
          <p>Si tienes alguna pregunta o necesitas asistencia, no dudes en contactarnos. Estamos aquí para ayudarte a aprovechar al máximo la plataforma.</p>
          
          <p style="margin-top: 20px; color: #666; font-size: 14px;">
            <strong>¡Bienvenido a la comunidad! 🌟</strong>
          </p>
        </div>
        
        <div class="footer">
          <div class="footer-logo">🎯 SOS-HABILIDOSO</div>
          <p>Conecta con personas de todo el mundo</p>
          <p>Comparte tus pasiones y descubre nuevos talentos</p>
          <p style="margin-top: 15px; border-top: 1px solid #444; padding-top: 15px; font-size: 10px;">
            Este es un correo automático. Por favor, no responder a esta dirección.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  // Cuerpo del correo en texto plano (fallback)
  const plainBody = `
SOS-HABILIDOSO - Bienvenido

¡Hola ${displayName}!

¡Tu cuenta ha sido creada exitosamente!

Bienvenido a SOS-HABILIDOSO, la plataforma más avanzada para conectar con personas de todo el mundo, compartir tus pasiones y descubrir nuevos talentos.

INFORMACIÓN DE TU CUENTA:
- Nombre Completo: ${displayName}
- Nombre de Usuario: @${username}
- Email: ${email}
${data.position ? `- Habilidad: ${data.position}` : ''}
${data.team ? `- Equipo/Grupo: ${data.team}` : ''}

PRÓXIMOS PASOS:
✓ Completa tu perfil con una foto de perfil
✓ Agrega tus intereses y habilidades
✓ Comienza a seguir a otros usuarios
✓ Comparte tu primer post o reel
✓ Únete a comunidades que te interesen

¡Bienvenido a la comunidad!

SOS-HABILIDOSO
Conecta con personas de todo el mundo
Comparte tus pasiones y descubre nuevos talentos

---
Este es un correo automático. Por favor, no responder a esta dirección.
  `;
  
  // Enviar el correo
  MailApp.sendEmail({
    to: email,
    subject: subject,
    body: plainBody,
    htmlBody: htmlBody,
    name: 'SOS-HABILIDOSO'
  });
  
  Logger.log('Correo de confirmación de registro enviado a: ' + email);
}
