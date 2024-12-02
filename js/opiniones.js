document.addEventListener('DOMContentLoaded', function() {
    const opinionesWrapper = document.getElementById('opiniones-wrapper');

    fetch('https://randy939-001-site1.qtempurl.com/app/Controllers/obtener_opiniones.php') // Cambia esta URL por la correcta
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success' && data.opiniones) {
                data.opiniones.forEach(opinion => {
                    const opinionHTML = `
                        <div class="swiper-slide slide">
                            <div class="opinion-card">
                                <div class="opinion-header">
                                    <img src="/images/carlos.png" alt="Usuario">
                                    <div class="user-info">
                                        <h3>${opinion.nombre}</h3>
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
                                        <span>${opinion.producto}</span>
                                    </div>
                                    <div class="opinion-acciones">
                                        <button class="util-btn">
                                            <i class="fas fa-thumbs-up"></i>
                                            <span>${opinion.likes || 0}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    opinionesWrapper.innerHTML += opinionHTML;
                });
            } else {
                opinionesWrapper.innerHTML = '<p>No hay opiniones disponibles.</p>';
            }
        })
        .catch(error => {
            console.error('Error al cargar opiniones:', error);
            opinionesWrapper.innerHTML = '<p>Error al cargar opiniones.</p>';
        });
});

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