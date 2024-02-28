// import { comprarProducto } from "./carrito.js";
const divProductos = document.getElementById("productos");
const filterInput = document.getElementById("filter__input");

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
  } catch (error) {
    console.error("No se encontro la info", error);
  }
};
traerDatos();

// Filtrado Input

const saveKeyword = (keyword) => {
  let keywords = JSON.parse(localStorage.getItem("keywords")) || [];
  if (!keywords.includes(keyword)) {
    keywords.unshift(keyword);
    localStorage.setItem("keywords", JSON.stringify(keywords));
  }
};
// filterInput.addEventListener("input", () => {});

filterInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    const query = filterInput.value.toLowerCase();
    saveKeyword(query);
  }
});

// filterInput.addEventListener("keyup", (e) => {
//   const productosFilter = productosDisponibles.filter((producto) =>
//     producto.nombre.toLowerCase().includes(e.target.value)
//   );

//   productosDisponibles = productosFilter;

//   if (e.target.value !== "") {
//     generarCardsProductos(productosFilter);
//   } else {
//     productosDisponibles = JSON.parse(localStorage.getItem("productos"));
//     generarCardsProductos(productosDisponibles);
//   }
// });
