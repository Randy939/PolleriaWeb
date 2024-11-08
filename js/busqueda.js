document.addEventListener('DOMContentLoaded', function() {
    const searchIcon = document.querySelector('#search-icon');
    const searchForm = document.querySelector('#search-form');
    const closeBtn = document.querySelector('#close');
    const searchBox = document.querySelector('#search-box');
    const API_URL = 'https://randy939-001-site1.qtempurl.com/app/Controllers/productos.php';

    // Prevenir la recarga de página
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
        });
    }

    // Abrir buscador
    if (searchIcon) {
        searchIcon.addEventListener('click', (e) => {
            e.preventDefault();
            searchForm.classList.add('active');
            searchBox.focus();
        });
    }

    // Cerrar buscador
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            searchForm.classList.remove('active');
            searchBox.value = '';
            ocultarResultados();
        });
    }

    // Búsqueda en tiempo real
    let timeoutId;
    if (searchBox) {
        searchBox.addEventListener('input', function() {
            clearTimeout(timeoutId);
            const searchTerm = this.value.trim();
            
            if (searchTerm.length < 2) {
                ocultarResultados();
                return;
            }

            timeoutId = setTimeout(async () => {
                try {
                    const response = await fetch(API_URL);
                    const data = await response.json();
                    
                    if (data.status === 'success' && data.productos) {
                        const resultados = data.productos.filter(producto => 
                            producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
                        );
                        mostrarResultados(resultados);
                    }
                } catch (error) {
                    console.error('Error en la búsqueda:', error);
                }
            }, 300);
        });
    }

    function mostrarResultados(resultados) {
        let resultadosContainer = document.querySelector('.search-results');
        if (!resultadosContainer) {
            resultadosContainer = document.createElement('div');
            resultadosContainer.className = 'search-results';
            searchForm.appendChild(resultadosContainer);
        }

        if (resultados.length === 0) {
            resultadosContainer.innerHTML = `
                <div class="no-results">
                    <p>No se encontraron productos</p>
                </div>
            `;
            return;
        }

        resultadosContainer.innerHTML = `
            <div class="results-list">
                ${resultados.map(producto => `
                    <div class="result-item" data-categoria="${producto.categoria_id}" data-id="${producto.id}">
                        <img src="${producto.imagen}" alt="${producto.nombre}">
                        <div class="result-info">
                            <h4>${producto.nombre}</h4>
                            <p>S/. ${producto.precio}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        // Manejar clics en resultados
        document.querySelectorAll('.result-item').forEach(item => {
            item.addEventListener('click', function() {
                const categoriaId = this.dataset.categoria;
                const productoId = this.dataset.id;
                const categoriaSlug = obtenerSlugCategoria(parseInt(categoriaId));
                
                window.location.href = `/app/Views/pages/menu.html?categoria-card=${categoriaSlug}&producto=${productoId}`;
                searchForm.classList.remove('active');
                ocultarResultados();
            });
        });
    }

    function ocultarResultados() {
        const resultadosContainer = document.querySelector('.search-results');
        if (resultadosContainer) {
            resultadosContainer.remove();
        }
    }

    function obtenerSlugCategoria(categoriaId) {
        const categoriaMapping = {
            1: 'pollos',
            2: 'criollos',
            3: 'bebidas',
            4: 'promociones',
            5: 'menu-dia'
        };
        return categoriaMapping[categoriaId] || '';
    }

    // Cerrar al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (!searchForm.contains(e.target) && !searchIcon.contains(e.target)) {
            searchForm.classList.remove('active');
            ocultarResultados();
        }
    });
}); 