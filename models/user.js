// src/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  passwordHash: String,
  phoneNumber: String,
  verified: {
    type: Boolean,
    default: false
  },
  
  registration_date: { type: Date, default: Date.now },
  last_login: Date,
  role: { type: String, enum: ['client', 'admin'], default: 'client' }
});

module.exports = mongoose.model('User', userSchema);


// Additional fields that could be included in the user schema in later versions:
///////////////////////////////
// address: {
//   city: String,
//   municipality: String,
//   state: String,
//   zip_code: String
// },
///////////////////////////////
