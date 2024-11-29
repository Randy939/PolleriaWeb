document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const productoId = urlParams.get('id');

    if (productoId) {
        cargarProducto(productoId);
    }

    async function cargarProducto(id) {
        try {
            const response = await fetch(`https://randy939-001-site1.qtempurl.com/app/Controllers/productos.php?id=${id}`);
            if (!response.ok) {
                throw new Error('Error al cargar el producto');
            }
            const producto = await response.json();

            document.getElementById('producto-nombre').textContent = producto.nombre;
            document.getElementById('producto-descripcion').textContent = producto.descripcion;
            document.getElementById('producto-img').src = producto.imagen;
        } catch (error) {
            console.error('Error:', error);
            alert('No se pudo cargar la información del producto.');
        }
    }
});

document.querySelector('.btn-comentar').addEventListener('click', async function() {
    const comentario = document.querySelector('textarea').value;
    const calificacion = document.querySelector('.stars i.active').dataset.rating;
    const usuarioId = JSON.parse(localStorage.getItem('usuario')).id;

    try {
        const response = await fetch('https://randy939-001-site1.qtempurl.com/app/Controllers/opiniones.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                usuario_id: usuarioId,
                producto_id: productoId,
                calificacion: calificacion,
                comentario: comentario
            })
        });

        const data = await response.json();
        if (data.status === 'success') {
            alert('Comentario publicado exitosamente.');
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error al publicar el comentario:', error);
        alert('No se pudo publicar el comentario.');
    }
});