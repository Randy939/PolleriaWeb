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
    const navbar = document.querySelector('.navbar');
    const searchIcon = document.getElementById('search-icon');
    const searchForm = document.getElementById('search-form');
    const closeSearch = document.getElementById('close');

    // Cerrar menú al hacer clic en un enlace
    const navLinks = document.querySelectorAll('.navbar a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuBars?.classList.remove('fa-times');
            navbar?.classList.remove('active');
        });
    });

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

function mostrarMensajeLogin() {
    const mensaje = document.createElement('div');
    mensaje.className = 'mensaje-login';
    mensaje.textContent = 'Por favor, inicia sesión para acceder a esta función';
    mensaje.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff4444;
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        z-index: 1000;
    `;
    document.body.appendChild(mensaje);
    setTimeout(() => mensaje.remove(), 3000);
}

perfilLink.addEventListener('click', function(e) {
    if (!usuario) {
        e.preventDefault();
        mostrarMensajeLogin();
        setTimeout(() => {
            window.location.href = '/app/Views/auth/login.html';
        }, 1500);
    }
});

function cargarHeader() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        fetch('/app/Views/layouts/header.html')
            .then(response => response.text())
            .then(html => {
                headerPlaceholder.innerHTML = html;
                
                // Agregar eventos después de cargar el header
                const usuario = JSON.parse(localStorage.getItem('usuario'));
                const perfilLink = document.querySelector('.header .icons a[href="/app/Views/pages/perfil.html"]');
                const favoritosLink = document.querySelector('.header .icons a[href="/app/Views/pages/favoritos.html"]');
                
                if (perfilLink) {
                    perfilLink.addEventListener('click', function(e) {
                        if (!usuario) {
                            e.preventDefault();
                            window.location.href = '/app/Views/auth/login.html';
                        }
                    });
                }
                
                if (favoritosLink) {
                    favoritosLink.addEventListener('click', function(e) {
                        if (!usuario) {
                            e.preventDefault();
                            window.location.href = '/app/Views/auth/login.html';
                        }
                    });
                }
                
                // Actualizar el ícono de usuario si está logueado
                if (usuario) {
                    const userIcon = perfilLink.querySelector('i');
                    if (userIcon) {
                        userIcon.classList.remove('fa-user');
                        userIcon.classList.add('fa-user-check');
                    }
                }
            });
    }
}