# Script para iniciar SOS-HABILIDOSO Frontend y Backend
Clear-Host
Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                    SOS-HABILIDOSO                            ║" -ForegroundColor Cyan
Write-Host "║                 Sistema de Mensajería                        ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 INICIANDO APLICACIÓN..." -ForegroundColor Green
Write-Host ""
Write-Host "📋 CONFIGURACIÓN DE SERVICIOS:" -ForegroundColor Yellow
Write-Host "   🔧 Backend Django:  http://127.0.0.1:8000" -ForegroundColor Blue
Write-Host "   🌐 Frontend Next.js: http://localhost:3000" -ForegroundColor Blue
Write-Host "   🗄️  Base de Datos:   PostgreSQL" -ForegroundColor Blue
Write-Host ""
Write-Host "📖 ENDPOINTS DISPONIBLES:" -ForegroundColor Yellow
Write-Host "   🔗 API:             http://127.0.0.1:8000/api/" -ForegroundColor Magenta
Write-Host "   👤 Usuarios:        http://127.0.0.1:8000/api/users/" -ForegroundColor Magenta
Write-Host "   💬 Mensajería:      http://127.0.0.1:8000/api/messaging/" -ForegroundColor Magenta
Write-Host "   📝 Posts:           http://127.0.0.1:8000/api/posts/" -ForegroundColor Magenta
Write-Host "   🔐 Admin:           http://127.0.0.1:8000/admin/" -ForegroundColor Magenta
Write-Host ""

# Función para verificar si un puerto está en uso
function Test-Port {
    param([int]$Port)
    try {
        $connection = New-Object System.Net.Sockets.TcpClient
        $connection.Connect("localhost", $Port)
        $connection.Close()
        return $true
    }
    catch {
        return $false
    }
}

# Verificar si los puertos están disponibles
Write-Host "🔍 Verificando puertos..." -ForegroundColor Yellow

if (Test-Port 8000) {
    Write-Host "⚠️  Puerto 8000 ya está en uso" -ForegroundColor Red
} else {
    Write-Host "✅ Puerto 8000 disponible" -ForegroundColor Green
}

if (Test-Port 4000) {
    Write-Host "⚠️  Puerto 4000 ya está en uso, Next.js usará 4001" -ForegroundColor Yellow
} else {
    Write-Host "✅ Puerto 4000 disponible" -ForegroundColor Green
}

Write-Host ""
Write-Host "⚡ Iniciando servicios..." -ForegroundColor Yellow

# Iniciar backend en una nueva ventana
Write-Host "🔧 Iniciando Django Backend..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; .\venv\Scripts\Activate.ps1; python manage.py runserver 8000"

# Esperar un momento
Start-Sleep -Seconds 3

# Iniciar frontend en una nueva ventana
Write-Host "🌐 Iniciando Next.js Frontend..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; npm run dev"

Write-Host ""
Write-Host "✅ Servicios iniciados en ventanas separadas" -ForegroundColor Green
Write-Host ""
Write-Host "📖 URLs disponibles:" -ForegroundColor Yellow
Write-Host "- Frontend: http://localhost:4000" -ForegroundColor Cyan
Write-Host "- Backend API: http://127.0.0.1:8000/api/" -ForegroundColor Cyan
Write-Host "- Admin Django: http://127.0.0.1:8000/admin/" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 Para detener los servicios, cierra las ventanas correspondientes" -ForegroundColor Gray

# Mantener la ventana abierta
Read-Host "Presiona Enter para cerrar esta ventana"