const ORDER_ASC_BY_COST = "↑";
const ORDER_DESC_BY_COST = "⬇";
const ORDER_BY_PROD_COUNT = "Cant.";
let currentProductsArray = [];
let currentSortCriteria = undefined;
let minCount = undefined;
let maxCount = undefined;

function sortProducts(criteria, array) {
  let result = [];
  if (criteria === ORDER_ASC_BY_COST) {
    result = array.sort(function (a, b) {
      if (a.cost < b.cost) {
        return -1;
      }
      if (a.cost > b.cost) {
        return 1;
      }
      return 0;
    });
  } else if (criteria === ORDER_DESC_BY_COST) {
    result = array.sort(function (a, b) {
      if (a.cost > b.cost) {
        return -1;
      }
      if (a.cost < b.cost) {
        return 1;
      }
      return 0;
    });
  } else if (criteria === ORDER_BY_PROD_COUNT) {
    result = array.sort(function (a, b) {
      let aCount = parseInt(a.soldCount);
      let bCount = parseInt(b.soldCount);

      if (aCount > bCount) {
        return -1;
      }
      if (aCount < bCount) {
        return 1;
      }
      return 0;
    });
  }
  return result;
}

function showProductLists() {
  let contenedorListado = document.getElementById("listado");
  contenedorListado.innerHTML = "";

  currentProductsArray.forEach((producto) => {
    if (
      (minCount == undefined ||
        (minCount != undefined && parseInt(producto.cost) >= minCount)) &&
      (maxCount == undefined ||
        (maxCount != undefined && parseInt(producto.cost) <= maxCount))
    ) {
      contenedorListado.innerHTML += `
                <div class="list-group-item zoom-hover img-zoom" data-id="${producto.id}">
                    <div class="container-fluid p-1">
                        <div class="row g-3 align-items-center">
                            <div class="col-12 col-md-3 text-center">
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
    }
  });

  contenedorListado.addEventListener("click", (e) => {
    let card = e.target.closest("[data-id]");
    if (card) {
      let idSeleccionado = card.getAttribute("data-id");
      localStorage.setItem("productoID", idSeleccionado);
      window.location.href = "product-info.html";
    }
  });
}

function sortAndShowProducts(sortCriteria, productsArray) {
  currentSortCriteria = sortCriteria;

  if (productsArray != undefined) {
    currentProductsArray = productsArray;
  }

  currentProductsArray = sortProducts(
    currentSortCriteria,
    currentProductsArray
  );
  showProductLists();
}

document.addEventListener("DOMContentLoaded", function (e) {
  const catID = localStorage.getItem("catID");
  //let url = `http://localhost:3000/cats_products/${catID}`;
  let url = `https://japceibal.github.io/emercado-api/cats_products/${catID}.json`;
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Hubo un error!");
      }
      return response.json();
    })
    .then((data) => {
      currentProductsArray = data.products;
      showProductLists();
    })
    .catch((error) => {
      document.getElementById(
        "listado"
      ).innerHTML = `<div class="alert alert-danger" role="alert">Error: ${error.message}</div>`;
    });

  document.getElementById("sortAsc").addEventListener("click", function () {
    sortAndShowProducts(ORDER_ASC_BY_COST);
  });

  document.getElementById("sortDesc").addEventListener("click", function () {
    sortAndShowProducts(ORDER_DESC_BY_COST);
  });

  document.getElementById("sortByCount").addEventListener("click", function () {
    sortAndShowProducts(ORDER_BY_PROD_COUNT);
  });

  document
    .getElementById("clearRangeFilter")
    .addEventListener("click", function () {
      document.getElementById("rangeFilterCountMin").value = "";
      document.getElementById("rangeFilterCountMax").value = "";
      minCount = undefined;
      maxCount = undefined;
      showProductLists();
    });

  document
    .getElementById("rangeFilterCount")
    .addEventListener("click", function () {
      minCount = document.getElementById("rangeFilterCountMin").value;
      maxCount = document.getElementById("rangeFilterCountMax").value;

      if (minCount != undefined && minCount != "" && parseInt(minCount) >= 0) {
        minCount = parseInt(minCount);
      } else {
        minCount = undefined;
      }

      if (maxCount != undefined && maxCount != "" && parseInt(maxCount) >= 0) {
        maxCount = parseInt(maxCount);
      } else {
        maxCount = undefined;
      }

      showProductLists();
    });
});
