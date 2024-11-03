document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch('https://gentle-arithmetic-98eb61.netlify.app/app/views/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                email: email,
                password: password
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error en el servidor');
        }
        
        const data = await response.json();
        
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
        alert(error.message || 'Error al intentar iniciar sesión');
    }
}); 