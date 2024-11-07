const API_BASE_URL = 'https://randy939-001-site1.qtempurl.com';

document.addEventListener('DOMContentLoaded', inicializarPerfil);

async function inicializarPerfil() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    
    if (!usuario) {
        window.location.href = '/app/Views/auth/login.html';
        return;
    }

    await Promise.all([
        cargarDatosUsuario(usuario),
        cargarDirecciones(usuario.id)
    ]);

    inicializarEventListeners();
}

function inicializarEventListeners() {
    // Navegación del menú
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', manejarNavegacionMenu);
    });

    // Edición de campos
    document.querySelectorAll('.btn-editar').forEach(btn => {
        btn.addEventListener('click', manejarEdicionCampo);
    });

    // Formularios
    document.getElementById('form-datos-personales')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        await actualizarDatosPersonales();
    });

    document.getElementById('form-cambiar-password')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        await cambiarPassword();
    });

    // Botón agregar dirección
    document.querySelector('.btn-agregar')?.addEventListener('click', () => {
        mostrarFormularioDireccion();
    });
}

function manejarNavegacionMenu(e) {
    if (this.id === 'btn-cerrar-sesion') {
        cerrarSesion();
        return;
    }

    e.preventDefault();
    cambiarSeccion(this.dataset.section);
}

function manejarEdicionCampo() {
    const input = this.parentElement.querySelector('input');
    const btnGuardar = document.querySelector('.btn-guardar');
    
    if (input.readOnly) {
        activarEdicion(input, this, btnGuardar);
    } else {
        desactivarEdicion(input, this);
    }
}

function activarEdicion(input, btn, btnGuardar) {
    input.readOnly = false;
    input.focus();
    btnGuardar.style.display = 'block';
    btn.innerHTML = '<i class="fas fa-times"></i>';
}

function desactivarEdicion(input, btn) {
    input.readOnly = true;
    btn.innerHTML = '<i class="fas fa-edit"></i>';
}

async function cargarDatosUsuario(usuario) {
    try {
        const response = await fetch(`${API_BASE_URL}/app/Models/obtener_usuario.php?id=${usuario.id}`);
        if (!response.ok) throw new Error('Error en la respuesta del servidor');

        const data = await response.json();
        if (data.status === 'success') {
            actualizarCamposUsuario(data.usuario);
        } else {
            throw new Error(data.message || 'Error al cargar datos del usuario');
        }
    } catch (error) {
        mostrarMensaje('Error al cargar datos del usuario: ' + error.message, 'error');
    }
}

function actualizarCamposUsuario(usuario) {
    const campos = ['nombre', 'apellido', 'email', 'telefono', 'direccion'];
    campos.forEach(campo => {
        const elemento = document.getElementById(campo);
        if (elemento) elemento.value = usuario[campo] || '';
    });

    // Actualizar header del perfil
    document.getElementById('nombre-usuario').textContent = 
        `${usuario.nombre || ''} ${usuario.apellido || ''}`;
    document.getElementById('email-usuario').textContent = usuario.email || '';
}

async function actualizarDatosPersonales() {
    try {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        const formData = {
            id: usuario.id,
            nombre: document.getElementById('nombre').value,
            apellido: document.getElementById('apellido').value,
            email: document.getElementById('email').value,
            telefono: document.getElementById('telefono').value,
            direccion: document.getElementById('direccion').value
        };

        const response = await fetch(`${API_BASE_URL}/app/Models/actualizar_usuario.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        if (data.status === 'success') {
            actualizarDatosLocales(formData);
            mostrarMensaje('Datos actualizados correctamente', 'success');
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        mostrarMensaje(error.message || 'Error al actualizar los datos', 'error');
    }
}

function actualizarDatosLocales(formData) {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    usuario.nombre = formData.nombre;
    usuario.email = formData.email;
    localStorage.setItem('usuario', JSON.stringify(usuario));

    document.getElementById('nombre-usuario').textContent = 
        `${formData.nombre} ${formData.apellido}`;
    document.getElementById('email-usuario').textContent = formData.email;
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

        const data = await response.json();
        if (data.status === 'success') {
            mostrarMensaje('Contraseña actualizada correctamente', 'success');
            document.getElementById('form-cambiar-password').reset();
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        mostrarMensaje(error.message, 'error');
    }
}

async function cargarDirecciones(usuarioId) {
    try {
        const response = await fetch(`${API_BASE_URL}/app/Models/direcciones.php?usuario_id=${usuarioId}`);
        const data = await response.json();
        
        actualizarListaDirecciones(data);
    } catch (error) {
        mostrarMensaje('Error al cargar las direcciones', 'error');
    }
}

function actualizarListaDirecciones(data) {
    const direccionesList = document.querySelector('.direcciones-lista');
    if (!direccionesList) return;

    if (data.status === 'success' && data.direcciones.length > 0) {
        direccionesList.innerHTML = data.direcciones.map(dir => crearElementoDireccion(dir)).join('');
        inicializarBotonesDireccion();
    } else {
        direccionesList.innerHTML = '<p>No hay direcciones registradas</p>';
    }
}

function crearElementoDireccion(dir) {
    return `
        <div class="direccion-item">
            <p class="direccion-texto">${dir.direccion}</p>
            <p class="direccion-referencia">${dir.referencia || ''}</p>
            <div class="direccion-acciones">
                <button class="btn-editar-direccion" data-id="${dir.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-eliminar-direccion" data-id="${dir.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
}

function inicializarBotonesDireccion() {
    document.querySelectorAll('.btn-editar-direccion').forEach(btn => {
        btn.addEventListener('click', () => editarDireccion(btn.dataset.id));
    });

    document.querySelectorAll('.btn-eliminar-direccion').forEach(btn => {
        btn.addEventListener('click', () => eliminarDireccion(btn.dataset.id));
    });
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
    inicializarEventosModal(modal, direccion);
}

function inicializarEventosModal(modal, direccion) {
    modal.querySelector('.btn-cancelar').addEventListener('click', () => modal.remove());
    
    modal.querySelector('#form-direccion').addEventListener('submit', async (e) => {
        e.preventDefault();
        await guardarDireccion(e.target, direccion?.id);
        modal.remove();
    });
}

async function guardarDireccion(form, direccionId = null) {
    try {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        const formData = {
            usuario_id: usuario.id,
            direccion: form.direccion.value,
            referencia: form.referencia.value,
            id: direccionId
        };

        const response = await fetch(`${API_BASE_URL}/app/Models/direcciones.php`, {
            method: direccionId ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        if (data.status === 'success') {
            mostrarMensaje(direccionId ? 'Dirección actualizada' : 'Dirección agregada', 'success');
            await cargarDirecciones(usuario.id);
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        mostrarMensaje(error.message, 'error');
    }
}

function cambiarSeccion(seccion) {
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`.menu-item[data-section="${seccion}"]`)?.classList.add('active');

    document.querySelectorAll('.perfil-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(seccion)?.classList.add('active');
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
    setTimeout(() => div.remove(), 3000);
} 