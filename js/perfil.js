document.addEventListener('DOMContentLoaded', function() {
    // Verificar si el usuario está logueado
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario) {
        window.location.href = '/app/Views/auth/login.html';
        return;
    }

    // Cargar datos del usuario
    cargarDatosUsuario(usuario);

    // Manejar navegación del menú
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function(e) {
            if (this.id === 'btn-cerrar-sesion') {
                cerrarSesion();
                return;
            }

            e.preventDefault();
            const seccion = this.dataset.section;
            cambiarSeccion(seccion);
        });
    });

    // Manejar edición de campos
    document.querySelectorAll('.btn-editar').forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const btnGuardar = document.querySelector('.btn-guardar');
            
            if (input.readOnly) {
                input.readOnly = false;
                input.focus();
                btnGuardar.style.display = 'block';
                this.innerHTML = '<i class="fas fa-times"></i>';
            } else {
                input.readOnly = true;
                this.innerHTML = '<i class="fas fa-edit"></i>';
            }
        });
    });

    // Manejar formulario de datos personales
    document.getElementById('form-datos-personales').addEventListener('submit', async function(e) {
        e.preventDefault();
        await actualizarDatosPersonales();
    });

    // Manejar formulario de cambio de contraseña
    document.getElementById('form-cambiar-password').addEventListener('submit', async function(e) {
        e.preventDefault();
        await cambiarPassword();
    });
});

function cargarDatosUsuario(usuario) {
    document.getElementById('nombre-usuario').textContent = `${usuario.nombre}`;
    document.getElementById('email-usuario').textContent = usuario.email;
    
    // Cargar datos en el formulario
    document.getElementById('nombre').value = usuario.nombre;
    document.getElementById('email').value = usuario.email;
    // ... cargar otros campos
}

function cambiarSeccion(seccion) {
    // Actualizar menú activo
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`.menu-item[data-section="${seccion}"]`).classList.add('active');

    // Mostrar sección correspondiente
    document.querySelectorAll('.perfil-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(seccion).classList.add('active');
}

async function actualizarDatosPersonales() {
    try {
        // Implementar lógica para actualizar datos
        const formData = {
            nombre: document.getElementById('nombre').value,
            apellido: document.getElementById('apellido').value,
            telefono: document.getElementById('telefono').value
        };

        // Hacer la petición al servidor
        // ... código para actualizar datos

        mostrarMensaje('Datos actualizados correctamente', 'success');
    } catch (error) {
        mostrarMensaje('Error al actualizar los datos', 'error');
    }
}

async function cambiarPassword() {
    try {
        const formData = {
            password_actual: document.querySelector('[name="password_actual"]').value,
            password_nueva: document.querySelector('[name="password_nueva"]').value,
            password_confirmar: document.querySelector('[name="password_confirmar"]').value
        };

        if (formData.password_nueva !== formData.password_confirmar) {
            throw new Error('Las contraseñas no coinciden');
        }

        // Hacer la petición al servidor
        // ... código para cambiar contraseña

        mostrarMensaje('Contraseña actualizada correctamente', 'success');
    } catch (error) {
        mostrarMensaje(error.message, 'error');
    }
}

function cerrarSesion() {
    localStorage.removeItem('usuario');
    window.location.href = '/app/Views/pages/index.html';
}

function mostrarMensaje(mensaje, tipo) {
    const div = document.createElement('div');
    div.className = `mensaje mensaje-${tipo}`;
    div.textContent = mensaje;
    document.body.appendChild(div);

    setTimeout(() => {
        div.remove();
    }, 3000);
} 