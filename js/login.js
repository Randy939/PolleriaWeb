document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    try {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Deshabilitar el botón de submit
        const submitButton = this.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
        }
        
        const response = await fetch('https://randy939-001-site1.qtempurl.com//app/Controllers/login.php', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        
        if (data.status === 'success') {
            localStorage.setItem('usuario', JSON.stringify(data.data));
            // Usar una redirección más suave
            document.body.style.opacity = '0';
            setTimeout(() => {
                window.location.href = '/app/Views/pages/index.html';
            }, 300);
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert(error.message || 'Error al intentar iniciar sesión');
    } finally {
        // Re-habilitar el botón de submit
        const submitButton = this.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = false;
        }
    }
}); 