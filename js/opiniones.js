document.addEventListener('DOMContentLoaded', function() {
    const opinionesWrapper = document.getElementById('opiniones-wrapper');

    fetch('https://randy939-001-site1.qtempurl.com/app/Controllers/obtener_opiniones.php')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success' && data.opiniones.length > 0) {
                data.opiniones.forEach(opinion => {
                    const opinionHTML = `
                        <div class="swiper-slide slide">
                            <div class="opinion-card">
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
                        </div>
                    `;
                    opinionesWrapper.innerHTML += opinionHTML;

                    const lastOpinionCard = opinionesWrapper.lastElementChild;
                    setTimeout(() => {
                        lastOpinionCard.classList.add('show');
                    }, 100);
                });
            } else {
                opinionesWrapper.innerHTML = '<p>No hay opiniones disponibles.</p>';
            }
        })
        .catch(error => console.error('Error al cargar las opiniones:', error));
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