document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch('https://gran-appetit.000.pe/cors.php/app/Controllers/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });
        
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }
        
        const data = await response.json();
        console.log('Respuesta:', data);
        
        if (data.status === 'success') {
            localStorage.setItem('usuario', JSON.stringify(data.data));
            
            // Verificar si venía de la página de favoritos
            const referrer = document.referrer;
            if (referrer.includes('favoritos.html')) {
                window.location.href = referrer;
            } else {
                window.location.href = '/app/Views/pages/index.html';
            }
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error completo:', {
            message: error.message,
            error: error,
            stack: error.stack
        });
        alert('Error al intentar iniciar sesión. Por favor, verifica la consola para más detalles.');
    }
}); 