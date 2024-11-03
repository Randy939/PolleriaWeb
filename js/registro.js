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