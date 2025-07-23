    import { createNotification } from "../components/notification.js";
    document.addEventListener('DOMContentLoaded', () => {
    const checkoutBtn = document.getElementById('checkoutBtn');
    const itemsContainer = document.getElementById('checkout-items-container');
    const totalElement = document.getElementById('checkout-total');
    const resume = document.getElementById('resume');
    
        // --- Pdf stuff ---
    const generateInvoicePDF = (cart, total) => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        doc.addImage('/images/VITALGREEN-SINFONDO.png', 'PNG', 15, 10, 30, 30);
        doc.setFontSize(22);
        doc.text('Recibo de Compra - Vital Green', 55, 25);
        doc.setFontSize(12);
        doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 15, 45);
        doc.text(`Cliente: `, 15, 45);

        // Crear la tabla con los productos
        const tableColumn = ["Producto", "Cantidad", "Precio Unitario", "Subtotal"];
        const tableRows = [];

        cart.forEach(item => {
            const subtotal = item.price * item.quantity;
            const itemData = [
                item.name,
                item.quantity,
                `$${item.price.toFixed(2)}`,
                `$${subtotal.toFixed(2)}`
            ];
            tableRows.push(itemData);
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 55, 
        });

        // Añadir el total al final
        const finalY = doc.lastAutoTable.finalY; // Obtiene la posición final de la tabla
        doc.setFontSize(14);
        doc.text(`Total de la Compra: $${total.toFixed(2)}`, 14, finalY + 15);

        // Guardar el PDF
        doc.save('recibo-vital-green.pdf');
    };

 

    // Gets the saved products from the localstorage
    const cartString = localStorage.getItem('shoppingCart');
    
    // Parse the cart and check URL parameters at the beginning
    const cart = JSON.parse(cartString);
    const urlParams = new URLSearchParams(window.location.search);
    const checkoutStatus = urlParams.get('status');

    if (checkoutStatus === 'success') {
        // If the page was reloaded after a successful purchase
        itemsContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem; border: 2px dashed var(--primary-green); border-radius: 0.5rem;">
                <h2 style="color: var(--primary-green); margin-bottom: 1rem;">¡Compra Realizada con Éxito!</h2>
                <p style="margin-bottom: 2rem;">Tu orden ha sido creada con exito. Haz click aqui para ver el estado de tu orden!</p>
                <a href="/orders" style="display: inline-block; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-weight: bold; background-color: var(--primary-green); color: var(--white);">Ver Mis Órdenes</a>
            </div>
        `;
        resume.style.display = 'none'; // Hide the resume button
        totalElement.style.display = 'none'; 
        checkoutBtn.style.display = 'none';

    } else if (!cart || cart.length === 0) {
        // If the cart is genuinely empty (not after a purchase)
        itemsContainer.innerHTML = '<p>Tu carrito de compras está vacío.</p>';
        totalElement.textContent = 'Total: $0.00';
        checkoutBtn.disabled = true;
        checkoutBtn.style.backgroundColor = '#9ca3af';

    } else {
        // If there are items in the cart, display them
        let total = 0;

        // For each product found in the local storage creates a div inside of the parent elemnt
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            const rowTotal = item.price * item.quantity;
            itemElement.classList.add('checkout-item');
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div>
                    <h4>${item.name}</h4>
                    <p>Cantidad: ${item.quantity}</p>
                </div>
            <p style="margin-left: auto; font-weight: bold;">$${rowTotal.toFixed(2)}</p>
            `;
            itemsContainer.appendChild(itemElement);

            // total price logic
            total += rowTotal; //total = total + (item.price * item.quantity);
        });

        totalElement.textContent = `Total: $${total.toFixed(2)}`;

        checkoutBtn.addEventListener('click', async () => {
            if (!confirm('¿Estás seguro de que quieres finalizar tu compra?')) return;
        
            


            try {
                //POST request to create the order
                const { data } = await axios.post('/api/orders', 
                    {
                       
                        cart: cart,
                        total: total, 
                      
                    },
                    { withCredentials: true }
                );
    
                createNotification(false, data.message);

              
                // Generate the PDF invoice
                generateInvoicePDF(cart, total);
                localStorage.removeItem('shoppingCart');
                
                setTimeout(() => {
                    window.location.href = '/checkout?status=success';
                }, 3000);

            } catch (error) {
               
                const errorMessage = error.response?.data?.message || 'Error al crear la orden. Intenta de nuevo.';
                createNotification(true, errorMessage);
            }


           
        });
    }
});