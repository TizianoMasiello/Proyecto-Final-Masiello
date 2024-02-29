// import { comprarProducto } from "./carrito.js";
const divProductos = document.getElementById("productos");
const filterInput = document.getElementById("filter__input");

// Filtrado Input

const saveKeyword = (keyword) => {
  let keywords = JSON.parse(localStorage.getItem("keywords")) || [];
  if (!keywords.includes(keyword)) {
    keywords.unshift(keyword);
    localStorage.setItem("keywords", JSON.stringify(keywords));
  }
};

const filterProductos = (query) => {
  const productos = divProductos.getElementsByClassName("producto");
  Array.from(productos).forEach((producto) => {
    const nombre = producto
      .querySelector(".card-title")
      .textContent.toLowerCase();
    if (nombre.includes(query)) {
      producto.style.display = "block";
    } else {
      producto.style.display = "none";
    }
  });
};

filterInput.addEventListener("input", () => {
  const query = filterInput.value.toLowerCase();
  saveKeyword(query);
  filterProductos(query);
});
// Traemos datos al DOM
const traerDatos = async () => {
  try {
    const response = await fetch("./db/data.json");
    const data = await response.json();
    data.forEach((item) => {
      const { nombre, categoria, precio, imagen, id } = item;
      let card = document.createElement("div");
      card.className = "producto";
      card.innerHTML = `
          <div class="card custom-card" >
            <img src="${imagen}" class="card-img-top custom-img" alt="Card image cap">
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
  } catch (error) {
    console.error("No se encontro la info", error);
  }
};
traerDatos();
