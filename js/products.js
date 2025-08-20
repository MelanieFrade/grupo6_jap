document.addEventListener("DOMContentLoaded", () => {
  let contenedorListado = document.getElementById("listado");

  // VER COMO CAMBIAR EL FETCH PARA QUE SE INDIQUE LA CATEGORIA A MOSTRAR

  fetch("https://japceibal.github.io/emercado-api/cats_products/101.json")
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
        <div class="product-item d-flex  align-items-center mb-3 p-3 colorcete rounded shadow-sm img-zoom">
        <img src="${producto.image}" 
        class="me-3 rounded shadow-lg img-fluid img-zoom" 
        style= "width:150px; height:auto;" alt="${producto.name}" />
        <div>
      <h3 class="text-black fw-bold">${producto.name}</h3>
      <p class="zoom-hover text-grey lead">${producto.description}</p>
      <p class="text-black zoom-hover"><strong>Precio:</strong> $${producto.cost}</p>
      <p class="zoom-hover"><strong>Cantidad vendida:</strong> ${producto.soldCount}</p>
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