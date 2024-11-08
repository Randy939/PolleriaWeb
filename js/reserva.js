document.addEventListener('DOMContentLoaded', function() {
    const reservaForm = document.querySelector('.reserva-form');
    const inputFields = document.querySelectorAll('.input-field input, .input-field select, .input-field textarea');
    
    // Establecer fecha mínima como hoy
    const fechaInput = document.querySelector('input[type="date"]');
    if (fechaInput) {
        const hoy = new Date().toISOString().split('T')[0];
        fechaInput.min = hoy;
    }

    // Animación de campos al focus
    inputFields.forEach(field => {
        field.addEventListener('focus', function() {
            this.parentElement.classList.add('active');
        });

        field.addEventListener('blur', function() {
            if (this.value === '') {
                this.parentElement.classList.remove('active');
            }
        });
    });

    // Validación y animación del formulario
    if (reservaForm) {
        reservaForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Verificar si el usuario está logueado
            const usuarioStr = localStorage.getItem('usuario');
            if (!usuarioStr) {
                window.location.href = '/app/Views/auth/login.html';
                return;
            }

            const usuario = JSON.parse(usuarioStr);
            
            // Validar campos
            let isValid = true;
            inputFields.forEach(field => {
                if (field.hasAttribute('required') && !field.value) {
                    isValid = false;
                    animateError(field);
                }
            });

            if (isValid) {
                try {
                    const formData = {
                        usuario_id: usuario.id,
                        fecha_reserva: document.querySelector('input[type="date"]').value,
                        hora_reserva: document.querySelector('input[type="time"]').value,
                        num_personas: document.querySelector('select[name="num_personas"]').value,
                        ocasion: document.querySelector('select[name="ocasion"]').value,
                        comentarios: document.querySelector('textarea').value
                    };

                    const response = await fetch('https://randy939-001-site1.qtempurl.com/app/Controllers/crear_reserva.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(formData)
                    });

                    const data = await response.json();

                    if (data.status === 'success') {
                        // Animación de éxito
                        const btn = this.querySelector('.btn-reserva');
                        btn.innerHTML = '<i class="fas fa-check"></i> ¡Reserva Confirmada!';
                        btn.style.backgroundColor = 'var(--green)';
                        
                        setTimeout(() => {
                            mostrarMensajeExito();
                            this.reset();
                        }, 1500);
                    } else {
                        throw new Error(data.message || 'Error al crear la reserva');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    mostrarError('Error al procesar la reserva: ' + error.message);
                }
            }
        });
    }
});

function animateError(field) {
    field.classList.add('error');
    field.style.animation = 'shake 0.5s ease';
    
    setTimeout(() => {
        field.style.animation = '';
    }, 500);
}

function mostrarMensajeExito() {
    // Crear elemento para el mensaje
    const mensaje = document.createElement('div');
    mensaje.className = 'mensaje-exito';
    mensaje.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <p>¡Tu reserva ha sido confirmada!</p>
        <p>Te enviaremos un correo con los detalles.</p>
    `;

    // Estilos para el mensaje
    mensaje.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #fff;
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 0 0 2rem rgba(0,0,0,0.1);
        text-align: center;
        z-index: 1000;
        animation: fadeIn 0.5s ease;
    `;

    // Agregar al DOM
    document.body.appendChild(mensaje);

    // Remover después de 3 segundos
    setTimeout(() => {
        mensaje.style.animation = 'fadeOut 0.5s ease';
        setTimeout(() => {
            mensaje.remove();
        }, 500);
    }, 3000);
}

// Animaciones adicionales
document.addEventListener('mousemove', function(e) {
    const forms = document.querySelectorAll('.reserva-form');
    forms.forEach(form => {
        const rect = form.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        form.style.setProperty('--x', `${x}px`);
        form.style.setProperty('--y', `${y}px`);
    });
});

// Agregar función para mostrar errores
function mostrarError(mensaje) {
    const error = document.createElement('div');
    error.className = 'mensaje-error';
    error.innerHTML = `
        <i class="fas fa-times-circle"></i>
        <p>${mensaje}</p>
    `;

    error.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #fff;
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 0 0 2rem rgba(0,0,0,0.1);
        text-align: center;
        z-index: 1000;
        animation: fadeIn 0.5s ease;
        border-left: 4px solid #ff4444;
    `;

    document.body.appendChild(error);

    setTimeout(() => {
        error.style.animation = 'fadeOut 0.5s ease';
        setTimeout(() => {
            error.remove();
        }, 500);
    }, 3000);
}