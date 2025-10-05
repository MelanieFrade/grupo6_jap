document.addEventListener("DOMContentLoaded", () => {
  let contenedorProducto = document.getElementById("detalleProducto");

  // OBTENER EL PRODUCTO SELECCIONADO
  const prodID = localStorage.getItem("productoID");

  if (!prodID) {
    contenedorProducto.innerHTML = `<div class="alert alert-warning">No se seleccionó ningún producto.</div>`;
    return;
  }
  // MOSTRAR LOS DETALLES DEL PRODUCTO SELECCIONADO
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
        <div id="cardProducto" class="card-base row g-3 flex-column flex-lg-row">
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
            <h4 class="mb-1 text-black fs-3"><strong>${
              infoProducto.name
            }</strong></h4>
              <p>${infoProducto.description}</p>
              <p><strong>${infoProducto.currency} ${
        infoProducto.cost
      } </strong></p>
              <p><strong>Categoría:</strong> ${infoProducto.category}</p>
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
      productosRelacionados(infoProducto);
      cargarComentarios(infoProducto.id);
    })
    .catch((error) => {
      // si hay un error, se muestra en consola
      contenedorProducto.innerHTML = `<div class="alert alert-danger" role="alert">Error al cargar los productos: ${error.message}</div>`;
    });

  // MOSTRAR PRODUCTOS RELACIONADOS
  function productosRelacionados(producto) {
    let listRelatedProduct = document.getElementById("relatedProducts-list");
    listRelatedProduct.innerHTML = "";

    producto.relatedProducts.forEach((relatedProduct) => {
      const card = document.createElement("div");
      card.className = "col-12 col-sm-6 col-md-4 col-lg-3 mb-4";

      card.innerHTML = `
      <div id="card-related"  class="card-base card h-100">
          <a href="#" class="text-decoration-none">
            <img src="${relatedProduct.image}" class="card-img-top" alt="${relatedProduct.name}">
            <div class="card-body">
              <h5 class="card-title mb-0 ">${relatedProduct.name}</h5>
            </div>
          </a>
        </div>
      `;

      // Para redirigir a la pantalla del producto relacionado seleccionado
      card.querySelector("a").addEventListener("click", (e) => {
        e.preventDefault();
        // guardo el ID del producto indicado en memoria local
        localStorage.setItem("productoID", relatedProduct.id);
        // redirijo la busqueda al product-info para mostrarlo
        window.location.href = "product-info.html";
      });

      // creo la card y la agrego al dom
      listRelatedProduct.appendChild(card);
    });
  }

  // CARGAR COMENTARIO
  const stars = document.querySelectorAll("#ratingStars i");
  const commentInput = document.getElementById("comment");
  const submitButton = document.getElementById("submitReview");
  const ratingsList = document.getElementById("ratings-list");

  let selectedRating = 0;

  // Cambiar estrellas al hacer clic
  stars.forEach((star) => {
    star.addEventListener("click", () => {
      selectedRating = parseInt(star.dataset.value);
      stars.forEach((s) => {
        if (parseInt(s.dataset.value) <= selectedRating) {
          s.classList.remove("bi-star");
          s.classList.add("bi-star-fill");
        } else {
          s.classList.remove("bi-star-fill");
          s.classList.add("bi-star");
        }
      });
    });
  });

  // Enviar reseña y agregarla al contenedor
  submitButton.addEventListener("click", () => {
    const comment = commentInput.value.trim();
    if (selectedRating === 0 || comment === "") return;

    const div = document.createElement("div");
    div.classList.add("card-base", "card-comment");
    div.innerHTML = `
      <strong>Tú</strong> 
      <p class="mb-0">${"⭐".repeat(selectedRating)}${"☆".repeat(5 - selectedRating)}</p>
      <p class="mb-0">${comment}</p>
    `;
    ratingsList.appendChild(div);

    // Reiniciar formulario
    selectedRating = 0;
    commentInput.value = "";
    stars.forEach((s) => {
      s.classList.remove("bi-star-fill");
      s.classList.add("bi-star");
    });
  });

  // MOSTRAR LOS COMENTAROS DEL PRODUCTO
  function cargarComentarios(productoID) {
    const urlComentarios = `https://japceibal.github.io/emercado-api/products_comments/${productoID}.json`;
    fetch(urlComentarios)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Hubo un error al cargar los comentarios");
        }
        return response.json();
      })
      .then((comentarios) => {
        const lista = document.getElementById("ratings-list");
        lista.innerHTML = "";
        comentarios.forEach((comentario) => {
          const item = document.createElement("div");
          //item.classList.add("list-group-item");
          item.innerHTML = `
          <div class="card-base card-comment"> 
            <div class="d-flex w-100 justify-content-between">
            <strong> ${comentario.user}</strong>
            <span>${new Date(comentario.dateTime).toLocaleString()}</span>
            </div>
            <div>${"⭐".repeat(comentario.score)}${"☆".repeat(
            5 - comentario.score
          )}</div>
            <p class="mb-0">${comentario.description}</p>
          </div>
        `;
          lista.appendChild(item);
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }
});
