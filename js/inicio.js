import { comprarProducto } from "./carrito.js";

const divProductos = document.getElementById("productos");
const filterInput = document.getElementById("filter__input");

export let productosDisponibles = JSON.parse(localStorage.getItem("productos"));

document.addEventListener("DOMContentLoaded", () => {
  generarCardsProductos(productosDisponibles);
});

export const generarCardsProductos = (productos) => {
  divProductos.innerHTML = "";

  productos.forEach((producto) => {
    const { nombre, categoria, precio, imagen, id } = producto;

    let card = document.createElement("div");
    card.className = "producto";
    card.innerHTML = `
    <div class="card" style="width: 18rem;">
  <img src="${imagen}" class="card-img-top" alt="Card image cap">
  <div class="card-body">
    <h5 class="card-title">${nombre}</h5>
    <p class="card-text">Categoria: ${categoria}</p>

    <p class="card-text">Precio: $${precio}</p>
    <button id="comprar${id}" class="btn btn-primary">Comprar</button>
    
  </div>
</div>`;

    divProductos.appendChild(card);

    const btnComprar = document.getElementById(`comprar${id}`);
    btnComprar.addEventListener("click", () => comprarProducto(id));
  });
};

// Filtrar por input
filterInput.addEventListener("keyup", (e) => {
  const productosFilter = productosDisponibles.filter((producto) =>
    producto.nombre.toLowerCase().includes(e.target.value)
  );

  productosDisponibles = productosFilter;

  if (e.target.value !== "") {
    generarCardsProductos(productosFilter);
  } else {
    productosDisponibles = JSON.parse(localStorage.getItem("productos"));
    generarCardsProductos(productosDisponibles);
  }
});
