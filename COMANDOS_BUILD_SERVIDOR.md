# Comandos para Build Limpio en Servidor

## Opción 1: Script Automático (RECOMENDADO)
```bash
build-limpio-servidor.bat
```

Este script hace todo automáticamente:
1. Sube `.env.local` al servidor
2. Limpia archivos antiguos (`.next`, `node_modules`, `package-lock.json`)
3. Instala dependencias con `--force` (ignora incompatibilidades de plataforma)
4. Hace build de Next.js para Linux
5. Reinicia PM2 con variables de entorno actualizadas
6. Verifica el estado

**Tiempo estimado**: 5-8 minutos

---

## Opción 2: Paso a Paso Manual

### 1. Subir .env.local
```bash
scp .env.local root@76.13.122.81:/var/www/soshabilidoso/.env.local
```

### 2. Conectar al servidor
```bash
plink -batch -pw "9C3BbsJp+90(Zz)g4o'u" root@76.13.122.81
```

### 3. Ir al directorio del proyecto
```bash
cd /var/www/soshabilidoso
```

### 4. Limpiar archivos antiguos
```bash
rm -rf .next node_modules package-lock.json
```

### 5. Instalar dependencias (2-3 minutos)
```bash
npm install --force
```
**Nota**: El flag `--force` ignora las incompatibilidades de plataforma (Windows vs Linux)

### 6. Hacer build (3-5 minutos)
```bash
npm run build
```

### 7. Reiniciar PM2 con variables de entorno actualizadas
```bash
pm2 restart all --update-env
```
**Nota**: `--update-env` recarga las variables de entorno desde `.env.local`

### 8. Verificar estado
```bash
pm2 status
```

### 9. Verificar que la app responda
```bash
curl -I http://localhost:3000
```
**Esperado**: `HTTP/1.1 200 OK`

### 10. Si hay error 500, ver logs
```bash
pm2 logs soshabilidoso-frontend --lines 30
```

---

## Explicación del Problema

### ¿Por qué falló el build de Windows?
Next.js compila código específico de plataforma:
- **Windows**: Usa `@next/swc-win32-x64-msvc`
- **Linux**: Usa `@next/swc-linux-x64-gnu`

El archivo `.next` generado en Windows contiene referencias a módulos de Windows que no existen en Linux, causando `MODULE_NOT_FOUND`.

### ¿Por qué usar --force en npm install?
El `package-lock.json` de Windows tiene dependencias específicas de Windows. El flag `--force` le dice a npm:
- Ignora las incompatibilidades de plataforma
- Instala las dependencias correctas para Linux
- Regenera `package-lock.json` para Linux

### ¿Qué hace --update-env en PM2?
PM2 cachea las variables de entorno al iniciar. Sin `--update-env`, PM2 usa las variables antiguas aunque hayas actualizado `.env.local`. Con `--update-env`, PM2:
- Recarga todas las variables de entorno
- Aplica los cambios de `.env.local`
- Reinicia el proceso con la nueva configuración

---

## Verificación Final

Después del build, verifica:

1. **Estado de PM2**:
```bash
pm2 status
```
Debe mostrar: `status: online`

2. **Respuesta HTTP**:
```bash
curl -I http://localhost:3000
```
Debe mostrar: `HTTP/1.1 200 OK`

3. **Desde tu navegador**:
```
https://www.soshabilidoso.com
```

---

## Troubleshooting

### Si npm install falla
```bash
# Limpiar cache de npm
npm cache clean --force

# Intentar de nuevo
npm install --force
```

### Si npm run build falla por error de sintaxis
1. Identifica el archivo con error en los logs
2. Corrígelo localmente
3. Haz commit y push
4. En servidor: `git pull origin main`
5. Intenta build de nuevo

### Si PM2 muestra "online" pero curl da 500
```bash
# Ver logs detallados
pm2 logs soshabilidoso-frontend --lines 50

# Verificar que .env.local existe
cat .env.local

# Verificar que .next existe
ls -la .next/

# Reiniciar con logs en tiempo real
pm2 restart all --update-env && pm2 logs
```

---

## Archivos Importantes

- `.env.local` - Variables de entorno de producción
- `.next/` - Build compilado (específico de plataforma)
- `node_modules/` - Dependencias (específicas de plataforma)
- `package-lock.json` - Lock de dependencias (específico de plataforma)

**IMPORTANTE**: Nunca subir `.next`, `node_modules` o `package-lock.json` de Windows a Linux.
