// src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/user'); 


// Middleware for preventing clients accessing the adming page
const protectAdminView = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;

    // If theres no token, redirect to the login page
    if (!token) {
      return res.redirect('/login');
    }
    //verify that the token exists and is signed by our .env
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded.id);

    //If the user exists and its role is admin proceed to the admin page
    if (user && user.role === 'admin') {
      return next();
    } else {
      // else redirect to the store
      return res.redirect('/store');
      
    }
  } catch (error) {
    //if theres any errors redirect to the login page
    return res.redirect('/login');
  }
};

//spare middleware
const protect = async (request, res, next) =>{
  try {
      const token = request.cookies?.accessToken;

      if(!token){
          return res.status(401).json({ message: 'No autorizado, no hay token' });
      }

      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decoded.id);
      request.user = user;
      
  } catch (error) {
      
     return res.status(403).json({ message: 'No autorizado, error al verificar' });


  }    
  next();
};


module.exports = { protect, protectAdminView };