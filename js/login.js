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
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(username)) {
    alert("Por favor, ingrese un correo electrónico válido.");
    return;
  }
  sessionStorage.setItem("estaLogueado", "true");
  sessionStorage.setItem("username", username);
  window.location.href = "index.html";
});

// VALIDACIÓN REGISTRO
document.getElementById("btnRegister").addEventListener("click", function (e) {
  e.preventDefault();
  let username = document.getElementById("register-username").value.trim();
  let email = document.getElementById("register-email").value.trim();
  let password = document.getElementById("register-password").value.trim();
  let confirmPassword = document.getElementById("confirm-password").value.trim();

  if (username === "" || email === "" || password === "" || confirmPassword === "") {
    alert("Por favor, complete todos los campos.");
    return;
  }
  if (username.length < 5) {
    alert("El nombre de usuario debe tener al menos 5 caracteres.");
    return;
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    alert("Por favor, ingrese un correo electrónico válido.");
    return;
  }
  if (password.length < 5) {
    alert("La contraseña debe tener al menos 5 caracteres.");
    return;
  }
  if (password !== confirmPassword) {
    alert("Las contraseñas no coinciden.");
    return;
  }
  alert("Registro exitoso. Ahora puede iniciar sesión.");
  sessionStorage.setItem("estaLogueado", "true");
  sessionStorage.setItem("username", username);
  window.location.href = "index.html";
});
