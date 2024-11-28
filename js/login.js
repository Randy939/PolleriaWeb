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
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error de respuesta:', errorText);
            throw new Error('Error en la autenticación');
        }
        
        const data = await response.json();
        
        if (data.status === "success") {
            localStorage.setItem('usuario', JSON.stringify({
                id: data.data.id,
                nombre: data.data.nombre,
                email: email,
                rol_id: data.data.rol_id
            }));
            
            window.location.href = '/index.html';
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