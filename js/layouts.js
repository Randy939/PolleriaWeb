document.addEventListener('DOMContentLoaded', async function() {
    const loader = document.querySelector('.loader-container');
    const MINIMUM_LOADING_TIME = 1000;

    try {
        const startTime = Date.now();

        // Cargar header y footer en paralelo
        const [headerResponse, footerResponse] = await Promise.all([
            fetch('/app/Views/layouts/header.html'),
            fetch('/app/Views/layouts/footer.html')
        ]);

        const [headerData, footerData] = await Promise.all([
            headerResponse.text(),
            footerResponse.text()
        ]);

        // Insertamos el contenido
        document.getElementById('header-placeholder').innerHTML = headerData;
        document.getElementById('header-placeholder').innerHTML = headerData;
        // Inicializamos el carrito después de cargar el header
if (window.carrito) {
    carrito.init();
}
        document.getElementById('footer-placeholder').innerHTML = footerData;

        // Inicializamos eventos
        initializeHeaderEvents();

        // Cargar carrito
        await fetch('/app/Views/layouts/carrito.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('carrito-placeholder').innerHTML = data;
            });

        // Calcular tiempo transcurrido
        const elapsedTime = Date.now() - startTime;
        
        // Si el tiempo transcurrido es menor que el mínimo, esperar la diferencia
        if (elapsedTime < MINIMUM_LOADING_TIME) {
            await new Promise(resolve => 
                setTimeout(resolve, MINIMUM_LOADING_TIME - elapsedTime)
            );
        }

        // Ocultar loader después de cargar todo
        if (loader) {
            loader.classList.add('fade-out');
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }

    } catch (error) {
        console.error('Error cargando los componentes:', error);
        // Ocultar loader incluso si hay error
        if (loader) {
            loader.classList.add('fade-out');
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }
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
            menuBars.classList.remove('fa-times');
            navbar.classList.remove('active');
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

    // Manejar clic en iconos protegidos
    const iconosProtegidos = {
        'user-icon': '/app/Views/pages/perfil.html',
        'favorites-icon': '/app/Views/pages/favoritos.html'
    };

    Object.entries(iconosProtegidos).forEach(([iconId, ruta]) => {
        const icono = document.querySelector(`#${iconId}, a[href*="${ruta}"]`);
        if (icono) {
            icono.addEventListener('click', (e) => {
                e.preventDefault();
                const usuario = JSON.parse(localStorage.getItem('usuario'));
                
                if (usuario) {
                    window.location.href = ruta;
                } else {
                    mostrarMensajeLogin();
                    setTimeout(() => {
                        window.location.href = '/app/Views/auth/login.html';
                    }, 1500);
                }
            });
        }
    });

    // Obtener usuario una sola vez
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    // Actualizar ícono si el usuario está logueado
    if (usuario) {
        const userIcon = document.querySelector('.fa-user');
        if (userIcon) {
            userIcon.classList.remove('fa-user');
            userIcon.classList.add('fa-user-check');
        }
    }

    // Ocultar menu-bars en desktop
    if (menuBars) {
        menuBars.style.display = window.innerWidth <= 768 ? 'block' : 'none';
        
        window.addEventListener('resize', () => {
            menuBars.style.display = window.innerWidth <= 768 ? 'block' : 'none';
        });
    }

    // Manejar autenticación para favoritos y perfil
    const favoritesBtn = document.getElementById('favorites-btn');
    const profileBtn = document.getElementById('profile-btn');

    if (favoritesBtn) {
        favoritesBtn.addEventListener('click', (e) => {
            if (!usuario) {
                e.preventDefault();
                mostrarMensajeLogin();
                setTimeout(() => {
                    window.location.href = '/app/Views/auth/login.html';
                }, 1500);
            }
        });
    }

    if (profileBtn) {
        profileBtn.addEventListener('click', (e) => {
            if (!usuario) {
                e.preventDefault();
                mostrarMensajeLogin();
                setTimeout(() => {
                    window.location.href = '/app/Views/auth/login.html';
                }, 1500);
            }
        });

        // Actualizar ícono si está logueado
        if (usuario) {
            const userIcon = profileBtn.querySelector('i');
            if (userIcon) {
                userIcon.classList.remove('fa-user');
                userIcon.classList.add('fa-user-check');
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
        animation: fadeIn 0.3s ease;
    `;
    document.body.appendChild(mensaje);
    setTimeout(() => {
        mensaje.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => mensaje.remove(), 300);
    }, 2000);
}

// Agregar estilos para las animaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-20px); }
    }
    @media (max-width: 768px) {
        #menu-bars {
            display: block !important;
        }
    }
    @media (min-width: 769px) {
        #menu-bars {
            display: none !important;
        }
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', async function() {
    // ... código existente ...
    
    // Agregar verificación de autenticación para links protegidos
    const favoritosBtn = document.querySelector('a[href*="favoritos.html"]');
    const perfilBtn = document.querySelector('a[href*="perfil.html"]');
    
    if (favoritosBtn) {
        favoritosBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const usuario = JSON.parse(localStorage.getItem('usuario'));
            if (usuario) {
                window.location.href = this.href;
            } else {
                window.location.href = '/app/Views/auth/login.html';
            }
        });
    }
    
    if (perfilBtn) {
        perfilBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const usuario = JSON.parse(localStorage.getItem('usuario'));
            if (usuario) {
                window.location.href = this.href;
            } else {
                window.location.href = '/app/Views/auth/login.html';
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    // Verificar si el usuario está logueado y es administrador
    if (usuario && usuario.rol === 'administrador') {
        const dashboardIcon = document.getElementById('dashboard-icon');
        if (dashboardIcon) {
            dashboardIcon.style.display = 'block'; // Mostrar el icono del dashboard
            dashboardIcon.addEventListener('click', function() {
                window.location.href = '/ruta/al/dashboard'; // Cambia esto a la ruta real del dashboard
            });
        }
    }
});