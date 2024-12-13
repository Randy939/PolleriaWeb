const API_BASE_URL = 'https://randy939-001-site1.qtempurl.com';

async function cargarDirecciones() {
    try {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        const response = await fetch(`${API_BASE_URL}/app/Controllers/direcciones.php?usuario_id=${usuario.id}`);
        const data = await response.json();
        
        console.log('Datos de direcciones:', data);

        const direccionesLista = document.querySelector('.direcciones-lista');
        
        if (!direccionesLista) {
            console.error('El contenedor de direcciones no se encontró en el DOM.');
            return;
        }

        direccionesLista.innerHTML = '<p>Cargando direcciones...</p>';
        direccionesLista.innerHTML = '';
        
        if (data.status === 'success' && Array.isArray(data.direcciones) && data.direcciones.length > 0) {
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
        console.log('URL de eliminación:', url);

        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        const responseText = await response.text();
        if (!responseText) {
            throw new Error('La respuesta del servidor está vacía');
        }

        const data = JSON.parse(responseText);
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
