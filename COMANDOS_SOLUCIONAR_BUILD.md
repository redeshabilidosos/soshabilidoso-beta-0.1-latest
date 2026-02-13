# Comandos para Solucionar Error de Build

## Problema Actual

El build está fallando con un error de sintaxis en el código compilado (`.next/server/chunks/5664.js`). Este error indica que hay un problema con las dependencias, específicamente con `animejs` o paquetes de Radix UI.

## Solución: Reinstalar Dependencias

### En Windows (Local):

```powershell
# 1. Eliminar node_modules y package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json

# 2. Limpiar cache de npm
npm cache clean --force

# 3. Reinstalar dependencias
npm install

# 4. Limpiar cache de Next.js
Remove-Item -Recurse -Force .next

# 5. Intentar build
npm run build
```

### En VPS Ubuntu:

```bash
# 1. Ir al directorio del proyecto
cd /var/www/soshabilidoso

# 2. Eliminar node_modules y package-lock.json
rm -rf node_modules
rm -f package-lock.json

# 3. Limpiar cache de npm
npm cache clean --force

# 4. Reinstalar dependencias
npm install

# 5. Limpiar cache de Next.js
rm -rf .next

# 6. Intentar build
npm run build
```

## Alternativa: Build Ignorando Errores TypeScript

Si la reinstalación no funciona, usar el script que ignora errores:

### Windows:
```powershell
.\build-ignorar-errores.bat
```

### VPS:
```bash
bash backend/scripts/build-ignorar-errores.sh
```

## Verificar Build Exitoso

Después del build, verificar que existe el archivo BUILD_ID:

### Windows:
```powershell
dir .next\BUILD_ID
```

### VPS:
```bash
ls -la .next/BUILD_ID
```

## Notas Importantes

- El error de sintaxis en el código compilado NO es un error de TypeScript
- Es un problema con las dependencias npm corruptas
- La reinstalación completa de node_modules debería resolverlo
- Si persiste, puede ser un problema con la versión de Node.js o npm

## Versiones Recomendadas

- Node.js: 18.x o 20.x LTS
- npm: 9.x o 10.x

Verificar versiones:
```bash
node --version
npm --version
```
