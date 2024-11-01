document.addEventListener('DOMContentLoaded', function() {
    const categoriasContainer = document.querySelector('.categorias-container');
    const productosContainer = document.querySelector('.productos-container');
    const btnVolver = document.querySelector('.btn-volver');
    
    // Ocultar ambos contenedores inicialmente
    categoriasContainer.style.display = 'none';
    productosContainer.style.display = 'none';
    
    // Verificar si hay un parámetro de categoría en la URL
    const urlParams = new URLSearchParams(window.location.search);
    const categoriaParam = urlParams.get('categoria');
    
    if (categoriaParam) {
        // Mostrar directamente los productos sin transición inicial
        mostrarProductosDirecto(categoriaParam);
    } else {
        // Mostrar categorías
        categoriasContainer.style.display = 'grid';
        categoriasContainer.style.opacity = '1';
    }

    // Event listeners para las tarjetas de categoría y sus botones
    document.querySelectorAll('.categoria-card, .btn-categoria').forEach(element => {
        element.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const categoriaCard = this.closest('[data-categoria]');
            const categoria = categoriaCard.dataset.categoria;
            
            mostrarProductos(categoria);
        });
    });

    // Event listener para el botón volver
    if (btnVolver) {
        btnVolver.addEventListener('click', volverACategorias);
    }
});

// Nueva función para mostrar productos directamente sin transición inicial
function mostrarProductosDirecto(categoria) {
    const categoriasContainer = document.querySelector('.categorias-container');
    const productosContainer = document.querySelector('.productos-container');
    const btnVolver = document.querySelector('.btn-volver');
    
    // Ocultar todos los productos inmediatamente
    const productos = document.querySelectorAll('.box');
    productos.forEach(producto => {
        producto.style.display = 'none';
    });
    
    categoriasContainer.style.display = 'none';
    productosContainer.style.display = 'block';
    productosContainer.style.opacity = '0';
    btnVolver.style.display = 'inline-block';
    
    // Mostrar solo los productos de la categoría seleccionada
    productos.forEach(producto => {
        if (producto.dataset.categoria === categoria) {
            producto.style.display = 'block';
        }
    });
    
    // Hacer visible el contenedor de productos
    setTimeout(() => {
        productosContainer.style.opacity = '1';
    }, 50);
}

// Función original para transiciones al hacer clic en categorías
function mostrarProductos(categoria) {
    const categoriasContainer = document.querySelector('.categorias-container');
    const productosContainer = document.querySelector('.productos-container');
    const btnVolver = document.querySelector('.btn-volver');
    const footer = document.querySelector('.footer');
    
    // Ocultar todos los productos inmediatamente
    const productos = document.querySelectorAll('.box');
    productos.forEach(producto => {
        producto.style.display = 'none';
    });
    
    categoriasContainer.style.opacity = '0';
    setTimeout(() => {
        categoriasContainer.style.display = 'none';
        productosContainer.style.display = 'block';
        btnVolver.style.display = 'inline-block';
        
        // Mostrar solo los productos de la categoría seleccionada
        productos.forEach(producto => {
            if (producto.dataset.categoria === categoria) {
                producto.style.display = 'block';
            }
        });
        
        setTimeout(() => {
            productosContainer.style.opacity = '1';
            
            if (footer) {
                footer.style.display = 'block';
                footer.querySelector('.box-container').style.display = 'grid';
            }
        }, 50);
    }, 300);
}

function volverACategorias() {
    const categoriasContainer = document.querySelector('.categorias-container');
    const productosContainer = document.querySelector('.productos-container');
    const btnVolver = document.querySelector('.btn-volver');
    const footer = document.querySelector('.footer');
    
    // Asegurar que el footer esté visible antes de la transición
    if (footer) {
        footer.style.display = 'block';
    }
    
    productosContainer.style.opacity = '0';
    setTimeout(() => {
        productosContainer.style.display = 'none';
        btnVolver.style.display = 'none';
        
        categoriasContainer.style.display = 'grid';
        setTimeout(() => {
            categoriasContainer.style.opacity = '1';
            
            // Asegurar que el footer permanezca visible después de la transición
            if (footer) {
                footer.style.display = 'block';
                footer.querySelector('.box-container').style.display = 'grid';
            }
        }, 50);
        
        const url = new URL(window.location.href);
        url.searchParams.delete('categoria');
        window.history.replaceState({}, '', url);
    }, 300);
}

// ... resto del código existente ... 