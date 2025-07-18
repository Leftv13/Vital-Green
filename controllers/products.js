// controllers/products.js

const express = require('express');
const Product = require('../models/product'); 
const productRouter = express.Router(); 
const { protect } = require('../middleware/auth')


//GET
productRouter.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    return res.json(products); 
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error interno del servidor al obtener productos' });
  }
});

// GET a single product by id and shows it to the user in the form (used for PUT)
productRouter.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    return res.json(product);
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    return res.status(500).json({ message: 'Error interno del servidor al obtener el producto' });
  }
});

//POST
productRouter.post('/', protect, async (req, res) => {
  const { name, price, image_url, description, stock} = req.body; 

  if (!name || !price || !image_url || !description || stock === undefined || stock === null){ 
    return res.status(400).json({ message: 'Campos obligatorios faltantes!' });
  }

  try {
    const product = new Product({

      name,
      price,
      description,
      stock,
      image_url,

    });

    const createdProduct = await product.save();
    return res.status(201).json({ message: "¡Producto creado con éxito!"}); 

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error interno del servidor al crear el producto', error: error.message });
  }
});

// PUT Update a product by ID
productRouter.put('/:id', protect, async (req, res) => {
  const { name, price, image_url, description, stock } = req.body;

 
  if (!name || !price || !image_url || !description || stock === undefined || stock === null) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }

  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }


    //Changes the original values according to the Ones in the inputs
    
    product.name = name;
    product.price = price;
    product.image_url = image_url;
    product.description = description;
    product.stock = stock;
   

    const updatedProduct = await product.save(); //saves the product
    return res.json({ message: 'Producto actualizado con exito!', product: updatedProduct });
  } catch (error) {
    return res.status(500).json({ message: 'Error interno del servidor al actualizar el producto', error: error.message });
  }
});



//DELETE
productRouter.delete('/:id', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne(); 
      return res.json({ message: 'Producto eliminado' });
    } else {
      return res.status(404).json({ message: 'Producto no encontrado' }); 
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error interno del servidor al eliminar el producto' }); 
  }
});


module.exports = productRouter;