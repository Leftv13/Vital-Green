// src/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  phoneNumber: String,
  verified: {
    type: Boolean,
    default: false
  },
  address: {
    city: String,
    municipality: String,
    state: String,
    zip_code: String
  },
  registration_date: { type: Date, default: Date.now },
  last_login: Date,
  role: { type: String, enum: ['client', 'admin'], default: 'admin' }
});

module.exports = mongoose.model('User', userSchema);