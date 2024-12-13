document.addEventListener('DOMContentLoaded', function() {
    const list = document.querySelectorAll(".navigation li");

    list.forEach((item) => {
        item.addEventListener("click", function() {
            const sectionId = this.querySelector('a').getAttribute('data-section');
            
            if (sectionId) {
                document.querySelectorAll('.perfil-section').forEach(section => {
                    section.style.display = 'none'; // Ocultar todas las secciones
                });
                
                // Ocultar secciones adicionales
                document.querySelector('.recentOrders').style.display = 'none';
                document.querySelector('.recentCustomers').style.display = 'none';

                // Mostrar secciones según el botón clicado
                if (sectionId === 'clientes') {
                    const selectedSection = document.getElementById(sectionId);
                    if (selectedSection) {
                        selectedSection.style.display = 'block'; // Mostrar la sección de Clientes
                        cargarClientes(); // Cargar clientes al mostrar la sección
                    }
                }  else if (sectionId === 'dashboard') {
                    document.querySelector('.recentOrders').style.display = 'block';
                    document.querySelector('.recentCustomers').style.display = 'block';
                } else if (sectionId === 'reservaciones') {
                    const selectedSection = document.getElementById(sectionId);
                    if (selectedSection) {
                        selectedSection.style.display = 'block'; // Mostrar la sección de Reservaciones
                        cargarReservaciones(); // Cargar reservaciones al mostrar la sección
                    }
                }
            }
        });
    });
});

// add hovered class to selected list item
let list = document.querySelectorAll(".navigation li");

function activeLink() {
  list.forEach((item) => {
    item.classList.remove("hovered");
  });
  this.classList.add("hovered");
}

list.forEach((item) => item.addEventListener("mouseover", activeLink));

// Menu Toggle
let toggle = document.querySelector(".toggle");
let navigation = document.querySelector(".navigation");
let main = document.querySelector(".main");

toggle.onclick = function () {
  navigation.classList.toggle("active");
  main.classList.toggle("active");
};

async function cargarClientes() {
    try {
        const response = await fetch('https://randy939-001-site1.qtempurl.com/app/Controllers/obtener_clientes.php');
        const data = await response.json();

        if (data.status === "success") {
            const clientesContainer = document.querySelector('.clientes-container');
            clientesContainer.innerHTML = ''; // Limpiar el contenedor

            data.clientes.forEach(cliente => {
                const clienteRow = document.createElement('tr');
                clienteRow.innerHTML = `
                    <td>${cliente.nombre}</td>
                    <td>${cliente.apellido}</td>
                    <td>${cliente.email}</td>
                    <td>${cliente.telefono}</td>
                    <td>
                        <ul>
                            ${cliente.direcciones.split(', ').map(direccion => `<li>${direccion}</li>`).join('')}
                        </ul>
                    </td>
                    <td>${cliente.fecha_registro}</td>
                `;
                clientesContainer.appendChild(clienteRow);
            });
        } else {
            console.error("Error al cargar los clientes:", data.message);
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
    }
}

async function cargarReservaciones() {
    try {
        const response = await fetch('https://randy939-001-site1.qtempurl.com/app/Controllers/obtener_reservaciones.php');
        const data = await response.json();

        if (data.status === "success") {
            const reservacionesContainer = document.querySelector('.reservaciones-container');
            reservacionesContainer.innerHTML = ''; // Limpiar el contenedor

            data.reservaciones.forEach(reserva => {
                const reservaRow = document.createElement('tr');
                reservaRow.innerHTML = `
                    <td>${reserva.nombre}</td>
                    <td>${reserva.fecha_reserva}</td>
                    <td>${reserva.hora_reserva}</td>
                    <td>${reserva.num_personas}</td>
                    <td>${reserva.ocasion}</td>
                    <td>${reserva.comentarios}</td>
                `;
                reservacionesContainer.appendChild(reservaRow);
            });
        } else {
            console.error("Error al cargar las reservaciones:", data.message);
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
    }
}