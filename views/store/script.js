//const product =require("../models/product");

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

(async () => {
	try {

    //GET petition to display a card for every product in the db
		const { data } = await axios.get('/api/products', {
			withCredentials: true
		});
		
		data.forEach(product => {
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
                <p>Stock: ${product.stock}</p>
                <p class="infoPrice">Precio: $${product.price.toFixed(2)}</p>
                <button class="prodBtn">AGREGAR AL CARRITO</button>
               </div> 
          
			`;


			prodList.append(listItem);
		})
	
	} catch (error) {
        console.log(error);
	}
})();



let cart = []; 

//Counter (topright icon)
const updateCartCounter = () => {
    const totalItems = cart.length;
    cartCounter.textContent = totalItems;

    if (totalItems === 0) {
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


// Renders the products ont the table.
const renderCartItems = () => {
  cartTableBody.innerHTML = ''; //cleans the body before rendering

  cart.forEach(item => {
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
  updateCartCounter();
};

//Cart logic
const addToCart = (e) => {
  const prodItem = e.target.closest('.prodItem');
  const name = prodItem.querySelector('.infoTitle').textContent;
  const price = prodItem.querySelector('.infoPrice').textContent;
  const image = prodItem.querySelector('.pdImg').src;
  const id = name; 

  const existingItem = cart.find(item => item.id === id);

  if (existingItem) {
    existingItem.quantity++;
    existingItem.price++;
  } else {
    cart.push({ id, name, price, image, quantity: 1 });
  }

  renderCartItems(); 
};

//Event Listeners 

//Adding a product to the cart
prodList.addEventListener('click', (e) => {
  if (e.target.classList.contains('prodBtn')) {
      addToCart(e);
  }
});

//Deleting a product form the cart
cartTableBody.addEventListener('click', (e) => {
  if (e.target.classList.contains('delBtn')) {
    const idToDelete = e.target.dataset.id;
    cart = cart.filter(item => item.id !== idToDelete);
    renderCartItems();
  }
});

// Empty the cart
emptyCartButton.addEventListener('click', () => {
    cart = []; //resets the array and then renders the cart again
    renderCartItems(); 
});

// toggle functions to shor or hide the cart
shopIcon.addEventListener('click', () => {
    cartSection.classList.toggle('showcart');
});

 closeTable.addEventListener('click', () => {
   cartSection.classList.toggle('showcart');
 });

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


