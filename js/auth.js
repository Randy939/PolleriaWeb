function verificarAutenticacion() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario) {
        window.location.href = '/app/Views/auth/login.html';
        return false;
    }
    return true;
}

// Exportar la función si estás usando módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { verificarAutenticacion };
} 