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
        categoriasContainer.style.display = 'none';
        productosContainer.style.display = 'block';
        btnVolver.style.display = 'block';

        // Mostrar solo los productos de la categoría seleccionada
        const todosLosProductos = document.querySelectorAll('.box');
        todosLosProductos.forEach(producto => {
            if (producto.dataset.categoria === categoria) {
                producto.style.display = 'block';
            } else {
                producto.style.display = 'none';
            }
        });

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
        categoriasContainer.style.display = 'grid';
        productosContainer.style.display = 'none';
        btnVolver.style.display = 'none';
        tituloPrincipal.textContent = 'Explora nuestras categorías';
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
});
