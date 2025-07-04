// --- Selectores del DOM ---
const productButtons = document.querySelectorAll('.prodBtn');
const cartTableBody = document.querySelector('#tableBody');
const emptyCartButton = document.querySelector('#removeTable');
const cartCounter = document.querySelector('#cart-counter');
const shopIcon = document.querySelector('#shopicon');
const cartSection = document.querySelector('.cart');

// --- Estado de la aplicación ---
let cart = [];

// --- Funciones ---

/**
 * Actualiza el contador visual del carrito.
 * Lo muestra u oculta según si hay productos o no.
 */
const updateCartCounter = () => {
    const totalItems = cart.length;
    cartCounter.textContent = totalItems;

    if (totalItems === 0) {
        cartCounter.classList.add('hide-counter');
    } else {
        cartCounter.classList.remove('hide-counter');
    }
};

/**
 * Renderiza los productos del carrito en la tabla.
 */
const renderCartItems = () => {
  cartTableBody.innerHTML = ''; // Limpia la tabla antes de renderizar

  cart.forEach(item => {
    // Creamos la fila de la tabla con su contenido dinámicamente
    const cartRow = document.createElement('tr');
    cartRow.innerHTML = `
      <td><img src="${item.image}" alt="${item.name}" style="width: 100%; border-radius: 0.5rem;"></td>
      <td>${item.name}</td>
      <td>${item.price}</td>
      <td>${item.quantity}</td>
      <td>
        <button class="delBtn" data-id="${item.id}">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 15px; height: 25px; pointer-events: none;">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </td>
    `;
    cartTableBody.appendChild(cartRow);
  });

  // Llama a la actualización del contador cada vez que se renderiza el carrito
  updateCartCounter();
};

/**
 * Añade un producto al carrito.
 * @param {Event} e - El evento del click.
 */
const addToCart = (e) => {
  const prodItem = e.target.closest('.prodItem');
  const name = prodItem.querySelector('.infoTitle').textContent;
  const price = prodItem.querySelector('.infoPrice').textContent.replace('Precio: ', ''); // Limpiamos el texto
  const image = prodItem.querySelector('.pdImg').src;
  const id = name; // Usaremos el nombre como ID por ahora

  // Buscamos si el producto ya está en el carrito
  const existingItem = cart.find(item => item.id === id);

  if (existingItem) {
    // Si ya existe, solo aumentamos la cantidad
    existingItem.quantity++;
  } else {
    // Si no existe, lo añadimos al carrito
    cart.push({ id, name, price, image, quantity: 1 });
  }

  renderCartItems(); // Actualiza la vista del carrito
};

// --- Event Listeners ---

// Añadir producto al hacer click en los botones
productButtons.forEach(button => button.addEventListener('click', addToCart));

// Eliminar un producto del carrito (usando delegación de eventos)
cartTableBody.addEventListener('click', (e) => {
  // Verificamos si el click fue en un botón de eliminar
  if (e.target.classList.contains('delBtn')) {
    const idToDelete = e.target.dataset.id;
    // Filtramos el carrito para remover el item con ese ID
    cart = cart.filter(item => item.id !== idToDelete);
    renderCartItems(); // Volvemos a renderizar el carrito actualizado
  }
});

// Vaciar el carrito
emptyCartButton.addEventListener('click', () => {
    cart = []; // Resetea el array del carrito
    renderCartItems(); // Actualiza la vista
});

// Mostrar/ocultar el carrito
shopIcon.addEventListener('click', () => {
    cartSection.classList.toggle('showcart');
});

// --- Inicialización ---
// Llama a la función una vez al cargar la página para establecer el estado inicial (0)
updateCartCounter();

//GOUP LOGIC

const goUp = document.querySelector(`#goUp`);

goUp.style.display = `none`;
window.addEventListener(`scroll`, () =>{
    if(this.scrollY > 500){
        goUp.style.display = `block`
    }else{
        goUp.style.display = `none`;
    }

})

goUp.onclick = function ( ) {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    })
}