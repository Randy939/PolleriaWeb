const API_BASE = '/api';

document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    try {
        const response = await fetch(`${API_BASE}/app/Controllers/login.php`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
            })
        });

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
        console.error('Error:', error);
        alert('Error al intentar iniciar sesión');
    }
}); 