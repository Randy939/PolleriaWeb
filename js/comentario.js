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

    // Manejo de las estrellas
    const estrellas = document.querySelectorAll('.stars i');
    let calificacionSeleccionada = 0; // Variable para almacenar la calificación seleccionada

    estrellas.forEach(star => {
        star.addEventListener('click', function() {
            // Desmarcar todas las estrellas
            estrellas.forEach(s => s.classList.remove('active'));
            // Marcar la estrella actual y todas las anteriores
            this.classList.add('active');
            let rating = this.getAttribute('data-rating');
            calificacionSeleccionada = parseInt(rating); // Actualiza la calificación seleccionada
            for (let i = 0; i < calificacionSeleccionada; i++) {
                estrellas[i].classList.add('active');
            }
            console.log('Calificación seleccionada:', calificacionSeleccionada);
        });
    });

    // Enviar comentario
    document.querySelector('.btn-comentar').addEventListener('click', function() {
        // Captura la calificación justo antes de enviar
        const comentario = document.querySelector('textarea').value;
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        const usuarioId = usuario ? usuario.id : null;

        if (!calificacionSeleccionada || !comentario || !usuarioId) {
            alert('Por favor, completa todos los campos antes de enviar.');
            return;
        }

        const data = {
            usuario_id: usuarioId,
            producto_id: productoId,
            calificacion: calificacionSeleccionada, // Usa la calificación seleccionada
            comentario: comentario
        };

        console.log('Datos enviados al servidor:', data);

        fetch('https://randy939-001-site1.qtempurl.com/app/Controllers/crear_opinion.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('Comentario publicado exitosamente');
                document.querySelector('textarea').value = '';
                estrellas.forEach(s => s.classList.remove('active')); // Limpiar estrellas
            } else {
                alert('Error al publicar el comentario: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    });
});