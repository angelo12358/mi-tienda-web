// Funciones para comunicarse con la base de datos

const API_URL = 'http://localhost:3001/api';

// Obtener todos los productos de la BD
export async function obtenerProductos() {
  try {
    const response = await fetch(`${API_URL}/productos`);
    if (!response.ok) throw new Error('Error al obtener productos');
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

// Obtener un producto específico
export async function obtenerProducto(id) {
  try {
    const response = await fetch(`${API_URL}/productos/${id}`);
    if (!response.ok) throw new Error('Error al obtener producto');
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Crear un pedido
export async function crearPedido(items, total) {
  try {
    const response = await fetch(`${API_URL}/pedidos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ items, total })
    });
    if (!response.ok) throw new Error('Error al crear pedido');
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Obtener todos los pedidos
export async function obtenerPedidos() {
  try {
    const response = await fetch(`${API_URL}/pedidos`);
    if (!response.ok) throw new Error('Error al obtener pedidos');
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

// Guardar contacto en BD
export async function guardarContacto(nombre, email, asunto, mensaje) {
  try {
    const response = await fetch(`${API_URL}/contactos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nombre, email, asunto, mensaje })
    });
    if (!response.ok) throw new Error('Error al guardar contacto');
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Obtener contactos
export async function obtenerContactos() {
  try {
    const response = await fetch(`${API_URL}/contactos`);
    if (!response.ok) throw new Error('Error al obtener contactos');
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}
