document.addEventListener("DOMContentLoaded", () => {
     const nombreUsuario = sessionStorage.getItem("username");
      if (nombreUsuario) {
        document.getElementById("user-info").textContent = nombreUsuario;
      }

    });



