document.addEventListener('DOMContentLoaded', function() {
    const categoriasContainer = document.querySelector('.categorias-container');
    const productosContainer = document.querySelector('.productos-container');
    const btnVolver = document.querySelector('.btn-volver');
    const tituloPrincipal = document.querySelector('.titulo-principal');

    // Ocultar el botón volver inicialmente
    btnVolver.style.display = 'none';

    // Manejar clics en las categorías
    categoriasContainer.addEventListener('click', function(e) {
        const categoriaCard = e.target.closest('.categoria-card');
        if (categoriaCard) {
            const categoria = categoriaCard.dataset.categoria;
            mostrarProductos(categoria);
        }
    });

    // Función para mostrar productos
    function mostrarProductos(categoria) {
        const categoriasContainer = document.querySelector('.categorias-container');
        const productosContainer = document.querySelector('.productos-container');
        const btnVolver = document.querySelector('.btn-volver');
        const productos = document.querySelectorAll('.box');
        
        // Mostrar el botón volver cuando se muestran los productos
        btnVolver.style.display = 'block';
        
        // Ocultar categorías y mostrar productos
        categoriasContainer.classList.remove('visible');
        setTimeout(() => {
            categoriasContainer.style.display = 'none';
            productosContainer.style.display = 'block';
        }, 300); // Esperar a que termine la transición de opacidad
        
        // Ocultar todos los productos primero
        productos.forEach(producto => {
            producto.style.display = 'none';
        });
        
        // Mostrar solo los productos de la categoría seleccionada
        const productosCategoria = document.querySelectorAll(`.box[data-categoria="${categoria}"]`);
        
        if (productosCategoria.length === 0) {
            // Si no hay productos en esta categoría, mostrar mensaje
            const mensajeNoProductos = document.createElement('div');
            mensajeNoProductos.className = 'mensaje-no-productos';
            mensajeNoProductos.innerHTML = `
                <h2>No hay productos disponibles en esta categoría</h2>
                <p>Por favor, intenta con otra categoría o vuelve más tarde.</p>
            `;
            productosContainer.appendChild(mensajeNoProductos);
        } else {
            // Si hay productos, mostrarlos
            productosCategoria.forEach(producto => {
                producto.style.display = 'block';
            });
        }

        // Actualizar título según la categoría
        const titulosCategoria = {
            'pollos': 'Pollos a la Brasa',
            'criollos': 'Platos Criollos',
            'bebidas': 'Bebidas',
            'promociones': 'Promociones',
            'menu-dia': 'Menú del Día'
        };
        tituloPrincipal.textContent = titulosCategoria[categoria];
    }

    // Manejar clic en botón volver
    btnVolver.addEventListener('click', function() {
        const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('categoria-card')) {
        window.location.href = '/app/Views/pages/menu.html';
    } else {
        categoriasContainer.style.display = 'grid';
        productosContainer.style.display = 'none';
        btnVolver.style.display = 'none';
        tituloPrincipal.textContent = 'Explora nuestras categorías';
    }
});

    // Manejar cantidad de productos
    const cantidadControles = document.querySelectorAll('.cantidad-control');
    cantidadControles.forEach(control => {
        const input = control.querySelector('.cantidad-input');
        const btnMenos = control.querySelector('.menos');
        const btnMas = control.querySelector('.mas');

        btnMenos.addEventListener('click', () => {
            if (input.value > 1) {
                input.value = parseInt(input.value) - 1;
            }
        });

        btnMas.addEventListener('click', () => {
            if (input.value < 99) {
                input.value = parseInt(input.value) + 1;
            }
        });

        input.addEventListener('change', () => {
            if (input.value < 1) input.value = 1;
            if (input.value > 99) input.value = 99;
        });
    });

    // Obtener la categoría de la URL si existe
    const urlParams = new URLSearchParams(window.location.search);
    const categoriaFromUrl = urlParams.get('categoria-card');

    if (categoriaFromUrl) {
        // Si viene de una URL con categoría, mantener categorías ocultas
        categoriasContainer.style.display = 'none';
        productosContainer.style.display = 'block';
        mostrarProductos(categoriaFromUrl);
    } else {
        // Si no hay categoría en la URL, mostrar las categorías con una transición suave
        categoriasContainer.style.display = 'grid';
        setTimeout(() => {
            categoriasContainer.classList.add('visible');
        }, 50);
        productosContainer.style.display = 'none';
    }

    // Agregar evento al botón volver
    if (btnVolver) {
        btnVolver.addEventListener('click', () => {
            window.location.href = '/app/Views/pages/menu.html';
        });
    }
});
