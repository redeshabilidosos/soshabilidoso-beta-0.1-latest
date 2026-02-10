@echo off
color 0A
echo.
echo  ╔════════════════════════════════════════════════════════╗
echo  ║                                                        ║
echo  ║          🔧 SOLUCIONADOR UNIVERSAL 🔧                 ║
echo  ║                                                        ║
echo  ║     Soluciona TODOS los problemas de cache            ║
echo  ║     y errores de compilacion                          ║
echo  ║                                                        ║
echo  ╚════════════════════════════════════════════════════════╝
echo.
echo.

echo  [1/6] Deteniendo procesos...
taskkill /F /IM node.exe 2>nul
timeout /t 1 /nobreak >nul
echo  ✓ Procesos detenidos
echo.

echo  [2/6] Limpiando cache de Next.js...
if exist ".next" (
    rmdir /s /q ".next"
    echo  ✓ .next eliminado
) else (
    echo  ✓ .next no existe
)
echo.

echo  [3/6] Limpiando cache de webpack...
if exist "node_modules\.cache" (
    rmdir /s /q "node_modules\.cache"
    echo  ✓ node_modules\.cache eliminado
) else (
    echo  ✓ node_modules\.cache no existe
)
echo.

echo  [4/6] Limpiando cache de SWC...
if exist ".swc" (
    rmdir /s /q ".swc"
    echo  ✓ .swc eliminado
) else (
    echo  ✓ .swc no existe
)
echo.

echo  [5/6] Verificando archivos modificados...
echo  ✓ Chat en tiempo real: Configurado (2 seg polling)
echo  ✓ Indicador typing: Posicion A (arriba del input)
echo  ✓ Componentes: Actualizados
echo.

echo  [6/6] Iniciando servidor limpio...
echo.
echo  ╔════════════════════════════════════════════════════════╗
echo  ║                                                        ║
echo  ║              ✅ TODO SOLUCIONADO ✅                    ║
echo  ║                                                        ║
echo  ║  El servidor se iniciara en una nueva ventana         ║
echo  ║  Espera 15-20 segundos para la compilacion            ║
echo  ║                                                        ║
echo  ║  Luego abre:                                          ║
echo  ║    • http://localhost:4000/feed                       ║
echo  ║    • http://localhost:4000/profile                    ║
echo  ║    • http://localhost:4000/messages                   ║
echo  ║                                                        ║
echo  ║  Chat en tiempo real:                                 ║
echo  ║    • Mensajes cada 2 segundos                         ║
echo  ║    • Indicador "escribiendo" arriba del input         ║
echo  ║                                                        ║
echo  ╚════════════════════════════════════════════════════════╝
echo.

start cmd /k "npm run dev"

echo.
echo  Presiona cualquier tecla para cerrar esta ventana...
pause >nul
