class Carrito {
    constructor() {
        this.items = [];
        this.total = 0;
        this.init();
    }

    init() {
        // Elementos del DOM
        this.carritoBtn = document.querySelector('#carrito-btn');
        this.carritoPanel = document.querySelector('.carrito-panel');
        this.cerrarBtn = document.querySelector('.cerrar-carrito');
        this.overlay = document.querySelector('.overlay-carrito');
        this.carritoItems = document.querySelector('.carrito-items');
        this.totalElement = document.querySelector('.total-precio');

        // Event listeners
        this.carritoBtn.addEventListener('click', () => this.toggleCarrito());
        this.cerrarBtn.addEventListener('click', () => this.toggleCarrito());
        this.overlay.addEventListener('click', () => this.toggleCarrito());

        // Cargar items del localStorage
        this.cargarItems();
    }

    toggleCarrito() {
        this.carritoPanel.classList.toggle('active');
        this.overlay.classList.toggle('active');
    }

    agregarItem(producto) {
        const itemExistente = this.items.find(item => item.id === producto.id);

        if (itemExistente) {
            itemExistente.cantidad += producto.cantidad;
        } else {
            this.items.push(producto);
        }

        this.actualizarCarrito();
        this.mostrarMensaje('Producto agregado al carrito', 'success');
    }

    eliminarItem(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.actualizarCarrito();
    }

    actualizarCantidad(id, cantidad) {
        const item = this.items.find(item => item.id === id);
        if (item) {
            item.cantidad = cantidad;
            if (item.cantidad <= 0) {
                this.eliminarItem(id);
            }
            this.actualizarCarrito();
        }
    }

    actualizarCarrito() {
        // Guardar en localStorage
        localStorage.setItem('carrito', JSON.stringify(this.items));

        // Actualizar DOM
        this.carritoItems.innerHTML = this.items.map(item => `
            <div class="carrito-item" data-id="${item.id}">
                <img src="${item.imagen}" alt="${item.nombre}">
                <div class="item-detalles">
                    <h4>${item.nombre}</h4>
                    <div class="item-precio">S/. ${(item.precio * item.cantidad).toFixed(2)}</div>
                    <div class="item-cantidad">
                        <button class="cantidad-btn menos">-</button>
                        <span>${item.cantidad}</span>
                        <button class="cantidad-btn mas">+</button>
                    </div>
                </div>
                <button class="eliminar-item">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');

        // Actualizar total
        this.total = this.items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
        this.totalElement.textContent = `S/. ${this.total.toFixed(2)}`;

        // Agregar event listeners a los botones
        this.agregarEventListeners();
    }

    cargarItems() {
        const itemsGuardados = localStorage.getItem('carrito');
        if (itemsGuardados) {
            this.items = JSON.parse(itemsGuardados);
            this.actualizarCarrito();
        }
    }

    agregarEventListeners() {
        const botonesEliminar = document.querySelectorAll('.eliminar-item');
        const botonesCantidad = document.querySelectorAll('.cantidad-btn');

        botonesEliminar.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.closest('.carrito-item').dataset.id;
                this.eliminarItem(id);
            });
        });

        botonesCantidad.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const item = e.target.closest('.carrito-item');
                const id = item.dataset.id;
                const cantidadActual = parseInt(item.querySelector('.item-cantidad span').textContent);
                
                if (btn.classList.contains('mas')) {
                    this.actualizarCantidad(id, cantidadActual + 1);
                } else if (btn.classList.contains('menos')) {
                    this.actualizarCantidad(id, cantidadActual - 1);
                }
            });
        });
    }

    mostrarMensaje(texto, tipo) {
        const mensaje = document.createElement('div');
        mensaje.className = `mensaje-carrito ${tipo}`;
        mensaje.innerHTML = `
            <i class="fas fa-${tipo === 'success' ? 'check-circle' : 'times-circle'}"></i>
            <span>${texto}</span>
        `;

        document.body.appendChild(mensaje);

        setTimeout(() => {
            mensaje.remove();
        }, 3000);
    }
}

// Inicializar el carrito
const carrito = new Carrito();
