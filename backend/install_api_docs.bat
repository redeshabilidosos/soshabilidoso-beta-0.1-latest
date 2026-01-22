@echo off
echo ================================================================================
echo INSTALACION DE DOCUMENTACION API - SOS-HABILIDOSO
echo ================================================================================
echo.

echo 📦 Instalando drf-spectacular...
pip install drf-spectacular==0.27.0
if %errorlevel% neq 0 (
    echo ❌ Error instalando drf-spectacular
    pause
    exit /b 1
)

echo 📦 Instalando sidecar para interfaces estaticas...
pip install "drf-spectacular[sidecar]==0.27.0"
if %errorlevel% neq 0 (
    echo ❌ Error instalando sidecar
    pause
    exit /b 1
)

echo.
echo 🔄 Ejecutando migraciones...
python manage.py migrate
if %errorlevel% neq 0 (
    echo ❌ Error ejecutando migraciones
    pause
    exit /b 1
)

echo.
echo 📦 Recolectando archivos estaticos...
python manage.py collectstatic --noinput
if %errorlevel% neq 0 (
    echo ⚠️  Error recolectando estaticos (continuando...)
)

echo.
echo 📋 Generando esquema OpenAPI...
python manage.py spectacular --color --file api_schema.yaml
if %errorlevel% neq 0 (
    echo ⚠️  Error generando esquema (continuando...)
)

echo.
echo ================================================================================
echo ✅ INSTALACION COMPLETADA EXITOSAMENTE
echo ================================================================================
echo.
echo 📖 URLs de documentacion disponibles:
echo    • Swagger UI: http://127.0.0.1:8000/api/docs/
echo    • ReDoc:     http://127.0.0.1:8000/api/redoc/
echo    • Esquema:   http://127.0.0.1:8000/api/schema/
echo.
echo 🚀 Para iniciar el servidor:
echo    python manage.py runserver
echo.
echo 📚 Documentacion completa en: API_DOCUMENTATION.md
echo.
pause