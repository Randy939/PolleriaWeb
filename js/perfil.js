const API_BASE_URL = 'https://randy939-001-site1.qtempurl.com';

document.addEventListener('DOMContentLoaded', async function() {
    const usuarioStr = localStorage.getItem('usuario');
    
    if (!usuarioStr) {
        window.location.href = '/app/Views/auth/login.html';
        return;
    }

    try {
        const usuario = JSON.parse(usuarioStr);
        
        if (!usuario || !usuario.id) {
            localStorage.removeItem('usuario');
            window.location.href = '/app/Views/auth/login.html';
            return;
        }

        console.log('Usuario cargado:', usuario);
        
        // Cargar datos del usuario primero
        await cargarDatosUsuario(usuario);
        
        // Luego cargar direcciones
        await cargarDirecciones();
        
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
                    
                    // Restaurar valor original
                    const usuario = JSON.parse(localStorage.getItem('usuario'));
                    const fieldName = input.id;
                    input.value = usuario[fieldName] || '';
                    
                    // Verificar si hay algún campo en modo edición
                    const camposEditables = Array.from(document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]'))
                        .some(input => !input.readOnly);
                    
                    // Ocultar botón guardar si no hay campos en edición
                    if (!camposEditables) {
                        btnGuardar.style.display = 'none';
                    }
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

        // Agregar manejador para el botón de nueva dirección
        document.querySelector('.btn-agregar').addEventListener('click', () => {
            mostrarFormularioDireccion();
        });
    } catch (error) {
        console.error('Error al cargar el perfil:', error);
    }
});

async function cargarDatosUsuario(usuario) {
    try {
        const response = await fetch(`${API_BASE_URL}/app/Controllers/obtener_usuario.php?id=${usuario.id}`);
        const data = await response.json();
        
        if (data.status === 'success') {
            const campos = {
                nombre: document.getElementById('nombre'),
                apellido: document.getElementById('apellido'),
                email: document.getElementById('email'),
                telefono: document.getElementById('telefono')
            };

            // Establecer valores y bloquear campos
            Object.entries(campos).forEach(([key, input]) => {
                if (input) {
                    input.value = data.usuario[key] || '';
                    input.readOnly = true; // Bloquear campos por defecto
                }
            });

            // Actualizar información en el sidebar
            const nombreUsuarioElement = document.getElementById('nombre-usuario');
            const emailUsuarioElement = document.getElementById('email-usuario');
            
            if (nombreUsuarioElement) {
                nombreUsuarioElement.textContent = `${data.usuario.nombre} ${data.usuario.apellido}`;
            }
            if (emailUsuarioElement) {
                emailUsuarioElement.textContent = data.usuario.email;
            }

            // Ocultar botón guardar inicialmente
            const btnGuardar = document.querySelector('.btn-guardar');
            if (btnGuardar) {
                btnGuardar.style.display = 'none';
            }
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('Error al cargar los datos del usuario', 'error');
    }
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
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        if (!usuario || !usuario.id) {
            throw new Error('No se encontró información del usuario');
        }

        // Obtener todos los campos del formulario
        const campos = {
            nombre: document.getElementById('nombre'),
            apellido: document.getElementById('apellido'),
            email: document.getElementById('email'),
            telefono: document.getElementById('telefono')
        };

        // Verificar que todos los campos existan
        const camposFaltantes = Object.entries(campos)
            .filter(([nombre, elemento]) => !elemento)
            .map(([nombre]) => nombre);

        if (camposFaltantes.length > 0) {
            throw new Error(`Campos faltantes en el formulario: ${camposFaltantes.join(', ')}`);
        }

        // Crear objeto con los datos del formulario
        const formData = {
            id: usuario.id,
            nombre: campos.nombre.value.trim(),
            apellido: campos.apellido.value.trim(),
            email: campos.email.value.trim(),
            telefono: campos.telefono.value.trim()
        };

        const response = await fetch(`${API_BASE_URL}/app/Controllers/actualizar_usuario.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.status === 'success') {
            mostrarMensaje('Datos actualizados correctamente', 'success');
            
            // Actualizar datos en localStorage
            const usuarioActualizado = {
                ...usuario,
                ...formData
            };
            localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
            
            // Actualizar nombre y email en el sidebar
            const nombreUsuarioElement = document.getElementById('nombre-usuario');
            const emailUsuarioElement = document.getElementById('email-usuario');
            
            if (nombreUsuarioElement) {
                nombreUsuarioElement.textContent = `${formData.nombre} ${formData.apellido}`;
            }
            if (emailUsuarioElement) {
                emailUsuarioElement.textContent = formData.email;
            }

            // Bloquear todos los campos y restaurar botones
            Object.values(campos).forEach(campo => {
                if (campo) {
                    campo.readOnly = true;
                }
            });

            // Restaurar botones de edición
            document.querySelectorAll('.btn-editar').forEach(btn => {
                btn.innerHTML = '<i class="fas fa-edit"></i>';
            });

            // Ocultar botón guardar
            document.querySelector('.btn-guardar').style.display = 'none';
        } else {
            throw new Error(data.message || 'Error al actualizar los datos');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje(error.message || 'Error al actualizar los datos', 'error');
    }
}

async function cambiarPassword() {
    try {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        const passwordActual = document.querySelector('[name="password_actual"]').value;
        const passwordNueva = document.querySelector('[name="password_nueva"]').value;
        const passwordConfirmar = document.querySelector('[name="password_confirmar"]').value;

        // Validaciones
        if (!passwordActual || !passwordNueva || !passwordConfirmar) {
            throw new Error('Todos los campos son obligatorios');
        }

        if (passwordNueva !== passwordConfirmar) {
            throw new Error('Las contraseñas nuevas no coinciden');
        }

        if (passwordNueva.length < 6) {
            throw new Error('La contraseña debe tener al menos 6 caracteres');
        }

        const formData = {
            id: usuario.id,
            password_actual: passwordActual,
            password_nueva: passwordNueva
        };

        const response = await fetch(`${API_BASE_URL}/app/Controllers/cambiar_password.php`, {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.status === 'success') {
            mostrarMensaje('Contraseña actualizada correctamente', 'success');
            document.getElementById('form-cambiar-password').reset();
        } else {
            throw new Error(data.message || 'Error al cambiar la contraseña');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje(error.message || 'Error al cambiar la contraseña', 'error');
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

console.log('Direcciones agregadas al DOM');
  