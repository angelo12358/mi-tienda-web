// ========== CONEXIÓN CON BASE DE DATOS (SUPABASE) ==========
// `supabaseClient` viene de supabase-config.js (se carga antes que este archivo).

// Carrito de compras (almacenamiento local)
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Productos cargados de la BD, guardados por id (los usa addToCartPorId)
const productosPorId = {};

// Obtener todos los productos de la BD
async function obtenerProductos() {
    try {
        const { data, error } = await supabaseClient
            .from('productos')
            .select('*')
            .order('id', { ascending: true });
        if (error) throw error;
        (data || []).forEach(p => { productosPorId[p.id] = p; });
        return data || [];
    } catch (error) {
        console.error('Error al obtener productos:', error);
        return [];
    }
}

// Crear un pedido en la BD (pedido + sus items en pedido_items)
async function crearPedidoBD(items, total) {
    try {
        // 1. Crear el pedido y obtener su id
        const { data: pedido, error: errorPedido } = await supabaseClient
            .from('pedidos')
            .insert({ total: Number(total.toFixed(2)) })
            .select()
            .single();
        if (errorPedido) throw errorPedido;

        // 2. Guardar los items del pedido
        const filas = items.map(item => ({
            pedido_id: pedido.id,
            producto_id: item.id || 0,
            nombre_producto: item.name || 'Producto',
            cantidad: item.quantity || 1,
            precio_unitario: Number(item.price) || 0
        }));

        const { error: errorItems } = await supabaseClient
            .from('pedido_items')
            .insert(filas);
        if (errorItems) throw errorItems;

        return pedido;
    } catch (error) {
        console.error('Error al crear pedido:', error);
        return null;
    }
}

// Guardar contacto en BD
async function guardarContactoBD(nombre, email, asunto, mensaje) {
    try {
        const { error } = await supabaseClient
            .from('contactos')
            .insert({ nombre, email, asunto, mensaje });
        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error al guardar contacto:', error);
        return null;
    }
}

// Actualizar contador del carrito
function updateCartCount() {
    const count = cart.length;
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = `(${count})`;
    });
}

// Añadir producto al carrito usando su id de la BD.
// Así los nombres con comillas (ej. Laptop Pro 15") no rompen el botón.
function addToCartPorId(id) {
    const p = productosPorId[id];
    if (!p) return;
    addToCart(p.nombre, p.precio);
}

// Añadir producto al carrito
function addToCart(name, price) {
    const product = {
        id: Date.now(),
        name: name,
        price: Number(price),
        quantity: 1
    };
    
    // Verificar si el producto ya existe
    const existingProduct = cart.find(item => item.name === name);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push(product);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Show notification
    showNotification(`${name} added to cart`);
}

// Mostrar notificación
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #10b981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 4px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Mostrar carrito en la página del carrito
function displayCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    const emptyCartDiv = document.getElementById('emptyCart');
    
    if (!cartItemsContainer) return;
    
    // Contenedor con la lista y el resumen del pedido
    const cartContent = document.querySelector('.cart-content') || cartItemsContainer.parentElement;

    if (cart.length === 0) {
        // Ocultar lista y resumen para que no se queden los totales viejos
        cartContent.style.display = 'none';
        emptyCartDiv.style.display = 'block';
        return;
    }

    cartContent.style.display = '';
    emptyCartDiv.style.display = 'none';
    cartItemsContainer.innerHTML = '';
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="https://via.placeholder.com/100x100?text=${encodeURIComponent(item.name)}" alt="${item.name}">
            <div class="item-details">
                <h4>${item.name}</h4>
                <p>$${Number(item.price).toFixed(2)}</p>
            </div>
            <div class="item-actions">
                <input type="number" class="quantity-input" min="1" value="${item.quantity}" 
                       onchange="updateQuantity(${item.id}, this.value)">
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Eliminar</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    
    updateCartSummary();
}

// Actualizar cantidad del producto
function updateQuantity(id, quantity) {
    const product = cart.find(item => item.id === id);
    if (product) {
        product.quantity = parseInt(quantity);
        if (product.quantity <= 0) {
            removeFromCart(id);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartSummary();
        }
    }
}

// Eliminar producto del carrito
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCart();
}

// Calcular los totales del carrito (lo usan el resumen y el checkout,
// así ambos muestran exactamente el mismo total)
function calcularTotales() {
    const subtotal = cart.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
    const shipping = subtotal > 100 ? 0 : 10;
    const tax = (subtotal + shipping) * 0.1;
    const total = subtotal + shipping + tax;
    return { subtotal, shipping, tax, total };
}

// Actualizar resumen del carrito
function updateCartSummary() {
    const { subtotal, shipping, tax, total } = calcularTotales();

    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total');
    
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = `$${shipping.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}

// Proceder al pago
async function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty');
        return;
    }
    
    const finalTotal = calcularTotales().total;
    
    // Guardar pedido en la BD
    const pedido = await crearPedidoBD(cart, finalTotal);
    
    if (!pedido) {
        // No vaciamos el carrito para que el cliente pueda reintentar
        alert('No se pudo guardar tu pedido. Revisa tu conexión e inténtalo de nuevo.');
        return;
    }

    alert(`¡Gracias por tu compra!\nPedido #${pedido.id}\nTotal: $${finalTotal.toFixed(2)}\n\nTu pedido ha sido guardado en la base de datos.`);
    
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCart();
}

