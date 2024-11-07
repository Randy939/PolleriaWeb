document.addEventListener('DOMContentLoaded', function() {
    // Asegurarnos de que los elementos existen antes de continuar
    const carritoBtn = document.querySelector('#carrito-btn');
    if (!carritoBtn) {
        console.error('No se encontró el botón del carrito');
        return;
    }

    const carritoPanel = document.querySelector('.carrito-panel');
    if (!carritoPanel) {
        console.error('No se encontró el panel del carrito');
        return;
    }

    const cerrarCarritoBtn = document.querySelector('.cerrar-carrito');
    const carritoItems = document.querySelector('.carrito-items');
    const carritoVacio = document.querySelector('.carrito-vacio');
    const totalAmount = document.querySelector('.total-amount');
    
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    // Eliminar cualquier evento existente
    const nuevoCarritoBtn = carritoBtn.cloneNode(true);
    carritoBtn.parentNode.replaceChild(nuevoCarritoBtn, carritoBtn);
    
    // Agregar el nuevo evento
    nuevoCarritoBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Click en carrito'); // Para debugging
        carritoPanel.classList.toggle('active');
        actualizarCarritoUI();
    });
    
    cerrarCarritoBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        carritoPanel.classList.remove('active');
    });
    
    // Evitar que los clics dentro del panel cierren el carrito
    carritoPanel.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    // Cerrar al hacer clic fuera del panel
    document.addEventListener('click', function() {
        if (carritoPanel.classList.contains('active')) {
            carritoPanel.classList.remove('active');
        }
    });
    
    function actualizarCarritoUI() {
        if (carrito.length === 0) {
            carritoItems.style.display = 'none';
            carritoVacio.style.display = 'block';
        } else {
            carritoItems.style.display = 'block';
            carritoVacio.style.display = 'none';
            
            carritoItems.innerHTML = '';
            carrito.forEach(item => {
                const itemElement = crearItemCarrito(item);
                carritoItems.appendChild(itemElement);
            });
        }
        
        actualizarTotal();
    }
    
    function crearItemCarrito(item) {
        const div = document.createElement('div');
        div.className = 'carrito-item';
        div.innerHTML = `
            <img src="${item.imagen}" alt="${item.nombre}">
            <div class="item-details">
                <h3>${item.nombre}</h3>
                <span class="precio">S/. ${item.precio.toFixed(2)}</span>
                <div class="item-cantidad">
                    <button class="cantidad-btn menos">-</button>
                    <span class="cantidad-valor">${item.cantidad}</span>
                    <button class="cantidad-btn mas">+</button>
                </div>
            </div>
            <i class="fas fa-trash eliminar-item"></i>
        `;
        
        // Eventos para los botones de cantidad
        const btnMenos = div.querySelector('.menos');
        const btnMas = div.querySelector('.mas');
        const btnEliminar = div.querySelector('.eliminar-item');
        
        btnMenos.addEventListener('click', () => actualizarCantidad(item.id, -1));
        btnMas.addEventListener('click', () => actualizarCantidad(item.id, 1));
        btnEliminar.addEventListener('click', () => eliminarItem(item.id));
        
        return div;
    }
    
    function actualizarCantidad(id, cambio) {
        const item = carrito.find(i => i.id === id);
        if (item) {
            item.cantidad = Math.max(1, item.cantidad + cambio);
            guardarCarrito();
            actualizarCarritoUI();
        }
    }
    
    function eliminarItem(id) {
        carrito = carrito.filter(item => item.id !== id);
        guardarCarrito();
        actualizarCarritoUI();
    }
    
    function actualizarTotal() {
        const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
        totalAmount.textContent = `S/. ${total.toFixed(2)}`;
    }
    
    function guardarCarrito() {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }
});
