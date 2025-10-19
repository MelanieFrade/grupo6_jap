document.addEventListener("DOMContentLoaded", () => {
  // Detectar si ya hay un modo guardado
  const savedMode = localStorage.getItem("theme") || "light";
  document.body.setAttribute("data-bs-theme", savedMode);
  // Actualizar icono sol / luna luego de cargado el nav
  // Si hay un modo guardado, aplicarlo
  if (savedMode) {
    document.body.setAttribute("data-bs-theme", savedMode);
    document
      .querySelector("#dl-icon")
      .setAttribute(
        "class",
        savedMode === "dark" ? "bi bi-sun-fill" : "bi bi-moon-fill"
      );
  }

});

// Funciones de cambio
function darkMode() {
  document.body.setAttribute("data-bs-theme", "dark");
  document.querySelector("#dl-icon").setAttribute("class", "bi bi-moon-fill");
  localStorage.setItem("theme", "dark");
};

function lightMode() {
  document.body.setAttribute("data-bs-theme", "light");
  document.querySelector("#dl-icon").setAttribute("class", "bi bi-sun-fill");
  localStorage.setItem("theme", "light");
};

function changeMode() {
  const current = document.body.getAttribute("data-bs-theme");
  current === "light" ? darkMode() : lightMode();
};

