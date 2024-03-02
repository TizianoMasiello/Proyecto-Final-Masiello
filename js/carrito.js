import {
  btnCarrito,
  modalContainer,
  carrito,
  cantidadCarrito,
  saveLocal,
} from "./inicio.js";

const pintarCarrito = () => {
  modalContainer.innerHTML = "";
  modalContainer.style.display = "flex";
  const modalHeader = document.createElement("div");
  modalHeader.className = "modal-header";
  modalHeader.innerHTML = `
    <h1 class="modal-header-title">Carrito.</h1>
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
  totalBuying.innerHTML = `Total a pagar: $${total}`;
  modalContainer.append(totalBuying);
};

btnCarrito.addEventListener("click", pintarCarrito);

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

export const carritoCounter = () => {
  cantidadCarrito.style.display = "block";

  const carritoLength = carrito.lenght;

  localStorage.setItem("carritoLength", JSON.stringify(carritoLength));

  cantidadCarrito.innerText = JSON.parse(localStorage.getItem("carritoLenght"));
};

carritoCounter();
