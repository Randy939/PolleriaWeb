document.addEventListener('DOMContentLoaded', async function() {
    const loader = document.querySelector('.loader-container');
    const MINIMUM_LOADING_TIME = 2000; // 2 segundos de carga mínima

    try {
        // Registrar el tiempo de inicio
        const startTime = Date.now();

        // Cargar header
        const headerResponse = await fetch('/app/Views/layouts/header.html');
        const headerData = await headerResponse.text();
        document.getElementById('header-placeholder').innerHTML = headerData;

        // Cargar footer
        const footerResponse = await fetch('/app/Views/layouts/footer.html');
        const footerData = await footerResponse.text();
        document.getElementById('footer-placeholder').innerHTML = footerData;

        // Inicializar eventos del header
        initializeHeaderEvents();

        // Calcular tiempo transcurrido
        const elapsedTime = Date.now() - startTime;
        
        // Si el tiempo transcurrido es menor que el mínimo, esperar la diferencia
        if (elapsedTime < MINIMUM_LOADING_TIME) {
            await new Promise(resolve => 
                setTimeout(resolve, MINIMUM_LOADING_TIME - elapsedTime)
            );
        }

        // Ocultar el loader con una transición suave
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500); // Esperar 500ms para que termine la transición

    } catch (error) {
        console.error('Error cargando los componentes:', error);
        loader.style.display = 'none';
    }
});

function initializeHeaderEvents() {
    const menuBars = document.getElementById('menu-bars');
    const searchIcon = document.getElementById('search-icon');
    const searchForm = document.getElementById('search-form');
    const closeSearch = document.getElementById('close');

    if (menuBars) {
        menuBars.onclick = () => {
            menuBars.classList.toggle('fa-times');
            navbar.classList.toggle('active');
        }
    }

    if (searchIcon) {
        searchIcon.onclick = () => {
            searchForm.classList.toggle('active');
        }
    }

    if (closeSearch) {
        closeSearch.onclick = () => {
            searchForm.classList.remove('active');
        }
    }

    // Manejar clic en icono de usuario
    const userIcon = document.getElementById('user-icon');
    if (userIcon) {
        userIcon.onclick = (e) => {
            e.preventDefault();
            const usuario = localStorage.getItem('usuario');
            if (usuario) {
                window.location.href = '/app/Views/pages/perfil.html';
            } else {
                window.location.href = '/app/Views/auth/login.html';
            }
        }
    }
}

function actualizarHeader() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const favoritosLink = document.querySelector('a[href="favoritos.html"]');
    
    if (favoritosLink) {
        if (!usuario) {
            // Si no hay usuario logueado, el enlace de favoritos redirige al login
            favoritosLink.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.href = '/app/Views/auth/login.html';
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    actualizarHeader();
}); 