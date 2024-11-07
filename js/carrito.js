class Carrito {
    constructor() {
        this.items = [];
        this.total = 0;
        document.addEventListener('DOMContentLoaded', () => {
            this.waitForElement('.carrito-container').then(() => {
                this.init();
            });
        });
    }

    waitForElement(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve();
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    init() {
        // Cargar carrito del localStorage si existe
        this.cargarCarritoDesdeStorage();
        
        // Agregar event listeners
        this.agregarEventListeners();
        
        // Renderizar el carrito inicial
        this.renderizarCarrito();
    }

    cargarCarritoDesdeStorage() {
        const carritoGuardado = localStorage.getItem('carrito');
        if (carritoGuardado) {
            this.items = JSON.parse(carritoGuardado);
            this.actualizarTotal();
        }
    }

    agregarEventListeners() {
        // Botón del carrito en el header
        const carritoBtn = document.getElementById('carrito-btn');
        if (carritoBtn) {
            carritoBtn.addEventListener('click', () => this.toggleCarrito());
        }

        // Botón de cerrar en el carrito
        const closeBtn = document.getElementById('close-carrito');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.toggleCarrito());
        }

        // Botón de realizar pedido
        const realizarPedidoBtn = document.getElementById('realizar-pedido');
        if (realizarPedidoBtn) {
            realizarPedidoBtn.addEventListener('click', () => this.realizarPedido());
        }

        // Agregar listener para los botones "Agregar al carrito" en el menú
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('agregar-al-carrito')) {
                const productoElement = e.target.closest('.producto');
                if (productoElement) {
                    const producto = {
                        id: productoElement.dataset.id,
                        nombre: productoElement.dataset.nombre,
                        precio: parseFloat(productoElement.dataset.precio),
                        imagen: productoElement.dataset.imagen
                    };
                    this.agregarItem(producto);
                }
            }
        });
    }

    toggleCarrito() {
        document.querySelector('.carrito-container').classList.toggle('active');
    }

    agregarItem(producto) {
        const itemExistente = this.items.find(item => item.id === producto.id);
        
        if (itemExistente) {
            itemExistente.cantidad++;
        } else {
            this.items.push({
                ...producto,
                cantidad: 1
            });
        }

        this.actualizarCarrito();
        this.mostrarMensaje('Producto agregado al carrito');
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
            } else {
                this.actualizarCarrito();
            }
        }
    }

    actualizarCarrito() {
        this.actualizarTotal();
        this.guardarCarrito();
        this.renderizarCarrito();
    }

    actualizarTotal() {
        this.total = this.items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
        document.getElementById('total').textContent = this.total.toFixed(2);
    }

    guardarCarrito() {
        localStorage.setItem('carrito', JSON.stringify(this.items));
    }

    renderizarCarrito() {
        const carritoItems = document.querySelector('.carrito-items');
        if (!carritoItems) return;
        
        carritoItems.innerHTML = '';

        this.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'carrito-item';
            itemElement.innerHTML = `
                <img src="${item.imagen}" alt="${item.nombre}">
                <div class="carrito-item-info">
                    <h3>${item.nombre}</h3>
                    <p>S/. ${item.precio.toFixed(2)}</p>
                    <div class="carrito-item-cantidad">
                        <button onclick="carrito.actualizarCantidad('${item.id}', ${item.cantidad - 1})">-</button>
                        <span>${item.cantidad}</span>
                        <button onclick="carrito.actualizarCantidad('${item.id}', ${item.cantidad + 1})">+</button>
                        <button class="eliminar" onclick="carrito.eliminarItem('${item.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            carritoItems.appendChild(itemElement);
        });
    }

    mostrarMensaje(texto) {
        const mensaje = document.createElement('div');
        mensaje.className = 'mensaje-carrito';
        mensaje.textContent = texto;
        mensaje.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #2c5530;
            color: white;
            padding: 1rem 2rem;
            border-radius: 5px;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        `;
        document.body.appendChild(mensaje);
        setTimeout(() => {
            mensaje.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => mensaje.remove(), 300);
        }, 2000);
    }

    realizarPedido() {
        if (this.items.length === 0) {
            alert('Tu carrito está vacío');
            return;
        }
        
        // Aquí puedes agregar la lógica para procesar el pedido
        // Por ejemplo, redirigir a una página de checkout
        alert('¡Gracias por tu pedido! Serás redirigido al checkout.');
        // window.location.href = '/checkout';
    }
}

// Crear una única instancia global del carrito
window.carrito = new Carrito();