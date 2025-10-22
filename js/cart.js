document.addEventListener('DOMContentLoaded', function(){
    const items = document.getElementById("cart-items")
    const articuloaComprar = localStorage.getItem("item")
    const articulos = JSON.parse(localStorage.getItem('carrito')) || [];
    const articlesCount = articulos.length;
    const prodTotal = document.getElementById("prodTotal");
    const costoTotal = document.getElementById("cart-total");
    let url = `https://japceibal.github.io/emercado-api/products/${articuloaComprar}.json`;
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Hubo un error!");
      }
      return response.json();
    })
    .then((infoProducto) => {
        items.innerHTML += 
        `<div class="card mb-3 position-relative" style="max-width: 540px;">
            <img src=${infoProducto.images[0]} width=130px>
            <p">${infoProducto.name}</p>
            <p>${infoProducto.cost} USD</p>
            <p>Cantidad: ${articlesCount}</p>
            <p>Subtotal: USD ${infoProducto.cost*articlesCount}</p>
        </div>`
})});
