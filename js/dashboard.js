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

// Función para cargar clientes
async function cargarClientes() {
    const response = await fetch('https://gentle-arithmetic-98eb61.netlify.app/app/Controllers/obtener_clientes.php');
    const data = await response.json();

    if (data.status === 'success') {
        const clientesBody = document.getElementById('clientes-body');
        clientesBody.innerHTML = ''; // Limpiar el contenido anterior

        data.clientes.forEach(cliente => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${cliente.nombre}</td>
                <td>${cliente.apellido}</td>
                <td>${cliente.email}</td>
                <td>${cliente.direccion || 'No disponible'}</td>
                <td>${cliente.telefono}</td>
                <td>${cliente.fecha_registro}</td>
            `;
            clientesBody.appendChild(row);
        });

        document.querySelector('.clientes-section').style.display = 'block'; // Mostrar la sección
    } else {
        console.error(data.message);
    }
}

// Función para mostrar la sección de clientes
function mostrarClientes() {
    // Ocultar otras secciones
    const secciones = document.querySelectorAll('.clientes-section, .recentCustomers');
    secciones.forEach(seccion => {
        seccion.style.display = 'none'; // Ocultar todas las secciones
    });

    // Mostrar la sección de clientes
    const clientesSection = document.querySelector('.clientes-section');
    if (clientesSection) {
        clientesSection.style.display = 'block'; // Mostrar la sección de clientes
    }

    // Llamar a la función para cargar los clientes
    cargarClientes();
}

// Manejar el clic en el menú de clientes
document.querySelector('.navigation a[href="#"]').addEventListener('click', function(e) {
    e.preventDefault(); // Prevenir el comportamiento por defecto del enlace
    mostrarClientes(); // Mostrar la sección de clientes
});
