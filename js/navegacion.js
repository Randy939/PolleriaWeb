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

    const menu = document.querySelector('#menu-bars');
    const navbar = document.querySelector('.navbar');

    // Funcionalidad del menú móvil
    if (menu && navbar) {
        menu.onclick = () => {
            console.log('Menú hamburguesa clicado');
            menu.classList.toggle('fa-times');
            navbar.classList.toggle('active');
        };
    }

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

        // Lógica para asignar la clase active
        if (cleanCurrentPath === '' || cleanCurrentPath === 'index.html') {
            if (cleanHref === '') {
                link.classList.add('active');
            }
        } else if (cleanCurrentPath === 'app/Views/pages/menu.html' && currentUrl.includes('categoria-card=promociones')) {
            if (href.includes('promociones')) {
                link.classList.add('active');
            }
        } else if (cleanCurrentPath === 'app/Views/pages/menu.html' && !currentUrl.includes('categoria-card=promociones')) {
            if (cleanHref === 'app/Views/pages/menu.html' && !href.includes('promociones')) {
                link.classList.add('active');
            }
        } else if (cleanCurrentPath === 'app/Views/pages/reserva.html') {
            if (href.includes('reserva.html')) {
                link.classList.add('active');
            }
        }
    });

    const locationBtn = document.getElementById('location-btn');
    const locationDropdown = document.querySelector('.location-dropdown');

    locationBtn.addEventListener('click', async function() {
        // Alternar la visibilidad del dropdown
        if (locationDropdown.style.display === 'block') {
            locationDropdown.style.display = 'none';
        } else {
            locationDropdown.style.display = 'block';
            // Cargar direcciones si no están ya cargadas
            if (locationDropdown.querySelector('.direcciones-pestaña').children.length === 0) {
                await cargarDirecciones();
            }
        }
    });

    async function cargarDirecciones() {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        if (!usuario || !usuario.id) {
            console.error('No se encontró información del usuario');
            return;
        }

        const response = await fetch(`https://randy939-001-site1.qtempurl.com/app/Controllers/direcciones.php?usuario_id=${usuario.id}`);
        const data = await response.json();

        if (data.status === 'success' && Array.isArray(data.direcciones)) {
            const direccionesLista = locationDropdown.querySelector('.direcciones-pestaña');
            direccionesLista.innerHTML = ''; // Limpiar la lista

            data.direcciones.forEach(direccion => {
                const li = document.createElement('li');
                li.textContent = direccion.direccion; // Ajusta según el campo que quieras mostrar
                li.addEventListener('click', () => {
                    // Manejar la selección de la dirección
                    const selectedItems = direccionesLista.querySelectorAll('li.selected');
                    selectedItems.forEach(item => {
                        item.classList.remove('selected'); // Limpiar selección anterior
                        item.innerHTML = item.innerHTML.replace(' <i class="fas fa-check"></i>', ''); // Remover check
                    });
                    li.classList.add('selected'); // Marcar como seleccionado
                    li.innerHTML += ' <i class="fas fa-check"></i>'; // Agregar check al elemento seleccionado
                    console.log(`Dirección seleccionada: ${direccion.direccion}`);
                    locationDropdown.style.display = 'none'; // Ocultar el dropdown después de seleccionar
                });
                direccionesLista.appendChild(li);
            });
        } else {
            console.error('Error al cargar las direcciones');
        }
    }
});