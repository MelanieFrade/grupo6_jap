const CART_KEY = "carrito";
const ADDR_KEY = "shippingAddress";

//const rawAddr = localStorage.getItem(ADDR_KEY);

document.addEventListener("DOMContentLoaded", function () {
  const cartItems = document.getElementById("cart-items");
  const costoTotal = document.getElementById("cart-total");
  const controlesCart = document.getElementById("controles-cart");

  //***
  const form = document.getElementById("shipping-form");

  const departamento = document.getElementById("departamento");
  const localidad = document.getElementById("localidad");
  const calle = document.getElementById("calle");
  const numero = document.getElementById("numero");
  const esquina = document.getElementById("esquina");

  const show_departamento = document.getElementById("show-departamento");
  const show_localidad = document.getElementById("show-localidad");
  const show_calle = document.getElementById("show-calle");
  const show_numero = document.getElementById("show-numero");
  const show_esquina = document.getElementById("show-esquina");

  let subtotal = 0;
  let porcentajeEnvio = 0;

  // Obtener el carrito del localStorage
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  // Función para contar las cantidades por producto
  function getProductQuantities(cartArray) {
    const quantities = {};
    cartArray.forEach((item) => {
      if (typeof item === "number" || typeof item === "string") {
        quantities[item] = (quantities[item] || 0) + 1;
      } else if (item.id) {
        quantities[item.id] = (quantities[item.id] || 0) + 1;
      }
    });
    return quantities;
  }

  const productQuantities = getProductQuantities(carrito);
  const uniqueProductIds = Object.keys(productQuantities);

  // LIMPIAR CONTENEDOR
  cartItems.innerHTML = "";
  const btn_vaciar_carrito = document.getElementById("vaciar_carrito");
  const contenedor_envio = document.getElementById("contenedor_envio");
  const contenedor_metodo_pago = document.getElementById(
    "contenedor_metodo_pago"
  );
  const contenedor_resumen_compra = document.getElementById(
    "contenedor_resumen_compra"
  );

  if (uniqueProductIds.length === 0) {
    cartItems.innerHTML =
      '<h4 class="card text-center">Tu carrito está vacío</h4>';
    btn_vaciar_carrito.style.display = "none";
    contenedor_envio.style.display = "none";
    contenedor_metodo_pago.style.display = "none";
    contenedor_resumen_compra.style.display = "none";
    costoTotal.textContent = "0";
    actualizarCostos();
    return;
  }

  const radioButtons = document.querySelectorAll('input[name="pago"]');
  const tarjetaForm = document.getElementById("tarjetaForm");
  const transferenciaForm = document.getElementById("transferenciaForm");

  radioButtons.forEach((radio) => {
    radio.addEventListener("change", function () {
      // Ocultar todos los formularios primero
      tarjetaForm.style.display = "none";
      transferenciaForm.style.display = "none";

      // Mostrar el formulario correspondiente al radio seleccionado
      if (this.value === "pagoTarjeta") {
        tarjetaForm.style.display = "block";
      } else if (this.value === "transferencia") {
        transferenciaForm.style.display = "block";
      }
    });
  });

  // Obtener producto
  function fetchProductInfo(productId) {
    let url = `https://japceibal.github.io/emercado-api/products/${productId}.json`;
    return fetch(url).then((response) => {
      if (!response.ok) {
        throw new Error("Error al cargar el producto");
      }
      return response.json();
    });
  }

  // Crear tarjeta
  function createProductCard(productInfo, quantity) {
    return `
      <div class="card mb-3" id="product-${productInfo.id}">
        <div class="row g-0 align-items-center">
          <div class="col-12 col-md-4 col-img">
            <img src="${
              productInfo.images[0]
            }" class="img-fluid rounded-start product-image" alt="${productInfo.name}">
          </div>
          <div class="col-12 col-md-8">
            <div class="card-body">
              <h5 class="card-title">${productInfo.name}</h5>
              <p class="card-text text-muted">${
                productInfo.description || ""
              }</p>
              <p class="card-text">
                Precio unitario: <strong>${
                  productInfo.currency
                } ${productInfo.cost}</strong>
              </p>
              <div class="d-flex justify-content-between align-items-center flex-wrap">
                <div class="mb-2">
                  <span class="badge bg-primary">Cantidad: ${quantity}</span>
                  <button class="btn btn-sm btn-secondary ms-1" onclick="addOneToCart(${
                    productInfo.id
                  })">+</button>
                  <button class="btn btn-sm btn-secondary ms-2" onclick="removeOneFromCart(${
                    productInfo.id
                  })">-</button>
                </div>
                <div>
                  <p class="card-text mb-0">
                    <strong class="subtotal-item">${
                      productInfo.currency
                    } ${productInfo.cost * quantity}</strong>
                  </p>
                </div>
              </div>
              <button class="btn btn-danger btn-sm mt-2" onclick="removeFromCart(${
                productInfo.id
              })">
                <i class="fas fa-trash"></i> Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  async function processCartItems() {
    const productPromises = uniqueProductIds.map((productId) =>
      fetchProductInfo(productId).then((productInfo) => ({
        productInfo,
        quantity: productQuantities[productId],
      }))
    );

    try {
      const productsData = await Promise.all(productPromises);

      subtotal = 0;
      cartItems.innerHTML = "";

      productsData.forEach(({ productInfo, quantity }) => {
        // PASAR USD → UYU
        let precioUnidad = productInfo.cost;
        if (productInfo.currency === "USD") {
          precioUnidad = precioUnidad * 40;
        }

        subtotal += precioUnidad * quantity;

        cartItems.innerHTML += createProductCard(productInfo, quantity);
      });

      costoTotal.textContent = `UYU ${subtotal.toFixed(2)}`;
      actualizarCostos();
    } catch (error) {
      console.error("Error al cargar los productos:", error);
      cartItems.innerHTML =
        '<p class="text-danger">Error al cargar los productos del carrito</p>';
    }
  }

  processCartItems();

  // Calcula costos
  function actualizarCostos() {
    const costoEnvioText = document.getElementById("resumen-envio");
    const totalText = document.getElementById("resumen-total");

    let costoEnvio = subtotal * porcentajeEnvio;
    let total = subtotal + costoEnvio;

    costoEnvioText.textContent = `Costo de envío: UYU ${costoEnvio.toFixed(2)}`;
    totalText.textContent = `Total a pagar: UYU ${total.toFixed(2)}`;
  }

  // Cambio de envío
  document.querySelectorAll('input[name="envio"]').forEach((input) => {
    input.addEventListener("change", function () {
      if (this.value === "premium") porcentajeEnvio = 0.15;
      if (this.value === "express") porcentajeEnvio = 0.07;
      if (this.value === "standard") porcentajeEnvio = 0.05;
      actualizarCostos();
    });
  });
  cargarDireccion();

  // INGRESAR DIRECCIÓN

  function cargarDireccion() {
    const rawAddr = localStorage.getItem(ADDR_KEY);
    if (!rawAddr) {
      if (show_departamento)
        show_departamento.querySelector("span").textContent = "—";
      if (show_localidad)
        show_localidad.querySelector("span").textContent = "—";
      if (show_calle) show_calle.querySelector("span").textContent = "—";
      if (show_numero) show_numero.querySelector("span").textContent = "—";
      if (show_esquina) show_esquina.querySelector("span").textContent = "—";
      return;
    }

    try {
      const addr = JSON.parse(rawAddr);
      if (show_departamento)
        show_departamento.querySelector("span").textContent =
          addr.departamento || "—";
      if (show_localidad)
        show_localidad.querySelector("span").textContent =
          addr.localidad || "—";
      if (show_calle)
        show_calle.querySelector("span").textContent = addr.calle || "—";
      if (show_numero)
        show_numero.querySelector("span").textContent = addr.numero || "—";
      if (show_esquina)
        show_esquina.querySelector("span").textContent = addr.esquina || "—";
    } catch (err) {
      console.error("Error parseando dirección:", err);
    }
  }

  // Rellena modal inputs con la dirección guardada
  function fillModalWithAddress() {
    const rawAddr = localStorage.getItem(ADDR_KEY);
    if (!rawAddr) return;
    try {
      const addr = JSON.parse(rawAddr);
      if (departamento) departamento.value = addr.departamento || "";
      if (localidad) localidad.value = addr.localidad || "";
      if (calle) calle.value = addr.calle || "";
      if (numero) numero.value = addr.numero || "";
      if (esquina) esquina.value = addr.esquina || "";
    } catch (err) {
      console.error("Error parseando dirección:", err);
    }
  }

  // Completar modal con datos ya cargados, para poder modificarlos
  const modalEl = document.getElementById("direccionModal");
  if (modalEl) {
    modalEl.addEventListener("show.bs.modal", fillModalWithAddress);
  }

  // Guardar datos y actualizar vista
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const newAddress = {
        departamento: departamento ? departamento.value.trim() : "",
        localidad: localidad ? localidad.value.trim() : "",
        calle: calle ? calle.value.trim() : "",
        numero: numero ? numero.value.trim() : "",
        esquina: esquina ? esquina.value.trim() : "",
      };

      if (
        !newAddress.departamento ||
        !newAddress.localidad ||
        !newAddress.calle
      ) {
        alert("Completá Departamento, Localidad y Calle.");
        return;
      }

      localStorage.setItem(ADDR_KEY, JSON.stringify(newAddress));
      // cerrar modal
      const bsModal = bootstrap.Modal.getInstance(modalEl);
      if (bsModal) bsModal.hide();

      cargarDireccion();
    });
  }
  document
    .getElementById("checkout-btn")
    ?.addEventListener("click", limpiarCarrito);
});

// FUNCIONES MODIFICAR CARRITO

function removeFromCart(productId) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carrito = carrito.filter((item) => item != productId);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarVista();
}

function removeOneFromCart(productId) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  for (let i = 0; i < carrito.length; i++) {
    const item = carrito[i];
    if (item == productId || item?.id == productId) {
      carrito.splice(i, 1);
      break;
    }
  }
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarVista();
}

function addOneToCart(productId) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carrito.push(productId);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarVista();
}

function clearCart() {
  localStorage.removeItem("carrito");
  actualizarVista();
}

// Re-render
function actualizarVista() {
  document.getElementById("cart-items").innerHTML = "";
  document.getElementById("cart-total").textContent = "";
  document.dispatchEvent(new Event("DOMContentLoaded"));
}

function limpiarCarrito() {
  //Deberá estar seleccionada la forma de envío.
  const envioSel = document.querySelector('input[name="envio"]:checked');
  if (!envioSel) {
    alert("Debes seleccionar una forma de envío.");
    return;
  }

  //Los campos asociados a la dirección no podrán estar vacíos.
  const rawAddr = localStorage.getItem(ADDR_KEY);
  if (!rawAddr) {
    alert("Debes ingresar tu dirección de envío.");
    return;
  }
  let addr;
  try {
    addr = JSON.parse(rawAddr);
  } catch (e) {
    alert("Dirección errónea. Volvé a ingresarla.");
    return;
  }
  if (
    !addr.departamento ||
    !addr.localidad ||
    !addr.calle ||
    !addr.numero ||
    !addr.esquina
  ) {
    alert(
      "Los campos de dirección (departamento, localidad, calle, numero, esquina) no pueden estar vacíos."
    );
    return;
  }

  //La cantidad para cada producto deberá estar definida y ser mayor a 0.
  //si el carrito está vacío, no se muestran los dampos para la compra
  // Línea 46: LIMPIAR CONTENEDOR

  //Deberá haberse seleccionado una forma de pago.
  const pagoSel = document.querySelector('input[name="pago"]:checked');
  if (!pagoSel) {
    alert("Debes seleccionar un método de pago.");
    return;
  }

  //Los campos para la forma de pago seleccionada no podrán estar vacíos.
  const pagoVal = pagoSel.value;
  if (pagoVal === "pagoTarjeta") {
    const numeroTarjeta = document.getElementById("card-number");
    const vencimientoTarjeta = document.getElementById("card-expiry");
    const codigoTarjeta = document.getElementById("card-cvc");
    if (!numeroTarjeta || !vencimientoTarjeta || !codigoTarjeta) {
      alert("Faltan campos de tarjeta en el HTML.");
      return;
    }
    if (
      !numeroTarjeta.value.trim() ||
      !vencimientoTarjeta.value.trim() ||
      !codigoTarjeta.value.trim()
    ) {
      alert("Completá los datos de la tarjeta (número, vencimiento, codigo).");
      return;
    }
  } else if (pagoVal === "transferencia") {
    const bankAccount = document.getElementById("bank-account");
    if (!bankAccount) {
      alert("Falta el campo de transferencia.");
      return;
    }
    if (!bankAccount.value.trim()) {
      alert("Completá el número de cuenta para la transferencia.");
      return;
    }
  }

  // ELIMINAR DATOS DE COMPRA
  localStorage.removeItem(CART_KEY);
  localStorage.removeItem(ADDR_KEY);
  alert("Compra realizada con exito! Gracias");
  window.location.href = "index.html";
}
