document.addEventListener("DOMContentLoaded", () => {
  let contenedorListado = document.getElementById("listado");

  // OBTENGO LA CATEGORÍA SELECCIONADA
  const catID = localStorage.getItem("catID");
  let url = `https://japceibal.github.io/emercado-api/cats_products/${catID}.json`;

  // VER COMO CAMBIAR EL FETCH PARA QUE SE INDIQUE LA CATEGORIA A MOSTRAR

  fetch(url)
    // Manejo de la respuesta del servidor
    .then((response) => {
      // promesa, para que haga cosas mientras espera que ocurra
      if (!response.ok) {
        // si la respuesta es errónea, da un mensaje
        throw new Error("Hubo un error!");
      }
      // devuelve la respuesta
      return response.json();
    })
    // se muestran los datos
    .then((producto) => {
      // console.log(producto);
      // para recorrer la listqa de productos de la categoría indicada
      const productos = producto.products;
      // console.log(productos);
      // se recorre el listado de productos y se muestra en el contenedor
      productos.forEach((producto) => {
        contenedorListado.innerHTML += `
    <div class="list-group-item zoom-hover img-zoom">
      <div class="container-fluid p-1">
          <div class="row g-3 align-items-center">
              <div class="col-3">
                <img src="${producto.image}" alt="${producto.name}" class="img-fluid rounded" style="width:100%; height:auto;" />
                </div>
                <div class="col">
                    <div class="d-flex w-100 justify-content-between mb-2">
                        <h4 class="mb-1 text-black fs-3">${producto.name}</h4>
                        <small class="text-muted">Vendidos: ${producto.soldCount}</small>
                    </div>
                    <p class="mb-1 fs-3">${producto.description}</p>
                    <p class="text-black fs-4"><strong>Precio:</strong> $${producto.cost}</p>
                </div>
            </div>
        </div>
    </div>
    `;
      });
    })
    .catch((error) => {
      // si hay un error, se muestra en consola
      contenedorListado.innerHTML = `<div class="alert alert-danger" role="alert">Error al cargar los productos: ${error.message}</div>`;
    });
});
