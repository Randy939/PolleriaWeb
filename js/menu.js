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

    // Agregar después de la línea 31
function cargarProductos(categoriaId) {
    fetch(`${API_URL}?categoria_id=${categoriaId}`)
        .then(response => response.json())
        .then(productos => {
            const cajaContenedora = document.querySelector('.caja-contenedora');
            cajaContenedora.innerHTML = '';

            productos.forEach(producto => {
                const productoHTML = `
                    <div class="box">
                        <div class="image">
                            <img src="${producto.imagen}" alt="${producto.nombre}">
                            <a href="/app/Views/pages/comentario.html?id=${producto.id}" class="fa-comment">
                                <i class="fas fa-comment"></i>
                            </a>
                            <a class="fa-heart" data-id="${producto.id}">
                                <i class="fas fa-heart"></i>
                            </a>
                        </div>
                        <div class="content">
                            <div class="stars">
                                ${generarEstrellas(producto.calificacion_promedio || 0)}
                            </div>
                            <h3>${producto.nombre}</h3>
                            <p>${producto.descripcion}</p>
                            <div class="precio-cantidad">
                                <span class="precio">S/. ${producto.precio}</span>
                                <div class="controles">
                                    <button class="btn-cantidad" data-accion="restar">-</button>
                                    <span class="cantidad">1</span>
                                    <button class="btn-cantidad" data-accion="sumar">+</button>
                                </div>
                            </div>
                            <button class="btn-agregar" data-id="${producto.id}">
                                <i class="fas fa-shopping-cart"></i>
                                <span>Agregar al Carrito</span>
                            </button>
                        </div>
                    </div>
                `;
                cajaContenedora.innerHTML += productoHTML;
            });
        })
        .catch(error => {
            console.error('Error:', error);
            mensajeNoProductos.style.display = 'block';
        });
}

function generarEstrellas(calificacion) {
    let estrellas = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= calificacion) {
            estrellas += '<i class="fas fa-star"></i>';
        } else if (i - 0.5 <= calificacion) {
            estrellas += '<i class="fas fa-star-half-alt"></i>';
        } else {
            estrellas += '<i class="far fa-star"></i>';
        }
    }
    return estrellas;
}

    // Función para cargar productos por categoría
    async function cargarProductos(categoriaSlug) {
        try {
            const categoriaId = categoriaMapping[categoriaSlug].id;
            const response = await fetch(`${API_URL}?categoria_id=${categoriaId}`);
            const data = await response.json();
            const favoritos = obtenerFavoritos();

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
                    <div class="box" data-id="${producto.id}" data-categoria="${producto.categoria_id}">
                        <div class="image">
                            <img src="${producto.imagen}" alt="${producto.nombre}">
                            <a href="#" class="fas fa-heart ${favoritos.includes(producto.id.toString()) ? 'active' : ''}"></a>
                            <a href="/app/Views/pages/comentario.html?id=${producto.id}" class="fas fa-comment">
                            </a>
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
                activarControlFavoritos();
            }
        } catch (error) {
            console.error('Error al cargar productos:', error);
        }
    }

    // Función para mostrar productos de una categoría
    function mostrarProductos(categoriaSlug) {
        if (!categoriaMapping[categoriaSlug]) return;
        
        categoriasContainer.style.display = 'none';
        productosContainer.style.display = 'block';
        btnVolver.classList.add('visible');
        cargarProductos(categoriaSlug);
    }

    // Función para volver a la vista de categorías
    function volverACategorias() {
        categoriasContainer.style.display = 'grid';
        productosContainer.style.display = 'none';
        btnVolver.classList.remove('visible');
        mensajeNoProductos.style.display = 'none';
        tituloPrincipal.textContent = 'Explora nuestras categorías';
        
        // Mostrar el botón volver si se accede a una categoría
        if (searchParams.get('categoria-card') || searchParams.has('promociones')) {
            btnVolver.classList.add('visible');
        }
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

    // Funciones para manejar favoritos
    function obtenerFavoritos() {
        return JSON.parse(localStorage.getItem('favoritos')) || [];
    }

    function guardarFavoritos(favoritos) {
        localStorage.setItem('favoritos', JSON.stringify(favoritos));
    }

    function actualizarIconosFavoritos() {
        const favoritos = obtenerFavoritos();
        document.querySelectorAll('.fa-heart').forEach(heart => {
            const productoId = heart.closest('.box').dataset.id;
            if (favoritos.includes(productoId)) {
                heart.classList.add('active');
            } else {
                heart.classList.remove('active');
            }
        });
    }

    // Función para activar el control de favoritos
    function activarControlFavoritos() {
        document.querySelectorAll('.fa-heart').forEach(heart => {
            heart.addEventListener('click', function(e) {
                e.preventDefault();
                const usuario = JSON.parse(localStorage.getItem('usuario'));
                if (!usuario) {
                    window.location.href = '/app/Views/auth/login.html';
                    return;
                }

                const box = this.closest('.box');
                const productoId = box.dataset.id;
                const favoritos = obtenerFavoritos();
                
                if (favoritos.includes(productoId)) {
                    const index = favoritos.indexOf(productoId);
                    favoritos.splice(index, 1);
                    this.classList.remove('active');
                } else {
                    favoritos.push(productoId);
                    this.classList.add('active');
                }
                
                guardarFavoritos(favoritos);
                this.classList.add('heartbeat');
                setTimeout(() => this.classList.remove('heartbeat'), 300);
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
    btnVolver.addEventListener('click', function() {
        volverACategorias();
        btnVolver.classList.remove('visible');
    });

    // Manejar categoría desde URL
    const urlParams = new URLSearchParams(window.location.search);
    const categoriaFromUrl = urlParams.get('categoria-card');
    const comentarioFromUrl = urlParams.get('id'); // Obtener el ID del comentario

    if (categoriaFromUrl) {
        mostrarProductos(categoriaFromUrl);
    } else if (comentarioFromUrl) {
        // Si se accede a la página de comentarios, mostrar el botón volver
        btnVolver.classList.add('visible');
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

    // Verificar si llegamos desde una promoción en el navbar
    const path = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);

    if (path.includes('/menu.html')) {
        btnVolver.classList.remove('visible');
        if (searchParams.get('categoria-card')) {
            mostrarProductos(searchParams.get('categoria-card'));
            btnVolver.classList.add('visible');
        } else if (searchParams.has('promociones')) {
            mostrarProductos('promociones');
            btnVolver.classList.add('visible');
        } else {
            volverACategorias();
        }
    }
});
