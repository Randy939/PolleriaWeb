document.addEventListener('DOMContentLoaded', function() {
    // Objeto global del carrito
    window.carrito = {
        items: JSON.parse(localStorage.getItem('carrito')) || [],
        
        agregarItem(producto) {
            const itemExistente = this.items.find(item => item.id === producto.id);
            
            if (itemExistente) {
                itemExistente.cantidad += producto.cantidad;
            } else {
                this.items.push(producto);
            }
            
            this.guardarCarrito();
            this.actualizarCarritoUI();
            this.mostrarCarrito();
        },
        
        actualizarCantidad(id, cambio) {
            const item = this.items.find(i => i.id === id);
            if (item) {
                item.cantidad = Math.max(1, item.cantidad + cambio);
                this.guardarCarrito();
                this.actualizarCarritoUI();
            }
        },
        
        eliminarItem(id) {
            this.items = this.items.filter(item => item.id !== id);
            this.guardarCarrito();
            this.actualizarCarritoUI();
        },
        
        guardarCarrito() {
            localStorage.setItem('carrito', JSON.stringify(this.items));
        },
        
        mostrarCarrito() {
            const carritoPanel = document.querySelector('.carrito-panel');
            if (carritoPanel) {
                carritoPanel.classList.add('active');
                this.actualizarCarritoUI();
            }
        },
        
        ocultarCarrito() {
            const carritoPanel = document.querySelector('.carrito-panel');
            if (carritoPanel) {
                carritoPanel.classList.remove('active');
            }
        },
        
        actualizarCarritoUI() {
            const carritoItems = document.querySelector('.carrito-items');
            const carritoVacio = document.querySelector('.carrito-vacio');
            const totalAmount = document.querySelector('.total-amount');
            
            if (!carritoItems || !carritoVacio || !totalAmount) return;
            
            if (this.items.length === 0) {
                carritoItems.style.display = 'none';
                carritoVacio.style.display = 'block';
            } else {
                carritoItems.style.display = 'block';
                carritoVacio.style.display = 'none';
                
                carritoItems.innerHTML = this.items.map(item => this.crearItemCarritoHTML(item)).join('');
                
                // Agregar eventos a los botones
                this.inicializarEventosBotones();
            }
            
            // Actualizar total
            const total = this.items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
            totalAmount.textContent = `S/. ${total.toFixed(2)}`;
        },
        
        crearItemCarritoHTML(item) {
            return `
                <div class="carrito-item" data-id="${item.id}">
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
                </div>
            `;
        },
        
        inicializarEventosBotones() {
            document.querySelectorAll('.carrito-item').forEach(item => {
                const id = item.dataset.id;
                item.querySelector('.menos').addEventListener('click', () => this.actualizarCantidad(id, -1));
                item.querySelector('.mas').addEventListener('click', () => this.actualizarCantidad(id, 1));
                item.querySelector('.eliminar-item').addEventListener('click', () => this.eliminarItem(id));
            });
        }
    };
    
    // Inicializar eventos del carrito
    const carritoBtn = document.querySelector('#carrito-btn');
    const cerrarCarritoBtn = document.querySelector('.cerrar-carrito');
    
    if (carritoBtn) {
        carritoBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            carrito.mostrarCarrito();
        });
    }
    
    if (cerrarCarritoBtn) {
        cerrarCarritoBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            carrito.ocultarCarrito();
        });
    }
    
    // Cerrar al hacer clic fuera
    document.addEventListener('click', (e) => {
        const carritoPanel = document.querySelector('.carrito-panel');
        if (carritoPanel && !carritoPanel.contains(e.target) && !e.target.closest('#carrito-btn')) {
            carrito.ocultarCarrito();
        }
    });
    
    // Inicializar UI
    carrito.actualizarCarritoUI();
});
