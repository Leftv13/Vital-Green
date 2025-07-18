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
// const productWeightInput = document.querySelector('#product-weight');;
// const productCategoryInput = document.querySelector('#product-category');
// const productIsAvailableInput = document.querySelector('#product-is-available');

//////////////////////
//  Products Logic //
////////////////////

// SearchBar & GET

// Selectors
const searchTermInput = document.getElementById('searchTermInput');
//const searchButton = document.getElementById('searchButton');

// Ts will hold all the products
let allProducts = []; 

// Function to display products in the table 
const displayProducts = (productsToDisplay) => {
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
};

// Get petition 
const fetchProducts = async () => {
    try {
        const response = await axios.get('/api/products'); 
        allProducts = response.data; 
        displayProducts(allProducts); 
    } catch (error) {
       console.log(error);
    }
};

// Function to filter products 
const filterProducts = () => {
    const searchTerm = searchTermInput.value.toLowerCase().trim(); // trim rmvs spaces

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
};

// Event Listener for inputs
searchTermInput.addEventListener('input', filterProducts);


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
                    description: productDescriptionInput.erIDvalue,
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

        document.querySelector('details').setAttribute('close', true);

        // Updates the list after we added the product so it is shown
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


//Ts has the edit & delete button logics from the list elements
productListBody.addEventListener('click', async e => {
    const target = e.target.closest('button'); 
    if (!target) return;

    if (target.classList.contains('delete-btn')) {
      //Gets the product id from the data-id attribute of the clicked button
        const productId = e.target.dataset.id;
        deleteProduct(productId); //call DEL func with the argument of the clicked product
    }

    // PUT
     // Logic to edit the products
     if (target.classList.contains('edit-btn')) {
      //Gets the product id from the data-id attribute of the clicked button
        const productId = e.target.dataset.id;

        try {
            // sends a Get req data from the clicked product in the db
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

///////////////////
// Order Logics //
/////////////////

//GET

const fetchOrdersForAdmin = async () => {
  try {
    const orderListBody = document.getElementById('order-list-body'); 
    const { data: orders } = await axios.get('/api/orders', { withCredentials: true });

    let ordersHTML = []; 

    orders.forEach(order => {

      //.slice is used to get the last 6 characters of the order ID
        ordersHTML.push(`
        <tr>
            <td style="padding: 0.75rem;">${order._id.slice(-6).toUpperCase()}</td> 
            <td style="padding: 0.75rem;">${order.user_id ? order.user_id.name : 'Usuario eliminado'}</td>
            <td style="padding: 0.75rem;">${new Date(order.createdAt).toLocaleDateString('es-ES')}</td>
            <td style="padding: 0.75rem;">$${order.total.toFixed(2)}</td>
            <td style="padding: 0.75rem; text-align: center;">
            <select class="order-status-select" data-order-id="${order._id}" style="padding: 0.5rem; border-radius: 0.25rem; border: 1px solid #ccc;">
              <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pendiente</option>
              <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>En proceso</option>
              <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Enviada</option>
              <option value="delivering" ${order.status === 'delivering' ? 'selected' : ''}>En Camino</option>
              <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Completada</option>
              <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelada</option>
            </select>
             <button class="view-order-products-btn" data-order-id="${order._id}" style="background-color: #17a2b8; color: white; border: none; padding: 0.5rem; border-radius: 0.25rem; cursor: pointer; margin-left: 0.5rem;">Ver</button>
            </td>
        </tr>
        `);
    });
    
    orderListBody.innerHTML = ordersHTML.join(''); 

  
  } catch (error) {
    console.error('Error al obtener las órdenes:', error);
    const orderListBody = document.getElementById('order-list-body');
    if (orderListBody) {
      orderListBody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 1rem;">No se pudieron cargar las órdenes.</td></tr>';
    }
  }
};

//GET by orderId
const viewOrderProducts = async (orderId) => {
  try {
      const { data } = await axios.get(`/api/orders/${orderId}`, { withCredentials: true });
      
      let productsHtml = [];
      data.products.forEach(product => {
          productsHtml.push(`
              <li style="margin-bottom: 0.5rem;">
                  <b>${product.name}</b> - Cant: ${product.quantity} x $${product.price.toFixed(2)} = $${(product.quantity * product.price).toFixed(2)}
              </li>
          `);
      });

      const modalContent = `
          <h3 style="margin-bottom: 1rem;">Productos de la Orden #${orderId.slice(-6).toUpperCase()}</h3>
          <ul>${productsHtml.join('')}</ul>
      `;

      const modal = document.getElementById('modal');
      const modalContentDiv = document.getElementById('modal-content');
      modalContentDiv.innerHTML = modalContent;
      modal.style.display = 'block';
  } catch (error) {
      console.error('Error al obtener los productos de la orden:', error);
  }
};

//Displays products in the modal when we click the view button
document.addEventListener('click', async (e) => {
  if (e.target.classList.contains('view-order-products-btn')) {
      const orderId = e.target.dataset.orderId;
      await viewOrderProducts(orderId);
  }
});

//PUT
const updateOrderStatus = async (orderId, newStatus) => {
  try {
      await axios.put(`/api/orders/${orderId}`, { status: newStatus }, { withCredentials: true });
      createNotification(false, 'Estado de la orden actualizado correctamente');
      setTimeout(() => { notification.innerHTML = '' }, 5000);
  } catch (error) {
      console.error('Error al actualizar el estado de la orden:', error);
      createNotification(true, 'No se pudo actualizar el estado de la orden');
      setTimeout(() => { notification.innerHTML = '' }, 5000);
  }
};


// Handles the change event for the order status select dropdown
document.addEventListener('change', async (e) => {
  if (e.target.classList.contains('order-status-select')) {
      const orderId = e.target.dataset.orderId;
      const newStatus = e.target.value;
      await updateOrderStatus(orderId, newStatus);
  }
});





  const closeModal = () => {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
  };
  
  // Listener for the close button
  document.getElementById('close-modal').addEventListener('click', closeModal);
  
// Listener for clicking outside the modal content to close it
  document.getElementById('modal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  });



  
  //Loads both get products and fetch orders for admin when we open the page
  document.addEventListener('DOMContentLoaded', () => {
    fetchProducts(); 
    fetchOrdersForAdmin(); 
  });

// Selectors for the logout button
const closeBtn = document.querySelector('#logout');

  closeBtn.addEventListener('click', async e => {
    try {
        await axios.get('/api/logout');
        window.location.pathname = '/login';
    } catch (error) {
        console.log(error);
    }
  
  });
