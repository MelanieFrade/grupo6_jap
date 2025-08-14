document.getElementById("btnPrimario").addEventListener("click", function() {
   /* if(document.getElementById("username") !== '' && document.getElementById("password") !== ''){
        sesionIniciada = true;
        window.location.href = "index.html";
    }*/
    localStorage.setItem("estaLogueado", "true");
    window.location.href = "index.html"; 
    
});