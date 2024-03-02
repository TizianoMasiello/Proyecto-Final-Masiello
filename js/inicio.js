// Shop Content
const divProductos = document.getElementById("productos");
// Filtro de busqueda
const filterInput = document.getElementById("filter__input");
// Boton carrito
const btnCarrito = document.getElementById("btnCarrito");
const modalContainer = document.getElementById("modal-container");
const cantidadCarrito = document.getElementById("cantidadCarrito");
// Carrito
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
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
// Traemos datos al DOM desde el JSON
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
              <button id="comprar${id}" class="button">COMPRAR</button>
            </div>
          </div>`;
      divProductos.appendChild(card);

      const btnComprar = document.getElementById(`comprar${id}`);
      // Le agregamos funcionalidad al boton comprar
      btnComprar.addEventListener("click", () => {
        Toastify({
          text: `Agregaste ${nombre} al carrito.`,
          duration: 3000,
        }).showToast();

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

// Carrito

const pintarCarrito = () => {
  modalContainer.innerHTML = "";
  modalContainer.style.display = "flex";
  const modalHeader = document.createElement("div");
  modalHeader.className = "modal-header";
  modalHeader.innerHTML = `
    <h1 class="modal-header-title">Carrito</h1>
    `;
  modalContainer.append(modalHeader);

  const modalbutton = document.createElement("h1");
  modalbutton.innerText = "X";
  modalbutton.className = "modal-header-button";

  modalbutton.addEventListener("click", () => {
    modalContainer.style.display = "none";
  });

  modalHeader.append(modalbutton);

  carrito.forEach((item) => {
    let carritoContent = document.createElement("div");
    carritoContent.className = "modal-content";
    carritoContent.innerHTML = `
      <img src="${item.imagen}">
      <h3>${item.nombre}</h3>
      <p>$${item.precio}</p>
      <span class="restar"> ➖ </span>
      <p>${item.cantidad}</p>
      <span class="sumar"> ➕ </span>
      <p>Total: $${item.cantidad * item.precio}</p>
      <span class="delete-item">❌</span>
    `;
    modalContainer.append(carritoContent);
    console.log(carrito.lenght);
    // Restar Cantidad
    let restar = carritoContent.querySelector(".restar");
    restar.addEventListener("click", () => {
      if (item.cantidad !== 1) {
        item.cantidad--;
      }
      saveLocal();
      pintarCarrito();
    });
    // Sumar Cantidad
    let sumar = carritoContent.querySelector(".sumar");
    sumar.addEventListener("click", () => {
      item.cantidad++;
      saveLocal();
      pintarCarrito();
    });

    let eliminar = carritoContent.querySelector(".delete-item");
    eliminar.addEventListener("click", () => {
      eliminarItem(item.id);
    });
  });

  // Calcular Total Carrito
  const total = carrito.reduce((acc, el) => acc + el.precio * el.cantidad, 0);

  const totalBuying = document.createElement("div");
  totalBuying.className = "total-content";
  totalBuying.innerHTML = `<h3 class="total-pagar">Total a pagar: $${total}</h3>
  <button class="btn-Pagar">PAGAR</button>
  `;

  modalContainer.append(totalBuying);

  const btnPagar = totalBuying.querySelector(".btn-Pagar");
  btnPagar.addEventListener("click", () => {
    if (carrito.length > 0) {
      carrito = []; // Limpiar el carrito
      saveLocal(); // Guardar el carrito vacío en el localStorage
      pintarCarrito(); // Volver a pintar el carrito (estará vacío)
      carritoCounter();
      Swal.fire({
        title: "Compra Realizada con éxito",
        text: "Llegará Pronto",
        icon: "success",
      });
      modalContainer.style.display = "none"; // Cerrar el carrito
    } else {
      Swal.fire({
        title: "Carrito Vacío",
        text: "No hay ítems en el carrito para realizar la compra.",
        icon: "warning",
      });
    }
  });
};

btnCarrito.addEventListener("click", pintarCarrito);

// Eliminar item del carrito

const eliminarItem = (id) => {
  const foundId = carrito.find((item) => item.id === id);
  console.log(foundId);
  carrito = carrito.filter((carritoId) => {
    return carritoId !== foundId;
  });
  carritoCounter();
  saveLocal();
  pintarCarrito();
};

// Contador rojo carrito

const carritoCounter = () => {
  cantidadCarrito.style.display = "block";

  const carritoLength = carrito.length;

  localStorage.setItem("carritoLength", JSON.stringify(carritoLength));

  cantidadCarrito.innerText = JSON.parse(localStorage.getItem("carritoLength"));
};

carritoCounter();
