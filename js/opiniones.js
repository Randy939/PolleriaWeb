document.addEventListener('DOMContentLoaded', function() {
    const opinionesContainer = document.getElementById('opiniones-container');
    let currentIndex = 0;
    let opiniones = [];

    fetch('https://randy939-001-site1.qtempurl.com/app/Controllers/obtener_opiniones.php')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success' && data.opiniones.length > 0) {
                opiniones = data.opiniones;
                mostrarOpinion(currentIndex);
                setInterval(() => {
                    currentIndex = (currentIndex + 1) % opiniones.length;
                    mostrarOpinion(currentIndex);
                }, 5000); // Cambia de opinión cada 5 segundos
            } else {
                opinionesContainer.innerHTML = '<p>No hay opiniones disponibles.</p>';
            }
        })
        .catch(error => console.error('Error al cargar las opiniones:', error));

    function mostrarOpinion(index) {
        opinionesContainer.innerHTML = ''; // Limpiar el contenedor
        const opinion = opiniones[index];
        const opinionHTML = `
            <div class="opinion-card active">
                <div class="opinion-header">
                    <img src="/images/carlos.png" alt="Usuario">
                    <div class="user-info">
                        <h3>${opinion.usuario_nombre || ''} ${opinion.usuario_apellido || ''}</h3>
                        <div class="rating">
                            ${generarEstrellas(opinion.calificacion)}
                            <span class="fecha">${opinion.fecha}</span>
                        </div>
                    </div>
                </div>
                <div class="opinion-content">
                    <p>${opinion.comentario}</p>
                </div>
                <div class="opinion-footer">
                    <div class="plato-pedido">
                        <i class="fas fa-utensils"></i>
                        <span>${opinion.producto_nombre}</span>
                    </div>
                </div>
            </div>
        `;
        opinionesContainer.innerHTML = opinionHTML;
        setTimeout(() => {
            const cards = document.querySelectorAll('.opinion-card');
            cards.forEach(card => card.classList.remove('active'));
            cards[index].classList.add('active');
        }, 50); // Pequeño retraso para permitir la transición
    }

    function generarEstrellas(calificacion) {
        let estrellas = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= calificacion) {
                estrellas += '<i class="fas fa-star"></i>';
            } else if (i - 0.5 <= calificacion) {
                estrellas += '<i class="fas fa-star-half-alt"></i>';
            } else {
                estrellas += '<i class="far fa-star"></i>';
            }
        }
        return estrellas;
    }
}); 