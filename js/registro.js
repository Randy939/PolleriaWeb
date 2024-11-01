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
        console.log('Enviando datos:', formData);
        
        const response = await fetch('http://localhost/gran_appetit/app/Controllers/registro.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(formData)
        });
        
        console.log('Respuesta del servidor:', response);
        
        const data = await response.json();
        console.log('Datos de respuesta:', data);
        
        if (response.ok && data.status === 'success') {
            alert('Registro exitoso');
            window.location.href = 'login.html';
        } else {
            throw new Error(data.message || 'Error en el registro');
        }
    } catch (error) {
        console.error('Error:', error);
        alert(error.message || 'Error al intentar registrar el usuario');
    }
}); 