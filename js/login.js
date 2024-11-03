document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const errorDiv = document.getElementById('error-message');
    
    try {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        const submitButton = this.querySelector('button[type="submit"]');
        if (submitButton) submitButton.disabled = true;
        
        const response = await fetch('https://randy939-001-site1.qtempurl.com/app/Controllers/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.status === "success") {
            // Guardar los datos del usuario en localStorage
            localStorage.setItem('usuario', JSON.stringify({
                id: data.data.id,
                nombre: data.data.nombre,
                email: email
            }));
            
            // Redirigir a la página anterior o al inicio
            const previousPage = document.referrer;
            window.location.href = previousPage || '/app/Views/pages/index.html';
        } else {
            errorDiv.textContent = data.message || "Error al iniciar sesión";
            errorDiv.style.display = 'block';
        }
    } catch (error) {
        console.error('Error:', error);
        errorDiv.textContent = "Error al intentar iniciar sesión";
        errorDiv.style.display = 'block';
    } finally {
        const submitButton = this.querySelector('button[type="submit"]');
        if (submitButton) submitButton.disabled = false;
    }
}); 