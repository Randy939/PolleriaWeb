document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    try {
        const response = await fetch('https://gran-appetit.000.pe/app/Controllers/login.php', {
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
            window.location.href = '/app/Views/pages/index.html';
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al intentar iniciar sesión');
    }
}); 