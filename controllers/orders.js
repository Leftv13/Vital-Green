// controllers/orders.js

const express = require('express');
const Order = require('../models/order');
const orderRouter = express.Router();
const { protect } = require('../middleware/auth');

// GET all orders (for admin or user)
orderRouter.get('/', protect, async (req, res) => {
  try {
    const allOrders = {};
    //If the user that sent the request is an admin, fetch all orders
    //else fetch only the orders of the user
    if (req.user.role !== 'admin') {
      allOrders.user_id = req.user._id;
    } 
    const orders = await Order.find(allOrders).populate('user_id', 'name').sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error interno del servidor al obtener las órdenes' });
  }
});

// GET a single order by id and shows it to the user in the modal
orderRouter.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    return res.json(order);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error interno del servidor al obtener la orden' });
  }
});

// POST a new order
orderRouter.post('/', protect, async (req, res) => {
  const { cart, total } = req.body;

  try {
    const order = new Order({
      user_id: req.user._id,
      products: cart.map(item => ({
        product_id: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total_price: item.quantity * item.price,
      })),
      total: total
    });

    await order.save();
    return res.status(201).json({ message: 'Orden creada exitosamente', order });
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