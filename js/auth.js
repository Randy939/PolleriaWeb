function verificarAutenticacion() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario) {
        window.location.href = '/app/Views/auth/login.html';
        return false;
    }
    return true;
}

function redirigirSegunAutenticacion(rutaProtegida) {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario && rutaProtegida) {
        window.location.href = '/app/Views/auth/login.html';
    } else if (usuario && !rutaProtegida) {
        window.location.href = '/app/Views/pages/index.html';
    }
}

// Exportar la función si estás usando módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { verificarAutenticacion, redirigirSegunAutenticacion };
} 