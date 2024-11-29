document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const productoId = urlParams.get('id');

    if (productoId) {
        fetch(`https://randy939-001-site1.qtempurl.com/app/Controllers/productos.php?id=${productoId}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success' && data.producto) {
                    const producto = data.producto;
                    document.getElementById('producto-imagen').src = producto.imagen;
                    document.getElementById('producto-titulo').textContent = producto.nombre;
                    document.getElementById('producto-descripcion').textContent = producto.descripcion;
                    document.getElementById('producto-precio').textContent = `S/. ${producto.precio}`;
                } else {
                    console.error('Error al cargar el producto:', data.message);
                }
            })
            .catch(error => console.error('Error:', error));
    }
});