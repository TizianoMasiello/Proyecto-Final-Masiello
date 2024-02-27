import { productosDisponibles } from "./inicio.js";

JSON.parse(sessionStorage.getItem("carrito")) === null &&
  sessionStorage.setItem("carrito", JSON.stringify([]));

document.addEventListener("DOMContentLoaded", () => {
  hacerCarrito();
});
let carrito = JSON.parse(sessionStorage.getItem("carrito"));
const listaCarrito = document.getElementById("items");
const footCarrito = document.getElementById("totales");
const btnCarrito = document.getElementById("btnCarrito");

const carritoTabla = document.getElementById("carrito");

btnCarrito.addEventListener("click", () => {
  if (carritoTabla.style.display === "block") {
    carritoTabla.style.display = "none";
  } else {
    carritoTabla.style.display = "block";
  }
});

export const comprarProducto = (idProducto) => {
  const producto = productosDisponibles.find(
    (producto) => producto.id === idProducto
  );

  const { nombre, precio, imagen, id } = producto;

  const productoCarrito = carrito.find(
    (producto) => producto.id === idProducto
  );
  if (productoCarrito === undefined) {
    const nuevoProductoCarrito = {
      id: id,
      nombre: nombre,
      precio: precio,
      imagen: imagen,
      cantidad: 1,
    };

    carrito.push(nuevoProductoCarrito);
    sessionStorage.setItem("carrito", JSON.stringify(carrito));
  } else {
    const indexProductoCarrito = carrito.findIndex(
      (producto) => producto.id === idProducto
    );
    carrito[indexProductoCarrito].cantidad++;
    carrito[indexProductoCarrito].precio =
      precio * carrito[indexProductoCarrito].cantidad;

    sessionStorage.setItem("carrito", JSON.stringify(carrito));
  }
  carrito = JSON.parse(sessionStorage.getItem("carrito"));
  alert(`Usted ha comprado el producto: ${nombre}`);
};

const hacerCarrito = () => {
  listaCarrito.innerHTML = "";
  carrito.forEach((producto) => {
    const { imagen, nombre, cantidad, precio, id } = producto;

    let body = document.createElement("tr");
    body.className = "producto__carrito";
    body.innerHTML = `
    <th><img id="fotoProductoCarrito" src="${imagen}" class="card-image-top" style="width:100%; "</th>
    <td>${nombre}</td>
    <td>${cantidad}</td>
    <td>${precio / cantidad}</td>
    <td>${precio}</td>
    <td>
    <button id="+${id}" class="btn-success">+</button>
    <button id="-${id}" class="btn-danger">-</button>
    </td> 
    `;
    listaCarrito.appendChild(body);

    const btnAgregar = document.getElementById(`+${id}`);
    const btnRestar = document.getElementById(`-${id}`);

    btnAgregar.addEventListener("click", () => aumentarCantidad(id));
    btnRestar.addEventListener("click", () => restarCantidad(id));
  });

  hacerFooter();
};

const hacerFooter = () => {
  if (carrito.lenght > 0) {
    footCarrito.innerHTML = "";

    let footer = document.createElement("tr");

    footer.innerHTML = `
    <th>Totales:</th>
    <td></td>
    <td>${generarTotales().cantidadTotal}</td>
    <td></td>
    <td>${generarTotales().costoTotal}</td>
    `;
    footCarrito.append(footer);
  } else {
    footCarrito.innerHTML = `<p>No hay productos en el carrito</p>`;
  }
};

const generarTotales = () => {
  const costoTotal = carrito.reduce(
    (acumulador, { precio }) => total + precio,
    0
  );
  const cantidadTotal = carrito.reduce(
    (total, { cantidad }) => total + cantidad,
    0
  );
  return {
    costoTotal: costoTotal,
    cantidadTotal: cantidadTotal,
  };
};

const aumentarCantidad = (id) => {
  const indexProductoCarrito = carrito.findIndex(
    (producto) => producto.id === id
  );
  const precio =
    carrito[indexProductoCarrito].precio /
    carrito[indexProductoCarrito].cantidad;

  carrito[indexProductoCarrito].cantidad++;
  carrito[indexProductoCarrito].precio =
    precio * carrito[indexProductoCarrito].cantidad;

  sessionStorage.setItem("carrito", JSON.stringify(carrito));

  hacerCarrito();
};

const restarCantidad = (id) => {
  const indexProductoCarrito = carrito.findIndex(
    (producto) => producto.id === id
  );
  const precio =
    carrito[indexProductoCarrito].precio /
    carrito[indexProductoCarrito].cantidad;

  carrito[indexProductoCarrito].cantidad--;
  carrito[indexProductoCarrito].precio =
    precio * carrito[indexProductoCarrito].cantidad;
  if (carrito[indexProductoCarrito].cantidad === 0) {
    carrito.splice(indexProductoCarrito, 1);
  }

  sessionStorage.setItem("carrito", JSON.stringify(carrito));

  hacerCarrito();
};
