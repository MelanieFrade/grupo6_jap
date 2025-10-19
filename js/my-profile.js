
document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "datosPerfil";
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // límite efectivo en bytes (2MB)
  const MAX_DIMENSION = 1024; 
  const QUALITY_STEP = 0.85; 

  // DOM
  const profileUpload = document.getElementById("profile-upload");
  const profileImg = document.getElementById("profile-img");
  const profileForm = document.querySelector(".profile-form"); 
  const inputNombre = document.getElementById("nombre");
  const inputApellido = document.getElementById("apellido");
  const inputEmail = document.getElementById("email");
  const inputTelefono = document.getElementById("telefono");
  const nombrePerfilSpan = document.getElementById("nombre-perfil");
  const navUserSpan = document.getElementById("user-info"); 

  // --- Cargar datos desde localStorage ---
  function cargarDatosPerfil() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);

      if (inputNombre && data.nombre) inputNombre.value = data.nombre;
      if (inputApellido && data.apellido) inputApellido.value = data.apellido;
      if (inputEmail && data.email) inputEmail.value = data.email;
      if (inputTelefono && data.telefono) inputTelefono.value = data.telefono;
      if (profileImg && data.imageDataUrl) profileImg.src = data.imageDataUrl;

      if (nombrePerfilSpan) nombrePerfilSpan.textContent = data.nombre || "";
      if (navUserSpan && data.nombre) navUserSpan.textContent = data.nombre;
      if (data.nombre) sessionStorage.setItem("username", data.nombre);
    } catch (err) {
      console.error("Error cargando datosPerfil:", err);
    }
  }

  
  function guardarPerfilLocalStorage({ nombre, apellido, email, telefono, imageDataUrl }) {
    try {
      const payload = {
        nombre: nombre || "",
        apellido: apellido || "",
        email: email || "",
        telefono: telefono || "",
        imageDataUrl: imageDataUrl || ""
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));

      if (nombrePerfilSpan) nombrePerfilSpan.textContent = payload.nombre;
      if (navUserSpan && payload.nombre) navUserSpan.textContent = payload.nombre;
      if (payload.nombre) sessionStorage.setItem("username", payload.nombre);
    } catch (err) {
      console.error("Error guardando datosPerfil:", err);
    }
  }

  // --- Compresión de imagen usando canvas ---
  // devuelve Promise<string|null> con dataURL o null en error
  function compressImageFile(file) {
    return new Promise((resolve) => {
      if (!file) return resolve(null);

      const reader = new FileReader();
      reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
          // calcular tamaño objetivo manteniendo aspect ratio
          let { width, height } = img;
          const maxDim = Math.max(width, height);
          let targetWidth = width;
          let targetHeight = height;
          if (maxDim > MAX_DIMENSION) {
            const scale = MAX_DIMENSION / maxDim;
            targetWidth = Math.round(width * scale);
            targetHeight = Math.round(height * scale);
          }

          const canvas = document.createElement("canvas");
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

          // intentar con calidad inicial y reducir si supera el límite
          let quality = QUALITY_STEP;
          let dataUrl = canvas.toDataURL("image/jpeg", quality);

          // si sigue muy grande, disminuir calidad progresivamente
          function tryReduce() {
            // si dataUrl demasiado grande y quality > 0.4, reducir
            const approxSize = Math.round((dataUrl.length - "data:image/jpeg;base64,".length) * 3 / 4);
            if (approxSize > MAX_FILE_SIZE && quality > 0.4) {
              quality -= 0.15;
              dataUrl = canvas.toDataURL("image/jpeg", Math.max(0.1, quality));
              tryReduce();
            } else {
              resolve(dataUrl);
            }
          }
          tryReduce();
        };
        img.onerror = function () {
          console.error("Error cargando imagen para compresión.");
          resolve(null);
        };
        img.src = e.target.result;
      };
      reader.onerror = function () {
        console.error("Error leyendo archivo (FileReader).");
        resolve(null);
      };
      reader.readAsDataURL(file);
    });
  }

  // --- Manejar subida de archivo ---
  async function handleImageFile(file) {
    if (!file) return null;

    // Si el archivo ya supera un límite gordo (ej 10MB) lo rechazamos rápido
    if (file.size > 10 * 1024 * 1024) {
      alert("Archivo muy grande. Elegí una imagen más chica.");
      return null;
    }

    // Comprimir / redimensionar
    const compressedDataUrl = await compressImageFile(file);
    if (!compressedDataUrl) {
      alert("No se pudo procesar la imagen.");
      return null;
    }

    // comprobar tamaño final aproximado
    const approxSize = Math.round((compressedDataUrl.length - compressedDataUrl.indexOf(",") - 1) * 3 / 4);
    if (approxSize > MAX_FILE_SIZE) {
      const accept = confirm("La imagen comprimida sigue siendo >2MB. Queres guardarla igual? (puede llenar localStorage)");
      if (!accept) return null;
    }

    // mostrar preview inmediato
    if (profileImg) profileImg.src = compressedDataUrl;
    return compressedDataUrl;
  }

  // listener input file
  if (profileUpload) {
    profileUpload.addEventListener("change", async (ev) => {
      const file = ev.target.files && ev.target.files[0];
      const dataUrl = await handleImageFile(file);
      if (!dataUrl) return;
      // guardar perfil con la img nueva, manteniendo otros campos actuales
      guardarPerfilLocalStorage({
        nombre: inputNombre ? inputNombre.value.trim() : "",
        apellido: inputApellido ? inputApellido.value.trim() : "",
        email: inputEmail ? inputEmail.value.trim() : "",
        telefono: inputTelefono ? inputTelefono.value.trim() : "",
        imageDataUrl: dataUrl
      });
    });
  }

  // listener submit del form
  if (profileForm) {
    profileForm.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const currentImg = profileImg ? profileImg.src : "";
      guardarPerfilLocalStorage({
        nombre: inputNombre ? inputNombre.value.trim() : "",
        apellido: inputApellido ? inputApellido.value.trim() : "",
        email: inputEmail ? inputEmail.value.trim() : "",
        telefono: inputTelefono ? inputTelefono.value.trim() : "",
        imageDataUrl: currentImg
      });


      const btn = profileForm.querySelector('button[type="submit"]');
      if (btn) {
        const old = btn.textContent;
        btn.disabled = true;
        btn.textContent = "Guardando...";
        setTimeout(() => {
          btn.disabled = false;
          btn.textContent = old;
          alert("Datos guardados en localStorage.");
        }, 500);
      } else {
        alert("Datos guardados en localStorage.");
      }
    });
  }

  cargarDatosPerfil();

  window.clearProfileData = function () {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem("username");
    alert("Datos borrados. Se recargará la página.");
    location.reload();
  };
});

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("email").value = sessionStorage.getItem("username");
})
