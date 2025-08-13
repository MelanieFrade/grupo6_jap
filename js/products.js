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
      for (let i = 0; i < producto.products.length; i++) {
        /* accedo a la categoría, dentro está products, que sería cada uno de los 
        productos, por eso se hace products[i] para ir a cada uno de ellos y luego
        accedo a la propiedad de cada uno */
        contenedorListado.innerHTML += `
      <h3>${producto.products[i].name}</h3>
      <p>${producto.products[i].description}</p>
      <p>$ ${producto.products[i].cost}</p>
      <p>Cantidad vendida: ${producto.products[i].soldCount}</p>
      <img src="${producto.products[i].image}">
      `;
      }
    });
});
