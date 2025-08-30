document.addEventListener("DOMContentLoaded", () => {
  fetch("nav.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("nav").innerHTML = data;

      const nombreUsuario = sessionStorage.getItem("username");
      if (nombreUsuario) {
        document.getElementById("user-info").textContent = nombreUsuario;
      }
    });
});