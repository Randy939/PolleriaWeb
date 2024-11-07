document.addEventListener('DOMContentLoaded', function() {
    const categoriasContainer = document.querySelector('.categorias-container');
    const productosContainer = document.querySelector('.productos-container');
    const btnVolver = document.querySelector('.btn-volver');
    const categoriaCards = document.querySelectorAll('.categoria-card');
    const cantidadBtns = document.querySelectorAll('.cantidad-btn');
    const mensajeNoProductos = document.querySelector('.mensaje-no-productos');

    // Función para mostrar productos de una categoría
    function mostrarProductos(categoria) {
        categoriasContainer.style.display = 'none';
        productosContainer.style.display = 'block';
        btnVolver.style.display = 'flex';

        const productos = productosContainer.querySelectorAll('.box');
        let hayProductos = false;

        productos.forEach(producto => {
            if (producto.dataset.categoria === categoria) {
                producto.style.display = 'block';
                hayProductos = true;
            } else {
                producto.style.display = 'none';
            }
        });

        // Mostrar mensaje si no hay productos
        if (!hayProductos) {
            mensajeNoProductos.style.display = 'block';
        } else {
            mensajeNoProductos.style.display = 'none';
        }
    }

    // Función para volver a la vista de categorías
    function volverACategorias() {
        categoriasContainer.style.display = 'grid';
        productosContainer.style.display = 'none';
        btnVolver.style.display = 'none';
        mensajeNoProductos.style.display = 'none';
    }

    // Evento para cada tarjeta de categoría
    categoriaCards.forEach(card => {
        card.addEventListener('click', () => {
            const categoria = card.dataset.categoria;
            mostrarProductos(categoria);
        });
    });

    // Evento para el botón de volver
    btnVolver.addEventListener('click', volverACategorias);

    // Control de cantidad
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

    // Función para manejar categoría desde URL
    const urlParams = new URLSearchParams(window.location.search);
    const categoriaFromUrl = urlParams.get('categoria-card');

        if (categoriaFromUrl) {
            categoriasContainer.style.display = 'none';
            productosContainer.style.display = 'block';
            mostrarProductos(categoriaFromUrl);
        } else {
            categoriasContainer.style.display = 'grid';
            productosContainer.style.display = 'none';
        }
});
