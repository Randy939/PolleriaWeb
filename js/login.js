document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const baseUrl = 'https://randy939-001-site1.qtempurl.com//app/Controllers/login.php';
        
        const checkCORS = await fetch(baseUrl, {
            method: 'OPTIONS',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        const response = await fetch(baseUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();
        console.log('Respuesta:', data);
        
        if (!response.ok) {
            throw new Error(data.message || `Error HTTP: ${response.status}`);
        }
        
        if (data.status === 'success') {
            localStorage.setItem('usuario', JSON.stringify(data.data));
            window.location.href = '/app/Views/pages/index.html';
        } else {
            alert(data.message || 'Error desconocido');
        }
    } catch (error) {
        console.error('Error detallado:', {
            message: error.message,
            error: error
        });
        alert('Error al intentar iniciar sesión: ' + error.message);
    }
}); 