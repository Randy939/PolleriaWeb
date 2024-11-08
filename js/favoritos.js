document.addEventListener('DOMContentLoaded', function() {
    const boxContainer = document.querySelector('.box-container');
    const noFavoritos = document.querySelector('.no-favoritos');
    const API_URL = 'https://randy939-001-site1.qtempurl.com/app/Controllers/productos.php';

    // Obtener favoritos del localStorage
    function obtenerFavoritos() {
        return JSON.parse(localStorage.getItem('favoritos')) || [];
    }

    // Guardar favoritos en localStorage
    function guardarFavoritos(favoritos) {
        localStorage.setItem('favoritos', JSON.stringify(favoritos));
    }

    // Cargar y mostrar productos favoritos
    async function cargarFavoritos() {
        const favoritos = obtenerFavoritos();
        
        if (favoritos.length === 0) {
            boxContainer.style.display = 'none';
            noFavoritos.style.display = 'block';
            return;
        }

        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            
            if (data.status === 'success' && data.productos) {
                const productosFavoritos = data.productos.filter(producto => 
                    favoritos.includes(producto.id.toString())
                );

                if (productosFavoritos.length === 0) {
                    boxContainer.style.display = 'none';
                    noFavoritos.style.display = 'block';
                    return;
                }

                boxContainer.innerHTML = productosFavoritos.map(producto => `
                    <div class="box" data-id="${producto.id}">
                        <div class="image">
                            <img src="${producto.imagen}" alt="${producto.nombre}">
                            <a href="#" class="fas fa-heart active"></a>
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

                boxContainer.style.display = 'grid';
                noFavoritos.style.display = 'none';
                activarControlesCantidad();
            }
        } catch (error) {
            console.error('Error al cargar favoritos:', error);
        }
    }

    // Manejar clicks en los corazones
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('fa-heart')) {
            e.preventDefault();
            const box = e.target.closest('.box');
            const productoId = box.dataset.id;
            const favoritos = obtenerFavoritos();
            
            // Eliminar de favoritos
            const index = favoritos.indexOf(productoId);
            if (index > -1) {
                favoritos.splice(index, 1);
                box.remove();
                
                if (favoritos.length === 0) {
                    boxContainer.style.display = 'none';
                    noFavoritos.style.display = 'block';
                }
            }
            
            guardarFavoritos(favoritos);
        }
    });

    // Activar controles de cantidad
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

    // Cargar favoritos al iniciar
    cargarFavoritos();
});
