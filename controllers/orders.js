// controllers/orders.js

const express = require('express');
const Product = require('../models/product');
const Order = require('../models/order');
const orderRouter = express.Router();
const { protect } = require('../middleware/auth');

// GET all orders (for admin or user)
orderRouter.get('/', protect, async (req, res) => {
  try {
    //create an empty object to hold the orders
    const allOrders = {};

    //If the user that sent the request is an admin, fetch all orders
    //else fetch only the orders of the user, and fills the allOrders object with the user_id orders
    if (req.user.role !== 'admin') {
      allOrders.user_id = req.user._id;
    } 
    const orders = await Order.find(allOrders).populate('user_id', 'name').sort({ createdAt: -1 }); // .populate is used to replace the user_id with the actual user object, 
    return res.json(orders);                                                                        //  and name is the field we want to show from the user object
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error interno del servidor al obtener las órdenes' });
  }
});

// GET a single order by id and shows it to the user in the modal
orderRouter.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    return res.json(order);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error interno del servidor al obtener la orden' });
  }
});

// POST a new order
orderRouter.post('/', protect, async (req, res) => {
  const { cart, total } = req.body;

  if (!cart || cart.length === 0) {
    return res.status(400).json({ message: 'El carrito no puede estar vacío.' });
  }

  try {
    // Verify if theres stock
    for (const item of cart) {
      const productInDB = await Product.findById(item._id);
      if (!productInDB) {
        return res.status(404).json({ message: `El producto '${item.name}' ya no está disponible.` });
      }
      if (productInDB.stock < item.quantity) {
        return res.status(400).json({
          message: `Stock insuficiente para '${productInDB.name}'. Solo quedan ${productInDB.stock} unidades.`
        });
      }
    }

    // If all products are available, proceed to update stock
    for (const item of cart) {
      await Product.findByIdAndUpdate(item._id, {
        $inc: { stock: -item.quantity } // Decrease stock by the quantity ordered, $inc is used to decrement a field
      });
    }

    // Create the order
    const order = new Order({
      user_id: req.user._id,
      products: cart.map(item => ({  //.map does the same as forEach but returns a new array with the actual values 
        product_id: item._id,          
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total_price: item.quantity * item.price 
      })),
      total: total
    });

    await order.save();
    return res.status(201).json({ message: '¡Orden creada exitosamente! Se esta descargando el recibo..', order });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error interno del servidor al crear la orden' });
  }
});

// PUT update order status (Admin only)
orderRouter.put('/:id', protect, async (req, res) => {
   const orderId = req.params.id;
   const { status } = req.body; 

  try {
  const order = await Order.findByIdAndUpdate( orderId, { status } );  
  return res.json({ message: 'Estado de la orden actualizado.', order });

  } catch (error) {
  console.error(error);
  return res.status(500).json({ message: 'Error interno del servidor al actualizar la orden' });

  }
  });

module.exports = orderRouter;