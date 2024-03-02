// Shop Content
const divProductos = document.getElementById("productos");
// Filtro de busqueda
const filterInput = document.getElementById("filter__input");
// Boton carrito
export const btnCarrito = document.getElementById("btnCarrito");
export const modalContainer = document.getElementById("modal-container");
export const cantidadCarrito = document.getElementById("cantidadCarrito");
// Carrito
export let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
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
export const traerDatos = async () => {
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
              <button id="comprar${id}" class="button">COMPRAR</button>
            </div>
          </div>`;
      divProductos.appendChild(card);

      const btnComprar = document.getElementById(`comprar${id}`);

      btnComprar.addEventListener("click", () => {
        const repeat = carrito.some((repeatItem) => repeatItem.id === item.id);
        if (repeat) {
          carrito.map((prod) => {
            if (prod.id === item.id) {
              prod.cantidad++;
            }
          });
        } else {
          carrito.push({
            id: item.id,
            imagen: item.imagen,
            nombre: item.nombre,
            precio: item.precio,
            cantidad: item.cantidad,
          });
        }
        console.log(carrito);
        console.log(carrito.length);
        carritoCounter();
        saveLocal();
      });
    });
  } catch (error) {
    console.error("No se encontró la info", error);
  }
};
traerDatos();
// Set item
export const saveLocal = () => {
  localStorage.setItem("carrito", JSON.stringify(carrito));
};
