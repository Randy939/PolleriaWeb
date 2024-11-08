document.addEventListener('DOMContentLoaded', function() {
    let menu = document.querySelector('#menu-bars');
    let navbar = document.querySelector('.navbar');

    // Obtener la ruta actual y la URL completa
    const currentPath = window.location.pathname;
    const currentUrl = window.location.href;

    // Obtener todos los enlaces de navegación
    const navLinks = document.querySelectorAll('.navbar a');

    // Remover clase active de todos los enlaces
    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    // Asignar clase active según la página actual
    navLinks.forEach(link => {
        const href = link.getAttribute('href');

        // Para la página de inicio
        if ((currentPath === '/' || currentPath === '/index.html') && href === '/') {
            link.classList.add('active');
        }
        // Para la página de menú con promociones
        else if (currentPath.includes('menu.html') && currentUrl.includes('promociones') && href.includes('promociones')) {
            link.classList.add('active');
        }
        // Para la página de menú general
        else if (currentPath.includes('menu.html') && !currentUrl.includes('promociones') && href === '/app/Views/pages/menu.html') {
            link.classList.add('active');
        }
        // Para la página de reserva
        else if (currentPath.includes('reserva.html') && href.includes('reserva.html')) {
            link.classList.add('active');
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