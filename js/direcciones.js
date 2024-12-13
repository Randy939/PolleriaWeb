const API_BASE_URL = 'https://randy939-001-site1.qtempurl.com';

async function cargarDirecciones() {
    try {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        if (!usuario || !usuario.id) {
            console.error('No se encontró información del usuario');
            return;
        }

        const response = await fetch(`${API_BASE_URL}/app/Controllers/direcciones.php?usuario_id=${usuario.id}`);
        const data = await response.json();

        const direccionesLista = document.querySelector('.direcciones-lista');
        if (!direccionesLista) {
            console.error('El contenedor de direcciones no se encontró en el DOM.');
            return;
        }

        direccionesLista.innerHTML = '<p>Cargando direcciones...</p>';

        if (data.status === 'success' && Array.isArray(data.direcciones) && data.direcciones.length > 0) {
            direccionesLista.innerHTML = ''; // Limpiar la lista

            data.direcciones.forEach(direccion => {
                const direccionElement = document.createElement('div');
                direccionElement.className = 'direccion-item';
                direccionElement.innerHTML = `
                    <div class="direccion-info">
                        <p class="direccion-principal">${direccion.direccion}</p>
                        ${direccion.referencia ? `<p class="direccion-referencia">${direccion.referencia}</p>` : ''}
                    </div>
                    <div class="direccion-acciones">
                        <button onclick="mostrarFormularioDireccion(${JSON.stringify(direccion).replace(/"/g, '&quot;')})" class="btn-editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="eliminarDireccion(${direccion.id})" class="btn-eliminar">
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
        console.error('Error al cargar direcciones:', error);
        mostrarMensaje('Error al cargar las direcciones: ' + error.message, 'error');
    }
}

async function eliminarDireccion(direccionId) {
    if (!confirm('¿Estás seguro de que deseas eliminar esta dirección?')) {
        return;
    }

    try {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        const url = `${API_BASE_URL}/app/Controllers/direcciones.php?id=${direccionId}&usuario_id=${usuario.id}`;
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        const data = await response.json();
        if (data.status === 'success') {
            mostrarMensaje('Dirección eliminada correctamente', 'success');
            await cargarDirecciones();
        } else {
            throw new Error(data.message || 'Error al eliminar la dirección');
        }
    } catch (error) {
        console.error('Error al eliminar la dirección:', error);
        mostrarMensaje('Error al eliminar la dirección: ' + error.message, 'error');
    }
}

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

        const response = await fetch(`${API_BASE_URL}/app/Controllers/direcciones.php`, {
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

function mostrarFormularioDireccion(direccion = null) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>${direccion ? 'Editar' : 'Nueva'} Dirección</h3>
            <form id="form-direccion">
                <div class="form-group">
                    <label>Dirección</label>
                    <input type="text" name="direccion" required value="${direccion ? direccion.direccion : ''}">
                </div>
                <div class="form-group">
                    <label>Referencia</label>
                    <input type="text" name="referencia" value="${direccion ? direccion.referencia : ''}">
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn-cancelar">Cancelar</button>
                    <button type="submit" class="btn-guardar">Guardar</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('.btn-cancelar').addEventListener('click', () => {
        modal.remove();
    });

    modal.querySelector('#form-direccion').addEventListener('submit', async (e) => {
        e.preventDefault();
        await guardarDireccion(e.target, direccion?.id);
        modal.remove();
    });
}

// Inicializar la carga de direcciones al cargar la página
document.addEventListener('DOMContentLoaded', cargarDirecciones);