document.getElementById('registroForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    try {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        console.log('Datos a enviar:', {
            email: email,
            nombre: document.getElementById('nombre').value,
            apellido: document.getElementById('apellido').value,
            direccion: document.getElementById('direccion').value,
            telefono: document.getElementById('telefono').value
        });
        
        const formData = new FormData();
        formData.append('nombre', document.getElementById('nombre').value);
        formData.append('apellido', document.getElementById('apellido').value);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('direccion', document.getElementById('direccion').value);
        formData.append('telefono', document.getElementById('telefono').value);
        
        // Primer paso: Registro
        console.log('Iniciando petición de registro...');
        const response = await fetch('https://randy939-001-site1.qtempurl.com/app/Controllers/registro.php', {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });
        
        console.log('Status de la respuesta del registro:', response.status);
        const registroData = await response.json();
        console.log('Datos completos de la respuesta del registro:', registroData);
        
        if (registroData.status === 'success') {
            console.log('Registro exitoso, preparando datos para login...');
            
            const loginBody = { 
                email: email,
                password: password 
            };
            console.log('Datos de login a enviar:', loginBody);
            
            // Segundo paso: Login
            const loginResponse = await fetch('https://randy939-001-site1.qtempurl.com/app/Controllers/login.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(loginBody)
            });
            
            console.log('Status de la respuesta del login:', loginResponse.status);
            const loginData = await loginResponse.json();
            console.log('Datos completos de la respuesta del login:', loginData);
            
            if (loginData.status === 'success') {
                // Mostrar mensaje de éxito
                const mensajeExito = document.createElement('div');
                mensajeExito.className = 'mensaje-exito';
                mensajeExito.textContent = 'Registro exitoso';
                document.getElementById('registroForm').insertBefore(mensajeExito, document.querySelector('.btn-registro'));
                
                // Guardar datos en localStorage
                localStorage.setItem('usuario', JSON.stringify({
                    id: loginData.data.id,
                    nombre: registroData.data.nombre,
                    email: email,
                    rol_id: loginData.data.rol
                }));
                
                // Redireccionar después de un breve delay
                setTimeout(() => {
                    window.location.href = '/index.html';
                }, 1500);
            } else {
                throw new Error(loginData.message || 'Error en el login después del registro');
            }
        } else {
            throw new Error(registroData.message || 'Error en el registro');
        }
    } catch (error) {
        console.error('Error detallado:', {
            mensaje: error.message,
            stack: error.stack
        });
        const mensajeError = document.createElement('div');
        mensajeError.className = 'mensaje-error';
        mensajeError.textContent = error.message || 'Error al intentar registrar el usuario';
        document.getElementById('registroForm').insertBefore(mensajeError, document.querySelector('.btn-registro'));
    }
}); 