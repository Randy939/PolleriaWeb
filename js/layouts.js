async function inicializarAplicacion() {
    const loader = document.querySelector('.loader-container');
    const MINIMUM_LOADING_TIME = 1000;

    try {
        const startTime = Date.now();
        
        // Cargar datos del usuario
        usuario = JSON.parse(localStorage.getItem('usuario'));
        console.log('Usuario cargado:', usuario);

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
        const headerPlaceholder = document.getElementById('header-placeholder');
        const footerPlaceholder = document.getElementById('footer-placeholder');
        
        if (headerPlaceholder) headerPlaceholder.innerHTML = headerData;
        if (footerPlaceholder) footerPlaceholder.innerHTML = footerData;

        // Esperar a que el DOM se actualice
        await new Promise(resolve => setTimeout(resolve, 100));

        // Inicializamos componentes
        initializeHeaderEvents();
        actualizarIconosDashboard();
        actualizarIconosUsuario();

        // Inicializar carrito si existe
        if (window.carrito) {
            carrito.init();
        }

        // Cargar carrito si existe el placeholder
        const carritoPlaceholder = document.getElementById('carrito-placeholder');
        if (carritoPlaceholder) {
            const carritoResponse = await fetch('/app/Views/layouts/carrito.html');
            carritoPlaceholder.innerHTML = await carritoResponse.text();
        }

        // Gestionar tiempo de carga mínimo
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime < MINIMUM_LOADING_TIME) {
            await new Promise(resolve => setTimeout(resolve, MINIMUM_LOADING_TIME - elapsedTime));
        }

    } catch (error) {
        console.error('Error inicializando la aplicación:', error);
    } finally {
        if (loader) {
            loader.classList.add('fade-out');
            setTimeout(() => loader.style.display = 'none', 500);
        }
    }
}

function initializeHeaderEvents() {
    const menuBars = document.getElementById('menu-bars');
    const navbar = document.querySelector('.navbar');
    const closeSearch = document.getElementById('close');

    if (menuBars && navbar) {
        menuBars.addEventListener('click', () => {
            menuBars.classList.toggle('fa-times');
            navbar.classList.toggle('active');
        });
    }
    // Configurar eventos para iconos protegidos
    configurarIconosProtegidos();
}

function actualizarIconosUsuario() {
    if (usuario) {
        const userIcon = document.querySelector('.fa-user');
        if (userIcon) {
            userIcon.classList.remove('fa-user');
            userIcon.classList.add('fa-user-check');
        }
    }
}

function actualizarIconosDashboard() {
    // Esperar a que el elemento exista
    const checkDashboardIcon = setInterval(() => {
        const dashboardIcon = document.getElementById('dashboard-icon');
        if (dashboardIcon) {
            clearInterval(checkDashboardIcon);
            console.log('Usuario completo:', usuario);
            console.log('Estado del rol:', usuario?.rol_id);
            
            if (usuario && usuario.rol_id === '1') { // Nota: comparamos con '1' como string
                dashboardIcon.style.display = 'block';
                dashboardIcon.href = '/app/Views/pages/dashboard.html';
            } else {
                dashboardIcon.style.display = 'none';
            }
        }
    }, 100);

    // Limpiar el intervalo después de 5 segundos por seguridad
    setTimeout(() => clearInterval(checkDashboardIcon), 5000);
}

function configurarIconosProtegidos() {
    const rutasProtegidas = {
        'perfil': '/app/Views/pages/perfil.html',
        'favoritos': '/app/Views/pages/favoritos.html'
    };

    Object.entries(rutasProtegidas).forEach(([nombre, ruta]) => {
        const enlaces = document.querySelectorAll(`a[href*="${ruta}"]`);
        enlaces.forEach(enlace => {
            enlace.addEventListener('click', (e) => {
                e.preventDefault();
                if (usuario) {
                    window.location.href = ruta;
                } else {
                    mostrarMensajeLogin();
                    setTimeout(() => {
                        window.location.href = '/app/Views/auth/login.html';
                    }, 1500);
                }
            });
        });
    });
}

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

// Estilos para animaciones
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
        #menu-bars { display: block !important; }
    }
    @media (min-width: 769px) {
        #menu-bars { display: none !important; }
    }
`;
document.head.appendChild(style);

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', inicializarAplicacion);
