# 🗄️ Instrucciones para usar la Base de Datos

## 📋 Requisitos previos
- Node.js instalado en tu computadora
- Terminal/Consola

## 🚀 Instalación y Configuración

### 1. Instalar dependencias
Abre una terminal en la carpeta del proyecto y ejecuta:
```bash
npm install
```

Esto instalará:
- **express**: Servidor web
- **sqlite3**: Base de datos
- **cors**: Para permitir conexiones desde el frontend
- **body-parser**: Para procesar datos JSON

### 2. Iniciar el servidor
En la misma terminal, ejecuta:
```bash
npm start
```

Deberías ver:
```
Servidor ejecutándose en http://localhost:3001
Base de datos SQLite conectada
```

**El servidor debe estar CORRIENDO para que funcione la tienda.**

## 📊 Estructura de la Base de Datos

La base de datos tiene 4 tablas principales:

### 1. **productos**
- id (ID único)
- nombre
- precio
- descripcion
- imagen
- categoria
- stock

### 2. **pedidos**
- id (ID único)
- fecha
- total
- estado

### 3. **pedido_items**
- id
- pedido_id (referencia al pedido)
- producto_id (referencia al producto)
- cantidad
- precio_unitario

### 4. **contactos**
- id
- nombre
- email
- asunto
- mensaje
- fecha

## 🔗 APIs disponibles

```
GET /api/productos              → Obtener todos los productos
GET /api/productos/:id          → Obtener un producto específico
POST /api/pedidos               → Crear un pedido
GET /api/pedidos                → Obtener todos los pedidos
POST /api/contactos             → Guardar un contacto
GET /api/contactos              → Obtener todos los contactos
```

## 📁 Archivos nuevos

- **server.js**: El servidor con todas las rutas de la BD
- **db.js**: Funciones para comunicarse con la BD desde JavaScript
- **package.json**: Lista de dependencias
- **.gitignore**: Archivos ignorados por Git
- **tienda.db**: La base de datos (se crea automáticamente)

## ⚠️ Notas importantes

1. Mantén el servidor corriendo mientras usas la tienda
2. La base de datos es **local** (en tu computadora)
3. Los productos se cargan automáticamente la primera vez
4. Todos los datos se guardan en **tienda.db**

## 🛒 Cómo usar desde el HTML

En tu JavaScript, ahora puedes usar:

```javascript
import { obtenerProductos, crearPedido, guardarContacto } from './db.js';

// Obtener productos
const productos = await obtenerProductos();

// Crear pedido
const pedido = await crearPedido(itemsDelCarrito, total);

// Guardar contacto
await guardarContacto(nombre, email, asunto, mensaje);
```

## 🐛 Solución de problemas

**Error: Cannot find module 'express'**
→ Ejecuta: `npm install`

**Error: EADDRINUSE: address already in use :::3001**
→ Otro programa usa el puerto 3001. Cambia el puerto en server.js o cierra la otra aplicación

**No se guardan los datos**
→ Verifica que el servidor está corriendo

¡Listo! Tu tienda ahora tiene una base de datos completa 🎉
