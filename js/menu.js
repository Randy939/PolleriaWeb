document.addEventListener('DOMContentLoaded', function() {
    const categoriasContainer = document.querySelector('.categorias-container');
    const productosContainer = document.querySelector('.productos-container');
    const btnVolver = document.querySelector('.btn-volver');
    const mensajeNoProductos = document.querySelector('.mensaje-no-productos');
    const API_URL = 'https://randy939-001-site1.qtempurl.com/app/Controllers/productos.php';

    // Función para cargar las categorías
    async function cargarCategorias() {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            
            if (data.status === 'success' && data.categorias) {
                categoriasContainer.innerHTML = data.categorias.map(categoria => `
                    <div class="categoria-card" data-categoria="${categoria.id}">
                        <div class="categoria-imagen">
                            <img src="/images/${categoria.nombre.toLowerCase().replace(/ /g, '-')}.png" alt="${categoria.nombre}">
                            <div class="overlay"></div>
                        </div>
                        <div class="categoria-content">
                            <h3>${categoria.nombre}</h3>
                            <a href="#" class="btn-categoria">Ver Menú <i class="fas fa-arrow-right"></i></a>
                        </div>
                    </div>
                `).join('');

                // Reactivar los event listeners para las nuevas tarjetas
                activarEventListeners();
            }
        } catch (error) {
            console.error('Error al cargar categorías:', error);
        }
    }

    // Función para cargar productos por categoría
    async function cargarProductos(categoriaId) {
        try {
            const response = await fetch(`${API_URL}?categoria_id=${categoriaId}`);
            const data = await response.json();

            if (data.status === 'success' && data.productos) {
                const cajaContenedora = productosContainer.querySelector('.caja-contenedora');
                
                if (data.productos.length === 0) {
                    mensajeNoProductos.style.display = 'block';
                    cajaContenedora.innerHTML = '';
                    return;
                }

                mensajeNoProductos.style.display = 'none';
                cajaContenedora.innerHTML = data.productos.map(producto => `
                    <div class="box" data-categoria="${producto.categoria_id}">
                        <div class="image">
                            <img src="${producto.imagen}" alt="${producto.nombre}">
                            <a href="#" class="fas fa-heart"></a>
                        </div>
                        <div class="content">
                            <div class="stars">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star-half-alt"></i>
                            </div>
                            <h3>${producto.nombre}</h3>
                            <p>${producto.descripcion}</p>
                            <div class="precio-cantidad">
                                <span class="precio">S/. ${producto.precio}</span>
                                <div class="cantidad-control">
                                    <button class="cantidad-btn menos">-</button>
                                    <input type="number" class="cantidad-input" value="1" min="1" max="99" readonly>
                                    <button class="cantidad-btn mas">+</button>
                                </div>
                            </div>
                            <button class="btn agregar-carrito" 
                                    data-id="${producto.id}" 
                                    data-nombre="${producto.nombre}" 
                                    data-precio="${producto.precio}" 
                                    data-imagen="${producto.imagen}">
                                <i class="fas fa-shopping-cart"></i> Agregar
                            </button>
                        </div>
                    </div>
                `).join('');

                // Reactivar los controles de cantidad
                activarControlesCantidad();
            }
        } catch (error) {
            console.error('Error al cargar productos:', error);
        }
    }

    // Función para mostrar productos de una categoría
    function mostrarProductos(categoriaId) {
        categoriasContainer.style.display = 'none';
        productosContainer.style.display = 'block';
        btnVolver.style.display = 'flex';
        cargarProductos(categoriaId);
    }

    // Función para volver a la vista de categorías
    function volverACategorias() {
        categoriasContainer.style.display = 'grid';
        productosContainer.style.display = 'none';
        btnVolver.style.display = 'none';
        mensajeNoProductos.style.display = 'none';
    }

    // Función para activar event listeners
    function activarEventListeners() {
        const categoriaCards = document.querySelectorAll('.categoria-card');
        categoriaCards.forEach(card => {
            card.addEventListener('click', () => {
                const categoriaId = card.dataset.categoria;
                mostrarProductos(categoriaId);
            });
        });
    }

    // Función para activar controles de cantidad
    function activarControlesCantidad() {
        const cantidadBtns = document.querySelectorAll('.cantidad-btn');
        cantidadBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const input = this.parentElement.querySelector('.cantidad-input');
                let value = parseInt(input.value);

                if (this.classList.contains('mas')) {
                    value = Math.min(value + 1, 99);
                } else if (this.classList.contains('menos')) {
                    value = Math.max(value - 1, 1);
                }

                input.value = value;
            });
        });
    }

    // Evento para el botón de volver
    btnVolver.addEventListener('click', volverACategorias);

    // Cargar categorías al iniciar
    cargarCategorias();

    // Manejar categoría desde URL
    const urlParams = new URLSearchParams(window.location.search);
    const categoriaFromUrl = urlParams.get('categoria-card');
    if (categoriaFromUrl) {
        mostrarProductos(categoriaFromUrl);
    }

    // Mantener el evento para agregar al carrito
    document.addEventListener('click', function(e) {
        if (e.target.closest('.agregar-carrito')) {
            const btn = e.target.closest('.agregar-carrito');
            const cantidadInput = btn.closest('.content').querySelector('.cantidad-input');
            const cantidad = parseInt(cantidadInput.value) || 1;
            
            const producto = {
                id: btn.dataset.id,
                nombre: btn.dataset.nombre,
                precio: parseFloat(btn.dataset.precio),
                imagen: btn.dataset.imagen,
                cantidad: cantidad
            };
            
            carrito.agregarItem(producto);
        }
    });
});
