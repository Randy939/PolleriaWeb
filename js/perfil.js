const API_BASE_URL = 'https://randy939-001-site1.qtempurl.com';

document.addEventListener('DOMContentLoaded', function() {
    const usuarioStr = localStorage.getItem('usuario');
    console.log('Usuario en localStorage:', usuarioStr);
    
    if (!usuarioStr) {
        console.log('No hay usuario en localStorage');
        window.location.href = '/app/Views/auth/login.html';
        return;
    }

    try {
        const usuario = JSON.parse(usuarioStr);
        console.log('Usuario parseado:', usuario);
        
        if (!usuario || !usuario.id) {
            console.log('Usuario inválido o sin ID');
            localStorage.removeItem('usuario');
            window.location.href = '/app/Views/auth/login.html';
            return;
        }

        cargarDatosUsuario(usuario);
        cargarDirecciones();
        
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
        console.error('Error al parsear usuario:', error);
        localStorage.removeItem('usuario');
        window.location.href = '/app/Views/auth/login.html';
    }
});

async function cargarDatosUsuario(usuario) {
    try {
        const response = await fetch(`${API_BASE_URL}/app/Models/obtener_usuario.php?id=${usuario.id}`);
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

        const response = await fetch(`${API_BASE_URL}/app/Models/actualizar_usuario.php`, {
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
        const formData = {
            id: usuario.id,
            password_actual: document.querySelector('[name="password_actual"]').value,
            password_nueva: document.querySelector('[name="password_nueva"]').value,
            password_confirmar: document.querySelector('[name="password_confirmar"]').value
        };

        if (formData.password_nueva !== formData.password_confirmar) {
            throw new Error('Las contraseñas no coinciden');
        }

        const response = await fetch(`${API_BASE_URL}/app/Models/cambiar_password.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        // Agregar diagnóstico
        const responseText = await response.text();
        console.log('Respuesta del servidor:', responseText);

        try {
            const data = JSON.parse(responseText);
            if (data.status === 'success') {
                mostrarMensaje('Contraseña actualizada correctamente', 'success');
                document.getElementById('form-cambiar-password').reset();
            } else {
                throw new Error(data.message);
            }
        } catch (jsonError) {
            console.error('Error al parsear JSON:', jsonError);
            throw new Error('El servidor devolvió una respuesta inválida');
        }
    } catch (error) {
        mostrarMensaje(error.message, 'error');
    }
}

async function cargarDirecciones() {
    try {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        const response = await fetch(`${API_BASE_URL}/app/Models/direcciones.php?usuario_id=${usuario.id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        const direccionesLista = document.querySelector('.direcciones-lista');
        direccionesLista.innerHTML = '';
        
        if (data.direcciones && data.direcciones.length > 0) {
            data.direcciones.forEach(direccion => {
                const direccionElement = document.createElement('div');
                direccionElement.className = 'direccion-item';
                direccionElement.innerHTML = `
                    <div class="direccion-info">
                        <p class="direccion-principal">${direccion.direccion}</p>
                        <p class="direccion-referencia">${direccion.referencia || ''}</p>
                    </div>
                    <div class="direccion-acciones">
                        <button class="btn-editar" onclick="mostrarFormularioDireccion(${JSON.stringify(direccion)})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-eliminar" onclick="eliminarDireccion(${direccion.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                direccionesLista.appendChild(direccionElement);
            });
        } else {
            direccionesLista.innerHTML = '<p class="no-direcciones">No hay direcciones registradas</p>';
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('Error al cargar las direcciones', 'error');
    }
}

// Agregar manejador para el botón de nueva dirección
document.querySelector('.btn-agregar').addEventListener('click', function() {
    mostrarFormularioDireccion();
});

async function guardarDireccion(form, direccionId = null) {
    try {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        if (!usuario || !usuario.id) {
            throw new Error('No se encontró información del usuario');
        }

        const formData = {
            usuario_id: usuario.id,
            direccion: form.querySelector('[name="direccion"]').value,
            referencia: form.querySelector('[name="referencia"]').value || ''
        };

        console.log('Enviando datos:', formData);

        const response = await fetch(`${API_BASE_URL}/app/Models/direcciones.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const responseText = await response.text();
        console.log('Respuesta del servidor:', responseText);

        if (!responseText) {
            throw new Error('El servidor no devolvió ninguna respuesta');
        }

        const data = JSON.parse(responseText);
        if (data.status === 'success') {
            mostrarMensaje('Dirección guardada correctamente', 'success');
            await cargarDirecciones();
        } else {
            throw new Error(data.message || 'Error al guardar la dirección');
        }
    } catch (error) {
        console.error('Error completo:', error);
        mostrarMensaje(error.message, 'error');
    }
}

function mostrarFormularioDireccion(direccion = null) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>${direccion ? 'Editar' : 'Nueva'} Dirección</h3>
            <form id="form-direccion">
                <div class="form-group">
                    <label>Dirección</label>
                    <input type="text" name="direccion" required 
                           value="${direccion ? direccion.direccion : ''}">
                </div>
                <div class="form-group">
                    <label>Referencia</label>
                    <input type="text" name="referencia" 
                           value="${direccion ? direccion.referencia : ''}">
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn-cancelar">Cancelar</button>
                    <button type="submit" class="btn-guardar">Guardar</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);
    
    // Manejadores de eventos para el modal
    modal.querySelector('.btn-cancelar').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.querySelector('#form-direccion').addEventListener('submit', async (e) => {
        e.preventDefault();
        await guardarDireccion(e.target, direccion?.id);
        modal.remove();
    });
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

// Función para eliminar dirección
async function eliminarDireccion(direccionId) {
    if (!confirm('¿Estás seguro de que deseas eliminar esta dirección?')) {
        return;
    }

    try {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        const response = await fetch(`${API_BASE_URL}/app/Models/direcciones.php?id=${direccionId}&usuario_id=${usuario.id}`, {
            method: 'DELETE'
        });

        const data = await response.json();
        
        if (data.status === 'success') {
            mostrarMensaje('Dirección eliminada correctamente', 'success');
            await cargarDirecciones();
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('Error al eliminar la dirección', 'error');
    }
}

// Modificar la función guardarDireccion existente para manejar actualizaciones
async function guardarDireccion(form, direccionId = null) {
    try {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        const formData = {
            usuario_id: usuario.id,
            direccion: form.direccion.value.trim(),
            referencia: form.referencia.value.trim()
        };

        if (direccionId) {
            formData.direccion_id = direccionId;
        }

        const response = await fetch(`${API_BASE_URL}/app/Models/direcciones.php`, {
            method: direccionId ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        
        if (data.status === 'success') {
            mostrarMensaje(direccionId ? 'Dirección actualizada correctamente' : 'Dirección agregada correctamente', 'success');
            await cargarDirecciones();
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje(error.message, 'error');
    }
} 