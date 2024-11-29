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