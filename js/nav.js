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

      document.querySelectorAll("#nav .nav-link").forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === currentPage) {
          link.classList.add("active");
        }
      });
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
function actualizarTema() {
  const modo = localStorage.getItem("theme");
  const prodTotal = document.getElementById("prodTotal");
  
  if (prodTotal) {
    if (modo === "dark") {
      prodTotal.classList.add("bg-warning");
      prodTotal.classList.remove("bg-danger");
    } else if (modo === "light") {
      prodTotal.classList.add("bg-danger");
      prodTotal.classList.remove("bg-warning");
    }
  }
}

actualizarTema();
setInterval(actualizarTema, 10);