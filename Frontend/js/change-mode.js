document.addEventListener("DOMContentLoaded", () => {
  // Detectar si ya hay un modo guardado
  const savedMode = localStorage.getItem("theme") || "light";
  document.body.setAttribute("data-bs-theme", savedMode);
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
  // cambia la etiqueta en el body
  document.body.setAttribute("data-bs-theme", "dark");
  // modifica el botón de cambio de modo (sol / luna)
  document.querySelector("#dl-icon").setAttribute("class", "bi bi-moon-fill");
  // carga el tema indicado en el localStor para que se guarde al cerrar
  localStorage.setItem("theme", "dark");
};

function lightMode() {
  document.body.setAttribute("data-bs-theme", "light");
  document.querySelector("#dl-icon").setAttribute("class", "bi bi-sun-fill");
  localStorage.setItem("theme", "light");
};

function changeMode() {
  // obtiene el tema actual del sitio
  const current = document.body.getAttribute("data-bs-theme");
  // si es claro cambia a oscuro o a la inversa
  current === "light" ? darkMode() : lightMode();
  /*const modo = localStorage.getItem("theme");
  const prodTotal = document.getElementById("prodTotal");
  if (modo === "dark") {
    prodTotal.classList.add("bg-warning");
    prodTotal.classList.remove("bg-danger");
  }else if(modo === "light"){
    prodTotal.classList.add("bg-danger");
    prodTotal.classList.remove("bg-warning"); 
  }*/
};

