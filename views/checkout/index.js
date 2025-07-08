document.addEventListener('DOMContentLoaded', () => {
    const itemsContainer = document.getElementById('checkout-items-container');
    const totalElement = document.getElementById('checkout-total');

    // Gets the saved products from the localstorage
    const cartString = localStorage.getItem('shoppingCart');

    // If theres no products then display this
    if (!cartString) {
        itemsContainer.innerHTML = '<p>No hay productos en tu carrito.</p>';
        return;
    }

    // Convert the string batck to an object
    const cart = JSON.parse(cartString);

    let total = 0;

    // For each product found in the local storage creates a div
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('checkout-item');
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div>
                <h4>${item.name}</h4>
                <p>Cantidad: ${item.quantity}</p>
            </div>
            <p style="margin-left: auto; font-weight: bold;">${item.price}</p>
        `;
        itemsContainer.appendChild(itemElement);

        // total price logics
        const priceNumber = parseFloat(item.price.replace('Precio: $', ''));
        total += priceNumber * item.quantity;
    });

    totalElement.textContent = `Total: $${total.toFixed(2)}`;
});