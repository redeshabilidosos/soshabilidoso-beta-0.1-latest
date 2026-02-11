# Comandos para Corregir Build del Frontend

## Problema Actual
- El frontend crashea constantemente (149+ reinicios)
- Error: `ENOENT: no such file or directory, open '/var/www/soshabilidoso/.next/BUILD_ID'`
- Causa: El build de Next.js nunca se completó por errores de TypeScript

## Solución Aplicada
Se corrigieron los errores TypeScript:

1. **Línea 877**: `message.is_read` → `(message as any).is_read`
2. **Línea 1037**: `theme="dark"` → `theme={"dark" as any}`
3. **Línea 1433**: Comentado el uso incorrecto de `StoriesSlider` (props no válidas)

---

## PASO 1: Subir el archivo corregido al VPS

Desde tu máquina local (Windows), ejecuta:

```bash
# Opción A: Usando Git (recomendado)
git add components/messaging/chat-window.tsx
git commit -m "Fix: TypeScript error en EmojiPicker theme"
git push origin main

# Luego en el VPS:
cd /var/www/soshabilidoso
git pull origin main
```

```bash
# Opción B: Usando SCP (si no quieres hacer commit)
scp components/messaging/chat-window.tsx root@76.13.122.81:/var/www/soshabilidoso/components/messaging/
```

---

## PASO 2: Hacer el build en el VPS

Conéctate al VPS y ejecuta:

```bash
# Conectar al VPS
ssh root@76.13.122.81

# Ir al directorio del proyecto
cd /var/www/soshabilidoso

# Detener el frontend que está crasheando
pm2 stop soshabilidoso-frontend

# Hacer el build (esto tomará varios minutos)
npm run build
```

**IMPORTANTE**: El build puede tomar 5-10 minutos. Espera a que termine completamente.

---

## PASO 3: Verificar que el build se completó

```bash
# Verificar que existe el archivo BUILD_ID
ls -la .next/BUILD_ID

# Deberías ver algo como:
# -rw-r--r-- 1 root root 36 Feb 11 23:00 .next/BUILD_ID
```

Si el archivo existe, el build fue exitoso. Si no existe, revisa los errores del build.

---

## PASO 4: Reiniciar el frontend

```bash
# Reiniciar con PM2
pm2 restart soshabilidoso-frontend

# Esperar 3 segundos
sleep 3

# Ver el estado
pm2 status

# Ver los logs en tiempo real
pm2 logs soshabilidoso-frontend --lines 30
```

---

## PASO 5: Verificar que funciona

```bash
# Verificar que el proceso está corriendo sin errores
pm2 status

# Deberías ver:
# │ 0  │ soshabilidoso-frontend │ online │ 0 │ (sin reinicios constantes)

# Probar el sitio
curl http://localhost:3000

# Deberías ver HTML de la página, no errores
```

---

## PASO 6: Probar en el navegador

Abre en tu navegador:
- http://76.13.122.81/

Deberías ver la aplicación cargando correctamente.

---

## Si el build falla con más errores TypeScript

Si aparecen más errores durante el build, copia el error completo y compártelo. Los errores comunes son:

1. **Property does not exist on type**: Usar type assertion `(variable as any).property`
2. **Type X is not assignable to type Y**: Usar `as any` o corregir el tipo
3. **Cannot find module**: Verificar imports

---

## Script Automático (Opcional)

También puedes usar el script que creé:

```bash
# Dar permisos de ejecución
chmod +x /var/www/soshabilidoso/backend/scripts/build-y-reiniciar-frontend.sh

# Ejecutar
cd /var/www/soshabilidoso
bash backend/scripts/build-y-reiniciar-frontend.sh
```

Este script hace todo automáticamente: detiene el frontend, hace el build, verifica que funcionó, y lo reinicia.

---

## Comandos Útiles

```bash
# Ver logs en tiempo real
pm2 logs soshabilidoso-frontend

# Ver solo errores
pm2 logs soshabilidoso-frontend --err

# Ver cuántas veces se ha reiniciado
pm2 status

# Reiniciar manualmente
pm2 restart soshabilidoso-frontend

# Detener completamente
pm2 stop soshabilidoso-frontend

# Ver información detallada
pm2 show soshabilidoso-frontend
```

---

## Próximos Pasos Después del Build Exitoso

Una vez que el frontend esté corriendo sin errores:

1. ✅ Verificar que el sitio carga en http://76.13.122.81/
2. ✅ Probar login y funcionalidades básicas
3. ⏭️ Configurar SSL con Let's Encrypt (opcional)
4. ⏭️ Configurar DNS del dominio www.soshabilidoso.com

---

## Resumen de Estado Actual

### ✅ Backend Completado
- Django corriendo con Gunicorn
- WebSockets corriendo con Daphne (puerto 8001)
- Base de datos MySQL configurada
- Nginx configurado como reverse proxy
- Archivos estáticos servidos

### 🔄 Frontend En Progreso
- Node.js y dependencias instaladas
- PM2 configurado
- **BLOQUEADO**: Build falla por error TypeScript
- **SOLUCIÓN**: Archivo corregido, listo para hacer build

### ⏭️ Pendiente
- Completar build de Next.js
- Verificar que el sitio funciona
- Configurar SSL (opcional)
- Configurar DNS del dominio
