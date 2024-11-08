document.addEventListener('DOMContentLoaded', function() {
    let menu = document.querySelector('#menu-bars');
    let navbar = document.querySelector('.navbar');

    // Obtener la ruta actual
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
        if (currentPath === '/' || currentPath === '/index.html') {
            if (href === '/') {
                link.classList.add('active');
            }
        }
        // Para la página de menú
        else if (currentPath.includes('/app/Views/pages/menu.html')) {
            if (currentUrl.includes('categoria-card=promociones')) {
                if (href.includes('promociones')) {
                    link.classList.add('active');
                }
            } else if (href === '/app/Views/pages/menu.html') {
                link.classList.add('active');
            }
        }
        // Para la página de reserva
        else if (currentPath.includes('/app/Views/pages/reserva.html')) {
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