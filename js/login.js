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
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            credentials: 'include',
            mode: 'cors',
            body: JSON.stringify({ email, password })
        });
        
        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
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
        // Mostrar error genérico al usuario
        errorDiv.textContent = "Error al intentar iniciar sesión. Por favor, intente nuevamente.";
        errorDiv.style.display = 'block';
    } finally {
        // Re-habilitar el botón de submit
        const submitButton = this.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = false;
        }
    }
}); 