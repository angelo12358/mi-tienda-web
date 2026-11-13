import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// ========== MIDDLEWARE ==========
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ========== INICIALIZAR BASE DE DATOS ==========
const db = new sqlite3.Database('./tienda.db', (err) => {
  if (err) {
    console.error('❌ Error al abrir la base de datos:', err);
  } else {
    console.log('✅ Base de datos conectada correctamente');
    initializeDatabase();
  }
});

// Función para ejecutar consultas con promesas
function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

function allQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Inicializar tablas
function initializeDatabase() {
  // Tabla de productos
  db.run(`
    CREATE TABLE IF NOT EXISTS productos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      precio REAL NOT NULL,
      descripcion TEXT,
      imagen TEXT,
      categoria TEXT,
      stock INTEGER DEFAULT 100
    )
  `);

  // Tabla de pedidos
  db.run(`
    CREATE TABLE IF NOT EXISTS pedidos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
      total REAL NOT NULL,
      estado TEXT DEFAULT 'pendiente'
    )
  `);

  // Tabla de items del pedido
  db.run(`
    CREATE TABLE IF NOT EXISTS pedido_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pedido_id INTEGER NOT NULL,
      producto_id INTEGER NOT NULL,
      nombre_producto TEXT,
      cantidad INTEGER NOT NULL,
      precio_unitario REAL NOT NULL,
      FOREIGN KEY(pedido_id) REFERENCES pedidos(id),
      FOREIGN KEY(producto_id) REFERENCES productos(id)
    )
  `);

  // Tabla de contactos
  db.run(`
    CREATE TABLE IF NOT EXISTS contactos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      email TEXT NOT NULL,
      asunto TEXT NOT NULL,
      mensaje TEXT NOT NULL,
      fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
      leido INTEGER DEFAULT 0
    )
  `);

  // Agregar columna leído si no existe (para BDs existentes)
  db.run(`
    ALTER TABLE contactos ADD COLUMN leido INTEGER DEFAULT 0
  `, (err) => {
    // Ignorar error si la columna ya existe
  });

  // Insertar productos por defecto
  db.get("SELECT COUNT(*) as count FROM productos", (err, row) => {
    if (row && row.count === 0) {
      const productos = [
        { nombre: 'Laptop Pro 15"', precio: 899.99, descripcion: 'Intel i7, 16GB RAM, SSD 512GB', categoria: 'laptops', imagen: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop' },
        { nombre: 'Laptop Ultra 13"', precio: 1299.99, descripcion: 'M2 Pro, 32GB RAM, SSD 1TB', categoria: 'laptops', imagen: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=300&h=300&fit=crop' },
        { nombre: 'Smartphone X Pro', precio: 799.99, descripcion: '6.7" OLED, Snapdragon 8 Gen2', categoria: 'smartphones', imagen: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300&h=300&fit=crop' },
        { nombre: 'Smartphone Y Plus', precio: 599.99, descripcion: '6.5" LCD, Snapdragon 7 Gen1', categoria: 'smartphones', imagen: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=300&h=300&fit=crop' },
        { nombre: 'Tablet Pro 12.9"', precio: 799.99, descripcion: 'M2 Chip, 128GB, Liquid Display', categoria: 'tablets', imagen: 'https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?w=300&h=300&fit=crop' },
        { nombre: 'Tablet Ultra 11"', precio: 449.99, descripcion: 'MediaTek, 128GB, 120Hz Display', categoria: 'tablets', imagen: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=300&fit=crop' },
        { nombre: 'Mechanical Keyboard RGB', precio: 129.99, descripcion: 'Cherry MX Switches, RGB Backlight, USB-C', categoria: 'accesorios', imagen: 'https://images.unsplash.com/photo-1587829191301-4b5ecbe10738?w=300&h=300&fit=crop' },
        { nombre: 'Premium Headphones', precio: 249.99, descripcion: 'Active noise cancellation, 40h battery', categoria: 'accesorios', imagen: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop' },
        { nombre: 'AirPods Pro Max', precio: 549.99, descripcion: 'Premium Audio, Noise Cancellation', categoria: 'accesorios', imagen: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop' },
        { nombre: 'iPad Air', precio: 599.99, descripcion: '11", M1, 64GB', categoria: 'tablets', imagen: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop' }
      ];

      productos.forEach(p => {
        db.run(
          'INSERT INTO productos (nombre, precio, descripcion, categoria, imagen) VALUES (?, ?, ?, ?, ?)',
          [p.nombre, p.precio, p.descripcion, p.categoria, p.imagen],
          (err) => {
            if (err) console.error('Error al insertar producto:', err);
          }
        );
      });
    }
  });
}

// ========== RUTAS API DE PRODUCTOS ==========

// GET todos los productos
app.get('/api/productos', (req, res) => {
  console.log('📍 GET /api/productos');
  db.all('SELECT * FROM productos', (err, rows) => {
    if (err) {
      console.error('❌ Error:', err);
      res.status(500).json({ error: err.message });
    } else {
      console.log(`✅ ${rows.length} productos enviados`);
      res.json(rows);
    }
  });
});

// GET un producto por ID
app.get('/api/productos/:id', (req, res) => {
  console.log(`📍 GET /api/productos/${req.params.id}`);
  db.get('SELECT * FROM productos WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      console.error('❌ Error:', err);
      res.status(500).json({ error: err.message });
    } else {
      console.log('✅ Producto encontrado');
      res.json(row);
    }
  });
});

// POST crear nuevo producto
app.post('/api/productos', (req, res) => {
  console.log('📍 POST /api/productos');
  const { nombre, precio, descripcion, categoria, imagen } = req.body;

  if (!nombre || !precio) {
    return res.status(400).json({ error: 'Nombre y precio son requeridos' });
  }

  db.run(
    'INSERT INTO productos (nombre, precio, descripcion, categoria, imagen) VALUES (?, ?, ?, ?, ?)',
    [nombre, precio, descripcion || '', categoria || 'general', imagen || ''],
    function(err) {
      if (err) {
        console.error('❌ Error al crear producto:', err);
        res.status(500).json({ error: err.message });
      } else {
        console.log(`✅ Producto ${this.lastID} creado`);
        res.json({ id: this.lastID, mensaje: 'Producto creado correctamente' });
      }
    }
  );
});

// PUT actualizar producto
app.put('/api/productos/:id', (req, res) => {
  console.log(`📍 PUT /api/productos/${req.params.id}`);
  const { nombre, precio, descripcion, categoria, imagen } = req.body;
  const id = req.params.id;

  db.run(
    'UPDATE productos SET nombre = ?, precio = ?, descripcion = ?, categoria = ?, imagen = ? WHERE id = ?',
    [nombre, precio, descripcion || '', categoria || 'general', imagen || '', id],
    function(err) {
      if (err) {
        console.error(`❌ Error al actualizar producto ${id}:`, err);
        res.status(500).json({ error: err.message });
      } else {
        console.log(`✅ Producto ${id} actualizado`);
        res.json({ mensaje: 'Producto actualizado correctamente' });
      }
    }
  );
});

// DELETE eliminar producto
app.delete('/api/productos/:id', (req, res) => {
  console.log(`📍 DELETE /api/productos/${req.params.id}`);
  const id = req.params.id;

  db.run(
    'DELETE FROM productos WHERE id = ?',
    [id],
    function(err) {
      if (err) {
        console.error(`❌ Error al eliminar producto ${id}:`, err);
        res.status(500).json({ error: err.message });
      } else {
        console.log(`✅ Producto ${id} eliminado`);
        res.json({ mensaje: 'Producto eliminado correctamente' });
      }
    }
  );
});

// ========== RUTAS API DE PEDIDOS ==========

// POST crear pedido
app.post('/api/pedidos', (req, res) => {
  console.log('📍 POST /api/pedidos');
  const { items, total } = req.body;
  
  db.run('INSERT INTO pedidos (total) VALUES (?)', [total], function(err) {
    if (err) {
      console.error('❌ Error al crear pedido:', err);
      res.status(500).json({ error: err.message });
      return;
    }

    const pedidoId = this.lastID;
    let itemsGuardados = 0;

    items.forEach(item => {
      db.run(
        'INSERT INTO pedido_items (pedido_id, producto_id, nombre_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?, ?)',
        [pedidoId, item.id || 0, item.name || 'Producto', item.quantity || 1, item.price || 0],
        (err) => {
          if (err) console.error('Error al guardar item:', err);
          itemsGuardados++;
          if (itemsGuardados === items.length) {
            console.log(`✅ Pedido ${pedidoId} creado con ${items.length} items`);
            res.json({ id: pedidoId, mensaje: 'Pedido creado exitosamente' });
          }
        }
      );
    });
  });
});

// GET todos los pedidos
app.get('/api/pedidos', (req, res) => {
  console.log('📍 GET /api/pedidos');
  db.all('SELECT * FROM pedidos ORDER BY fecha DESC', (err, rows) => {
    if (err) {
      console.error('❌ Error:', err);
      res.status(500).json({ error: err.message });
    } else {
      console.log(`✅ ${rows.length} pedidos enviados`);
      res.json(rows);
    }
  });
});

// GET items de un pedido específico
app.get('/api/pedidos/:id/items', (req, res) => {
  const pedidoId = req.params.id;
  console.log(`📍 GET /api/pedidos/${pedidoId}/items`);
  
  db.all(
    'SELECT * FROM pedido_items WHERE pedido_id = ?',
    [pedidoId],
    (err, rows) => {
      if (err) {
        console.error('❌ Error:', err);
        res.status(500).json({ error: err.message });
      } else {
        console.log(`✅ ${rows.length} items encontrados para pedido ${pedidoId}`);
        res.json(rows);
      }
    }
  );
});

// PUT cambiar estado del pedido
app.put('/api/pedidos/:id/estado', (req, res) => {
  const pedidoId = req.params.id;
  const { estado } = req.body;
  console.log(`📍 PUT /api/pedidos/${pedidoId}/estado -> ${estado}`);
  
  db.run(
    'UPDATE pedidos SET estado = ? WHERE id = ?',
    [estado, pedidoId],
    function(err) {
      if (err) {
        console.error(`❌ Error al actualizar estado:`, err);
        res.status(500).json({ error: err.message });
      } else {
        console.log(`✅ Pedido ${pedidoId} actualizado a estado: ${estado}`);
        res.json({ mensaje: `Pedido actualizado a: ${estado}` });
      }
    }
  );
});

// ========== RUTAS API DE CONTACTOS ==========

// POST guardar contacto
app.post('/api/contactos', (req, res) => {
  console.log('📍 POST /api/contactos');
  const { nombre, email, asunto, mensaje } = req.body;

  db.run(
    'INSERT INTO contactos (nombre, email, asunto, mensaje) VALUES (?, ?, ?, ?)',
    [nombre, email, asunto, mensaje],
    function(err) {
      if (err) {
        console.error('❌ Error al guardar contacto:', err);
        res.status(500).json({ error: err.message });
      } else {
        console.log(`✅ Contacto ${this.lastID} guardado`);
        res.json({ id: this.lastID, mensaje: 'Mensaje guardado correctamente' });
      }
    }
  );
});

// GET todos los contactos
app.get('/api/contactos', (req, res) => {
  console.log('📍 GET /api/contactos');
  db.all('SELECT * FROM contactos ORDER BY fecha DESC', (err, rows) => {
    if (err) {
      console.error('❌ Error:', err);
      res.status(500).json({ error: err.message });
    } else {
      console.log(`✅ ${rows.length} contactos enviados`);
      res.json(rows);
    }
  });
});

// PUT marcar contacto como leído
app.put('/api/contactos/:id/leido', (req, res) => {
  const id = req.params.id;
  console.log(`📍 PUT /api/contactos/${id}/leido`);
  
  db.run(
    'UPDATE contactos SET leido = 1 WHERE id = ?',
    [id],
    function(err) {
      if (err) {
        console.error(`❌ Error al marcar contacto ${id}:`, err);
        res.status(500).json({ error: err.message });
      } else {
        console.log(`✅ Contacto ${id} marcado como leído`);
        res.json({ mensaje: 'Contacto marcado como leído' });
      }
    }
  );
});

// DELETE borrar todos los contactos leídos
app.delete('/api/contactos/leidos/todos', (req, res) => {
  console.log('📍 DELETE /api/contactos/leidos/todos');
  
  db.run(
    'DELETE FROM contactos WHERE leido = 1',
    function(err) {
      if (err) {
        console.error('❌ Error al borrar contactos leídos:', err);
        res.status(500).json({ error: err.message });
      } else {
        console.log(`✅ ${this.changes} contactos eliminados`);
        res.json({ mensaje: `${this.changes} contactos eliminados` });
      }
    }
  );
});

// DELETE borrar un contacto específico
app.delete('/api/contactos/:id', (req, res) => {
  const id = req.params.id;
  console.log(`📍 DELETE /api/contactos/${id}`);
  
  db.run(
    'DELETE FROM contactos WHERE id = ?',
    [id],
    function(err) {
      if (err) {
        console.error(`❌ Error al borrar contacto ${id}:`, err);
        res.status(500).json({ error: err.message });
      } else {
        console.log(`✅ Contacto ${id} eliminado. Filas afectadas: ${this.changes}`);
        res.json({ mensaje: 'Contacto eliminado correctamente' });
      }
    }
  );
});

// ========== MIDDLEWARE DE ARCHIVOS ESTÁTICOS (DEBE IR AL FINAL) ==========
app.use(express.static(__dirname));

// Ruta 404
app.use((req, res) => {
  console.log(`⚠️  Ruta no encontrada: ${req.method} ${req.path}`);
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// ========== INICIAR SERVIDOR ==========
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor ejecutándose en http://localhost:${PORT}`);
  console.log('📊 Base de datos SQLite conectada');
  console.log('✅ Listo para recibir solicitudes\n');
});
