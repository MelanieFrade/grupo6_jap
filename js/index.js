if (sessionStorage.getItem("estaLogueado") !== "true") {
  alert("No has iniciado sesión, redirigiendo al login.");
  window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("autos").addEventListener("click", function () {
    localStorage.setItem("catID", 101);
    window.location = "products.html";
  });
  document.getElementById("juguetes").addEventListener("click", function () {
    localStorage.setItem("catID", 102);
    window.location = "products.html";
  });
  document.getElementById("muebles").addEventListener("click", function () {
    localStorage.setItem("catID", 103);
    window.location = "products.html";
  });
});

// Detectar si ya hay un modo guardado
const savedMode = localStorage.getItem("theme");

// Si hay un modo guardado, aplicarlo
if (savedMode) {
  document.body.setAttribute("data-bs-theme", savedMode);
  document.querySelector("#dl-icon").setAttribute(
    "class",
    savedMode === "dark" ? "bi bi-sun-fill" : "bi bi-moon-fill"
  );
}

// Funciones de cambio
const darkMode = () => {
  document.body.setAttribute("data-bs-theme", "dark");
  document.querySelector("#dl-icon").setAttribute("class", "bi bi-sun-fill");
  localStorage.setItem("theme", "dark");
};

const lightMode = () => {
  document.body.setAttribute("data-bs-theme", "light");
  document.querySelector("#dl-icon").setAttribute("class", "bi bi-moon-fill");
  localStorage.setItem("theme", "light");
};

const changeMode = () => {
  const current = document.body.getAttribute("data-bs-theme");
  current === "light" ? darkMode() : lightMode();
};

/*
const darkMode = () => {
  document.querySelector("body").setAttribute("data-bs-theme", "dark");
  document.querySelector("#dl-icon").setAttribute("class", "bi bi-sun-fill");
  localStorage.setItem("theme", "dark");
};

const lightMode = () => {
  document.querySelector("body").setAttribute("data-bs-theme", "light");
  document.querySelector("#dl-icon").setAttribute("class", "bi bi-moon-fill");
  localStorage.setItem("theme", "light");
};

const changeMode = () => {
  document.querySelector("body").getAttribute("data-bs-theme") === "light"
    ? darkMode()
    : lightMode();
};

// Al cargar la página, aplicar el último modo
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  savedTheme === "dark" ? darkMode() : lightMode();
  console.log(savedTheme);
});*/