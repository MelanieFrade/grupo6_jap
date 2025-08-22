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
        <div class="product-item d-flex align-items-center mb-3 p-3 bg-white rounded shadow-sm hover-shadow">
        <img src="${producto.image}" 
        class="img-thumbnail me-3 rounded shadow-sm zoom-hover" 
        style= "width:150px; height:auto;" alt="${producto.name}" />
        <div>
      <h3>${producto.name}</h3>
      <p>${producto.description}</p>
      <p><strong>Precio:</strong> $${producto.cost}</p>
      <p><strong>Cantidad vendida:</strong> ${producto.soldCount}</p>
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