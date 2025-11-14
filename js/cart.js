document.addEventListener("DOMContentLoaded", function () {
  const cartItems = document.getElementById("cart-items");
  const costoTotal = document.getElementById("cart-total");

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

  // Limpiar contenedor
  cartItems.innerHTML = "";

  if (uniqueProductIds.length === 0) {
    cartItems.innerHTML = '<h4 class="card text-center">Tu carrito está vacío</h4>';
    costoTotal.textContent = "0";
    actualizarCostos();
    return;
  }

  const radioButtons = document.querySelectorAll('input[name="pago"]');
  const tarjetaForm = document.getElementById('tarjetaForm');
  const transferenciaForm = document.getElementById('transferenciaForm');

  radioButtons.forEach(radio => {
      radio.addEventListener('change', function() {
          // Ocultar todos los formularios primero
           tarjetaForm.style.display = 'none';
          transferenciaForm.style.display = 'none';

          // Mostrar el formulario correspondiente al radio seleccionado
          if (this.value === 'pagoTarjeta') {
               tarjetaForm.style.display = 'block';
          } else if (this.value === 'transferencia') {
              transferenciaForm.style.display = 'block';
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
            <img src="${productInfo.images[0]}" class="img-fluid rounded-start product-image" alt="${productInfo.name}">
          </div>
          <div class="col-12 col-md-8">
            <div class="card-body">
              <h5 class="card-title">${productInfo.name}</h5>
              <p class="card-text text-muted">${productInfo.description || ""}</p>
              <p class="card-text">
                Precio unitario: <strong>${productInfo.currency} ${productInfo.cost}</strong>
              </p>
              <div class="d-flex justify-content-between align-items-center flex-wrap">
                <div class="mb-2">
                  <span class="badge bg-primary">Cantidad: ${quantity}</span>
                  <button class="btn btn-sm btn-secondary ms-1" onclick="addOneToCart(${productInfo.id})">+</button>
                  <button class="btn btn-sm btn-secondary ms-2" onclick="removeOneFromCart(${productInfo.id})">-</button>
                </div>
                <div>
                  <p class="card-text mb-0">
                    <strong class="subtotal-item">${productInfo.currency} ${productInfo.cost * quantity}</strong>
                  </p>
                </div>
              </div>
              <button class="btn btn-danger btn-sm mt-2" onclick="removeFromCart(${productInfo.id})">
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
      cartItems.innerHTML = '<p class="text-danger">Error al cargar los productos del carrito</p>';
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
  document.querySelectorAll('input[name="envio"]').forEach(input => {
    input.addEventListener("change", function () {
      if (this.value === "premium") porcentajeEnvio = 0.15;
      if (this.value === "express") porcentajeEnvio = 0.07;
      if (this.value === "standard") porcentajeEnvio = 0.05;
      actualizarCostos();
    });
  });
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
