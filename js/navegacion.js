document.addEventListener('DOMContentLoaded', async function() {
    // Esperar a que el header esté cargado completamente
    await new Promise(resolve => {
        const checkHeader = setInterval(() => {
            const navbar = document.querySelector('.navbar');
            if (navbar && navbar.children.length > 0) {
                clearInterval(checkHeader);
                resolve();
            }
        }, 100);
    });

    // Obtener elementos necesarios
    const navbar = document.querySelector('.navbar');
    const menuBars = document.querySelector('#menu-bars');

    // Función para limpiar la URL
    const cleanPath = (path) => {
        return path.replace(/^\/+|\/+$/g, '').toLowerCase();
    };

    // Obtener la ruta actual
    const currentPath = cleanPath(window.location.pathname);
    const currentUrl = window.location.href.toLowerCase();

    // Función para actualizar el enlace activo
    function actualizarEnlaceActivo() {
        if (!navbar) return;

        const links = navbar.querySelectorAll('a');
        links.forEach(link => {
            link.classList.remove('active');
            const href = cleanPath(link.getAttribute('href'));

            // Página de inicio
            if (currentPath === '' || currentPath === 'index.html') {
                if (href === '') {
                    link.classList.add('active');
                }
            }
            // Página de promociones
            else if (currentPath.includes('menu.html') && currentUrl.includes('promociones')) {
                if (href.includes('promociones')) {
                    link.classList.add('active');
                }
            }
            // Página de menú general
            else if (currentPath.includes('menu.html') && !currentUrl.includes('promociones')) {
                if (href.includes('menu.html') && !href.includes('promociones')) {
                    link.classList.add('active');
                }
            }
            // Página de reserva
            else if (currentPath.includes('reserva.html')) {
                if (href.includes('reserva.html')) {
                    link.classList.add('active');
                }
            }
        });
    }

    // Inicializar la navegación activa
    actualizarEnlaceActivo();

    // Manejar el menú móvil
    if (menuBars && navbar) {
        menuBars.addEventListener('click', () => {
            menuBars.classList.toggle('fa-times');
            navbar.classList.toggle('active');
        });
    }

    // Cerrar menú móvil al hacer clic en un enlace
    navbar.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menuBars.classList.remove('fa-times');
            navbar.classList.remove('active');
        });
    });
}); 