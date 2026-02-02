# 🚀 Pasos Rápidos - MySQL WiFi

---

## ✅ CHECKLIST DE CONFIGURACIÓN

### Paso 1: Configurar Firewall (2 minutos)
```bash
# Click derecho → Ejecutar como Administrador
permitir-mysql-wifi.bat
```

---

### Paso 2: Configurar my.ini de MySQL (3 minutos)

1. **Abrir XAMPP Control Panel**
2. **Click en "Config" junto a MySQL**
3. **Seleccionar "my.ini"**
4. **Buscar línea**:
   ```ini
   bind-address = 127.0.0.1
   ```
5. **Cambiar a**:
   ```ini
   bind-address = 0.0.0.0
   ```
6. **Guardar archivo**
7. **En XAMPP: Stop MySQL → Start MySQL**

---

### Paso 3: Crear Usuario Remoto (2 minutos)

1. **Abrir phpMyAdmin**: `http://localhost/phpmyadmin`
2. **Click en pestaña "SQL"**
3. **Copiar y ejecutar**:
   ```sql
   CREATE USER IF NOT EXISTS 'root'@'192.168.78.%' IDENTIFIED BY '';
   GRANT ALL PRIVILEGES ON habilidosos_db.* TO 'root'@'192.168.78.%';
   FLUSH PRIVILEGES;
   ```
4. **Click en "Continuar"**

---

### Paso 4: Actualizar .env (1 minuto)
```bash
configurar-env-para-wifi.bat
```

---

### Paso 5: Reiniciar Backend (1 minuto)

1. **Cerrar terminal del backend** (si está corriendo)
2. **Ejecutar de nuevo**:
   ```bash
   npm run soshabilidoso:simple
   ```

---

### Paso 6: Verificar (1 minuto)
```bash
verificar-mysql-wifi.bat
```

---

## 🧪 PROBAR EN XIAOMI

1. **Abre la app en tu Xiaomi**
2. **Login**: `molo` / `molo123`
3. **Verifica que cargue posts**
4. **Crea un post de prueba**
5. **Verifica que se guarde**

---

## ⚠️ SI NO FUNCIONA

### Error: "Can't connect to MySQL"

**Solución rápida**:
```bash
1. Verifica que MySQL esté corriendo en XAMPP
2. Ejecuta: verificar-mysql-wifi.bat
3. Revisa que my.ini tenga: bind-address = 0.0.0.0
4. Reinicia MySQL en XAMPP
```

---

### Error: "Access denied"

**Solución rápida**:
```sql
-- En phpMyAdmin, ejecuta:
GRANT ALL PRIVILEGES ON habilidosos_db.* TO 'root'@'192.168.78.%';
FLUSH PRIVILEGES;
```

---

## 📊 TIEMPO TOTAL

- **Configuración**: ~10 minutos
- **Testing**: ~5 minutos
- **Total**: ~15 minutos

---

## 🎯 RESULTADO ESPERADO

✅ App en Xiaomi conecta a MySQL de tu PC
✅ Login funciona
✅ Posts se cargan
✅ Datos se guardan
✅ Todo funciona como en navegador

---

**¡Listo para probar!** 🚀

