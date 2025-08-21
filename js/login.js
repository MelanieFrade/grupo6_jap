
const container = document.getElementById("container");
const registerBtn = document.querySelector(".register-btn");
const loginBtn = document.querySelector(".login-btn");

registerBtn.addEventListener("click", () => {
  container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
});

document.getElementById("btnPrimario").addEventListener("click", function() {
    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value.trim();

    if (username === "" || password === "") {
        alert("Por favor, complete todos los campos.");
        return;
    }
    if( username.length < 5 || password.length < 5) {
        alert("El nombre de usuario y la contraseña deben tener al menos 5 caracteres.");
        return;
    }
    localStorage.setItem("estaLogueado", "true");
    window.location.href = "index.html"; 
    
});

document.getElementById("btnSecundario").addEventListener("click", function() {
    window.location.href = "register.html";
});

