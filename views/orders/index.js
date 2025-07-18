const ordersContainer = document.getElementById('orders-container');


// Making it a global func
window.updateOrderStatus = async (orderId, newStatus) => {
  try {
    await axios.put(`/api/orders/${orderId}`, { status: newStatus }, { withCredentials: true });
    createNotification(false, 'Estado de la orden actualizado correctamente');
    setTimeout(()=>{
        notification.innerHTML = ''
    },5000)


  } catch (error) {
    console.error('Error al actualizar el estado de la orden:', error);
    createNotification(true, 'No se pudo actualizar el estado de la orden');
    setTimeout(()=>{
        notification.innerHTML = ''
    },5000)

  }
};

// Func to open the modal and show the products of the order
window.viewOrderProducts = async (orderId) => {
    try {
      // Get petition from the backend
      const { data } = await axios.get(`/api/orders/${orderId}`, { withCredentials: true });
      
      const productsHtml = data.products.map(product => `
        <li style="margin-bottom: 0.5rem;">
          <b>${product.name}</b> - Cant: ${product.quantity} x $${product.price.toFixed(2)} = $${(product.quantity * product.price).toFixed(2)}
        </li>
      `).join('');
  
      const modalContent = `
        <h3 style="margin-bottom: 1rem;">Productos de la Orden #${orderId.slice(-6).toUpperCase()}</h3>
        <ul>${productsHtml}</ul>
      `;
  
      // Inserts the content into the modal
      const modal = document.getElementById('modal');
      const modalContentDiv = document.getElementById('modal-content');
      modalContentDiv.innerHTML = modalContent;
  
      // shows it
      modal.style.display = 'block';
    } catch (error) {
      console.error('Error al obtener los productos de la orden:', error);
    }
  };
  

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

const fetchOrdersForAdmin = async () => {
    try {
    
      const { data: orders } = await axios.get('/api/orders', { withCredentials: true });

      // If we dont have any orders it will show a message
      if (orders.length === 0) {
        ordersContainer.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 1rem;">No se han encontrado órdenes.</td></tr>';
        return;
      }

      
       ordersContainer.innerHTML  = orders.map(order => `
        <tr>
            <td style="padding: 0.75rem;">${order._id.slice(-6).toUpperCase()}</td>
            <td style="padding: 0.75rem;">${order.user_id ? order.user_id.name : 'Usuario eliminado'}</td>
            <td style="padding: 0.75rem;">${new Date(order.createdAt).toLocaleDateString('es-ES')}</td>
            <td style="padding: 0.75rem;">$${order.total.toFixed(2)}</td>
            <td style="padding: 0.75rem;">${order.status}</td>
            <td style="padding: 0.75rem; text-align: center;">
                <button onclick="window.viewOrderProducts('${order._id}')" style="background-color: #17a2b8; color: white; border: none; padding: 0.5rem; border-radius: 0.25rem; cursor: pointer; margin-left: 0.5rem;">Ver</button> 
            </td>
        </tr>
      `).join('');

    
    } catch (error) {
      console.error('Error al obtener las órdenes:', error);

      if (!ordersContainer) {
        ordersContainer.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 1rem;">No se pudieron cargar las órdenes.</td></tr>';
      }
    }
  };

  
  //Loads both get products and fetch orders for admin when we open the page
  document.addEventListener('DOMContentLoaded', () => {
  
    fetchOrdersForAdmin(); 
  });




// const fetchOrders = async () => {
//   try {
//     const { data: orders } = await axios.get('/api/orders', { withCredentials: true });
//     ordersContainer.innerHTML = orders.map(order => `
//       <div class="order">
//         <h3>Orden #${order._id}</h3>
//         <p>Fecha: ${new Date(order.order_date).toLocaleDateString()}</p>
//         <p>Total: $${order.total_amount.toFixed(2)}</p>
//         <p>Estado: ${order.status}</p>
//         <button onclick="viewOrderDetails('${order._id}')">Ver Detalles</button>
//       </div>
//     `).join('');
//   } catch (error) {
//     console.error('Error al obtener las órdenes:', error);
//   }
// };



// document.addEventListener('DOMContentLoaded', fetchOrders);