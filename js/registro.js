document.getElementById('registroForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = {
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        direccion: document.getElementById('direccion').value,
        telefono: document.getElementById('telefono').value
    };
    
    try {
        const response = await fetch('https://randy939-001-site1.qtempurl.com/app/Controllers/registro.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            alert('Registro exitoso');
            window.location.href = 'login.html';
        } else {
            alert(data.message || 'Error en el registro');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al intentar registrar el usuario');
    }
}); 