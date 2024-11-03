document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Obtener el elemento de error una sola vez
    const errorDiv = document.getElementById('error-message');
    if (!errorDiv) {
        console.error('Elemento error-message no encontrado');
        return;
    }
    
    try {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Deshabilitar el botón de submit
        const submitButton = this.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
        }
        
        const response = await fetch('https://randy939-001-site1.qtempurl.com/app/Controllers/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ email, password })
        });
        
        // Intentar obtener el mensaje de error del servidor
        const responseText = await response.text();
        console.log('Respuesta del servidor:', responseText);
        
        if (!response.ok) {
            let errorMessage = 'Error del servidor';
            try {
                const errorData = JSON.parse(responseText);
                errorMessage = errorData.message || errorMessage;
                console.error('Detalles del error:', errorData);
            } catch (e) {
                console.error('Error parseando respuesta:', responseText);
            }
            throw new Error(errorMessage);
        }
        
        const data = JSON.parse(responseText);
        
        if (data.status === "success") {
            // Login exitoso
            localStorage.setItem('user', JSON.stringify(data.data));
            window.location.href = '/dashboard';
        } else {
            // Mostrar error
            errorDiv.textContent = data.message || "Error desconocido";
            errorDiv.style.display = 'block';
        }
    } catch (error) {
        console.error('Error completo:', error);
        console.error('Stack:', error.stack);
        errorDiv.textContent = error.message || "Error al intentar iniciar sesión";
        errorDiv.style.display = 'block';
    } finally {
        // Re-habilitar el botón de submit
        const submitButton = this.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = false;
        }
    }
}); 