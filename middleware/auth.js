// src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/user'); 


// Middleware for preventing clients from accessing the admin page
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


    //If the user exists and has the admin role proceed to the admin page
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
          confirm('No tienes acceso, por favor inicia sesión') 
            res.redirect('/login');         
           return;
      }

      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decoded.id);
      request.user = user;      
      next();

  } catch (error) {

     res.redirect('/login'); 
    res.status(403).json({ message: 'No autorizado, error al verificar' });  
    return;    
  }    
};

// Middleware to optionally check for a user without blocking the request
//only used on the store so non users can check it
const checkUser = async (req, res, next) => {
  const token = req.cookies?.accessToken;

  // If no token is present, just continue as a guest
  if (!token) {
    return next();
  }

  try {
    // If a token exists, verify it
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded.id).select('-passwordHash');

    // If user is found, attach it to the request object
    if (user) {
      req.user = user;
    }
  } catch (error) {
    // If token is invalid or expired, we ignore it and proceed as a guest
  }
  next();
};

module.exports = { protect, protectAdminView, checkUser };