// Continuar comprando
function continueShopping() {
    window.location.href = 'productos.html';
}

// Filtrar productos
function filterProducts(category) {
    const products = document.querySelectorAll('.product-card');
    const buttons = document.querySelectorAll('.filter-btn');
    
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    products.forEach(product => {
        if (category === 'all' || product.getAttribute('data-category') === category) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// Enviar mensaje de contacto
async function sendMessage(event) {
    event.preventDefault();
    
    const form = event.target;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    if (name && email && subject && message) {
        // Guardar en BD
        const resultado = await guardarContactoBD(name, email, subject, message);
        
        const messageDiv = document.getElementById('formMessage');
        if (!resultado) {
            messageDiv.textContent = 'No se pudo enviar el mensaje. Inténtalo de nuevo.';
            messageDiv.className = 'form-message error';
            return;
        }
        messageDiv.textContent = 'Mensaje enviado. Nos pondremos en contacto pronto.';
        messageDiv.className = 'form-message success';
        
        form.reset();
        
        setTimeout(() => {
            messageDiv.className = 'form-message';
            messageDiv.textContent = '';
        }, 5000);
    }
}

// Animar estilos CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Cargar productos en página de productos desde API
async function cargarProductosEnPagina() {
    const container = document.getElementById('productosContainer');
    if (!container) return; // Si no existe el contenedor, no hacer nada
    
    try {
        const productos = await obtenerProductos();
        
        if (productos.length === 0) {
            container.innerHTML = '<div style="text-align: center; padding: 40px; grid-column: 1/-1;"><p>No hay productos disponibles</p></div>';
            return;
        }
        
        let html = '';
        productos.forEach(p => {
            const imagen = p.imagen || 'https://via.placeholder.com/250?text=' + encodeURIComponent(p.nombre);
            html += `
                <div class="product-card" data-category="${p.categoria || 'general'}">
                    <img src="${imagen}" alt="${p.nombre}" onerror="this.src='https://via.placeholder.com/250?text=No+Image'">
                    <h3>${p.nombre}</h3>
                    <p class="price">$${Number(p.precio).toFixed(2)}</p>
                    <p class="description">${p.descripcion || 'Descripción no disponible'}</p>
                    <button class="btn btn-secondary" onclick="addToCartPorId(${p.id})">Add to Cart</button>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
        // Reinicializar el filtro de categorías
        if (window.filterProducts) {
            const buttons = document.querySelectorAll('.filter-btn');
            buttons.forEach(btn => {
                btn.addEventListener('click', function() {
                    const categoria = this.textContent.toLowerCase();
                    if (categoria === 'all') {
                        filterProducts('all');
                    } else if (categoria === 'laptops') {
                        filterProducts('laptops');
                    } else if (categoria === 'smartphones') {
                        filterProducts('smartphones');
                    } else if (categoria === 'tablets') {
                        filterProducts('tablets');
                    } else if (categoria === 'accessories') {
                        filterProducts('accesorios');
                    }
                });
            });
        }
    } catch (error) {
        console.error('Error cargando productos:', error);
        container.innerHTML = '<div style="text-align: center; padding: 40px; grid-column: 1/-1;"><p>Error al cargar productos</p></div>';
    }
}

// Cargar productos destacados en homepage
async function cargarProductosDestacados() {
    const container = document.getElementById('productosDestacados');
    if (!container) return; // Si no existe el contenedor, no hacer nada
    
    try {
        const productos = await obtenerProductos();
        
        if (productos.length === 0) {
            container.innerHTML = '<div style="text-align: center; padding: 40px; grid-column: 1/-1;"><p>No hay productos disponibles</p></div>';
            return;
        }
        
        // Mostrar solo los primeros 4 productos
        const productosLimitados = productos.slice(0, 4);
        
        let html = '';
        productosLimitados.forEach(p => {
            const imagen = p.imagen || 'https://via.placeholder.com/300?text=' + encodeURIComponent(p.nombre);
            html += `
                <div class="product-card">
                    <img src="${imagen}" alt="${p.nombre}" onerror="this.src='https://via.placeholder.com/300?text=No+Image'">
                    <h3>${p.nombre}</h3>
                    <p class="price">$${Number(p.precio).toFixed(2)}</p>
                    <p class="description">${p.descripcion || 'Descripción no disponible'}</p>
                    <button class="btn btn-secondary" onclick="addToCartPorId(${p.id})">Add to Cart</button>
                </div>
            `;
        });
        
        container.innerHTML = html;
    } catch (error) {
        console.error('Error cargando productos destacados:', error);
        container.innerHTML = '<div style="text-align: center; padding: 40px; grid-column: 1/-1;"><p>Error al cargar productos</p></div>';
    }
}

// Inicializar página de productos cuando carga
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    cargarProductosEnPagina();
    cargarProductosDestacados();
});
