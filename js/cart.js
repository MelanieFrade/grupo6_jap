document.addEventListener("DOMContentLoaded", function () {
  const cartItems = document.getElementById("cart-items");
  const prodTotal = document.getElementById("prodTotal");
  const costoTotal = document.getElementById("cart-total");

  // Obtener el carrito del localStorage
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  // Función para contar las cantidades por producto
  function getProductQuantities(cartArray) {
    const quantities = {};

    cartArray.forEach((item) => {
      // Si el item es directamente un ID (número o string)
      if (typeof item === "number" || typeof item === "string") {
        quantities[item] = (quantities[item] || 0) + 1;
      } else if (item.id) {
        quantities[item.id] = (quantities[item.id] || 0) + 1;
      }
    });

    return quantities;
  }

  // Obtener productos únicos con sus cantidades
  const productQuantities = getProductQuantities(carrito);
  const uniqueProductIds = Object.keys(productQuantities);

  // Variables para calcular totales
  let totalProductos = 0;
  let totalPrecio = 0;

  // Limpiar el contenedor antes de agregar items
  cartItems.innerHTML = "";

  if (uniqueProductIds.length === 0) {
    cartItems.innerHTML = '<h4 class="card text-center">Tu carrito está vacío</h4>';

    //prodTotal.textContent = "0";
    costoTotal.textContent = " 0";
    return;
  }

  // Función para obtener información de un producto
  function fetchProductInfo(productId) {
    let url = `https://japceibal.github.io/emercado-api/products/${productId}.json`;
    return fetch(url).then((response) => {
      if (!response.ok) {
        throw new Error("Error al cargar el producto");
      }
      return response.json();
    });
  }

  // Función para crear la tarjeta del producto
  function createProductCard(productInfo, quantity) {
    const subtotal = productInfo.cost * quantity;

    return `
            <div class="card mb-3" id="product-${productInfo.id}">
                <div class="row g-0">
                    <div class="col col-img">
                        <img src="${
                          productInfo.images[0]
                        }" class="img-fluid rounded-start" alt="${productInfo.name}" style="height: 150px; object-fit: cover;">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">${productInfo.name}</h5>
                            <p class="card-text text-muted">${
                              productInfo.description || ""
                            }</p>
                            <p class="card-text">Precio unitario: <strong>${
                              productInfo.currency
                            } ${productInfo.cost}</strong></p>
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="badge bg-primary">Cantidad: ${quantity}</span>
                                    <button class="btn btn-sm btn-secondary ms-1" onclick="addOneToCart(${
                                      productInfo.id
                                    })">+</button>
                                    <button class="btn btn-sm btn-secondary ms-2" onclick="removeOneFromCart(${
                                      productInfo.id
                                    })">-</button>   
                                </div>
                                <div>
                                    <p class="card-text mb-0"><strong>Subtotal: ${
                                      productInfo.currency
                                    } ${subtotal}</strong></p>
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
      fetchProductInfo(productId).then((productInfo) => {
        return {
          productInfo: productInfo,
          quantity: productQuantities[productId],
        };
      })
    );

    try {
      const productsData = await Promise.all(productPromises);

      // Generar las tarjetas y calcular totales
      productsData.forEach(({ productInfo, quantity }) => {
        cartItems.innerHTML += createProductCard(productInfo, quantity);
        totalProductos += quantity;
        totalPrecio += productInfo.cost * quantity;
      });

      costoTotal.textContent = `USD ${totalPrecio.toFixed(2)}`;
    } catch (error) {
      console.error("Error al cargar los productos:", error);
      cartItems.innerHTML =
        '<p class="text-danger">Error al cargar los productos del carrito</p>';
    }
  }

  processCartItems();
});

// Función para eliminar producto del carrito
function removeFromCart(productId) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  carrito = carrito.filter((item) => item != productId);

  /*carrito = carrito.filter(item => {
        if (typeof item === 'number' || typeof item === 'string') {
            return item != productId;
        } else if (item.productId) {
            return item.productId != productId;
        } else if (item.id) {
            return item.id != productId;
        }
        return true;
    });*/

  localStorage.setItem("carrito", JSON.stringify(carrito));
  //location.reload();
  actualizarVista();
}

// Función para eliminar solo una unidad de un producto
function removeOneFromCart(productId) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const index = carrito.indexOf(productId);
  if (index !== -1) carrito.splice(index, 1);

  // Encontrar la primera ocurrencia del producto y eliminarla
  /*for (let i = 0; i < carrito.length; i++) {
        const item = carrito[i];
        
        if ((typeof item === 'number' || typeof item === 'string') && item == productId) {
            carrito.splice(i, 1);
            break;
        } else if (item.productId && item.productId == productId) {
            carrito.splice(i, 1);
            break;
        } else if (item.id && item.id == productId) {
            carrito.splice(i, 1);
            break;
        }
    }*/

  localStorage.setItem("carrito", JSON.stringify(carrito));
  //location.reload();
  actualizarVista();
}
// Función para agregar una unidad de un producto al carrito
function addOneToCart(productId) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  // Agregar el producto al carrito (una unidad más)
  carrito.push(productId);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  //location.reload();
  actualizarVista();
}

// Función para vaciar todo el carrito
function clearCart() {
  localStorage.removeItem("carrito");
  //location.reload();
  actualizarVista();
}
// Función para actualizar la vista sin recargar el sitio
function actualizarVista() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const badge = document.getElementById("prodTotal");
  if (badge) badge.textContent = carrito.length;

  // volver a renderizar los productos
  document.getElementById("cart-items").innerHTML = "";
  document.getElementById("cart-total").textContent = "";
  document.dispatchEvent(new Event("DOMContentLoaded")); // vuelve a ejecutar el código principal
}
