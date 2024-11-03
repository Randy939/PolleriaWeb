document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        // Actualiza la URL base con tu nuevo dominio de SmarterASP.NET
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

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Respuesta:', data);
        
        if (data.status === 'success') {
            localStorage.setItem('usuario', JSON.stringify(data.data));
            window.location.href = '/app/Views/pages/index.html';
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error detallado:', {
            message: error.message,
            error: error
        });
        alert('Error al intentar iniciar sesión. Por favor, verifica la consola.');
    }
}); 