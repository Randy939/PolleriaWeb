document.addEventListener('DOMContentLoaded', function() {
    let menu = document.querySelector('#menu-bars');
    let navbar = document.querySelector('.navbar');

    // Obtener la ruta actual
    const currentPath = window.location.pathname;

    // Obtener todos los enlaces de navegación
    const navLinks = document.querySelectorAll('.navbar a');

    // Remover clase active de todos los enlaces
    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    // Asignar clase active según la página actual
    navLinks.forEach(link => {
        const href = link.getAttribute('href');

        if (currentPath === '/' && href === '/') {
            link.classList.add('active');
        } else if (currentPath.includes('menu.html')) {
            if (currentPath.includes('promociones') && href.includes('promociones')) {
                link.classList.add('active');
            } else if (!currentPath.includes('promociones') && href === '/app/Views/pages/menu.html') {
                link.classList.add('active');
            }
        } else if (currentPath.includes('reserva.html') && href.includes('reserva.html')) {
            link.classList.add('active');
        }
    });

    if (menu) {
        menu.onclick = () => {
            menu.classList.toggle('fa-times');
            navbar.classList.toggle('active');
        }
    }
}); 