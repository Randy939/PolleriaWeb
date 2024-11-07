document.addEventListener('DOMContentLoaded', function() {
    const categoriasContainer = document.querySelector('.categorias-container');
    const productosContainer = document.querySelector('.productos-container');
    const btnVolver = document.querySelector('.btn-volver');
    const mensajeNoProductos = document.querySelector('.mensaje-no-productos');
    const tituloPrincipal = document.querySelector('.titulo-principal');
    const API_URL = 'https://randy939-001-site1.qtempurl.com/app/Controllers/productos.php';

    // Mapeo de data-categoria a IDs y nombres de la base de datos
    const categoriaMapping = {
        'pollos': {
            id: 1,
            nombre: 'Pollos a la Brasa'
        },
        'criollos': {
            id: 2,
            nombre: 'Platos Criollos'
        },
        'bebidas': {
            id: 3,
            nombre: 'Bebidas'
        },
        'promociones': {
            id: 4,
            nombre: 'Promociones'
        },
        'menu-dia': {
            id: 5,
            nombre: 'Menú del Día'
        }
    };

    // Función para cargar productos por categoría
    async function cargarProductos(categoriaSlug) {
        try {
            const categoriaId = categoriaMapping[categoriaSlug].id;
            const response = await fetch(`${API_URL}?categoria_id=${categoriaId}`);
            const data = await response.json();

            // Actualizar el título con el nombre de la categoría
            tituloPrincipal.textContent = categoriaMapping[categoriaSlug].nombre;

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
                                    <button class="cantidad-btne menos">-</button>
                                    <input type="number" class="cantidad-input" value="1" min="1" max="99" readonly>
                                    <button class="cantidad-btne mas">+</button>
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

                activarControlesCantidad();
            }
        } catch (error) {
            console.error('Error al cargar productos:', error);
        }
    }

    // Función para mostrar productos de una categoría
    function mostrarProductos(categoriaSlug) {
        categoriasContainer.style.display = 'none';
        productosContainer.style.display = 'block';
        btnVolver.style.display = 'flex';
        cargarProductos(categoriaSlug);
    }

    // Función para volver a la vista de categorías
    function volverACategorias() {
        categoriasContainer.style.display = 'grid';
        productosContainer.style.display = 'none';
        btnVolver.style.display = 'none';
        mensajeNoProductos.style.display = 'none';
        // Restaurar el título original
        tituloPrincipal.textContent = 'Explora nuestras categorías';
    }

    // Función para activar controles de cantidad
    function activarControlesCantidad() {
        const cantidadBtns = document.querySelectorAll('.cantidad-btne');
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
    // Activar event listeners para las categorías
    const categoriaCards = document.querySelectorAll('.categoria-card');
    categoriaCards.forEach(card => {
        card.addEventListener('click', () => {
            const categoriaSlug = card.dataset.categoria;
            mostrarProductos(categoriaSlug);
        });
    });

    // Evento para el botón de volver
    btnVolver.addEventListener('click', volverACategorias);

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
