document.addEventListener('DOMContentLoaded', function() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    
    if (!usuario) {
        window.location.href = '/app/Views/auth/login.html';
        return;
    }
    
    // Verificar si el usuario está logueado
    if (!usuario) {
        // Si no hay usuario logueado, redirigir al login
        window.location.href = '/app/Views/auth/login.html';
        return;
    }
    
    // Continuar con la inicialización normal si el usuario está logueado
    let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    
    // Actualizar iconos de corazón en la página actual
    actualizarIconosFavoritos();
    
    // Si estamos en la página de favoritos, cargar los productos
    if (window.location.pathname.includes('favoritos.html')) {
        cargarProductosFavoritos();
    }
    
    // Event delegation para los corazones
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('fa-heart')) {
            const productoCard = e.target.closest('.box');
            if (productoCard) {
                toggleFavorito(productoCard);
            }
        }
    });
});

function toggleFavorito(productoCard) {
    const productoId = productoCard.dataset.id;
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    const corazon = productoCard.querySelector('.fa-heart');
    
    const index = favoritos.indexOf(productoId);
    
    if (index === -1) {
        // Agregar a favoritos
        favoritos.push(productoId);
        corazon.classList.add('active');
        mostrarMensaje('Producto agregado a favoritos');
    } else {
        // Quitar de favoritos
        favoritos.splice(index, 1);
        corazon.classList.remove('active');
        mostrarMensaje('Producto eliminado de favoritos');
        
        // Si estamos en la página de favoritos, eliminar el producto visualmente
        if (window.location.pathname.includes('favoritos.html')) {
            productoCard.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                productoCard.remove();
                verificarFavoritosVacios();
            }, 300);
        }
    }
    
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
}

function cargarProductosFavoritos() {
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    const container = document.querySelector('.box-container');
    const noFavoritos = document.querySelector('.no-favoritos');
    
    if (favoritos.length === 0) {
        container.style.display = 'none';
        noFavoritos.style.display = 'block';
        return;
    }
    
    container.style.display = 'grid';
    noFavoritos.style.display = 'none';
    
    // Aquí deberías cargar los productos desde tu base de datos o API
    // Por ahora, simularemos con los productos del DOM
    favoritos.forEach(productoId => {
        const productoOriginal = document.querySelector(`[data-id="${productoId}"]`);
        if (productoOriginal) {
            const productoClone = productoOriginal.cloneNode(true);
            container.appendChild(productoClone);
        }
    });
}

function verificarFavoritosVacios() {
    const container = document.querySelector('.box-container');
    const noFavoritos = document.querySelector('.no-favoritos');
    
    if (container.children.length === 0) {
        container.style.display = 'none';
        noFavoritos.style.display = 'block';
    } else {
        container.style.display = 'grid';
        noFavoritos.style.display = 'none';
    }
} 