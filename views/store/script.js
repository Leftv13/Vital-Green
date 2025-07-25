//  Selectors 
const productButtons = document.querySelectorAll('.prodBtn');
const cartTableBody = document.querySelector('#tableBody');
const emptyCartButton = document.querySelector('#removeTable');
const cartCounter = document.querySelector('#cart-counter');
const shopIcon = document.querySelector('#shopicon');
const cartSection = document.querySelector('.cart');
const prodList = document.querySelector('#prodList');
const closeTable = document.querySelector('#closeTable');
const buyTable = document.querySelector('#buyTable');

// Empty array to hold the cart items
let cart = []; 

//Counter (topright icon)
const updateCartCounter = () => {
    const totalItems = cart.length;
    cartCounter.textContent = totalItems;

    if (totalItems == 0) {
        cartCounter.classList.add('hide-counter');
    } else {
        cartCounter.classList.remove('hide-counter');
    }
};

//Local Storage Logic
buyTable.addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Tu carrito está vacío. Añade productos antes de comprar.');
    return;
  }
  localStorage.setItem('shoppingCart', JSON.stringify(cart));
  window.location.href = '/checkout';
});

updateCartCounter();

// Renders the products on the table.
const renderCartItems = () => {
  cartTableBody.innerHTML = ''; //cleans the body before rendering

  cart.forEach(item => {
    const cartRow = document.createElement('tr');
    const rowTotal = item.price * item.quantity;
    cartRow.innerHTML = `
      <td><img src="${item.image}" alt="${item.name}" style="width: 100%; border-radius: 0.5rem;"></td>
      <td>${item.name}</td>
      <td>$${rowTotal.toFixed(2)}</td>
      <td>${item.quantity}</td>
      <td>
        <button class="delBtn" data-id="${item.id}">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style=" pointer-events: none; color: white; align-self: center;">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </td>
    `;
    cartTableBody.appendChild(cartRow);
  });
  updateCartCounter();
}; 

//Cart logic
const addToCart = (e) => {
  const prodItem = e.target.closest('.prodItem');
  const quantityInput = prodItem.querySelector('.quantityInput').value;
  const _id = prodItem.id; 
  const name = prodItem.querySelector('.infoTitle').textContent;
  const priceText = prodItem.querySelector('.infoPrice').textContent;
  const image = prodItem.querySelector('.pdImg').src;
  const priceNumber = parseFloat(priceText.replace('Precio: $', ''));
  const existingItem = cart.find(item => item._id === _id);
  let quantity = parseInt(quantityInput);
  if(isNaN(quantity) || quantity < 1){
    quantity = 1;
  }

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ _id, name, price: priceNumber, image, quantity });
  }

  renderCartItems(); 
};

const removeItemFromCart = (productId) => {

  const productIndex = cart.findIndex(item => item.id === productId);

  if (productIndex !== -1) {
    cart.splice(productIndex, 1);
    renderCartItems();
    updateCartCounter();
  }
};

//Event Listeners 
prodList.addEventListener('click', (e) => {
  if (e.target.classList.contains('prodBtn')) {
      addToCart(e);
  }
});

cartTableBody.addEventListener('click', (e) => {
  if (e.target.classList.contains('delBtn')) {
    removeItemFromCart(); 
  }
});


emptyCartButton.addEventListener('click', () => {
    cart = [];
    renderCartItems(); 
});

shopIcon.addEventListener('click', () => {
    cartSection.classList.toggle('showcart');
});

closeTable.addEventListener('click', () => {
   cartSection.classList.toggle('showcart');
});

updateCartCounter();

//GO UP LOGIC
const goUp = document.querySelector('#goUp');

goUp.style.display = 'none';
window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        goUp.style.display = 'block';
    } else {
        goUp.style.display = 'none';
    }
});

// Smooth scroll to top
goUp.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

//SEARCH LOGIC
const searchTermInput = document.getElementById('searchTermInput');
const searchButton = document.getElementById('searchButton');

let allProducts = []; 

// Function to display products in the product list
const displayProducts = (productsToDisplay) => {
  prodList.innerHTML = '';

  productsToDisplay.forEach(product => {
    const listItem = document.createElement('li');
    listItem.id = product._id;
    listItem.classList.add('prodItem');
    listItem.innerHTML = `
             <div class="prodImg">
              <img src="${product.image_url}" alt="${product.name}" class="pdImg">
             </div>
             <div class="prodInfo">
              <p class="infoTitle">${product.name}</p>
              <p>Contiene: ${product.description}</p>
              <p>Existencias: ${product.stock}</p>
              <p class="infoPrice">Precio: $${product.price.toFixed(2)}</p>
              <input type="number" class="quantityInput" value="1" min="1">
              <button class="prodBtn">AGREGAR AL CARRITO</button>
             </div> 
    `;
    prodList.appendChild(listItem);
  });
};

// Fetch products from the server
const fetchProducts = async () => {
    try {
        const response = await axios.get('/api/products'); 
        allProducts = response.data; 
        displayProducts(allProducts); 
    } catch (error) {
       console.log(error);
    }
};

// Filter products based on search term
const filterProducts = () => {
    const searchTerm = searchTermInput.value.toLowerCase().trim();

    if (searchTerm === '') {
        displayProducts(allProducts);
        return;
    }

    const filtered = allProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm) || 
        product.description.toLowerCase().includes(searchTerm) 
    );

    displayProducts(filtered);
};

document.addEventListener('DOMContentLoaded', fetchProducts);
searchTermInput.addEventListener('input', filterProducts);