// 1. SELECTORS

import { createNotification } from "../components/notification.js";
const form = document.querySelector('#modalForm');
const productListBody = document.querySelector('#product-list-body');
const productNameInput = document.querySelector('#product-name');
const productPriceInput = document.querySelector('#product-price');
const productDescriptionInput = document.querySelector('#product-description');
const productStockInput = document.querySelector('#product-stock');
 const productImageInput = document.querySelector('#product-image');

/// Ill maybe add ts later

// const productWeightInput = document.querySelector('#product-weight');
// const productStockInput = document.querySelector('#product-stock');
// const productCategoryInput = document.querySelector('#product-category');
// const productIsAvailableInput = document.querySelector('#product-is-available');


//  Functions

//  GET 

const getProducts = async () => {
    try {
        const { data } = await axios.get('/api/products', { withCredentials: true });

        // Clears the list jic
        productListBody.innerHTML = '';

        // For each product in our product of arrays it creates a new row
        data.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td style="padding: 0.75rem;">${product.name}</td>
                <td style="padding: 0.75rem;">${product.description}</td>
                <td style="padding: 0.75rem;">$${product.price.toFixed(2)}</td>
                <td style="padding: 0.75rem;">${product.stock}</td>
                <td style="padding: 0.75rem;">${new Date(product.updated_at).toLocaleDateString('es-ES')}</td>
                <td style="padding: 0.75rem; text-align: center;">
                    <button class="edit-btn" data-id="${product._id}" style="background-color: #007bff; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.25rem; cursor: pointer; margin-right: 0.5rem;">Editar</button>
                    <button class="delete-btn" data-id="${product._id}" style="background-color: #dc3545; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.25rem; cursor: pointer;">Eliminar</button>
                </td>
            `;
            productListBody.appendChild(row);
        });

    } catch (error) {
        console.error('Error al obtener productos:', error);
    }
};



//  Delete 
const deleteProduct = async (productId) => {
    try {

        //Confirms if the user really wants to delete the product
        if (!confirm('¿Estás seguro de borrar este producto?')) return; 
        
        await axios.delete(`/api/products/${productId}`, { withCredentials: true });

        createNotification(false, 'Producto eliminado correctamente');
        setTimeout(()=>{
            notification.innerHTML = ''
        },5000)

        getProducts();
        

    } catch (error) {
        console.error('Error al eliminar producto:', error);
    }
};




//PUT & POST when we click the submit btn

form.addEventListener('submit', async e => {
    e.preventDefault();

    const productId = document.querySelector('#product-id').value;

    try {
        if (productId) {
            // Updates the product that we clicked from the list
            const { data } = await axios.put(`/api/products/${productId}`, 
                {
                    name: productNameInput.value,
                    price: productPriceInput.value,
                    description: productDescriptionInput.value,
                    image_url: productImageInput.value,
                    stock: productStockInput.value
                },
                { withCredentials: true }
            );

            createNotification(false, data.message);
            setTimeout(()=>{
                notification.innerHTML = ''
            },5000)
    

        } else {
            // Creates a new product with the values in the input
            const { data } = await axios.post('/api/products', 
                {
                    name: productNameInput.value,
                    price: productPriceInput.value,
                    description: productDescriptionInput.value,
                    image_url: productImageInput.value,
                    stock: productStockInput.value
                },
                { withCredentials: true }
            );

            createNotification(false, data.message);
            setTimeout(()=>{
                notification.innerHTML = ''
            },5000)
    
        }

        // Clears all the inputs after we clicked the submit btn
        document.querySelector('#product-id').value = '';
        productNameInput.value = '';
        productPriceInput.value = '';
        productStockInput.value = '';
        productDescriptionInput.value = '';
        productImageInput.value = '';

        // Updates the list after we added the product so it shows
        getProducts();
    } catch (error) {
        console.error('Error al guardar producto:', error);
        if (error.response) {
            createNotification(true, error.response.data.message);
        } else {
            createNotification(true, "No se pudo conectar con el servidor. Intenta de nuevo.");
        }
    }
});


//Loads getProducts func

document.addEventListener('DOMContentLoaded', getProducts);

//Ts has the edit & delete button logics from the list elements
productListBody.addEventListener('click', async e => {
    const target = e.target.closest('button'); 
    if (!target) return;

    if (target.classList.contains('delete-btn')) {
        const productId = e.target.dataset.id;
        deleteProduct(productId); //call DEL func with the argument of the clicked product
    }

    // PUT
     // Logic to edit the products
     if (target.classList.contains('edit-btn')) {
        const productId = e.target.dataset.id;

        try {
            // Get the data from the backend
            const { data: product } = await axios.get(`/api/products/${productId}`, { withCredentials: true });

            // Fills the form with the product data from the get petition
            document.querySelector('#product-id').value = product._id;
            productNameInput.value = product.name;
            productPriceInput.value = product.price;
            productDescriptionInput.value = product.description;
            productStockInput.value = product.stock;
            productImageInput.value = product.image_url;

            // Shows the modal
            document.querySelector('details').setAttribute('open', true);
        } catch (error) {
            console.error('Error al obtener producto:', error);
        }
    }
});

//Filter LOGICS W.I.P

// Selectores para los filtros
const filterBtn = document.querySelector('#filter-btn');
const filterMenu = document.querySelector('#filter-menu');
const applyFiltersBtn = document.querySelector('#apply-filters-btn');

//  Lógica para el menú de filtros 

// Muestra u oculta el menú al hacer clic en el botón de filtrar
filterBtn.addEventListener('click', (event) => {
    event.stopPropagation(); 
    filterMenu.classList.toggle('show');
});

// Cierra el menú si se hace clic fuera de él
window.addEventListener('click', (event) => {
    if (!filterMenu.contains(event.target) && !filterBtn.contains(event.target)) {
        filterMenu.classList.remove('show');
    }
});

// Evento para el botón "Aplicar Filtros"
applyFiltersBtn.addEventListener('click', () => {
    // 1. Obtener los valores de los inputs de filtro
    const minPrice = document.querySelector('#min-price').value;
    const maxPrice = document.querySelector('#max-price').value;
    const minStock = document.querySelector('#min-stock').value;
    const maxStock = document.querySelector('#max-stock').value;

    console.log('Aplicando filtros:', { minPrice, maxPrice, minStock, maxStock });
    
    // 2. Ocultar el menú
    filterMenu.classList.remove('show');

    
    // Construye la URL con los parámetros de filtro y llama a tu función getProducts.
    // Ejemplo: getProducts(`?minPrice=${minPrice}&maxPrice=${maxPrice}`);
});

//SearchBar

// Selectors
const searchTermInput = document.getElementById('searchTermInput');
const searchButton = document.getElementById('searchButton');
// const productListBody = document.getElementById('product-list-body');

//Ts will hold all the products
let allProducts = []; // Initialize as an empty array



//Get petition
async function fetchProducts() {
    try {
        const response = await axios.get('/api/products'); 
        allProducts = response.data; 
        displayProducts(allProducts); 
    } catch (error) {
       console.log(error);

       
    }
}

// Call fetchProducts when the page loads
document.addEventListener('DOMContentLoaded', fetchProducts);


// Function to display products in the table 
function displayProducts(productsToDisplay) {
    productListBody.innerHTML = ''; // Clear current table content

    if (productsToDisplay.length === 0) {
        productListBody.innerHTML = `<tr><td colspan="3" style="text-align: center; padding: 1rem;">No se encontraron productos.</td></tr>`;
        return;
    }

    productsToDisplay.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="padding: 0.75rem;">${product.name}</td>
            <td style="padding: 0.75rem;">${product.description}</td>
            <td style="padding: 0.75rem;">$${product.price.toFixed(2)}</td>
            <td style="padding: 0.75rem;">${product.stock}</td>
            <td style="padding: 0.75rem;">${new Date(product.updated_at).toLocaleDateString('es-ES')}</td>
            <td style="padding: 0.75rem; text-align: center;">
                    <button class="edit-btn" data-id="${product._id}" style="background-color: #007bff; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.25rem; cursor: pointer; margin-right: 0.5rem;">Editar</button>
                    <button class="delete-btn" data-id="${product._id}" style="background-color: #dc3545; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.25rem; cursor: pointer;">Eliminar</button>
                </td>
        `;
        productListBody.appendChild(row);
    });

    // //attaches the edit & del btn afer loading the search
    // attachProductButtonListeners();
}

// Function to filter products 
function filterProducts() {
    const searchTerm = searchTermInput.value.toLowerCase().trim(); 

    if (searchTerm === '') {
        displayProducts(allProducts); // If search bar is empty, display all products
        return;
    }

    // Filter products based on the search bar content, it can be by either description or name
    const filtered = allProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) 
    );

    displayProducts(filtered); // Display the products with the argument of the search bar
}

// Event Listener for inputs

// Listen for input changes, everytime the user types the products will load again
searchTermInput.addEventListener('input', filterProducts);
