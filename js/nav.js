document.addEventListener("DOMContentLoaded", () => {
  fetch("nav.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("nav").innerHTML = data;

      const nombreUsuario = sessionStorage.getItem("username");
      if (nombreUsuario) {
        document.getElementById("user-info").textContent = nombreUsuario;
      }
      
const currentPage = window.location.pathname.split("/").pop(); // ej. "products.html"

      // Marcar link activo
      document.querySelectorAll("#nav .nav-link").forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === currentPage) {
          link.classList.add("active");
        }
      });


const ruta = window.location.pathname;
if (!ruta.includes("products.html") && !ruta.includes("categories.html")) return;

 const buscador = document.getElementById('buscador');
      if (!buscador) return;

buscador.style.display = "block";
buscador.addEventListener('input', () => {
        const texto = buscador.value.toLowerCase();
        const tarjetas = document.querySelectorAll('.list-group-item');

        tarjetas.forEach(tarjeta => {
          const contenido = tarjeta.textContent.toLowerCase();
          tarjeta.style.display = contenido.includes(texto) ? '' : 'none';
        });
      });
    });
});