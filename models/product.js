// src/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  ingredients: [String],
  price: { type: Number, required: true },
  weight_g: Number,
  stock: { type: Number, default: 0 },
  image_url: String,
  category: String,
  is_available: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);

//average_rating: { type: Number, default: 0 },
//num_reviews: { type: Number, default: 0 }
//volume_ml: Number,
//description: String