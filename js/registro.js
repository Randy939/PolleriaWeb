document.getElementById('registroForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('nombre', document.getElementById('nombre').value);
    formData.append('apellido', document.getElementById('apellido').value);
    formData.append('email', document.getElementById('email').value);
    formData.append('password', document.getElementById('password').value);
    formData.append('direccion', document.getElementById('direccion').value);
    formData.append('telefono', document.getElementById('telefono').value);
    
    try {
        const response = await fetch('https://randy939-001-site1.qtempurl.com/app/Controllers/registro.php', {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });
        
        const data = await response.json();
        console.log('Respuesta del servidor:', data);
        
        if (data.status === 'success') {
            const loginResponse = await fetch('https://randy939-001-site1.qtempurl.com/app/Controllers/login.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ 
                    email: document.getElementById('email').value,
                    password: document.getElementById('password').value 
                })
            });
            
            const loginData = await loginResponse.json();
            
            if (loginData.status === 'success') {
                localStorage.setItem('usuario', JSON.stringify({
                    id: loginData.data.id,
                    nombre: document.getElementById('nombre').value,
                    email: document.getElementById('email').value
                }));
                
                const mensajeExito = document.createElement('div');
                mensajeExito.className = 'mensaje-exito';
                mensajeExito.textContent = 'Registro exitoso';
                document.getElementById('registroForm').insertBefore(mensajeExito, document.querySelector('.btn-registro'));
                
                setTimeout(() => {
                    window.location.href = '/index.html';
                }, 1500);
            }
        } else {
            const mensajeError = document.createElement('div');
            mensajeError.className = 'mensaje-error';
            mensajeError.textContent = data.message || 'Error en el registro';
            document.getElementById('registroForm').insertBefore(mensajeError, document.querySelector('.btn-registro'));
        }
    } catch (error) {
        console.error('Error:', error);
        const mensajeError = document.createElement('div');
        mensajeError.className = 'mensaje-error';
        mensajeError.textContent = 'Error al intentar registrar el usuario';
        document.getElementById('registroForm').insertBefore(mensajeError, document.querySelector('.btn-registro'));
    }
}); 