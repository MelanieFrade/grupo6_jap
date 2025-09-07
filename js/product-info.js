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
      contenedorProducto.innerHTML = `
        <div id="cardProducto" class="row g-3 flex-column flex-lg-row">
          <div class="col">
            <div class="d-flex gap-2 justify-content-center">
              <div class="text-center"> 
                
                <!-- Imagen principal -->
                <div class="mb-3">
                  <img id="imgPrincipal" src="${infoProducto.images[0]}" 
                    alt="${infoProducto.name}" 
                    class="img-fluid rounded border" 
                  />
                </div>

                <!-- Miniaturas -->
                <div id="carrusel" class="d-flex justify-content-center gap-2 flex-wrap">
                  ${infoProducto.images
                    .map(
                      (img, index) => `
                      <img src="${img}" 
                        alt="thumb ${index}" 
                        class="img-thumbnail thumb" 
                        data-img="${img}"
                      />`
                    )
                    .join("")}
                </div>
              </div>
            </div>
          </div>
          <div class="col flex">
            <h4 class="mb-1 text-black fs-3"><strong>${infoProducto.name}</strong></h4>
              <p>${infoProducto.description}</p>
              <p><strong>${infoProducto.currency} ${
        infoProducto.cost
      }</strong></p>
              <p><strong>Vendidos:</strong> ${infoProducto.soldCount}</p>
          </div>
        </div>
      `;
      // PARA EL MANEJO DEL CARRUSEL
      const imgPrincipal = document.getElementById("imgPrincipal");
      const imgChicas = document.querySelectorAll("#carrusel .thumb");

      imgChicas.forEach((thumb) => {
        thumb.addEventListener("click", () => {
          // al clickear la imagen, cambia la principal
          imgPrincipal.src = thumb.dataset.img;

          // resaltar la miniatura seleccionada
          imgChicas.forEach((t) => t.classList.remove("border-primary"));
          thumb.classList.add("border-primary");
        });
      });
    })
    .catch((error) => {
      // si hay un error, se muestra en consola
      contenedorProducto.innerHTML = `<div class="alert alert-danger" role="alert">Error al cargar los productos: ${error.message}</div>`;
    });
});
