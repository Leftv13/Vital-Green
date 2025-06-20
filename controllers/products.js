// controllers/products.js

const express = require('express');
const Product = require('../models/product'); 
const { protect, authorizeAdmin } = require('../middleware/auth'); 
const router = express.Router(); 

// ==============  Controller logic (Funtions) ==================
//Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor al obtener productos' });
  }
};

//Get products by id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor al obtener el producto' });
  }
};

//Creating a new product
const createProduct = async (req, res) => {
  const { name, ingredients, price, weight_g, stock, image_url, category } = req.body;

  if (!name || !price || !stock || !category) {
    return res.status(400).json({ message: 'Campos obligatorios faltantes!' });
  }

  try {
    const product = new Product({
      name,
      ingredients,
      price,
      weight_g,
      stock,
      image_url,
      category,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor al crear el producto', error: error.message });
  }
};

// update a product

const updateProduct = async (req, res) => {
  const { name, ingredients, price, weight_g, stock, image_url, category, is_available } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.ingredients = ingredients || product.ingredients;
      product.price = price || product.price;
      product.weight_g = weight_g || product.weight_g;
      product.stock = stock !== undefined ? stock : product.stock;
      product.image_url = image_url || product.image_url;
      product.category = category || product.category;
      product.is_available = is_available !== undefined ? is_available : product.is_available;
      product.updated_at = Date.now();

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor al actualizar el producto', error: error.message });
  }
};

//Deleting a product

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Producto eliminado' });
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor al eliminar el producto' });
  }
};

// ============== Route definition (Using the router) ==================

//  public routes for users (for anyone to read, but not to use crud methods)
router.get('/', getProducts);
router.get('/:id', getProductById);

// private routes for admins (complete CRUD)
router.post('/', protect, authorizeAdmin, createProduct);
router.put('/:id', protect, authorizeAdmin, updateProduct);
router.delete('/:id', protect, authorizeAdmin, deleteProduct);

module.exports = router;