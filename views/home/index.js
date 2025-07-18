document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Ejemplo de cómo podrías actualizar el contador del carrito con JS
// Esto es solo un ejemplo, la lógica real de tu carrito vendrá de tu CRUD/backend
function updateCartCount(count) {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = count;
    }
}

// Llama a esta función cuando se añade/elimina un producto del carrito
// updateCartCount(2); // Por ejemplo, si tienes 2 ítems