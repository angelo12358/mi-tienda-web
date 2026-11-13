# 🚀 GUÍA RÁPIDA: Cómo usar tu Base de Datos

## ⚡ Paso 1: Instalar dependencias (una sola vez)
Abre Terminal y ejecuta:
```bash
cd /Users/miguelgarcia/Desktop/mi-tienda-web
npm install
```

## ⚡ Paso 2: Iniciar el servidor
En la Terminal, ejecuta:
```bash
npm start
```

Deberías ver:
```
Servidor ejecutándose en http://localhost:3001
Base de datos SQLite conectada
```

**¡IMPORTANTE! Mantén esta Terminal abierta mientras usas tu tienda.**

## ⚡ Paso 3: Usar tu tienda
- Abre tu navegador en: `http://localhost:3001` o abre los archivos HTML
- Añade productos al carrito
- Haz checkout → Tu pedido se guarda en la BD
- Envía un mensaje de contacto → Se guarda en la BD

## 📊 Ver los datos guardados

### Ver pedidos (en otra Terminal):
```bash
sqlite3 /Users/miguelgarcia/Desktop/mi-tienda-web/tienda.db
sqlite> SELECT * FROM pedidos;
sqlite> SELECT * FROM pedido_items;
sqlite> .quit
```

### Ver contactos:
```bash
sqlite3 /Users/miguelgarcia/Desktop/mi-tienda-web/tienda.db
sqlite> SELECT * FROM contactos;
```

## 🔗 APIs disponibles

Tu servidor proporciona estas APIs REST:

**Productos:**
```
GET http://localhost:3001/api/productos
GET http://localhost:3001/api/productos/:id
```

**Pedidos:**
```
POST http://localhost:3001/api/pedidos
GET http://localhost:3001/api/pedidos
```

**Contactos:**
```
POST http://localhost:3001/api/contactos
GET http://localhost:3001/api/contactos
```

## 📂 Archivos creados

```
server.js          → El servidor con la BD
db.js              → Funciones para conectar con la BD
package.json       → Dependencias
tienda.db          → La base de datos (se crea automáticamente)
INSTRUCCIONES_BD.md → Guía detallada
```

## ⚠️ Problemas comunes

**Error: Module not found**
→ Ejecuta: `npm install`

**Error: Port 3001 already in use**
→ Cierra otras aplicaciones o cambia el puerto en `server.js`

**Los datos no se guardan**
→ Verifica que el servidor está corriendo en Terminal

¡Listo! Ahora tu tienda tiene una base de datos completa funcionando. 🎉
