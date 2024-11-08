document.addEventListener('DOMContentLoaded', async function() {
    // Esperar a que el header esté cargado
    await new Promise(resolve => {
        const checkHeader = setInterval(() => {
            if (document.querySelector('.navbar')) {
                clearInterval(checkHeader);
                resolve();
            }
        }, 100);
    });

    let menu = document.querySelector('#menu-bars');
    let navbar = document.querySelector('.navbar');

    // Obtener la ruta actual y la URL completa
    const currentPath = window.location.pathname;
    const currentUrl = window.location.href;

    // Obtener todos los enlaces de navegación
    const navLinks = document.querySelectorAll('.navbar a');

    // Función para obtener la ruta limpia
    const cleanPath = (path) => path.replace(/^\/+|\/+$/g, '');

    // Remover clase active de todos los enlaces
    navLinks.forEach(link => link.classList.remove('active'));

    // Asignar clase active según la página actual
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        const cleanCurrentPath = cleanPath(currentPath);
        const cleanHref = cleanPath(href);

        // Para la página de inicio
        if (cleanCurrentPath === '' || cleanCurrentPath === 'index.html') {
            if (cleanHref === '') {
                link.classList.add('active');
            }
        }
        // Para la página de promociones
        else if (cleanCurrentPath === 'app/Views/pages/menu.html' && currentUrl.includes('categoria-card=promociones')) {
            if (href.includes('promociones')) {
                link.classList.add('active');
            }
        }
        // Para la página de menú general
        else if (cleanCurrentPath === 'app/Views/pages/menu.html' && !currentUrl.includes('categoria-card=promociones')) {
            if (cleanHref === 'app/Views/pages/menu.html' && !href.includes('promociones')) {
                link.classList.add('active');
            }
        }
        // Para la página de reserva
        else if (cleanCurrentPath === 'app/Views/pages/reserva.html') {
            if (href.includes('reserva.html')) {
                link.classList.add('active');
            }
        }
    });

    // Funcionalidad del menú móvil
    if (menu) {
        menu.onclick = () => {
            menu.classList.toggle('fa-times');
            navbar.classList.toggle('active');
        }
    }
}); 