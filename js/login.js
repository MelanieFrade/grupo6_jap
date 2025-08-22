const container = document.getElementById("container");
const registerBtn = document.querySelector(".register-btn");
const loginBtn = document.querySelector(".login-btn");

// PARA EL CAMBIO EN LA PANTALLA DE LOGIN A REGISTRO
registerBtn.addEventListener("click", () => {
  container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
});

// VALIDACIÓN LOGIN
document.getElementById("btnLogin").addEventListener("click", function (e) {
  e.preventDefault();
  let username = document.getElementById("login-username").value.trim();
  let password = document.getElementById("login-password").value.trim();
  console.log(username + password);
  if (username === "" || password === "") {
    alert("Por favor, complete todos los campos.");
    return;
  }
  if (username.length < 5 || password.length < 5) {
    alert(
      "El nombre de usuario y la contraseña deben tener al menos 5 caracteres."
    );
    return;
  }
  sessionStorage.setItem("estaLogueado", "true");
  window.location.href = "index.html";
});
