<?php
/**
 * Configuración para phpMyAdmin - MariaDB Puerto 3307
 * 
 * INSTRUCCIONES:
 * 1. Copia este contenido
 * 2. Pégalo al final de tu archivo config.inc.php de phpMyAdmin
 * 3. Ubicación típica: C:\xampp\phpMyAdmin\config.inc.php
 *    o: C:\wamp64\apps\phpmyadmin\config.inc.php
 * 4. Reinicia Apache
 */

/* ============================================
   SERVIDOR: MariaDB 3307 - SOS-HABILIDOSO
   ============================================ */

$i++;
$cfg['Servers'][$i]['verbose'] = 'MariaDB 3307 - SOS-HABILIDOSO';
$cfg['Servers'][$i]['host'] = '127.0.0.1';
$cfg['Servers'][$i]['port'] = '3307';
$cfg['Servers'][$i]['socket'] = '';
$cfg['Servers'][$i]['auth_type'] = 'cookie';
$cfg['Servers'][$i]['user'] = '';
$cfg['Servers'][$i]['password'] = '';
$cfg['Servers'][$i]['AllowNoPassword'] = true;

// Configuración adicional para mejor rendimiento
$cfg['Servers'][$i]['connect_type'] = 'tcp';
$cfg['Servers'][$i]['compress'] = false;
$cfg['Servers'][$i]['extension'] = 'mysqli';

// Configuración de bases de datos
$cfg['Servers'][$i]['only_db'] = ['habilidosos_db', 'habilidosos_clean'];

// Configuración de tablas
$cfg['Servers'][$i]['hide_db'] = '^(information_schema|performance_schema|mysql|sys)$';

/* ============================================
   CONFIGURACIÓN GENERAL (Opcional)
   ============================================ */

// Aumentar límites para importación/exportación
$cfg['UploadDir'] = '';
$cfg['SaveDir'] = '';
$cfg['MaxRows'] = 50;
$cfg['RowActionLinksWithoutUnique'] = true;

// Configuración de idioma
$cfg['DefaultLang'] = 'es';
$cfg['ServerDefault'] = 1;

// Configuración de tema
$cfg['ThemeDefault'] = 'pmahomme';

// Configuración de seguridad
$cfg['AllowArbitraryServer'] = false;
$cfg['LoginCookieValidity'] = 3600;

/* ============================================
   NOTAS:
   - Usuario: root
   - Password: (vacío o el que configuraste)
   - Bases de datos visibles:
     * habilidosos_db (Django)
     * habilidosos_clean (Existente)
   ============================================ */
?>
