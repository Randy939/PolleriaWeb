document.addEventListener('DOMContentLoaded', function() {
    const searchIcon = document.querySelector('#search-icon');
    const searchForm = document.querySelector('#search-form');
    const closeBtn = document.querySelector('#close');
    const searchBox = document.querySelector('#search-box');
    const API_URL = 'https://randy939-001-site1.qtempurl.com/app/Controllers/productos.php';

    // Prevenir el comportamiento por defecto del formulario
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
    });

    if (searchIcon && searchForm) {
        searchIcon.onclick = (e) => {
            e.preventDefault();
            searchForm.classList.toggle('active');
            searchBox.focus();
        }
    }

    if (closeBtn && searchForm) {
        closeBtn.onclick = (e) => {
            e.preventDefault();
            searchForm.classList.remove('active');
            searchBox.value = '';
            ocultarResultados();
        }
    }

    let timeoutId;
    if (searchBox) {
        searchBox.addEventListener('input', function() {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(async () => {
                const searchTerm = this.value.trim();
                if (searchTerm.length >= 2) {
                    try {
                        const response = await fetch(`${API_URL}`);
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
                } else {
                    ocultarResultados();
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
        } else {
            resultadosContainer.innerHTML = `
                <div class="results-list">
                    ${resultados.map(producto => `
                        <a href="/app/Views/pages/menu.html?categoria-card=${obtenerSlugCategoria(producto.categoria_id)}&producto=${producto.id}" 
                           class="result-item"
                           onclick="window.location.href=this.href; return false;">
                            <img src="${producto.imagen}" alt="${producto.nombre}">
                            <div class="result-info">
                                <h4>${producto.nombre}</h4>
                                <p>S/. ${producto.precio}</p>
                            </div>
                        </a>
                    `).join('')}
                </div>
            `;

            // Agregar event listeners a los resultados
            document.querySelectorAll('.result-item').forEach(item => {
                item.addEventListener('click', function(e) {
                    e.preventDefault();
                    window.location.href = this.getAttribute('href');
                    searchForm.classList.remove('active');
                    ocultarResultados();
                });
            });
        }
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

    // Cerrar resultados al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (!searchForm.contains(e.target) && !searchIcon.contains(e.target)) {
            searchForm.classList.remove('active');
            ocultarResultados();
        }
    });
}); 