// src/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  stock: { type: Number, default: 0 },
  image_url: String,
  is_available: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});



module.exports = mongoose.model('Product', productSchema);


//Additional fields that could be included in the product schema in later versions:
/////////////////////////////////////////////////
//average_rating: { type: Number, default: 0 },
//num_reviews: { type: Number, default: 0 }
//volume_ml: Number,
//description: String
// weight_g: Number,
// ingredients: [String],
/////////////////////////////////////////////////