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

// Agregar evento de clic para mostrar la sección de clientes
list.forEach((item) => {
    item.addEventListener("click", function() {
        const sectionId = this.querySelector('a').getAttribute('data-section');
        
        // Verificar si sectionId no es nulo
        if (sectionId) {
            document.querySelectorAll('.perfil-section').forEach(section => {
                section.style.display = 'none'; // Ocultar todas las secciones
            });
            const selectedSection = document.getElementById(sectionId);
            if (selectedSection) {
                selectedSection.style.display = 'block'; // Mostrar la sección seleccionada
            } else {
                console.error(`No se encontró la sección con ID: ${sectionId}`);
            }
        }
    });
});

async function cargarClientes() {
    const response = await fetch('https://randy939-001-site1.qtempurl.com/app/Controllers/obtener_clientes.php');
    const data = await response.json();

    if (data.status === "success") {
        const clientesContainer = document.querySelector('.clientes-container');
        clientesContainer.innerHTML = ''; // Limpiar el contenedor

        data.clientes.forEach(cliente => {
            const clienteCard = document.createElement('div');
            clienteCard.classList.add('cliente-card');
            clienteCard.innerHTML = `
                <h4>${cliente.nombre} ${cliente.apellido}</h4>
                <p>Email: ${cliente.email}</p>
                <p>Teléfono: ${cliente.telefono}</p>
                <p>Direcciones: ${cliente.direccion}</p>
                <p>Fecha de Registro: ${cliente.fecha_registro}</p>
            `;
            clientesContainer.appendChild(clienteCard);
        });
    }
}

// Llamar a la función al cargar la sección de clientes
document.querySelector('.menu-item[data-section="clientes"]').addEventListener('click', cargarClientes);