-- ============================================
-- Script para agregar SOLO campos faltantes a la tabla participantes
-- Base de datos: habilidosos_clean
-- IMPORTANTE: NO modifica columnas existentes, NO elimina datos
-- ============================================

USE habilidosos_clean;

-- ============================================
-- MAPEO DE CAMPOS: Formulario → Base de Datos
-- ============================================
-- Formulario                    → Columna BD (Estado)
-- names                         → nombres (✓ existe)
-- lastnames                     → apellidos (✓ existe)
-- gender                        → genero (✓ existe)
-- playingPosition               → position (✓ existe)
-- documentType                  → tipo_documento_participante (✓ existe)
-- documentNumber                → documento_participante (✓ existe)
-- birthDate                     → fecha_nacimiento (✓ existe)
-- bloodType                     → tipo_sangre (✓ existe)
-- rh                            → rh (✗ FALTA - agregar)
-- epsSisben                     → eps_sisben (✗ FALTA - agregar)
-- epsCertificate                → certificado_eps (✗ FALTA - agregar)
-- subregion                     → subregion (✓ existe)
-- municipality                  → municipio (✓ existe)
-- contactNumber                 → telefono_contacto (✓ existe)
-- email                         → email (✓ existe)
-- confirmEmail                  → confirm_email (✓ existe)
-- educationLevel                → nivel_educacion (✓ existe)
-- institutionName               → nombre_ie_educativa (✓ existe)
-- guardianName                  → nombre_acudiente (✓ existe)
-- guardianDocumentType          → tipo_documento_acudiente (✓ existe)
-- guardianDocumentNumber        → numero_documento_acudiente (✓ existe)
-- guardianContactNumber         → telefono_acudiente (✓ existe)
-- guardianEmail                 → email_acudiente (✗ FALTA - agregar)
-- residenceMunicipality         → municipio_residencia (✓ existe)
-- acceptSensitiveData           → sensitive_data (✓ existe)
-- acceptHabeasData              → habeas_data (✓ existe)
-- ============================================

-- Agregar SOLO las columnas que faltan

-- Campo: RH (factor sanguíneo)
ALTER TABLE participantes 
ADD COLUMN IF NOT EXISTS rh VARCHAR(5) COMMENT 'Factor RH (+/-)';

-- Campo: EPS/SISBEN (combinado en el formulario)
ALTER TABLE participantes 
ADD COLUMN IF NOT EXISTS eps_sisben VARCHAR(200) COMMENT 'EPS o SISBEN del participante';

-- Campo: Certificado EPS (archivo)
ALTER TABLE participantes 
ADD COLUMN IF NOT EXISTS certificado_eps VARCHAR(500) COMMENT 'Ruta del certificado de EPS';

-- Campo: Email del acudiente
ALTER TABLE participantes 
ADD COLUMN IF NOT EXISTS email_acudiente VARCHAR(255) COMMENT 'Email del acudiente responsable';

-- ============================================
-- Verificación de columnas
-- ============================================
SELECT 
    'Script ejecutado exitosamente' AS Resultado,
    'Se agregaron las columnas faltantes' AS Mensaje,
    COUNT(*) AS Total_Columnas
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'habilidosos_clean'
AND TABLE_NAME = 'participantes';

-- Mostrar estructura actualizada
DESCRIBE participantes;
