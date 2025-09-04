document.addEventListener("DOMContentLoaded", () => {
  let contenedorProducto = document.getElementById("detalleProducto");

  // OBTENER EL PRODUCTO SELECCIONADO
  const prodID = localStorage.getItem("productoID");

  if (!prodID) {
    contenedorProducto.innerHTML = `<div class="alert alert-warning">No se seleccionó ningún producto.</div>`;
    return;
  }

  let url = `https://japceibal.github.io/emercado-api/products/${prodID}.json`;
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Hubo un error!");
      }
      return response.json();
    })
    .then((infoProducto) => {
      // console.log(infoProducto);
      // se coloca un grid para que las imagenes queden a un lado
      // y el texto al otro
      // la idea sería implementar un carrusel con las imágenes 
      contenedorProducto.innerHTML = `
        <div class="row">
          <div class="col">
            <div class="d-flex gap-2">
                ${infoProducto.images
                  .map(
                    (img) =>
                      `<img src="${img}" alt="${infoProducto.name}" width="150"/>`
                  )
                  .join("")}
              </div>
          </div>
          <div class="col">
            <h4 class="mb-1 text-black fs-3">${infoProducto.name}</h4>
              <p>${infoProducto.description}</p>
              <p><strong>Precio:</strong> ${infoProducto.currency} ${
              infoProducto.cost
            }</p>
              <p><strong>Vendidos:</strong> ${infoProducto.soldCount}</p>
          </div>
        </div>
      `;
    })
    .catch((error) => {
      // si hay un error, se muestra en consola
      contenedorProducto.innerHTML = `<div class="alert alert-danger" role="alert">Error al cargar los productos: ${error.message}</div>`;
    });
});
