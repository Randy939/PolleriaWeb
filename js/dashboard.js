document.addEventListener('DOMContentLoaded', function() {
    const list = document.querySelectorAll(".navigation li");

    list.forEach((item) => {
        item.addEventListener("click", function() {
            const sectionId = this.querySelector('a').getAttribute('data-section');
            
            // Verificar si sectionId no es nulo
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
                } else if (sectionId === 'dashboard') {
                    // Mostrar secciones de Recent Orders y Recent Customers
                    document.querySelector('.recentOrders').style.display = 'block';
                    document.querySelector('.recentCustomers').style.display = 'block';
                }
            }
        });
    });

    // Asegúrate de que el elemento existe antes de agregar el evento
    const clientesMenuItem = document.querySelector('.menu-item[data-section="clientes"]');
    if (clientesMenuItem) {
        clientesMenuItem.addEventListener('click', function() {
            cargarClientes(); // Cargar clientes al hacer clic en el menú
        });
    } else {
        console.error('El elemento de menú para clientes no se encontró.');
    }
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
                <td>${cliente.direccion}</td>
                <td>${cliente.fecha_registro}</td>
            `;
            clientesContainer.appendChild(clienteRow);
        });
    } else {
        console.error("Error al cargar los clientes:", data.message);
    }
}