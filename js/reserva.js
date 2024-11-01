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
        reservaForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Verificar si el usuario está logueado
            const usuario = localStorage.getItem('usuario');
            if (!usuario) {
                window.location.href = '/app/Views/auth/login.html';
                return;
            }

            // Validar campos
            let isValid = true;
            inputFields.forEach(field => {
                if (field.hasAttribute('required') && !field.value) {
                    isValid = false;
                    animateError(field);
                }
            });

            if (isValid) {
                // Animación de éxito
                const btn = this.querySelector('.btn-reserva');
                btn.innerHTML = '<i class="fas fa-check"></i> ¡Reserva Confirmada!';
                btn.style.backgroundColor = 'var(--green)';
                
                // Simular envío
                setTimeout(() => {
                    mostrarMensajeExito();
                    this.reset();
                }, 1500);
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